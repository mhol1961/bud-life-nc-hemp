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
        const { cartSessionId, customerEmail, cartItems, totalAmount } = await req.json();

        console.log('Abandoned cart email request:', { cartSessionId, customerEmail, itemCount: cartItems?.length });

        if (!cartSessionId || !customerEmail || !cartItems || cartItems.length === 0) {
            throw new Error('Cart session ID, customer email, and cart items are required');
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

        // Generate cart recovery token
        const recoveryToken = crypto.randomUUID();
        const recoveryUrl = `https://dluu8lwccf2z.space.minimax.io/checkout?recovery=${recoveryToken}`;

        // Update cart session with recovery token
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/cart_sessions?session_id=eq.${cartSessionId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart_recovery_token: recoveryToken,
                updated_at: new Date().toISOString()
            })
        });

        if (!updateResponse.ok) {
            console.warn('Failed to update cart with recovery token');
        }

        // Create cart items HTML
        const itemsHtml = cartItems.slice(0, 3).map((item: any) => `
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        ${item.product_image_url ? `<img src="${item.product_image_url}" alt="${item.product_name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">` : '<div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px;"></div>'}
                        <div>
                            <strong style="color: #1f2937; display: block; margin-bottom: 4px;">${item.product_name}</strong>
                            ${item.variant_name ? `<small style="color: #6b7280;">${item.variant_name}</small>` : ''}
                            <div style="color: #059669; font-weight: 600; margin-top: 4px;">$${item.price.toFixed(2)} × ${item.quantity}</div>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');

        const moreItemsHtml = cartItems.length > 3 ? `
            <tr>
                <td style="padding: 15px; text-align: center; color: #6b7280; font-style: italic;">
                    ...and ${cartItems.length - 3} more item${cartItems.length - 3 > 1 ? 's' : ''}
                </td>
            </tr>
        ` : '';

        const htmlContent = `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Complete Your Purchase - Bud Life NC</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Don't Miss Out!</h1>
                    <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Complete your premium hemp order</p>
                </div>

                <!-- Message -->
                <div style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <p style="font-size: 18px; color: #1f2937; margin-bottom: 15px;">Hi there!</p>
                        <p style="color: #6b7280; margin-bottom: 20px;">You left some premium hemp products in your cart. Don't let these quality items slip away!</p>
                        <p style="background: #fef3c7; color: #92400e; padding: 12px 16px; border-radius: 8px; display: inline-block; margin: 0;">⏰ Cart expires in 24 hours</p>
                    </div>

                    <!-- Cart Items -->
                    <h3 style="color: #1f2937; margin-bottom: 20px; font-size: 18px; text-align: center;">Your Reserved Items</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <tbody>
                            ${itemsHtml}
                            ${moreItemsHtml}
                        </tbody>
                    </table>

                    <!-- Total and CTA -->
                    <div style="background: linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%); padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px; border: 2px solid #84cc16;">
                        <div style="font-size: 24px; font-weight: bold; color: #365314; margin-bottom: 15px;">Total: $${totalAmount.toFixed(2)}</div>
                        <a href="${recoveryUrl}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">Complete Your Purchase</a>
                    </div>

                    <!-- Benefits -->
                    <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                        <h3 style="color: #1f2937; margin: 0 0 15px; font-size: 16px; text-align: center;">Why Choose Bud Life NC?</h3>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: center; gap: 10px;"><span style="color: #059669; font-size: 18px;">✓</span> <span style="color: #374151;">Lab-tested premium THCA flower</span></div>
                            <div style="display: flex; align-items: center; gap: 10px;"><span style="color: #059669; font-size: 18px;">✓</span> <span style="color: #374151;">Fast, discreet shipping</span></div>
                            <div style="display: flex; align-items: center; gap: 10px;"><span style="color: #059669; font-size: 18px;">✓</span> <span style="color: #374151;">North Carolina grown & cured</span></div>
                            <div style="display: flex; align-items: center; gap: 10px;"><span style="color: #059669; font-size: 18px;">✓</span> <span style="color: #374151;">100% legal hemp products</span></div>
                        </div>
                    </div>

                    <!-- Urgency -->
                    <div style="text-align: center; padding: 20px 0; border: 2px dashed #f59e0b; border-radius: 8px; background: #fffbeb;">
                        <p style="color: #92400e; margin: 0; font-weight: 600;">⚡ Limited time: Complete your order within 24 hours to secure these items!</p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Need help? Contact us at <a href="mailto:support@budlifenc.com" style="color: #059669;">support@budlifenc.com</a></p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">This email was sent to ${customerEmail}</p>
                    <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">Bud Life NC - Premium Hemp Products</p>
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
                subject: 'Complete Your Purchase - Don\'t Miss Out on Premium Hemp!',
                html: htmlContent,
                from: 'support@budlifenc.com',
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
                email_type: 'abandoned_cart',
                subject: 'Complete Your Purchase - Don\'t Miss Out on Premium Hemp!',
                cart_session_id: cartSessionId,
                status: 'sent',
                sent_at: new Date().toISOString()
            })
        });

        if (!logResponse.ok) {
            console.warn('Failed to log email send:', await logResponse.text());
        }

        console.log('Abandoned cart email sent successfully');

        return new Response(JSON.stringify({
            data: {
                success: true,
                emailSent: true,
                cartSessionId: cartSessionId,
                customerEmail: customerEmail,
                recoveryUrl: recoveryUrl
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Abandoned cart email error:', error);

        const errorResponse = {
            error: {
                code: 'ABANDONED_CART_EMAIL_FAILED',
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