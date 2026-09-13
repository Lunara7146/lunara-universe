import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 
  process.env.SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  "https://xuqagmrhrobnvxiqktgn.supabase.co";

// ⚠️ This client is only ever imported by files under /api (server-side
// Vercel functions). Never import lib/supabase.js from script.js, index.html,
// or any other browser-facing file — the service_role key bypasses RLS
// entirely and must never reach the client.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});