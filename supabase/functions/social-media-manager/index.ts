// Social Media Manager Edge Function
// Handles social media posting, scheduling, and engagement management

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
        const { action, postId, accountId, postData, interactionId, responseData } = await req.json();

        console.log('Social Media Manager action:', action);

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
            case 'schedule_post':
                const scheduledPost = await schedulePost(supabaseUrl, serviceRoleKey, userId, postData);
                return new Response(JSON.stringify({ data: scheduledPost }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'publish_now':
                const publishedPost = await publishPost(supabaseUrl, serviceRoleKey, postId, accountId);
                return new Response(JSON.stringify({ data: publishedPost }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'get_interactions':
                const interactions = await getInteractions(supabaseUrl, serviceRoleKey, userId);
                return new Response(JSON.stringify({ data: interactions }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'respond_to_interaction':
                const response = await respondToInteraction(supabaseUrl, serviceRoleKey, interactionId, responseData, userId);
                return new Response(JSON.stringify({ data: response }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'get_analytics':
                const analytics = await getSocialAnalytics(supabaseUrl, serviceRoleKey, userId);
                return new Response(JSON.stringify({ data: analytics }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            default:
                throw new Error('Invalid action specified');
        }

    } catch (error) {
        console.error('Social Media Manager error:', error);

        const errorResponse = {
            error: {
                code: 'SOCIAL_MEDIA_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Schedule a social media post
async function schedulePost(supabaseUrl: string, serviceRoleKey: string, userId: string, postData: any) {
    console.log('Scheduling social media post');

    // Create post in database
    const postRecord = {
        user_id: userId,
        post_title: postData.title || '',
        post_content: postData.content,
        media_urls: postData.mediaUrls || [],
        media_type: postData.mediaType || 'text',
        scheduled_time: postData.scheduledTime,
        timezone: postData.timezone || 'UTC',
        post_status: 'scheduled',
        hashtags: postData.hashtags || [],
        mentions: postData.mentions || [],
        location_name: postData.locationName || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const postResponse = await fetch(`${supabaseUrl}/rest/v1/social_posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(postRecord)
    });

    if (!postResponse.ok) {
        const errorText = await postResponse.text();
        throw new Error(`Failed to create post: ${errorText}`);
    }

    const postData_response = await postResponse.json();
    const post = postData_response[0];

    // Create platform mappings for selected accounts
    if (postData.selectedAccounts && postData.selectedAccounts.length > 0) {
        const platformMappings = postData.selectedAccounts.map((accountId: string) => ({
            post_id: post.id,
            account_id: accountId,
            post_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        const mappingResponse = await fetch(`${supabaseUrl}/rest/v1/social_post_platforms`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(platformMappings)
        });

        if (!mappingResponse.ok) {
            console.error('Failed to create platform mappings');
        }
    }

    return {
        id: post.id,
        status: 'scheduled',
        scheduledTime: post.scheduled_time,
        message: 'Post scheduled successfully'
    };
}

// Publish a post immediately
async function publishPost(supabaseUrl: string, serviceRoleKey: string, postId: string, accountId: string) {
    console.log('Publishing post immediately:', postId);

    // Get post data
    const postResponse = await fetch(`${supabaseUrl}/rest/v1/social_posts?id=eq.${postId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!postResponse.ok) {
        throw new Error('Post not found');
    }

    const posts = await postResponse.json();
    if (posts.length === 0) {
        throw new Error('Post not found');
    }

    const post = posts[0];

    // Get account details
    const accountResponse = await fetch(`${supabaseUrl}/rest/v1/user_social_accounts?id=eq.${accountId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!accountResponse.ok) {
        throw new Error('Account not found');
    }

    const accounts = await accountResponse.json();
    if (accounts.length === 0) {
        throw new Error('Account not found');
    }

    const account = accounts[0];

    // Simulate publishing to social platform
    // In a real implementation, this would integrate with actual social media APIs
    const publishResult = await simulatePublish(post, account);

    if (publishResult.success) {
        // Update post status
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/social_posts?id=eq.${postId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_status: 'published',
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });

        if (!updateResponse.ok) {
            console.error('Failed to update post status');
        }

        // Update platform mapping
        const platformUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/social_post_platforms?post_id=eq.${postId}&account_id=eq.${accountId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_status: 'published',
                platform_post_id: publishResult.platformPostId,
                platform_url: publishResult.url,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });

        if (!platformUpdateResponse.ok) {
            console.error('Failed to update platform mapping');
        }

        return {
            success: true,
            platformPostId: publishResult.platformPostId,
            url: publishResult.url,
            message: 'Post published successfully'
        };
    } else {
        throw new Error(`Failed to publish: ${publishResult.error}`);
    }
}

// Simulate publishing to social platform (replace with real API calls)
async function simulatePublish(post: any, account: any) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful publishing
    return {
        success: true,
        platformPostId: `${account.platform_id}_${Date.now()}`,
        url: `https://example.com/post/${Date.now()}`,
        engagement: {
            likes: 0,
            comments: 0,
            shares: 0
        }
    };
}

// Get social media interactions (comments, mentions, messages)
async function getInteractions(supabaseUrl: string, serviceRoleKey: string, userId: string) {
    console.log('Getting social media interactions');

    // Get user's social accounts first
    const accountsResponse = await fetch(`${supabaseUrl}/rest/v1/user_social_accounts?user_id=eq.${userId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!accountsResponse.ok) {
        throw new Error('Failed to get user accounts');
    }

    const accounts = await accountsResponse.json();
    const accountIds = accounts.map((account: any) => account.id);

    if (accountIds.length === 0) {
        return [];
    }

    // Get interactions for all user accounts
    const interactionsResponse = await fetch(`${supabaseUrl}/rest/v1/social_interactions?account_id=in.(${accountIds.join(',')})&order=created_at.desc`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!interactionsResponse.ok) {
        throw new Error('Failed to get interactions');
    }

    const interactions = await interactionsResponse.json();
    return interactions;
}

// Respond to a social media interaction
async function respondToInteraction(supabaseUrl: string, serviceRoleKey: string, interactionId: string, responseData: any, userId: string) {
    console.log('Responding to social media interaction:', interactionId);

    // Update interaction with response
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/social_interactions?id=eq.${interactionId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            response_content: responseData.content,
            responded_at: new Date().toISOString(),
            responded_by: userId,
            interaction_status: 'responded',
            updated_at: new Date().toISOString()
        })
    });

    if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update interaction: ${errorText}`);
    }

    // In a real implementation, this would also post the response to the actual social platform
    return {
        success: true,
        message: 'Response sent successfully',
        timestamp: new Date().toISOString()
    };
}

// Get social media analytics
async function getSocialAnalytics(supabaseUrl: string, serviceRoleKey: string, userId: string) {
    console.log('Getting social media analytics');

    // Get user's social accounts
    const accountsResponse = await fetch(`${supabaseUrl}/rest/v1/user_social_accounts?user_id=eq.${userId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!accountsResponse.ok) {
        throw new Error('Failed to get user accounts');
    }

    const accounts = await accountsResponse.json();

    // Calculate total followers across all platforms
    const totalFollowers = accounts.reduce((sum: number, account: any) => sum + (account.follower_count || 0), 0);

    // Get recent posts for engagement metrics
    const postsResponse = await fetch(`${supabaseUrl}/rest/v1/social_posts?user_id=eq.${userId}&post_status=eq.published&order=created_at.desc&limit=50`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    let totalEngagement = 0;
    let postsCount = 0;

    if (postsResponse.ok) {
        const posts = await postsResponse.json();
        postsCount = posts.length;
        totalEngagement = posts.reduce((sum: number, post: any) => {
            return sum + (post.total_likes || 0) + (post.total_comments || 0) + (post.total_shares || 0);
        }, 0);
    }

    // Get unread interactions count
    const accountIds = accounts.map((account: any) => account.id);
    let unreadCount = 0;

    if (accountIds.length > 0) {
        const interactionsResponse = await fetch(`${supabaseUrl}/rest/v1/social_interactions?account_id=in.(${accountIds.join(',')})&interaction_status=eq.unread`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (interactionsResponse.ok) {
            const interactions = await interactionsResponse.json();
            unreadCount = interactions.length;
        }
    }

    return {
        totalFollowers,
        totalEngagement,
        postsThisMonth: postsCount,
        unreadInteractions: unreadCount,
        connectedAccounts: accounts.length,
        platformBreakdown: accounts.map((account: any) => ({
            platform: account.platform_id,
            accountName: account.account_name,
            followers: account.follower_count || 0,
            status: account.connection_status
        }))
    };
}