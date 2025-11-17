# Configuración del Chatbot para Grupo Musical La Célula

Este documento explica cómo configurar el chatbot para que funcione en un entorno de Cloudflare Pages.

## Estructura de archivos

El chatbot está compuesto por los siguientes archivos clave:

- `chatbot.js`: Script principal del chatbot (lado del cliente).
- `chatbot_ai.php`: Backend que procesa las solicitudes y se conecta con la API de Gemini.
- `chatbot.php`: Archivo que gestiona la interfaz del chatbot.

## Configuración de la API de Gemini

El proyecto está diseñado para ser desplegado en **Cloudflare Pages**. La clave de la API de Gemini debe ser configurada como un **secret** en el dashboard de Cloudflare para que el chatbot funcione correctamente.

### Pasos para configurar el Secret en Cloudflare

1.  **Inicia sesión en Cloudflare**: Accede a tu cuenta.
2.  **Ve a tu proyecto**: Navega a "Workers & Pages" y selecciona tu proyecto.
3.  **Accede a la configuración**: Ve a la pestaña "Settings" y luego a "Environment variables".
4.  **Agrega el Secret**: En la sección "Production environment variables", haz clic en "Add variable".
    -   **Variable name**: `GEMINI_API_KEY`
    -   **Value**: Pega aquí tu clave de la API de Google Gemini.
    -   Asegúrate de hacer clic en el botón "Encrypt" para guardarlo como un secret.
5.  **Guarda y despliega**: Guarda los cambios. Cloudflare inyectará esta variable de forma segura en el entorno de ejecución. Es posible que necesites volver a desplegar la última versión para que los cambios surtan efecto.

El código en `chatbot_ai.php` está preparado para leer esta variable de entorno automáticamente. **No es necesario modificar el código PHP para añadir la clave.**