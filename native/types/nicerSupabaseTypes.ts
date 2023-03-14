import { Database } from './supabase';

// Nicer names to work with
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type TaskReason = Database['public']['Enums']['task_reason'];
export type TaskStatus = Database['public']['Enums']['task_status'];
export type TaskOfferStatus =
  Database['public']['Enums']['task_offer_status'];
export type SearchTasksResult =
  Database['public']['Functions']['search_tasks']['Returns'];
export type SearchTasksResultItem = SearchTasksResult[number];
export type GetTaskOffersResult =
  Database['public']['Functions']['get_task_offers']['Returns'];
export type GetTaskConversationsResult =
  Database['public']['Functions']['get_task_conversations']['Returns'];
export type NotificationsItem =
  Database['public']['Tables']['notifications']['Row'];
export type NotificationsItemType =
  Database['public']['Enums']['notifications_item_type'];
