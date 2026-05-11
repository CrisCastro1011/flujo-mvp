'use client';

import { Budget } from '@/lib/types';
import { 
  Pencil, Trash2, Chrome as Home, ShoppingCart, Utensils, Car, Tv, Heart, Wallet, 
  TrendingUp, Calendar, DollarSign, Target, Clock, AlertTriangle 
} from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';

const iconMap: Record<string, React.ElementType> = {
  Home, ShoppingCart, Utensils, Car, Tv, Heart, Wallet, TrendingUp, Calendar, DollarSign, Target
};

interface BudgetCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
}

export default function BudgetCard({ budget, onEdit }: BudgetCardProps) {
  const { deleteBudget } = useFinance();
  
  // Calcular totales
  const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.used, 0);
  const totalAllocated = budget.categories.reduce((sum, cat) => sum + cat.limit, 0);
  const percentage = Math.min(Math.round((totalSpent / budget.maxSpendingLimit) * 100), 100);
  const isOverBudget = totalSpent > budget.maxSpendingLimit;
  const remaining = budget.maxIncome - totalSpent;

  // Determinar estado del presupuesto
  const getStatusInfo = () => {
    if (isOverBudget) {
      return { text: 'Límite Superado', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-600' };
    } else if (percentage > 80) {
      return { text: 'Cerca del límite', color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' };
    } else {
      return { text: 'Vas bien', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-600' };
    }
  };

  const status = getStatusInfo();
  const Icon = iconMap[budget.icon] || Wallet;

  // Calcular días restantes
  const formatDaysUntilNext = (days: number) => {
    if (days <= 0) return 'Vencido';
    if (days === 1) return '1 día';
    return `${days} días`;
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`¿Eliminar el presupuesto "${budget.name}"?`);
    if (!confirmed) return;

    try {
      await deleteBudget(budget.id);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-200 group">
      {/* Header con información básica */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${budget.color}18` }}
          >
            <Icon size={18} style={{ color: budget.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{budget.name}</h3>
            <p className="text-xs text-slate-400 capitalize">{budget.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Badge de estado */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
            {status.text}
          </div>

          {onEdit && (
            <button
              onClick={() => onEdit(budget)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-blue-50 transition-all"
              aria-label={`Editar ${budget.name}`}
            >
              <Pencil size={14} className="text-blue-500" />
            </button>
          )}
          
          {/* Botón eliminar */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
            aria-label={`Eliminar ${budget.name}`}
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-slate-50 rounded-xl">
          <div className="text-lg font-bold text-slate-900">
            ${totalSpent.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Gastado</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-xl">
          <div className="text-lg font-bold text-slate-900">
            ${remaining.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Disponible</div>
        </div>
      </div>

      {/* Barra de progreso principal */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 font-medium">Progreso del Presupuesto</span>
          <span className={`text-xs font-bold ${isOverBudget ? 'text-red-500' : 'text-slate-700'}`}>
            {percentage}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isOverBudget ? '#EF4444' : percentage > 80 ? '#F59E0B' : budget.color,
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>${totalSpent.toLocaleString()} / ${budget.maxSpendingLimit.toLocaleString()}</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-slate-400" />
          <span className="text-xs text-slate-500">
            {formatDaysUntilNext(budget.daysUntilNext)} para próximo sueldo
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {budget.isActive && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          <span className="text-xs text-slate-500">
            {budget.categories.length} categorías
          </span>
        </div>
      </div>

      {/* Mostrar advertencia si está cerca del límite */}
      {percentage > 80 && !isOverBudget && (
        <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-2">
          <AlertTriangle size={14} className="text-yellow-600" />
          <span className="text-xs text-yellow-700">
            Cerca del límite de gasto
          </span>
        </div>
      )}

      {/* Mostrar advertencia si superó el límite */}
      {isOverBudget && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-600" />
          <span className="text-xs text-red-700">
            Has superado tu límite de gasto por ${(totalSpent - budget.maxSpendingLimit).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
