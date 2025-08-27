import React from 'react'
import { CheckCircle, ShoppingBag, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface CheckoutSuccessProps {
  orderId: string
  onContinueShopping: () => void
}

export function CheckoutSuccess({ orderId, onContinueShopping }: CheckoutSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center">
        <CardContent className="p-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 text-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Order Number:</span>
              <span className="font-mono text-blue-600 bg-white px-3 py-1 rounded border">
                #{orderId.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <Mail className="w-5 h-5" />
              <span>A confirmation email has been sent to your email address.</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <ArrowRight className="w-5 h-5" />
              <span>You can track your order status in your account dashboard.</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={onContinueShopping}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
            >
              Continue Shopping
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/admin/orders'}
              className="w-full"
            >
              View Order Details
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-8">
            Need help? Contact our support team at support@budlife.com
          </p>
        </CardContent>
      </Card>
    </div>
  )
}