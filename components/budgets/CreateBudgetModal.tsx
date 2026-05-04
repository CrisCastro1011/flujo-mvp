'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, DollarSign, Target } from 'lucide-react';
import { BudgetType, BudgetCategory } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { useCategories } from '@/context/CategoriesContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { hasValidConfig } from '@/lib/supabase';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const budgetTypeOptions: { value: BudgetType; label: string }[] = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'bi-monthly', label: 'Bimensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semi-annual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' }
];

const categoryIcons = [
  'Home', 'ShoppingCart', 'Utensils', 'Car', 'Tv', 'Heart', 'Gamepad2', 
  'GraduationCap', 'Shirt', 'Fuel', 'Coffee', 'Phone', 'Zap', 'Wifi'
];

const categoryColors = [
  '#3B82F6', '#10B981', '#F97316', '#14B8A6', '#EC4899', '#F59E0B', 
  '#EF4444', '#64748B', '#8B5CF6', '#06B6D4', '#84CC16', '#F43F5E'
];

export default function CreateBudgetModal({ isOpen, onClose }: CreateBudgetModalProps) {
  const { addBudget } = useFinance();
  const { expenseCategories, loading: categoriesLoading } = useCategories();
  const { toast } = useToast();
  
  // Estados del formulario principal
  const [name, setName] = useState('');
  const [type, setType] = useState<BudgetType>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxIncome, setMaxIncome] = useState('');
  const [maxSpendingLimit, setMaxSpendingLimit] = useState('');
  
  // Estados para las categorías - inicializar con categorías del contexto
  const [categories, setCategories] = useState<Omit<BudgetCategory, 'id' | 'budgetId' | 'used'>[]>([]);
  
  // Inicializar categorías cuando se cargan del contexto
  useEffect(() => {
    if (expenseCategories.length > 0 && categories.length === 0) {
      const defaultBudgetCategories = expenseCategories.slice(0, 5).map(cat => ({
        name: cat.name,
        limit: 0,
        color: cat.color,
        icon: cat.icon
      }));
      setCategories(defaultBudgetCategories);
    }
  }, [expenseCategories, categories.length]);
  
  // Estado para nueva categoría - usar categorías disponibles del contexto
  const [newCategory, setNewCategory] = useState({
    name: '',
    limit: '',
    color: '#3B82F6',
    icon: 'DollarSign'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.limit) return;
    
    // Buscar la categoría seleccionada en el contexto para obtener su color e ícono
    const selectedCategory = expenseCategories.find(cat => cat.name === newCategory.name);
    
    setCategories([...categories, {
      name: newCategory.name,
      limit: parseFloat(newCategory.limit),
      color: selectedCategory?.color || '#3B82F6',
      icon: selectedCategory?.icon || 'DollarSign'
    }]);
    
    setNewCategory({
      name: '',
      limit: '',
      color: '#3B82F6',
      icon: 'DollarSign'
    });
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleUpdateCategory = (index: number, field: string, value: string | number) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const calculateTotalCategoryLimits = () => {
    return categories.reduce((sum, cat) => sum + cat.limit, 0);
  };

  const calculateDaysUntilNext = () => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate || !maxIncome || !maxSpendingLimit) return;
    
    setIsSubmitting(true);
    
    try {
      const budgetCategories: BudgetCategory[] = categories.map((cat, index) => ({
        id: `cat-${Date.now()}-${index}`,
        budgetId: '', // Se asignará después
        name: cat.name,
        limit: cat.limit,
        used: 0,
        color: cat.color,
        icon: cat.icon
      }));

      const totalSpent = 0; // Empezar con 0
      const remainingBalance = parseFloat(maxIncome) - totalSpent;
      const daysUntilNext = calculateDaysUntilNext();
      
      let status: 'on-track' | 'warning' | 'exceeded' = 'on-track';
      if (totalSpent > parseFloat(maxSpendingLimit)) {
        status = 'exceeded';
      } else if (totalSpent > parseFloat(maxSpendingLimit) * 0.8) {
        status = 'warning';
      }

      await addBudget({
        name,
        type,
        startDate,
        endDate,
        maxIncome: parseFloat(maxIncome),
        maxSpendingLimit: parseFloat(maxSpendingLimit),
        categories: budgetCategories,
        status,
        totalSpent,
        remainingBalance,
        daysUntilNext,
        color: '#3B82F6',
        icon: 'Wallet',
        isActive: true
      });

      // Feedback al usuario
      toast({
        title: "Presupuesto creado exitosamente",
        description: hasValidConfig 
          ? `"${name}" ha sido guardado en tu cuenta.`
          : `"${name}" ha sido creado (modo demo).`,
      });

      // Reset form
      setName('');
      setType('monthly');
      setStartDate('');
      setEndDate('');
      setMaxIncome('');
      setMaxSpendingLimit('');
      // Reinicializar con categorías del contexto
      if (expenseCategories.length > 0) {
        const defaultBudgetCategories = expenseCategories.slice(0, 3).map(cat => ({
          name: cat.name,
          limit: 0,
          color: cat.color,
          icon: cat.icon
        }));
        setCategories(defaultBudgetCategories);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating budget:', error);
      toast({
        title: "Error al crear presupuesto",
        description: "No se pudo crear el presupuesto. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalCategoryLimits = calculateTotalCategoryLimits();
  const maxSpendingValue = parseFloat(maxSpendingLimit) || 0;
  const isOverAllocated = totalCategoryLimits > maxSpendingValue;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-[95vw] sm:max-w-2xl sm:w-full max-h-[95vh] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Crear Presupuesto</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Configura tu presupuesto personalizado</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          
          {!hasValidConfig && (
            <Alert className="bg-blue-50 border-blue-200 mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Modo Demo:</strong> Los datos se guardarán temporalmente. Para guardado permanente, configura la conexión con Supabase.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-lg">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Presupuesto
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Presupuesto Abril"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Presupuesto
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as BudgetType)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                >
                  {budgetTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha de Cierre
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <DollarSign size={16} className="inline mr-1" />
                    Ingreso Máximo
                  </label>
                  <input
                    type="number"
                    value={maxIncome}
                    onChange={(e) => setMaxIncome(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Target size={16} className="inline mr-1" />
                    Tope Máximo de Gasto
                  </label>
                  <input
                    type="number"
                    value={maxSpendingLimit}
                    onChange={(e) => setMaxSpendingLimit(e.target.value)}
                    placeholder="40000"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Categorías existentes */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900 text-lg">Categorías de Gasto</h3>
                <div className="text-sm">
                  <span className="text-slate-500">Total asignado: </span>
                  <span className={`font-semibold ${isOverAllocated ? 'text-red-500' : 'text-green-600'}`}>
                    ${totalCategoryLimits.toLocaleString()}
                  </span>
                </div>
              </div>

              {isOverAllocated && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-sm text-red-600">
                    ⚠️ El total de categorías excede tu tope máximo de gasto
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      >
                        💰
                      </div>
                      
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(index, 'name', e.target.value)}
                        className="flex-1 sm:w-40 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-sm text-slate-500">$</span>
                      <input
                        type="number"
                        value={category.limit}
                        onChange={(e) => handleUpdateCategory(index, 'limit', parseFloat(e.target.value) || 0)}
                        className="flex-1 sm:w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                      />
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Agregar nueva categoría */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4">
                <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0"
                      style={{ backgroundColor: '#3B82F6' }}
                    >
                      💰
                    </div>
                    
                    {expenseCategories.length > 0 ? (
                      <select
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                      >
                        <option value="">Seleccionar categoría...</option>
                        {expenseCategories
                          .filter(cat => !categories.some(existing => existing.name === cat.name))
                          .map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))
                        }
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        placeholder="Nombre de categoría"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">$</span>
                    <input
                      type="number"
                      value={newCategory.limit}
                      onChange={(e) => setNewCategory({...newCategory, limit: e.target.value})}
                      placeholder="0"
                      className="w-full sm:w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-sm ios-input-fix"
                    />
                    
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={!newCategory.name || !newCategory.limit}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px] sm:min-h-[36px] whitespace-nowrap"
                    >
                      <Plus size={16} />
                      <span className="hidden sm:inline">Agregar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors min-h-[44px] sm:min-h-[36px]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !name || !startDate || !endDate || !maxIncome || !maxSpendingLimit}
              className="w-full sm:flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-[36px]"
            >
              {isSubmitting ? 'Creando...' : 'Crear Presupuesto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}