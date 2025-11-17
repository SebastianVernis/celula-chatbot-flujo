# ⚡ Instalación Rápida - Chatbot Template

## 🚀 Setup en 5 Minutos

### **Paso 1: Copiar Archivos**
```bash
# Copiar template a tu proyecto
cp -r chatbot-omextl-template/* tu-proyecto/

# Ir al directorio
cd tu-proyecto/
```

### **Paso 2: Instalar Dependencias**
```bash
# Instalar PHPMailer y phpdotenv
composer install

# Verificar instalación
php -r "echo 'Composer OK';"
```

### **Paso 3: Configurar .env**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus datos
nano .env
# O usar cualquier editor de texto
```

### **Paso 4: Configurar APIs**

#### **A. Google Gemini API**
1. Ve a https://aistudio.google.com/
2. Crea proyecto y obtén API key
3. Pega en .env: `GEMINI_API_KEY=tu_key_aqui`

#### **B. Gmail SMTP**  
1. Activa verificación 2 pasos en Gmail
2. Genera App Password para aplicaciones  
3. Configura en .env:
   ```
   SMTP_USERNAME=tu-email@gmail.com
   SMTP_PASSWORD=tu_app_password
   ```

### **Paso 5: Test del Sistema**
```bash
# Test email
php chatbot_email_service.php

# Si imprime "✅ Email de prueba enviado exitosamente" = OK
```

## 🎨 Personalización Básica (2 minutos)

### **Cambiar Nombre y Empresa**
Editar `chatbot.js` línea 112:
```javascript
// BUSCAR:
Eres OMEX-IA, el asistente virtual experto de OMEX TL

// CAMBIAR A:
Eres [TU-IA], el asistente virtual de [TU EMPRESA]
```

### **Cambiar Colores**
Editar `Chatbot.html` líneas 19-20:
```javascript
// BUSCAR:
'primary': '#002131', 'secondary': '#67c4d5'

// CAMBIAR A:
'primary': '#tu-color-1', 'secondary': '#tu-color-2'
```

### **Cambiar Servicios**
Editar `chatbot.js` líneas 140-150, reemplazar servicios OMEX TL por los tuyos.

## 🧪 Verificación Rápida

### **Checklist de 60 Segundos:**
- [ ] ✅ `php chatbot_email_service.php` = email enviado
- [ ] 🌐 Abrir `Chatbot.html` en navegador
- [ ] 💬 Completar formulario de datos
- [ ] 🤖 Enviar mensaje de prueba
- [ ] 📧 Verificar respuesta de IA
- [ ] ⚡ Confirmar trigger automático (3er mensaje)

## 🎯 Casos de Uso Rápidos

### **Logística/Transporte** (Original OMEX TL)
- ✅ Ya configurado, listo para usar
- Servicios: FTL, LTL, custodia, refrigerado

### **Restaurante/Catering**
```javascript
// Keywords triggers cambiar a:
const keywordTriggers = ['menú', 'reserva', 'evento', 'catering', 'precio'];

// Servicios cambiar a:
• Catering para eventos
• Reservas de mesa  
• Delivery especializado
• Menús ejecutivos
```

### **Consultoría/Servicios**
```javascript
// Keywords triggers cambiar a:  
const keywordTriggers = ['consulta', 'asesoría', 'proyecto', 'cotización', 'servicio'];

// Especialización cambiar a:
• Consultoría estratégica
• Análisis de procesos
• Implementación de sistemas
• Capacitación empresarial
```

## ⚠️ Troubleshooting Rápido

### **Error: "Invalid address (From)"**
```bash
# Verificar .env cargado:
php -r "echo getenv('SMTP_FROM_EMAIL') ?: 'ERROR: Variable no cargada';"
```

### **Error: "Could not authenticate"**
```bash
# Verificar App Password Gmail (NO password normal)
# Generar nuevo App Password si es necesario
```

### **Error: "API Key not configured"**
```bash
# Verificar Gemini API:
php -r "echo getenv('GEMINI_API_KEY') ? 'OK' : 'ERROR: API Key no encontrada';"
```

### **Chatbot no responde**
1. Verificar API key Gemini válida
2. Verificar console del navegador (F12)
3. Verificar que chatbot.php esté en misma carpeta

## 📞 Soporte

**Template basado en implementación real OMEX TL:**
- 185 visitas /Chatbot.html (+20.1% septiembre 2025)
- Sistema email 100% validado y operativo
- Gemini 2.5 Flash Lite probado en producción

**Documentación completa:** README.md + GUIA_PERSONALIZACION.md