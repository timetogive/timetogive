import { Database } from './supabase'

// Nicer names to work with
export type Profile = Database['public']['Tables']['profiles']['Row']
export type TaskReason = Database['public']['Enums']['task_reason']
export type SearchTasksResult = Database['public']['Functions']['search_tasks']['Returns']
