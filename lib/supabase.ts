import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://pobizaxvmxxgqfxwmhvq.supabase.co";

const supabaseAnonKey =
  "sb_publishable_NInGVZcZ95cwVBzJZKjEmQ_S-sG4Vuz";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);