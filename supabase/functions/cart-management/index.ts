Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { action, sessionId, productId, variantId, quantity, cartData } = await req.json();

        console.log('Cart management request:', { action, sessionId, productId, quantity });

        if (!action || !sessionId) {
            throw new Error('Action and session ID are required');
        }

        // Get Supabase credentials
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        let result;

        switch (action) {
            case 'GET_CART':
                // Get existing cart session
                const getResponse = await fetch(`${supabaseUrl}/rest/v1/cart_sessions?session_id=eq.${sessionId}&select=*`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!getResponse.ok) {
                    throw new Error('Failed to get cart data');
                }

                const cartSessions = await getResponse.json();
                const cartSession = cartSessions[0];

                result = {
                    data: {
                        sessionId: sessionId,
                        items: cartSession ? cartSession.cart_data : [],
                        totalItems: cartSession ? (cartSession.cart_data || []).reduce((sum, item) => sum + item.quantity, 0) : 0,
                        totalAmount: cartSession ? (cartSession.cart_data || []).reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0
                    }
                };
                break;

            case 'ADD_ITEM':
                if (!productId || !quantity || quantity <= 0) {
                    throw new Error('Valid product ID and quantity are required');
                }

                // Get current cart
                const currentResponse = await fetch(`${supabaseUrl}/rest/v1/cart_sessions?session_id=eq.${sessionId}&select=*`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                let currentCart = [];
                if (currentResponse.ok) {
                    const sessions = await currentResponse.json();
                    if (sessions.length > 0) {
                        currentCart = sessions[0].cart_data || [];
                    }
                }

                // Check if item already exists in cart
                const existingItemIndex = currentCart.findIndex(item => 
                    item.product_id === productId && (variantId ? item.variant_id === variantId : !item.variant_id)
                );

                if (existingItemIndex >= 0) {
                    // Update quantity
                    currentCart[existingItemIndex].quantity += quantity;
                } else {
                    // Add new item (need to get product details)
                    const productResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}&select=*`, {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!productResponse.ok) {
                        throw new Error('Product not found');
                    }

                    const products = await productResponse.json();
                    if (products.length === 0) {
                        throw new Error('Product not found');
                    }

                    const product = products[0];
                    let variant = null;

                    if (variantId) {
                        const variantResponse = await fetch(`${supabaseUrl}/rest/v1/product_variants?id=eq.${variantId}&select=*`, {
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (variantResponse.ok) {
                            const variants = await variantResponse.json();
                            variant = variants[0] || null;
                        }
                    }

                    const newItem = {
                        product_id: productId,
                        variant_id: variantId || null,
                        product_name: product.name,
                        variant_name: variant ? variant.name : null,
                        price: variant ? variant.price : product.price,
                        quantity: quantity,
                        product_image_url: product.image_url || null,
                        added_at: new Date().toISOString()
                    };

                    currentCart.push(newItem);
                }

                // Update cart session
                const updateData = {
                    session_id: sessionId,
                    cart_data: currentCart,
                    updated_at: new Date().toISOString()
                };

                const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/cart_sessions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    body: JSON.stringify(updateData)
                });

                if (!upsertResponse.ok) {
                    throw new Error('Failed to update cart');
                }

                result = {
                    data: {
                        sessionId: sessionId,
                        items: currentCart,
                        totalItems: currentCart.reduce((sum, item) => sum + item.quantity, 0),
                        totalAmount: currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                    }
                };
                break;

            case 'REMOVE_ITEM':
                if (!productId) {
                    throw new Error('Product ID is required');
                }

                // Get current cart
                const removeResponse = await fetch(`${supabaseUrl}/rest/v1/cart_sessions?session_id=eq.${sessionId}&select=*`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!removeResponse.ok) {
                    throw new Error('Failed to get cart');
                }

                const removeSessions = await removeResponse.json();
                if (removeSessions.length === 0) {
                    throw new Error('Cart not found');
                }

                let removeCart = removeSessions[0].cart_data || [];
                removeCart = removeCart.filter(item => 
                    !(item.product_id === productId && (variantId ? item.variant_id === variantId : !item.variant_id))
                );

                // Update cart
                const removeUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/cart_sessions?session_id=eq.${sessionId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cart_data: removeCart,
                        updated_at: new Date().toISOString()
                    })
                });

                if (!removeUpdateResponse.ok) {
                    throw new Error('Failed to update cart');
                }

                result = {
                    data: {
                        sessionId: sessionId,
                        items: removeCart,
                        totalItems: removeCart.reduce((sum, item) => sum + item.quantity, 0),
                        totalAmount: removeCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                    }
                };
                break;

            case 'CLEAR_CART':
                // Clear entire cart
                const clearResponse = await fetch(`${supabaseUrl}/rest/v1/cart_sessions?session_id=eq.${sessionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!clearResponse.ok) {
                    console.warn('Failed to delete cart session, may not exist');
                }

                result = {
                    data: {
                        sessionId: sessionId,
                        items: [],
                        totalItems: 0,
                        totalAmount: 0
                    }
                };
                break;

            default:
                throw new Error(`Unknown action: ${action}`);
        }

        console.log('Cart management completed:', action);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Cart management error:', error);

        const errorResponse = {
            error: {
                code: 'CART_MANAGEMENT_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});