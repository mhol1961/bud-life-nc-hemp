import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, BookOpen, Eye, Facebook, Twitter, Linkedin } from 'lucide-react'
import { format } from 'date-fns'
// Import static blog data - EMERGENCY FIX
import { staticBlogPosts, fallbackArticle } from '@/data/blog'
// Import markdown renderer
import Markdown from 'markdown-to-jsx'

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
  hero_image_url?: string
  video_url?: string
  published_at: string
  read_time: number
  view_count: number
  is_featured: boolean
  seo_title?: string
  seo_description?: string
}

const BlogPostPage = () => {
  const { slug: postSlug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  // Static blog data - EMERGENCY FIX
  // This blog post is guaranteed to work and doesn't require database access

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!postSlug) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Find the post from static data - guaranteed to work
        const foundPost = staticBlogPosts.find(post => post.slug === postSlug) || fallbackArticle
        setPost(foundPost)
        
        // We don't have related posts in static mode
        setRelatedPosts([])
        
        console.log('Static blog post content loaded successfully')
        
      } catch (error) {
        console.error('Error in fetchBlogPost:', error)
        // Ensure content is ALWAYS available
        setPost(fallbackArticle)
        setRelatedPosts([])
      } finally {
        setLoading(false)
      }
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
        {post.hero_image_url && (
          <div className="h-96 lg:h-[500px] overflow-hidden">
            <img
              src={post.hero_image_url}
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
            
            {/* Article Content with Markdown Rendering */}
            <div className="prose prose-lg max-w-none text-stone-800 prose-headings:text-stone-900 prose-headings:font-bold">
              <Markdown
                options={{
                  overrides: {
                    h1: {
                      props: {
                        className: 'text-4xl font-bold text-stone-900 mb-6 mt-6',
                      },
                    },
                    h2: {
                      props: {
                        className: 'text-3xl font-bold text-stone-900 mb-4 mt-12',
                      },
                    },
                    h3: {
                      props: {
                        className: 'text-2xl font-bold text-stone-900 mb-3 mt-8',
                      },
                    },
                    p: {
                      props: {
                        className: 'text-stone-800 mb-6 leading-relaxed',
                      },
                    },
                    ul: {
                      props: {
                        className: 'list-disc pl-6 mb-6 text-stone-800',
                      },
                    },
                    ol: {
                      props: {
                        className: 'list-decimal pl-6 mb-6 text-stone-800',
                      },
                    },
                    li: {
                      props: {
                        className: 'mb-2 text-stone-800',
                      },
                    },
                    a: {
                      props: {
                        className: 'text-emerald-700 hover:text-emerald-800 hover:underline',
                      },
                    },
                    strong: {
                      props: {
                        className: 'font-bold text-stone-900',
                      },
                    },
                    blockquote: {
                      props: {
                        className: 'border-l-4 border-emerald-500 bg-emerald-50 py-4 px-6 rounded-r-lg my-8',
                      },
                    },
                  },
                }}
              >
                {post.content}
              </Markdown>
            </div>
            
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
                      className="inline-flex items-center gap-1 text-emerald-600 font-medium hover:text-emerald-800 transition-colors"
                    >
                      Read more
                      <ArrowLeft className="w-4 h-4 rotate-180" />
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
