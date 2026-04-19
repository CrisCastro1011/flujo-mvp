'use client';

import { TransactionType } from '@/lib/types';

type FilterType = 'all' | TransactionType;

interface TransactionFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: { all: number; income: number; expense: number };
}

export default function TransactionFilter({ activeFilter, onFilterChange, counts }: TransactionFilterProps) {
  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: 'all', label: 'Todo', count: counts.all },
    { value: 'income', label: 'Ingresos', count: counts.income },
    { value: 'expense', label: 'Gastos', count: counts.expense },
  ];

  return (
    <div className="flex gap-2">
      {filters.map(({ value, label, count }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
            activeFilter === value
              ? value === 'income'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                : value === 'expense'
                ? 'bg-red-500 text-white shadow-sm shadow-red-200'
                : 'bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          {label}
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
            activeFilter === value ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
          }`}>
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
