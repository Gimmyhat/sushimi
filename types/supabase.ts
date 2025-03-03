export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total: number
          address: string
          phone: string
          payment_method: string
          delivery_time: string | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          total: number
          address: string
          phone: string
          payment_method: string
          delivery_time?: string | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total?: number
          address?: string
          phone?: string
          payment_method?: string
          delivery_time?: string | null
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          weight: string | null
          is_available: boolean
          category_id: string | null
          image_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          price: number
          weight?: string | null
          is_available?: boolean
          category_id?: string | null
          image_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          weight?: string | null
          is_available?: boolean
          category_id?: string | null
          image_url?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      promotions: {
        Row: {
          id: string
          title: string
          description: string | null
          promo_code: string | null
          discount_percent: number | null
          start_date: string | null
          end_date: string | null
          is_active: boolean
          image_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          promo_code?: string | null
          discount_percent?: number | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          image_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          promo_code?: string | null
          discount_percent?: number | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          image_url?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          name: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          name?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          name?: string | null
          address?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}