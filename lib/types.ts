export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
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
