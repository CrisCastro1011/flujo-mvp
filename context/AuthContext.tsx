'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase, hasValidConfig } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error?: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasValidConfig) {
      // Modo demo: crear un usuario ficticio después de un delay
      setTimeout(() => {
        const demoUser: User = {
          id: 'demo-user',
          email: 'demo@ejemplo.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
        } as User;
        setUser(demoUser);
        setLoading(false);
      }, 500);
      return;
    }

    // Obtener sesión actual cuando Supabase está configurado
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    getSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!hasValidConfig) {
      // Modo demo: simular login exitoso
      const demoUser: User = {
        id: 'demo-user',
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
      } as User;
      
      setUser(demoUser);
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: { message: 'Error de conexión con Supabase' } as any };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!hasValidConfig) {
      // Modo demo: simular registro exitoso
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: { message: 'Error de conexión con Supabase' } as any };
    }
  };

  const signOut = async () => {
    try {
      if (hasValidConfig) {
        await supabase.auth.signOut();
      } else {
        // Si Supabase no está configurado, simplemente limpiar el estado local
        setUser(null);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // En caso de error, limpiar el estado local de todas formas
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}