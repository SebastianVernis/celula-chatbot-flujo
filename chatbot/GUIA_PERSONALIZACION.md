# 🎨 Guía de Personalización - Chatbot Template

## 🏢 Personalización de Empresa

### 1. **Información Básica de la Empresa**

Editar archivo: `chatbot.js` (líneas 112-183)

```javascript
// CAMBIAR ESTOS VALORES:
const initialContext = `Eres [NOMBRE-IA], el asistente virtual de [TU EMPRESA].

INFORMACIÓN DE TU EMPRESA:
• Nombre: [NOMBRE COMPLETO EMPRESA]
• Eslogan: "[TU ESLOGAN AQUÍ]"
• Servicios: [LISTA TUS SERVICIOS]
• Email: [tu-email@empresa.com]
• Teléfono: [tu número]
• Dirección: [tu dirección]
• Sitio web: [tu-web.com]

[ADAPTA EL RESTO DEL CONTEXTO A TU INDUSTRIA]`;
```

### 2. **Colores Corporativos**

Editar archivo: `Chatbot.html` (líneas 16-23)

```javascript
// CAMBIAR ESTOS COLORES:
tailwind.config = {
    theme: {
        extend: {
            colors: { 
                'primary': '#TU_COLOR_PRIMARIO',    // Ej: '#1f2937'
                'secondary': '#TU_COLOR_SECUNDARIO'  // Ej: '#3b82f6'
            }
        }
    }
}
```

### 3. **Template de Email**

Editar archivo: `chatbot_email_service.php` (líneas 124-261)

#### A. Header del Email:
```php
// Línea ~165: Cambiar título y empresa
<h1>OMEX TL</h1>  →  <h1>[TU EMPRESA]</h1>
<p>Tu carga segura, nuestro compromiso total</p>  →  <p>[TU TAGLINE]</p>
```

#### B. Colores del Email:
```css
// Cambiar gradientes (línea ~134):
background: linear-gradient(135deg, #002131 0%, #67c4d5 100%);
// Por:
background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);
```

#### C. Footer del Email:
```php
// Líneas 256-258: Actualizar información de contacto
📧 contacto@omextl.com  →  📧 tu-email@empresa.com
📞 56 3594 2337         →  📞 tu-teléfono  
🌐 www.omextl.com       →  🌐 tu-web.com
```

## 🚀 Personalización por Industria

### **Ejemplo 1: Restaurante/Catering**
```javascript
const context = `Eres GASTRO-IA, el asistente de Restaurante Excellence.

SERVICIOS:
• Catering para eventos corporativos
• Banquetes de boda y celebraciones  
• Servicio a domicilio gourmet
• Menús ejecutivos diarios

ESPECIALIZACIÓN: Gastronomía mexicana contemporánea
HORARIOS: Lunes a sábado 7AM-11PM
`;

// Keywords triggers:
const keywords = ['menú', 'reserva', 'evento', 'catering', 'precio', 'disponibilidad'];
```

### **Ejemplo 2: Consultoría Tecnológica**
```javascript
const context = `Eres TECH-IA, el asistente de TechConsult Pro.

SERVICIOS:
• Consultoría en transformación digital
• Desarrollo de software a medida  
• Auditorías de ciberseguridad
• Migración a la nube

ESPECIALIZACIÓN: PyMEs y empresas medianas
METODOLOGÍA: Agile, DevOps, Scrum
`;

// Keywords triggers:
const keywords = ['consultoría', 'desarrollo', 'migración', 'seguridad', 'cotización'];
```

### **Ejemplo 3: Servicios Médicos**
```javascript
const context = `Eres MEDIC-IA, el asistente de Clínica Salud Total.

SERVICIOS:
• Consultas médicas generales
• Especialidades: cardiología, dermatología
• Exámenes médicos ocupacionales
• Telemedicina y consultas virtuales

HORARIOS: Lunes a viernes 8AM-8PM, sábados 9AM-2PM
UBICACIÓN: Centro médico zona centro
`;

// Keywords triggers:
const keywords = ['consulta', 'cita', 'examen', 'especialista', 'urgente'];
```

## 🔧 Configuración Técnica Avanzada

### **Modificar Triggers de Envío**

Archivo: `chatbot.js` (líneas 445-451)
```javascript
shouldSendSummary() {
    const userMessages = this.chatHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.parts[0].text)
        .filter(text => text.length > 10);
        
    // PERSONALIZAR ESTAS CONDICIONES:
    const keywordTriggers = ['palabra1', 'palabra2', 'palabra3'];
    const minMessages = 3; // Cambiar número mínimo de mensajes
    
    const hasKeywords = userMessages.some(msg => 
        keywordTriggers.some(keyword => msg.toLowerCase().includes(keyword))
    );
    
    // LÓGICA PERSONALIZABLE:
    return userMessages.length >= minMessages || 
           (userMessages.length >= 2 && hasKeywords);
}
```

### **Personalizar Procesamiento de Texto**

Archivo: `chatbot.js` (líneas 257-351)
```javascript
processMarkdown(text) {
    // AGREGAR PROCESAMIENTO ESPECÍFICO DE TU INDUSTRIA:
    
    // Ejemplo para servicios financieros:
    processed = processed.replace(/\b(crédito|préstamo|inversión)\b/gi, '💰 $1');
    
    // Ejemplo para servicios médicos:
    processed = processed.replace(/\b(consulta|cita|doctor)\b/gi, '🏥 $1');
    
    // Ejemplo para educación:
    processed = processed.replace(/\b(curso|capacitación|certificación)\b/gi, '📚 $1');
    
    return processed;
}
```

## 📊 Monitoreo y Métricas

### **Eventos a Trackear (GA4 Recomendado)**
```javascript
// Agregar después del envío exitoso de lead:
gtag('event', 'chatbot_lead_generated', {
    'event_category': 'chatbot',
    'event_label': 'lead_captured',
    'value': 1
});

// Agregar en conversaciones:
gtag('event', 'chatbot_conversation', {
    'event_category': 'engagement', 
    'event_label': 'user_message',
    'value': this.chatHistory.length
});
```

### **KPIs Recomendados**
- **Conversiones:** Leads generados / Visitantes únicos
- **Engagement:** Mensajes promedio por sesión
- **Calidad:** Tiempo promedio de conversación
- **Abandono:** % usuarios que cierran sin completar

## 🛡️ Seguridad y Buenas Prácticas

### **Validación de Inputs**
```php
// Ya implementado en chatbot_mailer.php
$leadData = filter_var_array($input['leadData'], [
    'name' => FILTER_SANITIZE_STRING,
    'email' => FILTER_VALIDATE_EMAIL,
    'phone' => FILTER_SANITIZE_STRING
]);
```

### **Rate Limiting (Recomendado para Producción)**
```php
// Agregar en chatbot.php:
session_start();
$limit = 10; // mensajes por hora
$current = $_SESSION['chat_count'] ?? 0;

if ($current > $limit) {
    http_response_code(429);
    echo json_encode(['error' => 'Límite de mensajes excedido']);
    exit;
}
$_SESSION['chat_count'] = $current + 1;
```

### **Logging de Errores**
```php
// Ya implementado - personalizar en chatbot_email_service.php:
error_log("Error personalizado: " . $e->getMessage());
```

## 📚 Recursos Adicionales

- **Google Gemini API:** https://aistudio.google.com/
- **PHPMailer Docs:** https://github.com/PHPMailer/PHPMailer
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Configuración Gmail SMTP:** gmail_setup_guide.md

---

**🎯 Template validado con métricas reales OMEX TL:**  
185 visitas chatbot (+20.1%), sistema email 100% operativo

**Desarrollado por:** Equipo Técnico OMEX TL • Octubre 2025