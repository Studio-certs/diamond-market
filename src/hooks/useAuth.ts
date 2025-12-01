import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let isInitialized = false;

    const fetchProfile = async (userId: string, userEmail: string) => {
      const profileQuery = supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', userId)
        .single();
      
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );

      try {
        const { data, error } = await Promise.race([profileQuery, timeout]);
        if (!mounted) return;
        
        if (error) {
          console.error('Error fetching profile:', error);
          // Set user with basic info even if profile fetch fails
          setUser({
            id: userId,
            email: userEmail,
            role: 'user',
            full_name: '',
          });
        } else if (data) {
          setUser({
            id: userId,
            email: userEmail,
            role: data.role || 'user',
            full_name: data.full_name || '',
          });
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error in profile fetch:', error);
        // Set user with basic info even if profile fetch fails
        setUser({
          id: userId,
          email: userEmail,
          role: 'user',
          full_name: '',
        });
      }
    };

    // Initialize auth state by checking for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email!);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error getting session:', error);
        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
          isInitialized = true;
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event, session?.user?.email);

      // Skip initial events during initialization
      if (!isInitialized) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setIsLoading(true);
          await fetchProfile(session.user.id, session.user.email!);
          setIsLoading(false);
        }
      } else if (event === 'USER_UPDATED' && session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      } else if (!session) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // onAuthStateChange will handle the user state update.
      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      // onAuthStateChange will handle the user state update.
      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Clear user state immediately for instant UI feedback
      setUser(null);
      setIsLoading(false);
      
      // Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during sign out:', error);
      }
      
      // Force navigate to home
      navigate('/', { replace: true });
      
      // Force a page reload to completely reset state
      window.location.href = '/';
    } catch (error) {
      console.error('Error in signOut:', error);
      setUser(null);
      setIsLoading(false);
      window.location.href = '/';
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
}
