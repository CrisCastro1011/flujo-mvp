# 🚀 Guía de Despliegue - Finely

## 📋 Pre-Despliegue Checklist

### ✅ **Verificaciones Técnicas**
- [ ] `npm run build` ejecuta sin errores
- [ ] `npm run type-check` pasa todas las verificaciones
- [ ] Variables de entorno configuradas correctamente
- [ ] Supabase SQL ejecutado y tablas creadas
- [ ] Funcionalidad de Shopping Lists testada localmente

### ✅ **Supabase Configuration** 
- [ ] Proyecto Supabase creado
- [ ] `supabase-setup.sql` ejecutado completamente
- [ ] Tablas verificadas: `transactions`, `budgets`, `savings_goals`, `shopping_lists`, `shopping_list_items`
- [ ] Row Level Security (RLS) activado en todas las tablas
- [ ] Authentication configurado para tu dominio

---

## 🌐 Despliegue en Netlify (Recomendado)

### **1. Preparación del Repositorio**
```bash
# Asegurar que todo esté commiteado
git add .
git commit -m "feat: Shopping Lists integration complete"
git push origin main
```

### **2. Configurar Netlify**

#### **2.1 Conectar Repositorio**
1. Ve a [Netlify Dashboard](https://app.netlify.com)
2. **New site from Git** 
3. Conecta con GitHub/GitLab
4. Selecciona tu repositorio
5. **Deploy settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

#### **2.2 Variables de Entorno**
Usar las variables del archivo `NETLIFY_VARIABLES.txt`:

**Site Settings** > **Environment variables** > **Add a variable**

```bash
# Variable 1
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://omktnuyjxffilyoscnyn.supabase.co

# Variable 2  
Key: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_wx15ggQ8cIGSXfk-7AdCwQ_XLWBgJMS
```

#### **2.3 Deploy**
1. **Deploy site** 
2. Netlify detectará automáticamente Next.js
3. El deploy tomará ~2-3 minutos
4. ✅ **Site live!**

### **3. Configurar Supabase para Producción**

#### **3.1 Site URL Configuration**
En **Supabase Dashboard** > **Authentication** > **URL Configuration**:

```bash
Site URL: https://tu-sitio.netlify.app
Additional Redirect URLs: 
  - https://tu-sitio.netlify.app/**
  - https://tu-sitio.netlify.app/auth/callback
```

#### **3.2 CORS Configuration** 
En **Settings** > **API**:
```bash
Allowed origins: 
  - https://tu-sitio.netlify.app
  - http://localhost:3000 (para desarrollo)
```

---

## ⚡ Despliegue en Vercel

### **1. Vercel CLI Setup**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy desde directorio del proyecto
vercel --prod
```

### **2. Variables de Entorno en Vercel**
```bash
# Opción 1: CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# Opción 2: Dashboard
# Ve a Project Settings > Environment Variables
```

### **3. Deploy Automático**
```bash
# Conectar con Git para deploys automáticos
vercel --prod
# Seguir instrucciones para conectar repositorio
```

---

## 🔧 Post-Deploy Configuration

### **1. Verificar Funcionalidad**

#### **Checklist de Testing en Producción:**
- [ ] ✅ Login/Register funciona
- [ ] ✅ Dashboard carga correctamente  
- [ ] ✅ Transacciones se guardan en Supabase
- [ ] ✅ Presupuestos persistentes
- [ ] ✅ Metas de ahorro funcionan
- [ ] ✅ **Shopping Lists**: Crear/editar/eliminar
- [ ] ✅ **Shopping Items**: Agregar/completar/links externos
- [ ] ✅ Logout limpia la sesión

#### **Testing URLs:**
```bash
# Páginas principales
https://tu-sitio.com/                # Dashboard
https://tu-sitio.com/transactions   # Transacciones  
https://tu-sitio.com/budgets        # Presupuestos
https://tu-sitio.com/savings        # Ahorros
https://tu-sitio.com/shopping       # Shopping Lists (NUEVO)

# Autenticación
https://tu-sitio.com/login          # Login
https://tu-sitio.com/register       # Registro
```

---

## 🔐 Security Checklist

### **Variables de Entorno**
- [ ] ✅ Nunca commitear `.env.local` 
- [ ] ✅ Solo usar variables `NEXT_PUBLIC_*` para datos públicos
- [ ] ✅ Verificar que Supabase Publishable Key sea la correcta
- [ ] ✅ Configurar Site URL en Supabase correctamente

### **Supabase Security**
- [ ] ✅ RLS habilitado en todas las tablas
- [ ] ✅ Políticas de seguridad configuradas
- [ ] ✅ Solo usuarios autenticados pueden acceder a datos
- [ ] ✅ CORS configurado solo para tu dominio

### **General**
- [ ] ✅ HTTPS habilitado (automático en Netlify/Vercel)
- [ ] ✅ Headers de seguridad configurados
- [ ] ✅ No hay console.logs con datos sensibles en producción

---

## 📊 Troubleshooting común

### **❌ "Supabase connection failed"**
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# En production, verificar en deploy logs
```

### **❌ "RLS policy error"**
```sql
-- Verificar políticas en Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename IN 
  ('transactions', 'budgets', 'savings_goals', 'shopping_lists', 'shopping_list_items');
```

### **❌ "Shopping Lists not loading"** 
```bash
# Verificar que las tablas existen
# Supabase Dashboard > Table Editor
# Debe mostrar: shopping_lists, shopping_list_items

# Verificar datos de ejemplo
SELECT * FROM shopping_lists LIMIT 5;
SELECT * FROM shopping_list_items LIMIT 5;
```

### **❌ "Build failing"**
```bash
# Limpiar cache local
rm -rf .next node_modules package-lock.json
npm install
npm run build

# Verificar TypeScript
npm run type-check
```

---

## ✅ **Deploy Success!**

Si has seguido esta guía, tu aplicación **Finely** debería estar funcionando perfectamente en producción con:

🎯 **Funcionalidades Core:**
- ✅ Autenticación segura
- ✅ Gestión financiera completa  
- ✅ **Shopping Lists** con persistencia en Supabase
- ✅ UI/UX optimizada y responsive

🔐 **Seguridad:**
- ✅ Row Level Security configurado
- ✅ HTTPS habilitado
- ✅ Variables de entorno seguras

🚀 **Performance:**
- ✅ Build optimizado
- ✅ Server-side rendering
- ✅ Image optimization

---

> **🎉 ¡Felicidades!** Tu aplicación de finanzas personales está live y lista para usuarios reales.

**URLs útiles Post-Deploy:**
- 📱 **App**: `https://tu-sitio.netlify.app`
- 🗄️ **Database**: [Supabase Dashboard](https://supabase.com/dashboard)
- 📊 **Analytics**: Netlify/Vercel Dashboard
- 🔧 **Logs**: Platform-specific logging

**Soporte:** Si encuentras issues, revisa los logs de deploy y asegúrate de que todas las tablas de Supabase estén creadas correctamente.

## 🔧 Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Verificar tipos
npm run typecheck

# Linting
npm run lint
```

## 🐛 Resolución de problemas

### Error de build
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de build en Netlify Dashboard

### Error de autenticación
- Confirma que Supabase URL y Key sean correctos
- Verifica que las políticas RLS estén configuradas

### Error de rutas
- Las rutas de Next.js se manejan automáticamente con el plugin

## 📱 Después del despliegue

1. **Configura dominio personalizado** (opcional)
2. **Activa HTTPS** (automático en Netlify)
3. **Configura redirects** si necesitas dominios adicionales
4. **Monitorea analytics** en Netlify Dashboard

## 🔒 Seguridad

- ✅ Variables de entorno seguras
- ✅ HTTPS automático
- ✅ Headers de seguridad configurados
- ✅ RLS activado en Supabase
- ✅ Datos separados por usuario

¡Tu aplicación de finanzas está lista para producción! 🎉