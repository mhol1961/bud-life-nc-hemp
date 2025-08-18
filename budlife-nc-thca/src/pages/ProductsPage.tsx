import React, { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'
import type { FilterOptions } from '@/lib/types'
import { Filter, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProducts(data || [])
      setFilteredProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters to products
  const applyFilters = () => {
    let filtered = [...products]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.short_description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.strain_type?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Strain type filter
    if (filters.strain_type) {
      filtered = filtered.filter(product => product.strain_type === filters.strain_type)
    }

    // Price range filter
    if (filters.price_min !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.price_min!)
    }
    if (filters.price_max !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.price_max!)
    }

    // THC content filter
    if (filters.thc_min !== undefined) {
      filtered = filtered.filter(product => (product.thc_content || 0) >= filters.thc_min!)
    }
    if (filters.thc_max !== undefined) {
      filtered = filtered.filter(product => (product.thc_content || 0) <= filters.thc_max!)
    }

    // CBD content filter
    if (filters.cbd_min !== undefined) {
      filtered = filtered.filter(product => (product.cbd_content || 0) >= filters.cbd_min!)
    }
    if (filters.cbd_max !== undefined) {
      filtered = filtered.filter(product => (product.cbd_content || 0) <= filters.cbd_max!)
    }

    // Featured filter
    if (filters.featured_only) {
      filtered = filtered.filter(product => product.featured)
    }

    // In stock filter
    if (filters.in_stock_only) {
      filtered = filtered.filter(product => product.quantity > 0 || product.allow_backorder)
    }

    // Sorting
    if (filters.sort_by) {
      filtered.sort((a, b) => {
        const order = filters.sort_order === 'desc' ? -1 : 1
        
        switch (filters.sort_by) {
          case 'name':
            return order * a.name.localeCompare(b.name)
          case 'price':
            return order * (a.price - b.price)
          case 'created_at':
            return order * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          case 'featured':
            return order * ((b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          default:
            return 0
        }
      })
    }

    setFilteredProducts(filtered)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setFilteredProducts(products)
  }

  // Get unique categories and strain types for filter options
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const strainTypes = Array.from(new Set(products.map(p => p.strain_type).filter(Boolean)))

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-20">
        <div className="container-premium">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-stone-600">Loading premium products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="premium-gradient py-16">
        <div className="container-premium">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
              Premium THCA Products
            </h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Discover our complete collection of lab-tested, premium-quality 
              hemp-derived THCA products crafted for your wellness journey.
            </p>
          </div>
        </div>
      </section>

      <div className="container-premium py-12">
        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium pl-10 w-full"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-stone-700">
              Sort by:
            </label>
            <select
              value={`${filters.sort_by || 'featured'}-${filters.sort_order || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                setFilters(prev => ({
                  ...prev,
                  sort_by: sortBy as FilterOptions['sort_by'],
                  sort_order: sortOrder as FilterOptions['sort_order']
                }))
              }}
              className="input-premium"
            >
              <option value="featured-desc">Featured First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="created_at-desc">Newest First</option>
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card-premium p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                    className="input-premium w-full"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category?.charAt(0).toUpperCase() + category?.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strain Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Strain Type
                  </label>
                  <select
                    value={filters.strain_type || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, strain_type: e.target.value || undefined }))}
                    className="input-premium w-full"
                  >
                    <option value="">All Types</option>
                    {strainTypes.map(type => (
                      <option key={type} value={type}>
                        {type?.charAt(0).toUpperCase() + type?.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.price_min || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, price_min: e.target.value ? Number(e.target.value) : undefined }))}
                      className="input-premium w-full"
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.price_max || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, price_max: e.target.value ? Number(e.target.value) : undefined }))}
                      className="input-premium w-full"
                      min="0"
                    />
                  </div>
                </div>

                {/* Filter Options */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.featured_only || false}
                      onChange={(e) => setFilters(prev => ({ ...prev, featured_only: e.target.checked || undefined }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-stone-700">Featured Only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.in_stock_only || false}
                      onChange={(e) => setFilters(prev => ({ ...prev, in_stock_only: e.target.checked || undefined }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-stone-700">In Stock Only</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-6 pt-6 border-t border-stone-200 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-stone-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              No products found
            </h3>
            <p className="text-stone-600 mb-6">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}