import React from 'react'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export function CartSidebar() {
  const { items, total, isOpen, closeCart, updateQuantity, removeItem } = useCartStore()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        {/* Sidebar */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900">
                Shopping Cart ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-stone-300 rounded-full" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-stone-500 mb-4">
                    Add some premium THCA products to get started.
                  </p>
                  <Link
                    to="/products"
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Shop Products
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product_id}
                      layout
                      className="flex items-start space-x-4 p-4 border border-stone-200 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-stone-100 rounded-lg flex-shrink-0">
                        {item.product_image_url ? (
                          <img
                            src={item.product_image_url}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-200 rounded-lg flex items-center justify-center">
                            <span className="text-stone-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-900 text-sm line-clamp-2">
                          {item.product_name}
                        </h4>
                        {item.category && (
                          <p className="text-xs text-stone-500 capitalize mt-1">
                            {item.category}
                          </p>
                        )}
                        {(item.thc_content || item.cbd_content) && (
                          <div className="flex space-x-2 mt-1">
                            {item.thc_content && (
                              <span className="text-xs text-stone-500">
                                THC: {item.thc_content}%
                              </span>
                            )}
                            {item.cbd_content && (
                              <span className="text-xs text-stone-500">
                                CBD: {item.cbd_content}%
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Price */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="font-semibold text-stone-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.compare_at_price && item.compare_at_price > item.price && (
                            <span className="text-xs text-stone-500 line-through">
                              ${item.compare_at_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end space-y-2">
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="text-sm font-medium text-stone-900 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                            disabled={item.max_quantity && item.quantity >= item.max_quantity}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="text-xs text-stone-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-stone-200 space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span className="text-stone-900">Subtotal</span>
                    <span className="text-stone-900">${total.toFixed(2)}</span>
                  </div>
                  
                  {/* Shipping Note */}
                  <p className="text-sm text-stone-500">
                    {total >= 75 ? (
                      <span className="text-sage-600 font-medium">Free shipping included!</span>
                    ) : (
                      `Add $${(75 - total).toFixed(2)} more for free shipping`
                    )}
                  </p>
                  
                  {/* Actions */}
                  <div className="space-y-3">
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className="btn-primary w-full text-center"
                    >
                      Proceed to Checkout
                    </Link>
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="btn-secondary w-full text-center"
                    >
                      View Cart Details
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}