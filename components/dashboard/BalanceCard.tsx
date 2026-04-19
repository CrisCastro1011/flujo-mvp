'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceCardProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export default function BalanceCard({ totalBalance, monthlyIncome, monthlyExpenses }: BalanceCardProps) {
  const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-200">
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 right-12 w-24 h-24 rounded-full bg-white/5 translate-y-1/2" />

      <div className="relative">
        <p className="text-sm font-medium text-blue-200">Saldo Total</p>
        <h2 className="mt-1 text-4xl font-bold tracking-tight">
          ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </h2>
        <p className="mt-1 text-xs text-blue-200">Actualizado hoy</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-blue-200 mb-1">
              <TrendingUp size={14} />
              <span className="text-xs font-medium">Ingresos</span>
            </div>
            <p className="text-lg font-bold">${monthlyIncome.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-blue-200 mb-1">
              <TrendingDown size={14} />
              <span className="text-xs font-medium">Gastos</span>
            </div>
            <p className="text-lg font-bold">${monthlyExpenses.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/20">
            <div
              className="h-1.5 rounded-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-blue-200">{savingsRate}% ahorrado</span>
        </div>
      </div>
    </div>
  );
}
