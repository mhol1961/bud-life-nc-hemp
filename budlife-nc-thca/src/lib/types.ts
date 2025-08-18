// Additional type definitions for the application

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  category: string
  price: number
  compare_at_price?: number
  cost_price?: number
  sku?: string
  weight_grams?: number
  thc_content?: number
  cbd_content?: number
  strain_type?: string
  lab_results_url?: string
  ingredients?: string[]
  effects?: string[]
  image_url?: string
  gallery_images?: string[]
  inventory_quantity?: number
  max_quantity_per_order?: number
  featured: boolean
  status: 'active' | 'inactive' | 'out_of_stock'
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: string
  product_name: string
  product_slug: string
  product_image_url?: string
  price: number
  compare_at_price?: number
  quantity: number
  category?: string
  thc_content?: number
  cbd_content?: number
  strain_type?: string
  max_quantity?: number
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
}

export interface UserLocation {
  country_code?: string
  state_code?: string
  region?: string
  city?: string
  ip?: string
  postal?: string
  timezone?: string
}

export interface AgeVerificationData {
  verified: boolean
  method?: string
  timestamp?: string
  session_id?: string
  ip_address?: string
  user_agent?: string
}

export interface FilterOptions {
  category?: string
  strain_type?: string
  price_min?: number
  price_max?: number
  thc_min?: number
  thc_max?: number
  cbd_min?: number
  cbd_max?: number
  sort_by?: 'name' | 'price' | 'created_at' | 'featured'
  sort_order?: 'asc' | 'desc'
  search?: string
  featured_only?: boolean
  in_stock_only?: boolean
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface NewsletterSubscription {
  id: string
  email: string
  first_name?: string
  source?: string
  subscribed_at: string
  unsubscribed_at?: string
  status: string
  preferences: any
}

export interface AdminUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: string
  permissions: string[]
  active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface AdminActivityLog {
  id: string
  admin_id: string
  action: string
  resource_type?: string
  resource_id?: string
  changes?: any
  ip_address?: string
  user_agent?: string
  created_at: string
}