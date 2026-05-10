# Script: Crear Tablas de Shopping Lists en Supabase

Copia y pega este código en **Supabase Dashboard > SQL Editor > New Query**:

```sql
-- NUEVAS TABLAS: LISTAS DE COMPRAS
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL,
  link TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para shopping_lists
DROP POLICY IF EXISTS "Users can view own shopping lists" ON public.shopping_lists;
CREATE POLICY "Users can view own shopping lists" ON public.shopping_lists
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own shopping lists" ON public.shopping_lists;
CREATE POLICY "Users can insert own shopping lists" ON public.shopping_lists
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own shopping lists" ON public.shopping_lists;
CREATE POLICY "Users can update own shopping lists" ON public.shopping_lists
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own shopping lists" ON public.shopping_lists;
CREATE POLICY "Users can delete own shopping lists" ON public.shopping_lists
  FOR DELETE USING (auth.uid()::text = user_id);

-- Crear políticas RLS para shopping_list_items
DROP POLICY IF EXISTS "Users can view own shopping list items" ON public.shopping_list_items;
CREATE POLICY "Users can view own shopping list items" ON public.shopping_list_items
  FOR SELECT USING (
    shopping_list_id IN (
      SELECT id FROM public.shopping_lists 
      WHERE auth.uid()::text = user_id
    )
  );

DROP POLICY IF EXISTS "Users can insert own shopping list items" ON public.shopping_list_items;
CREATE POLICY "Users can insert own shopping list items" ON public.shopping_list_items
  FOR INSERT WITH CHECK (
    shopping_list_id IN (
      SELECT id FROM public.shopping_lists 
      WHERE auth.uid()::text = user_id
    )
  );

DROP POLICY IF EXISTS "Users can update own shopping list items" ON public.shopping_list_items;
CREATE POLICY "Users can update own shopping list items" ON public.shopping_list_items
  FOR UPDATE USING (
    shopping_list_id IN (
      SELECT id FROM public.shopping_lists 
      WHERE auth.uid()::text = user_id
    )
  );

DROP POLICY IF EXISTS "Users can delete own shopping list items" ON public.shopping_list_items;
CREATE POLICY "Users can delete own shopping list items" ON public.shopping_list_items
  FOR DELETE USING (
    shopping_list_id IN (
      SELECT id FROM public.shopping_lists 
      WHERE auth.uid()::text = user_id
    )
  );
```

**Pasos:**
1. Abre https://app.supabase.com → Tu proyecto
2. Ve a **SQL Editor** → **New Query**
3. Limpia el editor y copia el SQL de arriba
4. Haz clic en **Run**

✅ Listo. Ahora la sección de Listas de Compras debería funcionar.
