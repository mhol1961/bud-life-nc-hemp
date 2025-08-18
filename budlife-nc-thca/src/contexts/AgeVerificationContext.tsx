import React, { createContext, useContext, useEffect, useState } from 'react'
import type { UserLocation, AgeVerificationData } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface AgeVerificationContextType {
  isVerified: boolean
  userLocation: UserLocation | null
  isRestricted: boolean
  restrictionReason: string | null
  loading: boolean
  verifyAge: (birthdate: Date, method: string) => Promise<boolean>
  checkLocation: () => Promise<void>
  sessionId: string
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined)

// Generate a unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Check if user is 21 or older
const calculateAge = (birthdate: Date): number => {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// List of restricted states (based on the database data)
const FULLY_RESTRICTED_STATES = ['ID', 'IA', 'KS', 'MS', 'NE', 'SD']
const PARTIALLY_RESTRICTED_STATES = [
  'AL', 'AK', 'AR', 'DE', 'GA', 'HI', 'IN', 'KY', 'LA', 'MT', 
  'NH', 'NC', 'ND', 'OK', 'SC', 'TN', 'TX', 'UT', 'WI', 'WY'
]

export function AgeVerificationProvider({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isRestricted, setIsRestricted] = useState(false)
  const [restrictionReason, setRestrictionReason] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionId] = useState(() => generateSessionId())

  useEffect(() => {
    const initializeVerification = async () => {
      // Check for existing verification in sessionStorage
      const existingVerification = sessionStorage.getItem('budlife_age_verified')
      if (existingVerification) {
        const verificationData: AgeVerificationData = JSON.parse(existingVerification)
        setIsVerified(verificationData.verified)
      }

      // Check location
      await checkLocation()
      setLoading(false)
    }

    initializeVerification()
  }, [])

  const checkLocation = async (): Promise<void> => {
    try {
      // Use ipapi.co for location detection
      const response = await fetch('https://ipapi.co/json/')
      if (!response.ok) {
        throw new Error('Failed to get location')
      }
      
      const locationData = await response.json()
      
      const location: UserLocation = {
        country_code: locationData.country_code,
        state_code: locationData.region_code,
        region: locationData.region,
        city: locationData.city,
        ip: locationData.ip,
        postal: locationData.postal,
        timezone: locationData.timezone,
      }
      
      setUserLocation(location)

      // Check if state is restricted
      const stateCode = location.state_code
      if (stateCode && location.country_code === 'US') {
        if (FULLY_RESTRICTED_STATES.includes(stateCode)) {
          setIsRestricted(true)
          setRestrictionReason('THCA products are not available in your state.')
        } else if (PARTIALLY_RESTRICTED_STATES.includes(stateCode)) {
          setIsRestricted(true)
          setRestrictionReason('Limited THCA products available in your state. Some restrictions may apply.')
        }
      } else if (location.country_code !== 'US') {
        setIsRestricted(true)
        setRestrictionReason('THCA products are only available within the United States.')
      }

      // Log verification attempt
      await supabase.from('age_verification_sessions').insert({
        session_id: sessionId,
        ip_address: location.ip,
        user_agent: navigator.userAgent,
        country_code: location.country_code,
        state_code: location.state_code,
        verification_method: 'location_check',
        verification_status: isRestricted ? 'restricted' : 'pending',
        verification_data: location,
      })
    } catch (error) {
      console.error('Error checking location:', error)
      // Don't block the user if location check fails
    }
  }

  const verifyAge = async (birthdate: Date, method: string): Promise<boolean> => {
    try {
      const age = calculateAge(birthdate)
      const verified = age >= 21
      
      if (!verified) {
        toast.error('You must be 21 or older to access this website.')
        return false
      }

      const verificationData: AgeVerificationData = {
        verified: true,
        method,
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        ip_address: userLocation?.ip,
        user_agent: navigator.userAgent,
      }

      // Store verification in session storage
      sessionStorage.setItem('budlife_age_verified', JSON.stringify(verificationData))
      setIsVerified(true)

      // Update verification session in database
      await supabase
        .from('age_verification_sessions')
        .update({
          verification_method: method,
          verification_status: 'verified',
          verification_data: {
            birthdate: birthdate.toISOString(),
            age,
            ...verificationData,
          },
        })
        .eq('session_id', sessionId)

      toast.success('Age verification successful!')
      return true
    } catch (error) {
      console.error('Error verifying age:', error)
      toast.error('Age verification failed. Please try again.')
      return false
    }
  }

  const value = {
    isVerified,
    userLocation,
    isRestricted,
    restrictionReason,
    loading,
    verifyAge,
    checkLocation,
    sessionId,
  }

  return (
    <AgeVerificationContext.Provider value={value}>
      {children}
    </AgeVerificationContext.Provider>
  )
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext)
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider')
  }
  return context
}