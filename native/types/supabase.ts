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
      geo_tracking: {
        Row: {
          home_polygon: unknown | null
          id: string
        }
        Insert: {
          home_polygon?: unknown | null
          id: string
        }
        Update: {
          home_polygon?: unknown | null
          id?: string
        }
      }
      notifications: {
        Row: {
          created_datetime: string
          delivered: boolean
          delivered_datetime: string | null
          id: string
          payload: Json
          type: Database["public"]["Enums"]["notifications_item_type"]
          user_id: string
          you_actioned: boolean
        }
        Insert: {
          created_datetime?: string
          delivered?: boolean
          delivered_datetime?: string | null
          id?: string
          payload: Json
          type: Database["public"]["Enums"]["notifications_item_type"]
          user_id: string
          you_actioned?: boolean
        }
        Update: {
          created_datetime?: string
          delivered?: boolean
          delivered_datetime?: string | null
          id?: string
          payload?: Json
          type?: Database["public"]["Enums"]["notifications_item_type"]
          user_id?: string
          you_actioned?: boolean
        }
      }
      prefs: {
        Row: {
          home_polygon: Json | null
          id: string
          last_search_location: Json | null
        }
        Insert: {
          home_polygon?: Json | null
          id: string
          last_search_location?: Json | null
        }
        Update: {
          home_polygon?: Json | null
          id?: string
          last_search_location?: Json | null
        }
      }
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
      push_tokens: {
        Row: {
          push_token: string
          user_id: string
        }
        Insert: {
          push_token: string
          user_id: string
        }
        Update: {
          push_token?: string
          user_id?: string
        }
      }
      reviews: {
        Row: {
          created_datetime: string
          from_user_id: string | null
          id: string
          message: string | null
          score: number
          task_id: string | null
          to_role: Database["public"]["Enums"]["reviewee"]
          to_user_id: string | null
        }
        Insert: {
          created_datetime?: string
          from_user_id?: string | null
          id: string
          message?: string | null
          score?: number
          task_id?: string | null
          to_role?: Database["public"]["Enums"]["reviewee"]
          to_user_id?: string | null
        }
        Update: {
          created_datetime?: string
          from_user_id?: string | null
          id?: string
          message?: string | null
          score?: number
          task_id?: string | null
          to_role?: Database["public"]["Enums"]["reviewee"]
          to_user_id?: string | null
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
          closed_or_completed_datetime: string | null
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
          closed_or_completed_datetime?: string | null
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
          closed_or_completed_datetime?: string | null
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
      action_task: {
        Args: {
          p_task_id: string
          p_status: Database["public"]["Enums"]["task_status"]
        }
        Returns: string
      }
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
      mark_notification_delivered: {
        Args: {
          p_notification_id: string
        }
        Returns: boolean
      }
      mark_task_conversation_read: {
        Args: {
          p_task_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      save_home_polygon: {
        Args: {
          p_home_polygon: Json
        }
        Returns: string
      }
      save_home_search_location: {
        Args: {
          p_search_location: Json
        }
        Returns: string
      }
      save_last_search_location: {
        Args: {
          p_search_location: Json
        }
        Returns: string
      }
      search_tasks: {
        Args: {
          p_current_point?: Json
          p_point_json?: Json
          p_point_distance?: number
          p_polygon_json?: Json
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
      notifications_item_type:
        | "Task"
        | "TaskOffer"
        | "TaskOfferAccepted"
        | "TaskOfferDeclined"
        | "TaskOfferCancelled"
        | "TaskMessage"
      reviewee: "Task Lister" | "Volunteer"
      task_offer_status: "Pending" | "Accepted" | "Declined" | "Cancelled"
      task_reason:
        | "Charity"
        | "Community"
        | "In Need"
        | "Mutual Benefit"
        | "Return For Pledge"
      task_status:
        | "Live"
        | "Partially Assigned"
        | "Assigned"
        | "Completed"
        | "Closed"
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
