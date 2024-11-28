import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
class AttributeService {
    async getAllGenres() {
        try {
            const response = await axios.get(`${API_URL}/genres`);
            return response.data;
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    }
    async getAllLanguages() {
        try {
            const response = await axios.get(`${API_URL}/languages`);
            return response.data;
        } catch (error) {
            console.error('Error fetching languages:', error);
            throw error;
        }
    }
    async getAllCoverTypes() {
        try {
            const response = await axios.get(`${API_URL}/covertypes`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Cover Types:', error);
            throw error;
        }
    }
 
}
export default new AttributeService();
    