import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star, Filter, Grid3X3, List, Search, ArrowRight, 
  Shield, Leaf, Award, Heart, ShoppingCart
} from 'lucide-react'
import { useCartStore } from '@/hooks/useCart'
import toast from 'react-hot-toast'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  image: string
  category: string
  strain: string
  thcContent: number
  cbdContent: number
  price: number
  comparePrice?: number
  rating: number
  reviewCount: number
  featured: boolean
  inStock: boolean
}

const products: Product[] = [
  {
    id: 'jealousy-strain',
    name: 'Jealousy',
    slug: 'jealousy',
    description: 'A potent hybrid with stunning purple hues and an incredible terpene profile. Perfect for experienced users seeking premium quality.',
    image: '/images/jealousy_flower.png',
    category: 'THCA Flower',
    strain: 'Hybrid',
    thcContent: 24.8,
    cbdContent: 0.8,
    price: 35,
    comparePrice: 45,
    rating: 4.9,
    reviewCount: 127,
    featured: true,
    inStock: true
  },
  {
    id: 'gushers-strain',
    name: 'Gushers',
    slug: 'gushers',
    description: 'Sweet and fruity with dense, frosty buds. A customer favorite known for its exceptional flavor and smooth experience.',
    image: '/images/gushers_flower.png',
    category: 'THCA Flower',
    strain: 'Hybrid',
    thcContent: 22.4,
    cbdContent: 1.2,
    price: 30,
    comparePrice: 40,
    rating: 4.8,
    reviewCount: 94,
    featured: true,
    inStock: true
  }
]

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showWishlist, setShowWishlist] = useState<{ [key: string]: boolean }>({})
  const { addItem } = useCartStore()

  const filteredProducts = products
    .filter(product => {
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return b.featured ? 1 : -1
      }
    })

  const handleQuickAdd = (product: Product) => {
    addItem({
      product_id: product.id,
      product_name: `${product.name} - 3.5G`,
      product_slug: product.slug,
      price: product.price,
      compare_at_price: product.comparePrice,
      quantity: 1,
      category: product.category,
      thc_content: product.thcContent,
      cbd_content: product.cbdContent,
      strain_type: product.strain,
      max_quantity: 10,
      product_image_url: product.image
    })

    toast.success(`Added ${product.name} to cart!`)
  }

  const toggleWishlist = (productId: string) => {
    setShowWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
    toast.success(showWishlist[productId] ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div className="min-h-screen bg-black text-cream">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/products_hemp_showcase.jpg" 
            alt="Premium THCA Hemp Products"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-forest-900/80" />
        </div>
        
        <div className="container-premium text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-gold-400 to-emerald-400 bg-clip-text text-transparent">
              Premium THCA Collection
            </h1>
            <p className="text-xl lg:text-2xl text-cream-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of premium THCA flower, each batch hand-selected and lab-tested for exceptional quality.
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Lab Tested</span>
              </div>
              <div className="w-1 h-6 bg-cream-600"></div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <Leaf className="w-5 h-5" />
                <span className="font-medium">NC Grown</span>
              </div>
              <div className="w-1 h-6 bg-cream-600"></div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <Award className="w-5 h-5" />
                <span className="font-medium">Premium Quality</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="py-8 bg-black-800 border-b border-forest-700">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cream-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12 w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-48"
              >
                <option value="all">All Categories</option>
                <option value="thca flower">THCA Flower</option>
                <option value="edibles">Edibles</option>
                <option value="concentrates">Concentrates</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input w-48"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center space-x-1 bg-black-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-500 text-white'
                      : 'text-cream-300 hover:text-emerald-300'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-emerald-500 text-white'
                      : 'text-cream-300 hover:text-emerald-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container-premium">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold text-cream-100 mb-2">No products found</h3>
              <p className="text-cream-300">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-cream-100">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
                </h2>
              </div>

              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'md:grid-cols-2 lg:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`group relative bg-gradient-to-br from-black-800 to-black-700 border border-forest-700 rounded-3xl overflow-hidden hover:border-emerald-500 transition-all duration-500 hover:shadow-glow-lg ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-1/3' : ''
                    }`}>
                      <Link to={`/products/${product.slug}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                            viewMode === 'list' ? 'w-full h-full' : 'w-full h-80'
                          }`}
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {product.featured && (
                          <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-3 py-1 rounded-full text-sm font-semibold">
                            Premium
                          </span>
                        )}
                        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {product.strain}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => toggleWishlist(product.id)}
                          className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 ${
                            showWishlist[product.id]
                              ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                              : 'bg-black/50 text-cream-300 border border-cream/20 hover:bg-emerald-500/20 hover:text-emerald-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${showWishlist[product.id] ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => handleQuickAdd(product)}
                          className="p-3 bg-black/50 text-cream-300 border border-cream/20 rounded-xl backdrop-blur-md hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* THC Content Badge */}
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-semibold border border-cream/20">
                        {product.thcContent}% THCA
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className={`p-8 ${viewMode === 'list' ? 'w-2/3 flex flex-col justify-between' : ''}`}>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">
                            {product.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-gold-400 fill-current" />
                            <span className="text-cream-300 text-sm font-medium">{product.rating}</span>
                            <span className="text-cream-500 text-sm">({product.reviewCount})</span>
                          </div>
                        </div>

                        <Link to={`/products/${product.slug}`}>
                          <h3 className="text-3xl font-bold text-cream-100 mb-3 group-hover:text-emerald-300 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-cream-200 leading-relaxed mb-6">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Actions */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl font-bold text-cream-100">
                              ${product.price}
                            </span>
                            {product.comparePrice && (
                              <span className="text-cream-500 line-through text-xl">
                                ${product.comparePrice}
                              </span>
                            )}
                            {product.comparePrice && (
                              <span className="bg-gold-500/20 text-gold-400 px-2 py-1 rounded-full text-sm font-medium border border-gold-500/30">
                                Save ${product.comparePrice - product.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Link
                            to={`/products/${product.slug}`}
                            className="flex-1 btn-primary flex items-center justify-center space-x-2"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleQuickAdd(product)}
                            className="btn-secondary px-4"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 via-forest-800 to-emerald-900">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-cream-100">
              Questions About Our Products?
            </h2>
            <p className="text-xl text-cream-200 mb-8 max-w-2xl mx-auto">
              Our expert team is here to help you find the perfect THCA product for your needs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 btn-primary text-lg px-8 py-4"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}