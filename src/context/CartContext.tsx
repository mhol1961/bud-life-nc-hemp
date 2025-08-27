import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface CartItem {
  product_id: string
  variant_id?: string
  product_name: string
  variant_name?: string
  price: number
  quantity: number
  product_image_url?: string
  added_at: string
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  sessionId: string
  loading: boolean
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string, variantId?: string) => Promise<void>
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => {
    // Get or create session ID
    let id = sessionStorage.getItem('cartSessionId')
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem('cartSessionId', id)
    }
    return id
  })

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const refreshCart = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke('cart-management', {
        body: {
          action: 'GET_CART',
          sessionId
        }
      })

      if (error) {
        console.error('Cart refresh error:', error)
        return
      }

      if (data?.data) {
        setItems(data.data.items || [])
      }
    } catch (err) {
      console.error('Failed to refresh cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, variantId?: string, quantity: number = 1) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke('cart-management', {
        body: {
          action: 'ADD_ITEM',
          sessionId,
          productId,
          variantId,
          quantity
        }
      })

      if (error) {
        throw error
      }

      if (data?.data) {
        setItems(data.data.items || [])
      }
    } catch (err) {
      console.error('Add to cart error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string, variantId?: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke('cart-management', {
        body: {
          action: 'REMOVE_ITEM',
          sessionId,
          productId,
          variantId
        }
      })

      if (error) {
        throw error
      }

      if (data?.data) {
        setItems(data.data.items || [])
      }
    } catch (err) {
      console.error('Remove from cart error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId, variantId)
      return
    }

    // Remove existing item and add with new quantity
    try {
      setLoading(true)
      await removeFromCart(productId, variantId)
      await addToCart(productId, variantId, quantity)
    } catch (err) {
      console.error('Update quantity error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke('cart-management', {
        body: {
          action: 'CLEAR_CART',
          sessionId
        }
      })

      if (error) {
        throw error
      }

      setItems([])
    } catch (err) {
      console.error('Clear cart error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Load cart on mount
  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalAmount,
      sessionId,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  )
}