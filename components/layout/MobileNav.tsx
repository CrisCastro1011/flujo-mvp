'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, Target, PiggyBank, Menu, LogOut, User, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/', label: 'Panel', icon: LayoutDashboard, shortLabel: 'Panel' },
  { href: '/transactions', label: 'Transacciones', icon: ArrowLeftRight, shortLabel: 'Transac.' },
  { href: '/budgets', label: 'Presupuestos', icon: Target, shortLabel: 'Presup.' },
  { href: '/savings', label: 'Ahorros', icon: PiggyBank, shortLabel: 'Ahorros' },
  { href: '/settings', label: 'Configuración', icon: Settings, shortLabel: 'Config.' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      // Usar window.location para asegurar la redirección en móvil
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsMenuOpen(false);
      window.location.href = '/login';
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 3).map(({ href, shortLabel, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-150 min-w-0',
                isActive ? 'text-blue-600' : 'text-slate-400'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{shortLabel}</span>
            </Link>
          );
        })}
        
        {/* Último elemento del nav principal */}
        <Link
          href="/savings"
          className={cn(
            'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-150 min-w-0',
            pathname === '/savings' ? 'text-blue-600' : 'text-slate-400'
          )}
        >
          <PiggyBank size={20} />
          <span className="text-[10px] font-medium">Ahorros</span>
        </Link>

        {/* Botón de menú */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl h-auto text-slate-400 hover:text-slate-600"
            >
              <Menu size={20} />
              <span className="text-[10px] font-medium">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle className="text-left">Menú</SheetTitle>
            </SheetHeader>
            
            {/* Información del usuario */}
            {user && (
              <div className="flex items-center gap-3 p-3 mt-4 rounded-xl bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-500">Usuario</p>
                </div>
              </div>
            )}

            {/* Opciones del menú */}
            <div className="mt-4 space-y-2">
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Settings size={20} className="text-slate-400" />
                <span className="font-medium">Configuración</span>
              </Link>
              
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start gap-3 px-3 py-3 h-auto text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={20} />
                <span className="font-medium">Cerrar Sesión</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
