import { supabase } from '@/lib/supabase'

// Types for Marketing Campaign API
export interface Campaign {
  id: string
  campaign_name: string
  campaign_description?: string
  campaign_type: string
  campaign_category?: string
  status: string
  priority: string
  target_audience_id?: string
  audience_size: number
  targeting_criteria?: any
  start_date?: string
  end_date?: string
  timezone: string
  budget: number
  spent_amount: number
  goal_type?: string
  goal_target?: number
  goal_current: number
  total_recipients: number
  total_sent: number
  total_delivered: number
  total_opens: number
  total_clicks: number
  total_conversions: number
  total_revenue: number
  delivery_rate: number
  open_rate: number
  click_rate: number
  conversion_rate: number
  attribution_window: number
  utm_campaign?: string
  utm_medium?: string
  utm_source?: string
  created_by: string
  assigned_to?: string
  team_id?: string
  created_at: string
  updated_at: string
  tags?: string[]
  custom_fields?: any
}

export interface CreateCampaignData {
  campaign_name: string
  campaign_description?: string
  campaign_type: string
  campaign_category?: string
  priority?: string
  audience_size?: number
  start_date?: string
  end_date?: string
  budget?: number
  goal_type?: string
  goal_target?: number
  tags?: string[]
}

export interface SocialPost {
  id: string
  content: string
  media_type: string
  media_url?: string
  platform: string
  status: string
  scheduled_for?: string
  published_at?: string
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  hashtags?: string[]
  created_at: string
  updated_at: string
}

export interface ContactProfile {
  id: string
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  full_name?: string
  age?: number
  gender?: string
  location_city?: string
  location_state?: string
  location_country?: string
  engagement_score: number
  lead_score: number
  lifecycle_stage: string
  email_subscribed: boolean
  sms_subscribed: boolean
  total_orders: number
  total_spent: number
  ghl_contact_id?: string
  mailchimp_contact_id?: string
  instantly_contact_id?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

// Marketing Campaign API
export const marketingAPI = {
  // Get all campaigns
  async getCampaigns(): Promise<Campaign[]> {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      throw error
    }
  },

  // Create new campaign
  async createCampaign(campaignData: CreateCampaignData): Promise<Campaign> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const newCampaign = {
        ...campaignData,
        created_by: user.id,
        status: 'draft',
        audience_size: campaignData.audience_size || 0,
        budget: campaignData.budget || 0,
        spent_amount: 0,
        goal_current: 0,
        total_recipients: 0,
        total_sent: 0,
        total_delivered: 0,
        total_opens: 0,
        total_clicks: 0,
        total_conversions: 0,
        total_revenue: 0,
        delivery_rate: 0,
        open_rate: 0,
        click_rate: 0,
        conversion_rate: 0,
        attribution_window: 7,
        timezone: 'UTC'
      }

      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert([newCampaign])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating campaign:', error)
      throw error
    }
  },

  // Update campaign
  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating campaign:', error)
      throw error
    }
  },

  // Delete campaign
  async deleteCampaign(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting campaign:', error)
      throw error
    }
  },

  // Clone campaign
  async cloneCampaign(id: string): Promise<Campaign> {
    try {
      const { data: original, error: fetchError } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const clonedData = {
        ...original,
        id: undefined,
        campaign_name: `${original.campaign_name} (Copy)`,
        status: 'draft',
        created_by: user.id,
        created_at: undefined,
        updated_at: undefined,
        // Reset performance metrics
        total_sent: 0,
        total_opens: 0,
        total_clicks: 0,
        total_conversions: 0,
        total_revenue: 0,
        spent_amount: 0
      }

      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert([clonedData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error cloning campaign:', error)
      throw error
    }
  }
}

// Social Media API
export const socialAPI = {
  // Get social posts
  async getSocialPosts(): Promise<SocialPost[]> {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching social posts:', error)
      return []
    }
  },

  // Create social post
  async createSocialPost(postData: Omit<SocialPost, 'id' | 'created_at' | 'updated_at'>): Promise<SocialPost> {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .insert([postData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating social post:', error)
      throw error
    }
  },

  // Update social post
  async updateSocialPost(id: string, updates: Partial<SocialPost>): Promise<SocialPost> {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating social post:', error)
      throw error
    }
  },

  // Delete social post
  async deleteSocialPost(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting social post:', error)
      throw error
    }
  }
}

// Analytics API
export const analyticsAPI = {
  // Get campaign analytics
  async getCampaignAnalytics(timeRange: string = '7d') {
    try {
      const { data, error } = await supabase
        .from('campaign_analytics')
        .select('*')
        .order('date_recorded', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return []
    }
  },

  // Get platform performance
  async getPlatformPerformance() {
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .select('*')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching platform performance:', error)
      return []
    }
  }
}

// Contact Management API
export const contactAPI = {
  // Get contacts
  async getContacts(): Promise<ContactProfile[]> {
    try {
      const { data, error } = await supabase
        .from('contact_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching contacts:', error)
      return []
    }
  },

  // Create contact
  async createContact(contactData: Omit<ContactProfile, 'id' | 'created_at' | 'updated_at'>): Promise<ContactProfile> {
    try {
      const { data, error } = await supabase
        .from('contact_profiles')
        .insert([contactData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating contact:', error)
      throw error
    }
  },

  // Update contact
  async updateContact(id: string, updates: Partial<ContactProfile>): Promise<ContactProfile> {
    try {
      const { data, error } = await supabase
        .from('contact_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating contact:', error)
      throw error
    }
  }
}

// Edge Function API calls
export const edgeFunctionAPI = {
  // Call GHL campaigns function
  async callGHLCampaigns(data: any) {
    try {
      const { data: result, error } = await supabase.functions.invoke('ghl-campaigns', {
        body: data
      })

      if (error) throw error
      return result
    } catch (error) {
      console.error('Error calling GHL campaigns function:', error)
      throw error
    }
  },

  // Call email campaigns function
  async callEmailCampaigns(data: any) {
    try {
      const { data: result, error } = await supabase.functions.invoke('email-campaigns', {
        body: data
      })

      if (error) throw error
      return result
    } catch (error) {
      console.error('Error calling email campaigns function:', error)
      throw error
    }
  },

  // Call analytics function
  async callAnalytics(data: any) {
    try {
      const { data: result, error } = await supabase.functions.invoke('campaign-analytics', {
        body: data
      })

      if (error) throw error
      return result
    } catch (error) {
      console.error('Error calling analytics function:', error)
      throw error
    }
  },

  // Call automation workflows function
  async callAutomationWorkflows(data: any) {
    try {
      const { data: result, error } = await supabase.functions.invoke('automation-workflows', {
        body: data
      })

      if (error) throw error
      return result
    } catch (error) {
      console.error('Error calling automation workflows function:', error)
      throw error
    }
  },

  // Call social media manager function
  async callSocialMediaManager(data: any) {
    try {
      const { data: result, error } = await supabase.functions.invoke('social-media-manager', {
        body: data
      })

      if (error) throw error
      return result
    } catch (error) {
      console.error('Error calling social media manager function:', error)
      throw error
    }
  }
}

export default {
  marketingAPI,
  socialAPI,
  analyticsAPI,
  contactAPI,
  edgeFunctionAPI
}