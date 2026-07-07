'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { useCategories } from '@/context/CategoriesContext';
import { TransactionType } from '@/lib/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

export default function AddTransactionModal({ isOpen, onClose, defaultType = 'expense' }: AddTransactionModalProps) {
  const { addTransaction, budgets } = useFinance();
  const { incomeCategories, expenseCategories } = useCategories();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [selectedBudgetId, setSelectedBudgetId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const activeBudgets = useMemo(
    () => budgets.filter(budget => budget.isActive),
    [budgets]
  );

  const selectedBudget = useMemo(
    () => activeBudgets.find(budget => budget.id === selectedBudgetId) || null,
    [activeBudgets, selectedBudgetId]
  );

  const categories = type === 'income'
    ? incomeCategories
    : selectedBudget?.categories.length
      ? selectedBudget.categories.map(category => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          type: 'expense' as const,
          userId: '',
          isDefault: false,
        }))
      : expenseCategories;

  useEffect(() => {
    if (type !== 'expense') {
      setSelectedBudgetId('');
      return;
    }

    if (activeBudgets.length === 1) {
      setSelectedBudgetId(activeBudgets[0].id);
    }
  }, [type, activeBudgets]);

  useEffect(() => {
    if (!category) return;

    const categoryStillExists = categories.some(cat => cat.name === category);
    if (!categoryStillExists) {
      setCategory('');
    }
  }, [categories, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) return;

    const selectedBudgetCategory = selectedBudget?.categories.find(
      budgetCategory => budgetCategory.name === category
    );
    
    try {
      await addTransaction({
        amount: parseFloat(amount),
        type,
        category,
        budgetId: type === 'expense' && selectedBudget ? selectedBudget.id : undefined,
        budgetCategoryId: type === 'expense' && selectedBudgetCategory ? selectedBudgetCategory.id : undefined,
        description,
        date,
      });
      setAmount('');
      setCategory('');
      setSelectedBudgetId(activeBudgets.length === 1 ? activeBudgets[0].id : '');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Aquí podrías mostrar un toast de error al usuario
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Agregar Transacción</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X size={16} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4">

        <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              type === 'expense'
                ? 'bg-white text-red-500 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              type === 'income'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Ingreso
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'expense' && activeBudgets.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                Presupuesto
              </label>
              <select
                value={selectedBudgetId}
                onChange={(e) => setSelectedBudgetId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ios-input-fix"
              >
                <option value="">No afectar presupuesto</option>
                {activeBudgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>{budget.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1.5">
                Si eliges un presupuesto, el gasto se descuenta de esa categoría exacta.
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Cantidad
            </label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ios-input-fix"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ios-input-fix"
            >
              <option value="">
                {selectedBudget ? 'Selecciona una categoría del presupuesto' : 'Selecciona una categoría'}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Descripción
            </label>
            <input
              type="text"
              placeholder="¿Para qué fue?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ios-input-fix"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ios-input-fix"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-md mt-2 ${
              type === 'income'
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            Guardar Transacción
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
