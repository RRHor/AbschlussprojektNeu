// src/services/exchangeService.js
import api from '../api';

class ExchangeService {
  // Meine Posts abrufen
  async getMyPosts() {
    try {
      const response = await api.get('/exchange/my/posts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Post erstellen
  async createPost(postData) {
    try {
      const response = await api.post('/exchange', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Post bearbeiten
  async updatePost(postId, postData) {
    try {
      const response = await api.put(`/exchange/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Post löschen
  async deletePost(postId) {
    try {
      const response = await api.delete(`/exchange/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Status ändern
  async updateStatus(postId, status) {
    try {
      const response = await api.put(`/exchange/${postId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Alle Posts abrufen (öffentlich)
  async getAllPosts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/exchange?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Einzelnen Post abrufen
  async getPost(postId) {
    try {
      const response = await api.get(`/exchange/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new ExchangeService();