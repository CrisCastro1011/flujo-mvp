# Despliegue en Netlify 🚀

Este proyecto está configurado para desplegarse fácilmente en Netlify.

## 📋 Preparativos

### 1. Subir a GitHub
```bash
git add .
git commit -m "Preparado para Netlify"
git push origin main
```

### 2. Configurar Supabase para producción
- Verifica que tu proyecto Supabase esté en modo producción
- Confirma que las RLS (Row Level Security) estén activadas
- Ejecuta el script SQL para crear las tablas y políticas

## 🌐 Despliegue en Netlify

### Paso 1: Conectar repositorio
1. Ve a [netlify.com](https://netlify.com) y regístrate
2. Click en "New site from Git"
3. Conecta tu repositorio de GitHub
4. Selecciona este proyecto

### Paso 2: Configuración automática
Netlify detectará automáticamente:
- ✅ Framework: Next.js
- ✅ Build command: `npm run build`
- ✅ Plugin: `@netlify/plugin-nextjs`

### Paso 3: Variables de entorno
En Netlify Dashboard > Site Settings > Environment Variables, agrega:

```
NEXT_PUBLIC_SUPABASE_URL=https://omktnuyjxffilyoscnyn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

### Paso 4: Desplegar
- Click "Deploy site"
- Netlify automáticamente construirá y desplegará tu aplicación

## ⚙️ Configuración incluida

- **netlify.toml**: Configuración optimizada para Next.js
- **Headers de seguridad**: X-Frame-Options, CSP, etc.
- **Cache headers**: Optimización de assets estáticos
- **Plugin de Next.js**: Soporte completo para SSR/SSG

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