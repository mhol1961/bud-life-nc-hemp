import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, BookOpen, Eye, Facebook, Twitter, Linkedin } from 'lucide-react'
import { format } from 'date-fns'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  featured_image?: string
  video_url?: string
  published_at: string
  read_time: number
  view_count: number
  is_featured: boolean
  seo_title?: string
  seo_description?: string
}

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  // Sample posts data (same as in BlogPage)
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      title: 'Understanding THCA: The Complete Beginner\'s Guide',
      excerpt: 'Discover what THCA is, how it differs from THC, and why it\'s revolutionizing the hemp industry. A comprehensive guide for newcomers.',
      content: `
        <h2>What is THCA?</h2>
        <p>THCA (Tetrahydrocannabinolic Acid) is rapidly becoming one of the most talked-about compounds in the hemp industry. Unlike its more famous cousin THC, THCA is non-psychoactive in its raw form, making it legal under the 2018 Farm Bill when derived from hemp containing less than 0.3% delta-9 THC.</p>
        
        <h3>The Science Behind THCA</h3>
        <p>THCA is the acidic precursor to THC. In living cannabis plants, cannabinoids exist primarily in their acidic forms. Through a process called decarboxylation - which occurs when the plant material is heated through smoking, vaping, or cooking - THCA loses its carboxyl group and transforms into the psychoactive compound THC.</p>
        
        <blockquote>
          <p>"THCA represents a fascinating intersection of chemistry and legislation, offering consumers a legal pathway to access cannabis-like effects while remaining compliant with federal law."</p>
          <cite>- Dr. Sarah Mitchell, Cannabis Researcher</cite>
        </blockquote>
        
        <h3>THCA vs. THC: Key Differences</h3>
        <ul>
          <li><strong>Psychoactivity:</strong> THCA is non-psychoactive until heated, while THC produces immediate psychoactive effects</li>
          <li><strong>Legal Status:</strong> THCA derived from compliant hemp is federally legal; THC remains federally controlled</li>
          <li><strong>Stability:</strong> THCA is more stable and less prone to degradation than THC</li>
          <li><strong>Bioavailability:</strong> Raw THCA has different absorption characteristics compared to activated THC</li>
        </ul>
        
        <h3>Potential Benefits and Research</h3>
        <p>While research is still in its early stages, preliminary studies and anecdotal reports suggest THCA may offer various potential benefits. However, it's important to note that these statements have not been evaluated by the FDA, and our products are not intended to diagnose, treat, cure, or prevent any disease.</p>
        
        <h3>How to Use THCA Products</h3>
        <p>THCA flower can be consumed in several ways:</p>
        <ol>
          <li><strong>Raw Consumption:</strong> Some users consume raw THCA flower in smoothies or salads to avoid decarboxylation</li>
          <li><strong>Smoking or Vaping:</strong> Heat activation converts THCA to THC, producing traditional cannabis-like effects</li>
          <li><strong>Cooking:</strong> Incorporating into recipes with proper decarboxylation techniques</li>
        </ol>
        
        <h3>Quality and Compliance</h3>
        <p>At Bud Life NC, every batch of THCA flower undergoes rigorous third-party testing to ensure:</p>
        <ul>
          <li>Potency verification and cannabinoid profiling</li>
          <li>Pesticide and heavy metal screening</li>
          <li>Microbial contamination testing</li>
          <li>Compliance with federal delta-9 THC limits</li>
        </ul>
        
        <p>Understanding THCA opens up new possibilities for hemp consumers seeking potent, legal alternatives to traditional cannabis. As always, start with small amounts and consult with healthcare professionals before incorporating any new wellness products into your routine.</p>
      `,
      author: 'Dr. Sarah Mitchell',
      category: 'hemp-basics',
      tags: ['THCA', 'beginner', 'education', 'hemp'],
      featured_image: '/images/thca-guide-hero.jpg',
      published_at: '2025-08-15T10:00:00Z',
      read_time: 8,
      view_count: 1247,
      is_featured: true,
      seo_title: 'Complete THCA Guide for Beginners | Bud Life NC',
      seo_description: 'Learn everything about THCA with our comprehensive beginner guide. Understand effects, legality, and benefits of THCA hemp products.'
    },
    // Add other sample posts here...
  ]

  useEffect(() => {
    if (id) {
      // In a real implementation, fetch from Supabase
      const foundPost = samplePosts.find(p => p.id === id)
      setPost(foundPost || null)
      
      // Get related posts (same category, excluding current post)
      if (foundPost) {
        const related = samplePosts
          .filter(p => p.id !== id && p.category === foundPost.category)
          .slice(0, 3)
        setRelatedPosts(related)
        
        // Update view count (in real implementation, this would be a database update)
        // incrementViewCount(id)
      }
      
      setLoading(false)
    }
  }, [id])

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
        {post.featured_image && (
          <div className="h-96 lg:h-[500px] overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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
                  {post.category.replace('-', ' ')}
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
                         prose-headings:text-forest-900 prose-headings:font-bold
                         prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                         prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                         prose-p:text-forest-700 prose-p:leading-relaxed prose-p:mb-6
                         prose-strong:text-forest-900
                         prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 
                         prose-blockquote:bg-emerald-50 prose-blockquote:py-4 prose-blockquote:px-6 
                         prose-blockquote:rounded-r-lg prose-blockquote:my-8
                         prose-ul:text-forest-700 prose-ol:text-forest-700
                         prose-li:mb-2
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
                    {relatedPost.featured_image ? (
                      <img
                        src={relatedPost.featured_image}
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
                    <h3 className="text-xl font-bold text-forest-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-forest-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    
                    <Link
                      to={`/blog/${relatedPost.id}`}
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