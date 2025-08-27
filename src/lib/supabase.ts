import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ooaolhxjtaljsqwfnyov.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYW9saHhqdGFsanNxd2ZueW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxOTU5MTgsImV4cCI6MjA3MDc3MTkxOH0.uRc1Dnhune9h5KknKZkNQZ1ojVIjzgVuLS3oUEvHxB0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  category: string
  thc_content?: number
  cbd_content?: number
  variants?: ProductVariant[]
  is_featured?: boolean
  lab_tested?: boolean
  organic?: boolean
  visibility_status?: string
  publish_status?: string
  archived?: boolean
  created_at?: string
  updated_at?: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  price: number
  weight: number
  weight_unit: string
  inventory: number
  sku?: string
  created_at?: string
  updated_at?: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  is_primary?: boolean
  sort_order?: number
  created_at?: string
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  completedOrders: number
  newCustomers: number
  activeProducts: number
  lowStockProducts: number
  period: string
}

export interface Customer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: string
  user_id?: string
  status: string
  total_amount: number
  currency: string
  customer_email?: string
  shipping_address?: any
  billing_address?: any
  created_at?: string
  updated_at?: string
}