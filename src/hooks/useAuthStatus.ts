
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { getUserProfile } from '../utils/supabaseUtils';

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true);
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (session) {
          // Get user profile
          const profile = await getUserProfile();
          setUserName(profile?.name || null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getInitialSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
        
        if (session) {
          // Get user profile on auth change
          const profile = await getUserProfile();
          setUserName(profile?.name || null);
        } else {
          setUserName(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, userName, setUserName, isLoading };
}
