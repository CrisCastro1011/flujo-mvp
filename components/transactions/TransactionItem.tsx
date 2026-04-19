'use client';

import { Transaction } from '@/lib/types';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction: t }: TransactionItemProps) {
  const { deleteTransaction } = useFinance();

  return (
    <div className="flex items-center gap-3.5 px-5 py-4 hover:bg-slate-50/70 transition-colors group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        t.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'
      }`}>
        {t.type === 'income'
          ? <ArrowUpRight size={18} className="text-emerald-600" />
          : <ArrowDownRight size={18} className="text-red-500" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{t.description}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            t.type === 'income'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {t.category}
          </span>
          <span className="text-xs text-slate-400">
            {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold flex-shrink-0 ${
          t.type === 'income' ? 'text-emerald-600' : 'text-red-500'
        }`}>
          {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </span>
        <button
          onClick={async () => {
            try {
              await deleteTransaction(t.id);
            } catch (error) {
              console.error('Error deleting transaction:', error);
            }
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}
