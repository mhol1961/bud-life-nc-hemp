// API Connection Manager Edge Function
// Handles testing, connecting, and managing external API integrations

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
        const { action, providerId, credentials, connectionId } = await req.json();

        console.log('API Connection Manager action:', action);

        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Invalid token');
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        switch (action) {
            case 'test_connection':
                const testResult = await testAPIConnection(providerId, credentials);
                return new Response(JSON.stringify({ data: testResult }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'save_connection':
                const savedConnection = await saveAPIConnection(supabaseUrl, serviceRoleKey, userId, providerId, credentials);
                return new Response(JSON.stringify({ data: savedConnection }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'get_connections':
                const connections = await getUserConnections(supabaseUrl, serviceRoleKey, userId);
                return new Response(JSON.stringify({ data: connections }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'delete_connection':
                await deleteConnection(supabaseUrl, serviceRoleKey, connectionId, userId);
                return new Response(JSON.stringify({ data: { success: true } }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            default:
                throw new Error('Invalid action specified');
        }

    } catch (error) {
        console.error('API Connection Manager error:', error);

        const errorResponse = {
            error: {
                code: 'API_CONNECTION_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Test API connection based on provider
async function testAPIConnection(providerId: string, credentials: any) {
    console.log('Testing connection for provider:', providerId);

    switch (providerId) {
        case 'resend':
            return await testResendConnection(credentials.api_key);
        case 'sendgrid':
            return await testSendGridConnection(credentials.api_key);
        case 'twilio':
            return await testTwilioConnection(credentials.account_sid, credentials.auth_token);
        case 'mailgun':
            return await testMailgunConnection(credentials.api_key, credentials.domain);
        default:
            return { success: false, message: `Testing not implemented for ${providerId}` };
    }
}

// Resend API connection test
async function testResendConnection(apiKey: string) {
    try {
        const response = await fetch('https://api.resend.com/domains', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                message: 'Successfully connected to Resend',
                details: {
                    domains: data.data?.length || 0,
                    status: 'Active'
                }
            };
        } else {
            const errorData = await response.text();
            return {
                success: false,
                message: `Resend connection failed: ${errorData}`
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Resend test error: ${error.message}`
        };
    }
}

// SendGrid API connection test
async function testSendGridConnection(apiKey: string) {
    try {
        const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                message: 'Successfully connected to SendGrid',
                details: {
                    username: data.username,
                    email: data.email
                }
            };
        } else {
            const errorData = await response.text();
            return {
                success: false,
                message: `SendGrid connection failed: ${errorData}`
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `SendGrid test error: ${error.message}`
        };
    }
}

// Twilio API connection test
async function testTwilioConnection(accountSid: string, authToken: string) {
    try {
        const auth = btoa(`${accountSid}:${authToken}`);
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                message: 'Successfully connected to Twilio',
                details: {
                    account_sid: data.sid,
                    status: data.status
                }
            };
        } else {
            const errorData = await response.text();
            return {
                success: false,
                message: `Twilio connection failed: ${errorData}`
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Twilio test error: ${error.message}`
        };
    }
}

// Mailgun API connection test
async function testMailgunConnection(apiKey: string, domain: string) {
    try {
        const auth = btoa(`api:${apiKey}`);
        const response = await fetch(`https://api.mailgun.net/v3/domains/${domain}`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                message: 'Successfully connected to Mailgun',
                details: {
                    domain: data.domain?.name,
                    status: data.domain?.state
                }
            };
        } else {
            const errorData = await response.text();
            return {
                success: false,
                message: `Mailgun connection failed: ${errorData}`
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Mailgun test error: ${error.message}`
        };
    }
}

// Save API connection to database
async function saveAPIConnection(supabaseUrl: string, serviceRoleKey: string, userId: string, providerId: string, credentials: any) {
    // First get provider info
    const providerResponse = await fetch(`${supabaseUrl}/rest/v1/api_providers?provider_name=eq.${providerId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!providerResponse.ok) {
        throw new Error('Provider not found');
    }

    const providers = await providerResponse.json();
    if (providers.length === 0) {
        throw new Error('Provider not found');
    }

    const provider = providers[0];

    // Save connection
    const connectionData = {
        user_id: userId,
        provider_id: provider.id,
        connection_name: `${provider.provider_display_name} Connection`,
        encrypted_credentials: credentials, // In production, encrypt this
        connection_status: 'active',
        last_tested: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const saveResponse = await fetch(`${supabaseUrl}/rest/v1/user_api_connections`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(connectionData)
    });

    if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        throw new Error(`Failed to save connection: ${errorText}`);
    }

    const savedData = await saveResponse.json();
    return savedData[0];
}

// Get user's API connections
async function getUserConnections(supabaseUrl: string, serviceRoleKey: string, userId: string) {
    const response = await fetch(`${supabaseUrl}/rest/v1/user_api_connections?user_id=eq.${userId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get connections');
    }

    const connections = await response.json();

    // Get provider details for each connection
    const connectionsWithProviders = [];
    for (const connection of connections) {
        const providerResponse = await fetch(`${supabaseUrl}/rest/v1/api_providers?id=eq.${connection.provider_id}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (providerResponse.ok) {
            const providerData = await providerResponse.json();
            if (providerData.length > 0) {
                connectionsWithProviders.push({
                    ...connection,
                    provider: providerData[0],
                    encrypted_credentials: undefined // Don't send credentials to frontend
                });
            }
        }
    }

    return connectionsWithProviders;
}

// Delete API connection
async function deleteConnection(supabaseUrl: string, serviceRoleKey: string, connectionId: string, userId: string) {
    const response = await fetch(`${supabaseUrl}/rest/v1/user_api_connections?id=eq.${connectionId}&user_id=eq.${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete connection');
    }

    return true;
}