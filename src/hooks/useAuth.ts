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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            setUser(null);
          } else if (data) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: data.role || 'user',
              full_name: data.full_name || '',
            });
          }
        } catch (error) {
          console.error('Error in onAuthStateChange profile fetch:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      // Set loading to false only after the first auth event is handled.
      // This prevents the loading screen from reappearing on session refreshes.
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // An empty dependency array ensures this effect runs only once.

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
      await supabase.auth.signOut();
      // The onAuthStateChange listener will set the user to null.
      // Navigate to a safe page after sign-out.
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
