# 🔧 Guía de Configuración de Supabase en Netlify

## ❌ Problema Actual
La aplicación está funcionando en **modo demo** porque las variables de entorno de Supabase no están configuradas correctamente en Netlify. Esto significa:
- ✅ La aplicación funciona pero los datos NO se guardan permanentemente
- ❌ Las listas de compras se pierden al refrescar o cerrar la app
- ❌ Los datos no se sincronizan entre dispositivos

## ✅ Solución: Configurar Variables en Netlify

### Paso 1: Acceder a Netlify
1. Ve a [Netlify Dashboard](https://app.netlify.com)
2. Selecciona tu sitio `flujo-mvp`
3. Ve a **Site Settings** → **Environment Variables**

### Paso 2: Agregar Variables de Entorno
Agregar estas **2 variables exactamente**:

#### Variable 1:
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://omktnuyjxffilyoscnyn.supabase.co`

#### Variable 2:
- **Key:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`  
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ta3RudXlqeGZmaWx5b3NjbnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MTM1NjQsImV4cCI6MjA1MDQ4OTU2NH0.wxQlgoAH6fTsyL5Hh0hq9KZo-7W4F78H4NfP9K0xdqk`

### Paso 3: Verificar Configuración
1. Después de agregar las variables, Netlify hará **redeploy automático**
2. Espera 2-3 minutos a que termine el deploy
3. La app mostrará "Modo Demo" si aún hay problemas

## 🔍 Verificar si Funciona
Una vez configurado correctamente:
- ✅ Al crear listas de compras ya NO aparecerá el mensaje "Modo Demo"
- ✅ Los datos se guardarán permanentemente 
- ✅ Las listas persistirán entre sesiones
- ✅ Los datos se sincronizarán entre dispositivos

## 🚨 Notas Importantes
- Las variables DEBEN nombrarse **exactamente** como se indica
- Netlify redespliega automáticamente al cambiar variables
- El Key de Supabase es público (anon key), es seguro mostrarlo
- Si sigue en modo demo después de configurar, revisar la consola del navegador

## 📞 Soporte
Si después de seguir estos pasos la app sigue en modo demo:
1. Verifica que las variables estén exactamente como se indica
2. Espera al menos 3 minutos después del redeploy
3. Revisa la consola del navegador por errores