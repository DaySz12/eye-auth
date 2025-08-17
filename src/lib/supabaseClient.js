import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://twjdluwmjobxtgitnyic.supabase.co"; // Project URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3amRsdXdtam9ieHRnaXRueWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMzQ0MTIsImV4cCI6MjA3MDkxMDQxMn0.-ZLJzqElgZjDSSfqIYiPseh2scbm22gU46jhB7KDlEE"; // anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);