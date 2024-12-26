import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth/wishlist';

const WishlistService = {
    // Lấy token từ localStorage
    getToken() {
        const token = localStorage.getItem("access_token");
        return token || null;
    },

    // Lấy danh sách yêu thích
    getWishlist() {
        const token = this.getToken();
        if (!token) {
            throw new Error('Token không hợp lệ');
        }
        return axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // Thêm sách vào danh sách yêu thích
    addToWishlist(bookId) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Token không hợp lệ');
        }
        return axios.post(API_URL, { book_id: bookId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // Xóa sách khỏi danh sách yêu thích
    removeFromWishlist(bookId) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Token không hợp lệ');
        }
        return axios.delete(`${API_URL}/${bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export default WishlistService;
