import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { adminAPI } from '@/lib/adminAPI'
import type { DashboardMetrics } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

const COLORS = {
  primary: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'],
  success: ['#059669', '#10B981', '#34D399', '#6EE7B7'],
  warning: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D'],
  danger: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
  info: ['#0891B2', '#06B6D4', '#22D3EE', '#67E8F9'],
  neutral: ['#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB']
}

const mockChartData = [
  { date: '2025-01-15', revenue: 2400, orders: 12, customers: 8 },
  { date: '2025-01-16', revenue: 1800, orders: 9, customers: 6 },
  { date: '2025-01-17', revenue: 3200, orders: 16, customers: 12 },
  { date: '2025-01-18', revenue: 2800, orders: 14, customers: 10 },
  { date: '2025-01-19', revenue: 4200, orders: 21, customers: 15 },
  { date: '2025-01-20', revenue: 3600, orders: 18, customers: 13 },
  { date: '2025-01-21', revenue: 5100, orders: 24, customers: 18 }
]

const orderStatusData = [
  { name: 'Completed', value: 45, color: COLORS.success[0] },
  { name: 'Processing', value: 30, color: COLORS.info[0] },
  { name: 'Pending', value: 20, color: COLORS.warning[0] },
  { name: 'Cancelled', value: 5, color: COLORS.danger[0] }
]

const categoryData = [
  { name: 'Flower', sales: 4500, color: COLORS.primary[0] },
  { name: 'Edibles', sales: 3200, color: COLORS.success[0] },
  { name: 'Concentrates', sales: 2800, color: COLORS.warning[0] },
  { name: 'Topicals', sales: 1500, color: COLORS.info[0] },
  { name: 'Accessories', sales: 800, color: COLORS.danger[0] }
]

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  gradient: string
  description?: string
}

function StatCard({ title, value, change, icon: Icon, gradient, description }: StatCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          
          {change !== undefined && (
            <div className={`flex items-center text-sm font-medium ${
              isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : isNegative ? (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              ) : null}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('7days')

  useEffect(() => {
    loadDashboardData()
  }, [selectedPeriod])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await adminAPI.getDashboardData(selectedPeriod)
      setMetrics(data)
    } catch (err: any) {
      console.error('Dashboard data error:', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" text="Loading dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="p-8 bg-red-50 rounded-xl border border-red-200 inline-block">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={loadDashboardData} variant="destructive">
            Try Again
          </Button>
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
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <Button variant="info" className="shadow-lg">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics?.totalRevenue || 0)}
          change={12.5}
          icon={DollarSign}
          gradient="from-emerald-600 to-emerald-700"
          description="vs last period"
        />
        
        <StatCard
          title="Total Orders"
          value={metrics?.totalOrders || 0}
          change={8.2}
          icon={ShoppingCart}
          gradient="from-blue-600 to-blue-700"
          description={`${metrics?.completedOrders || 0} completed`}
        />
        
        <StatCard
          title="New Customers"
          value={metrics?.newCustomers || 0}
          change={15.3}
          icon={Users}
          gradient="from-purple-600 to-purple-700"
          description="this period"
        />
        
        <StatCard
          title="Active Products"
          value={metrics?.activeProducts || 0}
          change={-2.1}
          icon={Package}
          gradient="from-orange-600 to-orange-700"
          description={`${metrics?.lowStockProducts || 0} low stock`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Revenue & Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <BarChart className="h-4 w-4 text-white" />
            </div>
            Product Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [formatCurrency(Number(value)), 'Sales']}
              />
              <Bar
                dataKey="sales"
                radius={[8, 8, 0, 0]}
                fill="#3B82F6"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add New Product</h3>
            <p className="text-sm text-gray-600">Quickly add new hemp products to your inventory</p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">View Customers</h3>
            <p className="text-sm text-gray-600">Manage customer relationships and orders</p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">Dive deep into your business metrics</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}