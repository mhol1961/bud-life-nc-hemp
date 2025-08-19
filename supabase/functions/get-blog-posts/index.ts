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
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Build query for blog posts
        let query = `${supabaseUrl}/rest/v1/blog_posts?select=*&is_published=eq.true&order=published_at.desc&limit=${limit}&offset=${offset}`;
        
        // Add category filter if specified
        if (category && category !== 'all') {
            // First get category ID
            const categoryResponse = await fetch(`${supabaseUrl}/rest/v1/blog_categories?slug=eq.${category}&select=id`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            });
            
            const categoryData = await categoryResponse.json();
            if (categoryData && categoryData.length > 0) {
                query += `&category_id=eq.${categoryData[0].id}`;
            }
        }

        // Add search filter if specified
        if (search) {
            query += `&or=(title.ilike.*${search}*,excerpt.ilike.*${search}*,content.ilike.*${search}*)`;
        }

        // Fetch blog posts
        const response = await fetch(query, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch blog posts: ${errorText}`);
        }

        const posts = await response.json();

        // Get categories for each post
        const postsWithCategories = [];
        for (const post of posts) {
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

            postsWithCategories.push({
                ...post,
                category: category.slug,
                category_name: category.name,
                tags: tags
            });
        }

        // Get total count for pagination
        const countResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=count&is_published=eq.true`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'count=exact'
            }
        });
        
        const totalCount = countResponse.headers.get('Content-Range')?.split('/')[1] || '0';

        return new Response(JSON.stringify({
            data: {
                posts: postsWithCategories,
                pagination: {
                    page,
                    limit,
                    total: parseInt(totalCount),
                    totalPages: Math.ceil(parseInt(totalCount) / limit)
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get blog posts error:', error);

        const errorResponse = {
            error: {
                code: 'BLOG_POSTS_FETCH_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});