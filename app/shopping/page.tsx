'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddShoppingListModal from '@/components/shopping/AddShoppingListModal';
import ShoppingListCard from '@/components/shopping/ShoppingListCard';
import { useFinance } from '@/context/FinanceContext';

export default function ShoppingPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { shoppingLists, loading } = useFinance();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Listas de Compras</h1>
          <p className="text-gray-600 mt-2">Organiza y trackea tus compras pendientes</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus size={20} />
          Nueva Lista
        </Button>
      </div>

      {shoppingLists.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes listas de compras</h3>
            <p className="text-gray-600 mb-6">Crea tu primera lista para empezar a organizarte</p>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus size={20} />
              Crear Primera Lista
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shoppingLists.map((list) => (
            <ShoppingListCard key={list.id} shoppingList={list} />
          ))}
        </div>
      )}

      <AddShoppingListModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
    </div>
  );
}