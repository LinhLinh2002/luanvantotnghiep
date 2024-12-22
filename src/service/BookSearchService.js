import axios from 'axios';

const API_SEARCH_URL = 'http://127.0.0.1:8000/api/books/search';

class BookSearchService {
    static async searchBooks(keywords, authorId = null, sortBy = null, sortOrder = null) {
        try {
            const params = { keywords }; // Thêm từ khóa tìm kiếm

            if (authorId) params.author_id = authorId; // Nếu có ID tác giả, thêm vào params
            if (sortBy) params.sort_by = sortBy; // Nếu có sort_by, thêm vào params
            if (sortOrder) params.sort_order = sortOrder; // Nếu có sort_order, thêm vào params

            const response = await axios.get(API_SEARCH_URL, { params });
            console.log("Kết quả tìm kiếm:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching books:", error);
            throw error;
        }
    }
}

export default BookSearchService;
