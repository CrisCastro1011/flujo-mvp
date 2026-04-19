'use client';

import { useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { getMonthlyIncome, getMonthlyExpenses, getSpendingByCategory } from '@/lib/mockData';
import BalanceCard from '@/components/dashboard/BalanceCard';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SpendingChart from '@/components/dashboard/SpendingChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import { TransactionType } from '@/lib/types';

export default function DashboardPage() {
  const { transactions, loading } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultType, setDefaultType] = useState<TransactionType>('expense');

  const income = getMonthlyIncome(transactions);
  const expenses = getMonthlyExpenses(transactions);
  const balance = income - expenses;
  const spendingData = getSpendingByCategory(transactions);

  const openModal = (type: TransactionType) => {
    setDefaultType(type);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Panel</h1>
          <p className="text-sm text-slate-400 mt-0.5">¡Bienvenido! Aquí está tu resumen.</p>
        </div>
        <button
          onClick={() => openModal('expense')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={16} />
          Agregar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <BalanceCard
            totalBalance={balance}
            monthlyIncome={income}
            monthlyExpenses={expenses}
          />

          <SummaryCards
            income={income}
            expenses={expenses}
            remaining={balance}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => openModal('income')}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95"
            >
              <TrendingUp size={16} />
              Agregar Ingreso
            </button>
            <button
              onClick={() => openModal('expense')}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-800 text-white text-sm font-semibold shadow-md shadow-slate-300 hover:bg-slate-900 transition-all active:scale-95"
            >
              <Plus size={16} />
              Agregar Gasto
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-5">
          <SpendingChart data={spendingData} />
        </div>
      </div>

      <div className="mt-5">
        <RecentTransactions transactions={transactions} />
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={defaultType}
      />
    </div>
  );
}
