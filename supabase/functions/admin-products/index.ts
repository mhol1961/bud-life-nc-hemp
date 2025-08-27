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
    
    // Import supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { method, productData, productId } = await req.json();

    let result;
    switch (method) {
      case 'CREATE':
        const { data: createData, error: createError } = await supabaseAdmin
          .from('products')
          .insert([productData])
          .select()
          .single();
        
        if (createError) throw createError;
        result = createData;
        break;

      case 'UPDATE':
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('products')
          .update({ ...productData, updated_at: new Date().toISOString() })
          .eq('id', productId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        result = updateData;
        break;

      case 'DELETE':
        const { error: deleteError } = await supabaseAdmin
          .from('products')
          .delete()
          .eq('id', productId);
        
        if (deleteError) throw deleteError;
        result = { success: true };
        break;

      default:
        throw new Error('Invalid method');
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin products error:', error);
    return new Response(
      JSON.stringify({ error: { message: error.message } }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});