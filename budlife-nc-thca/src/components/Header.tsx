import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Leaf, Search, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCartStore } from '@/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { itemCount, toggleCart } = useCartStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'Products', href: '/products', featured: true },
    { name: 'Flower', href: '/products?category=flower' },
    { name: 'Edibles', href: '/products?category=edibles' },
    { name: 'Concentrates', href: '/products?category=concentrates' },
    { name: 'Topicals', href: '/products?category=topicals' },
    { name: 'About', href: '/about' },
    { name: 'Lab Results', href: '/lab-results' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-stone-200/50">
      <nav className="container-premium">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sage-gradient rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900">BudLife NC</h1>
              <p className="text-xs text-stone-500 -mt-0.5">Premium THCA</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-sage-600 ${
                  location.pathname === item.href
                    ? 'text-sage-600 border-b-2 border-sage-600'
                    : 'text-stone-700'
                } ${item.featured ? 'font-semibold' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-stone-600 hover:text-sage-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist (if user is logged in) */}
            {user && (
              <Link 
                to="/wishlist"
                className="p-2 text-stone-600 hover:text-sage-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-stone-600 hover:text-sage-600 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sage-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-stone-600 hover:text-sage-600 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 card-premium py-2"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-sm text-stone-500 border-b border-stone-100">
                          {user.email}
                        </div>
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Order History
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-sage-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-stone-200/50 py-4"
            >
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-sage-600 ${
                      location.pathname === item.href
                        ? 'text-sage-600'
                        : 'text-stone-700'
                    } ${item.featured ? 'font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false)
    }

    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isUserMenuOpen])
}