'use client';

import Link from 'next/link';
import { Transaction } from '@/lib/types';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Transacciones Recientes</h3>
          <p className="text-xs text-slate-400 mt-0.5">Actividad reciente</p>
        </div>
        <Link
          href="/transactions"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors"
        >
          Ver todo <ChevronRight size={13} />
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {recent.map((t) => (
          <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              t.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              {t.type === 'income'
                ? <ArrowUpRight size={16} className="text-emerald-600" />
                : <ArrowDownRight size={16} className="text-red-500" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{t.description}</p>
              <p className="text-xs text-slate-400">{t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
            <span className={`text-sm font-semibold flex-shrink-0 ${
              t.type === 'income' ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {recent.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-slate-400">Sin transacciones aún</p>
        </div>
      )}
    </div>
  );
}
