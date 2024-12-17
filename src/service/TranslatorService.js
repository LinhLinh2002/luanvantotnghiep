
// src/services/Translatorservice.js

import axios from 'axios';
import router from '@/router'; 

const API_URL = 'http://127.0.0.1:8000/api/admin/translators';

class Translatorservice {
    // Helper method to get token from localStorage
    _getAuthToken() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        return currentUser?.token?.access_token;
    }

    // Helper method to handle unauthorized access
    _handleUnauthorizedAccess() {
        alert("Bạn cần đăng nhập để tiếp tục.");
        router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
    }

    // Get all translators
    async getAllTranslators() {
        try {
            const token = this._getAuthToken();
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this._handleUnauthorizedAccess();
            } else {
                console.error('Error fetching Translators:', error);
            }
            throw error;
        }
    }

    // Get translator by ID
    async getTranslatorById(id) {
        try {
            const token = this._getAuthToken();
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this._handleUnauthorizedAccess();
            } else {
                console.error('Error fetching Translator:', error);
            }
            throw error;
        }
    }

    // Create translator
    async createTranslator(data) {
        try {
            const token = this._getAuthToken();
            const response = await axios.post(API_URL, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this._handleUnauthorizedAccess();
            } else {
                console.error('Error creating Translator:', error);
            }
            throw error;
        }
    }

    // Update translator
    async updateTranslator(id, data) {
        try {
            const token = this._getAuthToken();
            const response = await axios.put(`${API_URL}/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this._handleUnauthorizedAccess();
            } else {
                console.error('Error updating Translator:', error);
            }
            throw error;
        }
    }

    // Delete translator
    async deleteTranslator(id) {
        try {
            const token = this._getAuthToken();
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this._handleUnauthorizedAccess();
            } else {
                console.error('Error deleting Translator:', error);
            }
            throw error;
        }
    }
}

export default new Translatorservice();