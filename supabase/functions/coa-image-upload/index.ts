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
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables');
        }

        const requestData = await req.json();
        const { imageData, fileName, altText, coaId } = requestData;

        if (!imageData || !fileName) {
            throw new Error('Image data and filename are required');
        }

        // Generate unique filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileExtension = fileName.split('.').pop();
        const uniqueFilename = `coa-images/${timestamp}-${crypto.randomUUID()}.${fileExtension}`;
        
        // Extract base64 data from data URL
        const base64Data = imageData.split(',')[1];
        const mimeType = imageData.split(';')[0].split(':')[1];
        
        // Convert base64 to binary
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Upload to Supabase Storage
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/coa-images/${uniqueFilename}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey,
                'Content-Type': mimeType
            },
            body: binaryData
        });
        
        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Storage upload error:', errorText);
            throw new Error(`Upload failed: ${errorText}`);
        }
        
        // Get public URL
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/coa-images/${uniqueFilename}`;
        
        // Return image data
        const imageResult = {
            id: crypto.randomUUID(),
            url: publicUrl,
            alt: altText || '',
            filename: uniqueFilename,
            originalName: fileName,
            mimeType: mimeType,
            fileSize: binaryData.length,
            uploadedAt: new Date().toISOString()
        };
        
        return new Response(JSON.stringify({ data: imageResult }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('COA image upload error:', error);
        return new Response(
            JSON.stringify({ error: { message: error.message } }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});