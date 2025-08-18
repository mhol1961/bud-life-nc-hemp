import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { User, Package, Heart, Settings, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

export function AccountPage() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const menuItems = [
    { icon: User, label: 'Profile Information', href: '/account/profile', active: true },
    { icon: Package, label: 'Order History', href: '/account/orders' },
    { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
    { icon: Settings, label: 'Account Settings', href: '/account/settings' },
  ]

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-2">
              My Account
            </h1>
            <p className="text-stone-600">
              Manage your profile, orders, and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="card-premium p-6">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b border-stone-200">
                  <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-sage-600" />
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-1">
                    {user.user_metadata?.first_name || 'User'} {user.user_metadata?.last_name || ''}
                  </h3>
                  <p className="text-sm text-stone-500">{user.email}</p>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={item.label}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        item.active
                          ? 'bg-sage-50 text-sage-700 border border-sage-200'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                  
                  <button
                    onClick={signOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="card-premium p-8">
                <h2 className="text-2xl font-semibold text-stone-900 mb-6">
                  Profile Information
                </h2>
                
                {/* Profile Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.user_metadata?.first_name || ''}
                        className="input-premium w-full"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.user_metadata?.last_name || ''}
                        className="input-premium w-full"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email || ''}
                      className="input-premium w-full"
                      disabled
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      Contact support to change your email address
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="input-premium w-full"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      defaultValue={user.user_metadata?.date_of_birth || ''}
                      className="input-premium w-full"
                    />
                  </div>
                  
                  {/* Marketing Preferences */}
                  <div className="pt-6 border-t border-stone-200">
                    <h3 className="text-lg font-medium text-stone-900 mb-4">
                      Marketing Preferences
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={user.user_metadata?.accepts_marketing}
                          className="h-4 w-4 text-sage-600 border-stone-300 rounded focus:ring-sage-500"
                        />
                        <span className="ml-2 text-sm text-stone-700">
                          Email newsletters and product updates
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-sage-600 border-stone-300 rounded focus:ring-sage-500"
                        />
                        <span className="ml-2 text-sm text-stone-700">
                          SMS notifications for order updates
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <button className="btn-primary">
                      Save Changes
                    </button>
                    <button className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}