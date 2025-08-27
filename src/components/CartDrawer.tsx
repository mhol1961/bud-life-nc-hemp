import React, { useState } from 'react'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, totalItems, totalAmount, loading, updateQuantity, removeFromCart } = useCart()
  const [updating, setUpdating] = useState<string | null>(null)

  if (!isOpen) return null

  const handleQuantityChange = async (productId: string, variantId: string | undefined, newQuantity: number) => {
    const key = `${productId}-${variantId || 'default'}`
    try {
      setUpdating(key)
      await updateQuantity(productId, variantId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (productId: string, variantId?: string) => {
    const key = `${productId}-${variantId || 'default'}`
    try {
      setUpdating(key)
      await removeFromCart(productId, variantId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-white" />
            <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
            {totalItems > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading cart...</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Add some products to get started!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => {
                  const key = `${item.product_id}-${item.variant_id || 'default'}`
                  const isUpdating = updating === key
                  
                  return (
                    <Card key={key} className={`transition-opacity ${isUpdating ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          {item.product_image_url ? (
                            <img
                              src={item.product_image_url}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{item.product_name}</h4>
                            {item.variant_name && (
                              <p className="text-sm text-gray-600">{item.variant_name}</p>
                            )}
                            <p className="text-lg font-semibold text-blue-600 mt-1">
                              {formatCurrency(item.price)}
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-3">
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.product_id, item.variant_id, item.quantity - 1)}
                                  disabled={isUpdating || item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.product_id, item.variant_id, item.quantity + 1)}
                                  disabled={isUpdating}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveItem(item.product_id, item.variant_id)}
                                disabled={isUpdating}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="border-t bg-gray-50 p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                
                <Button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold py-3"
                  disabled={loading || totalItems === 0}
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}