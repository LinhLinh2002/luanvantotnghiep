
// src/services/CoPublisherservice.js

import axios from 'axios';

const API_URL = 'https://backend.vothanhhoang.online/api/co_publishers';

class CoPublisherservice {
    async getAllCoPublishers() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching CoPublishers:', error);
            throw error;
        }
    }

    async getCoPublisherById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching CoPublisher:', error);
            throw error;
        }
    }

    async createCoPublisher(data) {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating CoPublisher:', error);
            throw error;
        }
    }

    async updateCoPublisher(id, data) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating CoPublisher:', error);
            throw error;
        }
    }

    async deleteCoPublisher(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting CoPublisher:', error);
            throw error;
        }
    }
}

export default new CoPublisherservice();

