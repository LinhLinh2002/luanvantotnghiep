// src/services/CartService.js
import axios from 'axios';

const API_URL = 'https://backend.vothanhhoang.online/api/cart';

class CartService {
    // Lấy danh sách sản phẩm trong giỏ hàng
    async getCart() {
        try {   
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
            // throw error;
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(productId, quantity = 1) {
        try {
            const response = await axios.post(`${API_URL}/add`, {
                product_id: productId,
                quantity: quantity,
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
        }
    }

    // Áp dụng mã giảm giá
    async applyCoupon(couponCode) {
        try {
            const response = await axios.post(`${API_URL}/apply-coupon`, {
                coupon: couponCode,
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi áp dụng mã giảm giá:', error);
        }
    }

    // Xóa mã giảm giá
    async removeCoupon() {
        try {
            const response = await axios.delete(`${API_URL}/remove-coupon`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa mã giảm giá:', error);
        }
    }

    // Tăng số lượng sản phẩm trong giỏ hàng
    async increaseQuantity(rowId) {
        try {
            const response = await axios.put(`${API_URL}/increase-quantity/${rowId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tăng số lượng sản phẩm trong giỏ hàng:', error);
        }
    }

    // Giảm số lượng sản phẩm trong giỏ hàng
    async decreaseQuantity(rowId) {
        try {
            const response = await axios.put(`${API_URL}/decrease-quantity/${rowId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi giảm số lượng sản phẩm trong giỏ hàng:', error);
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeFromCart(rowId) {
        try {
            const response = await axios.delete(`${API_URL}/remove/${rowId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
        }
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart() {
        try {
            const response = await axios.delete(`${API_URL}/clear`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
        }
    }

    // Áp dụng giảm giá trực tiếp
    async applyDiscount(discount) {
        try {
            const response = await axios.post(`${API_URL}/applydiscount`, {
                discount: discount,
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi áp dụng giảm giá trực tiếp:', error);
        }
    }
}

export default new CartService();
