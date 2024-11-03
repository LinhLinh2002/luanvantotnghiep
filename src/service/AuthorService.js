
// src/services/AuthorService.js

import axios from 'axios';

const API_URL = 'https://backend.vothanhhoang.online/api/authors';

class AuthorService {
    async getAllAuthors() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching authors:', error);
            throw error;
        }
    }

    async getAuthorById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching author:', error);
            throw error;
        }
    }

    async createAuthor(data) {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating author:', error);
            throw error;
        }
    }

    async updateAuthor(id, data) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating author:', error);
            throw error;
        }
    }

    async deleteAuthor(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting author:', error);
            throw error;
        }
    }
}

export default new AuthorService();
