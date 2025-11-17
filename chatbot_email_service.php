<?php
/**
 * Servicio de email para el chatbot de Grupo Musical Versátil La Célula
 * 
 * Este script procesa las solicitudes del chatbot y envía emails a los administradores
 * con los datos de los leads y resúmenes de conversaciones.
 */

// Configuración inicial
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Para peticiones OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo aceptamos peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Obtener el cuerpo de la petición
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Verificar que tenemos datos válidos
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

// Configuración de email
$adminEmail = 'contacto@grupomusicalcelula.com'; // Cambiar por el email real del administrador
$fromEmail = 'chatbot@grupomusicalcelula.com';
$ccEmails = ['ventas@grupomusicalcelula.com']; // Emails adicionales para copia

/**
 * Función para enviar email
 */
function sendEmail($to, $subject, $message, $from, $cc = []) {
    // Cabeceras para HTML y remitente
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $from" . "\r\n";
    
    // Añadir CC si hay emails
    if (!empty($cc)) {
        $headers .= "Cc: " . implode(',', $cc) . "\r\n";
    }
    
    // Enviar email
    $success = mail($to, $subject, $message, $headers);
    
    // Para entornos de desarrollo, escribir en un archivo si mail() no funciona
    if (!$success) {
        $logFile = __DIR__ . '/emails_log.txt';
        file_put_contents(
            $logFile, 
            date('Y-m-d H:i:s') . " - TO: $to - SUBJECT: $subject - MESSAGE: " . substr($message, 0, 100) . "...\n", 
            FILE_APPEND
        );
    }
    
    return $success;
}

/**
 * Función para enviar notificación de nueva solicitud
 */
function sendLeadNotification($leadData, $conversationData) {
    global $adminEmail, $fromEmail, $ccEmails;
    
    // Fecha y hora actual
    $date = date('d/m/Y H:i:s');
    
    // Determinar tipo de evento (si existe)
    $eventType = isset($leadData['eventType']) ? $leadData['eventType'] : 'No especificado';
    
    // Preparar extracto de la conversación (últimos 5 mensajes)
    $conversationExcerpt = '';
    $recentMessages = array_slice($conversationData['full_conversation'], -5);
    
    foreach ($recentMessages as $msg) {
        $role = $msg['role'] === 'user' ? '<strong>Cliente</strong>' : '<strong>Chatbot</strong>';
        $conversationExcerpt .= "<p>$role: " . htmlspecialchars($msg['message']) . "</p>";
    }
    
    // Determinar paquete recomendado basado en palabras clave de la conversación
    $recommendedPackage = determineRecommendedPackage($conversationData);
    
    // Crear mensaje HTML
    $subject = "🎵 Nueva consulta musical - " . $leadData['name'];
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: 'Open Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000000; color: white; padding: 15px; text-align: center; }
            .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #3D9BE9; }
            .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #777; }
            h2 { color: #3D9BE9; }
            .highlight { font-weight: bold; color: #000000; }
            .conversation { margin: 15px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px; }
            .package-recommendation { background-color: #e6f7ff; padding: 15px; margin: 20px 0; border-left: 4px solid #3D9BE9; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Nueva solicitud de información musical</h1>
                <p>$date</p>
            </div>
            
            <div class='section'>
                <h2>Datos del cliente</h2>
                <p><span class='highlight'>Nombre:</span> " . htmlspecialchars($leadData['name']) . "</p>
                <p><span class='highlight'>Email:</span> " . htmlspecialchars($leadData['email']) . "</p>
                <p><span class='highlight'>Teléfono:</span> " . htmlspecialchars($leadData['phone']) . "</p>
                <p><span class='highlight'>Tipo de evento:</span> " . htmlspecialchars($eventType) . "</p>
            </div>
            
            <div class='package-recommendation'>
                <h2>Paquete recomendado</h2>
                <p>Basado en la conversación, el cliente podría estar interesado en:</p>
                <p><span class='highlight'>$recommendedPackage</span></p>
            </div>
            
            <div class='section'>
                <h2>Extracto de la conversación</h2>
                <div class='conversation'>
                    $conversationExcerpt
                </div>
                <p>Total de mensajes: " . $conversationData['conversation_length'] . "</p>
                <p>Inicio de conversación: " . date('d/m/Y H:i:s', strtotime($conversationData['started_at'])) . "</p>
            </div>
            
            <div class='section'>
                <h2>Acciones recomendadas</h2>
                <p>1. Contactar al cliente lo antes posible (preferiblemente en las próximas 2 horas)</p>
                <p>2. Ofrecer información específica sobre los paquetes adecuados para su evento</p>
                <p>3. Verificar disponibilidad para la fecha solicitada</p>
                <p>4. Enviar propuesta personalizada o coordinar una llamada para detalles</p>
            </div>
            
            <div class='footer'>
                <p>Este email fue generado automáticamente por el chatbot de Grupo Musical Versátil La Célula.</p>
                <p>© 2025 Grupo Musical Versátil La Célula. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Enviar el email
    return sendEmail($adminEmail, $subject, $message, $fromEmail, $ccEmails);
}

/**
 * Determinar el paquete recomendado basado en la conversación
 */
function determineRecommendedPackage($conversationData) {
    $userMessages = implode(' ', $conversationData['user_messages']);
    $userMessages = strtolower($userMessages);
    
    // Patrones para diferentes tipos de eventos
    $patterns = [
        'Paquete Event Plus' => [
            'boda', 'matrimonio', 'grande', '100 invitados', '200 invitados', 'salon', 'graduación', 
            'graduacion', 'XV años', 'quinceañera', 'quinceañeros'
        ],
        'Paquete Party' => [
            'fiesta', 'celebración', 'pequeña', 'privada', 'cumpleaños', 'aniversario', 
            '50 personas', 'casa', 'intima'
        ],
        'Paquete Live' => [
            'corporativo', 'empresa', 'masivo', 'promoción', 'lanzamiento', 'concierto', 
            'presentación', 'evento grande', '500 personas', '1000 personas'
        ]
    ];
    
    // Contar coincidencias para cada paquete
    $scores = [];
    foreach ($patterns as $package => $keywords) {
        $score = 0;
        foreach ($keywords as $keyword) {
            if (strpos($userMessages, $keyword) !== false) {
                $score++;
            }
        }
        $scores[$package] = $score;
    }
    
    // Ordenar por número de coincidencias (mayor a menor)
    arsort($scores);
    
    // Si no hay coincidencias claras, recomendar el paquete intermedio
    if (max($scores) == 0) {
        return "Paquete Party (recomendación predeterminada - contactar para confirmar necesidades)";
    }
    
    // Obtener el paquete con más coincidencias
    $recommendedPackage = key($scores);
    
    // Añadir razón de la recomendación
    $reason = "";
    switch ($recommendedPackage) {
        case 'Paquete Event Plus':
            $reason = "ideal para eventos grandes como bodas, XV años o graduaciones";
            break;
        case 'Paquete Party':
            $reason = "perfecto para fiestas medianas y celebraciones privadas";
            break;
        case 'Paquete Live':
            $reason = "diseñado para eventos corporativos o masivos";
            break;
    }
    
    return "$recommendedPackage ($reason)";
}

/**
 * Procesar solicitud según el tipo
 */
try {
    if (isset($data['action']) && $data['action'] === 'send_summary') {
        // Verificar que tenemos los datos necesarios
        if (!isset($data['leadData']) || !isset($data['conversationData'])) {
            throw new Exception('Datos incompletos para enviar resumen');
        }
        
        // Enviar notificación de nuevo lead
        $success = sendLeadNotification($data['leadData'], $data['conversationData']);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Email enviado correctamente']);
        } else {
            throw new Exception('Error al enviar el email');
        }
    } else {
        // Acción no reconocida
        throw new Exception('Acción no reconocida');
    }
    
} catch (Exception $e) {
    // Manejar errores
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>