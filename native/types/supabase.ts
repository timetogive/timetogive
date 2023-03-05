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
          description: string | null
          full_name: string | null
          id: string
          public_link1: string | null
          public_link2: string | null
          public_link3: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          description?: string | null
          full_name?: string | null
          id: string
          public_link1?: string | null
          public_link2?: string | null
          public_link3?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          description?: string | null
          full_name?: string | null
          id?: string
          public_link1?: string | null
          public_link2?: string | null
          public_link3?: string | null
          updated_at?: string | null
        }
      }
      task_messages: {
        Row: {
          created_datetime: string
          from_user_id: string
          id: string
          is_read: boolean
          message_text: string
          task_id: string
          to_user_id: string
        }
        Insert: {
          created_datetime?: string
          from_user_id: string
          id?: string
          is_read?: boolean
          message_text: string
          task_id: string
          to_user_id: string
        }
        Update: {
          created_datetime?: string
          from_user_id?: string
          id?: string
          is_read?: boolean
          message_text?: string
          task_id?: string
          to_user_id?: string
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
      create_task_message: {
        Args: {
          task_id: string
          to_user_id: string
          message_text: string
        }
        Returns: string
      }
      get_task: {
        Args: {
          p_id: string
          p_longitude?: number
          p_latitude?: number
        }
        Returns: Database["public"]["CompositeTypes"]["task_full_info"]
      }
      get_task_conversations: {
        Args: {
          p_id: string
        }
        Returns: {
          from_user_id: string
          from_avatar_url: string
          from_full_name: string
          to_user_id: string
          to_avatar_url: string
          to_full_name: string
          total_count: number
          unread_count: number
        }[]
      }
      search_tasks: {
        Args: {
          p_longitude: number
          p_latitude: number
          p_distance: number
        }
        Returns: {
          id: string
          user_id: string
          avatar_url: string
          title: string
          description: string
          reason: Database["public"]["Enums"]["task_reason"]
          timing: string
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
      task_full_info: {
        id: string
        user_id: string
        status: Database["public"]["Enums"]["task_status"]
        reason: Database["public"]["Enums"]["task_reason"]
        will_pledge: boolean
        pledge: string
        title: string
        description: string
        effort_days: number
        effort_hours: number
        effort_minutes: number
        effort_normalised_minutes: number
        effort_people: number
        timing: string
        remote: boolean
        longitude: number
        latitude: number
        created_datetime: string
        distance: number
        user_full_name: string
        user_avatar_url: string
      }
    }
  }
}
