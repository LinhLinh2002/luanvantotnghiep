import axios from 'axios';

const API_SEARCH_URL = 'http://127.0.0.1:8000/api/books/search';

class BookSearchService {
    // Tìm kiếm sách
    static async searchBooks(query) {
        try {
            const response = await axios.get(API_SEARCH_URL, {
                params: { query: query }
            });
            return response.data;
        } catch (error) {
            console.error("Error searching books:", error);
            throw error;
        }
    }
}

export default BookSearchService;
