'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { FinanceProvider } from '@/context/FinanceContext';
import { CategoriesProvider } from '@/context/CategoriesContext';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Rutas que no necesitan el layout completo (sidebar, etc.)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      <AuthGuard>
        {isAuthRoute ? (
          // Para rutas de autenticación, mostrar solo el contenido
          children
        ) : (
          // Para rutas autenticadas, mostrar el layout completo
          <CategoriesProvider>
            <FinanceProvider>
              <div className="min-h-screen bg-slate-50">
                <Sidebar />
                <main className="md:ml-60 min-h-screen pb-20 md:pb-0">
                  {children}
                </main>
                <MobileNav />
              </div>
            </FinanceProvider>
          </CategoriesProvider>
        )}
      </AuthGuard>
    </AuthProvider>
  );
}
