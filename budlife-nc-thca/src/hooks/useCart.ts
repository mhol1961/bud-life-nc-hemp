import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState } from '@/lib/types'

interface CartStore extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getItemQuantity: (productId: string) => number
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(item => item.product_id === newItem.product_id)
        
        let updatedItems: CartItem[]
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          updatedItems = items.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.max_quantity || 999) }
              : item
          )
        } else {
          // Add new item
          updatedItems = [...items, newItem]
        }
        
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        })
      },

      removeItem: (productId) => {
        const { items } = get()
        const updatedItems = items.filter(item => item.product_id !== productId)
        
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        const { items } = get()
        const updatedItems = items.map(item => 
          item.product_id === productId 
            ? { ...item, quantity: Math.min(quantity, item.max_quantity || 999) }
            : item
        )
        
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        })
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0
        })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemQuantity: (productId) => {
        const { items } = get()
        const item = items.find(item => item.product_id === productId)
        return item?.quantity || 0
      },
    }),
    {
      name: 'budlife-cart-storage',
      version: 1,
    }
  )
)
