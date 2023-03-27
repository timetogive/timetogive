const supabaseUrl = process.env.NEXT_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;
const supabaseProjectId = process.env.NEXT_SUPABASE_PROJECT_ID;

if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseProjectId) {
  throw Error('Missing config values.');
}

export { supabaseUrl, supabaseServiceRoleKey, supabaseProjectId };
