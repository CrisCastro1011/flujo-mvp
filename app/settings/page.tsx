'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Settings,
  Tag,
  Trash2,
  Save,
  X,
  Home,
  Car,
  ShoppingCart,
  Utensils,
  Heart,
  Briefcase,
  Code,
  TrendingUp,
  Building,
  Gift,
  ShoppingBag,
  Zap,
  GraduationCap,
  Plane,
  Tv,
  Smartphone,
  Lightbulb,
  Coins,
  Landmark,
  BadgeDollarSign,
  UserCircle,
  Sparkles,
  Mail,
} from 'lucide-react';
import { useCategories } from '@/context/CategoriesContext';
import { TransactionType, Category } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { hasValidConfig, supabase } from '@/lib/supabase';

const iconOptions = [
  'Tag',
  'Home',
  'Car',
  'ShoppingCart',
  'Utensils',
  'Heart',
  'Briefcase',
  'Code',
  'TrendingUp',
  'Building',
  'Gift',
  'ShoppingBag',
  'Zap',
  'GraduationCap',
  'Plane',
  'Tv',
  'Smartphone',
  'Lightbulb',
  'Coins',
  'Landmark',
  'BadgeDollarSign',
  'UserCircle',
  'Sparkles',
];

const colorOptions = [
  '#3B82F6',
  '#10B981',
  '#F97316',
  '#14B8A6',
  '#EC4899',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#6366F1',
  '#06B6D4',
  '#84CC16',
  '#F472B6',
];

const iconCatalog = {
  Tag,
  Home,
  Car,
  ShoppingCart,
  Utensils,
  Heart,
  Briefcase,
  Code,
  TrendingUp,
  Building,
  Gift,
  ShoppingBag,
  Zap,
  GraduationCap,
  Plane,
  Tv,
  Smartphone,
  Lightbulb,
  Coins,
  Landmark,
  BadgeDollarSign,
  UserCircle,
  Sparkles,
};

type IconName = keyof typeof iconCatalog;

type CategoryTemplate = {
  name: string;
  type: TransactionType;
  icon: IconName;
  color: string;
};

const quickExpenseTypes: CategoryTemplate[] = [
  { name: 'Transporte', type: 'expense', icon: 'Car', color: '#14B8A6' },
  { name: 'UTE', type: 'expense', icon: 'Zap', color: '#6366F1' },
  { name: 'Gastos Comunes', type: 'expense', icon: 'Building', color: '#3B82F6' },
  { name: 'Internet', type: 'expense', icon: 'Smartphone', color: '#06B6D4' },
  { name: 'Supermercado', type: 'expense', icon: 'ShoppingCart', color: '#10B981' },
  { name: 'Salud', type: 'expense', icon: 'Heart', color: '#EF4444' },
];

const quickIncomeTypes: CategoryTemplate[] = [
  { name: 'Sueldo', type: 'income', icon: 'Briefcase', color: '#10B981' },
  { name: 'Freelance', type: 'income', icon: 'Code', color: '#3B82F6' },
  { name: 'Inversiones', type: 'income', icon: 'TrendingUp', color: '#8B5CF6' },
  { name: 'Bono', type: 'income', icon: 'BadgeDollarSign', color: '#F59E0B' },
  { name: 'Intereses', type: 'income', icon: 'Coins', color: '#14B8A6' },
  { name: 'Regalo', type: 'income', icon: 'Gift', color: '#EC4899' },
];

export default function ConfigurationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { categories, incomeCategories, expenseCategories, loading, addCategory, deleteCategory } = useCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    currency: 'UYU',
  });
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as TransactionType,
    icon: iconOptions[0],
    color: colorOptions[0],
  });

  const profileStorageKey = useMemo(() => {
    return user ? `finely.profile.${user.id}` : null;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let initialName = '';
    let initialCurrency = 'UYU';
    const metadata = user.user_metadata as Record<string, string> | undefined;

    if (metadata?.display_name) {
      initialName = metadata.display_name;
    }
    if (metadata?.preferred_currency) {
      initialCurrency = metadata.preferred_currency;
    }

    if (profileStorageKey) {
      const saved = localStorage.getItem(profileStorageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { name?: string; currency?: string };
          initialName = parsed.name || initialName;
          initialCurrency = parsed.currency || initialCurrency;
        } catch (error) {
          console.error('Error parsing local profile data:', error);
        }
      }
    }

    setProfileForm({
      name: initialName,
      currency: initialCurrency,
    });
  }, [profileStorageKey, user]);

  const openAddModal = (type?: TransactionType) => {
    const targetType = type || 'expense';
    const suggestedIcon = targetType === 'expense' ? 'Car' : 'Briefcase';
    const suggestedColor = targetType === 'expense' ? '#14B8A6' : '#10B981';

    setFormData({
      name: '',
      type: targetType,
      icon: suggestedIcon,
      color: suggestedColor,
    });

    setModalOpen(true);
  };

  const saveProfile = async () => {
    if (!user) return;

    setSavingProfile(true);
    const payload = {
      display_name: profileForm.name.trim(),
      preferred_currency: profileForm.currency,
    };

    try {
      if (hasValidConfig) {
        const { error } = await supabase.auth.updateUser({
          data: payload,
        });

        if (error) {
          throw error;
        }
      }

      if (profileStorageKey) {
        localStorage.setItem(profileStorageKey, JSON.stringify({
          name: payload.display_name,
          currency: payload.preferred_currency,
        }));
      }

      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos de perfil se guardaron correctamente.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'No se pudo guardar',
        description: 'Revisa tu conexión e intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const duplicated = categories.some(
      category =>
        category.type === formData.type &&
        category.name.toLowerCase() === formData.name.trim().toLowerCase()
    );

    if (duplicated) {
      toast({
        title: 'Tipo ya existe',
        description: 'Ya tienes un tipo con ese nombre para ese movimiento.',
      });
      return;
    }

    try {
      await addCategory({
        name: formData.name.trim(),
        type: formData.type,
        icon: formData.icon,
        color: formData.color,
        isDefault: false,
      });

      toast({
        title: 'Tipo creado',
        description: `Se agrego ${formData.name.trim()} a tus ${formData.type === 'expense' ? 'gastos' : 'ingresos'}.`,
      });

      setModalOpen(false);
      setFormData({ name: '', type: 'expense', icon: iconOptions[0], color: colorOptions[0] });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error al crear tipo',
        description: 'No se pudo guardar este tipo en este momento.',
        variant: 'destructive',
      });
    }
  };

  const addFromTemplate = async (template: CategoryTemplate) => {
    const exists = categories.some(
      category =>
        category.type === template.type &&
        category.name.toLowerCase() === template.name.toLowerCase()
    );

    if (exists) {
      toast({
        title: 'Ya existe',
        description: `El tipo ${template.name} ya esta creado.`,
      });
      return;
    }

    try {
      await addCategory({
        name: template.name,
        type: template.type,
        icon: template.icon,
        color: template.color,
        isDefault: false,
      });

      toast({
        title: 'Tipo agregado',
        description: `${template.name} fue agregado correctamente.`,
      });
    } catch (error) {
      console.error('Error adding suggested category:', error);
      toast({
        title: 'No se pudo agregar',
        description: `No fue posible agregar ${template.name}.`,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.isDefault) {
      toast({
        title: 'Accion bloqueada',
        description: 'No puedes eliminar tipos por defecto.',
      });
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
        toast({
          title: 'Tipo eliminado',
          description: `${category.name} fue eliminado.`,
        });
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: 'Error al eliminar',
          description: 'No se pudo eliminar este tipo.',
          variant: 'destructive',
        });
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
          <h1 className="text-xl font-bold text-slate-900">Ajustes</h1>
          <p className="text-sm text-slate-500">Edita tu perfil y organiza tus tipos de ingresos y gastos</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <UserCircle className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Editar perfil</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Nombre visible
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Correo
            </label>
            <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium flex items-center gap-2">
              <Mail size={14} />
              <span className="truncate">{user?.email || 'Sin correo'}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Moneda principal
            </label>
            <select
              value={profileForm.currency}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, currency: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="UYU">UYU - Peso Uruguayo</option>
              <option value="USD">USD - Dolar</option>
              <option value="ARS">ARS - Peso Argentino</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {savingProfile ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Tipos de movimientos</h2>
          </div>
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
        </div>

        <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-semibold text-slate-900">Tipos sugeridos</p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Gastos</p>
              <div className="flex flex-wrap gap-2">
                {quickExpenseTypes.map((template) => {
                  const IconComponent = iconCatalog[template.icon] || Tag;
                  return (
                    <button
                      key={`${template.type}-${template.name}`}
                      onClick={() => addFromTemplate(template)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                      <IconComponent size={14} style={{ color: template.color }} />
                      {template.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Ingresos</p>
              <div className="flex flex-wrap gap-2">
                {quickIncomeTypes.map((template) => {
                  const IconComponent = iconCatalog[template.icon] || Tag;
                  return (
                    <button
                      key={`${template.type}-${template.name}`}
                      onClick={() => addFromTemplate(template)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                      <IconComponent size={14} style={{ color: template.color }} />
                      {template.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Nuevo tipo</h3>
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
                  placeholder="Ej: Internet, UTE, Gastos Comunes"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Icono
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1">
                  {iconOptions.map((iconName) => {
                    const IconComponent = iconCatalog[iconName as IconName] || Tag;
                    const selected = formData.icon === iconName;

                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                        className={`h-9 rounded-lg border transition-colors flex items-center justify-center ${
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <IconComponent size={16} />
                      </button>
                    );
                  })}
                </div>
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
                  Guardar tipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryItem({ category, onDelete }: { category: Category; onDelete: () => void }) {
  const IconComponent = iconCatalog[category.icon as IconName] || Tag;

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <IconComponent size={14} style={{ color: category.color }} />
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