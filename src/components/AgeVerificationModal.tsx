import React, { useState } from 'react'
import { X, Calendar, MapPin, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'

interface AgeVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: (sessionId: string) => void
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
]

export function AgeVerificationModal({ isOpen, onClose, onVerified }: AgeVerificationModalProps) {
  const [birthDate, setBirthDate] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'welcome' | 'verification' | 'error'>('welcome')

  if (!isOpen) return null

  const handleVerification = async () => {
    if (!birthDate || !stateCode) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError('')

      const { data, error: functionError } = await supabase.functions.invoke('age-verification', {
        body: {
          birthDate,
          stateCode,
          sessionId: crypto.randomUUID()
        }
      })

      if (functionError) {
        throw functionError
      }

      if (data?.data?.verified) {
        // Store verification in sessionStorage
        sessionStorage.setItem('ageVerified', 'true')
        sessionStorage.setItem('ageVerificationSession', data.data.sessionId)
        onVerified(data.data.sessionId)
        onClose()
      } else {
        setStep('error')
        setError(data?.data?.message || 'Age verification failed')
      }
    } catch (err: any) {
      console.error('Age verification error:', err)
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (step === 'error') {
      // Redirect away from site
      window.location.href = 'https://www.google.com'
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
          {step !== 'error' && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-white hover:bg-white/20"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex justify-center mb-4">
            {step === 'error' ? (
              <AlertTriangle className="h-12 w-12 text-orange-300" />
            ) : (
              <Shield className="h-12 w-12 text-blue-200" />
            )}
          </div>
          
          <CardTitle className="text-xl font-bold">
            {step === 'welcome' ? 'Age Verification Required' : 
             step === 'verification' ? 'Verify Your Age' : 
             'Access Restricted'}
          </CardTitle>
          
          <p className="text-blue-100 text-sm mt-2">
            {step === 'welcome' ? 'You must be 21 or older to access this site' :
             step === 'verification' ? 'Please provide your information' :
             'You must be 21+ to access this content'}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {step === 'welcome' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This website contains information about hemp and THCA products. 
                  By federal and state law, you must be at least 21 years old to view this content.
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Your Privacy:</strong> We use this information only for age verification 
                  and do not store personal details.
                </div>
              </div>
              
              <Button 
                onClick={() => setStep('verification')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              >
                Continue to Verification
              </Button>
            </div>
          )}

          {step === 'verification' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  State/Territory
                </label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select your state</option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('welcome')}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerification}
                  disabled={loading || !birthDate || !stateCode}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800"
                >
                  {loading ? 'Verifying...' : 'Verify Age'}
                </Button>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Access Denied:</strong>
                </p>
                <p className="text-sm text-orange-700">{error}</p>
              </div>
              
              <p className="text-sm text-gray-600">
                You must be 21 years or older to access this website.
              </p>
              
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              >
                Leave Site
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}