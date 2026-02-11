export interface User {
  id: number
  email: string
  password_hash: string
  role: 'owner' | 'editor'
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

export interface Category {
  id: number
  name: string
  description?: string
  parent_id?: number | null
  order_index: number
  created_at: Date
  updated_at: Date
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  image_url?: string
  category_id: number
  item_order_index: number
  created_at: Date
  updated_at: Date
}

export interface StoreSettings {
  id: number
  site_title: string
  banner_url?: string
  top_description?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  created_at: Date
  updated_at: Date
}

export interface AuthPayload {
  id: number
  email: string
  role: 'owner' | 'editor'
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
