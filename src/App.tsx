import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/AdminLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { CoasPage } from '@/pages/CoasPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ContentManagementPage } from '@/pages/ContentManagementPage'
import { MediaLibraryPage } from '@/pages/MediaLibraryPage'
import { MarketingHubPage } from '@/pages/MarketingHubPage'
import { SocialHubPage } from '@/pages/SocialHubPage'
import { AnalyticsDashboardPage } from '@/pages/AnalyticsDashboardPage'
import { StorefrontPage } from '@/pages/StorefrontPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { AgeVerificationModal } from '@/components/AgeVerificationModal'
import { CartProvider } from '@/context/CartContext'
import './App.css'

function App() {
  const [ageVerified, setAgeVerified] = React.useState<boolean>(false)
  const [showAgeVerification, setShowAgeVerification] = React.useState<boolean>(false)
  const [ageVerificationSession, setAgeVerificationSession] = React.useState<string | null>(null)

  useEffect(() => {
    // Check if user has already been age verified in this session
    const verified = sessionStorage.getItem('ageVerified') === 'true'
    const session = sessionStorage.getItem('ageVerificationSession')
    
    if (verified && session) {
      setAgeVerified(true)
      setAgeVerificationSession(session)
      setShowAgeVerification(false)
    } else {
      // Show age verification popup for all new visitors
      setShowAgeVerification(true)
      setAgeVerified(false)
    }
  }, [])

  const handleAgeVerified = (sessionId: string) => {
    setAgeVerified(true)
    setAgeVerificationSession(sessionId)
    setShowAgeVerification(false)
    
    // Store verification in session storage
    sessionStorage.setItem('ageVerified', 'true')
    sessionStorage.setItem('ageVerificationSession', sessionId)
  }

  const handleCloseAgeVerification = () => {
    // Only allow closing if user is verified or explicitly refuses
    if (ageVerified) {
      setShowAgeVerification(false)
    } else {
      // Redirect away from the site if they close without verifying
      window.location.href = 'https://google.com'
    }
  }

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public storefront routes */}
          <Route path="/store" element={<StorefrontPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Admin routes - wrapped in AdminLayout */}
          <Route path="/*" element={
            <AdminLayout>
              <Routes>
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Main admin routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/coas" element={<CoasPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                
                {/* CMS Features */}
                <Route path="/content" element={<ContentManagementPage />} />
                <Route path="/media" element={<MediaLibraryPage />} />
                
                {/* Marketing Suite */}
                <Route path="/marketing" element={<MarketingHubPage />} />
                <Route path="/social" element={<SocialHubPage />} />
                <Route path="/analytics" element={<AnalyticsDashboardPage />} />
                
                {/* 404 fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          } />
        </Routes>

        {/* Age Verification Modal */}
        {showAgeVerification && !ageVerified && (
          <AgeVerificationModal
            isOpen={showAgeVerification}
            onClose={handleCloseAgeVerification}
            onVerified={handleAgeVerified}
          />
        )}
      </Router>
    </CartProvider>
  )
}

export default App