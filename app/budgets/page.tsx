'use client';

import { useState } from 'react';
import { Plus, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import BudgetCard from '@/components/budgets/BudgetCard';
import AddBudgetModal from '@/components/budgets/AddBudgetModal';

export default function BudgetsPage() {
  const { budgets, loading } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalUsed = budgets.reduce((sum, b) => sum + b.used, 0);
  const overBudget = budgets.filter(b => b.used > b.limit);
  const onTrack = budgets.filter(b => b.used <= b.limit);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Cargando presupuestos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Presupuestos</h1>
          <p className="text-sm text-slate-400 mt-0.5">Controla tus límites de gastos mensuales</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={16} />
          Nuevo Presupuesto
        </button>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 font-medium">Presupuesto Mensual Total</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">${totalUsed.toLocaleString()}</span>
              <span className="text-sm text-slate-400">/ ${totalLimit.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3">
              {overBudget.length > 0 && (
                <div className="flex items-center gap-1.5 text-red-500">
                  <AlertTriangle size={14} />
                  <span className="text-xs font-semibold">{overBudget.length} excedido</span>
                </div>
              )}
              {onTrack.length > 0 && (
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle size={14} />
                  <span className="text-xs font-semibold">{onTrack.length} en orden</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${totalUsed > totalLimit ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min((totalUsed / totalLimit) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-400">{Math.round((totalUsed / totalLimit) * 100)}% usado</span>
          <span className="text-xs text-slate-400">${(totalLimit - totalUsed).toLocaleString()} disponible</span>
        </div>
      </div>

      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {budgets.map(budget => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Plus size={20} className="text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Sin presupuestos aún</p>
          <p className="text-xs text-slate-400 mt-1">Crea tu primer presupuesto para comenzar a rastrear</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
          >
            Crear Presupuesto
          </button>
        </div>
      )}

      <AddBudgetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
