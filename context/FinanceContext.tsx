'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Budget, SavingsGoal } from '@/lib/types';
import { mockTransactions, mockBudgets, mockSavingsGoals } from '@/lib/mockData';
import { useAuth } from './AuthContext';
import { hasValidConfig } from '@/lib/supabase';
import {
  getUserTransactions,
  getUserBudgets,
  getUserSavingsGoals,
  saveTransaction,
  saveBudget,
  saveSavingsGoal,
  deleteTransactionFromDB,
  deleteBudgetFromDB,
  deleteSavingsGoalFromDB,
  updateSavingsGoalInDB
} from '@/lib/supabaseFinance';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'userId'>) => Promise<void>;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId'>) => Promise<void>;
  updateSavingsGoal: (id: string, amount: number) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos cuando el usuario cambia
  useEffect(() => {
    if (!user) {
      // Usuario no autenticado: limpiar datos
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
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
          
          setTransactions(demoTransactions);
          setBudgets(demoBudgets);
          setSavingsGoals(demoSavingsGoals);
        } else {
          // Usuario nuevo en modo demo: empezar con datos vacíos
          setTransactions([]);
          setBudgets([]);
          setSavingsGoals([]);
        }
      } else {
        // Modo producción: cargar datos de Supabase
        try {
          const [userTransactions, userBudgets, userSavingsGoals] = await Promise.all([
            getUserTransactions(user.id),
            getUserBudgets(user.id),
            getUserSavingsGoals(user.id)
          ]);
          
          setTransactions(userTransactions);
          setBudgets(userBudgets);
          setSavingsGoals(userSavingsGoals);
        } catch (error) {
          console.error('Error loading user data:', error);
          // En caso de error, inicializar con datos vacíos para nuevos usuarios
          setTransactions([]);
          setBudgets([]);
          setSavingsGoals([]);
        }
      }
      
      setLoading(false);
    };

    loadUserData();
  }, [user]);

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
      }
    } else {
      // Modo demo: solo actualizar estado local
      const newTransaction: Transaction = {
        ...transactionWithUser,
        id: Date.now().toString(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (hasValidConfig) {
      const success = await deleteTransactionFromDB(id);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
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

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      savingsGoals,
      loading,
      addTransaction,
      addBudget,
      addSavingsGoal,
      updateSavingsGoal,
      deleteBudget,
      deleteSavingsGoal,
      deleteTransaction,
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
