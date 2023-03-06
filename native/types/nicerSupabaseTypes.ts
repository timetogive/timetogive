import { Database } from './supabase';

// Nicer names to work with
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type TaskReason = Database['public']['Enums']['task_reason'];
export type SearchTasksResult =
  Database['public']['Functions']['search_tasks']['Returns'];
export type GetTaskOffersResult =
  Database['public']['Functions']['get_task_offers']['Returns'];
export type GetTaskConversationsResult =
  Database['public']['Functions']['get_task_conversations']['Returns'];
