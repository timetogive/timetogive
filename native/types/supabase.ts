export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      tasks: {
        Row: {
          created_datetime: string
          description: string | null
          effort_days: number | null
          effort_hours: number | null
          effort_minutes: number | null
          effort_normalised_minutes: number | null
          effort_people: number | null
          fuzzy_geo_location: unknown
          geo_location: unknown
          has_images: boolean | null
          id: string
          images_data: Json
          lifespan_days: number
          pledge: string | null
          reason: Database["public"]["Enums"]["task_reason"]
          remote: boolean
          status: Database["public"]["Enums"]["task_status"]
          timing: string
          title: string
          user_id: string
          will_pledge: boolean
        }
        Insert: {
          created_datetime?: string
          description?: string | null
          effort_days?: number | null
          effort_hours?: number | null
          effort_minutes?: number | null
          effort_normalised_minutes?: number | null
          effort_people?: number | null
          fuzzy_geo_location: unknown
          geo_location: unknown
          has_images?: boolean | null
          id?: string
          images_data?: Json
          lifespan_days?: number
          pledge?: string | null
          reason?: Database["public"]["Enums"]["task_reason"]
          remote?: boolean
          status?: Database["public"]["Enums"]["task_status"]
          timing?: string
          title: string
          user_id: string
          will_pledge?: boolean
        }
        Update: {
          created_datetime?: string
          description?: string | null
          effort_days?: number | null
          effort_hours?: number | null
          effort_minutes?: number | null
          effort_normalised_minutes?: number | null
          effort_people?: number | null
          fuzzy_geo_location?: unknown
          geo_location?: unknown
          has_images?: boolean | null
          id?: string
          images_data?: Json
          lifespan_days?: number
          pledge?: string | null
          reason?: Database["public"]["Enums"]["task_reason"]
          remote?: boolean
          status?: Database["public"]["Enums"]["task_status"]
          timing?: string
          title?: string
          user_id?: string
          will_pledge?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_task: {
        Args: {
          reason: Database["public"]["Enums"]["task_reason"]
          will_pledge: boolean
          title: string
          description: string
          effort_days: number
          effort_hours: number
          effort_minutes: number
          effort_people: number
          timing: string
          remote: boolean
          longitude: number
          latitude: number
          lifespan_days: number
          pledge?: string
        }
        Returns: string
      }
      search_tasks: {
        Args: {
          p_longitude: number
          p_latitude: number
          p_distance: number
        }
        Returns: {
          id: string
          title: string
          description: string
          reason: Database["public"]["Enums"]["task_reason"]
          longitude: number
          latitude: number
          created_datetime: string
          distance: number
        }[]
      }
    }
    Enums: {
      task_reason:
        | "Charity"
        | "Community"
        | "In Need"
        | "Mutual Benefit"
        | "Return For Pledge"
      task_status: "Live" | "Closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
