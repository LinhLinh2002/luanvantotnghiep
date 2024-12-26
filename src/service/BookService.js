import axios from 'axios';
import router from '@/router';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

class BookService {
    // Helper method to get token from localStorage
    _getAuthToken() {
        const token = localStorage.getItem("access_token");
        return token || null;
    }

    // Helper method to handle unauthorized access
    _handleUnauthorizedAccess() {
        // alert("Bạn cần đăng nhập để tiếp tục.");
        // router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
    }

    // Get all books (no token required)
    static async getAllBooks() {
        try {
            const response = await axios.get(`${API_BASE_URL}/books`);
            return response.data;
        } catch (error) {
            console.error("Error fetching books:", error);
            throw error;
        }
    }

    // Get book by ID (no token required)
    static async getBookById(bookId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/books/${bookId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching book with ID ${bookId}:`, error);
            throw error;
        }
    }

    // Create a book (token required)
    static async createBook(bookData) {
        try {
            const token = new BookService()._getAuthToken();
            const response = await axios.post(`${API_BASE_URL}/admin/books`, bookData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                new BookService()._handleUnauthorizedAccess();
            } else {
                console.error("Error creating book:", error);
            }
            throw error;
        }
    }

    // Update a book (token required)
    static async updateBook(bookId, bookData) {
        try {
            const token = new BookService()._getAuthToken();
            const response = await axios.put(`${API_BASE_URL}/admin/books/${bookId}`, bookData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                new BookService()._handleUnauthorizedAccess();
            } else {
                console.error(`Error updating book with ID ${bookId}:`, error);
            }
            throw error;
        }
    }

    // Delete a book (token required)
    static async deleteBook(bookId) {
        try {
            const token = new BookService()._getAuthToken();
            const response = await axios.delete(`${API_BASE_URL}/admin/books/${bookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                new BookService()._handleUnauthorizedAccess();
            } else {
                console.error(`Error deleting book with ID ${bookId}:`, error);
            }
            throw error;
        }
    }
}

export default BookService;
