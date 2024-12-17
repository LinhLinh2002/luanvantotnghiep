import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/discounts';

export default {
    async getDiscounts() {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error fetching discounts');
        }
    },

    async getDiscount(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error fetching discount details');
        }
    },

    async createDiscount(discount) {
        try {
            const response = await axios.post(API_BASE_URL, discount);
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error creating discount');
        }
    },

    async updateDiscount(id, discount) {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, discount);
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error updating discount');
        }
    },

    async deleteDiscount(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error deleting discount');
        }
    }
};
