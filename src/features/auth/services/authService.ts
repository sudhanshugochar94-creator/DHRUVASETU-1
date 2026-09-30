// ====================================================================
// SIH26063: Authentication Service
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import type { Database } from '@/shared/types/database.types';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

export const authService = {
  /**
   * Log in user with email and password
   */
  async login(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      // Mock session for development / demo mode
      return {
        user: { id: 'mock-user-id', email },
        session: { access_token: 'mock-token' },
        error: null
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { user: data.user, session: data.session, error };
  },

  /**
   * Sign up new research / content staff member
   */
  async signup(
    email: string, 
    password: string, 
    fullName: string, 
    role: 'researcher' | 'content_manager' | 'administrator' = 'researcher',
    institution: string = 'National Centre for Polar and Ocean Research'
  ) {
    if (!isSupabaseConfigured()) {
      return {
        user: { id: 'mock-user-id', email },
        error: null
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          institution
        }
      }
    });

    if (!error && data.user) {
      // Create user profile in profiles table
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        email,
        role,
        institution
      });
    }

    return { user: data.user, error };
  },

  /**
   * Log out current session
   */
  async logout() {
    if (!isSupabaseConfigured()) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Get active session
   */
  async getSession() {
    if (!isSupabaseConfigured()) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured()) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  /**
   * Retrieve institutional profile for a given user ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;
      return data;
    } catch {
      return null;
    }
  },

  /**
   * Listen for authentication state changes
   */
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return data.subscription;
  }
};
