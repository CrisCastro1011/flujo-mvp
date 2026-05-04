import { Transaction, Budget, SavingsGoal, BudgetCategory, ShoppingList } from './types';

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

// Datos mock para presupuestos con nueva estructura
export const mockBudgets: Budget[] = [
  {
    id: '1',
    userId: 'demo-user',
    name: 'Presupuesto Mayo 2026',
    type: 'monthly',
    startDate: '2026-05-04', // 4to día hábil
    endDate: '2026-06-04',   // Próximo 4to día hábil
    maxIncome: 50000,
    maxSpendingLimit: 42000,
    categories: [
      {
        id: 'cat-1',
        budgetId: '1',
        name: 'Alquiler',
        limit: 15000,
        used: 15000,
        color: '#3B82F6',
        icon: 'Home'
      },
      {
        id: 'cat-2',
        budgetId: '1',
        name: 'Comida',
        limit: 8000,
        used: 5600,
        color: '#10B981',
        icon: 'Utensils'
      },
      {
        id: 'cat-3',
        budgetId: '1',
        name: 'Transporte',
        limit: 3500,
        used: 2100,
        color: '#F97316',
        icon: 'Car'
      },
      {
        id: 'cat-4',
        budgetId: '1',
        name: 'Entretenimiento',
        limit: 4000,
        used: 3200,
        color: '#EC4899',
        icon: 'Tv'
      },
      {
        id: 'cat-5',
        budgetId: '1',
        name: 'Servicios',
        limit: 6000,
        used: 4500,
        color: '#8B5CF6',
        icon: 'Zap'
      },
      {
        id: 'cat-6',
        budgetId: '1',
        name: 'Compras',
        limit: 5500,
        used: 2800,
        color: '#06B6D4',
        icon: 'ShoppingCart'
      }
    ],
    status: 'warning',
    totalSpent: 33200,
    remainingBalance: 16800,
    daysUntilNext: 18,
    color: '#3B82F6',
    icon: 'Wallet',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-03T00:00:00Z',
    isActive: true
  },
  {
    id: '2', 
    userId: 'demo-user',
    name: 'Presupuesto Trimestral Q2',
    type: 'quarterly',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    maxIncome: 150000,
    maxSpendingLimit: 120000,
    categories: [
      {
        id: 'cat-7',
        budgetId: '2',
        name: 'Vacaciones',
        limit: 25000,
        used: 8000,
        color: '#F59E0B',
        icon: 'Plane'
      },
      {
        id: 'cat-8',
        budgetId: '2',
        name: 'Cursos',
        limit: 15000,
        used: 12000,
        color: '#84CC16',
        icon: 'GraduationCap'
      }
    ],
    status: 'on-track',
    totalSpent: 20000,
    remainingBalance: 130000,
    daysUntilNext: 88,
    color: '#F59E0B',
    icon: 'Calendar',
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-05-03T00:00:00Z',
    isActive: false
  }
];

// Presupuestos legacy para compatibilidad (se pueden eliminar más adelante)
export const mockLegacyBudgets = [
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
export const expenseCategories = ['Alquiler', 'Comida', 'Transporte', 'Entretenimiento', 'Servicios', 'Compras', 'Salud', 'Educación', 'Viajes', 'Otro'];

// Mapeo de categorías de transacciones a categorías de presupuesto
export const categoryMapping: Record<string, string[]> = {
  'Alquiler': ['Alquiler'],
  'Comida': ['Comida', 'Comestibles'],
  'Transporte': ['Transporte'],
  'Entretenimiento': ['Entretenimiento'],
  'Servicios': ['Servicios', 'Salud'],
  'Compras': ['Compras'],
  'Educación': ['Educación'],
  'Viajes': ['Viajes'],
  'Otro': ['Otro']
};

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

// Datos mock para listas de compras
export const mockShoppingLists: ShoppingList[] = [
  {
    id: '1',
    userId: 'demo-user',
    name: 'Compras del Mercado',
    description: 'Lista semanal de comestibles',
    items: [
      {
        id: '1',
        name: 'Leche entera 1L',
        price: 2500,
        completed: true,
        completedAt: '2026-05-02T10:30:00Z'
      },
      {
        id: '2', 
        name: 'Pan integral',
        price: 1800,
        completed: false
      },
      {
        id: '3',
        name: 'Manzanas (1kg)',
        price: 3200,
        completed: true,
        completedAt: '2026-05-02T10:35:00Z'
      },
      {
        id: '4',
        name: 'Pollo (1kg)',
        price: 8500,
        completed: false
      },
      {
        id: '5',
        name: 'Arroz (2kg)',
        price: 4200,
        completed: false
      }
    ],
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-02T10:35:00Z',
    totalItems: 5,
    completedItems: 2
  },
  {
    id: '2', 
    userId: 'demo-user',
    name: 'Artículos de Oficina',
    description: 'Para el trabajo remoto',
    items: [
      {
        id: '6',
        name: 'Notebook Moleskine',
        price: 15000,
        link: 'https://amazon.com/moleskine-notebook',
        completed: false
      },
      {
        id: '7',
        name: 'Bolígrafos gel (set)',
        price: 8000,
        completed: true,
        completedAt: '2026-05-01T14:20:00Z'
      },
      {
        id: '8',
        name: 'Lámpara LED escritorio',
        price: 45000,
        link: 'https://mercadolibre.com/lampara-led',
        completed: false
      }
    ],
    createdAt: '2026-04-30T16:00:00Z',
    updatedAt: '2026-05-01T14:20:00Z',
    totalItems: 3,
    completedItems: 1
  },
  {
    id: '3',
    userId: 'demo-user', 
    name: 'Lista Vacía',
    description: 'Lista para probar agregar elementos',
    items: [],
    createdAt: '2026-05-03T09:00:00Z',
    updatedAt: '2026-05-03T09:00:00Z',
    totalItems: 0,
    completedItems: 0
  }
];
