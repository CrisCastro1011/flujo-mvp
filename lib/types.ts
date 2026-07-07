export type TransactionType = 'income' | 'expense';

export type BudgetType = 'monthly' | 'bi-monthly' | 'quarterly' | 'semi-annual' | 'annual';

export type BudgetStatus = 'on-track' | 'warning' | 'exceeded';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  budgetId?: string;
  budgetCategoryId?: string;
  description: string;
  date: string;
}

// Categoría dentro de un presupuesto
export interface BudgetCategory {
  id: string;
  budgetId: string;
  name: string;
  limit: number;
  used: number;
  color: string;
  icon: string;
}

// Presupuesto principal renovado
export interface Budget {
  id: string;
  userId: string;
  name: string;
  type: BudgetType;
  startDate: string;
  endDate: string;
  maxIncome: number;        // Ingreso máximo esperado
  maxSpendingLimit: number; // Tope máximo de gasto total
  categories: BudgetCategory[];
  status: BudgetStatus;
  totalSpent: number;       // Total gastado hasta ahora
  remainingBalance: number; // Saldo restante
  daysUntilNext: number;    // Días hasta el próximo ciclo
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;        // Si es el presupuesto actualmente activo
}

// Para compatibilidad con sistema anterior
export interface LegacyBudget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  used: number;
  color: string;
  icon: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  icon: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  price?: number;
  link?: string;
  completed: boolean;
  completedAt?: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
  totalItems: number;
  completedItems: number;
}
