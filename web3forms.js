// Web3Forms Handler para Grupo Musical La Celula
class Web3FormsHandler {
  constructor(accessKey) {
    this.accessKey = accessKey || 'c437c213-198c-4507-893a-9ecaca4af699';
    this.apiUrl = 'https://api.web3forms.com/submit';
  }

  async submitForm(formData) {
    try {
      const data = new FormData();
      data.append('access_key', this.accessKey);
      
      for (const [key, value] of Object.entries(formData)) {
        data.append(key, value);
      }
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: data
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: error.message };
    }
  }

  async submitChatConversation(conversationData) {
    const messages = conversationData.messages || [];
    let formatted = 'CONVERSACION DEL CHATBOT\n';
    formatted += '='.repeat(50) + '\n\n';
    
    messages.forEach((msg, index) => {
      const role = msg.role === 'user' ? 'CLIENTE' : 'ASISTENTE';
      formatted += '[' + (index + 1) + '] ' + role + ':\n';
      formatted += msg.text + '\n\n';
    });
    
    formatted += '='.repeat(50) + '\n';
    formatted += 'Total: ' + messages.length + ' mensajes\n';
    formatted += 'Fecha: ' + new Date().toLocaleString('es-MX');
    
    const formData = {
      subject: 'Nueva conversacion del chatbot - Grupo Musical La Celula',
      from_name: 'Chatbot La Celula',
      name: conversationData.userName || 'Usuario Anonimo',
      email: conversationData.userEmail || 'no-proporcionado@celula.com',
      phone: conversationData.userPhone || 'No proporcionado',
      message: formatted,
      conversation_length: messages.length,
      timestamp: new Date().toISOString()
    };
    
    return await this.submitForm(formData);
  }
}

window.web3FormsHandler = new Web3FormsHandler();
