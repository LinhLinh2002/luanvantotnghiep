import axios from 'axios';

const API_SEARCH_URL = 'http://127.0.0.1:8000/api/books/search';

class BookSearchService {
    static async searchBooks(keywords, authorId = null, sortBy = null, sortOrder = null) {
        try {
            const params = { keywords };

            if (authorId) params.author_id = authorId;
            if (sortBy) params.sort_by = sortBy;
            if (sortOrder) params.sort_order = sortOrder;

            // console.log("Tham số gửi đến API:", params); // Log tham số

            const response = await axios.get(API_SEARCH_URL, { params });
            // console.log("Kết quả tìm kiếm từ API:", response.data);
            return response.data;
        } catch (error) {
            // console.error("Error searching books:", error);
            throw error;
        }
    }
}


export default BookSearchService;
