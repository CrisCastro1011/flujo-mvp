'use client';

import { hasValidConfig } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupabaseConfigNotice() {
  if (hasValidConfig) {
    return null; // No mostrar nada si Supabase está configurado
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-xl">Configuración Requerida</CardTitle>
          </div>
          <CardDescription>
            Para usar autenticación, necesitas configurar Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Pasos para configurar:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Crea una cuenta en <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase</a></li>
              <li>Crea un nuevo proyecto</li>
              <li>Copia la URL del proyecto y la clave API</li>
              <li>Agrégalas al archivo <code className="bg-white px-1 rounded">.env.local</code></li>
            </ol>
          </div>

          <div className="bg-gray-50 border rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Contenido de .env.local:</p>
            <code className="text-xs text-gray-800 block">
              NEXT_PUBLIC_SUPABASE_URL=tu-url-aquí<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-aquí
            </code>
          </div>

          <Button 
            asChild 
            className="w-full"
            variant="outline"
          >
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Ir a Supabase
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Después de configurar, reinicia el servidor de desarrollo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}