import axios from 'axios';
import router from '../router';

const API_URL = 'http://127.0.0.1:8000/api/auth/cart';

class CartService {
    getToken() {
        const token = localStorage.getItem("access_token");
        return token || null;
    }


   // Chuyển hướng nếu không có token
    ensureAuthenticated() {
        const token = this.getToken();
        if (!token) {
            throw new Error("Người dùng chưa đăng nhập.");
        }
        return token;
    }

    // Lấy giỏ hàng
    async getCart() {
        try {
            const token = this.ensureAuthenticated();
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            // console.error("Lỗi khi lấy giỏ hàng:", error.response?.data || error.message);
            if (error.response?.status === 404) {
                return { items: [] };
            }
            throw error;
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(bookId, quantity = 1) {
        try {
            const token = this.ensureAuthenticated();
            if (!bookId || !quantity || quantity < 1) {
                throw new Error("Thông tin sản phẩm không hợp lệ.");
            }

            const response = await axios.post(
                `${API_URL}/add`,
                { book_id: bookId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            // console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.response?.data || error.message);
            throw error;
        }
    }

    // Tăng số lượng sản phẩm
    async increaseQuantity(itemId) {
        try {
            const token = this.ensureAuthenticated();
            const response = await axios.put(`${API_URL}/increase-quantity/${itemId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            // console.error("Lỗi khi tăng số lượng sản phẩm:", error.response?.data || error.message);
            throw error;
        }
    }

    // Giảm số lượng sản phẩm
    async decreaseQuantity(itemId) {
        try {
            const token = this.ensureAuthenticated();
            const response = await axios.put(`${API_URL}/decrease-quantity/${itemId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            // console.error("Lỗi khi giảm số lượng sản phẩm:", error.response?.data || error.message);
            throw error;
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeItem(itemId) {
        try {
            const token = this.ensureAuthenticated();
            const response = await axios.delete(`${API_URL}/remove/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            // console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
            throw error;
        }
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart() {
        try {
            const token = this.ensureAuthenticated();
            const response = await axios.delete(`${API_URL}/clear`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            // console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error.response?.data || error.message);
            throw error;
        }
    }
}

export default new CartService();
