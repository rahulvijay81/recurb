import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
// These will need to be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance of the Supabase client to be used throughout the app
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);