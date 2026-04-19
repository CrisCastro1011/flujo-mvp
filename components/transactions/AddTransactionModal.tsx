'use client';

import { useState } from 'react';
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
  const { addTransaction } = useFinance();
  const { incomeCategories, expenseCategories } = useCategories();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) return;
    
    try {
      await addTransaction({
        amount: parseFloat(amount),
        type,
        category,
        description,
        date,
      });
      setAmount('');
      setCategory('');
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
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Agregar Transacción</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={16} className="text-slate-600" />
          </button>
        </div>

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
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="">Selecciona una categoría</option>
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
  );
}
