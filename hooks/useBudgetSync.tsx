'use client';

import { useEffect } from 'react';
import { useEnhancedBudgets } from '@/context/EnhancedBudgetContext';
import { useFinance } from '@/context/FinanceContext';

/**
 * Hook para sincronizar automáticamente las transacciones con los presupuestos
 */
export function useBudgetSync() {
  const { budgets, updateCategorySpending } = useEnhancedBudgets();
  const { transactions } = useFinance();

  useEffect(() => {
    // Recalcular gastos por categoría para todos los presupuestos
    const syncBudgets = async () => {
      if (budgets.length === 0 || transactions.length === 0) return;

      // Agrupar transacciones de gastos por categoría en el mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyExpenses: Record<string, number> = {};
      
      transactions
        .filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (
            transaction.type === 'expense' &&
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        })
        .forEach(transaction => {
          const category = transaction.category;
          if (!monthlyExpenses[category]) {
            monthlyExpenses[category] = 0;
          }
          monthlyExpenses[category] += transaction.amount;
        });

      // Actualizar cada presupuesto con los gastos calculados
      for (const budget of budgets) {
        for (const category of budget.categories) {
          const totalSpent = monthlyExpenses[category.category] || 0;
          
          // Solo actualizar si hay diferencia
          if (category.used !== totalSpent) {
            // Resetear y actualizar con el nuevo total
            const difference = totalSpent - category.used;
            if (difference !== 0) {
              await updateCategorySpending(budget.id, category.category, difference);
            }
          }
        }
      }
    };

    syncBudgets();
  }, [transactions, budgets, updateCategorySpending]);
}

/**
 * Componente wrapper que aplica la sincronización automática
 */
export default function BudgetSyncWrapper({ children }: { children: React.ReactNode }) {
  useBudgetSync();
  return <>{children}</>;
}