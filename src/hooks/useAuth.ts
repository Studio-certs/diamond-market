import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // List of public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/marketplace'];

  useEffect(() => {
    let mounted = true;

    async function getUser() {
      try {
        // Clear any stale session data
        const currentSession = await supabase.auth.getSession();
        if (!currentSession.data.session) {
          localStorage.removeItem(supabase.auth.storageKey);
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        if (!mounted) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', currentSession.data.session.user.id)
          .single();

        if (!mounted) return;

        if (error) {
          console.error('Error fetching profile:', error);
          setUser(null);
        } else {
          setUser({
            id: currentSession.data.session.user.id,
            email: currentSession.data.session.user.email!,
            role: data?.role || 'user',
            full_name: data?.full_name || ''
          });
        }
      } catch (error) {
        console.error('Error in getUser:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setIsLoading(true);

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem(supabase.auth.storageKey);
        setUser(null);
        setIsLoading(false);
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
        return;
      }

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', session.user.id)
          .single();

        if (!mounted) return;

        if (error) {
          console.error('Error fetching profile:', error);
          setUser(null);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: data?.role || 'user',
            full_name: data?.full_name || ''
          });
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
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
      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem(supabase.auth.storageKey);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error in signOut:', error);
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
