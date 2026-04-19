'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, TransactionType } from '@/lib/types';
import { useAuth } from './AuthContext';
import { hasValidConfig } from '@/lib/supabase';
import {
  getUserCategories,
  saveCategory,
  deleteCategoryFromDB,
  initializeDefaultCategories
} from '@/lib/supabaseFinance';

interface CategoriesContextType {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  loading: boolean;
  addCategory: (category: Omit<Category, 'id' | 'userId'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  // Cargar categorías cuando el usuario cambia
  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    loadUserCategories();
  }, [user]);

  const loadUserCategories = async () => {
    if (!user) return;
    
    setLoading(true);
    
    if (hasValidConfig) {
      // Modo producción: cargar de Supabase
      try {
        let userCategories = await getUserCategories(user.id);
        
        // Si no tiene categorías, inicializar con las por defecto
        if (userCategories.length === 0) {
          const success = await initializeDefaultCategories(user.id);
          if (success) {
            userCategories = await getUserCategories(user.id);
          }
        }
        
        setCategories(userCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // En caso de error, cargar categorías por defecto localmente
        setCategories(await getUserCategories(user.id));
      }
    } else {
      // Modo demo: usar categorías por defecto
      const demoCategories = await getUserCategories(user.id);
      setCategories(demoCategories);
    }
    
    setLoading(false);
  };

  const addCategory = async (category: Omit<Category, 'id' | 'userId'>) => {
    if (!user) return;
    
    const categoryWithUser = {
      ...category,
      userId: user.id
    };

    if (hasValidConfig) {
      const savedCategory = await saveCategory(categoryWithUser);
      if (savedCategory) {
        setCategories(prev => [...prev, savedCategory].sort((a, b) => a.name.localeCompare(b.name)));
      }
    } else {
      // Modo demo: solo actualizar estado local
      const newCategory: Category = {
        ...categoryWithUser,
        id: Date.now().toString(),
      };
      setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const deleteCategory = async (id: string) => {
    // No permitir eliminar categorías por defecto
    const category = categories.find(c => c.id === id);
    if (category?.isDefault) {
      console.warn('Cannot delete default category');
      return;
    }

    if (hasValidConfig) {
      const success = await deleteCategoryFromDB(id);
      if (success) {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } else {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const refreshCategories = async () => {
    await loadUserCategories();
  };

  return (
    <CategoriesContext.Provider value={{
      categories,
      incomeCategories,
      expenseCategories,
      loading,
      addCategory,
      deleteCategory,
      refreshCategories,
    }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error('useCategories must be used within CategoriesProvider');
  return context;
}