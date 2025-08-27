Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { orderId, customerEmail, orderData } = await req.json();

        console.log('Order confirmation email request:', { orderId, customerEmail });

        if (!orderId || !customerEmail || !orderData) {
            throw new Error('Order ID, customer email, and order data are required');
        }

        // Get environment variables
        const ghlApiKey = Deno.env.get('GOHIGHLEVEL_API_KEY');
        const ghlLocationId = Deno.env.get('GOHIGHLEVEL_LOCATION_ID');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!ghlApiKey || !ghlLocationId) {
            console.error('GoHighLevel credentials not found');
            throw new Error('Email service configuration missing');
        }

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Create order confirmation email content
        const orderTotal = orderData.total || 0;
        const orderNumber = orderData.order_number || orderId;
        const orderItems = orderData.items || [];
        const shippingAddress = orderData.shipping_address || {};
        
        const itemsHtml = orderItems.map((item: any) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <strong>${item.product_name || item.name}</strong>
                    ${item.variant_name ? `<br><small style="color: #6b7280;">${item.variant_name}</small>` : ''}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    $${(item.price_at_time || item.price).toFixed(2)}
                </td>
            </tr>
        `).join('');

        const htmlContent = `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Order Confirmation - Bud Life NC</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Order Confirmed!</h1>
                    <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Thank you for your purchase</p>
                </div>

                <!-- Order Details -->
                <div style="padding: 40px 30px;">
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 20px;">Order #${orderNumber}</h2>
                        <p style="margin: 0; color: #6b7280;">Order Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    <!-- Items Table -->
                    <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">Order Items</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb;">
                        <thead>
                            <tr style="background: #f9fafb;">
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #374151;">Item</th>
                                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #374151;">Qty</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #374151;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 16px 12px; font-weight: bold; border-top: 2px solid #e5e7eb; color: #1f2937;">Total:</td>
                                <td style="padding: 16px 12px; font-weight: bold; text-align: right; border-top: 2px solid #e5e7eb; color: #059669; font-size: 18px;">$${orderTotal.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <!-- Shipping Address -->
                    ${shippingAddress.firstName ? `
                    <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">Shipping Address</h3>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <p style="margin: 0; line-height: 1.6; color: #374151;">
                            ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                            ${shippingAddress.address}<br>
                            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
                        </p>
                    </div>
                    ` : ''}

                    <!-- Important Information -->
                    <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
                        <h3 style="color: #1e40af; margin: 0 0 10px; font-size: 16px;">Important Information</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                            <li>You must be 21+ to receive this order</li>
                            <li>Valid ID required for delivery/pickup</li>
                            <li>Products have not been evaluated by the FDA</li>
                            <li>Keep products away from children and pets</li>
                        </ul>
                    </div>

                    <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; margin: 0 0 15px;">Questions about your order?</p>
                        <p style="margin: 0;">
                            <a href="mailto:orders@budlifenc.com" style="color: #059669; text-decoration: none; font-weight: 500;">orders@budlifenc.com</a> | 
                            <a href="tel:+19191234567" style="color: #059669; text-decoration: none; font-weight: 500;">(919) 123-4567</a>
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Bud Life NC - Premium Hemp Products</p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">This email was sent to ${customerEmail}</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Send email via GoHighLevel
        const emailResponse = await fetch(`https://services.leadconnectorhq.com/hooks/emails`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ghlApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                locationId: ghlLocationId,
                to: customerEmail,
                subject: `Order Confirmation - Order #${orderNumber}`,
                html: htmlContent,
                from: 'orders@budlifenc.com',
                fromName: 'Bud Life NC'
            })
        });

        if (!emailResponse.ok) {
            const emailError = await emailResponse.text();
            console.error('Email send failed:', emailError);
            throw new Error(`Failed to send email: ${emailError}`);
        }

        // Log email in database
        const logResponse = await fetch(`${supabaseUrl}/rest/v1/email_logs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipient_email: customerEmail,
                email_type: 'order_confirmation',
                subject: `Order Confirmation - Order #${orderNumber}`,
                order_id: orderId,
                status: 'sent',
                sent_at: new Date().toISOString()
            })
        });

        if (!logResponse.ok) {
            console.warn('Failed to log email send:', await logResponse.text());
        }

        console.log('Order confirmation email sent successfully');

        return new Response(JSON.stringify({
            data: {
                success: true,
                emailSent: true,
                orderId: orderId,
                customerEmail: customerEmail
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Order confirmation email error:', error);

        const errorResponse = {
            error: {
                code: 'EMAIL_SEND_FAILED',
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