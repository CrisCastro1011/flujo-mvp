'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Target, PiggyBank, TrendingUp, Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Panel', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transacciones', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Presupuestos', icon: Target },
  { href: '/savings', label: 'Ahorros', icon: PiggyBank },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirigir a login después del logout
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Redirigir de todas formas
      router.push('/login');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r border-slate-100 shadow-sm fixed left-0 top-0 bottom-0 z-30">
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <TrendingUp className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">Finely</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 ml-10">Finanzas Personales</p>
      </div>

      {/* Información del usuario */}
      {user && (
        <div className="px-3 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-slate-500">Usuario</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              )}
            >
              <Icon size={18} className={cn(isActive ? 'text-blue-600' : 'text-slate-400')} />
              {label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all mb-3"
        >
          <Settings size={18} className="text-slate-400" />
          Configuración
        </Link>

        {/* Botón de cerrar sesión */}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={18} className="text-slate-400" />
          Cerrar Sesión
        </Button>

        <div className="mt-3 mx-1 p-3 rounded-xl bg-blue-50">
          <p className="text-xs font-semibold text-blue-700">Abril 2026</p>
          <p className="text-xs text-blue-500 mt-0.5">Período de presupuesto actual</p>
        </div>
      </div>
    </aside>
  );
}
