import { Transaction, Budget, SavingsGoal } from './types';

export const mockTransactions: Transaction[] = [
  { id: '1', userId: 'demo-user', amount: 4200, type: 'income', category: 'Salario', description: 'Salario mensual - Abril', date: '2026-04-01' },
  { id: '2', userId: 'demo-user', amount: 850, type: 'expense', category: 'Alquiler', description: 'Pago de alquiler abril', date: '2026-04-02' },
  { id: '3', userId: 'demo-user', amount: 120, type: 'expense', category: 'Comestibles', description: 'Compras semanales', date: '2026-04-03' },
  { id: '4', userId: 'demo-user', amount: 500, type: 'income', category: 'Freelance', description: 'Proyecto de diseño', date: '2026-04-05' },
  { id: '5', userId: 'demo-user', amount: 65, type: 'expense', category: 'Transporte', description: 'Tarjeta de transporte mensual', date: '2026-04-06' },
  { id: '6', userId: 'demo-user', amount: 45, type: 'expense', category: 'Entretenimiento', description: 'Netflix y Spotify', date: '2026-04-07' },
  { id: '7', userId: 'demo-user', amount: 200, type: 'expense', category: 'Comida', description: 'Restaurante y café', date: '2026-04-09' },
  { id: '8', userId: 'demo-user', amount: 350, type: 'income', category: 'Inversiones', description: 'Pago de dividendos', date: '2026-04-10' },
  { id: '9', userId: 'demo-user', amount: 90, type: 'expense', category: 'Salud', description: 'Membresía de gimnasio', date: '2026-04-11' },
  { id: '10', userId: 'demo-user', amount: 180, type: 'expense', category: 'Compras', description: 'Ropa y accesorios', date: '2026-04-12' },
  { id: '11', userId: 'demo-user', amount: 55, type: 'expense', category: 'Servicios', description: 'Factura de luz y agua', date: '2026-04-13' },
  { id: '12', userId: 'demo-user', amount: 1200, type: 'income', category: 'Freelance', description: 'Desarrollo de sitio web', date: '2026-04-15' },
  { id: '13', userId: 'demo-user', amount: 75, type: 'expense', category: 'Comestibles', description: 'Compra adicional', date: '2026-04-16' },
  { id: '14', userId: 'demo-user', amount: 30, type: 'expense', category: 'Transporte', description: 'Compartir viaje', date: '2026-04-17' },
  { id: '15', userId: 'demo-user', amount: 250, type: 'expense', category: 'Salud', description: 'Chequeo dental', date: '2026-04-18' },
];

export const mockBudgets: Budget[] = [
  { id: '1', userId: 'demo-user', category: 'Alquiler', limit: 900, used: 850, color: '#3B82F6', icon: 'Home' },
  { id: '2', userId: 'demo-user', category: 'Comestibles', limit: 300, used: 195, color: '#10B981', icon: 'ShoppingCart' },
  { id: '3', userId: 'demo-user', category: 'Comida', limit: 250, used: 200, color: '#F97316', icon: 'Utensils' },
  { id: '4', userId: 'demo-user', category: 'Transporte', limit: 150, used: 95, color: '#14B8A6', icon: 'Car' },
  { id: '5', userId: 'demo-user', category: 'Entretenimiento', limit: 100, used: 45, color: '#EC4899', icon: 'Tv' },
  { id: '6', userId: 'demo-user', category: 'Salud', limit: 200, used: 340, color: '#EF4444', icon: 'Heart' },
];

export const mockSavingsGoals: SavingsGoal[] = [
  { id: '1', userId: 'demo-user', name: 'Fondo de Emergencia', targetAmount: 10000, currentAmount: 4200, deadline: '2026-12-31', color: '#3B82F6', icon: 'Shield' },
  { id: '2', userId: 'demo-user', name: 'Vacaciones de Verano', targetAmount: 3000, currentAmount: 1450, deadline: '2026-07-01', color: '#F97316', icon: 'Plane' },
  { id: '3', userId: 'demo-user', name: 'Laptop Nueva', targetAmount: 2000, currentAmount: 1800, deadline: '2026-06-01', color: '#10B981', icon: 'Laptop' },
  { id: '4', userId: 'demo-user', name: 'Renovación del Hogar', targetAmount: 15000, currentAmount: 2500, deadline: '2027-03-01', color: '#F59E0B', icon: 'Hammer' },
];

export const incomeCategories = ['Salario', 'Freelance', 'Inversiones', 'Negocio', 'Regalo', 'Otro Ingreso'];
export const expenseCategories = ['Alquiler', 'Comestibles', 'Comida', 'Transporte', 'Entretenimiento', 'Salud', 'Compras', 'Servicios', 'Educación', 'Viajes', 'Otro'];

export const getMonthlyIncome = (transactions: Transaction[]) =>
  transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

export const getMonthlyExpenses = (transactions: Transaction[]) =>
  transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

export const getSpendingByCategory = (transactions: Transaction[]) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const map: Record<string, number> = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};
