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
      task_offers: {
        Row: {
          created_datetime: string
          id: string
          processed_datetime: string | null
          status: Database["public"]["Enums"]["task_offer_status"]
          task_id: string
          task_owner_id: string
          user_id: string
        }
        Insert: {
          created_datetime?: string
          id?: string
          processed_datetime?: string | null
          status?: Database["public"]["Enums"]["task_offer_status"]
          task_id: string
          task_owner_id: string
          user_id: string
        }
        Update: {
          created_datetime?: string
          id?: string
          processed_datetime?: string | null
          status?: Database["public"]["Enums"]["task_offer_status"]
          task_id?: string
          task_owner_id?: string
          user_id?: string
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
      action_task_offer: {
        Args: {
          p_task_offer_id: string
          p_status: Database["public"]["Enums"]["task_offer_status"]
        }
        Returns: string
      }
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
      create_task_offer: {
        Args: {
          p_task_id: string
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
          user_id: string
          avatar_url: string
          full_name: string
          my_unread_count: number
        }[]
      }
      get_task_offers: {
        Args: {
          p_task_id: string
        }
        Returns: {
          id: string
          user_id: string
          avatar_url: string
          full_name: string
          status: Database["public"]["Enums"]["task_offer_status"]
          created_datetime: string
          processed_datetime: string
        }[]
      }
      mark_task_conversation_read: {
        Args: {
          p_task_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      search_tasks: {
        Args: {
          p_point_longitude?: number
          p_point_latitude?: number
          p_point_distance?: number
          p_bbox_north_east_longitude?: number
          p_bbox_north_east_latitude?: number
          p_bbox_south_east_longitude?: number
          p_bbox_south_east_latitude?: number
        }
        Returns: {
          id: string
          user_id: string
          avatar_url: string
          full_name: string
          title: string
          description: string
          reason: Database["public"]["Enums"]["task_reason"]
          timing: string
          effort_days: number
          effort_hours: number
          effort_minutes: number
          effort_normalised_minutes: number
          effort_people: number
          longitude: number
          latitude: number
          created_datetime: string
          distance: number
        }[]
      }
    }
    Enums: {
      task_offer_status: "Pending" | "Accepted" | "Declined" | "Cancelled"
      task_reason:
        | "Charity"
        | "Community"
        | "In Need"
        | "Mutual Benefit"
        | "Return For Pledge"
      task_status:
        | "Live"
        | "Closed"
        | "Partially Assigned"
        | "Assigned"
        | "Completed"
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
