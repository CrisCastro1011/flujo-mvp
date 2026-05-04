'use client';

import { useFinance } from '@/context/FinanceContext';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Clock, PiggyBank } from 'lucide-react';
import Link from 'next/link';
import { Budget } from '@/lib/types';

export default function BudgetSummaryCard() {
  const { budgets, loading } = useFinance();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar presupuesto activo
  const activeBudgets = budgets.filter((budget: Budget) => budget.isActive);
  const currentBudget = activeBudgets.length > 0 ? activeBudgets[0] : null;

  if (!currentBudget) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
            <Target size={20} className="text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">¡Crea tu primer presupuesto!</h3>
          <p className="text-xs text-slate-500 mb-4">
            Controla tus finanzas con presupuestos personalizados
          </p>
          <Link
            href="/budgets"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all"
          >
            Crear Presupuesto
          </Link>
        </div>
      </div>
    );
  }

  // Cálculos para el presupuesto actual
  const totalSpent = currentBudget.categories.reduce((sum, cat) => sum + cat.used, 0);
  const remainingBalance = currentBudget.maxIncome - totalSpent;
  const spendingPercentage = (totalSpent / currentBudget.maxSpendingLimit) * 100;
  const remainingDays = currentBudget.daysUntilNext;

  // Determinar estado del presupuesto
  const getBudgetStatus = () => {
    if (totalSpent > currentBudget.maxSpendingLimit) {
      return {
        icon: AlertTriangle,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        text: 'Límite superado',
        borderColor: 'border-red-200'
      };
    } else if (spendingPercentage > 80) {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        text: 'Cerca del límite',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        text: 'Vas bien',
        borderColor: 'border-green-200'
      };
    }
  };

  const status = getBudgetStatus();
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Presupuesto Actual</h3>
        <Link
          href="/budgets"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Ver todo →
        </Link>
      </div>

      {/* Información del presupuesto */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 mb-1">{currentBudget.name}</h4>
        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color} ${status.borderColor} border`}>
          <StatusIcon size={12} />
          {status.text}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown size={12} className="text-red-500" />
            <span className="text-xs text-slate-500 font-medium">Gastado</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            ${totalSpent.toLocaleString()}
          </div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-xs text-slate-500 font-medium">Disponible</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            ${remainingBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 font-medium">Progreso de gasto</span>
          <span className="text-xs font-bold text-slate-700">
            {Math.round(spendingPercentage)}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              totalSpent > currentBudget.maxSpendingLimit ? 'bg-red-500' :
              spendingPercentage > 80 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ 
              width: `${Math.min(spendingPercentage, 100)}%` 
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>${totalSpent.toLocaleString()}</span>
          <span>${currentBudget.maxSpendingLimit.toLocaleString()}</span>
        </div>
      </div>

      {/* Días restantes */}
      <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-blue-600" />
          <span className="text-sm text-blue-800 font-medium">
            {remainingDays} días hasta próximo sueldo
          </span>
        </div>
        <div className="text-sm font-bold text-blue-900">
          ${remainingBalance.toLocaleString()}
        </div>
      </div>

      {/* Categorías top */}
      <div className="mt-4">
        <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Categorías principales
        </h5>
        <div className="space-y-2">
          {currentBudget.categories
            .sort((a, b) => (b.used / b.limit) - (a.used / a.limit))
            .slice(0, 3)
            .map((category) => {
              const categoryPercentage = (category.used / category.limit) * 100;
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs text-slate-600">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-xs font-medium ${
                      categoryPercentage > 100 ? 'text-red-500' :
                      categoryPercentage > 80 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {Math.round(categoryPercentage)}%
                    </div>
                    <span className="text-xs text-slate-400">
                      ${category.used.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}