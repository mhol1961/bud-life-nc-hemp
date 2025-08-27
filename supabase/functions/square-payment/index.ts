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
        const { amount, cartItems, customerEmail, shippingAddress, billingAddress, paymentToken } = await req.json();

        console.log('Square payment request received:', { amount, cartItemsCount: cartItems?.length });

        // Validate required parameters
        if (!amount || amount <= 0) {
            throw new Error('Valid amount is required');
        }

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            throw new Error('Cart items are required');
        }

        if (!paymentToken) {
            throw new Error('Payment token is required');
        }

        // Validate cart items structure
        for (const item of cartItems) {
            if (!item.product_id || !item.quantity || !item.price || !item.product_name) {
                throw new Error('Each cart item must have product_id, quantity, price, and product_name');
            }
            if (item.quantity <= 0 || item.price <= 0) {
                throw new Error('Cart item quantity and price must be positive');
            }
        }

        // Get environment variables
        const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
        const squareApplicationId = Deno.env.get('SQUARE_APPLICATION_ID');
        const squareEnvironment = Deno.env.get('SQUARE_ENVIRONMENT') || 'production';
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!squareAccessToken || !squareApplicationId) {
            console.error('Square credentials not found in environment');
            throw new Error('Square payment configuration missing');
        }

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Environment variables validated, processing Square payment...');

        // Calculate total amount from cart items to verify
        const calculatedAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (Math.abs(calculatedAmount - amount) > 0.01) {
            throw new Error('Amount mismatch: calculated amount does not match provided amount');
        }

        // Get user from auth header if provided
        let userId = null;
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
                const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': serviceRoleKey
                    }
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    userId = userData.id;
                    console.log('User identified:', userId);
                }
            } catch (error) {
                console.log('Could not get user from token:', error.message);
            }
        }

        // Generate unique idempotency key
        const idempotencyKey = crypto.randomUUID();
        
        // Convert amount to cents for Square API
        const amountInCents = Math.round(amount * 100);

        // Prepare Square payment request
        const squareApiUrl = squareEnvironment === 'production' 
            ? 'https://connect.squareup.com/v2/payments'
            : 'https://connect.squareupsandbox.com/v2/payments';

        const squarePaymentData = {
            source_id: paymentToken,
            idempotency_key: idempotencyKey,
            amount_money: {
                amount: amountInCents,
                currency: 'USD'
            },
            buyer_email_address: customerEmail || null,
            billing_address: billingAddress ? {
                address_line_1: billingAddress.address,
                locality: billingAddress.city,
                administrative_district_level_1: billingAddress.state,
                postal_code: billingAddress.zipCode,
                country: 'US',
                first_name: billingAddress.firstName,
                last_name: billingAddress.lastName
            } : null,
            shipping_address: shippingAddress ? {
                address_line_1: shippingAddress.address,
                locality: shippingAddress.city,
                administrative_district_level_1: shippingAddress.state,
                postal_code: shippingAddress.zipCode,
                country: 'US',
                first_name: shippingAddress.firstName,
                last_name: shippingAddress.lastName
            } : null,
            note: `Order with ${cartItems.length} items`
        };

        console.log('Making Square payment request...');

        // Create payment with Square
        const squareResponse = await fetch(squareApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${squareAccessToken}`,
                'Content-Type': 'application/json',
                'Square-Version': '2023-10-18'
            },
            body: JSON.stringify(squarePaymentData)
        });

        console.log('Square API response status:', squareResponse.status);

        if (!squareResponse.ok) {
            const errorData = await squareResponse.text();
            console.error('Square API error:', errorData);
            throw new Error(`Square API error: ${errorData}`);
        }

        const squarePaymentResult = await squareResponse.json();
        const payment = squarePaymentResult.payment;
        
        console.log('Square payment created successfully:', payment.id);

        // Check payment status
        if (payment.status !== 'COMPLETED') {
            throw new Error(`Payment failed with status: ${payment.status}`);
        }

        // Create order record in database
        const orderData = {
            user_id: userId,
            square_payment_id: payment.id,
            status: 'completed',
            total_amount: amount,
            currency: 'USD',
            shipping_address: shippingAddress || null,
            billing_address: billingAddress || null,
            customer_email: customerEmail || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        console.log('Creating order in database...');

        const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(orderData)
        });

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            console.error('Failed to create order:', errorText);
            throw new Error(`Failed to create order: ${errorText}`);
        }

        const order = await orderResponse.json();
        const orderId = order[0].id;
        console.log('Order created successfully:', orderId);

        // Create order items
        const orderItems = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_time: item.price,
            product_name: item.product_name,
            product_image_url: item.product_image_url || null,
            created_at: new Date().toISOString()
        }));

        console.log('Creating order items...');

        const orderItemsResponse = await fetch(`${supabaseUrl}/rest/v1/order_items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderItems)
        });

        if (!orderItemsResponse.ok) {
            const errorText = await orderItemsResponse.text();
            console.error('Failed to create order items:', errorText);
            console.warn('Order created but order items creation failed');
        } else {
            console.log('Order items created successfully');
        }

        // Send automated order confirmation email
        try {
            console.log('Sending order confirmation email...');
            const emailResponse = await fetch(`${supabaseUrl}/functions/v1/order-confirmation-email`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderId,
                    customerEmail: customerEmail,
                    orderData: {
                        order_number: order[0].order_number || orderId,
                        total: amount,
                        items: cartItems,
                        shipping_address: shippingAddress,
                        billing_address: billingAddress
                    }
                })
            });

            if (emailResponse.ok) {
                console.log('Order confirmation email sent successfully');
            } else {
                const emailError = await emailResponse.text();
                console.warn('Order confirmation email failed:', emailError);
            }
        } catch (emailError) {
            console.warn('Order confirmation email error:', emailError);
        }

        const result = {
            data: {
                paymentId: payment.id,
                orderId: orderId,
                amount: amount,
                currency: 'USD',
                status: 'completed',
                receiptUrl: payment.receipt_url || null
            }
        };

        console.log('Square payment processing completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Square payment processing error:', error);

        const errorResponse = {
            error: {
                code: 'PAYMENT_PROCESSING_FAILED',
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