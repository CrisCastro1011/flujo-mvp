import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Falta GOOGLE_GENERATIVE_AI_API_KEY en variables de entorno.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Payload invalido: messages es requerido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
  } catch (error) {
    console.error('[api/chat] error:', error);
    return new Response(
      JSON.stringify({ error: 'No se pudo generar respuesta del asistente.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
