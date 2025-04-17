import { useEffect, useState } from 'react';
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

  useEffect(() => {
    async function getProfile(userId: string) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', userId)
          .single();

        if (error) throw error;

        return {
          role: data?.role || 'user',
          full_name: data?.full_name || ''
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
          role: 'user',
          full_name: ''
        };
      }
    }

    async function getCurrentUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { role, full_name } = await getProfile(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: role,
            full_name: full_name
          });
        } else {
          setUser(null);
          // Only redirect to login if we're not on a public route
          if (!publicRoutes.includes(location.pathname)) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        setUser(null);
        // Only redirect to login if we're not on a public route
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    }

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { role, full_name } = await getProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: role,
          full_name: full_name
        });
      } else {
        setUser(null);
        // Only redirect to login if we're not on a public route
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      }
      setIsLoading(false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
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