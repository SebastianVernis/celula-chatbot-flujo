<?php
/**
 * Endpoint para envío de emails desde el chatbot
 * Maneja las solicitudes AJAX del frontend para enviar resúmenes de conversación
 */

header('Content-Type: application/json');

// Solo permitir métodos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

require 'chatbot_email_service.php';

try {
    // Leer datos de la petición
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('No se recibieron datos válidos');
    }
    
    // Validar datos requeridos
    $leadData = $input['leadData'] ?? null;
    $conversationData = $input['conversationData'] ?? null;
    $action = $input['action'] ?? 'send_summary';
    
    if (!$leadData || !isset($leadData['name'], $leadData['email'], $leadData['phone'])) {
        throw new Exception('Datos del lead incompletos');
    }
    
    $emailService = new ChatbotEmailService();
    
    switch ($action) {
        case 'send_summary':
            if (!$conversationData) {
                throw new Exception('Datos de conversación requeridos');
            }
            
            $result = $emailService->sendConversationSummary($leadData, $conversationData);
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Resumen enviado exitosamente',
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            } else {
                throw new Exception('Error al enviar el resumen por email');
            }
            break;
            
        case 'test_email':
            $result = $emailService->sendTestEmail();
            
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Email de prueba enviado exitosamente'
                ]);
            } else {
                throw new Exception('Error al enviar email de prueba');
            }
            break;
            
        default:
            throw new Exception('Acción no válida');
    }
    
} catch (Exception $e) {
    error_log("Error en chatbot_mailer.php: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
