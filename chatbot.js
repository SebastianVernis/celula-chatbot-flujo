/**
 * Chatbot para Grupo Musical Versátil La Célula
 * Proporciona atención personalizada, resuelve dudas sobre eventos y ayuda con cotizaciones
 * Especializado en definir necesidades, identificar áreas de oportunidad y realizar cierres de venta
 */

class CelulaChatbotManager {
    constructor() {
        this.chatWindow = document.getElementById('chat-window');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.closeBtn = document.getElementById('chat-close');
        this.leadForm = document.getElementById('lead-form');
        this.chatWindowContainer = document.getElementById('chat-window-container');
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
            isChatActive: this.chatWindowContainer.classList.contains('active'),
            lastUpdated: new Date().getTime() // Añadir timestamp para rastrear la frescura de los datos
        };
        localStorage.setItem('celulaChatbotState', JSON.stringify(state));
    }

    loadState() {
        const savedState = localStorage.getItem('celulaChatbotState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);

                // Verificar si los datos son recientes (menos de 24 horas)
                const isRecent = state.lastUpdated &&
                                 (new Date().getTime() - state.lastUpdated) < 24 * 60 * 60 * 1000;

                // Usar datos guardados solo si son recientes
                if (isRecent) {
                    this.chatHistory = state.chatHistory || [];
                    this.leadData = state.leadData || {};

                    // Only pre-fill the form if leadData exists, but don't open anything automatically
                    if (Object.keys(this.leadData).length > 0) {
                        this.fillLeadForm();
                    }
                    // The chatbot window should NOT be opened automatically here.
                    // The chatbot-toggle button will handle opening the lead form or chat.
                } else {
                    console.log("Datos del chatbot antiguos, iniciando nueva conversación");
                    this.resetState();
                }
            } catch (error) {
                console.error("Error al cargar el estado del chatbot:", error);
                this.resetState();
            }
        } else {
            this.resetState();
        }
    }

    resetState() {
        this.chatHistory = [];
        this.leadData = {};
        localStorage.removeItem('celulaChatbotState');
    }

    fillLeadForm() {
        // Autorellenar el formulario con datos guardados
        if (this.leadData.name) {
            document.getElementById('name-input').value = this.leadData.name;
        }
        if (this.leadData.email) {
            document.getElementById('email-input').value = this.leadData.email;
        }
        if (this.leadData.phone) {
            document.getElementById('phone-input').value = this.leadData.phone;
        }
        if (this.leadData.eventType) {
            document.getElementById('event-type-input').value = this.leadData.eventType;
        }
    }

    // Determina si un mensaje es visible para el usuario
    isVisibleMessage(message) {
        // No mostrar el contexto inicial de sistema
        if (message.parts[0].text.includes('Eres el Asistente Musical Virtual') ||
            message.parts[0].text.includes('MISIÓN PRINCIPAL:') ||
            message.parts[0].text.includes('MÉTODO SPIN') ||
            message.parts[0].text.includes('DIRECTRICES CRÍTICAS:')) {
            return false;
        }

        // No mostrar la respuesta de inicialización del sistema
        if (message.role === 'model' &&
            message.parts[0].text.includes('¡Entendido! Soy el Asistente Musical de Grupo Musical Versátil La Célula')) {
            return false;
        }

        return true;
    }

    // Filtra los mensajes que son visibles para el usuario
    getVisibleMessages() {
        return this.chatHistory.filter(message => this.isVisibleMessage(message));
    }

    repopulateChat() {
        // Limpiar la ventana de chat
        this.chatWindow.innerHTML = '';

        // Mostrar solo los mensajes visibles para el usuario
        this.getVisibleMessages().forEach(item => {
            if (item.role === 'user') {
                this.appendMessage(item.parts[0].text, 'user');
            } else if (item.role === 'model') {
                this.appendMessage(item.parts[0].text, 'bot');
            }
        });
    }

    setupEventListeners() {
        // Evento para el botón flotante del chatbot (abrir chatbot)
        document.getElementById('chatbot-toggle')?.addEventListener('click', () => {
            if (this.chatHistory.length > 3) {
                this.leadForm.classList.remove('active');
                this.chatWindowContainer.classList.add('active');
                this.chatInputArea.style.display = 'flex';
            } else if (Object.keys(this.leadData).length > 0) {
                this.fillLeadForm();
                this.leadForm.classList.add('active');
            } else {
                this.leadForm.classList.add('active');
            }
        });

        // Evento para cerrar el formulario de lead
        document.getElementById('lead-form-close')?.addEventListener('click', () => {
            this.leadForm.classList.remove('active');
            this.saveState();
        });

        // Evento para cerrar la ventana de chat
        document.getElementById('chat-close')?.addEventListener('click', () => {
            this.chatWindowContainer.classList.remove('active');
            this.saveState();
        });

        // Evento para restablecer completamente el chat (borrar historial)
        const resetChat = document.createElement('button');
        resetChat.id = 'reset-chat';
        resetChat.className = 'reset-chat';
        resetChat.setAttribute('aria-label', 'Borrar conversación');
        resetChat.innerHTML = '🗑️';
        resetChat.title = 'Borrar esta conversación y comenzar de nuevo';
        resetChat.style.cssText = 'position: absolute; right: 40px; top: 15px; background: transparent; border: none; color: white; cursor: pointer; font-size: 16px;';

        // Añadir el botón al encabezado del chat
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.appendChild(resetChat);
        }

        // Evento para el botón de restablecer chat
        resetChat.addEventListener('click', () => {
            if (confirm('¿Estás seguro de borrar toda la conversación y comenzar de nuevo?')) {
                this.resetState();
                this.chatWindowContainer.classList.remove('active');
                this.chatWindow.innerHTML = '';
                document.getElementById('chatbot-lead-form').reset();
                this.leadForm.classList.add('active');
            }
        });

        this.closeBtn?.addEventListener('click', () => {
            parent.postMessage('close-chatbot', '*');
            this.saveState();
        });

        this.sendBtn?.addEventListener('click', () => this.handleUserInput());

        this.userInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });

        this.userInput?.addEventListener('input', this.autoResize.bind(this));

        document.getElementById('chatbot-lead-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Agregar detección de eventos de cierre de página para guardar estado
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });

        // Guardar periódicamente el estado mientras se usa el chat
        setInterval(() => {
            if (this.chatHistory.length > 0) {
                this.saveState();
            }
        }, 30000); // Guardar cada 30 segundos
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
        const eventTypeInput = document.getElementById('event-type-input');

        this.leadData.name = nameInput.value.trim();
        this.leadData.email = emailInput.value.trim();
        this.leadData.phone = phoneInput.value.trim();
        this.leadData.eventType = eventTypeInput.value.trim();

        if (this.leadData.name && this.leadData.email && this.leadData.phone) {
            this.leadForm.classList.remove('active');
            this.chatWindowContainer.classList.add('active');
            this.chatInputArea.style.display = 'flex';

            await this.startChat();
            this.saveState();
        }
    }

    async startChat() {
        // loadInitialContext ahora devuelve true si necesita añadir saludo
        const needsGreeting = await this.loadInitialContext();

        // Solo añadir el saludo si es necesario (no existe ya en el historial)
        if (needsGreeting) {
            // Mensaje de saludo personalizado para La Célula con enfoque SPIN
            const greeting = `¡Hola ${this.leadData.name}! 👋 Soy el **Asistente Musical** de Grupo Musical La Célula 🎵

Estoy aquí para ayudarte a encontrar la **solución musical perfecta** para tu ${this.leadData.eventType || "evento"}. Nuestro grupo versátil puede adaptarse a cualquier:

• Tipo de celebración (bodas, XV años, corporativos)
• Estilo musical (desde cumbia y salsa hasta rock y pop)
• Tamaño de evento (desde íntimos hasta masivos)

¿Podrías contarme más detalles sobre el evento que estás planeando? 🎉`;

            // Añadir al historial y mostrar al usuario
            this.chatHistory.push({
                role: "model",
                parts: [{ text: greeting }]
            });

            this.appendMessage(greeting, 'bot');

            // Guardar el estado para mantener la coherencia entre páginas
            this.saveState();
        }
    }

    async loadInitialContext() {
        try {
            // Verificar si ya tenemos el contexto inicial en el historial
            const hasInitialContext = this.chatHistory.some(item => 
                item.role === "user" && 
                item.parts[0].text.includes("Eres el Asistente Musical Virtual")
            );
            
            // Solo añadir el contexto inicial si no existe ya
            if (!hasInitialContext) {
                const initialContext = `Eres el Asistente Musical Virtual del Grupo Musical Versátil La Célula, especializado en ventas consultivas y cierre de contratos musicales para todo tipo de eventos.

MISIÓN PRINCIPAL:
Tu misión es EXTRAER LA MAYOR CANTIDAD DE INFORMACIÓN POSIBLE sobre el evento del cliente, utilizando el método SPIN y técnicas de venta avanzadas para calificar al cliente y guiarlo hacia una cotización personalizada.

DIRECTRICES CRÍTICAS:
1. SIEMPRE destaca la versatilidad del grupo en cualquier género musical (cumbia, rock, pop, baladas, etc.)
2. PRIORIZA entender las necesidades específicas del evento usando la técnica SPIN
3. ORIENTA cada respuesta para descubrir problemas ocultos y avanzar hacia el cierre
4. MANTÉN un formato consistente con listas numeradas o viñetas según corresponda
5. Cuando no tengas información específica, DIRIGE al cliente al WhatsApp: 55 3541 2631

MÉTODO SPIN (UTILIZA ESTAS PREGUNTAS ESTRATÉGICAMENTE):
• **Situación**: "¿Para qué evento necesitas música?", "¿Cuántos invitados asistirán?", "¿Ya tienes fecha y lugar?"
• **Problema**: "¿Te preocupa que la música no sea adecuada para todos tus invitados?", "¿Has tenido malas experiencias con otros grupos musicales?"
• **Implicación**: "¿Cómo afectaría a tu evento si la banda no puede adaptarse a los diferentes gustos?", "¿Qué pasaría si tus invitados no disfrutan de la música?"
• **Necesidad**: "¿Sería valioso contar con músicos que puedan tocar todos los géneros?", "¿Te ayudaría tener un grupo que mantenga la pista llena toda la noche?"

INFORMACIÓN CLAVE SOBRE GRUPO MUSICAL LA CÉLULA:

1. **Identidad**
• Nombre: Grupo Musical Versátil La Célula
• Especialización: Música para todo tipo de eventos sociales y corporativos
• Fortaleza: Versatilidad de géneros y capacidad de adaptación a cualquier evento
• Experiencia: Más de 10 años en eventos exclusivos y corporativos

2. **Paquetes de Servicio**
• **Paquete Event Plus**: Ideal para eventos grandes (bodas, graduaciones)
   - 5 horas de música en vivo ininterrumpida
   - Equipo de audio para 50 hasta 2,000 invitados
   - Iluminación robótica y láser profesional
   - Pantalla gigante / Led para momentos especiales
   - Animadores / DJ para maximizar la experiencia
   - Dinámicas y regalos para invitados
   - Máquina de humo para efectos especiales

• **Paquete Party**: Perfecto para fiestas medianas
   - 5 horas de música en vivo de alta calidad
   - Equipo de audio para 30-250 personas con sonido premium
   - Iluminación robótica y LED para crear ambientes únicos
   - Iluminación láser con máquina de humo inteligente
   - Dinámicas, batucada y show 80's con regalos exclusivos
   - Música grabada en descansos (sin silencios incómodos)

• **Paquete Live**: Para eventos masivos y corporativos
   - Show 80's o temático personalizado según las necesidades
   - Equipo profesional para hasta 10,000 personas
   - Escenario, video, luz robótica y láser de alta gama
   - Pantallas gigantes para mayor visibilidad
   - Animadores / DJ para complementar la experiencia
   - Dinámicas especiales adaptadas al tipo de evento

3. **Características Distintivas**
• 6 integrantes base con posibilidad de ampliar según necesidades
• Repertorio extenso que incluye TODOS los géneros musicales (pop, rock, cumbia, salsa, etc.)
• Músicos multifacéticos que dominan varios instrumentos y estilos vocales
• Diseño de bloques musicales personalizados para cada momento del evento
• Ambiente continuo sin descansos prolongados que maten la fiesta
• Equipo de audio de última generación para sonido cristalino
• Puntualidad y profesionalismo garantizados

4. **Eventos que cubren**
• Bodas 💍 (ceremonia, cocktail y recepción con ambientación perfecta)
• XV Años 🎂 (vals tradicional, show juvenil y fiesta para todas las edades)
• Graduaciones 🎓 (ceremonias formales y celebraciones dinámicas)
• Aniversarios 💕 (ambientes románticos y festivos)
• Eventos corporativos 🏢 (presentaciones, cenas de gala, team buildings)
• Fiestas privadas 🏠 (cumpleaños, reuniones exclusivas, celebraciones íntimas)
• Conciertos y eventos masivos 🎤 (shows temáticos, festivales, lanzamientos)

5. **Información de Contacto**
• WhatsApp: 55 3541 2631 (atención inmediata)
• Sitio Web: https://grupomusicalcelula.com (información detallada)
• Redes: Facebook, YouTube, Twitter (@grupocelula)

FORMATO CONSISTENTE PARA RESPUESTAS:
• Usa siempre **negrita** para destacar conceptos clave y nombres de paquetes
• Estructura tus respuestas con viñetas (•) para listas generales
• Usa numeración (1, 2, 3) para pasos secuenciales o rankings
• Usa guiones (-) para detallar características bajo una categoría
• Incluye emojis relevantes al contexto (🎵 🎸 🎉 🎊 💍 🎓 🎤 🏢 🎂)
• Mantén párrafos cortos y directos (máximo 2-3 líneas)
• Cierra SIEMPRE con una pregunta para mantener la conversación

TÉCNICAS DE VENTA AVANZADAS:
1. **Diferenciación**: Destaca siempre qué hace único al grupo (versatilidad, cero tiempos muertos, adaptabilidad)
2. **Storytelling**: Incluye ejemplos breves de éxito en eventos similares
3. **Urgencia**: Menciona disponibilidad limitada en temporadas altas (diciembre-enero, mayo-junio)
4. **Beneficios vs Características**: Enfócate en la experiencia, no solo en equipamiento técnico
5. **Objeciones**: Anticipa y responde proactivamente a preocupaciones comunes (precio, espacio, energía)
6. **Prueba social**: Menciona sutilmente la experiencia con otros clientes satisfechos

CICLO DE CADA RESPUESTA:
1. Reconoce la pregunta/comentario del cliente
2. Proporciona información valiosa y relevante
3. Incluye un elemento diferenciador del grupo
4. Termina con una pregunta SPIN para obtener más información
5. Guía hacia la cotización o contacto directo cuando tengas suficientes datos

ESTRATEGIA PARA CIERRE:
Cuando hayas recopilado: tipo de evento, fecha, número de invitados y estilo musical deseado, OFRECE:
"Para brindarte una **cotización personalizada** 💰 podemos:
1. Contactarte directamente vía WhatsApp al **55 3541 2631**
2. Enviarte una propuesta detallada por correo electrónico
¿Qué opción prefieres para avanzar con tu reserva?"

Los datos del usuario son:
Nombre: ${this.leadData.name || "[Sin nombre]"}
Correo electrónico: ${this.leadData.email || "[Sin email]"}
Número de teléfono: ${this.leadData.phone || "[Sin teléfono]"}
Tipo de evento: ${this.leadData.eventType || "[Sin especificar]"}`;
                
                this.chatHistory.push({
                    role: "user",
                    parts: [{ text: initialContext }]
                });
                this.chatHistory.push({
                    role: "model",
                    parts: [{ text: "¡Entendido! Soy el Asistente Musical de Grupo Musical Versátil La Célula. Mi misión es usar el método SPIN y técnicas de venta avanzadas para descubrir todas las necesidades del cliente, extraer la mayor información posible sobre su evento, y presentar nuestros servicios de forma convincente. Mantendré un formato consistente en mis respuestas usando viñetas, numeración y elementos visuales para resaltar los beneficios de nuestros paquetes musicales. Cada interacción estará orientada a guiar al cliente hacia una cotización personalizada, destacando siempre nuestra versatilidad musical y adaptabilidad. 🎵🎉" }]
                });
            }
            
            // Verificar si ya existe un saludo del bot
            const hasGreeting = this.chatHistory.some(item =>
                item.role === "model" &&
                item.parts[0].text.includes("¡Hola") &&
                item.parts[0].text.includes("Soy el **Asistente Musical**")
            );
            
            // Si no hay saludo, preparamos para añadir uno
            return !hasGreeting;
            
        } catch (error) {
            console.error(error);
            this.appendMessage('Error de configuración: No se pudo inicializar el asistente. Por favor, contacta al administrador del sitio.', 'bot');
            this.sendBtn.disabled = true;
            this.userInput.disabled = true;
            return false;
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
            // Usar la función API de Cloudflare Pages (la ruta /api/ es mapeada automáticamente a /functions/api/)
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || `Error: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            const botMessage = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                             'Lo siento, no pude procesar tu mensaje. ¿Podrías contactarnos directamente por WhatsApp al 55 3541 2631?';
            
            this.chatHistory.push({
                role: "model",
                parts: [{ text: botMessage }]
            });
            
            return botMessage;
        } catch (error) {
            console.error('Error:', error.message);
            return `Lo siento, ocurrió un error al procesar tu mensaje. Para atención inmediata, contáctanos por WhatsApp al 55 3541 2631.`;
        }
    }

    appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        if (sender === 'bot') {
            // Procesar markdown básico y emojis para mensajes del bot
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
        
        // Negritas
        processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Cursivas (solo si no es parte de negritas)
        processed = processed.replace(/\*([^*<>\n]+?)\*/g, function(match, content) {
            return '<em>' + content + '</em>';
        });
        
        // Procesar listas
        processed = processed.replace(/<p>[-*•]\s+(.+?)(<br>|<\/p>)/g, '<p><li>$1</li>$2');
        processed = processed.replace(/<br>[-*•]\s+(.+?)(<br>|<\/p>)/g, '<br><li>$1</li>$2');
        processed = processed.replace(/(<li>.*?<\/li>)(\s*<br>\s*<li>.*?<\/li>)*/gs, '<ul>$&</ul>');
        
        // Limpiar HTML mal formado
        processed = processed.replace(/<p>\s*<\/p>/g, '');
        processed = processed.replace(/(<\/p>)\s*(<p>)/g, '$1$2');
        
        // Convertir URLs a enlaces clickeables
        processed = processed.replace(
            /(https?:\/\/[^\s<>]+)/g, 
            '<a href="$1" target="_blank" style="color: #3D9BE9; text-decoration: underline;">$1</a>'
        );
        
        // Convertir número de WhatsApp de La Célula a enlace
        processed = processed.replace(
            /(55\s*3541\s*2631|5535412631)/g,
            '<a href="https://wa.me/525535412631?text=Hola,%20me%20interesa%20cotizar%20mi%20evento..." target="_blank" style="color: #25D366; font-weight: bold; text-decoration: none;">📱 $1</a>'
        );
        
        // Resaltar tipos de eventos
        const eventTypes = ['boda', 'bodas', 'xv años', 'quinceañera', 'graduación', 'graduaciones', 'fiesta', 'fiestas', 'corporativo', 'empresarial'];
        eventTypes.forEach(event => {
            const regex = new RegExp(`\b${event}\b`, 'gi');
            processed = processed.replace(regex, `<span style="color: #3D9BE9; font-weight: 600;">$&</span>`);
        });
        
        // Resaltar paquetes
        processed = processed.replace(/\b(Paquete Event Plus|Paquete Party|Paquete Live)\b/g, 
            '<span style="color: #000000; font-weight: 700; background-color: #f8f9fa; padding: 0 3px; border-radius: 3px;">$1</span>'
        );
        
        // Añadir emojis para palabras clave si no tienen ya
        if (!processed.includes('🎵')) {
            processed = processed.replace(/\b(música|musical|músicos)\b/gi, '🎵 $1');
        }
        if (!processed.includes('💍')) {
            processed = processed.replace(/\b(boda|bodas)\b/gi, '💍 $1');
        }
        if (!processed.includes('🎓')) {
            processed = processed.replace(/\b(graduación|graduaciones)\b/gi, '🎓 $1');
        }
        if (!processed.includes('🎉')) {
            processed = processed.replace(/\b(fiesta|fiestas|celebración|evento)\b/gi, '🎉 $1');
        }
        
        return processed;
    }

    // Enviar resumen de conversación por email
    async sendConversationSummary() {
        try {
            // Preparar datos de la conversación
            const userMessages = this.chatHistory
                .filter(msg => msg.role === 'user')
                .map(msg => msg.parts[0].text)
                .filter(text => text.length > 10 && !text.includes('Eres el Asistente Musical')); // Filtrar contexto inicial
                
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
                    .filter(msg => !msg.parts[0].text.includes('Eres el Asistente Musical'))
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
            
            // Usar la función API de Cloudflare Pages (la ruta /api/ es mapeada automáticamente a /functions/api/)
            const response = await fetch('/api/email', {
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
                ✅ Información enviada a nuestro equipo musical
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
            .filter(text => text.length > 10 && !text.includes('Eres el Asistente Musical'));
            
        // Enviar después de 3 mensajes del usuario o si menciona palabras clave
        const keywordTriggers = ['cotizar', 'cotización', 'precio', 'costo', 'contratar', 'fecha', 'presupuesto', 'disponibilidad'];
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
        typingElement.innerHTML = '<span>Componiendo respuesta...</span>';
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
            this.appendMessage('Lo siento, no pude procesar tu mensaje. Para atención inmediata, contáctanos por WhatsApp al 55 3541 2631.', 'bot');
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
    const chatbotManager = new CelulaChatbotManager();
    
    // Inicializar estado visual de los componentes del chatbot
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const leadForm = document.getElementById('lead-form');
    const chatWindowContainer = document.getElementById('chat-window-container');

    // Añadir estilo para el botón de restablecer chat
    const style = document.createElement('style');
    style.textContent = `
        .reset-chat {
            position: absolute;
            right: 40px;
            top: 15px;
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s ease;
            z-index: 10;
        }
        
        .reset-chat:hover {
            transform: scale(1.2);
        }
        
        @media (max-width: 600px) {
            .reset-chat {
                right: 35px;
                top: 14px;
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
    
    if (chatbotToggle && leadForm && chatWindowContainer) {
        console.log('Chatbot La Célula inicializado correctamente con persistencia entre páginas');
    } else {
        console.error('No se pudieron encontrar elementos del chatbot');
    }
    
    // Mostrar mensaje de persistencia en el chatbot (sólo en desarrollo)
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        console.log('Persistencia del chatbot activada. Los datos se conservarán entre páginas y sesiones');
    }
});

// Envio automatico de conversaciones via Web3Forms
if (typeof window !== 'undefined') {
    let conversationSent = false;
    
    async function sendConversationViaWeb3Forms() {
        if (conversationSent) return;
        
        const chatbotInstance = window.celulaChatbot;
        if (!chatbotInstance || !chatbotInstance.chatHistory || chatbotInstance.chatHistory.length < 2) {
            return;
        }
        
        conversationSent = true;
        
        const userData = {
            name: chatbotInstance.userName || 'Usuario del Chatbot',
            email: chatbotInstance.userEmail || 'no-proporcionado@celula.com',
            phone: chatbotInstance.userPhone || 'No proporcionado'
        };
        
        if (typeof window.sendChatConversation === 'function') {
            try {
                const result = await window.sendChatConversation(chatbotInstance.chatHistory, userData);
                console.log('Conversacion enviada:', result.success);
            } catch (error) {
                console.error('Error enviando conversacion:', error);
            }
        }
    }
    
    window.addEventListener('beforeunload', sendConversationViaWeb3Forms);
    
    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(sendConversationViaWeb3Forms, 300000);
    }
    
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    resetInactivityTimer();
}