# Configuración del Chatbot para Grupo Musical La Célula

Este documento explica cómo configurar el chatbot implementado en el sitio web para que funcione correctamente con Cloudflare Pages.

## Estructura de archivos

El chatbot está compuesto por los siguientes archivos clave:

- `/chatbot.js`: Script principal del chatbot (lado del cliente)
- `/functions/api/chatbot.js`: Función serverless de Cloudflare Pages para procesar solicitudes
- Integración directa en los archivos HTML como `index.html`

## Configuración en Cloudflare Pages

### 1. Configurar Secret para API Key

Para configurar la API Key como un Secret en Cloudflare Pages:

1. Inicia sesión en el dashboard de Cloudflare
2. Ve a la sección "Pages"
3. Selecciona tu proyecto (sitio de La Célula)
4. Ve a "Settings" > "Environment variables"
5. En la sección "Production" (y opcionalmente "Preview"), agrega un nuevo Secret:
   - Nombre: `API_KEY` 
   - Valor: Tu clave API de servicio AI (ej. OpenAI o Google Gemini)
6. Haz clic en "Save"

Cloudflare automáticamente hará disponible esta variable de entorno a tus funciones.

### 2. Despliegue de Funciones

Para que las funciones serverless funcionen correctamente:

1. Asegúrate de que el archivo `/functions/api/chatbot.js` esté incluido en tu repositorio
2. Cloudflare Pages detectará automáticamente este archivo y lo desplegará como una función
3. El endpoint estará disponible en `https://tu-dominio.com/api/chatbot`

### 3. Configuración de CORS (si es necesario)

Si experimentas problemas de CORS durante el desarrollo o cuando accedes desde otros dominios, puedes modificar la función para incluir los dominios específicos:

```js
// En /functions/api/chatbot.js
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // O especifica dominios exactos
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
```

## Implementación sin API externa (modo actual)

Actualmente, el chatbot está implementado para funcionar **sin necesidad de una API externa**, utilizando un sistema de reglas predefinidas para responder preguntas comunes sobre:

- Paquetes y servicios
- Bodas, XV años y eventos corporativos
- Precios y cotizaciones
- Música y repertorio
- Proceso de contratación
- Equipo técnico

Este enfoque tiene la ventaja de funcionar sin costos de API, pero con respuestas más limitadas.

## Actualización a un servicio de IA (opcional)

Para mejorar las capacidades del chatbot, puedes modificar la función de Cloudflare para usar un servicio de IA real:

1. Consigue una API Key de OpenAI, Google Gemini u otro proveedor
2. Configura la API Key como se indicó anteriormente
3. Modifica `/functions/api/chatbot.js` para hacer llamadas al API externo
4. Actualiza el formato de la respuesta para que coincida con lo que espera el front-end

Ejemplo de integración con OpenAI (añadir a la función de Cloudflare):

```javascript
async function callOpenAI(history, apiKey) {
  const messages = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.parts[0].text
  }));

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500
    })
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || 
         'Lo siento, no pude procesar tu mensaje.';
}
```

## Consejos de mantenimiento

1. **Actualización de respuestas predefinidas**: 
   - Edita el archivo `/functions/api/chatbot.js` para añadir nuevas respuestas o actualizar las existentes
   - El sistema de reglas está basado en patrones de expresiones regulares para detectar intenciones

2. **Monitoreo**:
   - Revisa los logs de Cloudflare Pages para detectar errores
   - Si implementas una integración con API externa, monitorea el uso para controlar costos

3. **Testing**:
   - Prueba el chatbot con diferentes tipos de preguntas para asegurar respuestas correctas
   - Verifica que las capturas de datos funcionen correctamente

## Problemas comunes

- **El chatbot no aparece**: Verifica que los archivos JS estén correctamente incluidos en el HTML
- **No envía mensajes**: Comprueba la consola del navegador para errores
- **Error de API Key**: Verifica que el Secret esté correctamente configurado en Cloudflare
- **Respuestas incorrectas**: Revisa y actualiza las reglas en `/functions/api/chatbot.js`