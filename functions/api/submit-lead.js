/**
 * Web3Forms integration para captura de leads del chatbot
 * Cloudflare Pages Function
 */

export async function onRequest(context) {
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
    const leadData = await context.request.json();
    
    // Obtener Web3Forms access key
    const accessKey = context.env.WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Web3Forms no configurado' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Preparar datos para Web3Forms
    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('subject', `Nuevo lead del chatbot: ${leadData.name}`);
    formData.append('from_name', 'Chatbot La Célula');
    formData.append('name', leadData.name || 'No proporcionado');
    formData.append('email', leadData.email || 'No proporcionado');
    formData.append('phone', leadData.phone || 'No proporcionado');
    formData.append('event_type', leadData.eventType || 'No especificado');
    formData.append('message', leadData.conversationSummary || 'Sin resumen');
    formData.append('redirect', 'false');

    // Enviar a Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
