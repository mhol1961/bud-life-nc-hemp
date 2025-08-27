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
    const { mediaData, fileName, mediaType, altText, title, description } = await req.json();

    if (!mediaData || !fileName) {
      throw new Error('Media data and filename are required');
    }

    // Get the service role key and URL
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authentication required');
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token and get user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': serviceRoleKey
      }
    });

    if (!userResponse.ok) {
      throw new Error('Invalid authentication token');
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    // Extract base64 data from data URL
    const base64Data = mediaData.split(',')[1];
    const mimeType = mediaData.split(';')[0].split(':')[1];

    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const storedPath = `uploads/${uniqueFileName}`;

    // Upload to Supabase Storage
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/cms-media/${storedPath}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: binaryData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Media upload failed: ${errorText}`);
    }

    // Get public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/cms-media/${storedPath}`;

    // Get image dimensions if it's an image
    let width = null;
    let height = null;
    if (mimeType.startsWith('image/')) {
      try {
        // For a production system, you'd want to use an image processing library
        // For now, we'll leave dimensions null and handle client-side
        width = null;
        height = null;
      } catch (e) {
        console.log('Could not extract image dimensions:', e.message);
      }
    }

    // Save media metadata to database
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/cms_media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        original_filename: fileName,
        stored_filename: uniqueFileName,
        file_path: storedPath,
        file_size: binaryData.length,
        mime_type: mimeType,
        width: width,
        height: height,
        alt_text: altText || '',
        title: title || fileName,
        description: description || '',
        uploaded_by: userId,
        is_public: true
      })
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      // Try to clean up uploaded file
      try {
        await fetch(`${supabaseUrl}/storage/v1/object/cms-media/${storedPath}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`
          }
        });
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded file:', cleanupError.message);
      }
      throw new Error(`Database insert failed: ${errorText}`);
    }

    const mediaRecord = await insertResponse.json();

    return new Response(JSON.stringify({
      data: {
        id: mediaRecord[0].id,
        publicUrl,
        fileName: uniqueFileName,
        originalFileName: fileName,
        mimeType,
        fileSize: binaryData.length,
        media: mediaRecord[0]
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('CMS media upload error:', error);

    const errorResponse = {
      error: {
        code: 'CMS_MEDIA_UPLOAD_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
