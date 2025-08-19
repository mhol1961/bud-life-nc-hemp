import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Search, Heart, Shield, BookOpen, HelpCircle } from 'lucide-react'
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
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'FAQs', href: '/faqs', icon: HelpCircle },
    { name: 'Lab Results', href: '/lab-results', icon: Shield },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleAuthAction = () => {
    if (user) {
      signOut()
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-forest-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/images/new-budlife-logo.png" 
              alt="Bud Life NC Hemp Co" 
              className="h-18 w-18 filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href.includes('?') && location.pathname === item.href.split('?')[0] && location.search.includes(item.href.split('?')[1]))
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative group flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : 'text-cream-200 hover:text-emerald-300 hover:bg-cream/5'
                  } ${item.featured ? 'border border-emerald-500/30 hover:border-emerald-400/50' : ''}`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                  {item.featured && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop only */}
            <button className="hidden lg:flex p-2 text-cream-300 hover:text-emerald-300 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button className="hidden sm:flex p-2 text-cream-300 hover:text-emerald-300 transition-colors relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
            </button>

            {/* Cart */}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-cream-300 hover:text-emerald-300 transition-colors group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-cream-300 hover:text-emerald-300 transition-colors"
              >
                <User className="w-5 h-5" />
                {user && <span className="hidden sm:block text-sm">{user.email?.split('@')[0]}</span>}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-black-800 border border-forest-600 rounded-xl shadow-dark-lg overflow-hidden"
                  >
                    {user ? (
                      <>
                        <Link
                          to="/account"
                          className="block px-4 py-3 text-cream-200 hover:bg-forest-700 hover:text-emerald-300 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-3 text-cream-200 hover:bg-forest-700 hover:text-emerald-300 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Order History
                        </Link>
                        <div className="border-t border-forest-600">
                          <button
                            onClick={() => {
                              handleAuthAction()
                              setIsUserMenuOpen(false)
                            }}
                            className="block w-full text-left px-4 py-3 text-cream-200 hover:bg-forest-700 hover:text-emerald-300 transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-3 text-cream-200 hover:bg-forest-700 hover:text-emerald-300 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-3 text-cream-200 hover:bg-forest-700 hover:text-emerald-300 transition-colors"
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-cream-300 hover:text-emerald-300 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black-800 border-t border-forest-700"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/30'
                        : 'text-cream-200 hover:text-emerald-300 hover:bg-cream/5'
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                    {item.featured && (
                      <span className="ml-auto text-xs bg-emerald-500 text-white px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    )}
                  </Link>
                )
              })}
              
              <div className="border-t border-forest-600 pt-4 space-y-2">
                <Link
                  to="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-cream-200 hover:text-emerald-300 hover:bg-cream/5 rounded-xl transition-colors"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-cream-200 hover:text-emerald-300 hover:bg-cream/5 rounded-xl transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}