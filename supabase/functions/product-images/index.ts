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
        const { method } = requestData;

        let result;
        
        switch (method) {
            case 'UPLOAD_IMAGE':
                result = await handleImageUpload(supabaseUrl, supabaseServiceKey, requestData);
                break;
                
            case 'DELETE_IMAGE':
                result = await handleImageDelete(supabaseUrl, supabaseServiceKey, requestData);
                break;
                
            case 'REORDER_IMAGES':
                result = await handleImageReorder(supabaseUrl, supabaseServiceKey, requestData);
                break;
                
            case 'UPDATE_PRIMARY_IMAGE':
                result = await handlePrimaryImageUpdate(supabaseUrl, supabaseServiceKey, requestData);
                break;
                
            case 'BULK_UPLOAD':
                result = await handleBulkImageUpload(supabaseUrl, supabaseServiceKey, requestData);
                break;
                
            default:
                throw new Error('Invalid method');
        }

        return new Response(JSON.stringify({ data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Product images error:', error);
        return new Response(
            JSON.stringify({ error: { message: error.message } }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});

// Helper functions
async function handleImageUpload(supabaseUrl: string, serviceKey: string, { productId, imageData, filename, altText }: any) {
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `${productId}/${timestamp}-${crypto.randomUUID()}.${fileExtension}`;
    
    // Extract base64 data from data URL
    const base64Data = imageData.split(',')[1];
    const mimeType = imageData.split(';')[0].split(':')[1];
    
    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${uniqueFilename}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
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
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${uniqueFilename}`;
    
    // Get current product images using direct database query
    const productResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}&select=images,primary_image_url`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Content-Type': 'application/json'
        }
    });
    
    if (!productResponse.ok) {
        throw new Error('Failed to fetch product data');
    }
    
    const products = await productResponse.json();
    const product = products[0];
    
    if (!product) {
        throw new Error('Product not found');
    }
    
    // Add new image to array
    const currentImages = product.images || [];
    const newImage = {
        url: publicUrl,
        alt: altText || '',
        filename: uniqueFilename,
        order: currentImages.length,
        uploadedAt: new Date().toISOString()
    };
    
    const updatedImages = [...currentImages, newImage];
    const primaryImageUrl = product.primary_image_url || publicUrl; // Set as primary if first image
    
    // Update product with new images using direct database update
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            images: updatedImages,
            primary_image_url: primaryImageUrl,
            updated_at: new Date().toISOString()
        })
    });
    
    if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Product update error:', errorText);
        throw new Error(`Failed to update product: ${errorText}`);
    }
    
    const updatedProducts = await updateResponse.json();
    const updatedProduct = updatedProducts[0];
    
    return {
        image: newImage,
        product: updatedProduct
    };
}

async function handleImageDelete(supabaseUrl: string, serviceKey: string, { productId, imageUrl }: any) {
    // Get current product images using direct database query
    const productResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}&select=images,primary_image_url`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Content-Type': 'application/json'
        }
    });
    
    if (!productResponse.ok) {
        throw new Error('Failed to fetch product data');
    }
    
    const products = await productResponse.json();
    const product = products[0];
    
    if (!product) {
        throw new Error('Product not found');
    }
    
    const currentImages = product.images || [];
    const updatedImages = currentImages.filter((img: any) => img.url !== imageUrl);
    
    // Update primary image if it was deleted
    let newPrimaryImageUrl = product.primary_image_url;
    if (product.primary_image_url === imageUrl) {
        newPrimaryImageUrl = updatedImages.length > 0 ? updatedImages[0].url : null;
    }
    
    // Update product using direct database update
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            images: updatedImages,
            primary_image_url: newPrimaryImageUrl,
            updated_at: new Date().toISOString()
        })
    });
    
    if (!updateResponse.ok) {
        throw new Error('Failed to update product');
    }
    
    const updatedProducts = await updateResponse.json();
    const updatedProduct = updatedProducts[0];
    
    // Delete from storage (extract filename from URL)
    const filename = imageUrl.split('/product-images/')[1];
    if (filename) {
        await fetch(`${supabaseUrl}/storage/v1/object/product-images/${filename}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${serviceKey}`
            }
        });
    }
    
    return updatedProduct;
}

async function handleImageReorder(supabaseUrl: string, serviceKey: string, { productId, orderedImages }: any) {
    // Update the order field for each image
    const reorderedImages = orderedImages.map((img: any, index: number) => ({
        ...img,
        order: index
    }));
    
    // Update product using direct database update
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            images: reorderedImages,
            updated_at: new Date().toISOString()
        })
    });
    
    if (!updateResponse.ok) {
        throw new Error('Failed to update product');
    }
    
    const updatedProducts = await updateResponse.json();
    return updatedProducts[0];
}

async function handlePrimaryImageUpdate(supabaseUrl: string, serviceKey: string, { productId, primaryImageUrl }: any) {
    // Update product using direct database update
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            primary_image_url: primaryImageUrl,
            updated_at: new Date().toISOString()
        })
    });
    
    if (!updateResponse.ok) {
        throw new Error('Failed to update product');
    }
    
    const updatedProducts = await updateResponse.json();
    return updatedProducts[0];
}

async function handleBulkImageUpload(supabaseUrl: string, serviceKey: string, { productId, images }: any) {
    const uploadedImages = [];
    
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
            const result = await handleImageUpload(supabaseUrl, serviceKey, {
                productId,
                imageData: image.data,
                filename: image.filename,
                altText: image.altText || ''
            });
            uploadedImages.push(result.image);
        } catch (error) {
            console.error(`Failed to upload image ${image.filename}:`, error);
            // Continue with other images
        }
    }
    
    // Get final product state using direct database query
    const productResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Content-Type': 'application/json'
        }
    });
    
    if (!productResponse.ok) {
        throw new Error('Failed to fetch updated product');
    }
    
    const products = await productResponse.json();
    const product = products[0];
    
    return {
        uploadedImages,
        product
    };
}