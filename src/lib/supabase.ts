import { createClient } from '@supabase/supabase-js';

/*
 * Supabase is optional: on-device AI is the primary path, and the client-side
 * keyword categorizer in aiAdapter.ts is the fallback. Expo inlines
 * `process.env.EXPO_PUBLIC_*` at build time (replaces the old Vite
 * `import.meta.env` usage).
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;