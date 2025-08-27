import React, { useEffect, useState } from 'react'
import { Plus, Star, Leaf, ShoppingCart, Package, Award, Zap, Filter, Search, SortAsc } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/context/CartContext'
import { supabase, Product, ProductVariant } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

export function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  
  const { addToCart, totalItems } = useCart()

  const categories = [
    { value: 'all', label: 'All Products', icon: Package },
    { value: 'flower', label: 'THCA Flower', icon: Leaf },
    { value: 'edibles', label: 'Edibles', icon: Star },
    { value: 'concentrates', label: 'Concentrates', icon: Zap },
    { value: 'topicals', label: 'Topicals', icon: Award }
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get published products only for storefront
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          product_variants(*)
        `)
        .eq('publish_status', 'published')
        .eq('visibility_status', 'visible')
        .eq('archived', false)
        .order('is_featured', { ascending: false })
        .order('name')
      
      if (fetchError) {
        throw fetchError
      }
      
      // Transform the data to include variants
      const transformedProducts: Product[] = (data || []).map(product => ({
        ...product,
        variants: product.product_variants || []
      }))
      
      setProducts(transformedProducts)
    } catch (err: any) {
      console.error('Failed to load products:', err)
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string, variantId?: string) => {
    const key = variantId ? `${productId}-${variantId}` : productId
    try {
      setAddingToCart(key)
      await addToCart(productId, variantId, 1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase().includes(selectedCategory)
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      case 'featured':
      default:
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading premium hemp products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="p-8 bg-red-50 rounded-xl border border-red-200 inline-block">
              <Package className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Products</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={loadProducts} variant="destructive">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Premium Hemp Products
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8">
            Lab-tested THCA flower & hemp derivatives from North Carolina
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Award className="h-4 w-4 mr-1" />
              Lab Tested
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Leaf className="h-4 w-4 mr-1" />
              Premium Quality
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              21+ Only
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            {totalItems > 0 && (
              <Badge variant="default" className="bg-blue-600">
                <ShoppingCart className="h-4 w-4 mr-1" />
                {totalItems} in cart
              </Badge>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                        <Leaf className="h-16 w-16 text-green-600" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.is_featured && (
                        <Badge className="bg-amber-500 text-white border-0">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {product.lab_tested && (
                        <Badge variant="secondary" className="bg-blue-500 text-white border-0">
                          <Award className="h-3 w-3 mr-1" />
                          Lab Tested
                        </Badge>
                      )}
                      {product.organic && (
                        <Badge variant="secondary" className="bg-green-500 text-white border-0">
                          <Leaf className="h-3 w-3 mr-1" />
                          Organic
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>
                    
                    {/* Cannabinoid Content */}
                    {((product.thc_content && product.thc_content > 0) || (product.cbd_content && product.cbd_content > 0)) && (
                      <div className="flex gap-2">
                        {product.thc_content && product.thc_content > 0 && (
                          <Badge variant="outline" className="text-xs">
                            THC: {product.thc_content}%
                          </Badge>
                        )}
                        {product.cbd_content && product.cbd_content > 0 && (
                          <Badge variant="outline" className="text-xs">
                            CBD: {product.cbd_content}%
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Variants or Single Price */}
                    {product.variants && product.variants.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Available sizes:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {product.variants.slice(0, 4).map((variant) => {
                            const key = `${product.id}-${variant.id}`
                            const isAdding = addingToCart === key
                            
                            return (
                              <Button
                                key={variant.id}
                                variant="outline"
                                size="sm"
                                className="h-auto p-2 text-xs flex flex-col items-center"
                                onClick={() => handleAddToCart(product.id, variant.id)}
                                disabled={isAdding || variant.inventory <= 0}
                              >
                                {isAdding ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
                                ) : (
                                  <>
                                    <span className="font-medium">{variant.weight}{variant.weight_unit}</span>
                                    <span className="text-blue-600 font-semibold">
                                      {formatCurrency(variant.price)}
                                    </span>
                                  </>
                                )}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(product.price)}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingToCart === product.id}
                          className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800"
                        >
                          {addingToCart === product.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}