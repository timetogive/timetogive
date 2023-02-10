import { Database } from './supabase'

// Nicer names to work with
export type Profile = Database['public']['Tables']['profiles']['Row']
