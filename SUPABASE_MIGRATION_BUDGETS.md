# Migración de Estructura de Budgets en Supabase
**Fecha: 10 de Mayo 2026**
**Versión: 2.0**

## Problema
La estructura anterior de budgets era muy simple (un budget = una categoría con límite). La nueva versión permite presupuestos complejos con múltiples categorías por presupuesto, diferentes tipos de ciclos, y mejor tracking de gastos.

## Impacto
- ✅ Presupuestos más flexibles y potentes
- ✅ Múltiples categorías por presupuesto
- ✅ Soporte para ciclos (mensual, trimestral, anual, etc.)
- ⚠️ **REQUIERE actualizar la BD en Supabase**

## Pasos de Migración

### Opción 1: Empezar de Cero (Recomendado para cuentas nuevas)
Si aún no has guardado datos críticos, la forma más simple es eliminar la tabla antigua y crear la nueva.

**1. Ir a Supabase Dashboard:**
- URL: https://app.supabase.com
- Selecciona tu proyecto

**2. Abre SQL Editor > New Query**

**3. Copia y pega este código:**

```sql
-- ⚠️  ADVERTENCIA: Esto eliminará los presupuestos existentes
-- Si quieres preservar datos, usa la Opción 2 en su lugar

-- Eliminar tabla vieja
DROP TABLE IF EXISTS public.budgets CASCADE;

-- Crear nueva estructura de budgets
CREATE TABLE public.budgets (
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

-- Crear tabla de categorías por presupuesto
CREATE TABLE public.budget_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  limit_amount DECIMAL NOT NULL,
  used_amount DECIMAL DEFAULT 0,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS budget_id UUID REFERENCES public.budgets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS budget_category_id UUID REFERENCES public.budget_categories(id) ON DELETE SET NULL;

-- Habilitar RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Users can view their own budgets" 
  ON public.budgets FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own budgets" 
  ON public.budgets FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own budgets" 
  ON public.budgets FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own budgets" 
  ON public.budgets FOR DELETE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own budget categories"
  ON public.budget_categories FOR SELECT
  USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

CREATE POLICY "Users can insert their own budget categories"
  ON public.budget_categories FOR INSERT
  WITH CHECK (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

CREATE POLICY "Users can update their own budget categories"
  ON public.budget_categories FOR UPDATE
  USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

CREATE POLICY "Users can delete their own budget categories"
  ON public.budget_categories FOR DELETE
  USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );
```

**4. Haz clic en "Run"**

✅ Listo. Ahora puedes crear presupuestos en tu cuenta personal.

---

### Opción 2: Migrar Datos Antiguos (Para cuentas con datos previos)

Si tienes presupuestos antiguos que quieres preservar como historial:

**1. Crea la nueva tabla:**
```sql
-- Crear tabla temporal para guardar datos antiguos
CREATE TABLE public.budgets_old AS SELECT * FROM public.budgets;

-- Eliminar tabla vieja
DROP TABLE IF EXISTS public.budgets CASCADE;

-- Crear nueva estructura
CREATE TABLE public.budgets (
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

CREATE TABLE public.budget_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  limit_amount DECIMAL NOT NULL,
  used_amount DECIMAL DEFAULT 0,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**2. Migra los datos (opcional):**
```sql
-- Convertir cada presupuesto viejo a la nueva estructura
INSERT INTO public.budgets (
  id, user_id, name, type, start_date, end_date, 
  max_income, max_spending_limit, status, total_spent, 
  remaining_balance, days_until_next, color, icon, is_active
)
SELECT 
  id, user_id, 
  category as name, 
  'monthly' as type,
  NOW()::DATE as start_date,
  (NOW() + INTERVAL '1 month')::DATE as end_date,
  limit_amount as max_income,
  limit_amount as max_spending_limit,
  'on-track' as status,
  used_amount as total_spent,
  (limit_amount - used_amount) as remaining_balance,
  30 as days_until_next,
  color, icon, TRUE as is_active
FROM public.budgets_old
WHERE deleted = false;

-- Crear categorías a partir de los presupuestos antiguos
INSERT INTO public.budget_categories (
  budget_id, name, limit_amount, used_amount, color, icon
)
SELECT 
  id as budget_id,
  name,
  max_spending_limit as limit_amount,
  total_spent as used_amount,
  color, icon
FROM public.budgets;

-- Eliminar tabla temporal
DROP TABLE public.budgets_old;
```

**3. Habilita RLS:**
```sql
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budget categories"
  ON public.budget_categories FOR SELECT
  USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

CREATE POLICY "Users can insert their own budget categories"
  ON public.budget_categories FOR INSERT
  WITH CHECK (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

CREATE POLICY "Users can update their own budget categories"
  ON public.budget_categories FOR UPDATE
  USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );

CREATE POLICY "Users can delete their own budget categories"
  ON public.budget_categories FOR DELETE
  USING (
    budget_id IN (
      SELECT id FROM public.budgets WHERE auth.uid()::text = user_id
    )
  );
```

---

## Verificación

Después de ejecutar el script, verifica que todo funciona:

**1. En tu código local:**
```bash
npm run build
```

**2. En el navegador:**
- Inicia sesión en tu cuenta personal
- Intenta crear un nuevo presupuesto
- Verifica que aparezca en la lista de presupuestos

**3. En Supabase:**
- Abre el SQL Editor
- Ejecuta: `SELECT * FROM public.budgets WHERE user_id = 'TU_USER_ID';`
- Deberías ver tus presupuestos

---

## Rollback (Si algo sale mal)

Si necesitas volver a la estructura anterior:

```sql
DROP TABLE IF EXISTS public.budget_categories CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;

-- Volver a crear tabla anterior
CREATE TABLE public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  limit_amount DECIMAL NOT NULL,
  used_amount DECIMAL DEFAULT 0,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Soporte

Si tienes problemas:
1. Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` estén en Netlify
2. Revisa los logs en Supabase Dashboard > Logs
3. Comprueba que RLS está habilitado en ambas tablas
4. Borra datos locales del navegador y reinicia sesión

