import React, { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Image as ImageIcon,
  Video,
  Calendar,
  Mail,
  Share2,
  Shield,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    description: 'Manage inventory and catalog'
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    description: 'View and manage orders'
  },
  {
    name: 'Lab Results',
    href: '/admin/lab-results',
    icon: Shield,
    description: 'Upload and manage COAs'
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    description: 'Blog posts and pages'
  },
  {
    name: 'Media',
    href: '/admin/media',
    icon: ImageIcon,
    description: 'Images and videos'
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Customer management'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Sales and performance'
  },
  {
    name: 'Marketing',
    href: '/admin/marketing',
    icon: Mail,
    description: 'Campaigns and promotions'
  },
  {
    name: 'Social Media',
    href: '/admin/social',
    icon: Share2,
    description: 'Social platform management'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (href: string) => {
    if (href === '/admin') {
      return currentPath === '/admin'
    }
    return currentPath.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img 
                src="/images/new-budlife-logo.png" 
                alt="Bud Life NC Hemp Co" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Bud Life NC Hemp Co</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search admin..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${
                    isActive(item.href) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-600">
                      {item.description}
                    </div>
                  </div>
                  {isActive(item.href) && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">admin@budlifenc.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find(item => isActive(item.href))?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {navigationItems.find(item => isActive(item.href))?.description || 'Manage your store'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>

              {/* Visit Store */}
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
              >
                Visit Store
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
