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
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
          onboarding_completed: boolean
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
        }
      }
      communities: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          avatar_url: string | null
          cover_url: string | null
          custom_domain: string | null
          settings: Json
          stripe_account_id: string | null
          stripe_product_id: string | null
          created_at: string
          updated_at: string
          is_published: boolean
          member_count: number
          revenue_total: number
          mrr: number
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          description?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          custom_domain?: string | null
          settings?: Json
          stripe_account_id?: string | null
          stripe_product_id?: string | null
          created_at?: string
          updated_at?: string
          is_published?: boolean
          member_count?: number
          revenue_total?: number
          mrr?: number
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          description?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          custom_domain?: string | null
          settings?: Json
          stripe_account_id?: string | null
          stripe_product_id?: string | null
          created_at?: string
          updated_at?: string
          is_published?: boolean
          member_count?: number
          revenue_total?: number
          mrr?: number
        }
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          community_id: string
          role: 'owner' | 'admin' | 'moderator' | 'member'
          status: 'active' | 'paused' | 'cancelled'
          stripe_subscription_id: string | null
          joined_at: string
          expires_at: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          revenue_generated: number
          last_active: string | null
        }
        Insert: {
          id?: string
          user_id: string
          community_id: string
          role?: 'owner' | 'admin' | 'moderator' | 'member'
          status?: 'active' | 'paused' | 'cancelled'
          stripe_subscription_id?: string | null
          joined_at?: string
          expires_at?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          revenue_generated?: number
          last_active?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          community_id?: string
          role?: 'owner' | 'admin' | 'moderator' | 'member'
          status?: 'active' | 'paused' | 'cancelled'
          stripe_subscription_id?: string | null
          joined_at?: string
          expires_at?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          revenue_generated?: number
          last_active?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          community_id: string
          author_id: string
          title: string | null
          content: string
          category: string | null
          pinned: boolean
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
          utm_tracking: Json | null
        }
        Insert: {
          id?: string
          community_id: string
          author_id: string
          title?: string | null
          content: string
          category?: string | null
          pinned?: boolean
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
          utm_tracking?: Json | null
        }
        Update: {
          id?: string
          community_id?: string
          author_id?: string
          title?: string | null
          content?: string
          category?: string | null
          pinned?: boolean
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
          utm_tracking?: Json | null
        }
      }
      revenue_attribution: {
        Row: {
          id: string
          community_id: string
          user_id: string
          source: string
          medium: string | null
          campaign: string | null
          revenue: number
          conversion_path: Json
          created_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          source: string
          medium?: string | null
          campaign?: string | null
          revenue: number
          conversion_path?: Json
          created_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          source?: string
          medium?: string | null
          campaign?: string | null
          revenue?: number
          conversion_path?: Json
          created_at?: string
        }
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
  }
}