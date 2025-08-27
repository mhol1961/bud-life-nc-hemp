import { supabase, DashboardMetrics } from './supabase'

class AdminAPI {
  async getDashboardData(period: string = '7days'): Promise<DashboardMetrics> {
    try {
      // Mock dashboard data for now - in production this would fetch real data
      return {
        totalRevenue: 12500.00,
        totalOrders: 48,
        completedOrders: 42,
        newCustomers: 15,
        activeProducts: 28,
        lowStockProducts: 3,
        period
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }

  async getProducts(filters?: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_variants(*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async createProduct(productData: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async updateProduct(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}

export const adminAPI = new AdminAPI()