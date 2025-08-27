// Enhanced COA Document Upload Function
// Optimized for faster upload speeds with efficient processing

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
        const { fileData, fileName, coaId } = requestData;

        if (!fileData || !fileName) {
            throw new Error('File data and filename are required');
        }

        // Validate file type
        if (!fileName.toLowerCase().endsWith('.pdf')) {
            throw new Error('Only PDF files are allowed');
        }

        // Generate unique filename with timestamp and UUID
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const uniqueId = crypto.randomUUID().slice(0, 8);
        const uniqueFilename = `coa-${timestamp}-${uniqueId}.pdf`;
        
        // Extract and process base64 data more efficiently
        let base64Data: string;
        let mimeType: string;
        
        if (fileData.startsWith('data:')) {
            const [headerPart, dataPart] = fileData.split(',');
            mimeType = headerPart.split(';')[0].split(':')[1];
            base64Data = dataPart;
        } else {
            // Assume it's already base64 encoded
            base64Data = fileData;
            mimeType = 'application/pdf';
        }
        
        // Validate file size before processing (estimate from base64)
        const estimatedSize = (base64Data.length * 3) / 4;
        if (estimatedSize > 52428800) { // 50MB limit
            throw new Error('File size exceeds 50MB limit');
        }
        
        // Convert base64 to Uint8Array using efficient method
        const binaryData = new Uint8Array(atob(base64Data).split('').map(c => c.charCodeAt(0)));
        
        // Upload to Supabase Storage with optimized headers
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/coa-documents/${uniqueFilename}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey,
                'Content-Type': mimeType,
                'Content-Length': binaryData.length.toString(),
                'x-upsert': 'false', // Don't overwrite existing files
                'Cache-Control': 'max-age=31536000' // 1 year cache
            },
            body: binaryData
        });
        
        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Storage upload error:', errorText);
            throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
        }
        
        // Get public URL
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/coa-documents/${uniqueFilename}`;
        
        // If coaId is provided, update the COA record using our new management function
        if (coaId) {
            try {
                const updateResponse = await fetch(`${supabaseUrl}/functions/v1/coa-management?action=update&id=${coaId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseServiceKey}`,
                        'apikey': supabaseServiceKey
                    },
                    body: JSON.stringify({
                        pdf_url: publicUrl
                    })
                });
                
                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    console.warn('COA update warning:', errorText);
                    // Don't fail the upload if just the database update fails
                }
            } catch (error) {
                console.warn('COA update failed:', error);
                // Continue with successful file upload
            }
        }
        
        return new Response(JSON.stringify({ 
            data: {
                url: publicUrl,
                filename: uniqueFilename,
                originalName: fileName,
                mimeType: mimeType,
                fileSize: binaryData.length,
                uploadedAt: new Date().toISOString()
            },
            message: 'PDF uploaded successfully'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('COA document upload error:', error);
        return new Response(
            JSON.stringify({ 
                error: { 
                    code: 'UPLOAD_FAILED',
                    message: error.message || 'Failed to upload COA document'
                } 
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});