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
        
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const requestData = await req.json();
        const { method } = requestData;

        let result;
        
        switch (method) {
            case 'CREATE':
                result = await handleCreate(supabaseAdmin, requestData);
                break;
                
            case 'UPDATE':
                result = await handleUpdate(supabaseAdmin, requestData);
                break;
                
            case 'ARCHIVE':
                result = await handleArchive(supabaseAdmin, requestData);
                break;
                
            case 'RESTORE':
                result = await handleRestore(supabaseAdmin, requestData);
                break;
                
            case 'BULK_UPDATE':
                result = await handleBulkUpdate(supabaseAdmin, requestData);
                break;
                
            case 'BULK_ARCHIVE':
                result = await handleBulkArchive(supabaseAdmin, requestData);
                break;
                
            case 'TOGGLE_VISIBILITY':
                result = await handleToggleVisibility(supabaseAdmin, requestData);
                break;
                
            case 'PUBLISH':
                result = await handlePublish(supabaseAdmin, requestData);
                break;
                
            case 'UNPUBLISH':
                result = await handleUnpublish(supabaseAdmin, requestData);
                break;
                
            case 'GET_VARIANTS':
                result = await handleGetVariants(supabaseAdmin, requestData);
                break;
                
            case 'CREATE_VARIANT':
                result = await handleCreateVariant(supabaseAdmin, requestData);
                break;
                
            case 'UPDATE_VARIANT':
                result = await handleUpdateVariant(supabaseAdmin, requestData);
                break;
                
            case 'DELETE_VARIANT':
                result = await handleDeleteVariant(supabaseAdmin, requestData);
                break;
                
            default:
                throw new Error('Invalid method');
        }

        return new Response(JSON.stringify({ data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Admin products enhanced error:', error);
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
async function handleCreate(supabase: any, { productData, variants = [] }: any) {
    // Start transaction-like operations
    const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
            ...productData,
            publish_status: 'draft', // New products start as draft
            visibility_status: 'visible',
            archived: false
        }])
        .select()
        .single();
    
    if (productError) throw productError;
    
    // Create variants if provided
    if (variants && variants.length > 0) {
        const variantData = variants.map((variant: any) => ({
            ...variant,
            product_id: product.id
        }));
        
        const { error: variantError } = await supabase
            .from('product_variants')
            .insert(variantData);
        
        if (variantError) {
            console.error('Variant creation failed:', variantError);
        }
    }
    
    return product;
}

async function handleUpdate(supabase: any, { productId, productData, variants = [] }: any) {
    const { data: product, error: productError } = await supabase
        .from('products')
        .update({ ...productData, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .select()
        .single();
    
    if (productError) throw productError;
    
    // Handle variants update if provided
    if (variants && variants.length >= 0) {
        // Delete existing variants
        await supabase
            .from('product_variants')
            .delete()
            .eq('product_id', productId);
        
        // Insert new variants
        if (variants.length > 0) {
            const variantData = variants.map((variant: any) => ({
                ...variant,
                product_id: productId
            }));
            
            await supabase
                .from('product_variants')
                .insert(variantData);
        }
    }
    
    return product;
}

async function handleArchive(supabase: any, { productId }: any) {
    const { data, error } = await supabase
        .from('products')
        .update({ 
            archived: true,
            visibility_status: 'hidden',
            updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

async function handleRestore(supabase: any, { productId }: any) {
    const { data, error } = await supabase
        .from('products')
        .update({ 
            archived: false,
            visibility_status: 'visible',
            updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

async function handleBulkUpdate(supabase: any, { productIds, updateData }: any) {
    const { data, error } = await supabase
        .from('products')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .in('id', productIds)
        .select();
    
    if (error) throw error;
    return data;
}

async function handleBulkArchive(supabase: any, { productIds }: any) {
    const { data, error } = await supabase
        .from('products')
        .update({ 
            archived: true,
            visibility_status: 'hidden',
            updated_at: new Date().toISOString()
        })
        .in('id', productIds)
        .select();
    
    if (error) throw error;
    return data;
}

async function handleToggleVisibility(supabase: any, { productId }: any) {
    // Get current visibility
    const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('visibility_status')
        .eq('id', productId)
        .single();
    
    if (fetchError) throw fetchError;
    
    const newVisibility = currentProduct.visibility_status === 'visible' ? 'hidden' : 'visible';
    
    const { data, error } = await supabase
        .from('products')
        .update({ 
            visibility_status: newVisibility,
            updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

async function handlePublish(supabase: any, { productId }: any) {
    const { data, error } = await supabase
        .from('products')
        .update({ 
            publish_status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

async function handleUnpublish(supabase: any, { productId }: any) {
    const { data, error } = await supabase
        .from('products')
        .update({ 
            publish_status: 'draft',
            published_at: null,
            updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

async function handleGetVariants(supabase: any, { productId }: any) {
    const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data;
}

async function handleCreateVariant(supabase: any, { variantData }: any) {
    const { data, error } = await supabase
        .from('product_variants')
        .insert([variantData])
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

async function handleUpdateVariant(supabase: any, { variantId, variantData }: any) {
    const { data, error } = await supabase
        .from('product_variants')
        .update({ ...variantData, updated_at: new Date().toISOString() })
        .eq('id', variantId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

async function handleDeleteVariant(supabase: any, { variantId }: any) {
    const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);
    
    if (error) throw error;
    return { success: true };
}