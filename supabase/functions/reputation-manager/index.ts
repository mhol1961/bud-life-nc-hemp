// Reputation Manager Edge Function
// Handles reputation monitoring, review management, and response automation

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
        const { action, businessId, reviewId, responseData, alertId } = await req.json();

        console.log('Reputation Manager action:', action);

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
            case 'get_reputation_overview':
                const overview = await getReputationOverview(supabaseUrl, serviceRoleKey, userId);
                return new Response(JSON.stringify({ data: overview }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'get_reviews':
                const reviews = await getReviews(supabaseUrl, serviceRoleKey, userId, businessId);
                return new Response(JSON.stringify({ data: reviews }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'respond_to_review':
                const response = await respondToReview(supabaseUrl, serviceRoleKey, reviewId, responseData, userId);
                return new Response(JSON.stringify({ data: response }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'analyze_sentiment':
                const sentiment = await analyzeSentiment(responseData.text);
                return new Response(JSON.stringify({ data: sentiment }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'get_alerts':
                const alerts = await getReputationAlerts(supabaseUrl, serviceRoleKey, userId);
                return new Response(JSON.stringify({ data: alerts }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'acknowledge_alert':
                const alertResponse = await acknowledgeAlert(supabaseUrl, serviceRoleKey, alertId, userId);
                return new Response(JSON.stringify({ data: alertResponse }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'generate_review_response':
                const suggestedResponse = await generateReviewResponse(responseData.reviewText, responseData.rating);
                return new Response(JSON.stringify({ data: suggestedResponse }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            default:
                throw new Error('Invalid action specified');
        }

    } catch (error) {
        console.error('Reputation Manager error:', error);

        const errorResponse = {
            error: {
                code: 'REPUTATION_MANAGER_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Get reputation overview with key metrics
async function getReputationOverview(supabaseUrl: string, serviceRoleKey: string, userId: string) {
    console.log('Getting reputation overview for user:', userId);

    // Get business listings
    const listingsResponse = await fetch(`${supabaseUrl}/rest/v1/business_listings?user_id=eq.${userId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!listingsResponse.ok) {
        throw new Error('Failed to get business listings');
    }

    const listings = await listingsResponse.json();
    
    // Calculate overall metrics
    let totalReviews = 0;
    let totalRating = 0;
    let recentReviews = 0;
    let pendingResponses = 0;

    for (const listing of listings) {
        totalReviews += listing.total_reviews || 0;
        totalRating += (listing.overall_rating || 0) * (listing.total_reviews || 0);
    }

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    // Get recent review management actions
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 30); // Last 30 days

    const actionsResponse = await fetch(`${supabaseUrl}/rest/v1/review_management_actions?business_listing_id=in.(${listings.map((l: any) => l.id).join(',')})&created_at=gte.${recentDate.toISOString()}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (actionsResponse.ok) {
        const actions = await actionsResponse.json();
        recentReviews = actions.length;
        pendingResponses = actions.filter((a: any) => a.action_status === 'pending').length;
    }

    // Get active alerts
    const alertsResponse = await fetch(`${supabaseUrl}/rest/v1/reputation_alerts?user_id=eq.${userId}&alert_status=eq.active`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    let activeAlerts = 0;
    if (alertsResponse.ok) {
        const alerts = await alertsResponse.json();
        activeAlerts = alerts.length;
    }

    // Calculate reputation score (simplified)
    let reputationScore = 0;
    if (averageRating > 0) {
        const ratingScore = (averageRating / 5) * 70; // 70% weight for rating
        const responseScore = listings.length > 0 ? (listings.reduce((sum: number, l: any) => sum + (l.response_rate || 0), 0) / listings.length) * 0.3 : 0; // 30% weight for response rate
        reputationScore = Math.min(100, ratingScore + responseScore);
    }

    return {
        overallRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        recentReviews,
        pendingResponses,
        activeAlerts,
        reputationScore: Math.round(reputationScore),
        connectedPlatforms: listings.length,
        listings: listings.map((listing: any) => ({
            id: listing.id,
            businessName: listing.business_name,
            platform: listing.platform_id,
            rating: listing.overall_rating,
            reviewCount: listing.total_reviews,
            responseRate: listing.response_rate
        }))
    };
}

// Get reviews for a specific business or all businesses
async function getReviews(supabaseUrl: string, serviceRoleKey: string, userId: string, businessId?: string) {
    console.log('Getting reviews for user:', userId);

    let query = `${supabaseUrl}/rest/v1/review_management_actions?`;
    
    if (businessId) {
        query += `business_listing_id=eq.${businessId}&`;
    } else {
        // Get all business listings for the user
        const listingsResponse = await fetch(`${supabaseUrl}/rest/v1/business_listings?user_id=eq.${userId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!listingsResponse.ok) {
            throw new Error('Failed to get business listings');
        }

        const listings = await listingsResponse.json();
        const businessIds = listings.map((l: any) => l.id).join(',');
        
        if (businessIds) {
            query += `business_listing_id=in.(${businessIds})&`;
        } else {
            return []; // No businesses found
        }
    }

    query += 'order=created_at.desc&limit=50';

    const reviewsResponse = await fetch(query, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!reviewsResponse.ok) {
        throw new Error('Failed to get reviews');
    }

    const reviews = await reviewsResponse.json();
    return reviews;
}

// Respond to a review
async function respondToReview(supabaseUrl: string, serviceRoleKey: string, reviewId: string, responseData: any, userId: string) {
    console.log('Responding to review:', reviewId);

    const updateData = {
        response_content: responseData.content,
        responded_at: new Date().toISOString(),
        responded_by: userId,
        action_status: 'responded',
        updated_at: new Date().toISOString()
    };

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/review_management_actions?id=eq.${reviewId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });

    if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update review: ${errorText}`);
    }

    // In a real implementation, this would post the response to the actual review platform
    return {
        success: true,
        message: 'Response posted successfully',
        timestamp: new Date().toISOString()
    };
}

// Simple sentiment analysis (replace with actual AI service in production)
async function analyzeSentiment(text: string) {
    console.log('Analyzing sentiment for text');

    // Simple keyword-based sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'fantastic', 'love', 'perfect', 'wonderful', 'outstanding', 'superb'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'disgusting', 'worst', 'disappointing', 'pathetic', 'useless'];

    const words = text.toLowerCase().split(/\W+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
    });

    let sentiment = 'neutral';
    let score = 0;

    if (positiveCount > negativeCount) {
        sentiment = 'positive';
        score = Math.min(1, (positiveCount - negativeCount) / words.length * 10);
    } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        score = Math.max(-1, (negativeCount - positiveCount) / words.length * -10);
    }

    return {
        sentiment,
        score: Math.round(score * 100) / 100,
        confidence: Math.min(1, Math.abs(score) + 0.1),
        positiveWords: positiveCount,
        negativeWords: negativeCount
    };
}

// Get reputation alerts
async function getReputationAlerts(supabaseUrl: string, serviceRoleKey: string, userId: string) {
    console.log('Getting reputation alerts');

    const alertsResponse = await fetch(`${supabaseUrl}/rest/v1/reputation_alerts?user_id=eq.${userId}&order=created_at.desc&limit=20`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        }
    });

    if (!alertsResponse.ok) {
        throw new Error('Failed to get alerts');
    }

    const alerts = await alertsResponse.json();
    return alerts;
}

// Acknowledge an alert
async function acknowledgeAlert(supabaseUrl: string, serviceRoleKey: string, alertId: string, userId: string) {
    console.log('Acknowledging alert:', alertId);

    const updateData = {
        alert_status: 'acknowledged',
        acknowledged_by: userId,
        acknowledged_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/reputation_alerts?id=eq.${alertId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });

    if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to acknowledge alert: ${errorText}`);
    }

    return {
        success: true,
        message: 'Alert acknowledged successfully'
    };
}

// Generate AI-powered review response suggestions
async function generateReviewResponse(reviewText: string, rating: number) {
    console.log('Generating review response suggestion');

    // Simple template-based response generation (replace with actual AI in production)
    let responseTemplate = '';

    if (rating >= 4) {
        // Positive review
        responseTemplate = `Thank you so much for your wonderful review! We're thrilled to hear you had such a positive experience with us. Your feedback means the world to our team and motivates us to continue providing excellent service. We look forward to serving you again soon!`;
    } else if (rating >= 3) {
        // Neutral review
        responseTemplate = `Thank you for taking the time to share your feedback. We appreciate your honest review and are glad you chose our services. We're always looking for ways to improve, so if you have any specific suggestions, please don't hesitate to reach out to us directly.`;
    } else {
        // Negative review
        responseTemplate = `Thank you for bringing this to our attention, and we sincerely apologize that your experience didn't meet your expectations. We take all feedback seriously and would love the opportunity to make things right. Please contact us directly so we can discuss how we can improve and potentially resolve any concerns you may have.`;
    }

    // Analyze review for specific issues to customize response
    const lowerReview = reviewText.toLowerCase();
    const customizations = [];

    if (lowerReview.includes('staff') || lowerReview.includes('service')) {
        customizations.push('We will share your feedback with our team to ensure we continue improving our customer service.');
    }
    if (lowerReview.includes('wait') || lowerReview.includes('time')) {
        customizations.push('We understand your time is valuable and are working to improve our efficiency.');
    }
    if (lowerReview.includes('price') || lowerReview.includes('cost') || lowerReview.includes('expensive')) {
        customizations.push('We strive to provide great value for our services and appreciate your feedback on pricing.');
    }

    if (customizations.length > 0) {
        responseTemplate += ' ' + customizations.join(' ');
    }

    return {
        suggestedResponse: responseTemplate,
        tone: rating >= 4 ? 'grateful' : rating >= 3 ? 'appreciative' : 'apologetic',
        confidence: 0.85,
        alternatives: [
            responseTemplate.replace('Thank you', 'We appreciate'),
            responseTemplate.replace('We\'re thrilled', 'We\'re delighted')
        ]
    };
}