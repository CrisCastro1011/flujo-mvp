'use client';

import { Budget } from '@/lib/types';
import { Trash2, Chrome as Home, ShoppingCart, Utensils, Car, Tv, Heart, Wallet } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';

const iconMap: Record<string, React.ElementType> = {
  Home, ShoppingCart, Utensils, Car, Tv, Heart, Wallet,
};

interface BudgetCardProps {
  budget: Budget;
}

export default function BudgetCard({ budget }: BudgetCardProps) {
  const { deleteBudget } = useFinance();
  const percentage = Math.min(Math.round((budget.used / budget.limit) * 100), 100);
  const isOverBudget = budget.used > budget.limit;
  const remaining = budget.limit - budget.used;

  const Icon = iconMap[budget.icon] || Wallet;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${budget.color}18` }}
          >
            <Icon size={18} style={{ color: budget.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{budget.category}</p>
            <p className="text-xs text-slate-400">${budget.limit.toLocaleString()} limit</p>
          </div>
        </div>
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

      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500 font-medium">Spent</span>
          <span className={`text-xs font-bold ${isOverBudget ? 'text-red-500' : 'text-slate-700'}`}>
            ${budget.used.toLocaleString()} / ${budget.limit.toLocaleString()}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: isOverBudget ? '#EF4444' : budget.color,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isOverBudget
            ? 'bg-red-50 text-red-600'
            : percentage >= 80
            ? 'bg-amber-50 text-amber-600'
            : 'bg-emerald-50 text-emerald-600'
        }`}>
          {isOverBudget
            ? `$${Math.abs(remaining).toLocaleString()} over budget`
            : `$${remaining.toLocaleString()} remaining`
          }
        </span>
        <span className="text-xs font-bold text-slate-500">{percentage}%</span>
      </div>
    </div>
  );
}
