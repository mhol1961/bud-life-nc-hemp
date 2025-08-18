import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Star, Shield, Download, Eye, Heart, ShoppingCart, 
  Leaf, Award, Users, ChevronDown, ChevronUp, ExternalLink,
  Truck, CreditCard, RotateCcw
} from 'lucide-react'
import { useCartStore } from '@/hooks/useCart'
import toast from 'react-hot-toast'

type ProductSize = {
  size: string
  price: number
  comparePrice?: number
  inStock: boolean
}

type Product = {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  image: string
  category: string
  strain: string
  thcContent: number
  cbdContent: number
  sizes: ProductSize[]
  coaUrl: string
  effects: string[]
  terpenes: string[]
  rating: number
  reviewCount: number
  featured: boolean
}

const products: Record<string, Product> = {
  jealousy: {
    id: 'jealousy-strain',
    name: 'Jealousy',
    slug: 'jealousy',
    description: 'A potent hybrid with stunning purple hues and an incredible terpene profile. Perfect for experienced users seeking premium quality.',
    longDescription: `Jealousy is a premium hybrid strain that showcases the finest qualities of modern cannabis cultivation. This exceptional flower features deep purple hues with vibrant orange pistils, all covered in a thick layer of crystalline trichomes that sparkle like fresh snow.

Developed through meticulous breeding, Jealousy offers a complex terpene profile that delivers both potency and flavor. The dense, sticky buds are hand-trimmed to perfection, ensuring every gram meets our rigorous quality standards.

Lab-tested for purity and potency, this batch shows exceptional cannabinoid levels and passes all safety tests with flying colors. Each purchase includes access to our full Certificate of Analysis for complete transparency.`,
    image: '/images/jealousy_flower.png',
    category: 'THCA Flower',
    strain: 'Hybrid',
    thcContent: 24.8,
    cbdContent: 0.8,
    sizes: [
      { size: '3.5G', price: 35, comparePrice: 45, inStock: true },
      { size: '7G', price: 65, comparePrice: 85, inStock: true },
    ],
    coaUrl: '/coa/Jealousy AAA Indoor THCA.pdf',
    effects: ['Relaxed', 'Happy', 'Euphoric', 'Creative', 'Focused'],
    terpenes: ['Limonene', 'Myrcene', 'Pinene', 'Linalool'],
    rating: 4.9,
    reviewCount: 127,
    featured: true
  },
  gushers: {
    id: 'gushers-strain',
    name: 'Gushers',
    slug: 'gushers',
    description: 'Sweet and fruity with dense, frosty buds. A customer favorite known for its exceptional flavor and smooth experience.',
    longDescription: `Gushers represents the pinnacle of fruity cannabis strains, delivering an explosion of sweet, tropical flavors that dance on your palate. This top-shelf THCA flower showcases incredibly dense buds with a rainbow of colors - from deep greens to purple undertones, all generously coated in sparkling trichomes.

Renowned for its exceptional bag appeal and aromatic profile, Gushers offers a smooth, flavorful experience that appeals to both newcomers and connoisseurs. The careful curing process preserves the natural terpenes, resulting in a rich, complex flavor profile that's both sweet and satisfying.

Our Gushers batch is cultivated using sustainable practices and undergoes rigorous third-party testing to ensure the highest standards of purity and potency. Every package includes detailed lab results for your peace of mind.`,
    image: '/images/gushers_flower.png',
    category: 'THCA Flower',
    strain: 'Hybrid',
    thcContent: 22.4,
    cbdContent: 1.2,
    sizes: [
      { size: '3.5G', price: 30, comparePrice: 40, inStock: true },
      { size: '7G', price: 55, comparePrice: 75, inStock: true },
    ],
    coaUrl: '/coa/Gushers Top Shelf THCA.pdf',
    effects: ['Uplifted', 'Happy', 'Relaxed', 'Giggly', 'Mellow'],
    terpenes: ['Caryophyllene', 'Limonene', 'Humulene', 'Myrcene'],
    rating: 4.8,
    reviewCount: 94,
    featured: true
  }
}

const reviews = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    date: '2025-01-15',
    review: 'Absolutely incredible quality! The effects were exactly what I was looking for, and the flavor is outstanding.',
    verified: true
  },
  {
    id: 2,
    name: 'Mike R.',
    rating: 5,
    date: '2025-01-10',
    review: 'Fast shipping, premium quality, and excellent customer service. Will definitely order again!',
    verified: true
  },
  {
    id: 3,
    name: 'Jennifer L.',
    rating: 4,
    date: '2025-01-05',
    review: 'Really impressed with the quality and effects. The COA transparency is a huge plus.',
    verified: true
  }
]

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'lab'>('description')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()

  const product = slug ? products[slug] : null

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cream-100 mb-4">Product Not Found</h1>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size first')
      return
    }

    addItem({
      product_id: product.id,
      product_name: `${product.name} - ${selectedSize.size}`,
      product_slug: product.slug,
      price: selectedSize.price,
      compare_at_price: selectedSize.comparePrice,
      quantity: 1,
      category: product.category,
      thc_content: product.thcContent,
      cbd_content: product.cbdContent,
      strain_type: product.strain,
      max_quantity: 10,
      product_image_url: product.image
    })

    toast.success(`Added ${product.name} (${selectedSize.size}) to cart!`)
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div className="min-h-screen bg-black text-cream">
      {/* Breadcrumb */}
      <div className="bg-black-800 border-b border-forest-700">
        <div className="container-premium py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-cream-300 hover:text-emerald-400 transition-colors">Home</Link>
            <span className="text-cream-500">/</span>
            <Link to="/products" className="text-cream-300 hover:text-emerald-400 transition-colors">Products</Link>
            <span className="text-cream-500">/</span>
            <span className="text-emerald-400 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[600px] object-cover rounded-3xl border border-forest-700 group-hover:border-emerald-500 transition-colors duration-500"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={toggleWishlist}
                    className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 ${
                      isWishlisted 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-black/50 text-cream-300 border border-cream/20 hover:bg-emerald-500/20 hover:text-emerald-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 bg-black/50 text-cream-300 border border-cream/20 rounded-xl backdrop-blur-md hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-500 to-gold-600 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    Premium
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-emerald-400 font-medium text-sm">{product.category}</span>
                  <span className="text-cream-500">•</span>
                  <span className="text-cream-300 text-sm">{product.strain}</span>
                </div>
                <h1 className="text-5xl font-bold text-cream-100 mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-gold-400 fill-current' : 'text-cream-600'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-cream-300">{product.rating}/5</span>
                  <span className="text-cream-500">•</span>
                  <span className="text-cream-300">{product.reviewCount} reviews</span>
                </div>
                
                <p className="text-lg text-cream-200 leading-relaxed">{product.description}</p>
              </div>

              {/* Cannabinoid Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black-800 border border-forest-600 rounded-xl p-4">
                  <div className="text-emerald-400 font-semibold">THCA Content</div>
                  <div className="text-2xl font-bold text-cream-100">{product.thcContent}%</div>
                </div>
                <div className="bg-black-800 border border-forest-600 rounded-xl p-4">
                  <div className="text-emerald-400 font-semibold">CBD Content</div>
                  <div className="text-2xl font-bold text-cream-100">{product.cbdContent}%</div>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-cream-100 mb-4">Select Size</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative p-4 border rounded-xl transition-all duration-300 ${
                        selectedSize?.size === size.size
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-forest-600 bg-black-800 hover:border-emerald-400'
                      }`}
                    >
                      <div className="text-left">
                        <div className={`font-semibold ${selectedSize?.size === size.size ? 'text-emerald-400' : 'text-cream-100'}`}>
                          {size.size}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xl font-bold ${selectedSize?.size === size.size ? 'text-emerald-400' : 'text-cream-100'}`}>
                            ${size.price}
                          </span>
                          {size.comparePrice && (
                            <span className="text-cream-500 line-through text-sm">
                              ${size.comparePrice}
                            </span>
                          )}
                        </div>
                        {size.comparePrice && (
                          <div className="text-xs text-gold-400 font-medium">
                            Save ${size.comparePrice - size.price}
                          </div>
                        )}
                      </div>
                      {selectedSize?.size === size.size && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button 
                  onClick={handleAddToCart}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                  {selectedSize && <span>• ${selectedSize.price}</span>}
                </button>
                
                <div className="grid grid-cols-3 gap-4">
                  <button className="btn-secondary flex items-center justify-center space-x-2 py-3">
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <a 
                    href={product.coaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center justify-center space-x-2 py-3"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">COA</span>
                  </a>
                  <button className="btn-secondary flex items-center justify-center space-x-2 py-3">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-forest-700">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-sm text-cream-200">Free Shipping</div>
                  <div className="text-xs text-cream-500">Orders $75+</div>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-sm text-cream-200">Lab Tested</div>
                  <div className="text-xs text-cream-500">COA Included</div>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-sm text-cream-200">30-Day Return</div>
                  <div className="text-xs text-cream-500">Money Back</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-16 bg-black-800">
        <div className="container-premium">
          {/* Tab Navigation */}
          <div className="flex items-center justify-center space-x-8 mb-12">
            {[
              { key: 'description', label: 'Description', icon: Leaf },
              { key: 'reviews', label: 'Reviews', icon: Star },
              { key: 'lab', label: 'Lab Results', icon: Shield }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === key
                    ? 'bg-emerald-500 text-white'
                    : 'text-cream-300 hover:text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'description' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="prose prose-invert max-w-none">
                  {showFullDescription ? (
                    <p className="text-lg text-cream-200 leading-relaxed whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  ) : (
                    <p className="text-lg text-cream-200 leading-relaxed">
                      {product.longDescription.substring(0, 300)}...
                    </p>
                  )}
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-medium mt-4"
                  >
                    <span>{showFullDescription ? 'Show Less' : 'Read More'}</span>
                    {showFullDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Effects & Terpenes */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-black-700 border border-forest-600 rounded-2xl p-6">
                    <h4 className="text-xl font-bold text-cream-100 mb-4 flex items-center space-x-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span>Effects</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.effects.map((effect) => (
                        <span
                          key={effect}
                          className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black-700 border border-forest-600 rounded-2xl p-6">
                    <h4 className="text-xl font-bold text-cream-100 mb-4 flex items-center space-x-2">
                      <Leaf className="w-5 h-5 text-emerald-400" />
                      <span>Terpenes</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.terpenes.map((terpene) => (
                        <span
                          key={terpene}
                          className="bg-forest-500/20 text-forest-300 px-3 py-1 rounded-full text-sm font-medium border border-forest-500/30"
                        >
                          {terpene}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-cream-100 mb-2">{product.rating}/5</div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-6 h-6 ${i < Math.floor(product.rating) ? 'text-gold-400 fill-current' : 'text-cream-600'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-cream-300">Based on {product.reviewCount} reviews</p>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-black-700 border border-forest-600 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-cream-100">{review.name}</span>
                            {review.verified && (
                              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-gold-400 fill-current' : 'text-cream-600'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-cream-500 text-sm">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-cream-200 leading-relaxed">{review.review}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button className="btn-primary">
                    Write a Review
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'lab' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold text-cream-100 mb-4">Certificate of Analysis</h3>
                  <p className="text-cream-300 max-w-2xl mx-auto">
                    Every batch of our THCA flower is thoroughly tested by third-party laboratories 
                    for potency, pesticides, heavy metals, and microbials.
                  </p>
                </div>

                <div className="bg-black-700 border border-forest-600 rounded-2xl p-8">
                  <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-cream-100 mb-4">Lab Report Available</h4>
                  <p className="text-cream-300 mb-6">
                    View the complete Certificate of Analysis for this product, 
                    including detailed cannabinoid profiles and safety test results.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <a
                      href={product.coaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View COA</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={product.coaUrl}
                      download
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16">
        <div className="container-premium">
          <h3 className="text-3xl font-bold text-cream-100 text-center mb-12">You Might Also Like</h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.values(products)
              .filter(p => p.slug !== product.slug)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.slug}
                  to={`/products/${relatedProduct.slug}`}
                  className="group"
                >
                  <div className="bg-black-800 border border-forest-700 rounded-2xl overflow-hidden transition-all duration-500 hover:border-emerald-500 hover:shadow-glow-lg">
                    <div className="relative">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {relatedProduct.strain}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-cream-100 mb-2">{relatedProduct.name}</h4>
                      <p className="text-cream-300 text-sm mb-4">{relatedProduct.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-emerald-400 font-bold">
                          From ${Math.min(...relatedProduct.sizes.map(s => s.price))}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-gold-400 fill-current" />
                          <span className="text-cream-300 text-sm">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetailPage