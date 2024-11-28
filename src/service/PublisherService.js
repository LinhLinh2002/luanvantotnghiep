
// src/services/Publisherservice.js

import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/publishers';

class Publisherservice {
    async getAllPublishers() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching Publishers:', error);
            throw error;
        }
    }

    async getPublisherById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Publisher:', error);
            throw error;
        }
    }

    async createPublisher(data) {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating Publisher:', error);
            throw error;
        }
    }

    async updatePublisher(id, data) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating Publisher:', error);
            throw error;
        }
    }

    async deletePublisher(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting Publisher:', error);
            throw error;
        }
    }
}

export default new Publisherservice();


