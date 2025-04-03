import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Session } from '../types/Session';
import { User } from '../types/User';

// These would typically be in environment variables
// For development, we'll define them here
// In production, they should be loaded from .env files
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client
let supabase: SupabaseClient;

/**
 * Initialize the Supabase client
 * This should be called once at application startup
 */
export const initializeSupabase = (): SupabaseClient => {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase URL and anonymous key must be provided');
    }
    
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  
  return supabase;
};

/**
 * Get the Supabase client instance
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabase) {
    return initializeSupabase();
  }
  return supabase;
};

/**
 * Authentication functions
 */
export const auth = {
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string) => {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  /**
   * Sign in a user
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return true;
  },
  
  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    const { data, error } = await getSupabaseClient().auth.getUser();
    
    if (error) {
      throw error;
    }
    
    return data.user;
  },
  
  /**
   * Get the current session
   */
  getSession: async () => {
    const { data, error } = await getSupabaseClient().auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return data.session;
  },
};

/**
 * Session data functions
 */
export const sessions = {
  /**
   * Create a new session
   */
  createSession: async (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await getSupabaseClient()
      .from('sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Session;
  },
  
  /**
   * Get a session by ID
   */
  getSessionById: async (id: string) => {
    const { data, error } = await getSupabaseClient()
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Session;
  },
  
  /**
   * Update a session
   */
  updateSession: async (id: string, updates: Partial<Session>) => {
    const { data, error } = await getSupabaseClient()
      .from('sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Session;
  },
  
  /**
   * Get sessions for a user
   */
  getUserSessions: async (userId: string) => {
    const { data, error } = await getSupabaseClient()
      .from('sessions')
      .select('*')
      .or(`userA.eq.${userId},userB.eq.${userId}`)
      .order('updatedAt', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as Session[];
  },
};

/**
 * User data functions
 */
export const users = {
  /**
   * Get a user by ID
   */
  getUserById: async (id: string) => {
    const { data, error } = await getSupabaseClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as User;
  },
  
  /**
   * Update a user
   */
  updateUser: async (id: string, updates: Partial<User>) => {
    const { data, error } = await getSupabaseClient()
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as User;
  },
};

export default {
  auth,
  sessions,
  users,
  getSupabaseClient,
  initializeSupabase,
};
