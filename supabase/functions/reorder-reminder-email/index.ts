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

        console.log('Starting 14-day re-order reminder email process');

        // Get orders from exactly 14 days ago that were completed
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const startDate = fourteenDaysAgo.toISOString().split('T')[0];
        const endDate = new Date(fourteenDaysAgo.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const ordersResponse = await fetch(`${supabaseUrl}/rest/v1/orders?and=(created_at.gte.${startDate},created_at.lt.${endDate},status.eq.completed)&select=*,order_items(*)`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!ordersResponse.ok) {
            throw new Error('Failed to fetch orders for re-order reminders');
        }

        const orders = await ordersResponse.json();
        console.log(`Found ${orders.length} orders from 14 days ago`);

        let emailsSent = 0;
        const errors: string[] = [];

        // Process each order
        for (const order of orders) {
            try {
                if (!order.email) {
                    console.warn(`Skipping order ${order.id} - no email address`);
                    continue;
                }

                // Check if re-order reminder was already sent
                const logCheck = await fetch(`${supabaseUrl}/rest/v1/email_logs?order_id=eq.${order.id}&email_type=eq.reorder_reminder`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (logCheck.ok) {
                    const existingLogs = await logCheck.json();
                    if (existingLogs.length > 0) {
                        console.log(`Re-order reminder already sent for order ${order.id}`);
                        continue;
                    }
                }

                const orderItems = order.order_items || [];
                const orderTotal = order.total || 0;
                const orderNumber = order.order_number || order.id;

                // Create order items HTML
                const itemsHtml = orderItems.slice(0, 4).map((item: any) => `
                    <tr>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                ${item.product_image_url ? `<img src="${item.product_image_url}" alt="${item.product_name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">` : '<div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 24px;">📦</div>'}
                                <div>
                                    <strong style="color: #1f2937; display: block; margin-bottom: 4px;">${item.product_name}</strong>
                                    <div style="color: #6b7280; margin-bottom: 4px;">Qty: ${item.quantity}</div>
                                    <div style="color: #059669; font-weight: 600;">$${item.price_at_time.toFixed(2)}</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                `).join('');

                const htmlContent = `
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Ready to Reorder? - Bud Life NC</title>
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Time to Reorder?</h1>
                            <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">It's been 2 weeks since your last order</p>
                        </div>

                        <!-- Message -->
                        <div style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <p style="font-size: 18px; color: #1f2937; margin-bottom: 15px;">Hi there!</p>
                                <p style="color: #6b7280; margin-bottom: 20px;">It's been exactly 2 weeks since you ordered these premium hemp products. Time for a restock?</p>
                            </div>

                            <!-- Previous Order Summary -->
                            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #8b5cf6;">
                                <h3 style="color: #1f2937; margin: 0 0 15px; font-size: 16px;">Your Previous Order #${orderNumber}</h3>
                                <p style="color: #6b7280; margin: 0; font-size: 14px;">Ordered on ${new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>

                            <!-- Order Items -->
                            <h3 style="color: #1f2937; margin-bottom: 20px; font-size: 18px;">What You Ordered</h3>
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                            </table>

                            <!-- Reorder CTA -->
                            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; border: 2px solid #10b981;">
                                <div style="font-size: 20px; font-weight: bold; color: #065f46; margin-bottom: 8px;">Previous Order Total: $${orderTotal.toFixed(2)}</div>
                                <p style="color: #047857; margin: 0 0 20px; font-size: 16px;">Reorder the same premium products with one click!</p>
                                <a href="https://dluu8lwccf2z.space.minimax.io/store?reorder=${order.id}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-right: 15px;">Quick Reorder</a>
                                <a href="https://dluu8lwccf2z.space.minimax.io/store" style="display: inline-block; background: white; color: #059669; border: 2px solid #059669; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">Browse All Products</a>
                            </div>

                            <!-- Why Reorder Section -->
                            <div style="background: #fefce8; padding: 25px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #eab308;">
                                <h3 style="color: #854d0e; margin: 0 0 15px; font-size: 16px; text-align: center;">Why Our Customers Reorder</h3>
                                <div style="display: grid; gap: 12px;">
                                    <div style="display: flex; align-items: center; gap: 12px;"><span style="color: #ca8a04; font-size: 20px;">🌟</span> <span style="color: #713f12;">Consistently high-quality products</span></div>
                                    <div style="display: flex; align-items: center; gap: 12px;"><span style="color: #ca8a04; font-size: 20px;">🔬</span> <span style="color: #713f12;">Lab-tested for purity and potency</span></div>
                                    <div style="display: flex; align-items: center; gap: 12px;"><span style="color: #ca8a04; font-size: 20px;">🚚</span> <span style="color: #713f12;">Fast, reliable shipping</span></div>
                                    <div style="display: flex; align-items: center; gap: 12px;"><span style="color: #ca8a04; font-size: 20px;">💯</span> <span style="color: #713f12;">100% satisfaction guarantee</span></div>
                                </div>
                            </div>

                            <!-- Special Offer -->
                            <div style="text-align: center; padding: 25px; border: 2px dashed #8b5cf6; border-radius: 12px; background: #faf5ff; margin-bottom: 25px;">
                                <h3 style="color: #6b21a8; margin: 0 0 10px; font-size: 18px;">🎉 Loyal Customer Bonus</h3>
                                <p style="color: #7c2d92; margin: 0 0 15px; font-weight: 600;">Get FREE shipping on your reorder (automatically applied)</p>
                                <p style="color: #a855f7; margin: 0; font-size: 14px;">Valid for orders over $50 • Limited time offer</p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Questions? Contact us at <a href="mailto:support@budlifenc.com" style="color: #059669;">support@budlifenc.com</a></p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">This email was sent to ${order.email}</p>
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
                        to: order.email,
                        subject: 'Time to Reorder Your Premium Hemp Products? 🌿',
                        html: htmlContent,
                        from: 'support@budlifenc.com',
                        fromName: 'Bud Life NC'
                    })
                });

                if (!emailResponse.ok) {
                    const emailError = await emailResponse.text();
                    console.error(`Email send failed for order ${order.id}:`, emailError);
                    errors.push(`Order ${order.id}: ${emailError}`);
                    continue;
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
                        recipient_email: order.email,
                        email_type: 'reorder_reminder',
                        subject: 'Time to Reorder Your Premium Hemp Products? 🌿',
                        order_id: order.id,
                        status: 'sent',
                        sent_at: new Date().toISOString()
                    })
                });

                if (!logResponse.ok) {
                    console.warn(`Failed to log email send for order ${order.id}`);
                }

                emailsSent++;
                console.log(`Re-order reminder sent for order ${order.id} to ${order.email}`);

            } catch (error) {
                console.error(`Error processing order ${order.id}:`, error);
                errors.push(`Order ${order.id}: ${error.message}`);
            }
        }

        console.log(`Re-order reminder process completed. Sent: ${emailsSent}, Errors: ${errors.length}`);

        return new Response(JSON.stringify({
            data: {
                success: true,
                emailsSent,
                ordersProcessed: orders.length,
                errors: errors.length > 0 ? errors : undefined
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Re-order reminder email error:', error);

        const errorResponse = {
            error: {
                code: 'REORDER_REMINDER_FAILED',
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