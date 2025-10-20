import api from './api';

const API_URL = '/api/v1/chat';

export const chatService = {
  // Send a message and get streaming response
  async sendMessage(message, conversationHistory = []) {
    try {
      const response = await fetch(`http://localhost:5000${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      return response.body;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  },

  // Send a message and get simple non-streaming response
  async sendMessageSimple(message, conversationHistory = []) {
    try {
      const response = await api.post(`${API_URL}/simple`, {
        message,
        conversationHistory
      });
      return response.data;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }
};
