import React, { useState } from 'react'
import { CreditCard, User, MapPin, Mail, Phone, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void
  onBack: () => void
}

interface CustomerInfo {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentInfo {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
}

export function CheckoutForm({ onSuccess, onBack }: CheckoutFormProps) {
  const { items, totalAmount, sessionId, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'customer' | 'payment' | 'processing'>('customer')
  const [error, setError] = useState<string | null>(null)
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  })

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})/g, '$1 ').trim()
    return formatted.slice(0, 19) // Limit to 16 digits + 3 spaces
  }

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: string) => {
    let formattedValue = value
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryMonth' || field === 'expiryYear') {
      formattedValue = value.replace(/\D/g, '').slice(0, field === 'expiryMonth' ? 2 : 4)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    }
    
    setPaymentInfo(prev => ({ ...prev, [field]: formattedValue }))
    setError(null)
  }

  const validateCustomerInfo = (): boolean => {
    const required = ['email', 'firstName', 'lastName', 'phone', 'address', 'city', 'state', 'zipCode']
    for (const field of required) {
      if (!customerInfo[field as keyof CustomerInfo].trim()) {
        setError(`Please fill in all required fields`)
        return false
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerInfo.email)) {
      setError('Please enter a valid email address')
      return false
    }
    
    return true
  }

  const validatePaymentInfo = (): boolean => {
    const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '')
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      setError('Please enter a valid card number')
      return false
    }
    
    if (!paymentInfo.expiryMonth || !paymentInfo.expiryYear) {
      setError('Please enter the card expiry date')
      return false
    }
    
    const month = parseInt(paymentInfo.expiryMonth)
    const year = parseInt(paymentInfo.expiryYear)
    const currentYear = new Date().getFullYear()
    
    if (month < 1 || month > 12) {
      setError('Please enter a valid expiry month (01-12)')
      return false
    }
    
    if (year < currentYear || year > currentYear + 20) {
      setError('Please enter a valid expiry year')
      return false
    }
    
    if (paymentInfo.cvv.length < 3) {
      setError('Please enter a valid CVV')
      return false
    }
    
    if (!paymentInfo.cardholderName.trim()) {
      setError('Please enter the cardholder name')
      return false
    }
    
    return true
  }

  const handleProcessPayment = async () => {
    if (!validatePaymentInfo()) return
    
    try {
      setLoading(true)
      setCurrentStep('processing')
      setError(null)
      
      // Create payment with Square
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-square-payment-intent', {
        body: {
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: 'USD',
          customer: customerInfo,
          payment: {
            ...paymentInfo,
            cardNumber: paymentInfo.cardNumber.replace(/\s/g, ''), // Remove spaces
            expiryMonth: paymentInfo.expiryMonth.padStart(2, '0'),
            expiryYear: paymentInfo.expiryYear
          },
          items: items.map(item => ({
            id: item.product_id,
            name: item.product_name,
            variant: item.variant_name,
            quantity: item.quantity,
            price: item.price
          })),
          sessionId
        }
      })
      
      if (paymentError) {
        throw new Error(paymentError.message || 'Payment failed')
      }
      
      if (!paymentData?.data?.success) {
        throw new Error(paymentData?.data?.error || 'Payment processing failed')
      }
      
      // Payment successful - clear cart and redirect
      await clearCart()
      onSuccess(paymentData.data.orderId)
      
    } catch (err: any) {
      console.error('Payment processing error:', err)
      setError(err.message || 'Payment failed. Please try again.')
      setCurrentStep('payment')
    } finally {
      setLoading(false)
    }
  }

  if (currentStep === 'processing') {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment securely...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map(item => {
              const key = `${item.product_id}-${item.variant_id || 'default'}`
              return (
                <div key={key} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    {item.variant_name && (
                      <p className="text-gray-600">{item.variant_name}</p>
                    )}
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              )
            })}
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Checkout Form */}
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}
        
        {/* Customer Information */}
        {currentStep === 'customer' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    value={customerInfo.firstName}
                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={customerInfo.lastName}
                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address *
                </label>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State *</label>
                  <input
                    type="text"
                    value={customerInfo.state}
                    onChange={(e) => handleCustomerInfoChange('state', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="NY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    value={customerInfo.zipCode}
                    onChange={(e) => handleCustomerInfoChange('zipCode', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={onBack}>
                  Back to Cart
                </Button>
                <Button 
                  onClick={() => {
                    if (validateCustomerInfo()) {
                      setCurrentStep('payment')
                    }
                  }}
                  className="flex-1"
                >
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Payment Information */}
        {currentStep === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                <input
                  type="text"
                  value={paymentInfo.cardholderName}
                  onChange={(e) => handlePaymentInfoChange('cardholderName', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Card Number *</label>
                <input
                  type="text"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Month *</label>
                  <input
                    type="text"
                    value={paymentInfo.expiryMonth}
                    onChange={(e) => handlePaymentInfoChange('expiryMonth', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12"
                    maxLength={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year *</label>
                  <input
                    type="text"
                    value={paymentInfo.expiryYear}
                    onChange={(e) => handlePaymentInfoChange('expiryYear', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2025"
                    maxLength={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV *</label>
                  <input
                    type="text"
                    value={paymentInfo.cvv}
                    onChange={(e) => handlePaymentInfoChange('cvv', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="mt-1">Your payment information is encrypted and secure.</p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('customer')}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleProcessPayment}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800"
                >
                  {loading ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}