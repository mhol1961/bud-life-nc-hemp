'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from 'js-cookie';

const ageVerificationSchema = z.object({
  birthDate: z.string().min(1, 'Please enter your birth date').refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 21;
    }
    return age >= 21;
  }, 'You must be 21 or older to access this website')
});

type AgeVerificationForm = z.infer<typeof ageVerificationSchema>;

interface AgeGateProps {
  onVerified?: () => void;
}

const AgeGate = ({ onVerified }: AgeGateProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AgeVerificationForm>({
    resolver: zodResolver(ageVerificationSchema)
  });

  useEffect(() => {
    // Check if user has already verified their age
    const isVerified = Cookies.get('age_verified') === 'true' || localStorage.getItem('age_verified') === 'true';
    if (!isVerified) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const onSubmit = (data: AgeVerificationForm) => {
    setIsLoading(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      // Store verification in both cookie (7 days) and localStorage (backup)
      Cookies.set('age_verified', 'true', { expires: 7 });
      localStorage.setItem('age_verified', 'true');
      
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      setIsLoading(false);
      
      // Call optional callback
      if (onVerified) {
        onVerified();
      }
    }, 800);
  };

  const handleDeny = () => {
    // Redirect to a non-age-restricted page or show access denied message
    window.location.href = 'https://google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-50 to-neutral-50 px-8 py-6 text-center border-b border-stone-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-stone-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Age Verification Required</h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            You must be 21 years of age or older to access this website. Please verify your age to continue.
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-semibold text-stone-700 mb-3">
                Date of Birth
              </label>
              <input
                type="date"
                id="birthDate"
                {...register('birthDate')}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all duration-200 text-stone-800 bg-stone-50"
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthDate && (
                <p className="mt-2 text-red-600 text-sm font-medium">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-800 text-white py-3 px-6 rounded-xl font-semibold hover:bg-stone-900 focus:ring-4 focus:ring-stone-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'I am 21 or older - Enter Site'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleDeny}
                className="w-full bg-transparent text-stone-600 py-3 px-6 rounded-xl font-medium hover:bg-stone-50 focus:ring-4 focus:ring-stone-200 transition-all duration-200 border border-stone-300"
              >
                I am under 21 - Exit
              </button>
            </div>
          </form>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-stone-50 px-8 py-4 border-t border-stone-200">
          <p className="text-xs text-stone-500 text-center leading-relaxed">
            By continuing, you confirm that you are of legal age in your jurisdiction and agree to our 
            <span className="font-semibold"> Terms of Service </span>
            and 
            <span className="font-semibold"> Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;