// src/service/DiscountService.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/discounts';

export default {
    async getDiscounts() {
        return axios.get(API_BASE_URL).then(response => response.data).catch(err => {
            throw new Error(err.response.data.message || 'Error fetching discounts');
        });
    },
    async createDiscount(discount) {
        return axios.post(API_BASE_URL, discount).then(response => response.data).catch(err => {
            throw new Error(err.response.data.message || 'Error creating discount');
        });
    },
    async updateDiscount(id, discount) {
        return axios.put(`${API_BASE_URL}/${id}`, discount).then(response => response.data).catch(err => {
            throw new Error(err.response.data.message || 'Error updating discount');
        });
    },
    async deleteDiscount(id) {
        return axios.delete(`${API_BASE_URL}/${id}`).then(response => response.data).catch(err => {
            throw new Error(err.response.data.message || 'Error deleting discount');
        });
    }
};
