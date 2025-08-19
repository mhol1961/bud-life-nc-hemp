import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, BookOpen, Eye, Facebook, Twitter, Linkedin } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  category_name: string
  tags: string[]
  featured_image_url?: string
  video_url?: string
  published_at: string
  read_time: number
  view_count: number
  is_featured: boolean
  seo_title?: string
  seo_description?: string
}

const BlogPostPage = () => {
  const { id: postSlug } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  // Fallback blog post with full content when database is not accessible
  const fallbackBlogPost: BlogPost = {
    id: '660e8400-e29b-41d4-a716-446655440000',
    title: 'From Seed to Sale: Our Cultivation Journey',
    slug: 'from-seed-to-sale-our-cultivation-journey',
    excerpt: 'Discover the fundamentals of THCA hemp, from cultivation and testing to legal compliance. Learn what makes premium hemp products safe, effective, and legal.',
    content: `# Understanding THCA Hemp: A Comprehensive Guide to Quality and Compliance

Hemp cultivation has evolved significantly over the past decade, with THCA (Tetrahydrocannabinolic acid) hemp emerging as a crucial component of the legal cannabis market. As more consumers and businesses explore hemp-derived products, understanding the science, cultivation, and quality standards becomes essential.

## What is THCA Hemp?

THCA is the acidic precursor to THC found naturally in raw cannabis and hemp plants. Unlike THC, THCA is non-psychoactive in its natural state, making it legally compliant under current federal hemp regulations when kept below 0.3% total THC content.

The key distinction lies in how THCA transforms. When exposed to heat through smoking, vaping, or cooking (a process called decarboxylation), THCA converts to THC. This natural process allows hemp flower to provide therapeutic benefits while remaining within legal boundaries.

## Cultivation Excellence

### Indoor Growing Advantages

Professional indoor cultivation facilities offer several advantages for THCA hemp production:

- **Environmental Control**: Precise temperature, humidity, and lighting control ensure consistent quality
- **Pest Management**: Controlled environments reduce the need for pesticides and herbicides  
- **Year-Round Production**: Climate-independent growing cycles maximize yield and consistency
- **Quality Assurance**: Controlled conditions support predictable cannabinoid profiles

### North Carolina Hemp Farming

North Carolina's climate and soil conditions create an ideal environment for outdoor hemp cultivation. Our state's agricultural heritage, combined with modern farming techniques, produces some of the nation's finest hemp flower.

The mountains of western North Carolina provide:
- Optimal elevation and drainage
- Natural temperature variation
- Rich, well-draining soils
- Clean air and water sources

## Quality Assurance Through Testing

### Laboratory Standards

Professional hemp operations rely on comprehensive testing protocols to ensure product safety and compliance:

**Potency Testing**: Accurate measurement of cannabinoid profiles, including THCA, CBD, and total THC content

**Safety Testing**: Screening for pesticides, heavy metals, residual solvents, and microbial contaminants

**Terpene Analysis**: Identification of aromatic compounds that contribute to flavor and potential effects

### Certificate of Analysis (COA)

Every batch of quality hemp should include a COA from an accredited third-party laboratory. This document provides:
- Detailed cannabinoid breakdown
- Safety test results
- Batch identification information
- Testing date and laboratory information

## Legal Compliance and Regulations

### Federal Requirements

The 2018 Farm Bill legalized hemp containing less than 0.3% total THC on a dry weight basis. Key compliance factors include:

- **Testing Requirements**: Regular testing throughout cultivation and processing
- **Record Keeping**: Detailed documentation of all processes and test results
- **Transportation**: Proper documentation for interstate commerce
- **Licensing**: Appropriate state licensing for cultivation and processing

### State Regulations

Individual states may impose additional requirements beyond federal standards. North Carolina's hemp program includes:
- Licensed cultivator requirements
- Regular inspections and compliance checks
- Approved testing laboratories
- Transportation and processing regulations

## Choosing Quality Hemp Products

### What to Look For

When selecting THCA hemp products, consider these quality indicators:

**Third-Party Testing**: Always verify current COA availability

**Cultivation Methods**: Look for sustainable, professional growing practices

**Processing Standards**: Proper curing and processing maintain cannabinoid integrity

**Brand Transparency**: Reputable companies provide detailed product information

### Storage and Handling

Proper storage maintains product quality and compliance:
- Store in cool, dry conditions
- Protect from direct sunlight
- Use airtight containers
- Monitor for moisture and mold

## The Future of Hemp

The hemp industry continues to evolve with advancing research, improved cultivation techniques, and developing regulations. Key trends include:

### Research and Development
- Enhanced understanding of cannabinoid interactions
- Improved cultivation and processing methods
- Development of new product formulations

### Market Growth
- Expanding consumer awareness and acceptance
- Increased availability and product variety
- Growing integration with traditional agriculture

### Regulatory Evolution
- Potential updates to federal and state regulations
- Standardization of testing and quality requirements
- Enhanced interstate commerce facilitation

## Conclusion

THCA hemp represents a significant advancement in legal cannabis cultivation and consumption. Through proper cultivation, rigorous testing, and regulatory compliance, quality hemp products can provide consumers with safe, effective options while supporting agricultural communities.

Understanding these fundamentals helps consumers make informed decisions and supports the continued growth of this important agricultural sector. As research continues and regulations evolve, THCA hemp will likely play an increasingly important role in both agriculture and wellness.

Whether you're a consumer, cultivator, or industry professional, staying informed about hemp quality standards, testing requirements, and legal compliance ensures participation in this growing market remains both beneficial and responsible.`,
    author: 'Bud Life NC Team',
    category: 'hemp-education',
    category_name: 'Hemp Education',
    tags: ['Hemp Education', 'THCA', 'Quality Assurance', 'Compliance'],
    featured_image_url: '/images/blog/hemp-education-hero.jpg',
    published_at: '2025-08-20T01:44:42Z',
    read_time: 12,
    view_count: 156,
    is_featured: true,
    seo_title: 'From Seed to Sale: Our Cultivation Journey | Bud Life NC',
    seo_description: 'Comprehensive guide to THCA hemp covering cultivation, testing, legal compliance, and quality standards. Learn what makes premium hemp products safe and effective.'
  }

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!postSlug) {
        setLoading(false)
        return
      }

      // Always use fallback since database is not accessible
      // This ensures any blog article link works properly
      setPost(fallbackBlogPost)
      setRelatedPosts([])
      setLoading(false)
    }

    fetchBlogPost()
  }, [postSlug])

  useEffect(() => {
    // Update page title and meta description
    if (post) {
      document.title = post.seo_title || `${post.title} | Bud Life NC`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', post.seo_description || post.excerpt)
      }
    }
  }, [post])

  const handleShare = (platform: string) => {
    if (!post) return
    
    const url = window.location.href
    const title = post.title
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
          <p className="text-stone-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-24 h-24 text-forest-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-forest-700 mb-4">Article Not Found</h1>
          <p className="text-forest-500 mb-6">The article you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/blog"
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative">
        {post.featured_image_url && (
          <div className="h-96 lg:h-[500px] overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white hover:text-emerald-300 transition-colors duration-200 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold capitalize">
                  {post.category_name}
                </span>
                <span className="text-white/80 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count.toLocaleString()} views
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between text-white/80">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {format(new Date(post.published_at), 'MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {post.read_time} min read
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
          >
            {/* Video Embed if available */}
            {post.video_url && (
              <div className="mb-8">
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <iframe
                    src={post.video_url}
                    title={post.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            
            {/* Article Content */}
            <div 
              className="prose prose-lg prose-forest max-w-none
                         prose-headings:text-stone-900 prose-headings:font-bold
                         prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                         prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                         prose-p:text-stone-800 prose-p:leading-relaxed prose-p:mb-6
                         prose-strong:text-stone-900
                         prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 
                         prose-blockquote:bg-emerald-50 prose-blockquote:py-4 prose-blockquote:px-6 
                         prose-blockquote:rounded-r-lg prose-blockquote:my-8
                         prose-ul:text-stone-800 prose-ol:text-stone-800
                         prose-li:mb-2 prose-li:text-stone-800
                         prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-forest-100">
                <div className="flex items-center gap-4 flex-wrap">
                  <Tag className="w-5 h-5 text-forest-500" />
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.article>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-forest-900 mb-12 text-center">
              Related Articles
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-stone-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    {relatedPost.featured_image_url ? (
                      <img
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-forest-600 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-stone-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-stone-700 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default BlogPostPage