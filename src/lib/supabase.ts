import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Ensure URL starts with https:// if not present
const formattedUrl = supabaseUrl.startsWith('https://') ? supabaseUrl : `https://${supabaseUrl}`;

// Validate URL before creating client
try {
  new URL(formattedUrl);
} catch (error) {
  throw new Error('Invalid Supabase URL. Please check your VITE_SUPABASE_URL environment variable.');
}

export const supabase = createClient(formattedUrl, supabaseAnonKey);