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
    const { action, ...data } = await req.json();

    // Get environment variables
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    let result;

    switch (action) {
      case 'track_view':
        result = await trackView(supabaseUrl, serviceRoleKey, data);
        break;
      case 'track_engagement':
        result = await trackEngagement(supabaseUrl, serviceRoleKey, data);
        break;
      case 'get_analytics':
        result = await getAnalytics(supabaseUrl, serviceRoleKey, data);
        break;
      case 'get_popular_posts':
        result = await getPopularPosts(supabaseUrl, serviceRoleKey, data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('CMS analytics error:', error);

    const errorResponse = {
      error: {
        code: 'CMS_ANALYTICS_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Track page view
async function trackView(supabaseUrl: string, serviceRoleKey: string, data: any) {
  const { postId, referrerDomain, isUniqueView, timeOnPage } = data;

  if (!postId) {
    throw new Error('Post ID is required for view tracking');
  }

  const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

  // First, update the blog post view count
  const updatePostResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      view_count: `view_count + 1`
    })
  });

  // Upsert analytics record for the day
  const analyticsResponse = await fetch(`${supabaseUrl}/rest/v1/cms_analytics`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      post_id: postId,
      date: today,
      views: 1,
      unique_views: isUniqueView ? 1 : 0,
      time_on_page: timeOnPage || 0,
      referrer_domain: referrerDomain || null
    })
  });

  if (!analyticsResponse.ok) {
    // If upsert failed, try to update existing record
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/cms_analytics?post_id=eq.${postId}&date=eq.${today}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          views: `views + 1`,
          unique_views: isUniqueView ? `unique_views + 1` : 'unique_views',
          time_on_page: timeOnPage || 'time_on_page',
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!updateResponse.ok) {
      console.error('Failed to update analytics, but view was still tracked on post');
    }
  }

  return { success: true, postId, date: today };
}

// Track engagement (likes, shares, comments)
async function trackEngagement(supabaseUrl: string, serviceRoleKey: string, data: any) {
  const { postId, engagementType, value = 1 } = data;

  if (!postId || !engagementType) {
    throw new Error('Post ID and engagement type are required');
  }

  const today = new Date().toISOString().split('T')[0];

  // Update the specific engagement metric in blog post
  let postUpdateField;
  let analyticsField;

  switch (engagementType) {
    case 'like':
      postUpdateField = 'like_count';
      analyticsField = 'likes';
      break;
    case 'share':
      postUpdateField = null; // No field in blog_posts for shares
      analyticsField = 'shares';
      break;
    case 'comment':
      postUpdateField = 'comment_count';
      analyticsField = 'comments';
      break;
    default:
      throw new Error(`Invalid engagement type: ${engagementType}`);
  }

  // Update blog post if applicable
  if (postUpdateField) {
    await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [postUpdateField]: `${postUpdateField} + ${value}`
      })
    });
  }

  // Update analytics
  const updateData = {
    [analyticsField]: `${analyticsField} + ${value}`,
    updated_at: new Date().toISOString()
  };

  const analyticsResponse = await fetch(
    `${supabaseUrl}/rest/v1/cms_analytics?post_id=eq.${postId}&date=eq.${today}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    }
  );

  if (!analyticsResponse.ok) {
    // If update failed, try to create new record
    const createData = {
      post_id: postId,
      date: today,
      views: 0,
      unique_views: 0,
      [analyticsField]: value
    };

    await fetch(`${supabaseUrl}/rest/v1/cms_analytics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createData)
    });
  }

  return { success: true, postId, engagementType, value };
}

// Get analytics data for a post or date range
async function getAnalytics(supabaseUrl: string, serviceRoleKey: string, data: any) {
  const { postId, startDate, endDate, limit = 30 } = data;

  let query = `${supabaseUrl}/rest/v1/cms_analytics?select=*`;

  if (postId) {
    query += `&post_id=eq.${postId}`;
  }

  if (startDate) {
    query += `&date=gte.${startDate}`;
  }

  if (endDate) {
    query += `&date=lte.${endDate}`;
  }

  query += `&order=date.desc&limit=${limit}`;

  const analyticsResponse = await fetch(query, {
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  if (!analyticsResponse.ok) {
    const errorText = await analyticsResponse.text();
    throw new Error(`Failed to fetch analytics: ${errorText}`);
  }

  const analytics = await analyticsResponse.json();

  // Calculate summary statistics
  const summary = {
    totalViews: analytics.reduce((sum: number, record: any) => sum + (record.views || 0), 0),
    totalUniqueViews: analytics.reduce((sum: number, record: any) => sum + (record.unique_views || 0), 0),
    totalShares: analytics.reduce((sum: number, record: any) => sum + (record.shares || 0), 0),
    totalComments: analytics.reduce((sum: number, record: any) => sum + (record.comments || 0), 0),
    averageTimeOnPage: analytics.length > 0 
      ? analytics.reduce((sum: number, record: any) => sum + (record.time_on_page || 0), 0) / analytics.length
      : 0,
    records: analytics.length
  };

  return { analytics, summary };
}

// Get most popular posts
async function getPopularPosts(supabaseUrl: string, serviceRoleKey: string, data: any) {
  const { period = '7days', limit = 10 } = data;

  // Calculate date range
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24);
      break;
    case '7days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(startDate.getDate() - 90);
      break;
  }

  const startDateStr = startDate.toISOString().split('T')[0];

  // Get analytics data for the period
  const analyticsResponse = await fetch(
    `${supabaseUrl}/rest/v1/cms_analytics?select=post_id,views,unique_views,shares,comments&date=gte.${startDateStr}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  if (!analyticsResponse.ok) {
    const errorText = await analyticsResponse.text();
    throw new Error(`Failed to fetch analytics: ${errorText}`);
  }

  const analytics = await analyticsResponse.json();

  // Group by post_id and sum metrics
  const postMetrics = new Map();
  
  analytics.forEach((record: any) => {
    const postId = record.post_id;
    if (!postMetrics.has(postId)) {
      postMetrics.set(postId, {
        post_id: postId,
        total_views: 0,
        total_unique_views: 0,
        total_shares: 0,
        total_comments: 0,
        engagement_score: 0
      });
    }

    const metrics = postMetrics.get(postId);
    metrics.total_views += record.views || 0;
    metrics.total_unique_views += record.unique_views || 0;
    metrics.total_shares += record.shares || 0;
    metrics.total_comments += record.comments || 0;
    
    // Calculate engagement score (weighted combination of metrics)
    metrics.engagement_score = metrics.total_views + 
                              (metrics.total_shares * 3) + 
                              (metrics.total_comments * 5);
  });

  // Convert to array and sort by engagement score
  const topPosts = Array.from(postMetrics.values())
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, limit);

  // Get post details for the top posts
  if (topPosts.length > 0) {
    const postIds = topPosts.map(post => post.post_id);
    const postsResponse = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=id,title,slug,author,published_at,featured_image_url&id=in.(${postIds.join(',')})`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    if (postsResponse.ok) {
      const posts = await postsResponse.json();
      const postsMap = new Map(posts.map((post: any) => [post.id, post]));
      
      // Combine metrics with post data
      topPosts.forEach(metrics => {
        const post = postsMap.get(metrics.post_id);
        if (post) {
          Object.assign(metrics, post);
        }
      });
    }
  }

  return { period, topPosts };
}
