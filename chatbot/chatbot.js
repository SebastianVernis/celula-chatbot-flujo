class ChatbotManager {
    constructor() {
        this.chatWindow = document.getElementById('chat-window');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.closeBtn = document.getElementById('close-btn');
        this.leadForm = document.getElementById('lead-form');
        this.chatInputArea = document.getElementById('chat-input-area');
        this.emailSent = false; // Flag para evitar envíos múltiples
        this.sessionStartTime = new Date().toISOString();
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadState();
    }

    saveState() {
        const state = {
            chatHistory: this.chatHistory,
            leadData: this.leadData,
            isChatActive: this.leadForm.style.display === 'none'
        };
        sessionStorage.setItem('chatbotState', JSON.stringify(state));
    }

    loadState() {
        const savedState = sessionStorage.getItem('chatbotState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.chatHistory = state.chatHistory || [];
            this.leadData = state.leadData || {};

            if (state.isChatActive) {
                this.leadForm.style.display = 'none';
                this.chatWindow.style.display = 'flex';
                this.chatInputArea.style.display = 'flex';
                this.repopulateChat();
            }
        } else {
            this.chatHistory = [];
            this.leadData = {};
        }
    }

    repopulateChat() {
        this.chatHistory.forEach(item => {
            if (item.role === 'user') {
                this.appendMessage(item.parts[0].text, 'user');
            } else if (item.role === 'model') {
                this.appendMessage(item.parts[0].text, 'bot');
            }
        });
    }

    setupEventListeners() {
        this.closeBtn?.addEventListener('click', () => {
            parent.postMessage('close-chatbot', '*');
        });

        this.sendBtn?.addEventListener('click', () => this.handleUserInput());

        this.userInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });

        this.userInput?.addEventListener('input', this.autoResize.bind(this));

        this.leadForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    autoResize(event) {
        const element = event.target;
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    }

    async handleFormSubmission() {
        const nameInput = document.getElementById('name-input');
        const emailInput = document.getElementById('email-input');
        const phoneInput = document.getElementById('phone-input');

        this.leadData.name = nameInput.value.trim();
        this.leadData.email = emailInput.value.trim();
        this.leadData.phone = phoneInput.value.trim();

        if (this.leadData.name && this.leadData.email && this.leadData.phone) {
            this.leadForm.style.display = 'none';
            this.chatWindow.style.display = 'flex';
            this.chatInputArea.style.display = 'flex';
            await this.startChat();
            this.saveState();
        }
    }

    async startChat() {
        await this.loadInitialContext();
        // Mensaje de saludo simple y directo
        this.appendMessage('¡Hola! Soy **OMEX-IA** 🤖 ¿Cómo puedo ayudarte con tus necesidades **logísticas** hoy?', 'bot');
    }

    async loadInitialContext() {
        try {
            const initialContext = `Eres OMEX-IA, el asistente virtual experto de OMEX TL. 

DIRECTRICES CRÍTICAS:
1. NUNCA asumas que OMEX TL NO brinda un servicio relacionado con logística y transporte
2. SIEMPRE delegue a ventas cualquier proceso de cotización o tercerización de servicios
3. Cuando no tengas información específica sobre un servicio logístico, responde: "OMEX TL puede brindar ese servicio. Te conecto con ventas para una cotización personalizada"

Tu deber es brindar información al usuario exclusivamente de Logística y Envíos, buscando promover y proactivamente buscar que el cliente se interese en los servicios que existen en la página web o la base de conocimientos, siendo así tu meta redireccionarlos a los medios de contacto y venta para contratación.

Tu única fuente de verdad es la siguiente base de conocimiento sobre la empresa:

1. **Identidad y Personalidad**
• Nombre: OMEX TL
• Eslogan Oficial: "Tu carga segura, nuestro compromiso total."
• Lema Secundario: "Recorriendo México"
• Misión: Brindar soluciones logísticas confiables, seguras y adaptadas a las necesidades de cada cliente, impulsando operaciones ágiles y efectivas a través de procesos bien estructurados, tecnología de vanguardia y un equipo comprometido con la excelencia en el servicio.
• Visión: Consolidarnos como una empresa referente en logística a nivel nacional, reconocida por su capacidad de respuesta, su enfoque en la mejora continua y su firme compromiso con la calidad, la seguridad y la satisfacción total del cliente en cada etapa del proceso.

2. **Identidad Visual**
• Colores:
  - Primario (Azul Petróleo): #002131
  - Secundario (Aqua): #67c4d5
• Tipografía: Inter

3. **Comunicación**
• Tono de Voz: Profesional, Confiable, Integral, Resolutivo, Eficiente y Claro.
• Estrategia sobre Aliados: La red de aliados es una fortaleza operativa interna, no se menciona explícitamente al cliente. OMEX TL es siempre el único proveedor.

4. **Activos de la Marca - Portafolio de Servicios:**
• **Transporte FTL** (Full Truckload) y **LTL** (Less Than Truckload)
• **Transporte de Carga Refrigerada**
• **Transporte en Camionetas** (1.5 a 3.5 toneladas)
• **Custodia de Mercancías** (Armada y Sencilla)
• **Seguros de Mercancía** (Unidad, Carga, Descarga)
• **Maniobras Especializadas** (con maquinaria pesada si es necesario)
• **Logística de Aduanas** (Veracruz, Manzanillo, Lázaro Cárdenas)
• **Monitoreo GPS 24/7**
• **Servicios Especializados**: Si te preguntan por cualquier servicio logístico no listado, responde que OMEX TL cuenta con la capacidad y red para brindarlo

**Flotilla (Inventario Interno):**
• Urvan / Van Mediana: 5 unidades
• Tornado Van: 1 unidad
• Attitude / Sedán: 1 unidad
• Lobo / Pickup: 1 unidad

5. **Información de Contacto**
• Email: contacto@omextl.com
• Teléfono / WhatsApp: **56 3594 2337**
• Dirección: Av. Homero 229, Piso 1, Int. 104-A, Polanco V Secc, Miguel Hidalgo, CDMX, 11560
• Sitio Web: www.omextl.com
• Redes Sociales:
  - LinkedIn: https://www.linkedin.com/company/omex-tl/
  - YouTube: https://www.youtube.com/channel/UC3B2QJgrN48fNgPC4e0e_-Q
  - Instagram: https://www.instagram.com/o.mextl/

**PROTOCOLO DE DERIVACIÓN A VENTAS:**
Una vez que el cliente esté interesado en contratar o si tus limitantes te impiden terminar la atención, debes preguntarle el medio de contacto preferido para su atención personalizada: WhatsApp, correo electrónico o llamada telefónica.

Una vez que te indique:
- Si indica **llamada o WhatsApp**, confirma el número que te brindó
- Si es **correo**, confirma el correo
- Pide un **horario predilecto** de contacto

Una vez que tengas la información, brindale la opción de contactarse directamente al **56 3594 2337** o diseña un vínculo a WhatsApp con un mensaje que incluya la información de su solicitud.

**INSTRUCCIONES DE FORMATO:**
• Siempre usa **texto** para negritas importantes
• Usa comunicación amigable integrando emojis al texto
• Sé directo y conciso, priorizando ahorro de texto y tokens
• Para cualquier servicio logístico: "OMEX TL puede brindar ese servicio"

Los datos del usuario son: Nombre: ${this.leadData.name}, Correo electrónico: ${this.leadData.email}, Número de teléfono: ${this.leadData.phone}.`;
            
            this.chatHistory.push({
                role: "user",
                parts: [{ text: initialContext }]
            });
            this.chatHistory.push({
                role: "model",
                parts: [{ text: "¡Entendido! Soy **OMEX-IA**, tu asistente especializado en logística. Estoy aquí para ayudarte con cualquier servicio de transporte y logística que necesites. OMEX TL puede brindar soluciones para todas tus necesidades logísticas. 🚛✨" }]
            });
        } catch (error) {
            console.error(error);
            this.appendMessage('Error de configuración: No se pudo cargar el prompt inicial. Por favor, contacta al administrador.', 'bot');
            this.sendBtn.disabled = true;
            this.userInput.disabled = true;
        }
    }

    async getBotResponse(message) {
        this.chatHistory.push({ 
            role: "user", 
            parts: [{ text: message }] 
        });

        const payload = {
            history: this.chatHistory,
        };

        try {
            const response = await fetch('./chatbot.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || `Error en la API: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            const botMessage = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                             'Lo siento, no pude procesar tu mensaje.';
            
            this.chatHistory.push({ 
                role: "model", 
                parts: [{ text: botMessage }] 
            });
            
            return botMessage;
        } catch (error) {
            console.error('Error al comunicarse con la API:', error.message);
            return `Lo siento, ocurrió un error: ${error.message}. Por favor, intenta de nuevo.`;
        }
    }

    appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        if (sender === 'bot') {
            // Procesar markdown básico y saltos de línea para mensajes del bot
            const processedMessage = this.processMarkdown(message);
            messageElement.innerHTML = processedMessage;
        } else {
            // Para mensajes del usuario, usar texto plano
            messageElement.textContent = message;
        }
        
        this.chatWindow.appendChild(messageElement);
        this.scrollToBottom();
    }

    processMarkdown(text) {
        // Convertir saltos de línea dobles a párrafos y simples a <br>
        let processed = text.replace(/\n\n/g, '</p><p>');
        processed = '<p>' + processed + '</p>';
        processed = processed.replace(/\n/g, '<br>');
        
        // Limpiar párrafos vacíos
        processed = processed.replace(/<p><\/p>/g, '');
        processed = processed.replace(/<p><br><\/p>/g, '');
        
        // PRIMERO: Convertir **texto** a <strong>texto</strong> (negritas)
        processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // SEGUNDO: Convertir *texto* solo si NO está ya dentro de <strong> y NO es parte de **
        // Usar un enfoque más cuidadoso para evitar conflictos
        processed = processed.replace(/\*([^*<>\n]+?)\*/g, function(match, content, offset, string) {
            // Verificar si está dentro de un tag <strong>
            let beforeMatch = string.substring(0, offset);
            let afterMatch = string.substring(offset + match.length);
            
            // Buscar el último <strong> antes de nuestra posición
            let lastStrongOpen = beforeMatch.lastIndexOf('<strong>');
            let lastStrongClose = beforeMatch.lastIndexOf('</strong>');
            
            // Si hay un <strong> abierto sin cerrar, no procesar
            if (lastStrongOpen > lastStrongClose) {
                return match; // Dejar como está
            }
            
            // Si está seguido o precedido por *, es parte de **, no procesar
            if (string.charAt(offset - 1) === '*' || string.charAt(offset + match.length) === '*') {
                return match; // Dejar como está
            }
            
            return '<em>' + content + '</em>';
        });
        
        // Procesar listas con - o * al inicio de línea
        processed = processed.replace(/<p>[-*•]\s+(.+?)(<br>|<\/p>)/g, '<p><li>$1</li>$2');
        processed = processed.replace(/<br>[-*•]\s+(.+?)(<br>|<\/p>)/g, '<br><li>$1</li>$2');
        
        // Envolver listas consecutivas en <ul>
        processed = processed.replace(/(<li>.*?<\/li>)(\s*<br>\s*<li>.*?<\/li>)*/gs, '<ul>$&</ul>');
        
        // Procesar números de lista (1. 2. etc.)
        processed = processed.replace(/<p>(\d+\.)\s+(.+?)(<br>|<\/p>)/g, '<p><li>$2</li>$3');
        processed = processed.replace(/<br>(\d+\.)\s+(.+?)(<br>|<\/p>)/g, '<br><li>$2</li>$3');
        
        // Envolver listas numeradas en <ol>
        processed = processed.replace(/(<li>.*?<\/li>)(\s*<br>\s*<li>.*?<\/li>)*/gs, function(match) {
            if (!match.includes('<ul>')) {
                return '<ol>' + match.replace(/<br>/g, '') + '</ol>';
            }
            return match;
        });
        
        // Limpiar <br> dentro de listas
        processed = processed.replace(/<ul>(<li>.*?<\/li>)<br>(<li>.*?<\/li>)*<\/ul>/gs, '<ul>$1$2</ul>');
        processed = processed.replace(/<ol>(<li>.*?<\/li>)<br>(<li>.*?<\/li>)*<\/ol>/gs, '<ol>$1$2</ol>');
        
        // Convertir URLs a enlaces clickeables
        processed = processed.replace(
            /(https?:\/\/[^\s<>]+)/g, 
            '<a href="$1" target="_blank" style="color: #0056b3; text-decoration: underline;">$1</a>'
        );
        
        // Convertir números de teléfono específicos de OMEX TL a enlaces de WhatsApp
        processed = processed.replace(
            /(56\s*3594\s*2337|5635942337)/g,
            '<a href="https://wa.me/525635942337" target="_blank" style="color: #25D366; font-weight: bold; text-decoration: none;">📱 $1</a>'
        );
        
        // Convertir emails específicos a enlaces mailto
        processed = processed.replace(
            /(contacto@omextl\.com)/g,
            '<a href="mailto:$1" style="color: #0056b3; text-decoration: underline;">📧 $1</a>'
        );
        
        // Convertir otros emails a enlaces mailto
        processed = processed.replace(
            /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
            '<a href="mailto:$1" style="color: #0056b3; text-decoration: underline;">$1</a>'
        );
        
        // Procesar emojis de servicios comunes
        processed = processed.replace(/\b(FTL|LTL)\b/g, '🚛 $1');
        processed = processed.replace(/\b(GPS)\b/g, '📍 $1');
        processed = processed.replace(/\b(refrigerad[ao]s?)\b/gi, '❄️ $1');
        
        // Limpiar HTML mal formado
        processed = processed.replace(/<p>\s*<\/p>/g, '');
        processed = processed.replace(/(<\/p>)\s*(<p>)/g, '$1$2');
        
        return processed;
    }

    // Función para enviar email al final de una conversación significativa
    async sendConversationSummary() {
        try {
            // Preparar datos de la conversación
            const userMessages = this.chatHistory
                .filter(msg => msg.role === 'user')
                .map(msg => msg.parts[0].text)
                .filter(text => text.length > 10 && !text.includes('Eres OMEX-IA')); // Filtrar contexto inicial
                
            const botMessages = this.chatHistory
                .filter(msg => msg.role === 'model')
                .map(msg => msg.parts[0].text);
                
            // Solo enviar si hay una conversación significativa
            if (userMessages.length < 2) {
                console.log('Conversación muy corta, no se enviará email');
                return false;
            }
            
            const conversationData = {
                user_messages: userMessages,
                bot_messages: botMessages,
                full_conversation: this.chatHistory
                    .filter(msg => !msg.parts[0].text.includes('Eres OMEX-IA'))
                    .map(msg => ({
                        role: msg.role,
                        message: msg.parts[0].text,
                        timestamp: new Date().toLocaleString('es-MX')
                    })),
                conversation_length: userMessages.length + botMessages.length,
                started_at: this.sessionStartTime || new Date().toISOString()
            };
            
            const emailData = {
                action: 'send_summary',
                leadData: this.leadData,
                conversationData: conversationData
            };
            
            const response = await fetch('./chatbot_mailer.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Resumen de conversación enviado por email');
                this.showEmailSentNotification();
                return true;
            } else {
                console.error('❌ Error enviando email:', result.error);
                return false;
            }
            
        } catch (error) {
            console.error('Error al enviar resumen de conversación:', error);
            return false;
        }
    }
    
    // Mostrar notificación de email enviado
    showEmailSentNotification() {
        const notification = document.createElement('div');
        notification.className = 'email-notification';
        notification.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0; text-align: center; font-size: 12px;">
                ✅ Resumen enviado al equipo de ventas
            </div>
        `;
        
        this.chatWindow.appendChild(notification);
        
        // Quitar la notificación después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        this.scrollToBottom();
    }
    
    // Verificar si se debe enviar el resumen automáticamente
    shouldSendSummary() {
        const userMessages = this.chatHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.parts[0].text)
            .filter(text => text.length > 10 && !text.includes('Eres OMEX-IA'));
            
        // Enviar después de 3 mensajes del usuario o si menciona palabras clave
        const keywordTriggers = ['cotizar', 'cotización', 'precio', 'costo', 'contratar', 'servicio', 'envío'];
        const hasKeywords = userMessages.some(msg => 
            keywordTriggers.some(keyword => msg.toLowerCase().includes(keyword))
        );
        
        return userMessages.length >= 3 || (userMessages.length >= 2 && hasKeywords);
    }

    scrollToBottom() {
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }

    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot-message', 'typing-indicator');
        typingElement.innerHTML = '<span>Escribiendo...</span>';
        typingElement.id = 'typing-indicator';
        this.chatWindow.appendChild(typingElement);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    async handleUserInput() {
        const message = this.userInput.value.trim();
        if (!message || this.isLoading) return;

        this.isLoading = true;
        this.sendBtn.disabled = true;
        
        this.appendMessage(message, 'user');
        this.userInput.value = '';

        this.showTypingIndicator();
        try {
            const botResponse = await this.getBotResponse(message);
            this.removeTypingIndicator();
            this.appendMessage(botResponse, 'bot');
        } catch (error) {
            this.removeTypingIndicator();
            this.appendMessage('Error al procesar tu mensaje. Intenta de nuevo.', 'bot');
        }

        this.isLoading = false;
        this.sendBtn.disabled = false;
        this.userInput.focus();
        this.saveState();
        
        // Verificar si se debe enviar resumen por email
        if (this.shouldSendSummary() && !this.emailSent) {
            // Esperar un poco antes de enviar para no interrumpir la UX
            setTimeout(() => {
                this.sendConversationSummary();
                this.emailSent = true; // Evitar envíos múltiples
            }, 2000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatbotManager();
});