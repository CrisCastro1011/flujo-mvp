-- SCRIPT SEGURO PARA AGREGAR CATEGORÍAS A SUPABASE
-- Copia y pega este código en: Supabase Dashboard > SQL Editor > New Query

-- 1. CREAR TABLAS (solo si no existen)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  budget_id UUID REFERENCES public.budgets(id) ON DELETE SET NULL,
  budget_category_id UUID REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('monthly', 'bi-monthly', 'quarterly', 'semi-annual', 'annual')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_income DECIMAL NOT NULL,
  max_spending_limit DECIMAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track', 'warning', 'exceeded')),
  total_spent DECIMAL DEFAULT 0,
  remaining_balance DECIMAL NOT NULL,
  days_until_next INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT 'Wallet',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- NUEVA TABLA: CATEGORÍAS POR PRESUPUESTO
CREATE TABLE IF NOT EXISTS public.budget_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  limit_amount DECIMAL NOT NULL,
  used_amount DECIMAL DEFAULT 0,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL NOT NULL,
  current_amount DECIMAL DEFAULT 0,
  deadline DATE NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- NUEVA TABLA: CATEGORÍAS PERSONALIZADAS POR USUARIO
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT NOT NULL DEFAULT 'Tag',
  color TEXT NOT NULL DEFAULT '#6B7280',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name, type)
);

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

-- 2. ACTIVAR ROW LEVEL SECURITY (RLS) - Solo si no está activado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = 'transactions' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = 'budgets' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = 'budget_categories' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = 'savings_goals' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- 3. CREAR POLÍTICAS DE SEGURIDAD (Solo el usuario puede ver sus datos)
-- Transacciones
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid()::text = user_id);

-- Presupuestos
DROP POLICY IF EXISTS "Users can view own budgets" ON public.budgets;
CREATE POLICY "Users can view own budgets" ON public.budgets
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own budgets" ON public.budgets;
CREATE POLICY "Users can insert own budgets" ON public.budgets
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own budgets" ON public.budgets;
CREATE POLICY "Users can update own budgets" ON public.budgets
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own budgets" ON public.budgets;
CREATE POLICY "Users can delete own budgets" ON public.budgets
  FOR DELETE USING (auth.uid()::text = user_id);

-- Categorías de presupuestos
DROP POLICY IF EXISTS "Users can view own budget_categories" ON public.budget_categories;
CREATE POLICY "Users can view own budget_categories" ON public.budget_categories
  FOR SELECT USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

DROP POLICY IF EXISTS "Users can insert own budget_categories" ON public.budget_categories;
CREATE POLICY "Users can insert own budget_categories" ON public.budget_categories
  FOR INSERT WITH CHECK (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

DROP POLICY IF EXISTS "Users can update own budget_categories" ON public.budget_categories;
CREATE POLICY "Users can update own budget_categories" ON public.budget_categories
  FOR UPDATE USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

DROP POLICY IF EXISTS "Users can delete own budget_categories" ON public.budget_categories;
CREATE POLICY "Users can delete own budget_categories" ON public.budget_categories
  FOR DELETE USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

-- Metas de Ahorro
DROP POLICY IF EXISTS "Users can view own savings_goals" ON public.savings_goals;
CREATE POLICY "Users can view own savings_goals" ON public.savings_goals
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own savings_goals" ON public.savings_goals;
CREATE POLICY "Users can insert own savings_goals" ON public.savings_goals
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own savings_goals" ON public.savings_goals;
CREATE POLICY "Users can update own savings_goals" ON public.savings_goals
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own savings_goals" ON public.savings_goals;
CREATE POLICY "Users can delete own savings_goals" ON public.savings_goals
  FOR DELETE USING (auth.uid()::text = user_id);

-- Categorías
DROP POLICY IF EXISTS "Users can view own categories" ON public.categories;
CREATE POLICY "Users can view own categories" ON public.categories
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own categories" ON public.categories;
CREATE POLICY "Users can insert own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own categories" ON public.categories;
CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own categories" ON public.categories;
CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid()::text = user_id);

-- Shopping Lists
DROP POLICY IF EXISTS "Users can view own shopping_lists" ON public.shopping_lists;
CREATE POLICY "Users can view own shopping_lists" ON public.shopping_lists
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own shopping_lists" ON public.shopping_lists;
CREATE POLICY "Users can insert own shopping_lists" ON public.shopping_lists
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own shopping_lists" ON public.shopping_lists;
CREATE POLICY "Users can update own shopping_lists" ON public.shopping_lists
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own shopping_lists" ON public.shopping_lists;
CREATE POLICY "Users can delete own shopping_lists" ON public.shopping_lists
  FOR DELETE USING (auth.uid()::text = user_id);

-- Shopping List Items
DROP POLICY IF EXISTS "Users can view own shopping_list_items" ON public.shopping_list_items;
CREATE POLICY "Users can view own shopping_list_items" ON public.shopping_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists sl 
      WHERE sl.id = shopping_list_id AND sl.user_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can insert own shopping_list_items" ON public.shopping_list_items;
CREATE POLICY "Users can insert own shopping_list_items" ON public.shopping_list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shopping_lists sl 
      WHERE sl.id = shopping_list_id AND sl.user_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can update own shopping_list_items" ON public.shopping_list_items;
CREATE POLICY "Users can update own shopping_list_items" ON public.shopping_list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists sl 
      WHERE sl.id = shopping_list_id AND sl.user_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can delete own shopping_list_items" ON public.shopping_list_items;
CREATE POLICY "Users can delete own shopping_list_items" ON public.shopping_list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists sl 
      WHERE sl.id = shopping_list_id AND sl.user_id = auth.uid()::text
    )
  );

-- 4. INSERTAR CATEGORÍAS POR DEFECTO (función para nuevos usuarios)
CREATE OR REPLACE FUNCTION create_default_categories(user_uuid TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, type, icon, color, is_default) VALUES
    -- Categorías de Ingresos
    (user_uuid, 'Salario', 'income', 'Briefcase', '#10B981', true),
    (user_uuid, 'Freelance', 'income', 'Code', '#3B82F6', true),
    (user_uuid, 'Inversiones', 'income', 'TrendingUp', '#8B5CF6', true),
    (user_uuid, 'Negocio', 'income', 'Building', '#F59E0B', true),
    (user_uuid, 'Regalo', 'income', 'Gift', '#EC4899', true),
    (user_uuid, 'Otro Ingreso', 'income', 'Plus', '#6B7280', true),
    
    -- Categorías de Gastos
    (user_uuid, 'Alquiler', 'expense', 'Home', '#3B82F6', true),
    (user_uuid, 'Comestibles', 'expense', 'ShoppingCart', '#10B981', true),
    (user_uuid, 'Comida', 'expense', 'Utensils', '#F97316', true),
    (user_uuid, 'Transporte', 'expense', 'Car', '#14B8A6', true),
    (user_uuid, 'Entretenimiento', 'expense', 'Tv', '#EC4899', true),
    (user_uuid, 'Salud', 'expense', 'Heart', '#EF4444', true),
    (user_uuid, 'Compras', 'expense', 'ShoppingBag', '#F59E0B', true),
    (user_uuid, 'Servicios', 'expense', 'Zap', '#6366F1', true),
    (user_uuid, 'Educación', 'expense', 'GraduationCap', '#8B5CF6', true),
    (user_uuid, 'Viajes', 'expense', 'Plane', '#06B6D4', true),
    (user_uuid, 'Otro', 'expense', 'Tag', '#6B7280', true);
END;
$$ LANGUAGE plpgsql;