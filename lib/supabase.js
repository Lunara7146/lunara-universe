import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 
  process.env.SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  "https://xuqagmrhrobnvxiqktgn.supabase.co";

const supabaseKey = 
  process.env.SUPABASE_ANON_KEY || 
  process.env.SUPABASE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  "sb_publishable_UHiK69_AngPQuxobjhy6lw_2thzvWxg";

export const supabase = createClient(supabaseUrl, supabaseKey);