'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFinance } from '@/context/FinanceContext';
import { hasValidConfig } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddShoppingListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddShoppingListModal({ 
  open, 
  onOpenChange 
}: AddShoppingListModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { addShoppingList } = useFinance();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setLoading(true);
    
    try {
      await addShoppingList({
        name: name.trim(),
        description: description.trim() || undefined,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalItems: 0,
        completedItems: 0,
      });
      
      // Feedback al usuario
      toast({
        title: "Lista creada exitosamente",
        description: hasValidConfig 
          ? `"${name.trim()}" ha sido guardada en tu cuenta.`
          : `"${name.trim()}" ha sido creada (modo demo).`,
      });
      
      // Reset form
      setName('');
      setDescription('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error al crear lista de compras:', error);
      toast({
        title: "Error al crear lista",
        description: "No se pudo crear la lista. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto mx-2">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">Nueva Lista de Compras</DialogTitle>
          <DialogDescription className="text-sm">
            Crea una nueva lista para organizar tus compras pendientes.
          </DialogDescription>
          
          {!hasValidConfig && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Modo Demo:</strong> Los datos se guardarán temporalmente. Para guardado permanente, configura la conexión con Supabase.
              </AlertDescription>
            </Alert>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nombre de la lista *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Compras del super, Ropa de invierno..."
                className="ios-input-fix text-base sm:text-sm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Descripción (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe para qué es esta lista..."
                className="ios-input-fix text-base sm:text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !name.trim()}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px]"
            >
              {loading ? 'Creando...' : 'Crear Lista'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}