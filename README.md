# 📱 Finely - Personal Finance Management

> 🚀 **Next.js 14 + TypeScript + Supabase** - Aplicación completa de finanzas personales con autenticación segura y gestión de listas de compras.

## ✨ Características Principales

🎯 **Gestión Financiera Completa**
- 💰 Transacciones (ingresos/gastos) con categorías
- 📊 Presupuestos mensuales con seguimiento visual
- 🎯 Metas de ahorro con progreso
- 📈 Dashboard con gráficos y estadísticas

🛒 **Listas de Compras** (**NUEVO**)
- ✅ Crear listas personalizadas con descripción
- 🔗 Productos con precios y links de tiendas
- ✅ Marcar como completado al comprar
- 📊 Progreso visual con barras de estado

🔐 **Seguridad & Autenticación**
- 🛡️ Supabase Auth con JWT tokens
- 🔒 Row Level Security (RLS) en base de datos
- 👤 Cada usuario ve solo sus propios datos

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (ver sección Setup)
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## ⚙️ Setup Completo

### 1. **Supabase Configuration**

1. Crear proyecto en [Supabase](https://supabase.com)
2. Executar el SQL del archivo `supabase-setup.sql` en SQL Editor
3. Copiar URL y API Key desde Settings > API

### 2. **Environment Variables**

Crear `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

**Para Netlify**, usar las variables de `NETLIFY_VARIABLES.txt`

### 3. **Database Schema**

El archivo `supabase-setup.sql` crea automáticamente:
- ✅ Tablas: `transactions`, `budgets`, `savings_goals`
- ✅ **NUEVO**: `shopping_lists`, `shopping_list_items`  
- ✅ Row Level Security (RLS) policies
- ✅ Funciones auxiliares para usuarios

## 📁 Estructura del Proyecto

```
📦 finely-app/
├── 📁 app/                    # Next.js 14 App Router
│   ├── 📁 shopping/          # 🆕 Shopping Lists
│   ├── 📁 transactions/      # Gestión de transacciones
│   ├── 📁 budgets/           # Control de presupuestos
│   └── 📁 savings/           # Metas de ahorro
├── 📁 components/
│   ├── 📁 shopping/          # 🆕 Componentes de listas
│   ├── 📁 auth/              # Autenticación
│   ├── 📁 ui/                # shadcn/ui components
│   └── 📁 layout/            # Navegación y layout
├── 📁 context/               # Estado global React
├── 📁 lib/                   # Utilidades y Supabase
└── 📄 supabase-setup.sql     # Setup de BD completo
```

## 🛠️ Tech Stack

**Frontend**
- ⚡ **Next.js 14** - App Router & Server Components
- 🔷 **TypeScript** - Type safety
- 🎨 **Tailwind CSS** - Utility-first styling
- 🧩 **shadcn/ui** - Modern UI components

**Backend & Database**
- 🗄️ **Supabase** - PostgreSQL + Auth + Real-time
- 🔐 **Row Level Security** - Database-level security
- 📡 **Real-time sync** - Live data updates

## 📱 Páginas Disponibles

| Ruta | Descripción | Autenticación |
|------|-------------|---------------|
| `/` | Dashboard principal | ✅ Requerida |
| `/transactions` | Registro de ingresos/gastos | ✅ Requerida |
| `/budgets` | Control de presupuestos | ✅ Requerida |
| `/savings` | Metas de ahorro | ✅ Requerida |
| `/shopping` | **🆕 Listas de compras** | ✅ Requerida |
| `/login` | Inicio de sesión | ❌ Pública |
| `/register` | Registro de usuario | ❌ Pública |

## 🛒 Nueva Funcionalidad: Shopping Lists

### Cómo usar:
1. **Crear lista**: Botón "Nueva Lista" → Nombre + Descripción
2. **Agregar productos**: Nombre + Precio (opcional) + Link (opcional)  
3. **Completar compras**: Checkbox para marcar como comprado
4. **Acceder a tiendas**: Click en ícono de enlace externo

### Integración técnica:
```typescript
// Tipos TypeScript
interface ShoppingList {
  id: string;
  name: string; 
  description?: string;
  items: ShoppingListItem[];
  totalItems: number;
  completedItems: number;
}

// Funciones CRUD con Supabase
await addShoppingList(list);
await updateShoppingList(id, updates);
await deleteShoppingList(id);
```

## 🔐 Seguridad

### Row Level Security Policies:
```sql
-- Solo el usuario puede ver sus propios datos
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid()::text = user_id);

-- Solo el usuario puede insertar sus propios datos  
CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
```

### Características de seguridad:
- ✅ JWT tokens con Supabase Auth
- ✅ RLS en todas las tablas
- ✅ Validación en cliente y servidor
- ✅ HTTPS obligatorio en producción

## 📊 Modos de Funcionamiento

### 🧪 **Demo Mode** (sin Supabase)
- Datos en memoria local
- Usuario demo con data de ejemplo
- Perfecto para testing

### 🚀 **Production Mode** (con Supabase)  
- Persistencia completa en BD
- Autenticación real
- Sync entre dispositivos

## 🚀 Deployment

### **Netlify** (Recomendado)
```bash
# 1. Conectar repo a Netlify
# 2. Configurar env vars desde NETLIFY_VARIABLES.txt
# 3. Deploy automático ✅
```

### **Vercel**
```bash
# 1. vercel --prod
# 2. Configurar Environment Variables
# 3. Deploy ✅
```

## 📋 Scripts Disponibles

```bash
npm run dev          # 🧪 Desarrollo con hot reload
npm run build        # 📦 Build de producción  
npm run start        # 🚀 Servidor producción
npm run lint         # 🔍 ESLint check
npm run type-check   # 📋 TypeScript check
```

## 🧪 Testing

```bash
# Verificar que todo compile
npm run build

# Verificar tipos
npm run type-check

# Verificar Supabase connection
# (Ver logs de debug en consola)
```

## 📈 Roadmap

### 🎯 Próximas funcionalidades:
- [ ] **Categorías personalizables** para shopping lists  
- [ ] **Compartir listas** entre usuarios
- [ ] **Notificaciones push** 
- [ ] **Exportar datos** a CSV/PDF
- [ ] **Modo offline** con sync
- [ ] **Mobile app** React Native

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Branch**: `git checkout -b feature/nueva-funcionalidad`
3. **Commit**: `git commit -m 'Add: nueva funcionalidad'`
4. **Push**: `git push origin feature/nueva-funcionalidad`  
5. **Pull Request** ✅

## 📞 Soporte

### 🐛 **Troubleshooting común:**

**Supabase no conecta:**
```bash
# Verificar env vars
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

**Error de build:**
```bash
# Limpiar cache  
rm -rf .next node_modules package-lock.json
npm install && npm run build
```

### 📚 **Documentación adicional:**
- 📖 **Setup detallado**: `AUTH_README.md`
- 🛒 **Shopping Lists**: `SHOPPING_LISTS_SUPABASE.md`
- 🚀 **Deploy**: `DEPLOY.md`

---

## ⭐ **Estado del Proyecto**

✅ **Production Ready** | 🆕 **Shopping Lists Integrated** | 🔐 **Fully Secured**

**Última actualización:** Abril 2026  
**Versión:** 1.0.0 - MVP con Shopping Lists

---

> 💡 **¿Preguntas?** Revisa `AUTH_README.md` para documentación detallada o abre un issue.

**Desarrollado con ❤️ usando Next.js 14 + Supabase**