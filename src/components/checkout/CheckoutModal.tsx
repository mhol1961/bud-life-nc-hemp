import React, { useState } from 'react'
import { X } from 'lucide-react'
import { CheckoutForm } from './CheckoutForm'
import { CheckoutSuccess } from './CheckoutSuccess'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [currentView, setCurrentView] = useState<'checkout' | 'success'>('checkout')
  const [orderId, setOrderId] = useState<string>('')

  const handleSuccess = (orderIdValue: string) => {
    setOrderId(orderIdValue)
    setCurrentView('success')
  }

  const handleClose = () => {
    setCurrentView('checkout')
    setOrderId('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-8">
        <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-6xl">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white rounded-t-lg z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentView === 'checkout' ? 'Checkout' : 'Order Complete'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {currentView === 'checkout' && (
              <CheckoutForm
                onSuccess={handleSuccess}
                onBack={handleClose}
              />
            )}
            
            {currentView === 'success' && (
              <CheckoutSuccess
                orderId={orderId}
                onContinueShopping={handleClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}