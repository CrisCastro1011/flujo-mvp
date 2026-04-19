'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { TransactionType } from '@/lib/types';
import { getMonthlyIncome, getMonthlyExpenses } from '@/lib/mockData';
import TransactionItem from '@/components/transactions/TransactionItem';
import TransactionFilter from '@/components/transactions/TransactionFilter';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';

type FilterType = 'all' | TransactionType;

export default function TransactionsPage() {
  const { transactions, loading } = useFinance();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultType, setDefaultType] = useState<TransactionType>('expense');

  const filtered = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = search === '' ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: transactions.length,
    income: transactions.filter(t => t.type === 'income').length,
    expense: transactions.filter(t => t.type === 'expense').length,
  };

  const income = getMonthlyIncome(transactions);
  const expenses = getMonthlyExpenses(transactions);

  const openModal = (type: TransactionType) => {
    setDefaultType(type);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Cargando transacciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Transacciones</h1>
          <p className="text-sm text-slate-400 mt-0.5">{transactions.length} registros este mes</p>
        </div>
        <button
          onClick={() => openModal('expense')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={16} />
          Agregar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Ingresos Totales</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">${income.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Gastos Totales</p>
          <p className="text-xl font-bold text-red-500 mt-0.5">${expenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar transacciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        <TransactionFilter
          activeFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {filtered.map(t => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm font-medium">No se encontraron transacciones</p>
            <p className="text-slate-300 text-xs mt-1">Intenta ajustar tus filtros o búsqueda</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => openModal('income')}
          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-sm hover:bg-emerald-600 transition-all"
        >
          + Agregar Ingreso
        </button>
        <button
          onClick={() => openModal('expense')}
          className="flex-1 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold shadow-sm hover:bg-slate-900 transition-all"
        >
          + Agregar Gasto
        </button>
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={defaultType}
      />
    </div>
  );
}
