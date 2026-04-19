'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import SavingsGoalCard from '@/components/savings/SavingsGoalCard';
import AddSavingsGoalModal from '@/components/savings/AddSavingsGoalModal';

export default function SavingsPage() {
  const { savingsGoals, loading } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completedGoals = savingsGoals.filter(g => g.currentAmount >= g.targetAmount).length;
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Cargando metas de ahorro...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Metas de Ahorro</h1>
          <p className="text-sm text-slate-400 mt-0.5">Sigue tus objetivos financieros</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={16} />
          Nueva Meta
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-slate-900">{savingsGoals.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total de Metas</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-600">{completedGoals}</p>
          <p className="text-xs text-slate-400 mt-0.5">Completadas</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{overallProgress}%</p>
          <p className="text-xs text-slate-400 mt-0.5">General</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Ahorrado</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">${totalSaved.toLocaleString()}</span>
              <span className="text-sm text-slate-400">/ ${totalTarget.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-3xl font-bold text-blue-600">{overallProgress}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-3 bg-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          ${(totalTarget - totalSaved).toLocaleString()} falta para alcanzar todas tus metas
        </p>
      </div>

      {savingsGoals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savingsGoals.map(goal => (
            <SavingsGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Plus size={20} className="text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Sin metas de ahorro aún</p>
          <p className="text-xs text-slate-400 mt-1">Establece una meta para comenzar a ahorrar</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
          >
            Crear Meta
          </button>
        </div>
      )}

      <AddSavingsGoalModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
