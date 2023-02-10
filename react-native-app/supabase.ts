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
          effort_estimate: number | null
          effort_estimate_in_minutes: number | null
          effort_estimate_units:
            | Database["public"]["Enums"]["task_estimate_units"]
            | null
          fuzzy_geo_location: unknown
          geo_location: unknown
          has_images: boolean | null
          id: string
          images_data: Json
          people_estimate: number | null
          remote: boolean
          timing: Database["public"]["Enums"]["task_timing"]
          title: string
          user_id: string
        }
        Insert: {
          created_datetime?: string
          description?: string | null
          effort_estimate?: number | null
          effort_estimate_in_minutes?: number | null
          effort_estimate_units?:
            | Database["public"]["Enums"]["task_estimate_units"]
            | null
          fuzzy_geo_location: unknown
          geo_location: unknown
          has_images?: boolean | null
          id?: string
          images_data?: Json
          people_estimate?: number | null
          remote?: boolean
          timing?: Database["public"]["Enums"]["task_timing"]
          title: string
          user_id: string
        }
        Update: {
          created_datetime?: string
          description?: string | null
          effort_estimate?: number | null
          effort_estimate_in_minutes?: number | null
          effort_estimate_units?:
            | Database["public"]["Enums"]["task_estimate_units"]
            | null
          fuzzy_geo_location?: unknown
          geo_location?: unknown
          has_images?: boolean | null
          id?: string
          images_data?: Json
          people_estimate?: number | null
          remote?: boolean
          timing?: Database["public"]["Enums"]["task_timing"]
          title?: string
          user_id?: string
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
      task_estimate_units: "Minutes" | "Hours" | "Days"
      task_status: "Live" | "Closed"
      task_timing: "Any Time" | "Specific Time"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
