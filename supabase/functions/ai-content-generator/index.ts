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
      case 'generate_content':
        result = await generateContent(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'bulk_generate':
        result = await bulkGenerateContent(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'optimize_content':
        result = await optimizeContent(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'analyze_brand_voice':
        result = await analyzeBrandVoice(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'create_brand_profile':
        result = await createBrandProfile(supabaseUrl, serviceRoleKey, userId, data);
        break;
      case 'predict_performance':
        result = await predictPerformance(supabaseUrl, serviceRoleKey, userId, data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI content generator error:', error);

    const errorResponse = {
      error: {
        code: 'AI_CONTENT_GENERATOR_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Generate intelligent content
async function generateContent(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const {
    researchReportId,
    contentType = 'blog_post',
    writingStyle = 'professional',
    targetAudience = 'general',
    brandVoiceId,
    customInstructions = '',
    seoFocus = true
  } = data;

  console.log('Generating content:', { researchReportId, contentType, writingStyle, targetAudience });

  let researchData = null;
  if (researchReportId) {
    // Get research report data
    const reportResponse = await fetch(
      `${supabaseUrl}/rest/v1/ai_research_reports?id=eq.${researchReportId}`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    if (reportResponse.ok) {
      const reports = await reportResponse.json();
      if (reports.length > 0) {
        researchData = reports[0];
      }
    }
  }

  // Get brand voice profile if specified
  let brandVoice = null;
  if (brandVoiceId) {
    const brandResponse = await fetch(
      `${supabaseUrl}/rest/v1/ai_brand_voice_profiles?id=eq.${brandVoiceId}`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    if (brandResponse.ok) {
      const brands = await brandResponse.json();
      if (brands.length > 0) {
        brandVoice = brands[0];
      }
    }
  }

  // Generate content based on research and parameters
  const generatedContent = generateContentBasedOnType(contentType, researchData, writingStyle, targetAudience, brandVoice, customInstructions, seoFocus);

  // Calculate content quality scores
  const qualityScores = calculateContentQuality(generatedContent);

  // Save generated content draft
  const contentDraft = {
    research_report_id: researchReportId,
    content_type: contentType,
    title: generatedContent.title,
    content: generatedContent.content,
    excerpt: generatedContent.excerpt,
    meta_title: generatedContent.meta_title,
    meta_description: generatedContent.meta_description,
    keywords: generatedContent.keywords,
    writing_style: writingStyle,
    target_audience: targetAudience,
    content_quality_score: qualityScores.overall,
    seo_optimization_score: qualityScores.seo,
    readability_score: qualityScores.readability,
    performance_prediction: generatePerformancePrediction(generatedContent, qualityScores),
    ai_settings: {
      content_type: contentType,
      writing_style: writingStyle,
      target_audience: targetAudience,
      brand_voice_id: brandVoiceId,
      custom_instructions: customInstructions,
      seo_focus: seoFocus,
      generation_timestamp: new Date().toISOString()
    },
    generated_by: userId
  };

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/ai_content_drafts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(contentDraft)
  });

  if (!insertResponse.ok) {
    const errorText = await insertResponse.text();
    throw new Error(`Failed to save content draft: ${errorText}`);
  }

  const savedDraft = await insertResponse.json();

  return {
    draft: savedDraft[0],
    content: generatedContent,
    quality_scores: qualityScores,
    generation_metadata: {
      research_used: !!researchReportId,
      brand_voice_applied: !!brandVoiceId,
      generation_time: new Date().toISOString()
    }
  };
}

// Generate content based on type and parameters
function generateContentBasedOnType(contentType: string, researchData: any, writingStyle: string, targetAudience: string, brandVoice: any, customInstructions: string, seoFocus: boolean) {
  const baseTitle = researchData ? researchData.title.replace('Research Report: ', '') : 'Comprehensive Guide';
  
  switch (contentType) {
    case 'blog_post':
      return generateBlogPost(baseTitle, researchData, writingStyle, targetAudience, brandVoice, seoFocus);
    case 'how_to_guide':
      return generateHowToGuide(baseTitle, researchData, writingStyle, targetAudience, brandVoice, seoFocus);
    case 'listicle':
      return generateListicle(baseTitle, researchData, writingStyle, targetAudience, brandVoice, seoFocus);
    case 'news_article':
      return generateNewsArticle(baseTitle, researchData, writingStyle, targetAudience, brandVoice, seoFocus);
    case 'case_study':
      return generateCaseStudy(baseTitle, researchData, writingStyle, targetAudience, brandVoice, seoFocus);
    default:
      return generateBlogPost(baseTitle, researchData, writingStyle, targetAudience, brandVoice, seoFocus);
  }
}

// Generate blog post content
function generateBlogPost(title: string, researchData: any, writingStyle: string, targetAudience: string, brandVoice: any, seoFocus: boolean) {
  const optimizedTitle = seoFocus ? `The Ultimate Guide to ${title}: Everything You Need to Know in 2025` : title;
  
  const content = `
# ${optimizedTitle}

## Introduction

${getIntroductionByAudience(targetAudience, title)} ${brandVoice ? applyBrandVoice(brandVoice, 'introduction') : ''}

## Key Insights

${researchData ? formatKeyFindings(researchData.key_findings) : getGenericKeyInsights(title)}

## Detailed Analysis

### Understanding the Fundamentals

${getDetailedAnalysis(title, writingStyle, targetAudience)}

### Best Practices and Strategies

${getBestPractices(title, researchData, writingStyle)}

### Common Mistakes to Avoid

${getCommonMistakes(title, targetAudience)}

### Tools and Resources

${getToolsAndResources(title, researchData)}

## Real-World Applications

${getRealWorldExamples(title, targetAudience)}

## Future Trends and Predictions

${getFutureTrends(title, researchData)}

## Conclusion

${getConclusion(title, targetAudience, brandVoice)}

## Frequently Asked Questions

${getFAQSection(title, targetAudience)}
  `.trim();

  const excerpt = `Discover everything you need to know about ${title.toLowerCase()} in this comprehensive guide. ${researchData ? 'Based on extensive research and analysis.' : 'Expert insights and practical strategies included.'}`;

  const keywords = extractKeywords(title, researchData);

  return {
    title: optimizedTitle,
    content,
    excerpt,
    meta_title: optimizedTitle.length > 60 ? title : optimizedTitle,
    meta_description: excerpt.substring(0, 160),
    keywords
  };
}

// Generate how-to guide content
function generateHowToGuide(title: string, researchData: any, writingStyle: string, targetAudience: string, brandVoice: any, seoFocus: boolean) {
  const optimizedTitle = seoFocus ? `How to ${title}: Step-by-Step Guide for ${targetAudience === 'beginners' ? 'Beginners' : 'Success'}` : `How to ${title}`;
  
  const content = `
# ${optimizedTitle}

## Overview

${getHowToIntroduction(title, targetAudience)}

## What You'll Need

- Basic understanding of the topic
- Access to relevant tools or resources
- Approximately 30-60 minutes to complete
- Willingness to learn and practice

## Step-by-Step Instructions

### Step 1: Getting Started

${getStepByStepContent(title, 1, targetAudience)}

### Step 2: Building the Foundation

${getStepByStepContent(title, 2, targetAudience)}

### Step 3: Implementation

${getStepByStepContent(title, 3, targetAudience)}

### Step 4: Optimization

${getStepByStepContent(title, 4, targetAudience)}

### Step 5: Testing and Refinement

${getStepByStepContent(title, 5, targetAudience)}

## Tips for Success

${getSuccessTips(title, targetAudience)}

## Common Pitfalls to Avoid

${getCommonPitfalls(title)}

## Advanced Techniques

${getAdvancedTechniques(title, targetAudience)}

## Conclusion

${getHowToConclusion(title, targetAudience)}
  `.trim();

  const excerpt = `Learn how to ${title.toLowerCase()} with this comprehensive step-by-step guide. Perfect for ${targetAudience} looking to master this essential skill.`;

  const keywords = [`how to ${title.toLowerCase()}`, `${title.toLowerCase()} guide`, `${title.toLowerCase()} tutorial`, ...extractKeywords(title, researchData)];

  return {
    title: optimizedTitle,
    content,
    excerpt,
    meta_title: optimizedTitle.length > 60 ? `How to ${title}` : optimizedTitle,
    meta_description: excerpt.substring(0, 160),
    keywords
  };
}

// Generate listicle content
function generateListicle(title: string, researchData: any, writingStyle: string, targetAudience: string, brandVoice: any, seoFocus: boolean) {
  const listCount = Math.floor(Math.random() * 6) + 5; // 5-10 items
  const optimizedTitle = seoFocus ? `${listCount} Essential ${title} Tips That Actually Work in 2025` : `${listCount} ${title} Tips`;
  
  let content = `
# ${optimizedTitle}

## Introduction

${getListicleIntroduction(title, listCount, targetAudience)}

`;

  // Generate list items
  for (let i = 1; i <= listCount; i++) {
    content += `
## ${i}. ${getListItem(title, i, targetAudience)}

${getListItemContent(title, i, targetAudience, writingStyle)}

`;
  }

  content += `
## Bonus Tips

${getBonusTips(title, targetAudience)}

## Conclusion

${getListicleConclusion(title, listCount, targetAudience)}
  `.trim();

  const excerpt = `Discover the top ${listCount} ${title.toLowerCase()} tips that will transform your approach. Practical, actionable advice for ${targetAudience}.`;

  const keywords = [`${title.toLowerCase()} tips`, `best ${title.toLowerCase()}`, `${title.toLowerCase()} strategies`, ...extractKeywords(title, researchData)];

  return {
    title: optimizedTitle,
    content,
    excerpt,
    meta_title: optimizedTitle.length > 60 ? `${listCount} ${title} Tips` : optimizedTitle,
    meta_description: excerpt.substring(0, 160),
    keywords
  };
}

// Generate news article content
function generateNewsArticle(title: string, researchData: any, writingStyle: string, targetAudience: string, brandVoice: any, seoFocus: boolean) {
  const optimizedTitle = seoFocus ? `Breaking: ${title} - What This Means for ${targetAudience}` : `Latest News: ${title}`;
  
  const content = `
# ${optimizedTitle}

## Breaking News Summary

${getNewsLead(title, targetAudience)}

## Key Details

${getNewsKeyDetails(title, researchData)}

## Industry Impact

${getIndustryImpact(title, targetAudience)}

## Expert Analysis

${getExpertAnalysis(title, researchData)}

## What This Means for You

${getPersonalImpact(title, targetAudience)}

## Next Steps

${getNextSteps(title, targetAudience)}

## Stay Updated

${getStayUpdatedSection(title)}
  `.trim();

  const excerpt = `Breaking news about ${title.toLowerCase()}. Get the latest updates and understand what this means for ${targetAudience}.`;

  const keywords = [`${title.toLowerCase()} news`, `latest ${title.toLowerCase()}`, `${title.toLowerCase()} update`, ...extractKeywords(title, researchData)];

  return {
    title: optimizedTitle,
    content,
    excerpt,
    meta_title: optimizedTitle.length > 60 ? `News: ${title}` : optimizedTitle,
    meta_description: excerpt.substring(0, 160),
    keywords
  };
}

// Generate case study content
function generateCaseStudy(title: string, researchData: any, writingStyle: string, targetAudience: string, brandVoice: any, seoFocus: boolean) {
  const optimizedTitle = seoFocus ? `Case Study: How We Achieved Success with ${title}` : `${title} Case Study`;
  
  const content = `
# ${optimizedTitle}

## Executive Summary

${getCaseStudySummary(title, targetAudience)}

## The Challenge

${getChallengeDescription(title, targetAudience)}

## Our Approach

${getApproachDescription(title, targetAudience)}

## Implementation

${getImplementationDetails(title, targetAudience)}

## Results and Metrics

${getResultsAndMetrics(title)}

## Key Learnings

${getKeyLearnings(title, targetAudience)}

## Recommendations

${getRecommendations(title, targetAudience)}

## Conclusion

${getCaseStudyConclusion(title, targetAudience)}
  `.trim();

  const excerpt = `Real-world case study showing how ${title.toLowerCase()} was successfully implemented. Learn from our experience and apply these insights.`;

  const keywords = [`${title.toLowerCase()} case study`, `${title.toLowerCase()} success`, `${title.toLowerCase()} example`, ...extractKeywords(title, researchData)];

  return {
    title: optimizedTitle,
    content,
    excerpt,
    meta_title: optimizedTitle.length > 60 ? `Case Study: ${title}` : optimizedTitle,
    meta_description: excerpt.substring(0, 160),
    keywords
  };
}

// Helper functions for content generation
function getIntroductionByAudience(audience: string, title: string): string {
  switch (audience) {
    case 'beginners':
      return `If you're new to ${title.toLowerCase()}, you're in the right place. This comprehensive guide will take you from zero to confident understanding.`;
    case 'professionals':
      return `As industry professionals, we know that mastering ${title.toLowerCase()} requires both theoretical knowledge and practical application.`;
    case 'experts':
      return `For seasoned practitioners in ${title.toLowerCase()}, this guide offers advanced insights and cutting-edge strategies.`;
    default:
      return `Understanding ${title.toLowerCase()} has become essential in today's rapidly evolving landscape.`;
  }
}

function formatKeyFindings(findings: string[]): string {
  return findings.map((finding, index) => `**${index + 1}.** ${finding}`).join('\n\n');
}

function getGenericKeyInsights(title: string): string {
  return `Our analysis reveals several critical insights about ${title.toLowerCase()}:\n\n**1.** Market demand continues to grow at an unprecedented rate\n\n**2.** Best practices are evolving rapidly with new technologies\n\n**3.** Success requires a strategic approach combined with practical execution\n\n**4.** Common misconceptions often lead to poor implementation\n\n**5.** Future trends indicate significant opportunities for early adopters`;
}

function getDetailedAnalysis(title: string, style: string, audience: string): string {
  const depth = audience === 'experts' ? 'deep dive into the technical aspects' : 'comprehensive overview';
  return `Let's take a ${depth} of ${title.toLowerCase()}. Understanding the core principles is essential for success, regardless of your current experience level. The fundamentals provide the foundation upon which all advanced strategies are built.`;
}

function getBestPractices(title: string, researchData: any, style: string): string {
  const practices = researchData?.content_suggestions || [
    'Focus on user experience and value delivery',
    'Implement data-driven decision making processes',
    'Maintain consistency in approach and execution',
    'Continuously monitor and optimize performance',
    'Stay updated with industry trends and innovations'
  ];
  
  return practices.map((practice, index) => `**${index + 1}.** ${practice}`).join('\n\n');
}

function getCommonMistakes(title: string, audience: string): string {
  return `Even experienced practitioners make mistakes with ${title.toLowerCase()}. Here are the most common pitfalls to avoid:\n\n• Rushing implementation without proper planning\n• Ignoring user feedback and market research\n• Focusing on tactics instead of strategy\n• Neglecting performance measurement and optimization\n• Following outdated best practices`;
}

function getToolsAndResources(title: string, researchData: any): string {
  return `Having the right tools makes all the difference in ${title.toLowerCase()}. Here are our top recommendations:\n\n**Essential Tools:**\n• Industry-standard software solutions\n• Analytics and measurement platforms\n• Collaboration and project management tools\n\n**Learning Resources:**\n• Official documentation and guides\n• Community forums and discussion groups\n• Professional courses and certifications`;
}

function getRealWorldExamples(title: string, audience: string): string {
  return `To better understand how ${title.toLowerCase()} works in practice, let's examine real-world scenarios. These examples demonstrate the principles in action and show how theory translates to practical results.`;
}

function getFutureTrends(title: string, researchData: any): string {
  return `The future of ${title.toLowerCase()} is exciting and full of opportunities. Based on current trends and emerging technologies, we can expect significant developments in the coming years. Early adopters who prepare now will have a competitive advantage.`;
}

function getConclusion(title: string, audience: string, brandVoice: any): string {
  const voiceElement = brandVoice ? applyBrandVoice(brandVoice, 'conclusion') : '';
  return `Mastering ${title.toLowerCase()} requires dedication, practice, and continuous learning. By following the strategies outlined in this guide, you'll be well-equipped to achieve success. ${voiceElement}`;
}

function getFAQSection(title: string, audience: string): string {
  return `**Q: How long does it take to master ${title.toLowerCase()}?**\nA: The timeline varies depending on your background and goals, but most people see significant progress within 3-6 months of consistent practice.\n\n**Q: What's the most important factor for success?**\nA: Consistent application of best practices combined with continuous learning and adaptation.\n\n**Q: Are there any prerequisites I should know about?**\nA: While prior experience helps, this guide is designed to be accessible to learners at all levels.`;
}

function extractKeywords(title: string, researchData: any): string[] {
  const baseKeywords = title.toLowerCase().split(' ');
  const researchKeywords = researchData?.seo_opportunities?.primary_keywords || [];
  return [...new Set([...baseKeywords, ...researchKeywords])];
}

function applyBrandVoice(brandVoice: any, section: string): string {
  const tone = brandVoice.tone || 'professional';
  const personality = brandVoice.brand_personality || {};
  
  switch (section) {
    case 'introduction':
      return tone === 'friendly' ? 'We are excited to share this knowledge with you!' : 'Our team has compiled these insights based on extensive research.';
    case 'conclusion':
      return tone === 'friendly' ? 'We hope you have found this guide helpful!' : 'We trust this information will support your professional goals.';
    default:
      return '';
  }
}

// Additional helper functions for different content types
function getHowToIntroduction(title: string, audience: string): string {
  return `In this step-by-step guide, you'll learn exactly how to ${title.toLowerCase()}. Whether you're a ${audience === 'beginners' ? 'complete beginner' : 'seasoned professional'}, this guide will provide clear, actionable instructions.`;
}

function getStepByStepContent(title: string, step: number, audience: string): string {
  const steps = {
    1: `Begin by establishing a solid foundation. This involves understanding the core concepts and gathering the necessary resources.`,
    2: `Build upon your foundation by implementing the basic framework. Take time to ensure each component is properly configured.`,
    3: `Now it's time to put everything into action. Follow the established procedures while monitoring for any issues.`,
    4: `Fine-tune your implementation for optimal performance. This is where experience and attention to detail make a difference.`,
    5: `Test thoroughly and make refinements based on your results. Continuous improvement is key to long-term success.`
  };
  return steps[step] || 'Continue following the established process and best practices.';
}

function getListicleIntroduction(title: string, count: number, audience: string): string {
  return `Ready to master ${title.toLowerCase()}? We've compiled ${count} proven strategies that will transform your approach. These aren't just theories – they're practical tips that deliver real results.`;
}

function getListItem(title: string, index: number, audience: string): string {
  const items = [
    'Start with a solid strategy',
    'Focus on user experience',
    'Measure and analyze performance',
    'Optimize continuously',
    'Stay current with trends',
    'Build strong foundations',
    'Implement best practices',
    'Learn from mistakes',
    'Seek expert guidance',
    'Practice consistently'
  ];
  return items[index - 1] || `Essential technique #${index}`;
}

function getListItemContent(title: string, index: number, audience: string, style: string): string {
  return `This fundamental principle of ${title.toLowerCase()} cannot be overlooked. By implementing this approach, you'll see immediate improvements in your results. The key is consistent application and attention to detail.`;
}

// Calculate content quality scores
function calculateContentQuality(content: any): any {
  const contentLength = content.content.length;
  const titleOptimization = content.title.length > 30 && content.title.length < 70 ? 100 : 80;
  const keywordDensity = calculateKeywordDensity(content.content, content.keywords);
  const readabilityScore = calculateReadabilityScore(content.content);
  
  return {
    overall: Math.floor((titleOptimization + keywordDensity + readabilityScore) / 3),
    seo: Math.floor((titleOptimization + keywordDensity + (content.meta_description.length > 120 ? 100 : 80)) / 3),
    readability: readabilityScore,
    content_length: contentLength > 1500 ? 95 : contentLength > 800 ? 80 : 65
  };
}

function calculateKeywordDensity(content: string, keywords: string[]): number {
  const wordCount = content.split(' ').length;
  const keywordCount = keywords.reduce((count, keyword) => {
    const regex = new RegExp(keyword, 'gi');
    const matches = content.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  const density = (keywordCount / wordCount) * 100;
  return density > 1 && density < 3 ? 95 : density > 0.5 && density < 5 ? 80 : 65;
}

function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/);
  const avgWordsPerSentence = words.length / sentences.length;
  
  // Flesch Reading Ease approximation
  if (avgWordsPerSentence < 15) return 90;
  if (avgWordsPerSentence < 20) return 80;
  if (avgWordsPerSentence < 25) return 70;
  return 60;
}

// Generate performance prediction
function generatePerformancePrediction(content: any, qualityScores: any): any {
  const baseScore = qualityScores.overall;
  
  return {
    estimated_pageviews: Math.floor(baseScore * 100 + Math.random() * 1000),
    estimated_engagement_rate: Math.floor(baseScore * 0.5 + Math.random() * 20),
    seo_ranking_potential: baseScore > 85 ? 'high' : baseScore > 70 ? 'medium' : 'low',
    social_sharing_potential: qualityScores.readability > 80 ? 'high' : 'medium',
    content_performance_score: baseScore,
    prediction_confidence: 85
  };
}

// Bulk generate content
async function bulkGenerateContent(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { topics, contentTypes, writingStyle, targetAudience, brandVoiceId } = data;

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    throw new Error('Topics array is required for bulk generation');
  }

  console.log(`Bulk generating ${topics.length} pieces of content`);

  const results = [];
  
  for (const topic of topics) {
    try {
      const contentType = Array.isArray(contentTypes) ? contentTypes[Math.floor(Math.random() * contentTypes.length)] : 'blog_post';
      
      const result = await generateContent(supabaseUrl, serviceRoleKey, userId, {
        researchReportId: topic.research_report_id,
        contentType,
        writingStyle,
        targetAudience,
        brandVoiceId,
        seoFocus: true
      });
      
      results.push({ topic_id: topic.id, success: true, draft: result.draft });
    } catch (error) {
      results.push({ topic_id: topic.id, success: false, error: error.message });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return {
    results,
    summary: {
      total_requested: topics.length,
      successful: successCount,
      failed: failureCount,
      success_rate: Math.floor((successCount / topics.length) * 100)
    },
    generated_at: new Date().toISOString()
  };
}

// Optimize existing content
async function optimizeContent(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { contentId, optimizationType = 'full' } = data;

  if (!contentId) {
    throw new Error('Content ID is required for optimization');
  }

  console.log('Optimizing content:', contentId, 'type:', optimizationType);

  // Get existing content
  const contentResponse = await fetch(
    `${supabaseUrl}/rest/v1/ai_content_drafts?id=eq.${contentId}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  if (!contentResponse.ok) {
    throw new Error('Content not found');
  }

  const contents = await contentResponse.json();
  if (contents.length === 0) {
    throw new Error('Content not found');
  }

  const content = contents[0];
  const originalScores = {
    content_quality_score: content.content_quality_score,
    seo_optimization_score: content.seo_optimization_score,
    readability_score: content.readability_score
  };

  // Generate optimization suggestions
  const optimizations = generateOptimizationSuggestions(content, optimizationType);
  
  // Apply optimizations (simulate improved scores)
  const optimizedScores = {
    content_quality_score: Math.min(100, originalScores.content_quality_score + 10),
    seo_optimization_score: Math.min(100, originalScores.seo_optimization_score + 15),
    readability_score: Math.min(100, originalScores.readability_score + 8)
  };

  // Save optimization record
  const optimizationRecord = {
    content_id: contentId,
    content_type: content.content_type,
    optimization_type: optimizationType,
    original_score: originalScores.content_quality_score,
    optimized_score: optimizedScores.content_quality_score,
    suggestions: optimizations.suggestions,
    performance_metrics: optimizations.performance_metrics,
    seo_improvements: optimizations.seo_improvements,
    readability_improvements: optimizations.readability_improvements,
    engagement_predictions: optimizations.engagement_predictions,
    created_by: userId
  };

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/ai_content_optimization`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(optimizationRecord)
  });

  if (!insertResponse.ok) {
    const errorText = await insertResponse.text();
    throw new Error(`Failed to save optimization: ${errorText}`);
  }

  const savedOptimization = await insertResponse.json();

  return {
    optimization: savedOptimization[0],
    original_scores: originalScores,
    optimized_scores: optimizedScores,
    improvements: optimizations,
    optimization_date: new Date().toISOString()
  };
}

// Generate optimization suggestions
function generateOptimizationSuggestions(content: any, type: string): any {
  return {
    suggestions: {
      title: 'Consider adding power words and year (2025) for better CTR',
      meta_description: 'Include primary keyword and compelling call-to-action',
      content_structure: 'Add more subheadings for better readability',
      keyword_optimization: 'Increase semantic keyword usage throughout content',
      internal_linking: 'Add 3-5 relevant internal links to related content',
      visual_elements: 'Include images, charts, or infographics for engagement'
    },
    performance_metrics: {
      estimated_improvement: '+25% organic traffic',
      ctr_boost: '+15% click-through rate',
      engagement_increase: '+30% time on page',
      bounce_rate_reduction: '-20% bounce rate'
    },
    seo_improvements: {
      keyword_density: 'Optimize for 1-2% keyword density',
      meta_tags: 'Enhance meta title and description',
      header_structure: 'Improve H1-H6 hierarchy',
      schema_markup: 'Add relevant structured data'
    },
    readability_improvements: {
      sentence_length: 'Shorten complex sentences',
      paragraph_structure: 'Break long paragraphs into shorter ones',
      transition_words: 'Add more connecting phrases',
      active_voice: 'Convert passive voice to active voice'
    },
    engagement_predictions: {
      social_shares: '+40% increase expected',
      comments: '+25% more user engagement',
      email_signups: '+35% conversion improvement',
      return_visitors: '+20% repeat readership'
    }
  };
}

// Analyze brand voice from existing content
async function analyzeBrandVoice(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { sampleContent, contentUrls } = data;

  if (!sampleContent && (!contentUrls || contentUrls.length === 0)) {
    throw new Error('Sample content or content URLs required for brand voice analysis');
  }

  console.log('Analyzing brand voice from provided content');

  // Simulate brand voice analysis
  const analysis = {
    tone_analysis: {
      primary_tone: 'professional',
      secondary_tone: 'informative',
      confidence_score: 87,
      tone_consistency: 92
    },
    writing_style: {
      sentence_structure: 'balanced',
      vocabulary_level: 'intermediate',
      writing_complexity: 'moderate',
      preferred_person: 'third_person'
    },
    brand_personality: {
      authoritative: 85,
      friendly: 65,
      innovative: 78,
      trustworthy: 90,
      approachable: 72
    },
    vocabulary_preferences: [
      'comprehensive', 'innovative', 'strategic', 'effective', 'professional',
      'expert', 'proven', 'successful', 'advanced', 'practical'
    ],
    content_patterns: {
      avg_sentence_length: 18,
      avg_paragraph_length: 4,
      use_of_questions: 'moderate',
      use_of_lists: 'frequent',
      use_of_examples: 'common'
    },
    recommendations: {
      maintain_consistency: 'Keep professional tone with informative approach',
      enhance_engagement: 'Consider adding more interactive elements',
      improve_accessibility: 'Vary sentence length for better readability',
      strengthen_brand: 'Emphasize unique value propositions more clearly'
    }
  };

  return {
    voice_analysis: analysis,
    sample_content_analyzed: sampleContent ? sampleContent.length : contentUrls.length,
    analysis_date: new Date().toISOString(),
    confidence_score: analysis.tone_analysis.confidence_score
  };
}

// Create brand voice profile
async function createBrandProfile(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { name, description, voiceAnalysis, isDefault = false } = data;

  if (!name || !voiceAnalysis) {
    throw new Error('Profile name and voice analysis required');
  }

  console.log('Creating brand voice profile:', name);

  const brandProfile = {
    name,
    description: description || `Brand voice profile based on content analysis`,
    tone: voiceAnalysis.tone_analysis?.primary_tone || 'professional',
    writing_style: voiceAnalysis.writing_style?.sentence_structure || 'balanced',
    vocabulary_preferences: voiceAnalysis.vocabulary_preferences || [],
    sentence_structure: voiceAnalysis.writing_style?.sentence_structure || 'balanced',
    brand_personality: voiceAnalysis.brand_personality || {},
    sample_content: [],
    learned_patterns: voiceAnalysis.content_patterns || {},
    usage_guidelines: `Apply ${voiceAnalysis.tone_analysis?.primary_tone || 'professional'} tone with ${voiceAnalysis.writing_style?.vocabulary_level || 'intermediate'} vocabulary level`,
    is_default: isDefault,
    created_by: userId
  };

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/ai_brand_voice_profiles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(brandProfile)
  });

  if (!insertResponse.ok) {
    const errorText = await insertResponse.text();
    throw new Error(`Failed to create brand profile: ${errorText}`);
  }

  const savedProfile = await insertResponse.json();

  return {
    profile: savedProfile[0],
    analysis_used: voiceAnalysis,
    created_date: new Date().toISOString()
  };
}

// Predict content performance
async function predictPerformance(supabaseUrl: string, serviceRoleKey: string, userId: string, data: any) {
  const { contentDraftId, publishDate } = data;

  if (!contentDraftId) {
    throw new Error('Content draft ID required for performance prediction');
  }

  console.log('Predicting performance for content:', contentDraftId);

  // Get content draft
  const contentResponse = await fetch(
    `${supabaseUrl}/rest/v1/ai_content_drafts?id=eq.${contentDraftId}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  if (!contentResponse.ok) {
    throw new Error('Content draft not found');
  }

  const contents = await contentResponse.json();
  if (contents.length === 0) {
    throw new Error('Content draft not found');
  }

  const content = contents[0];
  
  // Generate performance predictions
  const predictions = {
    seo_performance: {
      estimated_ranking: content.seo_optimization_score > 80 ? 'top-10' : content.seo_optimization_score > 60 ? 'top-20' : 'top-50',
      organic_traffic_potential: Math.floor(content.seo_optimization_score * 150),
      keyword_ranking_probability: content.seo_optimization_score + '%',
      search_visibility_score: content.seo_optimization_score
    },
    engagement_metrics: {
      estimated_pageviews: Math.floor(content.content_quality_score * 100 + Math.random() * 1000),
      time_on_page: `${Math.floor(content.readability_score / 10 + 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      bounce_rate: `${100 - content.readability_score}%`,
      social_shares: Math.floor(content.content_quality_score / 2),
      comment_potential: content.readability_score > 80 ? 'high' : 'medium'
    },
    conversion_potential: {
      email_signup_rate: `${(content.content_quality_score / 10).toFixed(1)}%`,
      cta_click_rate: `${(content.seo_optimization_score / 8).toFixed(1)}%`,
      lead_generation_score: Math.floor((content.content_quality_score + content.seo_optimization_score) / 2),
      revenue_potential: content.content_quality_score > 85 ? 'high' : 'medium'
    },
    overall_performance: {
      success_probability: Math.floor((content.content_quality_score + content.seo_optimization_score + content.readability_score) / 3),
      recommendation: content.content_quality_score > 80 ? 'Publish immediately' : 'Consider optimization before publishing',
      expected_roi: content.content_quality_score > 85 ? 'Very High' : content.content_quality_score > 70 ? 'High' : 'Medium',
      confidence_level: '87%'
    }
  };

  return {
    content_id: contentDraftId,
    predictions,
    analysis_factors: {
      content_quality: content.content_quality_score,
      seo_optimization: content.seo_optimization_score,
      readability: content.readability_score,
      content_type: content.content_type,
      target_audience: content.target_audience
    },
    prediction_date: new Date().toISOString(),
    publish_recommendation: publishDate ? `Schedule for ${publishDate}` : predictions.overall_performance.recommendation
  };
}
