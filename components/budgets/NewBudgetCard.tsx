'use client';

import { useState } from 'react';
import { Budget, BudgetCategory } from '@/lib/types';
import { 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Wallet, 
  Home, 
  ShoppingCart, 
  Utensils, 
  Car, 
  Tv, 
  Heart 
} from 'lucide-react';
import { useEnhancedBudgets } from '@/context/EnhancedBudgetContext';

const iconMap: Record<string, React.ElementType> = {
  Wallet, Home, ShoppingCart, Utensils, Car, Tv, Heart,
};

interface BudgetCardProps {
  budget: Budget;
}

export default function BudgetCard({ budget }: BudgetCardProps) {
  const { deleteBudget } = useEnhancedBudgets();
  const [expanded, setExpanded] = useState(false);

  // Cálculos principales
  const totalUsed = budget.categories.reduce((sum, cat) => sum + cat.used, 0);
  const totalLimit = budget.categories.reduce((sum, cat) => sum + cat.limit, 0);
  const remainingBudget = budget.allocatedAmount - totalUsed;
  const budgetPercentage = Math.min((totalUsed / budget.allocatedAmount) * 100, 100);
  const savingsPercentage = (budget.savingsAmount / budget.totalIncome) * 100;

  // Estados de las categorías
  const overBudgetCategories = budget.categories.filter(cat => cat.used > cat.limit);
  const onTrackCategories = budget.categories.filter(cat => cat.used <= cat.limit);
  
  // Estado general
  const isOverBudget = totalUsed > budget.allocatedAmount;
  const isOnTrack = totalUsed <= budget.allocatedAmount;

  const Icon = iconMap[budget.icon] || Wallet;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 group">
      {/* Header del presupuesto */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${budget.color}18` }}
          >
            <Icon size={20} style={{ color: budget.color }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{budget.name}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-slate-500">
                Ingreso: ${budget.totalIncome.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">
                Ahorros: ${budget.savingsAmount.toLocaleString()} ({savingsPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Estado general */}
          {isOverBudget ? (
            <div className="flex items-center gap-1.5 text-red-500">
              <AlertTriangle size={14} />
              <span className="text-xs font-semibold">Excedido</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-500">
              <CheckCircle size={14} />
              <span className="text-xs font-semibold">En orden</span>
            </div>
          )}
          
          <button
            onClick={async () => {
              try {
                await deleteBudget(budget.id);
              } catch (error) {
                console.error('Error deleting budget:', error);
              }
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Progreso del presupuesto principal */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Presupuesto Principal</span>
          <span className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-700'}`}>
            ${totalUsed.toLocaleString()} / ${budget.allocatedAmount.toLocaleString()}
          </span>
        </div>
        
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${
              isOverBudget ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{budgetPercentage.toFixed(1)}% usado</span>
          <span className={`text-xs font-medium ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ${Math.abs(remainingBudget).toLocaleString()} {remainingBudget >= 0 ? 'disponible' : 'excedido'}
          </span>
        </div>
      </div>

      {/* Resumen de categorías */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-slate-900">{budget.categories.length}</div>
          <div className="text-xs text-slate-500">Categorías</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${onTrackCategories.length > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
            {onTrackCategories.length}
          </div>
          <div className="text-xs text-slate-500">En orden</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${overBudgetCategories.length > 0 ? 'text-red-600' : 'text-slate-400'}`}>
            {overBudgetCategories.length}
          </div>
          <div className="text-xs text-slate-500">Excedidas</div>
        </div>
      </div>

      {/* Toggle para ver detalles */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp size={16} />
            Ocultar detalles
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            Ver detalles de categorías
          </>
        )}
      </button>

      {/* Detalles expandidos */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {budget.categories.map((category) => {
            const categoryPercentage = Math.min((category.used / category.limit) * 100, 100);
            const isOverLimit = category.used > category.limit;
            const CategoryIcon = iconMap[category.icon] || Wallet;

            return (
              <div key={category.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}18` }}
                  >
                    <CategoryIcon size={14} style={{ color: category.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{category.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            isOverLimit ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${categoryPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {categoryPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-bold ${isOverLimit ? 'text-red-600' : 'text-slate-700'}`}>
                    ${category.used.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    / ${category.limit.toLocaleString()}
                  </div>
                  <div className={`text-xs font-medium ${isOverLimit ? 'text-red-600' : 'text-emerald-600'}`}>
                    {isOverLimit ? (
                      `+${(category.used - category.limit).toLocaleString()}`
                    ) : (
                      `${(category.limit - category.used).toLocaleString()} rest.`
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Resumen final */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Budget Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {isOverBudget ? (
                    <>
                      <TrendingDown size={16} className="text-red-500" />
                      <span className="text-sm font-bold text-red-600">
                        Excedido por ${(totalUsed - budget.allocatedAmount).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingUp size={16} className="text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-600">
                        En orden - ${(budget.allocatedAmount - totalUsed).toLocaleString()} disponible
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Savings Goal</p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp size={16} className="text-blue-500" />
                  <span className="text-sm font-bold text-blue-600">
                    ${budget.savingsAmount.toLocaleString()} ({savingsPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}