<?php
/**
 * Sistema de envío de emails para Chatbot OMEX TL
 * Maneja el envío de datos de contacto y resúmenes de conversación
 */

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class ChatbotEmailService {
    private $mailer;
    private $config;
    
    public function __construct() {
        // Cargar configuración del .env
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->load();
        
        $this->config = [
            'smtp_host' => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
            'smtp_port' => intval(getenv('SMTP_PORT') ?: 587),
            'smtp_username' => trim(getenv('SMTP_USERNAME') ?: ''),
            'smtp_password' => trim(getenv('SMTP_PASSWORD') ?: ''),
            'from_email' => trim(getenv('SMTP_FROM_EMAIL') ?: ''),
            'from_name' => getenv('SMTP_FROM_NAME') ?: 'Chatbot OMEX TL',
            'to_email' => 'sebastianvernis@gmail.com'
        ];
        
        // Debug: Verificar configuración cargada
        error_log("SMTP Config loaded - Host: {$this->config['smtp_host']}, User: {$this->config['smtp_username']}, From: {$this->config['from_email']}");
        
        $this->setupMailer();
    }
    
    private function setupMailer() {
        $this->mailer = new PHPMailer(true);
        
        try {
            // Configuración del servidor SMTP
            $this->mailer->isSMTP();
            $this->mailer->Host = $this->config['smtp_host'];
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = $this->config['smtp_username'];
            $this->mailer->Password = $this->config['smtp_password'];
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port = $this->config['smtp_port'];
            
            // Configuración adicional para Gmail
            $this->mailer->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            
            // Configuración del remitente - con validación
            if (empty($this->config['from_email'])) {
                throw new Exception('SMTP_FROM_EMAIL no configurado en .env');
            }
            $this->mailer->setFrom($this->config['from_email'], $this->config['from_name']);
            
            // Configuración adicional
            $this->mailer->CharSet = 'UTF-8';
            $this->mailer->Encoding = 'base64';
            
            // Debug para desarrollo (comentar en producción)
            // $this->mailer->SMTPDebug = SMTP::DEBUG_SERVER;
            
        } catch (Exception $e) {
            error_log("Error configurando PHPMailer: " . $e->getMessage());
        }
    }
    
    /**
     * Envía un resumen de la conversación del chatbot
     * 
     * @param array $leadData Datos del lead (nombre, email, teléfono)
     * @param array $conversationSummary Resumen de la conversación
     * @return bool True si el envío fue exitoso
     */
    public function sendConversationSummary($leadData, $conversationSummary) {
        try {
            // Reset recipients
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($this->config['to_email']);
            
            // Configurar el mensaje
            $this->mailer->isHTML(true);
            $this->mailer->Subject = '🚛 Nuevo Lead Generado - OMEX TL';
            
            // Generar el contenido HTML
            $htmlContent = $this->generateEmailHTML($leadData, $conversationSummary);
            $this->mailer->Body = $htmlContent;
            
            // Generar versión texto plano
            $this->mailer->AltBody = $this->generateEmailText($leadData, $conversationSummary);
            
            // Enviar email
            $result = $this->mailer->send();
            
            if ($result) {
                error_log("Email enviado exitosamente para lead: " . $leadData['name']);
            }
            
            return $result;
            
        } catch (Exception $e) {
            error_log("Error enviando email: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Genera el contenido HTML del email
     */
    private function generateEmailHTML($leadData, $conversationSummary) {
        $timestamp = date('Y-m-d H:i:s');
        $userMessages = $conversationSummary['user_messages'] ?? [];
        $botMessages = $conversationSummary['bot_messages'] ?? [];
        $totalMessages = count($userMessages) + count($botMessages);
        
        // Obtener últimos mensajes para contexto
        $lastUserMessages = array_slice($userMessages, -3);
        $conversationHistory = $conversationSummary['full_conversation'] ?? [];
        
        $html = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nuevo Lead - OMEX TL</title>
            <style>
                body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f7fa; margin: 0; padding: 20px; }
                .container { max-width: 680px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,33,49,0.12); overflow: hidden; }
                .header { background: linear-gradient(135deg, #002131 0%, #003d5c 50%, #67c4d5 100%); color: white; padding: 40px 30px; text-align: center; position: relative; }
                .header::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
                .logo { position: relative; z-index: 2; }
                .header h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; }
                .tagline { margin: 8px 0 0; opacity: 0.95; font-size: 16px; font-weight: 500; }
                .subtitle { margin: 15px 0 0; opacity: 0.8; font-size: 14px; }
                .content { padding: 40px 30px; }
                .brand-section { text-align: center; margin-bottom: 30px; }
                .brand-section h2 { color: #002131; margin: 0 0 5px; font-size: 18px; font-weight: 700; }
                .brand-section p { color: #67c4d5; margin: 0; font-size: 14px; font-weight: 600; }
                .lead-info { background: linear-gradient(135deg, #f8feff 0%, #e8f8fb 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e1f4f7; position: relative; }
                .lead-info::before { content: "👤"; position: absolute; top: -10px; left: 20px; background: #67c4d5; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; }
                .lead-info h2 { margin: 0 0 20px; color: #002131; font-size: 20px; font-weight: 700; padding-left: 10px; }
                .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
                .info-item { display: flex; align-items: center; background: white; padding: 12px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,33,49,0.08); }
                .info-item strong { margin-right: 10px; color: #002131; min-width: 70px; font-weight: 600; }
                .info-item a { color: #67c4d5; text-decoration: none; font-weight: 500; }
                .info-item a:hover { text-decoration: underline; }
                .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
                .stat-card { background: linear-gradient(135deg, #ffffff 0%, #f8feff 100%); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e8f4f7; }
                .stat-number { font-size: 28px; font-weight: 800; color: #002131; margin-bottom: 5px; }
                .stat-label { font-size: 11px; color: #67c4d5; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
                .conversation { background: #ffffff; border: 1px solid #e8f4f7; padding: 25px; border-radius: 12px; margin-bottom: 25px; }
                .conversation h3 { margin: 0 0 20px; color: #002131; font-size: 18px; font-weight: 700; display: flex; align-items: center; }
                .conversation h3::before { content: "💬"; margin-right: 8px; }
                .message { margin: 12px 0; padding: 14px 18px; border-radius: 12px; position: relative; }
                .user-message { background: linear-gradient(135deg, #67c4d5 0%, #5ab3c4 100%); color: white; margin-left: 60px; border-bottom-right-radius: 4px; }
                .bot-message { background: #f8feff; color: #002131; margin-right: 60px; border-bottom-left-radius: 4px; border: 1px solid #e8f4f7; }
                .message strong { font-weight: 600; }
                .message-time { font-size: 11px; opacity: 0.7; margin-top: 8px; }
                .priority { background: linear-gradient(135deg, #fff9e6 0%, #fef7e0 100%); border: 1px solid #f4d03f; padding: 20px; margin: 25px 0; border-radius: 10px; position: relative; }
                .priority::before { content: "🎯"; position: absolute; top: -12px; left: 20px; background: #f39c12; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; }
                .priority strong { color: #d68910; }
                .cta-section { text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f8feff 0%, #e8f8fb 100%); border-radius: 12px; }
                .cta-button { display: inline-block; background: linear-gradient(135deg, #67c4d5 0%, #5ab3c4 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 8px; font-weight: 600; box-shadow: 0 4px 12px rgba(103,196,213,0.3); transition: transform 0.2s; }
                .cta-button:hover { transform: translateY(-1px); }
                .footer { background: #f8feff; padding: 25px; text-align: center; color: #67c4d5; font-size: 13px; border-top: 1px solid #e8f4f7; }
                .footer-brand { margin-bottom: 15px; }
                .footer-brand strong { color: #002131; font-size: 16px; }
                @media (max-width: 600px) {
                    .container { margin: 10px; }
                    .header { padding: 30px 20px; }
                    .content { padding: 30px 20px; }
                    .info-grid { grid-template-columns: 1fr; }
                    .stats { grid-template-columns: 1fr; }
                    .user-message { margin-left: 20px; }
                    .bot-message { margin-right: 20px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">
                        <h1>OMEX TL</h1>
                        <p class="tagline">Tu carga segura, nuestro compromiso total</p>
                        <p class="subtitle">Nuevo Lead Generado • ' . $timestamp . '</p>
                    </div>
                </div>
                
                <div class="content">
                    <div class="brand-section">
                        <h2>Sistema de Leads Inteligente</h2>
                        <p>Generado automáticamente por OMEX-IA</p>
                    </div>
                    
                    <div class="lead-info">
                        <h2>Información del Cliente</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Nombre:</strong> ' . htmlspecialchars($leadData['name']) . '
                            </div>
                            <div class="info-item">
                                <strong>Email:</strong> <a href="mailto:' . htmlspecialchars($leadData['email']) . '">' . htmlspecialchars($leadData['email']) . '</a>
                            </div>
                            <div class="info-item">
                                <strong>Teléfono:</strong> <a href="tel:' . htmlspecialchars($leadData['phone']) . '">' . htmlspecialchars($leadData['phone']) . '</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stats">
                        <div class="stat-card">
                            <div class="stat-number">' . $totalMessages . '</div>
                            <div class="stat-label">Mensajes Total</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">' . count($userMessages) . '</div>
                            <div class="stat-label">Consultas Cliente</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">' . count($botMessages) . '</div>
                            <div class="stat-label">Respuestas Bot</div>
                        </div>
                    </div>';
        
        // Mostrar últimas consultas del usuario
        if (!empty($lastUserMessages)) {
            $html .= '
                    <div class="conversation">
                        <h3>💬 Últimas Consultas del Cliente</h3>';
            
            foreach ($lastUserMessages as $index => $message) {
                $html .= '
                        <div class="message user-message">
                            <strong>Cliente:</strong> ' . htmlspecialchars($message) . '
                        </div>';
            }
            
            $html .= '
                    </div>';
        }
        
        // Mostrar historial completo si está disponible
        if (!empty($conversationHistory) && count($conversationHistory) > 0) {
            $html .= '
                    <div class="conversation">
                        <h3>📝 Historial de Conversación</h3>';
            
            foreach (array_slice($conversationHistory, -10) as $entry) {
                if ($entry['role'] === 'user') {
                    $html .= '
                        <div class="message user-message">
                            <strong>Cliente:</strong> ' . htmlspecialchars($entry['message']) . '
                            <div class="message-time">' . ($entry['timestamp'] ?? '') . '</div>
                        </div>';
                } else {
                    $html .= '
                        <div class="message bot-message">
                            <strong>OMEX-IA:</strong> ' . htmlspecialchars(substr($entry['message'], 0, 200)) . (strlen($entry['message']) > 200 ? '...' : '') . '
                            <div class="message-time">' . ($entry['timestamp'] ?? '') . '</div>
                        </div>';
                }
            }
            
            $html .= '
                    </div>';
        }
        
        $html .= '
                    <div class="priority">
                        <strong>Acción Recomendada:</strong> Contactar al cliente en las próximas 2 horas para máxima conversión. El lead muestra alto interés en nuestros servicios logísticos.
                    </div>
                    
                    <div class="cta-section">
                        <h3 style="margin: 0 0 15px; color: #002131; font-size: 18px;">Contactar Cliente</h3>
                        <a href="mailto:' . htmlspecialchars($leadData['email']) . '" class="cta-button">📧 Enviar Email</a>
                        <a href="tel:' . htmlspecialchars($leadData['phone']) . '" class="cta-button">📞 Llamar Ahora</a>
                        <a href="https://wa.me/52' . preg_replace('/\D/', '', $leadData['phone']) . '?text=Hola%20' . urlencode($leadData['name']) . '%2C%20te%20contacto%20desde%20OMEX%20TL%20por%20tu%20consulta%20de%20servicios%20logísticos" class="cta-button">💬 WhatsApp</a>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-brand">
                        <strong>OMEX TL</strong><br>
                        <em>Recorriendo México</em>
                    </div>
                    <p>📍 Av. Homero 229, Piso 1, Int. 104-A, Polanco V Secc, Miguel Hidalgo, CDMX</p>
                    <p>📞 <a href="tel:5635942337" style="color: #67c4d5;">56 3594 2337</a> • 📧 <a href="mailto:contacto@omextl.com" style="color: #67c4d5;">contacto@omextl.com</a> • 🌐 <a href="https://www.omextl.com" style="color: #67c4d5;">www.omextl.com</a></p>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">Este email fue generado automáticamente por OMEX-IA</p>
                </div>
            </div>
        </body>
        </html>';
        
        return $html;
    }
    
    /**
     * Genera la versión texto plano del email
     */
    private function generateEmailText($leadData, $conversationSummary) {
        $timestamp = date('Y-m-d H:i:s');
        $userMessages = $conversationSummary['user_messages'] ?? [];
        
        $text = "🚛 NUEVO LEAD - OMEX TL\n";
        $text .= "Tu carga segura, nuestro compromiso total\n";
        $text .= "===========================================\n\n";
        $text .= "Fecha: " . $timestamp . "\n\n";
        
        $text .= "👤 INFORMACIÓN DEL CLIENTE:\n";
        $text .= "- Nombre: " . $leadData['name'] . "\n";
        $text .= "- Email: " . $leadData['email'] . "\n";
        $text .= "- Teléfono: " . $leadData['phone'] . "\n\n";
        
        $text .= "📊 ESTADÍSTICAS DE CONVERSACIÓN:\n";
        $text .= "- Total mensajes: " . (count($userMessages) + count($conversationSummary['bot_messages'] ?? [])) . "\n";
        $text .= "- Consultas cliente: " . count($userMessages) . "\n";
        $text .= "- Nivel de interés: ALTO\n\n";
        
        if (!empty($userMessages)) {
            $text .= "💬 CONSULTAS MÁS RELEVANTES:\n";
            foreach (array_slice($userMessages, -3) as $message) {
                $text .= "• " . $message . "\n";
            }
        }
        
        $text .= "\n🎯 ACCIÓN RECOMENDADA: Contactar en las próximas 2 horas para máxima conversión.\n\n";
        $text .= "📧 Email: " . $leadData['email'] . "\n";
        $text .= "📞 Teléfono: " . $leadData['phone'] . "\n";
        $text .= "💬 WhatsApp: https://wa.me/52" . preg_replace('/\D/', '', $leadData['phone']) . "\n\n";
        $text .= "---\n";
        $text .= "OMEX TL - Recorriendo México\n";
        $text .= "📍 Av. Homero 229, Piso 1, Int. 104-A, Polanco V Secc, CDMX\n";
        $text .= "🌐 www.omextl.com | 📞 56 3594 2337";
        
        return $text;
    }
    
    /**
     * Envía un email de prueba para verificar la configuración
     */
    public function sendTestEmail() {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($this->config['to_email']);
            
            $this->mailer->isHTML(true);
            $this->mailer->Subject = '✅ Test Email - Sistema OMEX TL';
            
            $this->mailer->Body = '
            <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,33,49,0.12);">
                <div style="background: linear-gradient(135deg, #002131 0%, #67c4d5 100%); color: white; padding: 40px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800;">OMEX TL</h1>
                    <p style="margin: 8px 0 0; opacity: 0.95;">Tu carga segura, nuestro compromiso total</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #002131; margin: 0 0 20px;">✅ Sistema de Email Funcionando</h2>
                    <p>El sistema de notificaciones del chatbot OMEX TL está operativo y listo para generar leads.</p>
                    <div style="background: #f8feff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e8f4f7;">
                        <h3 style="color: #002131; margin: 0 0 15px;">Configuración del Sistema:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #555;">
                            <li><strong>Servidor:</strong> ' . $this->config['smtp_host'] . '</li>
                            <li><strong>Puerto:</strong> ' . $this->config['smtp_port'] . '</li>
                            <li><strong>Usuario:</strong> ' . $this->config['smtp_username'] . '</li>
                            <li><strong>Destino:</strong> ' . $this->config['to_email'] . '</li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="https://www.omextl.com" style="display: inline-block; background: linear-gradient(135deg, #67c4d5 0%, #5ab3c4 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">🌐 Visitar OMEX TL</a>
                    </p>
                </div>
                <div style="background: #f8feff; padding: 20px; text-align: center; color: #67c4d5; font-size: 13px; border-top: 1px solid #e8f4f7;">
                    <strong style="color: #002131;">OMEX TL</strong> - Recorriendo México<br>
                    📍 Av. Homero 229, Piso 1, Int. 104-A, Polanco V Secc, CDMX<br>
                    📞 <a href="tel:5635942337" style="color: #67c4d5;">56 3594 2337</a> • 📧 <a href="mailto:contacto@omextl.com" style="color: #67c4d5;">contacto@omextl.com</a><br>
                    <small style="opacity: 0.8; margin-top: 10px; display: block;">Test realizado: ' . date('Y-m-d H:i:s') . '</small>
                </div>
            </div>';
            
            return $this->mailer->send();
            
        } catch (Exception $e) {
            error_log("Error en test email: " . $e->getMessage());
            return false;
        }
    }
}

// Si se ejecuta directamente, enviar email de prueba
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    $emailService = new ChatbotEmailService();
    
    if ($emailService->sendTestEmail()) {
        echo "✅ Email de prueba enviado exitosamente\n";
    } else {
        echo "❌ Error enviando email de prueba\n";
    }
}
?>
