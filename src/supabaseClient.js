import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Aquí es donde se inyecta la Publishable key que guardaste en el .env
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);