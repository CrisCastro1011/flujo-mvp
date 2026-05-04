'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye, CheckCircle, Circle, ExternalLink, Plus } from 'lucide-react';
import { ShoppingList, ShoppingListItem } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFinance } from '@/context/FinanceContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface ShoppingListCardProps {
  shoppingList: ShoppingList;
}

export default function ShoppingListCard({ shoppingList }: ShoppingListCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemLink, setNewItemLink] = useState('');
  const { updateShoppingList, deleteShoppingList } = useFinance();
  
  const progressValue = shoppingList.totalItems > 0 ? 
    (shoppingList.completedItems / shoppingList.totalItems) * 100 : 0;

  const handleToggleItem = async (itemId: string) => {
    const updatedItems = shoppingList.items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            completed: !item.completed,
            completedAt: !item.completed ? new Date().toISOString() : undefined
          }
        : item
    );
    
    const newCompletedItems = updatedItems.filter(item => item.completed).length;
    
    await updateShoppingList(shoppingList.id, {
      items: updatedItems,
      completedItems: newCompletedItems,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      price: newItemPrice ? parseFloat(newItemPrice) : undefined,
      link: newItemLink.trim() || undefined,
      completed: false
    };

    const updatedItems = [...shoppingList.items, newItem];
    
    await updateShoppingList(shoppingList.id, {
      items: updatedItems,
      totalItems: updatedItems.length,
      updatedAt: new Date().toISOString()
    });

    setNewItemName('');
    setNewItemPrice('');
    setNewItemLink('');
  };

  const handleDeleteItem = async (itemId: string) => {
    const updatedItems = shoppingList.items.filter(item => item.id !== itemId);
    const newCompletedItems = updatedItems.filter(item => item.completed).length;
    
    await updateShoppingList(shoppingList.id, {
      items: updatedItems,
      totalItems: updatedItems.length,
      completedItems: newCompletedItems,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {shoppingList.name}
              </CardTitle>
              {shoppingList.description && (
                <p className="text-sm text-gray-600 mt-1">{shoppingList.description}</p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetailModal(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteShoppingList(shoppingList.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>Progreso</span>
                <span>{shoppingList.completedItems}/{shoppingList.totalItems}</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
            
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="text-xs">
                {shoppingList.totalItems} artículos
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetailModal(true)}
              >
                Ver Lista
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{shoppingList.name}</DialogTitle>
            {shoppingList.description && (
              <DialogDescription>{shoppingList.description}</DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>Progreso total</span>
                <span>{shoppingList.completedItems}/{shoppingList.totalItems}</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>

            {/* Add new item */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900">Agregar nuevo artículo</h4>
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Nombre del producto"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Precio (opcional)"
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                  />
                  <Input
                    placeholder="Link (opcional)"
                    value={newItemLink}
                    onChange={(e) => setNewItemLink(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddItem} className="gap-2" disabled={!newItemName.trim()}>
                  <Plus size={16} />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Shopping items */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {shoppingList.items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay artículos en esta lista</p>
              ) : (
                shoppingList.items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      item.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => handleToggleItem(item.id)}
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${item.completed ? 'line-through text-green-700' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        {item.price && (
                          <p className="text-sm text-gray-600">
                            ${item.price.toLocaleString()}
                          </p>
                        )}
                        {item.completedAt && (
                          <p className="text-xs text-green-600">
                            Comprado: {new Date(item.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}