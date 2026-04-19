'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { expenseCategories } from '@/lib/mockData';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorOptions = [
  '#3B82F6', '#10B981', '#F97316', '#14B8A6', '#EC4899', '#F59E0B', '#EF4444', '#64748B'
];

const categoryIconMap: Record<string, string> = {
  'Rent': 'Home',
  'Groceries': 'ShoppingCart',
  'Dining': 'Utensils',
  'Transport': 'Car',
  'Entertainment': 'Tv',
  'Health': 'Heart',
};

export default function AddBudgetModal({ isOpen, onClose }: AddBudgetModalProps) {
  const { addBudget } = useFinance();
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [color, setColor] = useState(colorOptions[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limit) return;
    
    try {
      await addBudget({
        category,
        limit: parseFloat(limit),
        used: 0,
        color,
        icon: categoryIconMap[category] || 'Wallet',
      });
      setCategory('');
      setLimit('');
      setColor(colorOptions[0]);
      onClose();
    } catch (error) {
      console.error('Error adding budget:', error);
      // Aquí podrías mostrar un toast de error al usuario
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Create Budget</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X size={16} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              <option value="">Select category</option>
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Monthly Limit ($)</label>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Color</label>
            <div className="flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all duration-150 ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all mt-2"
          >
            Create Budget
          </button>
        </form>
      </div>
    </div>
  );
}
