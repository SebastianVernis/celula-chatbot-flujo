/**
 * Chatbot API para Grupo Musical La Célula usando Cloudflare Pages Functions
 * Integrado con Web3Forms para captura de leads
 */

export async function onRequest(context) {
  // Manejar CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      },
      status: 204
    });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const requestData = await context.request.json();
    
    if (!requestData || !requestData.history) {
      return new Response(JSON.stringify({ error: 'Datos inválidos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Obtener API key de Gemini
    const apiKey = context.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Fallback a respuestas locales si no hay API key
      const botResponse = generateLocalResponse(requestData.history);
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: botResponse }] } }]
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Llamar a Gemini AI
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: requestData.history,
          generationConfig: {
            temperature: 0.7,
            topP: 1,
            topK: 1,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error("Gemini API Error:", geminiResponse.status, errorData);
      // Usar fallback si la API falla
      const botResponse = generateLocalResponse(requestData.history);
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: botResponse }] } }]
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const data = await geminiResponse.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Error: ${error.message}` 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

function generateLocalResponse(history) {
  const lastUserMessage = history.slice(-1)[0]?.parts[0]?.text || '';
  const userMessageLower = lastUserMessage.toLowerCase();
  
  const patterns = {
    'servicios|paquetes|ofrecen': 'Ofrecemos 3 paquetes: Event Plus, Party y Live. ¿Cuál te interesa?',
    'precio|costo|cotiz': 'Para una cotización personalizada, contáctanos por WhatsApp al 55 3541 2631',
    'musica|repertorio': 'Tocamos cumbia, salsa, rock, pop, baladas y más. ¿Qué género prefieres?',
    'boda|matrimonio': 'Especializados en bodas. Ofrecemos música para ceremonia, recepción y fiesta.',
    'hola|buenos': '¡Hola! Soy el asistente de Grupo Musical La Célula. ¿En qué puedo ayudarte?'
  };
  
  for (const pattern in patterns) {
    if (new RegExp(pattern, 'i').test(userMessageLower)) {
      return patterns[pattern];
    }
  }
  
  return 'Gracias por tu mensaje. ¿Podrías contarme más sobre tu evento?';
}
