import { Database } from './supabase'

// Nicer names to work with
export type Profile = Database['public']['Tables']['profiles']['Row']
export type TaskReason = Database['public']['Enums']['task_reason']
