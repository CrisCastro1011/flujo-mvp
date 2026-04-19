import { supabase, hasValidConfig } from './supabase';
import { Transaction, Budget, SavingsGoal, Category } from './types';

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  if (!hasValidConfig) return [];
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    // Convertir nombres de columnas de DB a formato de aplicación
    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      description: row.description,
      date: row.date
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getUserBudgets(userId: string): Promise<Budget[]> {
  if (!hasValidConfig) return [];
  
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching budgets:', error);
      return [];
    }
    
    // Convertir nombres de columnas de DB a formato de aplicación
    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      category: row.category,
      limit: parseFloat(row.limit_amount),
      used: parseFloat(row.used_amount),
      color: row.color,
      icon: row.icon
    }));
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
}

export async function getUserSavingsGoals(userId: string): Promise<SavingsGoal[]> {
  if (!hasValidConfig) return [];
  
  try {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching savings goals:', error);
      return [];
    }
    
    // Convertir nombres de columnas de DB a formato de aplicación
    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      targetAmount: parseFloat(row.target_amount),
      currentAmount: parseFloat(row.current_amount),
      deadline: row.deadline,
      color: row.color,
      icon: row.icon
    }));
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    return [];
  }
}

export async function saveTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> {
  if (!hasValidConfig) return null;
  
  try {
    // Convertir formato de aplicación a formato de DB
    const dbTransaction = {
      user_id: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([dbTransaction])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving transaction:', error);
      return null;
    }
    
    // Convertir de vuelta a formato de aplicación
    return {
      id: data.id,
      userId: data.user_id,
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date
    };
  } catch (error) {
    console.error('Error saving transaction:', error);
    return null;
  }
}

export async function saveBudget(budget: Omit<Budget, 'id'>): Promise<Budget | null> {
  if (!hasValidConfig) return null;
  
  try {
    // Convertir formato de aplicación a formato de DB
    const dbBudget = {
      user_id: budget.userId,
      category: budget.category,
      limit_amount: budget.limit,
      used_amount: budget.used,
      color: budget.color,
      icon: budget.icon
    };
    
    const { data, error } = await supabase
      .from('budgets')
      .insert([dbBudget])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving budget:', error);
      return null;
    }
    
    // Convertir de vuelta a formato de aplicación
    return {
      id: data.id,
      userId: data.user_id,
      category: data.category,
      limit: parseFloat(data.limit_amount),
      used: parseFloat(data.used_amount),
      color: data.color,
      icon: data.icon
    };
  } catch (error) {
    console.error('Error saving budget:', error);
    return null;
  }
}

export async function saveSavingsGoal(goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal | null> {
  if (!hasValidConfig) return null;
  
  try {
    // Convertir formato de aplicación a formato de DB
    const dbGoal = {
      user_id: goal.userId,
      name: goal.name,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount,
      deadline: goal.deadline,
      color: goal.color,
      icon: goal.icon
    };
    
    const { data, error } = await supabase
      .from('savings_goals')
      .insert([dbGoal])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving savings goal:', error);
      return null;
    }
    
    // Convertir de vuelta a formato de aplicación
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      targetAmount: parseFloat(data.target_amount),
      currentAmount: parseFloat(data.current_amount),
      deadline: data.deadline,
      color: data.color,
      icon: data.icon
    };
  } catch (error) {
    console.error('Error saving savings goal:', error);
    return null;
  }
}

export async function deleteTransactionFromDB(id: string): Promise<boolean> {
  if (!hasValidConfig) return false;
  
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
}

export async function deleteBudgetFromDB(id: string): Promise<boolean> {
  if (!hasValidConfig) return false;
  
  try {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting budget:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting budget:', error);
    return false;
  }
}

export async function deleteSavingsGoalFromDB(id: string): Promise<boolean> {
  if (!hasValidConfig) return false;
  
  try {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting savings goal:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    return false;
  }
}

export async function updateSavingsGoalInDB(id: string, currentAmount: number): Promise<boolean> {
  if (!hasValidConfig) return false;
  
  try {
    const { error } = await supabase
      .from('savings_goals')
      .update({ current_amount: currentAmount })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating savings goal:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating savings goal:', error);
    return false;
  }
}

// ===== FUNCIONES PARA CATEGORÍAS =====

export async function getUserCategories(userId: string): Promise<Category[]> {
  if (!hasValidConfig) {
    // En modo demo, devolver categorías por defecto
    return [
      // Categorías de Ingresos
      { id: '1', userId, name: 'Salario', type: 'income', icon: 'Briefcase', color: '#10B981', isDefault: true },
      { id: '2', userId, name: 'Freelance', type: 'income', icon: 'Code', color: '#3B82F6', isDefault: true },
      { id: '3', userId, name: 'Inversiones', type: 'income', icon: 'TrendingUp', color: '#8B5CF6', isDefault: true },
      { id: '4', userId, name: 'Negocio', type: 'income', icon: 'Building', color: '#F59E0B', isDefault: true },
      { id: '5', userId, name: 'Regalo', type: 'income', icon: 'Gift', color: '#EC4899', isDefault: true },
      { id: '6', userId, name: 'Otro Ingreso', type: 'income', icon: 'Plus', color: '#6B7280', isDefault: true },
      // Categorías de Gastos
      { id: '7', userId, name: 'Alquiler', type: 'expense', icon: 'Home', color: '#3B82F6', isDefault: true },
      { id: '8', userId, name: 'Comestibles', type: 'expense', icon: 'ShoppingCart', color: '#10B981', isDefault: true },
      { id: '9', userId, name: 'Comida', type: 'expense', icon: 'Utensils', color: '#F97316', isDefault: true },
      { id: '10', userId, name: 'Transporte', type: 'expense', icon: 'Car', color: '#14B8A6', isDefault: true },
      { id: '11', userId, name: 'Entretenimiento', type: 'expense', icon: 'Tv', color: '#EC4899', isDefault: true },
      { id: '12', userId, name: 'Salud', type: 'expense', icon: 'Heart', color: '#EF4444', isDefault: true },
      { id: '13', userId, name: 'Compras', type: 'expense', icon: 'ShoppingBag', color: '#F59E0B', isDefault: true },
      { id: '14', userId, name: 'Servicios', type: 'expense', icon: 'Zap', color: '#6366F1', isDefault: true },
      { id: '15', userId, name: 'Educación', type: 'expense', icon: 'GraduationCap', color: '#8B5CF6', isDefault: true },
      { id: '16', userId, name: 'Viajes', type: 'expense', icon: 'Plane', color: '#06B6D4', isDefault: true },
      { id: '17', userId, name: 'Otro', type: 'expense', icon: 'Tag', color: '#6B7280', isDefault: true },
    ];
  }
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')  
      .eq('user_id', userId)
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    // Convertir nombres de columnas de DB a formato de aplicación
    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type,
      icon: row.icon,
      color: row.color,
      isDefault: row.is_default
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function saveCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
  if (!hasValidConfig) return null;
  
  try {
    // Convertir formato de aplicación a formato de DB
    const dbCategory = {
      user_id: category.userId,
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
      is_default: category.isDefault
    };
    
    const { data, error } = await supabase
      .from('categories')
      .insert([dbCategory])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving category:', error);
      return null;
    }
    
    // Convertir de vuelta a formato de aplicación
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      type: data.type,
      icon: data.icon,
      color: data.color,
      isDefault: data.is_default
    };
  } catch (error) {
    console.error('Error saving category:', error);
    return null;
  }
}

export async function deleteCategoryFromDB(id: string): Promise<boolean> {
  if (!hasValidConfig) return false;
  
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

export async function initializeDefaultCategories(userId: string): Promise<boolean> {
  if (!hasValidConfig) return false;
  
  try {
    // Llamar a la función SQL para crear categorías por defecto
    const { error } = await supabase.rpc('create_default_categories', {
      user_uuid: userId
    });
    
    if (error) {
      console.error('Error initializing default categories:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing default categories:', error);
    return false;
  }
}