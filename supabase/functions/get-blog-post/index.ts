Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const postSlug = pathSegments[pathSegments.length - 1];

        if (!postSlug) {
            throw new Error('Post slug is required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Fetch the blog post by slug
        const postResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?slug=eq.${postSlug}&is_published=eq.true&select=*`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!postResponse.ok) {
            const errorText = await postResponse.text();
            throw new Error(`Failed to fetch blog post: ${errorText}`);
        }

        const posts = await postResponse.json();
        if (!posts || posts.length === 0) {
            return new Response(JSON.stringify({
                error: {
                    code: 'POST_NOT_FOUND',
                    message: 'Blog post not found'
                }
            }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const post = posts[0];

        // Get category information
        const categoryResponse = await fetch(`${supabaseUrl}/rest/v1/blog_categories?id=eq.${post.category_id}&select=name,slug`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });
        
        const categoryData = await categoryResponse.json();
        const category = categoryData && categoryData.length > 0 ? categoryData[0] : { name: 'Uncategorized', slug: 'uncategorized' };

        // Get tags for this post
        const tagsResponse = await fetch(`${supabaseUrl}/rest/v1/blog_post_tags?post_id=eq.${post.id}&select=tag_id`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });
        
        const tagLinks = await tagsResponse.json();
        const tags = [];
        
        for (const tagLink of tagLinks || []) {
            const tagResponse = await fetch(`${supabaseUrl}/rest/v1/blog_tags?id=eq.${tagLink.tag_id}&select=name,slug`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            });
            
            const tagData = await tagResponse.json();
            if (tagData && tagData.length > 0) {
                tags.push(tagData[0].name);
            }
        }

        // Increment view count
        await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${post.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                view_count: (post.view_count || 0) + 1
            })
        });

        // Get related posts (same category, excluding current post)
        const relatedResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?category_id=eq.${post.category_id}&is_published=eq.true&id=not.eq.${post.id}&limit=3&select=id,title,slug,excerpt,featured_image_url,published_at,read_time`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        const relatedPosts = await relatedResponse.json() || [];

        const postWithDetails = {
            ...post,
            category: category.slug,
            category_name: category.name,
            tags: tags,
            view_count: (post.view_count || 0) + 1
        };

        return new Response(JSON.stringify({
            data: {
                post: postWithDetails,
                relatedPosts: relatedPosts
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get blog post error:', error);

        const errorResponse = {
            error: {
                code: 'BLOG_POST_FETCH_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});