<?php
/**
 * Chatbot AI para Grupo Musical Versátil La Célula
 * 
 * Este script maneja las solicitudes del chatbot y genera respuestas
 * usando un modelo de IA o reglas predefinidas.
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
if (!$data || !isset($data['history'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

// Función para procesar la conversación y generar respuesta
function generateResponse($conversationHistory, $lastUserMessage) {
    // 1. Intentar obtener una respuesta basada en reglas
    $response = getResponseByRules($lastUserMessage, $conversationHistory);
    
    // 2. Si no hay regla, consultar a la API de Gemini
    if (empty($response)) {
        $apiKey = getenv('GEMINI_API_KEY'); // Carga la API Key desde los secrets de Cloudflare
        if ($apiKey) {
            $response = getGeminiResponse($conversationHistory, $apiKey);
        }
    }

    // 3. Si Gemini falla o no responde, usar un fallback
    if (empty($response)) {
        $response = getFallbackResponse($lastUserMessage);
    }
    
    return $response;
}

/**
 * Consulta a la API de Gemini para obtener una respuesta inteligente
 */
function getGeminiResponse($history, $apiKey) {
    $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . $apiKey;

    $payload = json_encode([
        'contents' => $history,
        // Aquí puedes añadir 'generationConfig', 'safetySettings', etc. si es necesario
    ]);

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
    ]);

    $apiResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $apiResponse) {
        $responseData = json_decode($apiResponse, true);
        if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
            return $responseData['candidates'][0]['content']['parts'][0]['text'];
        }
    }
    
    // Si la API falla o la respuesta no es válida, devuelve null
    return null;
}

/**
 * Sistema de reglas para respuestas específicas basadas en palabras clave
 */
function getResponseByRules($userMessage, $history) {
    $userMessage = strtolower($userMessage);
    
    // Patrones para detectar intenciones específicas
    $patterns = [
        // Preguntas sobre servicios y paquetes
        'servicios|paquetes|ofrecen|tienen' => [
            "¡Claro! 🎵 En **Grupo Musical La Célula** ofrecemos 3 paquetes principales:\n\n" .
            "1. **Paquete Event Plus**: Ideal para grandes eventos (50-2000 invitados), incluye 5 horas de música en vivo, iluminación, pantalla y animadores.\n\n" .
            "2. **Paquete Party**: Perfecto para eventos medianos (30-250 invitados), con 5 horas de música, iluminación y efectos especiales.\n\n" .
            "3. **Paquete Live**: Para eventos masivos o corporativos, con show temático personalizado y capacidad hasta 10,000 personas.\n\n" .
            "¿Cuál te interesa más para tu evento? 😊"
        ],
        
        // Preguntas sobre precios o cotizaciones
        'precio|costo|cotiz|cuanto|cuánto' => [
            "Para ofrecerte una **cotización personalizada** 💰 necesitamos conocer algunos detalles de tu evento:\n\n" .
            "- ¿Qué tipo de evento estás planeando? (boda, XV años, corporativo, etc.)\n" .
            "- ¿Cuántos invitados aproximadamente tendrás?\n" .
            "- ¿Ya tienes fecha y lugar definidos?\n\n" .
            "Puedes proporcionarnos esta información aquí o contactarnos directamente por WhatsApp al **55 3541 2631** para una atención más rápida. ¡Estaremos encantados de ayudarte!"
        ],
        
        // Preguntas sobre música o repertorio
        'musica|cancion|repertorio|tocan|generos' => [
            "¡Nuestra **versatilidad musical** es nuestra mayor fortaleza! 🎸🎹🎺\n\n" .
            "Nuestro repertorio incluye prácticamente todos los géneros:\n" .
            "- Cumbia, Salsa y música tropical\n" .
            "- Rock clásico y contemporáneo\n" .
            "- Pop en español e inglés\n" .
            "- Baladas y música romántica\n" .
            "- Música regional mexicana\n" .
            "- Jazz, Swing y música para ambientar\n" .
            "- Éxitos actuales y clásicos de todos los tiempos\n\n" .
            "Además, diseñamos bloques musicales personalizados para cada momento de tu evento. ¿Hay algún género en particular que te interese?"
        ],
        
        // Preguntas sobre bodas
        'boda|matrimonio|novia' => [
            "¡Las **bodas** son nuestra especialidad! 💍✨\n\n" .
            "Ofrecemos experiencias musicales completas para cada momento de tu celebración:\n\n" .
            "- **Ceremonia**: Música elegante y emotiva\n" .
            "- **Recepción y coctel**: Ambientación sofisticada\n" .
            "- **Banquete**: Música suave de fondo\n" .
            "- **Fiesta**: ¡Todos a la pista de baile!\n\n" .
            "Nuestro **Paquete Party** es muy popular para bodas, pero podemos personalizar según tus necesidades y número de invitados. ¿Ya tienes fecha para tu boda? Me encantaría ayudarte a planificar la música perfecta."
        ],
        
        // Preguntas sobre XV años
        'xv|quince|quinceañera' => [
            "¡Para **XV Años** creamos momentos inolvidables! 🎂👗\n\n" .
            "Nuestro servicio incluye:\n" .
            "- Música especial para el vals y ceremonias tradicionales\n" .
            "- Show 80's o temático a elección\n" .
            "- Dinámicas y animación para que todos tus invitados participen\n" .
            "- Efectos especiales y luces\n" .
            "- ¡Batucada para el momento de máxima diversión!\n\n" .
            "El **Paquete Party** es perfecto para la mayoría de las fiestas de XV años. ¿Ya tienes idea de qué tipo de música te gustaría para tu fiesta?"
        ],
        
        // Preguntas sobre eventos corporativos
        'corporativo|empresa|convención' => [
            "Para **eventos corporativos** ofrecemos soluciones profesionales y versátiles. 🏢✨\n\n" .
            "Nuestros servicios incluyen:\n" .
            "- Música adaptada a la imagen de su empresa\n" .
            "- Shows temáticos personalizados\n" .
            "- Equipo técnico de primer nivel\n" .
            "- Puntualidad y profesionalismo\n" .
            "- Repertorio adecuado para cada momento del evento\n\n" .
            "El **Paquete Live** está diseñado especialmente para eventos corporativos grandes. ¿Podría contarme más sobre el tipo de evento que está organizando?"
        ],
        
        // Preguntas sobre disponibilidad o fechas
        'disponib|fecha|día|agenda|cuando|cuándo' => [
            "Para verificar nuestra **disponibilidad** para tu fecha, necesitamos que nos indiques:\n\n" .
            "- ¿Qué día específico estás considerando?\n" .
            "- ¿En qué horario sería tu evento?\n" .
            "- ¿Qué tipo de evento estás planeando?\n\n" .
            "Te recomendamos reservar con 2-3 meses de anticipación, especialmente para temporada alta (diciembre-enero y mayo-junio). Puedes consultar disponibilidad inmediata por WhatsApp al **55 3541 2631** 📱"
        ],
        
        // Preguntas sobre el proceso de contratación
        'contrat|reserv|anticipo|apartado|proceso' => [
            "El **proceso de contratación** es muy sencillo: 🎵📝\n\n" .
            "1. **Cotización personalizada** según tus necesidades\n" .
            "2. **Reserva** con un anticipo del 30%\n" .
            "3. **Confirmación** de detalles (horario, playlist especial, etc.)\n" .
            "4. **Pago** del saldo restante antes del evento\n" .
            "5. **¡Disfruta tu evento!** Nosotros nos encargamos de todo\n\n" .
            "Para comenzar, puedes usar nuestro cotizador en línea o contactarnos directamente por WhatsApp al **55 3541 2631**. ¿Te gustaría iniciar el proceso ahora?"
        ],
        
        // Preguntas sobre equipo/instrumentos/montaje
        'equipo|instrument|sonido|montaje' => [
            "Contamos con **equipo profesional** para eventos de cualquier tamaño: 🎧🎚️\n\n" .
            "- Sistemas de sonido de alta fidelidad\n" .
            "- Iluminación profesional robotizada y láser\n" .
            "- Pantallas LED (según el paquete)\n" .
            "- Instrumentos profesionales\n" .
            "- Efectos especiales\n\n" .
            "Realizamos el **montaje completo** con anticipación para garantizar que todo funcione perfectamente. El tiempo de montaje varía según el paquete, pero generalmente necesitamos 2-3 horas antes del evento. ¿Tienes alguna necesidad técnica específica para tu evento?"
        ],
        
        // Saludos o inicios de conversación
        'hola|buenos dias|buenas tardes|buenas noches|saludos|buen día' => [
            "¡Hola! 👋 Bienvenido al asistente virtual de **Grupo Musical Versátil La Célula**. Estoy aquí para ayudarte a encontrar la música perfecta para tu evento. ¿En qué puedo ayudarte hoy? ¿Buscas información sobre nuestros paquetes, disponibilidad o tienes alguna duda específica?"
        ],
        
        // Despedidas o agradecimientos
        'gracias|adios|adiós|hasta luego|bye|chao' => [
            "¡Gracias por contactarnos! 🎵 Ha sido un placer ayudarte. Si tienes más preguntas, no dudes en escribirnos por WhatsApp al **55 3541 2631** o usar nuestro cotizador en línea. ¡Esperamos ser parte de tu evento especial! 🎉"
        ]
    ];
    
    // Buscar coincidencias en los patrones
    foreach ($patterns as $pattern => $responses) {
        if (preg_match("/\b($pattern)\b/i", $userMessage)) {
            // Elegir una respuesta aleatoria dentro de las posibles para ese patrón
            return $responses[array_rand($responses)];
        }
    }
    
    // Si no hay coincidencia, devolver cadena vacía para usar fallback
    return '';
}

/**
 * Respuestas genéricas cuando no hay coincidencia específica
 */
function getFallbackResponse($userMessage) {
    $fallbackResponses = [
        "Gracias por tu mensaje. En **Grupo Musical La Célula** nos especializamos en hacer tu evento inolvidable con nuestra música versátil. 🎵\n\n¿Podrías contarme más sobre el tipo de evento que estás planeando? Así podré brindarte información más específica sobre nuestros paquetes.",
        
        "¡Qué interesante! Para ofrecerte la mejor recomendación, me gustaría saber: ¿estás planeando una boda 💍, XV años 🎂, evento corporativo 🏢 u otro tipo de celebración? Cada evento tiene necesidades específicas que podemos atender.",
        
        "Entiendo. Para ayudarte mejor, ¿podrías indicarme aproximadamente cuántas personas asistirán a tu evento? Esto me ayudará a recomendarte el paquete musical más adecuado para tus necesidades.",
        
        "Gracias por compartir esa información. 😊 Si quieres una **cotización personalizada**, puedes contactarnos directamente por WhatsApp al **55 3541 2631** o proporcionarme más detalles sobre tu evento aquí mismo.",
        
        "**Grupo Musical Versátil La Célula** tiene más de 10 años de experiencia creando ambientes musicales perfectos. ¿Hay algún género musical en particular que te gustaría incluir en tu evento?",
        
        "Me encantaría ayudarte a hacer tu evento especial. ¿Ya tienes una fecha definida? Podemos verificar nuestra disponibilidad y comenzar a planificar la música perfecta para tu celebración."
    ];
    
    // Elegir una respuesta aleatoria
    return $fallbackResponses[array_rand($fallbackResponses)];
}

try {
    // Obtener el último mensaje del usuario para pasarlo a las funciones
    $lastUserMessage = '';
    for ($i = count($data['history']) - 1; $i >= 0; $i--) {
        if ($data['history'][$i]['role'] === 'user') {
            $lastUserMessage = $data['history'][$i]['parts'][0]['text'];
            break;
        }
    }

    // Generar la respuesta
    $botResponse = generateResponse($data['history'], $lastUserMessage);
    
    // Estructura de la respuesta para el frontend
    $response = [
        'candidates' => [
            [
                'content' => [
                    'parts' => [
                        ['text' => $botResponse]
                    ]
                ]
            ]
        ]
    ];
    
    // Detectar posibles intenciones del usuario para enviar a ventas
    $lastUserMessage = '';
    for ($i = count($data['history']) - 1; $i >= 0; $i--) {
        if ($data['history'][$i]['role'] === 'user') {
            $lastUserMessage = strtolower($data['history'][$i]['parts'][0]['text']);
            break;
        }
    }
    
    // Palabras clave que indican alta intención de compra
    $highIntentKeywords = ['cotizar', 'contratar', 'disponibilidad', 'precio', 'costo', 'fecha', 'reservar'];
    $hasHighIntent = false;
    
    foreach ($highIntentKeywords as $keyword) {
        if (strpos($lastUserMessage, $keyword) !== false) {
            $hasHighIntent = true;
            break;
        }
    }
    
    // Si detectamos alta intención, agregamos una flag para que el frontend lo sepa
    if ($hasHighIntent) {
        $response['highIntent'] = true;
    }
    
    // Enviar la respuesta
    echo json_encode($response);
    
} catch (Exception $e) {
    // Manejar errores
    http_response_code(500);
    echo json_encode(['error' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
}
?>