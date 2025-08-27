Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        // Create a simple test image
        const testImage = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68, 65, 84, 8, 215, 99, 248, 15, 0, 1, 1, 1, 0, 24, 221, 141, 219, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
        
        // Test different upload methods
        const testFileName = `test-${Date.now()}.png`;
        
        // Method 1: Standard upload
        const uploadResponse1 = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${testFileName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'image/png'
            },
            body: testImage
        });
        const uploadText1 = await uploadResponse1.text();
        
        // Method 2: With cache control and upsert
        const uploadResponse2 = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${testFileName}-v2`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'image/png',
                'cache-control': '3600',
                'x-upsert': 'true'
            },
            body: testImage
        });
        const uploadText2 = await uploadResponse2.text();
        
        return new Response(JSON.stringify({ 
            method1: {
                status: uploadResponse1.status,
                response: uploadText1.substring(0, 200)
            },
            method2: {
                status: uploadResponse2.status,
                response: uploadText2.substring(0, 200)
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message, stack: error.stack }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});