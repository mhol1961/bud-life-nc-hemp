import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Eye, Badge } from 'lucide-react'
import { useCartStore } from '@/hooks/useCart'
import { useAuth } from '@/contexts/AuthContext'
import type { Product } from '@/lib/supabase'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCartStore()
  const { user } = useAuth()
  const currentQuantity = getItemQuantity(product.id)

  const handleAddToCart = () => {
    if (product.quantity <= 0 && !product.allow_backorder) {
      toast.error('Product is out of stock')
      return
    }

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      price: product.price,
      compare_at_price: product.compare_at_price || undefined,
      quantity: 1,
      category: product.category || undefined,
      thc_content: product.thc_content || undefined,
      cbd_content: product.cbd_content || undefined,
      strain_type: product.strain_type || undefined,
      max_quantity: product.quantity,
    })
    
    toast.success('Added to cart!')
  }

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist')
      return
    }
    // TODO: Implement wishlist functionality
    toast.success('Added to wishlist!')
  }

  const isOutOfStock = product.quantity <= 0 && !product.allow_backorder
  const isLowStock = product.track_quantity && product.quantity <= product.low_stock_threshold && product.quantity > 0
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card-premium overflow-hidden group ${featured ? 'lg:col-span-2' : ''}`}
    >
      <div className="relative">
        {/* Product Image */}
        <div className={`relative ${featured ? 'aspect-[3/2]' : 'aspect-square'} bg-stone-100 overflow-hidden`}>
          {/* Placeholder for now - in production, this would show actual product images */}
          <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-sage-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-sage-400 rounded-full" />
              </div>
              <p className="text-xs text-stone-500">{product.category || 'Product'}</p>
            </div>
          </div>
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              <Link
                to={`/products/${product.slug}`}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-stone-50 transition-colors"
              >
                <Eye className="w-4 h-4 text-stone-600" />
              </Link>
              <button
                onClick={handleAddToWishlist}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-stone-50 transition-colors"
              >
                <Heart className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>
          
          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.is_new && (
              <span className="px-2 py-1 bg-sage-600 text-white text-xs font-medium rounded">
                New
              </span>
            )}
            {product.featured && (
              <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
                Featured
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                -{discountPercentage}%
              </span>
            )}
            {product.lab_tested && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                Lab Tested
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="absolute top-2 right-2">
            {isOutOfStock && (
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                Out of Stock
              </span>
            )}
            {isLowStock && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
                Low Stock
              </span>
            )}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Category & Strain */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-sage-600 font-medium uppercase tracking-wide">
              {product.category || 'Product'}
            </span>
            {product.strain_type && (
              <span className="text-xs text-stone-500 capitalize">
                {product.strain_type}
              </span>
            )}
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-stone-900 mb-2 line-clamp-2">
            <Link 
              to={`/products/${product.slug}`}
              className="hover:text-sage-600 transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          
          {/* Short Description */}
          {product.short_description && (
            <p className="text-sm text-stone-600 mb-3 line-clamp-2">
              {product.short_description}
            </p>
          )}
          
          {/* Cannabinoid Info */}
          {(product.thc_content || product.cbd_content) && (
            <div className="flex space-x-3 mb-3">
              {product.thc_content && (
                <div className="text-center">
                  <div className="text-xs text-stone-500">THC</div>
                  <div className="text-sm font-semibold text-stone-900">
                    {product.thc_content}%
                  </div>
                </div>
              )}
              {product.cbd_content && (
                <div className="text-center">
                  <div className="text-xs text-stone-500">CBD</div>
                  <div className="text-sm font-semibold text-stone-900">
                    {product.cbd_content}%
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Rating - Placeholder for now */}
          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 text-amber-400 fill-current"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-stone-500">(24 reviews)</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-stone-900">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-stone-500 line-through">
                  ${product.compare_at_price!.toFixed(2)}
                </span>
              )}
            </div>
            
            {product.track_quantity && (
              <span className="text-xs text-stone-500">
                {product.quantity} in stock
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : 'btn-primary hover:shadow-glow'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? 'Out of Stock'
                : currentQuantity > 0
                ? `Add Another (${currentQuantity} in cart)`
                : 'Add to Cart'
              }
            </span>
          </button>
          
          {/* Lab Tested Badge */}
          {product.lab_tested && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-sage-600">
              <Badge className="w-3 h-3" />
              <span>Lab Tested & COA Available</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}