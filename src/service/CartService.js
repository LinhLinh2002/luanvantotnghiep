import axios from 'axios';
import router from '../router';

const API_URL = 'http://127.0.0.1:8000/api/cart';

class CartService {
    // Lấy giỏ hàng
    async getCart() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
            alert("Bạn cần đăng nhập để xem giỏ hàng.");
            router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
            return;
        }

        try {
            const response = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                },
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { items: [] }; // Nếu giỏ hàng trống, trả về danh sách trống
            }
            // Xử lý lỗi khác nếu cần
            throw error;
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(bookId, quantity = 1) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error("Dữ liệu người dùng không hợp lệ hoặc chưa đăng nhập.");
            alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/add`, {
                user_id: currentUser.user_id,
                book_id: bookId,  // Sử dụng bookId để thêm sản phẩm vào giỏ
                quantity: quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                }
            });
            console.log("Thêm vào giỏ hàng thành công:", response.data);
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error.response?.data || error.message);
            alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
        }
    }

    // Tăng số lượng sản phẩm trong giỏ
    async increaseQuantity(itemId) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error('Bạn cần đăng nhập để thực hiện hành động này.');
            alert('Bạn cần đăng nhập để tăng số lượng sản phẩm.');
            router.push({ name: 'login' });
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/increase-quantity/${itemId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tăng số lượng:', error);
        }
    }

    // Giảm số lượng sản phẩm trong giỏ
    async decreaseQuantity(itemId) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error('Bạn cần đăng nhập để thực hiện hành động này.');
            alert('Bạn cần đăng nhập để giảm số lượng sản phẩm.');
            router.push({ name: 'login' });
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/decrease-quantity/${itemId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi giảm số lượng:', error);
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeItem(itemId) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error('Bạn cần đăng nhập để thực hiện hành động này.');
            alert('Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng.');
            router.push({ name: 'login' });
            return;
        }

        try {
            const response = await axios.delete(`${API_URL}/remove/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
        }
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error('Bạn cần đăng nhập để thực hiện hành động này');
            alert('Bạn cần đăng nhập để xóa toàn bộ giỏ hàng.');
            router.push({ name: 'login' });
            return;
        }

        try {
            const response = await axios.delete(`${API_URL}/clear`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
            throw error;
        }
    }
}

export default new CartService();
