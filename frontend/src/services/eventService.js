import api from './api';

const eventService = {
  // Get all events with filters
  async getEvents(params = {}) {
    try {
      const response = await api.get('/events', { params });
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw error.response?.data || error;
    }
  },

  // Get single event by ID
  async getEvent(id) {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get event error:', error);
      throw error.response?.data || error;
    }
  },

  // Create new event
  async createEvent(eventData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(eventData).forEach(key => {
        if (key === 'banner' && eventData[key]) {
          // Handle file upload
          formData.append('banner', eventData[key]);
        } else if (key === 'tags' || key === 'schedule') {
          // Stringify JSON fields
          formData.append(key, JSON.stringify(eventData[key]));
        } else if (eventData[key] !== null && eventData[key] !== undefined && eventData[key] !== '') {
          formData.append(key, eventData[key]);
        }
      });

      const response = await api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error.response?.data || error;
    }
  },

  // Update event
  async updateEvent(id, eventData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(eventData).forEach(key => {
        if (key === 'banner' && eventData[key]) {
          // Handle file upload
          formData.append('banner', eventData[key]);
        } else if (key === 'tags' || key === 'schedule') {
          // Stringify JSON fields
          formData.append(key, JSON.stringify(eventData[key]));
        } else if (eventData[key] !== null && eventData[key] !== undefined && eventData[key] !== '') {
          formData.append(key, eventData[key]);
        }
      });

      const response = await api.put(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update event error:', error);
      throw error.response?.data || error;
    }
  },

  // Delete event
  async deleteEvent(id) {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete event error:', error);
      throw error.response?.data || error;
    }
  },

  // Register for event
  async registerForEvent(id, notes = '') {
    try {
      const response = await api.post(`/events/${id}/register`, { notes });
      return response.data;
    } catch (error) {
      console.error('Register for event error:', error);
      throw error.response?.data || error;
    }
  },

  // Unregister from event
  async unregisterFromEvent(id) {
    try {
      const response = await api.delete(`/events/${id}/register`);
      return response.data;
    } catch (error) {
      console.error('Unregister from event error:', error);
      throw error.response?.data || error;
    }
  },

  // Submit feedback
  async submitFeedback(id, rating, feedback) {
    try {
      const response = await api.post(`/events/${id}/feedback`, {
        rating,
        feedback,
      });
      return response.data;
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw error.response?.data || error;
    }
  },

  // Get event analytics (organizers only)
  async getEventAnalytics(id) {
    try {
      const response = await api.get(`/events/${id}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Get event analytics error:', error);
      throw error.response?.data || error;
    }
  },

  // Approve registration (admin only)
  async approveRegistration(eventId, registrationId) {
    try {
      const response = await api.put(`/events/${eventId}/registrations/${registrationId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Approve registration error:', error);
      throw error.response?.data || error;
    }
  },

  // Reject registration (admin only)
  async rejectRegistration(eventId, registrationId, reason = '') {
    try {
      const response = await api.put(`/events/${eventId}/registrations/${registrationId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Reject registration error:', error);
      throw error.response?.data || error;
    }
  },
};

export default eventService;
