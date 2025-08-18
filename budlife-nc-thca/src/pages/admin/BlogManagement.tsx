import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  FileText,
  Image as ImageIcon,
  Globe,
  Clock,
  TrendingUp,
  MoreVertical,
  Copy,
  Share2
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  status: 'draft' | 'published' | 'scheduled'
  publishDate: string
  author: string
  category: string
  tags: string[]
  views: number
  readTime: number
  seoTitle?: string
  seoDescription?: string
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding THCA: The Science Behind the Compound',
    slug: 'understanding-thca-science-compound',
    excerpt: 'Dive deep into the molecular structure and benefits of THCA, the non-psychoactive precursor to THC that’s revolutionizing hemp wellness.',
    content: 'Full article content here...',
    featuredImage: '/images/thca-molecule-blog.jpg',
    status: 'published',
    publishDate: '2024-01-15',
    author: 'Dr. Sarah Chen',
    category: 'Education',
    tags: ['THCA', 'Science', 'Education', 'Hemp'],
    views: 1247,
    readTime: 8,
    seoTitle: 'THCA Science Explained | Bud Life NC Hemp Co',
    seoDescription: 'Learn about THCA’s molecular structure, benefits, and therapeutic potential from industry experts.'
  },
  {
    id: '2',
    title: 'From Seed to Shelf: Our 16-Week Cultivation Journey',
    slug: 'seed-to-shelf-cultivation-journey',
    excerpt: 'Follow our premium hemp from carefully selected genetics through our meticulous 16-week growing process to your doorstep.',
    content: 'Full article content here...',
    featuredImage: '/images/cultivation-process-blog.jpg',
    status: 'published',
    publishDate: '2024-01-10',
    author: 'Mike Rodriguez',
    category: 'Cultivation',
    tags: ['Cultivation', 'Process', 'Quality', 'Organic'],
    views: 892,
    readTime: 12,
    seoTitle: 'Premium Hemp Cultivation Process | 16-Week Journey',
    seoDescription: 'Discover our organic cultivation methods and precision growing techniques that produce premium THCA hemp.'
  },
  {
    id: '3',
    title: 'Lab Testing 101: How We Ensure Product Safety',
    slug: 'lab-testing-product-safety-guide',
    excerpt: 'Transparency is key to trust. Learn about our comprehensive third-party testing process and what each COA tells you.',
    content: 'Full article content here...',
    featuredImage: '/images/lab-testing-blog.jpg',
    status: 'draft',
    publishDate: '2024-01-20',
    author: 'Dr. Sarah Chen',
    category: 'Quality',
    tags: ['Testing', 'Safety', 'COA', 'Transparency'],
    views: 0,
    readTime: 6,
    seoTitle: 'Hemp Lab Testing Guide | Safety & Quality Assurance',
    seoDescription: 'Understanding Certificates of Analysis and our rigorous third-party testing protocols for hemp safety.'
  },
  {
    id: '4',
    title: 'The Art of Curing: Why 30+ Days Makes a Difference',
    slug: 'art-of-curing-30-days-difference',
    excerpt: 'Patience pays off. Discover how our extended curing process enhances flavor, potency, and overall product quality.',
    content: 'Full article content here...',
    status: 'scheduled',
    publishDate: '2024-01-25',
    author: 'Mike Rodriguez',
    category: 'Cultivation',
    tags: ['Curing', 'Quality', 'Process', 'Artisan'],
    views: 0,
    readTime: 10,
    seoTitle: 'Hemp Curing Process | 30+ Day Premium Method',
    seoDescription: 'Learn why extended curing enhances hemp flower quality, flavor, and therapeutic compounds.'
  }
]

const categories = ['Education', 'Cultivation', 'Quality', 'News', 'Wellness']
const authors = ['Dr. Sarah Chen', 'Mike Rodriguez', 'Emily Johnson']

function StatusBadge({ status }: { status: BlogPost['status'] }) {
  const styles = {
    published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function BlogPostCard({ post, viewMode }: { post: BlogPost, viewMode: 'grid' | 'list' }) {
  const [showDropdown, setShowDropdown] = useState(false)

  if (viewMode === 'list') {
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden">
              {post.featuredImage ? (
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 hover:text-emerald-600 cursor-pointer">
                {post.title}
              </div>
              <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                {post.excerpt}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={post.status} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {post.author}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {post.category}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {post.views.toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {post.publishDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center gap-2">
            <Link 
              to={`/admin/content/blog/${post.id}/edit`}
              className="text-emerald-600 hover:text-emerald-900 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      {/* Featured Image */}
      <div className="relative aspect-video bg-gray-100">
        {post.featuredImage ? (
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-forest-100">
            <FileText className="w-12 h-12 text-emerald-600" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <StatusBadge status={post.status} />
        </div>
        
        {/* Dropdown Menu */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-lg p-2 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <Link 
                to={`/admin/content/blog/${post.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
              >
                <Edit className="w-4 h-4" />
                Edit Post
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 w-full text-left">
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 w-full text-left">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-600 w-full text-left">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{post.category}</span>
          <span>•</span>
          <span>{post.readTime} min read</span>
          {post.status === 'published' && (
            <>
              <span>•</span>
              <span>{post.views} views</span>
            </>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
        
        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{post.publishDate}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/admin/content/blog/${post.id}/edit`}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors"
          >
            Edit Post
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          {post.status === 'published' && (
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | BlogPost['status']>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterAuthor, setFilterAuthor] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory
    const matchesAuthor = filterAuthor === 'all' || post.author === filterAuthor
    return matchesSearch && matchesStatus && matchesCategory && matchesAuthor
  })

  const stats = {
    total: mockBlogPosts.length,
    published: mockBlogPosts.filter(p => p.status === 'published').length,
    drafts: mockBlogPosts.filter(p => p.status === 'draft').length,
    scheduled: mockBlogPosts.filter(p => p.status === 'scheduled').length,
    totalViews: mockBlogPosts.reduce((sum, p) => sum + p.views, 0)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create and manage educational content for your audience</p>
        </div>
        <Link
          to="/admin/content/blog/new"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors w-fit"
        >
          <Plus className="w-5 h-5" />
          New Blog Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Edit className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.drafts}</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.scheduled}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Authors</option>
              {authors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 text-sm font-medium ${
                viewMode === 'grid' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 text-sm font-medium ${
                viewMode === 'list' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} viewMode={viewMode} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' || filterAuthor !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first blog post to get started'
            }
          </p>
          <Link
            to="/admin/content/blog/new"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create First Post
          </Link>
        </div>
      )}
    </div>
  )
}
