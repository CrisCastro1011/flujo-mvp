'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Budget, BudgetCategory, Transaction } from '@/lib/types';
import { useAuth } from './AuthContext';
import { hasValidConfig } from '@/lib/supabase';

interface EnhancedBudgetContextType {
  budgets: Budget[];
  loading: boolean;
  addBudget: (budget: Omit<Budget, 'id' | 'userId'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  updateCategorySpending: (budgetId: string, categoryName: string, amount: number) => Promise<void>;
  getBudgetProgress: (budgetId: string) => {
    totalUsed: number;
    totalLimit: number;
    remainingBudget: number;
    overBudgetCategories: BudgetCategory[];
    onTrackCategories: BudgetCategory[];
    isOverBudget: boolean;
  };
}

const EnhancedBudgetContext = createContext<EnhancedBudgetContextType | undefined>(undefined);

export function EnhancedBudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos cuando el usuario cambia
  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    const loadUserBudgets = async () => {
      setLoading(true);
      
      if (!hasValidConfig) {
        // Modo demo: usar datos de prueba
        const demoBudgets: Budget[] = [
          {
            id: '1',
            userId: user.id,
            name: 'Presupuesto Abril 2026',
            totalIncome: 45000,
            allocatedAmount: 40000,
            savingsAmount: 5000,
            categories: [
              {
                id: 'cat1',
                budgetId: '1',
                category: 'Alquiler',
                limit: 12000,
                used: 12000,
                color: '#3B82F6',
                icon: 'Home'
              },
              {
                id: 'cat2',
                budgetId: '1',
                category: 'Comestibles',
                limit: 8000,
                used: 6500,
                color: '#10B981',
                icon: 'ShoppingCart'
              },
              {
                id: 'cat3',
                budgetId: '1',
                category: 'Transporte',
                limit: 4000,
                used: 3200,
                color: '#F97316',
                icon: 'Car'
              },
              {
                id: 'cat4',
                budgetId: '1',
                category: 'Entretenimiento',
                limit: 3000,
                used: 2800,
                color: '#EC4899',
                icon: 'Tv'
              },
              {
                id: 'cat5',
                budgetId: '1',
                category: 'Servicios',
                limit: 5000,
                used: 4200,
                color: '#14B8A6',
                icon: 'Wallet'
              }
            ],
            color: '#3B82F6',
            icon: 'Wallet',
            createdAt: '2026-04-01T00:00:00Z',
            updatedAt: '2026-04-29T00:00:00Z'
          }
        ];
        
        setBudgets(demoBudgets);
      } else {
        // TODO: Modo producción - cargar de Supabase
        setBudgets([]);
      }
      
      setLoading(false);
    };

    loadUserBudgets();
  }, [user]);

  const addBudget = async (budgetData: Omit<Budget, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newBudget: Budget = {
      ...budgetData,
      id: Date.now().toString(),
      userId: user.id,
      categories: budgetData.categories.map((cat, index) => ({
        ...cat,
        id: `${Date.now()}_${index}`,
        budgetId: Date.now().toString()
      }))
    };

    if (!hasValidConfig) {
      // Modo demo: solo actualizar estado local
      setBudgets(prev => [...prev, newBudget]);
    } else {
      // TODO: Modo producción - guardar en Supabase
      setBudgets(prev => [...prev, newBudget]);
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    if (!hasValidConfig) {
      // Modo demo: solo actualizar estado local
      setBudgets(prev => 
        prev.map(budget => 
          budget.id === id 
            ? { ...budget, ...updates, updatedAt: new Date().toISOString() }
            : budget
        )
      );
    } else {
      // TODO: Modo producción - actualizar en Supabase
      setBudgets(prev => 
        prev.map(budget => 
          budget.id === id 
            ? { ...budget, ...updates, updatedAt: new Date().toISOString() }
            : budget
        )
      );
    }
  };

  const deleteBudget = async (id: string) => {
    if (!hasValidConfig) {
      // Modo demo: solo actualizar estado local
      setBudgets(prev => prev.filter(budget => budget.id !== id));
    } else {
      // TODO: Modo producción - eliminar de Supabase
      setBudgets(prev => prev.filter(budget => budget.id !== id));
    }
  };

  const updateCategorySpending = async (budgetId: string, categoryName: string, amount: number) => {
    setBudgets(prev => 
      prev.map(budget => {
        if (budget.id !== budgetId) return budget;
        
        return {
          ...budget,
          categories: budget.categories.map(category => 
            category.category === categoryName
              ? { ...category, used: category.used + amount }
              : category
          ),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const getBudgetProgress = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    
    if (!budget) {
      return {
        totalUsed: 0,
        totalLimit: 0,
        remainingBudget: 0,
        overBudgetCategories: [],
        onTrackCategories: [],
        isOverBudget: false
      };
    }

    const totalUsed = budget.categories.reduce((sum, cat) => sum + cat.used, 0);
    const totalLimit = budget.categories.reduce((sum, cat) => sum + cat.limit, 0);
    const remainingBudget = budget.allocatedAmount - totalUsed;
    const overBudgetCategories = budget.categories.filter(cat => cat.used > cat.limit);
    const onTrackCategories = budget.categories.filter(cat => cat.used <= cat.limit);
    const isOverBudget = totalUsed > budget.allocatedAmount;

    return {
      totalUsed,
      totalLimit,
      remainingBudget,
      overBudgetCategories,
      onTrackCategories,
      isOverBudget
    };
  };

  return (
    <EnhancedBudgetContext.Provider value={{
      budgets,
      loading,
      addBudget,
      updateBudget,
      deleteBudget,
      updateCategorySpending,
      getBudgetProgress,
    }}>
      {children}
    </EnhancedBudgetContext.Provider>
  );
}

export function useEnhancedBudgets() {
  const context = useContext(EnhancedBudgetContext);
  if (context === undefined) {
    throw new Error('useEnhancedBudgets must be used within an EnhancedBudgetProvider');
  }
  return context;
}