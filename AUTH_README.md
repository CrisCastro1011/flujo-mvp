# Sistema de Autenticación - Configuración

## 🚀 Lo que se agregó

Se implementó un sistema completo de autenticación que incluye:

- ✅ **Formulario de login** con email y contraseña
- ✅ **Opción de mostrar/ocultar contraseña** (botón con ojo)
- ✅ **Formulario de registro** para nuevos usuarios
- ✅ **Protección de rutas** - Solo usuarios autenticados pueden acceder
- ✅ **Información del usuario** en el sidebar
- ✅ **Botón de cerrar sesión** en sidebar y móvil
- ✅ **Validación de formularios** con mensajes de error
- ✅ **Notificaciones** para feedback del usuario

## 🔧 Para completar la configuración

### 1. Configurar Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. En el dashboard, ve a **Settings** → **API**
4. Copia la **URL del proyecto** y la **Clave anónima pública**

### 2. Configurar variables de entorno

Actualiza el archivo `.env.local` con tus credenciales reales:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publishable-de-supabase
```

### 3. Configurar autenticación en Supabase

1. En tu dashboard de Supabase, ve a **Authentication** → **Settings**
2. Configura la **Site URL**: `http://localhost:3000` (desarrollo)
3. En **Redirect URLs** agrega: `http://localhost:3000/**`

## 📱 Rutas disponibles

- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/` - Dashboard (requiere autenticación)
- `/transactions` - Transacciones (requiere autenticación)
- `/budgets` - Presupuestos (requiere autenticación)
- `/savings` - Ahorros (requiere autenticación)

## 🎯 Características del formulario

### Campos de login:
- **Email**: Validación de formato de email
- **Contraseña**: Mínimo 6 caracteres
- **Botón mostrar/ocultar**: Ícono de ojo para alternar visibilidad

### Funcionalidades:
- Cambio entre modo login/registro
- Validación en tiempo real
- Mensajes de error específicos
- Estados de carga
- Redirección automática después del login

## 🛡️ Seguridad implementada

- ✅ Protección de rutas privadas
- ✅ Redirección automática para usuarios no autenticados
- ✅ Validación de formularios en cliente y servidor
- ✅ Gestión segura de tokens con Supabase
- ✅ Logout seguro que limpia toda la sesión

## 🧪 Para probar

1. Configura las variables de entorno
2. Ejecuta `npm run dev`
3. Ve a `http://localhost:3000`
4. Serás redirigido a `/login`
5. Crea una cuenta o inicia sesión
6. Explora la aplicación autenticada

¡El sistema está listo para usar! 🎉