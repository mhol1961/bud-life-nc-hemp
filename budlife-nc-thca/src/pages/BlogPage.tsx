import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Calendar, Clock, User, Tag, Search, Play, BookOpen, Video, FileText, TrendingUp, Filter, Eye, Scale, Heart, TestTube, Leaf } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
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

interface Category {
  id: string
  name: string
  description: string
  icon: any
  color: string
}

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)

  // Default categories for hemp/THCA educational content
  const defaultCategories: Category[] = [
    {
      id: 'all',
      name: 'All Content',
      description: 'Browse all educational content',
      icon: BookOpen,
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'hemp-basics',
      name: 'Hemp Basics',
      description: 'Fundamental knowledge about hemp and THCA',
      icon: BookOpen,
      color: 'from-emerald-500 to-forest-600'
    },
    {
      id: 'legal-updates',
      name: 'Legal & Compliance',
      description: 'Latest in hemp laws and regulations',
      icon: Scale,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'cultivation',
      name: 'Cultivation & Growing',
      description: 'Behind the scenes of hemp cultivation',
      icon: Leaf,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'wellness',
      name: 'Health & Wellness',
      description: 'Wellness applications and research',
      icon: Heart,
      color: 'from-pink-500 to-red-600'
    },
    {
      id: 'lab-science',
      name: 'Lab & Testing',
      description: 'Quality control and testing insights',
      icon: TestTube,
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'industry-news',
      name: 'Industry News',
      description: 'Latest hemp industry developments',
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-600'
    },
    {
      id: 'videos',
      name: 'Educational Videos',
      description: 'Video content and tutorials',
      icon: Video,
      color: 'from-red-500 to-pink-600'
    }
  ]

  // Sample posts for demonstration
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      title: 'Understanding THCA: The Complete Beginner\'s Guide',
      excerpt: 'Discover what THCA is, how it differs from THC, and why it\'s revolutionizing the hemp industry. A comprehensive guide for newcomers.',
      content: `<p>THCA (Tetrahydrocannabinolic Acid) is rapidly becoming one of the most talked-about compounds in the hemp industry...</p>`,
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
    {
      id: '2',
      title: '2025 Hemp Legal Landscape: What You Need to Know',
      excerpt: 'Navigate the evolving legal framework surrounding hemp and THCA products across different states in 2025.',
      content: `<p>The legal landscape for hemp and THCA products continues to evolve rapidly...</p>`,
      author: 'Legal Team',
      category: 'legal-updates',
      tags: ['legal', '2025', 'compliance', 'regulations'],
      featured_image: '/images/legal-landscape-2025.jpg',
      published_at: '2025-08-12T14:30:00Z',
      read_time: 12,
      view_count: 892,
      is_featured: false,
      seo_title: '2025 Hemp Legal Updates | State Laws & Compliance',
      seo_description: 'Stay compliant with the latest 2025 hemp legal updates. State-by-state guide to THCA and hemp product regulations.'
    },
    {
      id: '3',
      title: 'Inside Our Lab: How We Test Every Batch',
      excerpt: 'Take a behind-the-scenes look at our rigorous testing process that ensures every product meets the highest quality standards.',
      content: `<p>Quality and safety are at the heart of everything we do...</p>`,
      author: 'Quality Assurance Team',
      category: 'lab-science',
      tags: ['testing', 'quality', 'COA', 'safety'],
      featured_image: '/images/lab-testing-process.jpg',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      published_at: '2025-08-10T09:15:00Z',
      read_time: 6,
      view_count: 654,
      is_featured: false,
      seo_title: 'Hemp Testing Process | Quality Assurance at Bud Life NC',
      seo_description: 'Discover our comprehensive hemp testing process. Learn how we ensure quality, purity, and compliance in every batch.'
    },
    {
      id: '4',
      title: 'From Seed to Sale: Our Cultivation Journey',
      excerpt: 'Follow the complete journey of our hemp plants from germination to harvest in our state-of-the-art indoor facility.',
      content: `<p>Our cultivation process represents years of refinement and dedication to excellence...</p>`,
      author: 'Master Cultivator John Smith',
      category: 'cultivation',
      tags: ['growing', 'indoor', 'organic', 'process'],
      featured_image: '/images/cultivation-journey.jpg',
      published_at: '2025-08-08T11:45:00Z',
      read_time: 10,
      view_count: 1103,
      is_featured: true,
      seo_title: 'Hemp Cultivation Process | Organic Growing Methods',
      seo_description: 'Explore our organic hemp cultivation process from seed to sale. Learn about our indoor growing techniques and quality standards.'
    }
  ]

  useEffect(() => {
    // In a real implementation, fetch from Supabase
    // For now, use sample data
    setCategories(defaultCategories)
    setPosts(samplePosts)
    setFeaturedPost(samplePosts.find(post => post.is_featured) || samplePosts[0])
    setLoading(false)

    // Set category from URL params
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (categoryId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: categoryId })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
          <p className="text-stone-600">Loading educational content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-emerald-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Learn & Discover
              <span className="block text-emerald-400">Hemp Knowledge</span>
            </h1>
            <p className="text-xl text-cream-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore our comprehensive educational content about hemp, THCA, cultivation, and the evolving cannabis industry.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-2xl text-forest-900 bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-emerald-400 text-lg"
              />
              <Search className="absolute left-5 top-5 w-6 h-6 text-forest-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-emerald-50 to-forest-50 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-96 lg:h-full">
                  {featuredPost.featured_image ? (
                    <img
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-forest-600 flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-white" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Featured Article
                    </span>
                  </div>
                </div>
                <div className="p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-emerald-600 font-semibold capitalize">
                      {categories.find(cat => cat.id === featuredPost.category)?.name || 'Article'}
                    </span>
                    <span className="text-forest-500">•</span>
                    <span className="text-forest-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.read_time} min read
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-forest-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-forest-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-forest-500" />
                      <span className="text-forest-600 font-medium">{featuredPost.author}</span>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.id}`}
                      className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-forest-700 border border-forest-200 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-forest-600 flex items-center justify-center">
                        {post.video_url ? (
                          <Play className="w-16 h-16 text-white" />
                        ) : (
                          <FileText className="w-16 h-16 text-white" />
                        )}
                      </div>
                    )}
                    {post.video_url && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-emerald-600 font-semibold text-sm capitalize">
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                      <div className="flex items-center gap-1 text-forest-500 text-sm">
                        <Eye className="w-4 h-4" />
                        {post.view_count.toLocaleString()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-forest-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-forest-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-forest-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.read_time}m
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(post.published_at), 'MMM d')}
                      </span>
                    </div>
                    
                    <Link
                      to={`/blog/${post.id}`}
                      className="mt-4 block text-center bg-emerald-50 text-emerald-700 py-2 rounded-xl font-semibold hover:bg-emerald-100 transition-colors duration-200"
                    >
                      Read More
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-24 h-24 text-forest-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-forest-700 mb-4">No articles found</h3>
              <p className="text-forest-500 mb-6">Try adjusting your search or browse different categories.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSearchParams({})
                }}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200"
              >
                Show All Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Admin Link */}
      {user && (
        <section className="py-8 bg-forest-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              to="/admin/content"
              className="inline-flex items-center gap-2 bg-forest-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-forest-800 transition-colors duration-200"
            >
              <FileText className="w-5 h-5" />
              Manage Content
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default BlogPage