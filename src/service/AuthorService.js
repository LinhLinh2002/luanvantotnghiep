import axios from 'axios';
import router from '@/router'; // Import router để chuyển hướng trang

const API_URL_ADMIN  = 'http://127.0.0.1:8000/api/admin/authors';
const API_URL = 'http://127.0.0.1:8000/api/authors';

class AuthorService {
    // Helper method: Lấy token từ localStorage
    _getAuthToken() {
        const token = localStorage.getItem("access_token");
        return token || null;
    }

    // Helper method: Xử lý truy cập trái phép
    _handleUnauthorizedAccess() {
        //alert("Bạn cần đăng nhập để tiếp tục.");
        //router.push({ name: 'login' });
    }

    // Thêm axios headers chứa token
    _getAuthHeaders() {
        const token = this._getAuthToken();
        return { Authorization: `Bearer ${token}` };
    }

    async getAllAuthors() {
        try {
            const response = await axios.get(API_URL, {
                headers: this._getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                this._handleUnauthorizedAccess();
            }
            throw error;
        }
    }

    async getAuthorById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: this._getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                this._handleUnauthorizedAccess();
            }
            throw error;
        }
    }

    async createAuthor(data) {
        try {
            const response = await axios.post(API_URL_ADMIN, data, {
                headers: this._getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                this._handleUnauthorizedAccess();
            }
            throw error;
        }
    }

    async updateAuthor(id, data) {
        try {
            const response = await axios.put(`${API_URL_ADMIN}/${id}`, data, {
                headers: this._getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                this._handleUnauthorizedAccess();
            }
            throw error;
        }
    }

    async deleteAuthor(id) {
        try {
            const response = await axios.delete(`${API_URL_ADMIN}/${id}`, {
                headers: this._getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                this._handleUnauthorizedAccess();
            }
            throw error;
        }
    }
}

export default new AuthorService();
