// src/services/Categorieservice.js
import axios from 'axios';

const API_URL = 'https://backend.vothanhhoang.online/api/categories';

class CategoryService {
    async getAllCategories() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    async getCategoryById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    }

    async createCategory(data) {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    async updateCategory(id, data) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    async deleteCategory(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}

export default new CategoryService();
