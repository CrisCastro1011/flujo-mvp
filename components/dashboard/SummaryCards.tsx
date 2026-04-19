'use client';

import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  income: number;
  expenses: number;
  remaining: number;
}

export default function SummaryCards({ income, expenses, remaining }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Ingresos Totales',
      value: income,
      icon: ArrowUpRight,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-600',
      trend: '+8.2% vs mes anterior',
      trendPositive: true,
    },
    {
      label: 'Gastos Totales',
      value: expenses,
      icon: ArrowDownRight,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      valueColor: 'text-red-500',
      trend: '+3.1% vs mes anterior',
      trendPositive: false,
    },
    {
      label: 'Disponible',
      value: remaining,
      icon: Wallet,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      valueColor: 'text-slate-900',
      trend: 'Disponible para gastar',
      trendPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <Icon size={18} className={card.iconColor} />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.valueColor}`}>
              ${card.value.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
            <p className={`text-xs mt-1.5 ${card.trendPositive ? 'text-slate-400' : 'text-red-400'}`}>
              {card.trend}
            </p>
          </div>
        );
      })}
    </div>
  );
}
