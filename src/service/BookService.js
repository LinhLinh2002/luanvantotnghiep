import axios from 'axios';
import router from '@/router'; 

const API_BASE_URL = 'http://127.0.0.1:8000/api/admin/books';

class BookService {
    // Helper method to get token from localStorage
    _getAuthToken() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        return currentUser?.token?.access_token;
    }

    // Helper method to handle unauthorized access
    _handleUnauthorizedAccess() {
        alert("Bạn cần đăng nhập để tiếp tục.");
        router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
    }

    // Get all books
    static async getAllBooks() {
        try {
            const token = new BookService()._getAuthToken();
            const response = await axios.get(API_BASE_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                new BookService()._handleUnauthorizedAccess();
            } else {
                console.error("Error fetching books:", error);
            }
            throw error;
        }
    }

    // Get book by ID
    static async getBookById(bookId) {
        try {
            const token = new BookService()._getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/${bookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                new BookService()._handleUnauthorizedAccess();
            } else {
                console.error(`Error fetching book with ID ${bookId}:`, error);
            }
            throw error;
        }
    }

    // Create a book
    static async createBook(bookData) {
        try {
            const token = new BookService()._getAuthToken();
            const response = await axios.post(API_BASE_URL, bookData, {
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

    // Update a book
    static async updateBook(bookId, bookData) {
        try {
            const token = new BookService()._getAuthToken();
            const response = await axios.put(`${API_BASE_URL}/${bookId}`, bookData, {
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

    // Delete a book
    static async deleteBook(bookId) {
        try {
            const token = new BookService()._getAuthToken();
            const response = await axios.delete(`${API_BASE_URL}/${bookId}`, {
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