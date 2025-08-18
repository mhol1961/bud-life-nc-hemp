import React, { useState } from 'react'
import { X, Calendar, ShieldCheck } from 'lucide-react'
import { useAgeVerification } from '@/contexts/AgeVerificationContext'
import { motion, AnimatePresence } from 'framer-motion'

interface AgeVerificationModalProps {
  isOpen: boolean
  onClose?: () => void
}

export function AgeVerificationModal({ isOpen, onClose }: AgeVerificationModalProps) {
  const { verifyAge, isRestricted, restrictionReason } = useAgeVerification()
  const [birthdate, setBirthdate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!birthdate) {
      return
    }

    setIsSubmitting(true)
    const birthdateObj = new Date(birthdate)
    const success = await verifyAge(birthdateObj, 'birthdate')
    
    if (success && onClose) {
      onClose()
    }
    
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="age-verification-overlay">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="age-verification-content"
        >
          {isRestricted ? (
            // Restricted State Content
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Access Restricted
              </h2>
              <p className="text-gray-600 mb-6">
                {restrictionReason}
              </p>
              <p className="text-sm text-gray-500">
                We apologize for any inconvenience. Please check your local laws and regulations.
              </p>
            </div>
          ) : (
            // Age Verification Content
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-sage-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-sage-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Age Verification Required
              </h2>
              <p className="text-gray-600 mb-6">
                You must be 21 or older to access this website. Please verify your age to continue.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="input-premium pl-10 w-full"
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!birthdate || isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="spinner mr-2" />
                      Verifying...
                    </span>
                  ) : (
                    'Verify Age'
                  )}
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  This website contains information about cannabis products intended for adults 21 and over.
                  By entering this site, you certify that you are of legal age and that it is legal to
                  purchase cannabis products in your jurisdiction.
                </p>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-gray-400">
                  <strong>Legal Disclaimer:</strong> These statements have not been evaluated by the FDA.
                  Hemp-derived products are not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}