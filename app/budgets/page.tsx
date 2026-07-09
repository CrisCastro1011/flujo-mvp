'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, TrendingUp, Clock, Target } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import BudgetCard from '@/components/budgets/BudgetCard';
import CreateBudgetModal from '@/components/budgets/CreateBudgetModal';
import { Budget } from '@/lib/types';

export default function BudgetsPage() {
  const { budgets, loading, deleteBudget } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Fallback: si no hay activo explícito, usar el primero disponible.
  const activeBudgets = budgets.filter((b: Budget) => b.isActive);
  const currentBudget = activeBudgets.length > 0 ? activeBudgets[0] : budgets[0] || null;

  // Calcular estadísticas del presupuesto actual
  const getTotalSpent = (budget: Budget) => {
    return budget.categories.reduce((sum, cat) => sum + cat.used, 0);
  };

  const getProgressPercentage = (used: number, limit: number) => {
    return limit > 0 ? (used / limit) * 100 : 0;
  };

  const getBudgetStatus = (budget: Budget) => {
    const totalSpent = getTotalSpent(budget);
    const percentage = getProgressPercentage(totalSpent, budget.maxSpendingLimit);
    
    if (percentage > 100) return { status: 'exceeded', color: 'red', text: 'Límite Superado' };
    if (percentage > 80) return { status: 'warning', color: 'yellow', text: 'Cerca del límite' };
    return { status: 'on-track', color: 'green', text: 'Vas bien' };
  };

  const handleCreateBudget = () => {
    setEditingBudget(null);
    setModalOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBudget(null);
  };

  const handleDeleteBudget = async (budget: Budget) => {
    const confirmed = window.confirm(`¿Eliminar el presupuesto "${budget.name}"?`);
    if (!confirmed) return;

    try {
      await deleteBudget(budget.id);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
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
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Presupuestos</h1>
          <p className="text-slate-500 mt-1">Control real de tus finanzas basado en tu ciclo de cobro</p>
        </div>
        <button
          onClick={handleCreateBudget}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={16} />
          Crear Presupuesto
        </button>
      </div>

      {currentBudget ? (
        <>
          {/* Presupuesto Actual - Cards principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Ingreso Total */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <span className="text-blue-100 text-sm font-medium">Ingreso Total</span>
              </div>
              <div className="text-2xl font-bold">${currentBudget.maxIncome.toLocaleString()}</div>
            </div>

            {/* Total Gastado */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <Target size={18} className="text-red-500" />
                </div>
                <span className="text-slate-500 text-sm font-medium">Total Gastado</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                ${getTotalSpent(currentBudget).toLocaleString()}
              </div>
            </div>

            {/* Saldo Restante */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle size={18} className="text-green-500" />
                </div>
                <span className="text-slate-500 text-sm font-medium">Saldo Restante</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                ${(currentBudget.maxIncome - getTotalSpent(currentBudget)).toLocaleString()}
              </div>
            </div>

            {/* Días hasta próximo cobro */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Clock size={18} className="text-purple-500" />
                </div>
                <span className="text-slate-500 text-sm font-medium">Hasta próximo sueldo</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {currentBudget.daysUntilNext} días
              </div>
            </div>
          </div>

          {/* Estado del Presupuesto */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Estado del Presupuesto</h3>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getBudgetStatus(currentBudget);
                  return (
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      status.color === 'green' ? 'bg-green-50 text-green-700' :
                      status.color === 'yellow' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {status.text}
                    </div>
                  );
                })()}
                <button
                  onClick={() => handleEditBudget(currentBudget)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  aria-label={`Editar ${currentBudget.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteBudget(currentBudget)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  aria-label={`Eliminar ${currentBudget.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Barra de progreso total */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Progreso Total del Presupuesto</span>
                <span className="text-sm text-slate-500">
                  {Math.round(getProgressPercentage(getTotalSpent(currentBudget), currentBudget.maxSpendingLimit))}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    getBudgetStatus(currentBudget).color === 'green' ? 'bg-green-500' :
                    getBudgetStatus(currentBudget).color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(getProgressPercentage(getTotalSpent(currentBudget), currentBudget.maxSpendingLimit), 100)}%` 
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-slate-500">
                <span>${getTotalSpent(currentBudget).toLocaleString()} gastado</span>
                <span>${(currentBudget.maxSpendingLimit - getTotalSpent(currentBudget)).toLocaleString()} disponible</span>
              </div>
            </div>

            {/* Dinero restante hasta próximo sueldo */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-semibold">
                    Te quedan ${(currentBudget.maxIncome - getTotalSpent(currentBudget)).toLocaleString()}
                  </p>
                  <p className="text-blue-600 text-sm">hasta tu próximo sueldo en {currentBudget.daysUntilNext} días</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Progreso por Categorías */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Progreso por Categoría</h3>
            <div className="space-y-4">
              {currentBudget.categories.map((category) => {
                const percentage = getProgressPercentage(category.used, category.limit);
                return (
                  <div key={category.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: category.color }}
                        >
                          💰
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{category.name}</h4>
                          <p className="text-sm text-slate-500">
                            ${category.used.toLocaleString()} / ${category.limit.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${
                          percentage > 100 ? 'text-red-600' :
                          percentage > 80 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {Math.round(percentage)}% usado
                        </div>
                        <div className="text-xs text-slate-500">
                          ${(category.limit - category.used).toLocaleString()} disponible
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage > 100 ? 'bg-red-500' :
                          percentage > 80 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de todos los presupuestos */}
          {budgets.length > 1 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Todos los Presupuestos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map(budget => (
                  <BudgetCard key={budget.id} budget={budget} onEdit={handleEditBudget} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Estado sin presupuestos */
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border border-blue-100">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
            <Target size={32} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">¡Comienza tu control financiero!</h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Crea tu primer presupuesto personalizado basado en tu ciclo real de cobro. 
            Controla tus gastos de manera inteligente.
          </p>
          <button
            onClick={handleCreateBudget}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Crear Mi Primer Presupuesto
          </button>
        </div>
      )}

      <CreateBudgetModal isOpen={modalOpen} onClose={handleCloseModal} initialBudget={editingBudget} />
    </div>
  );
}
