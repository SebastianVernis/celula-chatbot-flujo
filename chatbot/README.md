# 🤖 Chatbot OMEX TL - Template Reutilizable

## Descripción
Sistema de chatbot con IA especializado en logística desarrollado para OMEX TL, preparado para reimplementación en otros proyectos con configuración personalizable.

## 🎯 Características Principales

### ✅ **Funcionalidades Core**
- **IA Conversacional:** Google Gemini 2.5 Flash Lite
- **Captura de Leads:** Formulario inicial obligatorio con validación
- **Email Automation:** PHPMailer con templates HTML branded
- **Triggers Inteligentes:** Envío automático basado en engagement
- **Persistencia:** SessionStorage para mantener conversaciones
- **Responsive Design:** Tailwind CSS optimizado para móvil

### 🔧 **Stack Tecnológico**
- **Backend:** PHP 7.4+ con composer
- **Frontend:** JavaScript ES6, HTML5, Tailwind CSS
- **IA:** Google Gemini API 2.5 Flash Lite
- **Email:** PHPMailer 6.11 con SMTP Gmail
- **Storage:** SessionStorage para persistencia cliente

## 📁 Estructura de Archivos

```
chatbot-omextl-template/
├── chatbot.php                 # Backend API Gemini
├── chatbot_email_service.php   # Servicio de emails
├── chatbot_mailer.php         # Endpoint AJAX para emails
├── chatbot.js                 # Frontend JavaScript
├── Chatbot.html              # Interfaz principal
├── composer.json             # Dependencias PHP
├── .env                      # Variables de configuración
└── README.md                 # Esta documentación
```

## 🚀 Instalación y Configuración

### 1. **Dependencias PHP**
```bash
# Instalar dependencias
composer install

# Verificar PHPMailer
php -m | grep -i mail
```

### 2. **Variables de Entorno (.env)**
```env
# API Gemini
GEMINI_API_KEY=tu_api_key_aqui

# Configuración SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password
SMTP_FROM_EMAIL=tu_email@gmail.com
SMTP_FROM_NAME="Chatbot Tu Empresa"
SMTP_TO_EMAIL=destino@tuempresa.com
```

### 3. **Personalización de Marca**

#### A. Modificar Base de Conocimientos
Editar en `chatbot.js` línea ~112:
```javascript
const initialContext = `Eres [NOMBRE-IA], el asistente virtual de [EMPRESA].

INFORMACIÓN DE LA EMPRESA:
• Nombre: [NOMBRE EMPRESA]
• Servicios: [LISTA DE SERVICIOS]
• Contacto: [EMAIL] • [TELÉFONO]
• Sitio web: [URL]

[RESTO DE CONTEXTO ESPECIALIZADO]`;
```

#### B. Actualizar Colores Corporativos
Modificar en `Chatbot.html`:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: { 
                'primary': '#TU_COLOR_PRIMARIO', 
                'secondary': '#TU_COLOR_SECUNDARIO' 
            }
        }
    }
}
```

#### C. Personalizar Template Email
Editar `chatbot_email_service.php` líneas ~114-264:
- Cambiar gradientes de colores
- Actualizar información de empresa
- Modificar logo y tagline

### 4. **Configuración de Triggers**
Personalizar en `chatbot.js` línea ~445:
```javascript
const keywordTriggers = ['cotizar', 'precio', 'costo', 'contratar', 'servicio'];
// Modificar según tu industria
```

## 🧪 Testing del Sistema

### **Test Básico**
```bash
# Test configuración email
php chatbot_email_service.php

# Test API Gemini (requiere navegador)
# Abrir Chatbot.html y probar conversación
```

### **Test Email Completo**
```bash
# Crear archivo test_personalizado.php
php -r "
require 'chatbot_email_service.php';
\$service = new ChatbotEmailService();
\$service->sendTestEmail();
"
```

## 📋 Checklist de Personalización

### ✅ **Configuración Básica**
- [ ] Variables .env configuradas
- [ ] Dependencias PHP instaladas
- [ ] API Keys válidas (Gemini)
- [ ] SMTP configurado y probado

### ✅ **Personalización de Marca**
- [ ] Base de conocimientos actualizada
- [ ] Colores corporativos aplicados
- [ ] Logo y tagline modificados
- [ ] Template email personalizado
- [ ] Keywords de trigger adaptadas

### ✅ **Testing y Validación**
- [ ] Email de prueba enviado exitosamente
- [ ] Conversación IA funcionando
- [ ] Captura de leads operativa
- [ ] Triggers automáticos probados
- [ ] Diseño responsive validado

## 🔧 Comandos Útiles

```bash
# Instalar en nuevo proyecto
composer install

# Test rápido del sistema
php chatbot_email_service.php

# Verificar variables entorno
php -r "require 'vendor/autoload.php'; echo getenv('GEMINI_API_KEY') ? 'OK' : 'ERROR';"

# Limpiar sesiones (desarrollo)
# Limpiar sessionStorage desde consola navegador: sessionStorage.clear()
```

## 📊 Métricas de Performance (OMEX TL Original)

### **Resultados Verificados - Septiembre 2025:**
- **185 visitas** /Chatbot.html (+20.10% vs anterior)
- **Única página** con crecimiento positivo
- **Sistema email** 100% operativo
- **Gemini 2.5 Flash** funcionando correctamente

## 🎯 Casos de Uso Recomendados

### **Industrias Compatibles:**
- ✅ **Logística y Transporte** (implementación original)
- ✅ **Servicios Profesionales** (modificar base conocimientos)
- ✅ **E-commerce** (adaptar para productos)
- ✅ **Consultoría** (personalizar expertise)
- ✅ **Manufactura** (ajustar servicios industriales)

### **Tipos de Negocio:**
- **B2B con ventas consultivas** (ideal)
- **Servicios que requieren cotización**
- **Empresas con equipos de ventas**
- **Negocios con consultas técnicas frecuentes**

## ⚠️ Consideraciones Técnicas

### **Requisitos del Servidor:**
- PHP 7.4+ con composer
- Extensiones: curl, mbstring, json
- Acceso a variables de entorno
- SMTP habilitado

### **APIs y Servicios Externos:**
- **Google Gemini:** Requiere API key válida
- **Gmail SMTP:** Requiere App Password
- **Tailwind CSS:** CDN (puede cambiar a local)

### **Seguridad:**
- Variables sensibles en .env (no commitear)
- Validación de inputs implementada
- Headers de seguridad configurables
- Rate limiting recomendado para producción

## 📞 Soporte Técnico

Para implementación en nuevos proyectos:
- **Documentación:** Este README + código comentado
- **Base probada:** Sistema operativo en OMEX TL
- **Customización:** Guías específicas incluidas

---

**Desarrollado por:** Equipo Técnico OMEX TL  
**Versión:** 1.0 (Octubre 2025)  
**Licencia:** Uso interno/reimplementación autorizada