import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { AgeVerificationProvider, useAgeVerification } from '@/contexts/AgeVerificationContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartSidebar } from '@/components/CartSidebar'
import AgeGate from '@/components/AgeGate'
import { HomePage } from '@/pages/HomePage'
import { ProductsPage } from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { AccountPage } from '@/pages/AccountPage'
import { AboutPage } from '@/pages/AboutPage'
import { LabResultsPage } from '@/pages/LabResultsPage'
import { AdminLayout } from '@/components/AdminLayout'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { ProductsManagement } from '@/pages/admin/ProductsManagement'
import { ContactPage } from '@/pages/ContactPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppContent() {
  const { isVerified, loading } = useAgeVerification()

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

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/lab-results" element={<LabResultsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Orders Management</h2><p className="text-gray-600">Coming soon - Full order management system</p></div>} />
            <Route path="lab-results" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Lab Results Management</h2><p className="text-gray-600">Coming soon - COA upload and management</p></div>} />
            <Route path="content" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Content Management</h2><p className="text-gray-600">Coming soon - Blog and page management</p></div>} />
            <Route path="media" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Media Management</h2><p className="text-gray-600">Coming soon - Image and video management</p></div>} />
            <Route path="customers" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Management</h2><p className="text-gray-600">Coming soon - Customer profiles and communication</p></div>} />
            <Route path="analytics" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2><p className="text-gray-600">Coming soon - Sales analytics and reporting</p></div>} />
            <Route path="marketing" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Marketing Center</h2><p className="text-gray-600">Coming soon - Campaign management and promotions</p></div>} />
            <Route path="social" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Social Media Management</h2><p className="text-gray-600">Coming soon - Social platform integration</p></div>} />
            <Route path="settings" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2><p className="text-gray-600">Coming soon - System configuration</p></div>} />
          </Route>
          {/* Add more routes as needed */}
        </Routes>
      </main>
      <Footer />
      <CartSidebar />
      
      {/* Age Verification Gate */}
      <AgeGate />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#f9f9f8',
            color: '#1c1917',
            border: '1px solid #e7e5e4',
          },
          success: {
            iconTheme: {
              primary: '#638c63',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AgeVerificationProvider>
            <div className="App">
              <AppContent />
            </div>
          </AgeVerificationProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App