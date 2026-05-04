# 📱 FINELY - Aplicación de Finanzas Personales

## 🌟 Descripción General

**Finely** es una aplicación completa de finanzas personales desarrollada en Next.js 14 con TypeScript, Tailwind CSS y Supabase. Permite a los usuarios gestionar sus transacciones, presupuestos, metas de ahorro y ahora también **listas de compras** de forma organizada y segura.

## 🎯 Características Principales

### 💰 **Gestión Financiera**
- ✅ **Transacciones**: Registro de ingresos y gastos con categorías personalizables
- ✅ **Presupuestos**: Control de límites de gastos mensuales por categorías
- ✅ **Metas de Ahorro**: Seguimiento de objetivos financieros con progreso visual
- ✅ **Dashboard**: Resumen completo con gráficos y estadísticas

### 🛒 **Listas de Compras** (NUEVO)
- ✅ **Crear listas personalizadas** con nombre y descripción
- ✅ **Agregar productos** con precio opcional y links de tiendas
- ✅ **Marcar como completado** cuando realices la compra
- ✅ **Links externos** para acceder directamente a tiendas online
- ✅ **Seguimiento de progreso** visual con barras de progreso
- ✅ **Persistencia en Supabase** con seguridad por usuario

### 🔐 **Sistema de Autenticación**
- ✅ **Registro e inicio de sesión** con Supabase Auth
- ✅ **Protección de rutas** - Solo usuarios autenticados pueden acceder
- ✅ **Row Level Security (RLS)** - Cada usuario solo ve sus propios datos
- ✅ **Gestión de sesiones** segura con tokens JWT

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de CSS utility-first
- **shadcn/ui** - Componentes UI modernos y accesibles
- **Lucide React** - Iconografía consistente

### Backend & Base de Datos
- **Supabase** - Backend-as-a-Service con PostgreSQL
- **Row Level Security (RLS)** - Seguridad a nivel de base de datos
- **Real-time subscriptions** - Sincronización en tiempo real

### Herramientas de Desarrollo
- **ESLint & Prettier** - Linting y formateo de código
- **PostCSS** - Procesamiento de CSS
- **Vercel/Netlify** - Despliegue optimizado

## 📊 Estructura de Datos

### Tablas Principales en Supabase:

#### **transactions**
```sql
- id (UUID, PK)
- user_id (TEXT, FK)
- amount (DECIMAL)
- type ('income' | 'expense')
- category (TEXT)
- description (TEXT)
- date (DATE)
```

#### **budgets**
```sql
- id (UUID, PK)
- user_id (TEXT, FK)
- category (TEXT)
- limit_amount (DECIMAL)
- used_amount (DECIMAL)
- color (TEXT)
- icon (TEXT)
```

#### **savings_goals**
```sql
- id (UUID, PK)
- user_id (TEXT, FK)
- name (TEXT)
- target_amount (DECIMAL)
- current_amount (DECIMAL)
- deadline (DATE)
- color (TEXT)
- icon (TEXT)
```

#### **shopping_lists** (NUEVO)
```sql
- id (UUID, PK)
- user_id (TEXT, FK)
- name (TEXT)
- description (TEXT)
- total_items (INTEGER)
- completed_items (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **shopping_list_items** (NUEVO)
```sql
- id (UUID, PK)
- shopping_list_id (UUID, FK)
- name (TEXT)
- price (DECIMAL, opcional)
- link (TEXT, opcional)
- completed (BOOLEAN)
- completed_at (TIMESTAMP)
```

## 🚀 Configuración e Instalación

### 1. Prerrequisitos
```bash
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
```

### 2. Clonar e instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Crear proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota la **URL del proyecto** y **Clave pública**

#### 3.2 Ejecutar SQL de configuración
1. Ve a **Supabase Dashboard > SQL Editor**
2. Ejecuta el contenido completo del archivo `supabase-setup.sql`
3. Esto creará todas las tablas, políticas RLS y funciones necesarias

#### 3.3 Configurar variables de entorno
Crea un archivo `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publishable
```

O para **Netlify**, usa las variables del archivo `NETLIFY_VARIABLES.txt`:
```
NEXT_PUBLIC_SUPABASE_URL=https://omktnuyjxffilyoscnyn.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_wx15ggQ8cIGSXfk-7AdCwQ_XLWBgJMS
```

### 4. Ejecutar la aplicación
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📱 Páginas y Rutas

### 🏠 **Rutas Principales**
- `/` - **Dashboard**: Resumen general con gráficos
- `/transactions` - **Transacciones**: Gestión completa de ingresos/gastos
- `/budgets` - **Presupuestos**: Control de límites por categorías
- `/savings` - **Ahorros**: Seguimiento de metas financieras
- `/shopping` - **Listas de Compras**: Nueva funcionalidad completa
- `/settings` - **Configuración**: Ajustes del usuario

### 🔐 **Rutas de Autenticación**
- `/login` - **Inicio de sesión** con email/password
- `/register` - **Registro** de nuevos usuarios

### 🛡️ **Protección de Rutas**
Todas las rutas principales están protegidas por el componente `AuthGuard` que:
- Verifica la autenticación del usuario
- Redirige a `/login` si no está autenticado
- Muestra estado de carga personalizado

## 🎨 Componentes y Arquitectura

### 📁 **Estructura del Proyecto**
```
/app                    # App Router de Next.js
  /shopping            # Nueva funcionalidad de listas
  /budgets             # Gestión de presupuestos
  /transactions        # Registro de transacciones
  /savings             # Metas de ahorro
  
/components            # Componentes reutilizables
  /auth               # Autenticación
  /shopping           # Listas de compras (NUEVO)
  /budgets            # Presupuestos
  /ui                 # Componentes base (shadcn/ui)
  /layout             # Layout y navegación
  
/context              # Estados globales
  AuthContext.tsx     # Autenticación
  FinanceContext.tsx  # Datos financieros + shopping lists
  
/lib                  # Utilidades y configuración
  supabase.ts         # Cliente de Supabase
  supabaseFinance.ts  # Funciones CRUD
  types.ts            # Tipos TypeScript
```

### 🧩 **Componentes Clave**

#### **Shopping Lists** (NUEVO)
- `ShoppingListCard` - Tarjeta individual de lista con progreso
- `AddShoppingListModal` - Modal para crear nuevas listas
- Integración completa con Supabase para persistencia

#### **Sistema de Autenticación**
- `AuthGuard` - Protección de rutas
- `LoginForm` - Formulario con validación
- `AuthContext` - Estado global de usuario

#### **Gestión Financiera**
- `TransactionItem` - Item individual de transacción
- `BudgetCard` - Tarjeta de presupuesto con progreso
- `SavingsGoalCard` - Meta de ahorro con seguimiento

## 🔐 Seguridad y Privacidad

### 🛡️ **Row Level Security (RLS)**
Todas las tablas tienen políticas que garantizan:
```sql
-- Solo el usuario puede ver sus propios datos
FOR SELECT USING (auth.uid()::text = user_id)

-- Solo el usuario puede insertar sus propios datos  
FOR INSERT WITH CHECK (auth.uid()::text = user_id)

-- Solo el usuario puede actualizar sus propios datos
FOR UPDATE USING (auth.uid()::text = user_id)

-- Solo el usuario puede eliminar sus propios datos
FOR DELETE USING (auth.uid()::text = user_id)
```

### 🔒 **Características de Seguridad**
- ✅ **Autenticación JWT** con Supabase Auth
- ✅ **Políticas RLS** en todas las tablas
- ✅ **Validación de formularios** en cliente y servidor
- ✅ **Sanitización de datos** antes de guardar
- ✅ **HTTPS** obligatorio en producción

## 🌟 Nuevas Funcionalidades - Shopping Lists

### 📝 **Cómo Usar las Listas de Compras**

1. **Crear Lista**:
   - Ve a `/shopping`
   - Haz clic en "Nueva Lista"
   - Ingresa nombre y descripción opcional

2. **Agregar Productos**:
   - Abre cualquier lista
   - Usa el formulario para agregar:
     - Nombre del producto (requerido)
     - Precio (opcional)
     - Link de tienda (opcional)

3. **Gestionar Compras**:
   - Marca productos como completados ✅
   - Accede a links de tiendas con un clic 🔗
   - Elimina productos no necesarios 🗑️

### 🎯 **Características Avanzadas**
- **Progreso visual**: Barras que muestran % completado
- **Persistencia completa**: Todos los datos se guardan en Supabase
- **Sincronización**: Cambios en tiempo real entre dispositivos
- **Seguridad**: Solo tú puedes ver tus listas privadas

## 📊 Modos de Funcionamiento

### 🧪 **Modo Demo**
Sin configuración de Supabase:
- Datos se almacenan temporalmente en memoria
- Perfecto para testing y desarrollo
- Usuario demo con datos de ejemplo

### 🚀 **Modo Producción** 
Con Supabase configurado:
- Persistencia completa en base de datos
- Autenticación real de usuarios
- Sincronización entre dispositivos
- Backup automático

## 🔄 Despliegue

### 📦 **Netlify** (Recomendado)
1. Conecta el repositorio a Netlify
2. Configura las variables de entorno desde `NETLIFY_VARIABLES.txt`
3. El deploy es automático en cada push

### ⚡ **Vercel**
1. Conecta con Vercel CLI o GitHub
2. Configura las variables de entorno
3. Deploy automático desde main branch

### 🐳 **Docker**
```dockerfile
# Incluir Dockerfile si es necesario
```

## 🧪 Testing y Desarrollo

### 🛠️ **Scripts Disponibles**
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint 
npm run type-check   # Verificación de tipos
```

### 🐛 **Debugging**
La aplicación incluye logs de debug para Supabase:
```
🔧 SUPABASE DEBUG: 
URL: SET/NOT SET
KEY: SET/NOT SET  
✅ hasValidConfig: true/false
```

## 📈 Próximas Funcionalidades

### 🎯 **En Desarrollo**
- [ ] **Categorías personalizables** para listas de compras
- [ ] **Compartir listas** entre usuarios
- [ ] **Notificaciones push** para recordatorios
- [ ] **Importar/exportar** datos financieros
- [ ] **Reportes avanzados** con visualizaciones

### 🔄 **Mejoras Continuas**
- [ ] **Performance optimization** con React Query
- [ ] **Offline support** con Service Workers
- [ ] **Mobile app** con React Native
- [ ] **Integración bancaria** con APIs de bancos

## 📞 Soporte y Contribuciones

### 🆘 **Resolución de Problemas**

#### Supabase no conecta:
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

#### Error de construcción:
```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### 🤝 **Contribuir**
1. Fork del repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## ✨ **¡La aplicación está lista para usar!**

Con todas las funcionalidades implementadas, incluyendo las **nuevas listas de compras integradas con Supabase**, Finely es una solución completa para gestión de finanzas personales.

**Estado actual:** ✅ **Producción Ready**  
**Última actualización:** Abril 2026 - Shopping Lists + Supabase Integration

🎉 **¡Disfruta gestionando tus finanzas de forma organizada!**