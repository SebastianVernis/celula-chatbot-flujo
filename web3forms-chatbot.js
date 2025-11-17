// Web3Forms para envio de conversaciones del chatbot
async function sendChatConversation(chatHistory, userData) {
    if (!chatHistory || chatHistory.length < 2) return;
    
    let formatted = 'CONVERSACION DEL CHATBOT\n';
    formatted += '='.repeat(50) + '\n\n';
    
    chatHistory.forEach((msg, index) => {
        const role = msg.role === 'user' ? 'CLIENTE' : 'ASISTENTE';
        const text = msg.parts ? msg.parts[0].text : msg.message || '';
        formatted += '[' + (index + 1) + '] ' + role + ':\n';
        formatted += text + '\n\n';
    });
    
    formatted += '='.repeat(50) + '\n';
    formatted += 'Total: ' + chatHistory.length + ' mensajes\n';
    formatted += 'Fecha: ' + new Date().toLocaleString('es-MX');
    
    const formData = new FormData();
    formData.append("access_key", "c437c213-198c-4507-893a-9ecaca4af699");
    formData.append("subject", "Nueva conversacion del chatbot - Grupo Musical La Celula");
    formData.append("from_name", "Chatbot La Celula");
    formData.append("name", userData.name || "Usuario del Chatbot");
    formData.append("email", userData.email || "no-proporcionado@celula.com");
    formData.append("phone", userData.phone || "No proporcionado");
    formData.append("message", formatted);
    
    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
        
        const data = await response.json();
        console.log('Conversacion enviada:', data.success);
        return data;
    } catch (error) {
        console.error('Error enviando conversacion:', error);
        return { success: false };
    }
}

window.sendChatConversation = sendChatConversation;
