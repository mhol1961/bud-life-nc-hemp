import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ooaolhxjtaljsqwfnyov.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYW9saHhqdGFsanNxd2ZueW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxOTU5MTgsImV4cCI6MjA3MDc3MTkxOH0.uRc1Dnhune9h5KknKZkNQZ1ojVIjzgVuLS3oUEvHxB0'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Using fallback values.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

// Type definitions for our database tables
export interface Product {
  id: string
  name: string
  slug: string
  sku?: string
  short_description?: string
  long_description?: string
  price: number
  compare_at_price?: number
  category?: string
  strain_type?: string
  cbd_content?: number
  thc_content?: number
  terpenes?: string[]
  coa_batch_number?: string
  coa_id?: string
  lab_tested: boolean
  test_date?: string
  track_quantity: boolean
  quantity: number
  low_stock_threshold: number
  allow_backorder: boolean
  weight?: number
  restricted_states?: string[]
  requires_age_verification: boolean
  featured: boolean
  is_new: boolean
  status: string
  tags?: string[]
  meta_title?: string
  meta_description?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  date_of_birth?: string
  age_verified: boolean
  age_verified_at?: string
  age_verification_method?: string
  age_verification_data?: any
  billing_address?: any
  shipping_address?: any
  default_state?: string
  square_customer_id?: string
  ghl_contact_id?: string
  total_spent: number
  order_count: number
  average_order_value: number
  last_order_date?: string
  favorite_products?: string[]
  accepts_marketing: boolean
  sms_consent: boolean
  email_capture_source?: string
  referral_source?: string
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface CartSession {
  id: string
  session_id: string
  customer_id?: string
  email?: string
  items: any[]
  abandoned: boolean
  abandoned_at?: string
  recovered: boolean
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id?: string
  email: string
  phone?: string
  items: any[]
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  discount_code?: string
  total: number
  payment_status: string
  payment_method?: string
  square_order_id?: string
  square_payment_id?: string
  square_checkout_id?: string
  paid_at?: string
  fulfillment_status: string
  pickup_date?: string
  pickup_time?: string
  fulfilled_at?: string
  billing_address?: any
  shipping_address?: any
  notes?: string
  internal_notes?: string
  tags?: string[]
  source: string
  ghl_synced: boolean
  ghl_synced_at?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface LabResult {
  id: string
  batch_number: string
  certificate_number?: string
  lab_name: string
  test_date: string
  expiration_date?: string
  thc_percentage?: number
  thca_percentage?: number
  cbd_percentage?: number
  cbda_percentage?: number
  cbg_percentage?: number
  cbn_percentage?: number
  cbc_percentage?: number
  total_cannabinoids?: number
  pesticides_pass: boolean
  heavy_metals_pass: boolean
  microbials_pass: boolean
  mycotoxins_pass: boolean
  residual_solvents_pass: boolean
  pdf_url: string
  qr_code_url?: string
  product_ids?: string[]
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface RestrictedState {
  state_code: string
  state_name: string
  restriction_type?: string
  restriction_notes?: string
  active: boolean
}

export interface ProductReview {
  id: string
  product_id: string
  customer_id?: string
  customer_name?: string
  customer_email?: string
  rating: number
  title?: string
  review_text?: string
  verified_purchase: boolean
  helpful_votes: number
  status: string
  created_at: string
  updated_at: string
}

export interface AgeVerificationSession {
  id: string
  session_id: string
  ip_address?: string
  user_agent?: string
  country_code?: string
  state_code?: string
  verification_method?: string
  verification_status: string
  verification_data?: any
  created_at: string
  expires_at: string
}