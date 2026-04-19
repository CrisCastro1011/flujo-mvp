'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { hasValidConfig } from '@/lib/supabase';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Rutas que no requieren autenticación
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {

    if (!loading) {
      if (!user && !isPublicRoute) {
        // Usuario no autenticado tratando de acceder a ruta privada
        router.push('/login');
      } else if (user && isPublicRoute) {
        // Usuario autenticado en ruta pública, redirigir al dashboard
        router.push('/');
      }
    }
  }, [user, loading, isPublicRoute, router, hasValidConfig]);

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Si no está autenticado y no está en ruta pública, no mostrar nada (se redirige)
  // PERO si Supabase no está configurado, permitir acceso a rutas públicas
  if (!user && !isPublicRoute && hasValidConfig) {
    return null;
  }

  // Si está autenticado y en ruta pública, no mostrar nada (se redirige)
  // PERO si Supabase no está configurado, no redirigir
  if (user && isPublicRoute && hasValidConfig) {
    return null;
  }

  return <>{children}</>;
}