
// src/services/Translatorservice.js

import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/translators';

class Translatorservice {
    async getAllTranslators() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching Translators:', error);
            throw error;
        }
    }

    async getTranslatorById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Translator:', error);
            throw error;
        }
    }

    async createTranslator(data) {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating Translator:', error);
            throw error;
        }
    }

    async updateTranslator(id, data) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating Translator:', error);
            throw error;
        }
    }

    async deleteTranslator(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting Translator:', error);
            throw error;
        }
    }
}

export default new Translatorservice();



