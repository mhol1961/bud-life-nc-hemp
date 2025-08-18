import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload,
  Image as ImageIcon,
  Video,
  File,
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  Edit,
  Download,
  Plus,
  FolderPlus,
  Eye,
  Copy,
  MoreVertical
} from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail?: string
  size: string
  dimensions?: string
  uploadDate: string
  folder: string
  alt?: string
  tags: string[]
}

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    name: 'jealousy_flower.png',
    type: 'image',
    url: '/images/jealousy_flower.png',
    size: '1.2 MB',
    dimensions: '1920x1080',
    uploadDate: '2024-01-15',
    folder: 'products',
    alt: 'Jealousy strain THCA flower',
    tags: ['product', 'flower', 'jealousy']
  },
  {
    id: '2',
    name: 'gushers_flower.png',
    type: 'image',
    url: '/images/gushers_flower.png',
    size: '1.1 MB',
    dimensions: '1920x1080',
    uploadDate: '2024-01-18',
    folder: 'products',
    alt: 'Gushers strain THCA flower',
    tags: ['product', 'flower', 'gushers']
  },
  {
    id: '3',
    name: 'budlife_logo.png',
    type: 'image',
    url: '/images/new-budlife-logo.png',
    size: '45 KB',
    dimensions: '512x512',
    uploadDate: '2024-01-01',
    folder: 'branding',
    alt: 'Bud Life NC Hemp Co logo',
    tags: ['logo', 'branding', 'company']
  },
  {
    id: '4',
    name: 'cultivation_tour.mp4',
    type: 'video',
    url: '/videos/cultivation_tour.mp4',
    thumbnail: '/images/video_thumb_1.jpg',
    size: '25.3 MB',
    dimensions: '1920x1080',
    uploadDate: '2024-01-10',
    folder: 'marketing',
    tags: ['video', 'cultivation', 'tour']
  },
  {
    id: '5',
    name: 'lab_report_template.pdf',
    type: 'document',
    url: '/documents/lab_report_template.pdf',
    size: '2.1 MB',
    uploadDate: '2024-01-12',
    folder: 'documents',
    tags: ['document', 'template', 'coa']
  }
]

const folders = ['products', 'branding', 'marketing', 'documents', 'hero-images']

function MediaCard({ item, viewMode }: { item: MediaItem, viewMode: 'grid' | 'list' }) {
  const [showDropdown, setShowDropdown] = useState(false)

  if (viewMode === 'list') {
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
              ) : item.type === 'video' ? (
                <Video className="w-6 h-6 text-gray-600" />
              ) : (
                <File className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{item.name}</div>
              <div className="text-sm text-gray-500">{item.folder}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.size}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.dimensions || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.uploadDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center gap-2">
            <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="text-emerald-600 hover:text-emerald-900 p-2 rounded-lg hover:bg-emerald-50 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      {/* Media Preview */}
      <div className="relative aspect-video bg-gray-100">
        {item.type === 'image' ? (
          <img 
            src={item.url} 
            alt={item.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : item.type === 'video' ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
            <Video className="w-12 h-12" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <File className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-2 text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-2 text-white transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-2 text-white transition-colors">
            <Copy className="w-4 h-4" />
          </button>
        </div>
        
        {/* Dropdown Menu */}
        <div className="absolute top-2 right-2">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-lg p-2 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 w-full text-left">
                <Edit className="w-4 h-4" />
                Edit Details
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 w-full text-left">
                <Copy className="w-4 h-4" />
                Copy URL
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-600 w-full text-left">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Details */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
        <div className="text-sm text-gray-500 mb-2">
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.size}
        </div>
        <div className="text-xs text-gray-400 mb-3">
          {item.folder} • {item.uploadDate}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
            Use in Content
          </button>
          <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function MediaManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all')
  const [filterFolder, setFilterFolder] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filteredItems = mockMediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesFolder = filterFolder === 'all' || item.folder === filterFolder
    return matchesSearch && matchesType && matchesFolder
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage images, videos, and documents for your store</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <FolderPlus className="w-5 h-5" />
            New Folder
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Media
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {mockMediaItems.filter(item => item.type === 'image').length}
              </div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {mockMediaItems.filter(item => item.type === 'video').length}
              </div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <File className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {mockMediaItems.filter(item => item.type === 'document').length}
              </div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Upload className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(mockMediaItems.reduce((total, item) => {
                  const size = parseFloat(item.size.replace(/[^0-9.]/g, ''))
                  return total + size
                }, 0) * 100) / 100}
              </div>
              <div className="text-sm text-gray-600">MB Used</div>
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
              placeholder="Search media files, tags, or folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
            
            <select
              value={filterFolder}
              onChange={(e) => setFilterFolder(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Folders</option>
              {folders.map(folder => (
                <option key={folder} value={folder}>{folder}</option>
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
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 text-sm font-medium ${
                viewMode === 'list' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimensions
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
                {filteredItems.map((item) => (
                  <MediaCard key={item.id} item={item} viewMode={viewMode} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No media found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' || filterFolder !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Upload your first media files to get started'
            }
          </p>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Media
          </button>
        </div>
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Media</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & drop files here</h3>
              <p className="text-gray-600 mb-4">or click to browse and upload</p>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Choose Files
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Upload Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
