import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // List of public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/marketplace'];

  const getProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return { role: 'user', full_name: '' };
      }

      console.log('Profile data:', data);
      return {
        role: data?.role || 'user',
        full_name: data?.full_name || ''
      };
    } catch (error) {
      console.error('Error in getProfile:', error);
      return { role: 'user', full_name: '' };
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      console.log('Getting current user session');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (session?.user) {
        console.log('Session found, fetching profile');
        const { role, full_name } = await getProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role,
          full_name
        });
      } else {
        console.log('No session found');
        setUser(null);
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      setUser(null);
      if (!publicRoutes.includes(location.pathname)) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [navigate, location.pathname, getProfile]);

  useEffect(() => {
    console.log('Setting up auth state change listener');
    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setLoading(true);
      
      if (session?.user) {
        console.log('Session exists, updating user');
        const { role, full_name } = await getProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role,
          full_name
        });
      } else {
        console.log('No session, clearing user');
        setUser(null);
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      }
      setLoading(false);
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [getCurrentUser, navigate, location.pathname, getProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting sign up');
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  return {
    user,
    loading,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
}