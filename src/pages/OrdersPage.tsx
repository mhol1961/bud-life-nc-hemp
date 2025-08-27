import React, { useState, useEffect } from 'react'
import { ShoppingCart, Package, AlertCircle, DollarSign, TrendingUp, Eye, Mail, Download, Filter, Search, RefreshCw, CheckCircle2, Clock, Truck, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

interface Order {
  id: string
  order_number: string
  customer_id?: string
  email: string
  phone?: string
  items: any[]
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total: number
  payment_status: string
  payment_method: string
  square_payment_id?: string
  fulfillment_status: string
  billing_address?: any
  shipping_address?: any
  status: string
  created_at: string
  updated_at: string
  completed_at?: string
}

interface EmailLog {
  id: string
  recipient_email: string
  email_type: string
  subject: string
  order_id?: string
  status: string
  sent_at: string
  opened_at?: string
  clicked_at?: string
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'orders' | 'emails'>('orders')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    emailsSent: 0,
    emailOpenRate: 0
  })

  useEffect(() => {
    loadOrdersAndStats()
    loadEmailLogs()
  }, [])

  const loadOrdersAndStats = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch orders with related data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .order('created_at', { ascending: false })
      
      if (ordersError) {
        throw ordersError
      }
      
      const processedOrders = (ordersData || []).map(order => ({
        ...order,
        items: order.order_items || []
      }))
      
      setOrders(processedOrders)
      
      // Calculate stats
      const totalOrders = processedOrders.length
      const totalRevenue = processedOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      const pendingOrders = processedOrders.filter(order => order.status === 'pending').length
      const completedOrders = processedOrders.filter(order => order.status === 'completed').length
      
      setStats(prev => ({
        ...prev,
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders
      }))
      
    } catch (err: any) {
      console.error('Failed to load orders:', err)
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }
  
  const loadEmailLogs = async () => {
    try {
      const { data: emailData, error: emailError } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(100)
      
      if (emailError) {
        console.error('Failed to load email logs:', emailError)
        return
      }
      
      const emails = emailData || []
      setEmailLogs(emails)
      
      // Calculate email stats
      const emailsSent = emails.length
      const emailsOpened = emails.filter(email => email.opened_at).length
      const emailOpenRate = emailsSent > 0 ? (emailsOpened / emailsSent) * 100 : 0
      
      setStats(prev => ({
        ...prev,
        emailsSent,
        emailOpenRate
      }))
      
    } catch (err: any) {
      console.error('Failed to load email logs:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    )
  }

  const getEmailTypeBadge = (type: string) => {
    const typeConfig = {
      order_confirmation: { color: 'bg-green-100 text-green-800', label: 'Order Confirmation' },
      abandoned_cart: { color: 'bg-orange-100 text-orange-800', label: 'Abandoned Cart' },
      reorder_reminder: { color: 'bg-purple-100 text-purple-800', label: 'Re-order Reminder' },
      shipping_update: { color: 'bg-blue-100 text-blue-800', label: 'Shipping Update' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'bg-gray-100 text-gray-800', label: type }
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const filteredEmails = emailLogs.filter(email => {
    const matchesSearch = searchQuery === '' || 
      email.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders and analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="p-8 bg-red-50 rounded-xl border border-red-200 inline-block">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Orders</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={loadOrdersAndStats} variant="destructive">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Orders & Email Management
          </h1>
          <p className="text-gray-600 mt-1">Track orders, manage fulfillment, and monitor email campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={loadOrdersAndStats} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">All time orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-gray-500 mt-1">Total sales</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.completedOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Orders fulfilled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.emailsSent}</div>
            <p className="text-xs text-gray-500 mt-1">All automated emails</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Email Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.emailOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">Email engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingCart className="h-4 w-4 inline mr-2" />
            Orders ({stats.totalOrders})
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'emails'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Email Campaigns ({stats.emailsSent})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'orders' ? 'Search orders...' : 'Search emails...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {activeTab === 'orders' && (
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                    <ShoppingCart className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">No Orders Found</h2>
                  <p className="text-gray-600 max-w-md">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No orders match your current filters. Try adjusting your search criteria.' 
                      : 'When customers complete purchases through the storefront, their orders will appear here automatically.'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>E-commerce system is active and processing orders</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.order_number}
                          </h3>
                          {getStatusBadge(order.status)}
                          {order.payment_status === 'completed' && (
                            <Badge className="bg-green-100 text-green-800 border-0">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Customer:</span>
                            <p className="font-medium text-gray-900">{order.email}</p>
                            {order.phone && <p className="text-gray-600">{order.phone}</p>}
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Order Date:</span>
                            <p className="font-medium text-gray-900">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-gray-600">
                              {new Date(order.created_at).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Items:</span>
                            <p className="font-medium text-gray-900">
                              {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                            </p>
                            {order.items?.slice(0, 2).map((item: any, index: number) => (
                              <p key={index} className="text-gray-600 text-xs truncate">
                                {item.quantity}× {item.product_name}
                              </p>
                            ))}
                            {(order.items?.length || 0) > 2 && (
                              <p className="text-gray-600 text-xs">+{(order.items?.length || 0) - 2} more</p>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <p className="text-xl font-bold text-gray-900">
                              {formatCurrency(order.total)}
                            </p>
                            {order.square_payment_id && (
                              <p className="text-xs text-gray-500">Square: {order.square_payment_id.slice(-8)}</p>
                            )}
                          </div>
                        </div>
                        
                        {order.shipping_address && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-gray-500">Shipping Address:</span>
                            <p className="text-sm text-gray-900 mt-1">
                              {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                              {order.shipping_address.address}<br />
                              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex lg:flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {order.status === 'pending' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Package className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Email Logs Tab */}
      {activeTab === 'emails' && (
        <div className="space-y-6">
          {filteredEmails.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
                    <Mail className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">No Email Logs Found</h2>
                  <p className="text-gray-600 max-w-md">
                    {searchQuery 
                      ? 'No email logs match your search criteria.' 
                      : 'Email logs will appear here as automated emails are sent to customers.'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Order Confirmations</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                      <Clock className="h-4 w-4" />
                      <span>Abandoned Cart Recovery</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                      <RefreshCw className="h-4 w-4" />
                      <span>14-Day Re-order Reminders</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredEmails.map((email) => (
                <Card key={email.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          {getEmailTypeBadge(email.email_type)}
                          <Badge className={`${
                            email.opened_at ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          } border-0`}>
                            {email.opened_at ? 'Opened' : 'Sent'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Recipient:</span>
                            <p className="font-medium text-gray-900">{email.recipient_email}</p>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Subject:</span>
                            <p className="font-medium text-gray-900 truncate">{email.subject}</p>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Sent:</span>
                            <p className="font-medium text-gray-900">
                              {new Date(email.sent_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                            {email.opened_at && (
                              <p className="text-green-600 text-xs">
                                Opened {new Date(email.opened_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}