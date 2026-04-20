import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Verificar si las variables están configuradas correctamente
export const hasValidConfig = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')
);

let supabaseInstance: SupabaseClient | null = null;

// Crear cliente de Supabase solo si está configurado
if (hasValidConfig && supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error al inicializar Supabase:', error);
    supabaseInstance = null;
  }
} else {
  console.warn('⚠️  Supabase no está configurado. Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local');
}

// Mock client para desarrollo sin configuración
const mockClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ 
      data: { subscription: { unsubscribe: () => {} } } 
    }),
    signInWithPassword: async () => ({ 
      error: { message: 'Supabase no configurado' } 
    }),
    signUp: async () => ({ 
      error: { message: 'Supabase no configurado' } 
    }),
    signOut: async () => {}
  }
} as any;

export const supabase = supabaseInstance || mockClient;