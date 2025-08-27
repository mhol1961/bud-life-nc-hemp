// Comprehensive COA Management Function
// Handles all COA operations: create, update, delete, with proper validation and error handling

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
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
      throw new Error('Supabase configuration missing');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';
    const coaId = url.searchParams.get('id');

    // Helper function to make authenticated requests
    const supabaseRequest = async (endpoint: string, options: any = {}) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Supabase ${options.method || 'GET'} ${endpoint} error:`, errorText);
        throw new Error(`Database operation failed: ${errorText}`);
      }

      return response.json();
    };

    // Helper function to find or create lab
    const findOrCreateLab = async (labName: string) => {
      if (!labName) return null;

      try {
        // Try to find existing lab
        const existingLabs = await supabaseRequest(`labs?name=eq.${encodeURIComponent(labName)}`);
        
        if (existingLabs && existingLabs.length > 0) {
          return existingLabs[0].id;
        }

        // Create new lab if not found
        const newLab = await supabaseRequest('labs', {
          method: 'POST',
          body: JSON.stringify({
            name: labName,
            is_active: true
          })
        });

        return newLab[0].id;
      } catch (error) {
        console.error('Error finding/creating lab:', error);
        return null;
      }
    };

    // Helper function to prepare COA data
    const prepareCOAData = async (formData: any) => {
      // Find or create lab if lab_name is provided
      let lab_id = formData.lab_id;
      if (!lab_id && formData.lab_name) {
        lab_id = await findOrCreateLab(formData.lab_name);
      }

      // Validate required fields
      const requiredFields = ['certificate_number', 'product_name', 'batch_number', 'test_date'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate date format
      if (formData.test_date && !isValidDate(formData.test_date)) {
        throw new Error('Invalid test_date format. Use YYYY-MM-DD format.');
      }

      // Prepare the COA data with proper type conversion
      return {
        certificate_number: formData.certificate_number,
        product_name: formData.product_name,
        batch_number: formData.batch_number,
        lab_id: lab_id,
        sample_id: formData.sample_id || null,
        test_date: formData.test_date,
        received_date: formData.received_date || null,
        completed_date: formData.completed_date || null,
        expiration_date: formData.expiration_date || null,
        
        // Convert percentage strings to numbers, handle empty strings
        thc_percentage: parseFloatOrNull(formData.thc_percentage),
        thca_percentage: parseFloatOrNull(formData.thca_percentage),
        cbd_percentage: parseFloatOrNull(formData.cbd_percentage),
        cbda_percentage: parseFloatOrNull(formData.cbda_percentage),
        cbg_percentage: parseFloatOrNull(formData.cbg_percentage),
        cbn_percentage: parseFloatOrNull(formData.cbn_percentage),
        cbc_percentage: parseFloatOrNull(formData.cbc_percentage),
        thcv_percentage: parseFloatOrNull(formData.thcv_percentage),
        cbdv_percentage: parseFloatOrNull(formData.cbdv_percentage),
        total_thc: parseFloatOrNull(formData.total_thc),
        total_cbd: parseFloatOrNull(formData.total_cbd),
        total_cannabinoids: parseFloatOrNull(formData.total_cannabinoids),
        
        // Safety test results
        pesticides_status: formData.pesticides_status || 'not_tested',
        heavy_metals_status: formData.heavy_metals_status || 'not_tested',
        microbials_status: formData.microbials_status || 'not_tested',
        mycotoxins_status: formData.mycotoxins_status || 'not_tested',
        residual_solvents_status: formData.residual_solvents_status || 'not_tested',
        
        // Physical properties
        moisture_content: parseFloatOrNull(formData.moisture_content),
        water_activity: parseFloatOrNull(formData.water_activity),
        
        // Status fields
        approval_status: formData.approval_status || 'pending',
        publish_status: formData.publish_status || 'draft',
        visibility_status: formData.visibility_status || 'visible',
        
        // Additional fields
        notes: formData.notes || null,
        pdf_url: formData.pdf_url || null,
        archived: formData.archived || false,
        images: formData.images || [],
        
        updated_at: new Date().toISOString()
      };
    };

    // Helper functions
    const parseFloatOrNull = (value: any) => {
      if (value === null || value === undefined || value === '') return null;
      const parsed = parseFloat(String(value));
      return isNaN(parsed) ? null : parsed;
    };

    const isValidDate = (dateString: string) => {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date.getTime());
    };

    // Handle different actions
    switch (action) {
      case 'create':
        if (req.method !== 'POST') {
          throw new Error('Create action requires POST method');
        }
        
        const createData = await req.json();
        const preparedCreateData = await prepareCOAData(createData);
        preparedCreateData.created_at = new Date().toISOString();
        
        const newCOA = await supabaseRequest('coa_certificates', {
          method: 'POST',
          body: JSON.stringify(preparedCreateData)
        });
        
        return new Response(JSON.stringify({
          success: true,
          data: newCOA[0],
          message: 'COA certificate created successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'update':
        if (req.method !== 'POST' && req.method !== 'PUT') {
          throw new Error('Update action requires POST or PUT method');
        }
        
        if (!coaId) {
          throw new Error('COA ID is required for update');
        }
        
        const updateData = await req.json();
        const preparedUpdateData = await prepareCOAData(updateData);
        
        const updatedCOA = await supabaseRequest(`coa_certificates?id=eq.${coaId}`, {
          method: 'PATCH',
          body: JSON.stringify(preparedUpdateData)
        });
        
        if (!updatedCOA || updatedCOA.length === 0) {
          throw new Error('COA not found or update failed');
        }
        
        return new Response(JSON.stringify({
          success: true,
          data: updatedCOA[0],
          message: 'COA certificate updated successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'get':
        if (!coaId) {
          throw new Error('COA ID is required');
        }
        
        const coa = await supabaseRequest(`coa_management_view?id=eq.${coaId}`);
        
        if (!coa || coa.length === 0) {
          throw new Error('COA not found');
        }
        
        return new Response(JSON.stringify({
          success: true,
          data: coa[0]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'list':
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const search = url.searchParams.get('search');
        const status = url.searchParams.get('status');
        
        const offset = (page - 1) * limit;
        
        let query = `coa_management_view?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`;
        
        if (status && status !== 'all') {
          query += `&approval_status=eq.${status}`;
        }
        
        if (search) {
          query += `&or=(product_name.ilike.*${search}*,batch_number.ilike.*${search}*,certificate_number.ilike.*${search}*,lab_name.ilike.*${search}*)`;
        }
        
        const coas = await supabaseRequest(query);
        
        // Get total count for pagination
        let countQuery = 'coa_certificates?select=count';
        const countFilters = [];
        if (status && status !== 'all') countFilters.push(`approval_status=eq.${status}`);
        if (search) countFilters.push(`or=(product_name.ilike.*${search}*,batch_number.ilike.*${search}*,certificate_number.ilike.*${search}*)`);
        if (countFilters.length > 0) countQuery += '&' + countFilters.join('&');
        
        const countResponse = await fetch(`${supabaseUrl}/rest/v1/${countQuery}`, {
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Prefer': 'count=exact'
          }
        });
        
        const totalCount = parseInt(countResponse.headers.get('content-range')?.split('/')[1] || '0');
        
        return new Response(JSON.stringify({
          success: true,
          data: {
            coas,
            pagination: {
              page,
              limit,
              total: totalCount,
              totalPages: Math.ceil(totalCount / limit)
            }
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'delete':
        if (req.method !== 'DELETE') {
          throw new Error('Delete action requires DELETE method');
        }
        
        if (!coaId) {
          throw new Error('COA ID is required for deletion');
        }
        
        await supabaseRequest(`coa_certificates?id=eq.${coaId}`, {
          method: 'DELETE'
        });
        
        return new Response(JSON.stringify({
          success: true,
          message: 'COA certificate deleted successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'archive':
        if (!coaId) {
          throw new Error('COA ID is required for archiving');
        }
        
        const archivedCOA = await supabaseRequest(`coa_certificates?id=eq.${coaId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            archived: true,
            updated_at: new Date().toISOString()
          })
        });
        
        return new Response(JSON.stringify({
          success: true,
          data: archivedCOA[0],
          message: 'COA certificate archived successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        throw new Error(`Invalid action: ${action}`);
    }

  } catch (error) {
    console.error('COA management error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: {
        code: 'COA_MANAGEMENT_ERROR',
        message: error.message || 'Failed to process COA operation'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});