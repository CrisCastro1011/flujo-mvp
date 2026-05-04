'use client';

import { useFinance } from '@/context/FinanceContext';
import { CheckCircle } from 'lucide-react';

export default function BudgetNotification() {
  const { budgetNotification } = useFinance();

  if (!budgetNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 max-w-sm">
        <CheckCircle size={18} />
        <span className="text-sm font-medium">{budgetNotification}</span>
      </div>
    </div>
  );
}