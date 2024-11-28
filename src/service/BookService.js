import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/books';

class BookService {
    static async getAllBooks() {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching books:", error);
            throw error;
        }
    }

    static async getBookById(bookId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${bookId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching book with ID ${bookId}:`, error);
            throw error;
        }
    }

    static async createBook(bookData) {
        try {
            const response = await axios.post(API_BASE_URL, bookData);
            return response.data;
        } catch (error) {
            console.error("Error creating book:", error);
            throw error;
        }
    }

    static async updateBook(bookId, bookData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/${bookId}`, bookData);
            return response.data;
        } catch (error) {
            console.error(`Error updating book with ID ${bookId}:`, error);
            throw error;
        }
    }

    static async deleteBook(bookId) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${bookId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting book with ID ${bookId}:`, error);
            throw error;
        }
    }
}

export default BookService;
