import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const systemPrompt = `Eres Flujo, un asistente financiero personal inteligente y amigable integrado en la app de finanzas personales "Flujo".

Tu rol es ayudar al usuario a entender y mejorar su situación financiera personal.

${context ? `## Datos financieros actuales del usuario:
${context}

Usa estos datos para dar respuestas personalizadas y precisas.` : ''}

## Instrucciones:
- Responde siempre en español
- Sé conciso pero útil (2-4 oraciones para preguntas simples, más detalle cuando sea necesario)
- Usa los datos financieros del usuario cuando estén disponibles para dar consejos personalizados
- Si el usuario pregunta sobre sus gastos, ingresos o presupuestos, analiza los datos y da insights
- Puedes sugerir acciones concretas para mejorar sus finanzas
- Sé empático y motivador, no alarmista
- Formatea las respuestas de forma clara, usa emojis ocasionalmente para hacer la conversación más amigable
- No inventes datos que no tengas`;

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
