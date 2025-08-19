Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Fetch all blog categories
        const categoriesResponse = await fetch(`${supabaseUrl}/rest/v1/blog_categories?select=*&order=name.asc`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!categoriesResponse.ok) {
            const errorText = await categoriesResponse.text();
            throw new Error(`Failed to fetch categories: ${errorText}`);
        }

        const categories = await categoriesResponse.json();

        // Fetch all blog tags
        const tagsResponse = await fetch(`${supabaseUrl}/rest/v1/blog_tags?select=*&order=name.asc`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!tagsResponse.ok) {
            const errorText = await tagsResponse.text();
            throw new Error(`Failed to fetch tags: ${errorText}`);
        }

        const tags = await tagsResponse.json();

        return new Response(JSON.stringify({
            data: {
                categories: categories || [],
                tags: tags || []
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get blog metadata error:', error);

        const errorResponse = {
            error: {
                code: 'BLOG_METADATA_FETCH_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});