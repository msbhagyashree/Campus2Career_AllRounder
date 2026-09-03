import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or custom user-configured credentials stored locally
const SUPABASE_CONFIG_KEY = 'campus2career_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }

  return {
    url: envUrl,
    anonKey: envKey,
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(
    SUPABASE_CONFIG_KEY,
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
  );
  supabaseInstance = null; // reset cached instance
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const config = getStoredSupabaseConfig();
  if (config.url && config.anonKey && config.url.startsWith('http')) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
      return supabaseInstance;
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!url || !anonKey) {
      return { success: false, message: 'URL and Anon Key must not be empty' };
    }
    const tempClient = createClient(url, anonKey);
    const { data, error } = await tempClient.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it's still reachable
      if (error.message.includes('relation "public.profiles" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! Please execute the provided supabase-schema.sql to create tables.',
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected and verified Supabase connection!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

export async function signInWithGoogleOAuth(): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase credentials not configured yet. Configure Supabase in Settings or use Instant Local Account mode.',
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return { success: true, message: 'Redirecting to Google Sign-In...' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Google OAuth failed' };
  }
}
