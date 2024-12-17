// src/services/Categorieservice.js
import axios from 'axios';
import router from '@/router'; 
const API_URL = 'http://127.0.0.1:8000/api/admin/categories';


class CategoryService {
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

    // Get all categories
    async getAllCategories() {
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
                console.error('Error fetching categories:', error);
            }
            throw error;
        }
    }

    // Get category by ID
    async getCategoryById(id) {
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
                console.error('Error fetching category:', error);
            }
            throw error;
        }
    }

    // Create category
    async createCategory(data) {
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
                console.error('Error creating category:', error);
            }
            throw error;
        }
    }

    // Update category
    async updateCategory(id, data) {
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
                console.error('Error updating category:', error);
            }
            throw error;
        }
    }

    // Delete category
    async deleteCategory(id) {
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
                console.error('Error deleting category:', error);
            }
            throw error;
        }
    }
}

export default new CategoryService();