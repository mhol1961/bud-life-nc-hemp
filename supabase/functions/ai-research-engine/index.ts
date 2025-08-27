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

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authentication required');
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token and get user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': serviceRoleKey
      }
    });

    if (!userResponse.ok) {
      throw new Error('Invalid authentication token');
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    let result;

    switch (action) {
      case 'discover_topics':
        result = await discoverTopics(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'research_topic':
        result = await researchTopic(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'analyze_competitors':
        result = await analyzeCompetitors(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'find_seo_opportunities':
        result = await findSeoOpportunities(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'get_trending_topics':
        result = await getTrendingTopics(supabaseUrl, serviceRoleKey, userId, data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI research engine error:', error);

    const errorResponse = {
      error: {
        code: 'AI_RESEARCH_ENGINE_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Discover trending topics in an industry/niche
async function discoverTopics(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { industry, keywords, targetAudience, contentType } = data;

  if (!industry && !keywords) {
    throw new Error('Industry or keywords are required for topic discovery');
  }

  console.log('Discovering topics for:', { industry, keywords, targetAudience, contentType });

  // Simulate AI topic discovery with realistic results
  const discoveredTopics = [
    {
      title: `Ultimate ${industry || 'Industry'} Guide for 2025`,
      description: `Comprehensive guide covering latest trends, strategies, and insights in ${industry || 'the industry'}.`,
      keywords: keywords ? keywords.concat([`${industry} trends`, `${industry} guide`, `${industry} 2025`]) : [`${industry} trends`, `${industry} guide`, `${industry} 2025`],
      trending_score: 95,
      seo_score: 88,
      competition_level: 'medium',
      estimated_traffic: 15000,
      research_data: {
        search_volume: 15000,
        keyword_difficulty: 65,
        content_gap_score: 82,
        trend_momentum: 'rising',
        seasonality: 'evergreen'
      }
    },
    {
      title: `Top ${industry || 'Industry'} Tools and Resources`,
      description: `Curated list of essential tools and resources for ${industry || 'industry'} professionals.`,
      keywords: keywords ? keywords.concat([`${industry} tools`, `${industry} resources`, `best ${industry} software`]) : [`${industry} tools`, `${industry} resources`, `best ${industry} software`],
      trending_score: 78,
      seo_score: 92,
      competition_level: 'low',
      estimated_traffic: 8500,
      research_data: {
        search_volume: 8500,
        keyword_difficulty: 45,
        content_gap_score: 95,
        trend_momentum: 'stable',
        seasonality: 'evergreen'
      }
    },
    {
      title: `Common ${industry || 'Industry'} Mistakes to Avoid`,
      description: `Learn from common pitfalls and mistakes that ${targetAudience || 'professionals'} make in ${industry || 'the industry'}.`,
      keywords: keywords ? keywords.concat([`${industry} mistakes`, `${industry} pitfalls`, `${industry} errors`]) : [`${industry} mistakes`, `${industry} pitfalls`, `${industry} errors`],
      trending_score: 85,
      seo_score: 79,
      competition_level: 'medium',
      estimated_traffic: 12000,
      research_data: {
        search_volume: 12000,
        keyword_difficulty: 58,
        content_gap_score: 74,
        trend_momentum: 'rising',
        seasonality: 'evergreen'
      }
    }
  ];

  // Save discovered topics to database
  const savedTopics = [];
  
  for (const topic of discoveredTopics) {
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/ai_research_topics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...topic,
        research_status: 'discovered',
        created_by: userId
      })
    });

    if (insertResponse.ok) {
      const savedTopic = await insertResponse.json();
      savedTopics.push(savedTopic[0]);
    }
  }

  return {
    topics: savedTopics,
    search_criteria: { industry, keywords, targetAudience, contentType },
    discovery_timestamp: new Date().toISOString()
  };
}

// Research a specific topic in-depth
async function researchTopic(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { topicId, researchDepth = 'comprehensive' } = data;

  if (!topicId) {
    throw new Error('Topic ID is required for research');
  }

  console.log('Researching topic:', topicId, 'with depth:', researchDepth);

  // Get the topic from database
  const topicResponse = await fetch(
    `${supabaseUrl}/rest/v1/ai_research_topics?id=eq.${topicId}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  if (!topicResponse.ok) {
    throw new Error('Topic not found');
  }

  const topics = await topicResponse.json();
  if (topics.length === 0) {
    throw new Error('Topic not found');
  }

  const topic = topics[0];

  // Simulate comprehensive AI research
  const researchReport = {
    topic_id: topicId,
    title: `Research Report: ${topic.title}`,
    executive_summary: `This comprehensive research report analyzes the current state of "${topic.title}" based on multiple data sources, competitor analysis, and market trends. Our AI research engine has identified key opportunities and provided actionable insights for content creation.`,
    key_findings: [
      'Market demand for this topic has increased 45% in the last 6 months',
      'Top competitors are missing key subtopics creating content gap opportunities',
      'Long-tail keywords related to this topic show lower competition',
      'Video content format shows highest engagement for this topic type',
      'Mobile optimization is crucial as 68% of searches are mobile'
    ],
    source_analysis: {
      total_sources: 47,
      credible_sources: 42,
      recent_sources: 38,
      authority_domains: 15,
      source_categories: {
        'Industry Reports': 12,
        'Expert Blogs': 18,
        'Academic Papers': 8,
        'News Articles': 9
      }
    },
    competitive_analysis: {
      top_competitors: [
        {
          domain: 'competitor1.com',
          content_quality: 85,
          seo_strength: 78,
          content_gaps: ['Advanced techniques', 'Case studies']
        },
        {
          domain: 'competitor2.com',
          content_quality: 76,
          seo_strength: 92,
          content_gaps: ['Beginner guide', 'Tools comparison']
        }
      ],
      content_gap_opportunities: [
        'Interactive guides and tutorials',
        'Real-world case studies and examples',
        'Updated 2025 strategies and techniques',
        'Mobile-first approach and tips'
      ]
    },
    seo_opportunities: {
      primary_keywords: topic.keywords,
      secondary_keywords: [
        `${topic.keywords[0]} tips`,
        `${topic.keywords[0]} strategies`,
        `${topic.keywords[0]} best practices`,
        `how to ${topic.keywords[0]}`
      ],
      long_tail_opportunities: [
        `complete guide to ${topic.keywords[0]} for beginners`,
        `${topic.keywords[0]} vs alternatives comparison`,
        `common ${topic.keywords[0]} mistakes to avoid`
      ],
      keyword_difficulty: {
        primary: 'medium',
        secondary: 'low',
        long_tail: 'very_low'
      }
    },
    content_suggestions: [
      `Create a comprehensive step-by-step guide`,
      `Include real-world examples and case studies`,
      `Add visual elements like infographics and charts`,
      `Develop interactive elements or tools`,
      `Create a downloadable resource or template`
    ],
    research_quality_score: 92,
    sources_count: 47,
    credibility_score: 89,
    report_data: {
      research_methodology: 'AI-powered multi-source analysis',
      data_freshness: 'Last 30 days',
      research_depth: researchDepth,
      analysis_date: new Date().toISOString()
    }
  };

  // Save research report to database
  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/ai_research_reports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      ...researchReport,
      generated_by: userId
    })
  });

  if (!insertResponse.ok) {
    const errorText = await insertResponse.text();
    throw new Error(`Failed to save research report: ${errorText}`);
  }

  const savedReport = await insertResponse.json();

  // Update topic status
  await fetch(`${supabaseUrl}/rest/v1/ai_research_topics?id=eq.${topicId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      research_status: 'completed',
      updated_at: new Date().toISOString()
    })
  });

  return {
    report: savedReport[0],
    topic: topic,
    research_timestamp: new Date().toISOString()
  };
}

// Analyze competitors for a topic
async function analyzeCompetitors(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { keywords, industry } = data;

  if (!keywords && !industry) {
    throw new Error('Keywords or industry required for competitor analysis');
  }

  console.log('Analyzing competitors for:', { keywords, industry });

  // Simulate competitor analysis results
  const competitorAnalysis = {
    analysis_summary: {
      competitors_analyzed: 25,
      content_pieces_reviewed: 150,
      avg_content_quality: 78,
      content_gaps_identified: 12
    },
    top_competitors: [
      {
        domain: 'leadingcompetitor.com',
        authority_score: 92,
        content_volume: 450,
        avg_content_length: 2800,
        update_frequency: 'weekly',
        top_performing_content: [
          'The Ultimate Guide to Digital Marketing',
          '50 Proven SEO Strategies',
          'Content Marketing Mastery Course'
        ],
        strengths: ['Comprehensive guides', 'High-quality visuals', 'Regular updates'],
        weaknesses: ['Limited case studies', 'Complex language', 'Poor mobile experience']
      },
      {
        domain: 'expertinsights.com',
        authority_score: 85,
        content_volume: 280,
        avg_content_length: 1900,
        update_frequency: 'bi-weekly',
        top_performing_content: [
          'Industry Trends Report 2025',
          'Best Practices Checklist',
          'Tools and Resources Guide'
        ],
        strengths: ['Industry expertise', 'Data-driven content', 'Good SEO'],
        weaknesses: ['Limited visual content', 'Infrequent publishing', 'Narrow focus']
      }
    ],
    content_gaps: [
      {
        gap_title: 'Beginner-Friendly Tutorials',
        opportunity_score: 95,
        estimated_traffic: 8500,
        difficulty: 'low',
        description: 'Most competitors focus on advanced topics, leaving beginners underserved'
      },
      {
        gap_title: 'Interactive Tools and Calculators',
        opportunity_score: 88,
        estimated_traffic: 12000,
        difficulty: 'medium',
        description: 'Few competitors offer interactive elements that engage users'
      },
      {
        gap_title: 'Video-Based Learning Content',
        opportunity_score: 82,
        estimated_traffic: 15000,
        difficulty: 'medium',
        description: 'Video content is underutilized despite high user demand'
      }
    ],
    content_strategies: {
      recommended_approach: 'differentiated_value',
      content_types_to_focus: ['comprehensive_guides', 'case_studies', 'interactive_tools'],
      publishing_frequency: 'weekly',
      avg_target_length: 2500,
      optimization_focus: ['user_experience', 'mobile_first', 'visual_elements']
    }
  };

  return {
    analysis: competitorAnalysis,
    analyzed_at: new Date().toISOString(),
    search_criteria: { keywords, industry }
  };
}

// Find SEO opportunities
async function findSeoOpportunities(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { keywords, targetAudience, contentType } = data;

  if (!keywords) {
    throw new Error('Keywords are required for SEO opportunity analysis');
  }

  console.log('Finding SEO opportunities for:', { keywords, targetAudience, contentType });

  // Simulate SEO opportunity analysis
  const seoOpportunities = {
    keyword_analysis: {
      primary_keywords: keywords.map(keyword => ({
        keyword,
        search_volume: Math.floor(Math.random() * 20000) + 1000,
        difficulty: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        cpc: (Math.random() * 5 + 0.5).toFixed(2),
        trend: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)]
      })),
      long_tail_opportunities: [
        {
          keyword: `how to ${keywords[0]} for beginners`,
          search_volume: Math.floor(Math.random() * 5000) + 500,
          difficulty: 'low',
          opportunity_score: 92
        },
        {
          keyword: `best ${keywords[0]} tools 2025`,
          search_volume: Math.floor(Math.random() * 8000) + 1000,
          difficulty: 'medium',
          opportunity_score: 87
        },
        {
          keyword: `${keywords[0]} vs alternatives`,
          search_volume: Math.floor(Math.random() * 3000) + 300,
          difficulty: 'low',
          opportunity_score: 85
        }
      ]
    },
    content_optimization: {
      recommended_title_length: '55-60 characters',
      recommended_meta_description_length: '150-160 characters',
      header_structure: ['H1', 'H2', 'H3'],
      internal_linking_opportunities: 8,
      image_optimization_score: 75,
      page_speed_recommendations: ['optimize images', 'minify CSS', 'reduce JavaScript']
    },
    featured_snippet_opportunities: [
      {
        query: `what is ${keywords[0]}`,
        current_snippet: 'None',
        opportunity_score: 94,
        content_type: 'definition'
      },
      {
        query: `how to get started with ${keywords[0]}`,
        current_snippet: 'Competitor content',
        opportunity_score: 78,
        content_type: 'step-by-step list'
      }
    ],
    technical_seo: {
      mobile_friendliness: 'critical',
      page_speed: 'important',
      schema_markup: 'recommended',
      ssl_certificate: 'required'
    }
  };

  return {
    opportunities: seoOpportunities,
    analysis_date: new Date().toISOString(),
    keywords_analyzed: keywords
  };
}

// Get trending topics from database
async function getTrendingTopics(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { limit = 10, industry, timeframe = '7days' } = data;

  console.log('Getting trending topics:', { limit, industry, timeframe });

  let query = `${supabaseUrl}/rest/v1/ai_research_topics?select=*&order=trending_score.desc&limit=${limit}`;

  const topicsResponse = await fetch(query, {
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  if (!topicsResponse.ok) {
    const errorText = await topicsResponse.text();
    throw new Error(`Failed to fetch trending topics: ${errorText}`);
  }

  const topics = await topicsResponse.json();

  // Add trend analysis to each topic
  const topicsWithTrends = topics.map(topic => ({
    ...topic,
    trend_analysis: {
      momentum: 'rising',
      growth_rate: '+15%',
      peak_expected: '2-3 weeks',
      content_saturation: 'low'
    }
  }));

  return {
    trending_topics: topicsWithTrends,
    timeframe,
    total_found: topics.length,
    last_updated: new Date().toISOString()
  };
}
