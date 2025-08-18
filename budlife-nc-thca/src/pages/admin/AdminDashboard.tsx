import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Star
} from 'lucide-react'

const stats = [
  {
    name: 'Total Revenue',
    value: '$12,847',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: DollarSign,
    period: 'vs last month'
  },
  {
    name: 'Orders',
    value: '248',
    change: '+8.1%',
    changeType: 'positive' as const,
    icon: ShoppingBag,
    period: 'vs last month'
  },
  {
    name: 'Customers',
    value: '1,423',
    change: '+12.7%',
    changeType: 'positive' as const,
    icon: Users,
    period: 'total active'
  },
  {
    name: 'Products',
    value: '2',
    change: '0%',
    changeType: 'neutral' as const,
    icon: Package,
    period: 'in catalog'
  },
]

const recentOrders = [
  {
    id: '#ORD-2024-001',
    customer: 'Sarah Johnson',
    product: 'Jealousy 3.5G',
    amount: '$35.00',
    status: 'completed',
    date: '2 hours ago'
  },
  {
    id: '#ORD-2024-002',
    customer: 'Mike Chen',
    product: 'Gushers 7G',
    amount: '$55.00',
    status: 'processing',
    date: '4 hours ago'
  },
  {
    id: '#ORD-2024-003',
    customer: 'Emily Rodriguez',
    product: 'Jealousy 7G',
    amount: '$65.00',
    status: 'shipped',
    date: '6 hours ago'
  },
  {
    id: '#ORD-2024-004',
    customer: 'David Wilson',
    product: 'Gushers 3.5G',
    amount: '$30.00',
    status: 'pending',
    date: '8 hours ago'
  },
]

const lowStockItems = [
  {
    name: 'Jealousy 3.5G',
    current: 5,
    minimum: 10,
    status: 'low'
  },
  {
    name: 'Gushers 7G',
    current: 3,
    minimum: 10,
    status: 'critical'
  },
]

const quickActions = [
  {
    name: 'Add Product',
    description: 'Add new strain to catalog',
    href: '/admin/products/new',
    icon: Package,
    color: 'bg-emerald-500 hover:bg-emerald-600'
  },
  {
    name: 'Upload COA',
    description: 'Upload lab results',
    href: '/admin/lab-results/upload',
    icon: CheckCircle,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    name: 'View Orders',
    description: 'Manage pending orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    name: 'Marketing',
    description: 'Create campaign',
    href: '/admin/marketing',
    icon: TrendingUp,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-forest-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-emerald-100 text-lg">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
            <div className="text-emerald-100">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : stat.changeType === 'neutral' ? (
                  <div className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600' :
                  stat.changeType === 'neutral' ? 'text-gray-500' :
                  'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.name}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.period}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link 
                  to="/admin/orders"
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-gray-900">{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.customer} • {order.product}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{order.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{order.amount}</div>
                      <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                        View details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className={`${action.color} text-white p-4 rounded-lg transition-colors hover:scale-105 transform duration-200 text-center group`}
                  >
                    <action.icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-sm font-medium">{action.name}</div>
                    <div className="text-xs opacity-90 mt-1">{action.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Low Stock Alert</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {item.current} units remaining
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
              <Link
                to="/admin/products"
                className="block w-full mt-4 text-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Update Inventory
              </Link>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">This Week</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Page Views</span>
                  </div>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                  </div>
                  <span className="font-semibold">3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Avg. Rating</span>
                  </div>
                  <span className="font-semibold">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
