'use client';

import { useState } from 'react';
import { Plus, Settings, Tag, Trash2, Palette, Save, X } from 'lucide-react';
import { useCategories } from '@/context/CategoriesContext';
import { TransactionType, Category } from '@/lib/types';

const iconOptions = [
  'Tag', 'Home', 'Car', 'ShoppingCart', 'Utensils', 'Heart', 
  'Briefcase', 'Code', 'TrendingUp', 'Building', 'Gift', 'Plus',
  'ShoppingBag', 'Zap', 'GraduationCap', 'Plane', 'Tv', 'Smartphone'
];

const colorOptions = [
  '#3B82F6', '#10B981', '#F97316', '#14B8A6', '#EC4899', '#F59E0B', 
  '#EF4444', '#8B5CF6', '#6366F1', '#06B6D4', '#84CC16', '#F472B6'
];

export default function ConfigurationPage() {
  const { categories, incomeCategories, expenseCategories, loading, addCategory, deleteCategory } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as TransactionType,
    icon: iconOptions[0],
    color: colorOptions[0]
  });

  const openAddModal = (type?: TransactionType) => {
    setFormData({
      name: '',
      type: type || 'expense',
      icon: iconOptions[0],
      color: colorOptions[0]
    });
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await addCategory({
        name: formData.name.trim(),
        type: formData.type,
        icon: formData.icon,
        color: formData.color,
        isDefault: false
      });
      
      setModalOpen(false);
      setFormData({ name: '', type: 'expense', icon: iconOptions[0], color: colorOptions[0] });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.isDefault) {
      alert('No puedes eliminar categorías por defecto');
      return;
    }
    
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Cargando configuración...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Configuración</h1>
          <p className="text-sm text-slate-500">Personaliza tus categorías y preferencias</p>
        </div>
      </div>

      {/* Sección de Categorías */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Categorías</h2>
          </div>
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Categorías de Ingresos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Ingresos ({incomeCategories.length})
              </h3>
              <button
                onClick={() => openAddModal('income')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                + Agregar ingreso
              </button>
            </div>
            <div className="space-y-2">
              {incomeCategories.map(category => (
                <CategoryItem 
                  key={category.id} 
                  category={category} 
                  onDelete={() => handleDeleteCategory(category)}
                />
              ))}
            </div>
          </div>

          {/* Categorías de Gastos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                Gastos ({expenseCategories.length})
              </h3>
              <button
                onClick={() => openAddModal('expense')}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                + Agregar gasto
              </button>
            </div>
            <div className="space-y-2">
              {expenseCategories.map(category => (
                <CategoryItem 
                  key={category.id} 
                  category={category} 
                  onDelete={() => handleDeleteCategory(category)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar categoría */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Nueva Categoría</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={16} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Tipo
                </label>
                <div className="flex rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                      formData.type === 'expense'
                        ? 'bg-white text-red-500 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Gasto
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                      formData.type === 'income'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Ingreso
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Suscripciones, Ropa, etc."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        formData.color === color ? 'border-slate-800' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar una categoría individual
function CategoryItem({ category, onDelete }: { category: Category; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <Tag size={14} style={{ color: category.color }} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{category.name}</p>
          {category.isDefault && (
            <span className="text-xs text-slate-400">Por defecto</span>
          )}
        </div>
      </div>
      
      {!category.isDefault && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      )}
    </div>
  );
}