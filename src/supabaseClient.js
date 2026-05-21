import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://esnqlsqncnvgrwhbmzzc.supabase.co";
const supabaseKey = "sb_publishable_D5GXKAKTS_3927mljpZIKQ_qJcFyeoM";

export const supabase = createClient(supabaseUrl, supabaseKey);