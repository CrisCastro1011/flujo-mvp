'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Budget, SavingsGoal, ShoppingList } from '@/lib/types';
import { mockTransactions, mockBudgets, mockSavingsGoals, mockShoppingLists, categoryMapping } from '@/lib/mockData';
import { useAuth } from './AuthContext';
import { hasValidConfig } from '@/lib/supabase';
import {
  getUserTransactions,
  getUserBudgets,
  getUserSavingsGoals,
  saveTransaction,
  saveBudget,
  updateBudgetInDB,
  saveSavingsGoal,
  deleteTransactionFromDB,
  deleteBudgetFromDB,
  deleteSavingsGoalFromDB,
  updateSavingsGoalInDB,
  getUserShoppingLists,
  saveShoppingList,
  updateShoppingListInDB,
  deleteShoppingListFromDB,
  saveShoppingListItems
} from '@/lib/supabaseFinance';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  shoppingLists: ShoppingList[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'userId'>) => Promise<void>;
  updateBudget: (id: string, budget: Omit<Budget, 'id' | 'userId'>) => Promise<void>;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId'>) => Promise<void>;
  updateSavingsGoal: (id: string, amount: number) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addShoppingList: (shoppingList: Omit<ShoppingList, 'id' | 'userId'>) => Promise<void>;
  updateShoppingList: (id: string, updates: Partial<Omit<ShoppingList, 'id' | 'userId'>>) => Promise<void>;
  deleteShoppingList: (id: string) => Promise<void>;
  budgetNotification: string | null;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetNotification, setBudgetNotification] = useState<string | null>(null);

  // Cargar datos cuando el usuario cambia
  useEffect(() => {
    if (!user) {
      // Usuario no autenticado: limpiar datos
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
      setShoppingLists([]);
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      
      if (!hasValidConfig) {
        // Modo demo: usar datos de prueba únicos por usuario
        if (user.id === 'demo-user') {
          // Agregar userId a los mock data para el usuario demo
          const demoTransactions = mockTransactions.map(t => ({ ...t, userId: user.id }));
          const demoBudgets = mockBudgets.map(b => ({ ...b, userId: user.id }));
          const demoSavingsGoals = mockSavingsGoals.map(g => ({ ...g, userId: user.id }));
          const demoShoppingLists = mockShoppingLists.map(s => ({ ...s, userId: user.id }));
          
          setTransactions(demoTransactions);
          setBudgets(demoBudgets);
          setSavingsGoals(demoSavingsGoals);
          setShoppingLists(demoShoppingLists);
        } else {
          // Usuario nuevo en modo demo: empezar con datos vacíos
          setTransactions([]);
          setBudgets([]);
          setSavingsGoals([]);
          setShoppingLists([]);
        }
      } else {
        // Modo producción: cargar datos de Supabase
        try {
          const [userTransactions, userBudgets, userSavingsGoals, userShoppingLists] = await Promise.all([
            getUserTransactions(user.id),
            getUserBudgets(user.id),
            getUserSavingsGoals(user.id),
            getUserShoppingLists(user.id)
          ]);
          
          setTransactions(userTransactions);
          setBudgets(userBudgets);
          setSavingsGoals(userSavingsGoals);
          setShoppingLists(userShoppingLists);
        } catch (error) {
          console.error('Error loading user data:', error);
          // En caso de error, inicializar con datos vacíos para nuevos usuarios
          setTransactions([]);
          setBudgets([]);
          setSavingsGoals([]);
          setShoppingLists([]);
        }
      }
      
      setLoading(false);
    };

    loadUserData();
  }, [user]);

  // Función auxiliar para actualizar presupuesto cuando se agrega/elimina una transacción
  const updateBudgetFromTransaction = async (transaction: Transaction, isAdd: boolean = true) => {
    if (transaction.type !== 'expense') return;

    let budgetUpdated = false;
    let updatedBudgetName = '';
    let categoryUpdated = '';
    let updatedBudgetForPersistence: Budget | null = null;

    const normalizedTransactionCategory = transaction.category.trim().toLowerCase();

    const fallbackActiveBudgetId = budgets.find(budget => budget.isActive)?.id ?? budgets[0]?.id;

    const nextBudgets = budgets.map(budget => {
      const matchesExplicitBudget = transaction.budgetId
        ? budget.id === transaction.budgetId
        : budget.id === fallbackActiveBudgetId;

      if (!matchesExplicitBudget) return budget;

      // Buscar categoría que coincida con la categoría de la transacción
      const updatedCategories = budget.categories.map(category => {
        const matchesExplicitCategory = Boolean(
          transaction.budgetCategoryId && category.id === transaction.budgetCategoryId
        );

        // Usar el mapeo de categorías para encontrar coincidencias
        const categoryMatches = Object.entries(categoryMapping).some(([budgetCategory, transactionCategories]) => {
          return category.name === budgetCategory &&
                 transactionCategories.includes(transaction.category);
        }) || category.name.trim().toLowerCase() === normalizedTransactionCategory;

        if (matchesExplicitCategory || categoryMatches) {
          budgetUpdated = true;
          updatedBudgetName = budget.name;
          categoryUpdated = category.name;
          return {
            ...category,
            used: Math.max(0, category.used + (isAdd ? transaction.amount : -transaction.amount))
          };
        }

        return category;
      });

      // Recalcular totales del presupuesto
      const totalSpent = updatedCategories.reduce((sum, cat) => sum + cat.used, 0);
      const remainingBalance = budget.maxIncome - totalSpent;

      // Determinar nuevo estado
      let newStatus: 'on-track' | 'warning' | 'exceeded' = 'on-track';
      if (totalSpent > budget.maxSpendingLimit) {
        newStatus = 'exceeded';
      } else if (totalSpent > budget.maxSpendingLimit * 0.8) {
        newStatus = 'warning';
      }

      const nextBudget: Budget = {
        ...budget,
        categories: updatedCategories,
        totalSpent,
        remainingBalance,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      updatedBudgetForPersistence = nextBudget;
      return nextBudget;
    });

    if (budgetUpdated) {
      setBudgets(nextBudgets);
    }

    if (budgetUpdated && hasValidConfig && updatedBudgetForPersistence) {
      const { id, userId, ...budgetPayload } = updatedBudgetForPersistence;
      const persistedBudget = await updateBudgetInDB(id, budgetPayload);

      if (persistedBudget) {
        setBudgets(prev => prev.map(item => item.id === id ? persistedBudget : item));
      }
    }

    // Mostrar notificación si se actualizó el presupuesto
    if (budgetUpdated) {
      const action = isAdd ? 'descontado' : 'reintegrado';
      setBudgetNotification(
        `💰 $${transaction.amount.toLocaleString()} ${action} ${isAdd ? 'del' : 'al'} presupuesto ${updatedBudgetName ? `"${updatedBudgetName}"` : ''}${categoryUpdated ? ` en ${categoryUpdated}` : ''}`.trim()
      );
      // Limpiar notificación después de 4 segundos
      setTimeout(() => setBudgetNotification(null), 4000);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    
    const transactionWithUser = {
      ...transaction,
      userId: user.id
    };

    if (hasValidConfig) {
      // Modo producción: guardar en Supabase
      const savedTransaction = await saveTransaction(transactionWithUser);
      if (savedTransaction) {
        setTransactions(prev => [savedTransaction, ...prev]);
        // Actualizar presupuesto si es un gasto
        await updateBudgetFromTransaction(savedTransaction, true);
      }
    } else {
      // Modo demo: solo actualizar estado local
      const newTransaction: Transaction = {
        ...transactionWithUser,
        id: Date.now().toString(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
      // Actualizar presupuesto si es un gasto
      await updateBudgetFromTransaction(newTransaction, true);
    }
  };

  const deleteTransaction = async (id: string) => {
    // Encontrar la transacción antes de eliminarla para actualizar el presupuesto
    const transactionToDelete = transactions.find(t => t.id === id);
    
    if (hasValidConfig) {
      const success = await deleteTransactionFromDB(id);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        // Restar del presupuesto si era un gasto
        if (transactionToDelete) {
          await updateBudgetFromTransaction(transactionToDelete, false);
        }
      }
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
      // Restar del presupuesto si era un gasto
      if (transactionToDelete) {
        await updateBudgetFromTransaction(transactionToDelete, false);
      }
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'userId'>) => {
    if (!user) return;
    
    const budgetWithUser = {
      ...budget,
      userId: user.id
    };

    if (hasValidConfig) {
      const savedBudget = await saveBudget(budgetWithUser);
      if (savedBudget) {
        setBudgets(prev => [...prev, savedBudget]);
      }
    } else {
      const newBudget: Budget = {
        ...budgetWithUser,
        id: Date.now().toString(),
      };
      setBudgets(prev => [...prev, newBudget]);
    }
  };

  const deleteBudget = async (id: string) => {
    if (hasValidConfig) {
      const success = await deleteBudgetFromDB(id);
      if (success) {
        setBudgets(prev => prev.filter(b => b.id !== id));
      }
    } else {
      setBudgets(prev => prev.filter(b => b.id !== id));
    }
  };

  const updateBudget = async (id: string, budget: Omit<Budget, 'id' | 'userId'>) => {
    if (hasValidConfig) {
      const updatedBudget = await updateBudgetInDB(id, budget);
      if (updatedBudget) {
        setBudgets(prev => prev.map(item => item.id === id ? updatedBudget : item));
      }
    } else {
      setBudgets(prev => prev.map(item => item.id === id ? {
        ...item,
        ...budget,
        updatedAt: budget.updatedAt
      } : item));
    }
  };

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'userId'>) => {
    if (!user) return;
    
    const goalWithUser = {
      ...goal,
      userId: user.id
    };

    if (hasValidConfig) {
      const savedGoal = await saveSavingsGoal(goalWithUser);
      if (savedGoal) {
        setSavingsGoals(prev => [...prev, savedGoal]);
      }
    } else {
      const newGoal: SavingsGoal = {
        ...goalWithUser,
        id: Date.now().toString(),
      };
      setSavingsGoals(prev => [...prev, newGoal]);
    }
  };

  const updateSavingsGoal = async (id: string, amount: number) => {
    const goal = savingsGoals.find(g => g.id === id);
    if (!goal) return;

    const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);

    if (hasValidConfig) {
      const success = await updateSavingsGoalInDB(id, newAmount);
      if (success) {
        setSavingsGoals(prev =>
          prev.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g)
        );
      }
    } else {
      setSavingsGoals(prev =>
        prev.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g)
      );
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    if (hasValidConfig) {
      const success = await deleteSavingsGoalFromDB(id);
      if (success) {
        setSavingsGoals(prev => prev.filter(g => g.id !== id));
      }
    } else {
      setSavingsGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  // Shopping Lists functions
  const addShoppingList = async (shoppingList: Omit<ShoppingList, 'id' | 'userId'>) => {
    if (!user) return;
    
    const shoppingListWithUser = {
      ...shoppingList,
      userId: user.id
    };

    if (hasValidConfig) {
      // Modo producción: guardar en Supabase
      const savedShoppingList = await saveShoppingList(shoppingListWithUser);
      if (savedShoppingList) {
        setShoppingLists(prev => [...prev, savedShoppingList]);
      }
    } else {
      // Modo demo: solo actualizar estado local
      const newShoppingList: ShoppingList = {
        ...shoppingListWithUser,
        id: Date.now().toString(),
      };
      setShoppingLists(prev => [...prev, newShoppingList]);
    }
  };

  const updateShoppingList = async (id: string, updates: Partial<Omit<ShoppingList, 'id' | 'userId'>>) => {
    if (hasValidConfig) {
      // Actualizar en Supabase
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.totalItems !== undefined) dbUpdates.totalItems = updates.totalItems;
      if (updates.completedItems !== undefined) dbUpdates.completedItems = updates.completedItems;
      if (updates.updatedAt !== undefined) dbUpdates.updatedAt = updates.updatedAt;

      const success = await updateShoppingListInDB(id, dbUpdates);
      
      if (success && updates.items) {
        // También actualizar los items si se proporcionaron
        await saveShoppingListItems(id, updates.items);
      }
      
      if (success) {
        setShoppingLists(prev =>
          prev.map(list => list.id === id ? { ...list, ...updates } : list)
        );
      }
    } else {
      // Modo demo: solo actualizar estado local
      setShoppingLists(prev =>
        prev.map(list => list.id === id ? { ...list, ...updates } : list)
      );
    }
  };

  const deleteShoppingList = async (id: string) => {
    if (hasValidConfig) {
      const success = await deleteShoppingListFromDB(id);
      if (success) {
        setShoppingLists(prev => prev.filter(list => list.id !== id));
      }
    } else {
      // Modo demo: solo actualizar estado local
      setShoppingLists(prev => prev.filter(list => list.id !== id));
    }
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      savingsGoals,
      shoppingLists,
      loading,
      addTransaction,
      addBudget,
      updateBudget,
      addSavingsGoal,
      updateSavingsGoal,
      deleteBudget,
      deleteSavingsGoal,
      deleteTransaction,
      addShoppingList,
      updateShoppingList,
      deleteShoppingList,
      budgetNotification,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
