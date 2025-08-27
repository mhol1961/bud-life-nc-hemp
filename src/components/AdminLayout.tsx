import React, { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Image,
  Megaphone,
  Share2,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User,
  LogOut,
  FlaskConical,
  ChevronDown,
  Store,
  ShoppingBag
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CartDrawer } from '@/components/CartDrawer'
import { CheckoutModal } from '@/components/checkout/CheckoutModal'
import { useCart } from '@/context/CartContext'

interface AdminLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-600 to-blue-700' },
  { name: 'Products', href: '/products', icon: Package, color: 'from-emerald-600 to-emerald-700' },
  { name: 'COAs', href: '/coas', icon: FlaskConical, color: 'from-purple-600 to-purple-700' },
  { name: 'Orders', href: '/orders', icon: ShoppingCart, color: 'from-orange-600 to-orange-700' },
  { name: 'Customers', href: '/customers', icon: Users, color: 'from-blue-500 to-blue-600' },
  { name: 'Content/Blog', href: '/content', icon: FileText, color: 'from-indigo-600 to-indigo-700' },
  { name: 'Media', href: '/media', icon: Image, color: 'from-teal-600 to-teal-700' },
  { name: 'Marketing', href: '/marketing', icon: Megaphone, color: 'from-amber-600 to-amber-700' },
  { name: 'Social Hub', href: '/social', icon: Share2, color: 'from-violet-600 to-violet-700' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-green-600 to-green-700' },
  { name: 'Settings', href: '/settings', icon: Settings, color: 'from-gray-600 to-gray-700' }
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()

  const handleCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-gray-50/10 pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar content */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white backdrop-blur-xl border-r border-gray-200 shadow-lg">
          <div className="flex h-16 shrink-0 items-center px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Bud Life Admin Module
            </h1>
          </div>
          <nav className="flex flex-1 flex-col px-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {/* E-commerce Section */}
              <li className="pt-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 pb-2">
                  E-commerce
                </div>
                <Link
                  to="/store"
                  target="_blank"
                  className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200 relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-sm hover:from-green-700 hover:to-emerald-800"
                >
                  <Store className="h-5 w-5 shrink-0 text-white" />
                  <span className="text-white">View Storefront</span>
                  <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30 text-xs">
                    New
                  </Badge>
                </Link>
              </li>
              
              {/* Admin Navigation */}
              <li>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 pb-2 pt-6">
                  Administration
                </div>
              </li>
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200 relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r text-white shadow-sm"
                          : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:shadow-sm",
                        `${item.color}`
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-white" : "text-gray-600 group-hover:text-white"
                      )} />
                      <span className={cn(
                        isActive ? "text-white" : "text-gray-700 group-hover:text-white"
                      )}>{item.name}</span>
                      {isActive && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-3" />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 bg-transparent sm:text-sm"
                placeholder="Search products, orders, customers..."
                type="search"
                name="search"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Shopping Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>

              {/* Profile dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="sr-only sm:not-sr-only">Admin User</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 transition-all">
                    <div className="p-1">
                      <button className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8 relative">
          {children}
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
      
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  )
}