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
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Image as ImageIcon,
  Upload
} from 'lucide-react'

interface Product {
  id: string
  name: string
  strain: string
  category: 'flower' | 'pre-roll' | 'edible'
  status: 'active' | 'draft' | 'out-of-stock'
  prices: {
    [size: string]: number
  }
  inventory: {
    [size: string]: number
  }
  image: string
  thcaContent: number
  description: string
  coaFile?: string
  lastUpdated: string
}

const mockProducts: Product[] = [
  {
    id: 'jealousy-strain',
    name: 'Jealousy Strain',
    strain: 'Jealousy',
    category: 'flower',
    status: 'active',
    prices: {
      '3.5G': 35,
      '7G': 65
    },
    inventory: {
      '3.5G': 5,
      '7G': 8
    },
    image: '/images/jealousy_flower.png',
    thcaContent: 24.8,
    description: 'Premium hybrid with stunning purple hues and incredible terpene profile.',
    coaFile: '/coa/Jealousy AAA Indoor THCA.pdf',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'gushers-strain',
    name: 'Gushers Strain',
    strain: 'Gushers',
    category: 'flower',
    status: 'active',
    prices: {
      '3.5G': 30,
      '7G': 55
    },
    inventory: {
      '3.5G': 12,
      '7G': 3
    },
    image: '/images/gushers_flower.png',
    thcaContent: 22.4,
    description: 'Sweet and fruity with dense, frosty buds.',
    coaFile: '/coa/Gushers Top Shelf THCA.pdf',
    lastUpdated: '2024-01-18'
  }
]

function StatusBadge({ status }: { status: Product['status'] }) {
  const styles = {
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    'out-of-stock': 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status === 'out-of-stock' ? 'Out of Stock' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function InventoryAlert({ product }: { product: Product }) {
  const lowStock = Object.entries(product.inventory).filter(([_, qty]) => qty < 10)
  
  if (lowStock.length === 0) return null

  return (
    <div className="flex items-center gap-1">
      <AlertTriangle className="w-4 h-4 text-orange-500" />
      <span className="text-xs text-orange-600 font-medium">Low Stock</span>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const totalStock = Object.values(product.inventory).reduce((sum, qty) => sum + qty, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={product.status} />
        </div>
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <Link 
                  to={`/admin/products/${product.id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit Product
                </Link>
                <Link 
                  to={`/products/${product.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                >
                  <Eye className="w-4 h-4" />
                  View on Store
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-600 w-full text-left">
                  <Trash2 className="w-4 h-4" />
                  Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>

        {/* THCA Content */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">THCA Content:</span>
            <span className="font-semibold text-emerald-600">{product.thcaContent}%</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">Pricing:</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(product.prices).map(([size, price]) => (
              <div key={size} className="bg-gray-50 p-2 rounded text-center">
                <div className="text-xs text-gray-600">{size}</div>
                <div className="font-semibold text-gray-900">${price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Inventory:</span>
            <InventoryAlert product={product} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(product.inventory).map(([size, qty]) => (
              <div key={size} className={`p-2 rounded text-center border ${
                qty < 10 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-xs text-gray-600">{size}</div>
                <div className={`font-semibold ${
                  qty < 10 ? 'text-orange-600' : 'text-gray-900'
                }`}>{qty} units</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium text-sm text-center transition-colors"
          >
            Edit Product
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Product['status']>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.strain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors w-fit"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Package className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockProducts.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {mockProducts.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Products</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {mockProducts.filter(p => 
                  Object.values(p.inventory).some(qty => qty < 10)
                ).length}
              </div>
              <div className="text-sm text-gray-600">Low Stock Items</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">$90</div>
              <div className="text-sm text-gray-600">Avg. Product Value</div>
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
              placeholder="Search products, strains, or SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out-of-stock">Out of Stock</option>
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
              onClick={() => setViewMode('table')}
              className={`px-4 py-3 text-sm font-medium ${
                viewMode === 'table' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    THCA %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img className="h-12 w-12 rounded-lg object-cover" src={product.image} alt={product.name} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.strain}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        {Object.entries(product.inventory).map(([size, qty]) => (
                          <div key={size} className={qty < 10 ? 'text-orange-600 font-medium' : ''}>
                            {size}: {qty}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        {Object.entries(product.prices).map(([size, price]) => (
                          <div key={size}>{size}: ${price}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                      {product.thcaContent}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-emerald-600 hover:text-emerald-900 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first product'
            }
          </p>
          <Link
            to="/admin/products/new"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add First Product
          </Link>
        </div>
      )}
    </div>
  )
}
