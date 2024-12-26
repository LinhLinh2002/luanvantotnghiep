
// src/services/Publisherservice.js

import axios from 'axios';
import router from '@/router'; 

const API_URL_ADMIN = 'http://127.0.0.1:8000/api/admin/publishers';
const API_URL = 'http://127.0.0.1:8000/api/publishers';


class Publisherservice {
    // Helper method to get token from localStorage
    _getAuthToken() {
        const token = localStorage.getItem("access_token");
        return token || null;
    }

    // Helper method to handle unauthorized access
    _handleUnauthorizedAccess() {
      //  alert("Bạn cần đăng nhập để tiếp tục.");
//router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
    }

    // Get all publishers
    async getAllPublishers() {
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
                console.error('Error fetching Publishers:', error);
            }
            throw error;
        }
    }

    // Get publisher by ID
    async getPublisherById(id) {
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
                console.error('Error fetching Publisher:', error);
            }
            throw error;
        }
    }

    // Create publisher
    async createPublisher(data) {
        try {
            const token = this._getAuthToken();
            const response = await axios.post(API_URL_ADMIN , data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this._handleUnauthorizedAccess();
            } else {
                console.error('Error creating Publisher:', error);
            }
            throw error;
        }
    }

    // Update publisher
    async updatePublisher(id, data) {
        try {
            const token = this._getAuthToken();
            const response = await axios.put(`${API_URL_ADMIN }/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this._handleUnauthorizedAccess();
            } else {
                console.error('Error updating Publisher:', error);
            }
            throw error;
        }
    }

    // Delete publisher
    async deletePublisher(id) {
        try {
            const token = this._getAuthToken();
            const response = await axios.delete(`${API_URL_ADMIN }/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this._handleUnauthorizedAccess();
            } else {
                console.error('Error deleting Publisher:', error);
            }
            throw error;
        }
    }
}

export default new Publisherservice();