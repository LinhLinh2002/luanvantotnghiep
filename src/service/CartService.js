// src/services/CartService.js
import axios from 'axios';
import router from '../router';

const API_URL = 'https://backend.vothanhhoang.online/api/cart';

class CartService {
    // Lấy danh sách sản phẩm trong giỏ hàng
    async getCart() {

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
            alert("Bạn cần đăng nhập để xem giỏ hàng.");
            router.push({ name: 'login' });
            return;
        }

        try {
            const response = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2JhY2tlbmQudm90aGFuaGhvYW5nLm9ubGluZS9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTczMTk4NTYyOCwiZXhwIjoxNzMxOTg5MjI4LCJuYmYiOjE3MzE5ODU2MjgsImp0aSI6IjhzNzAzbmp0VnlISWZmaHUiLCJzdWIiOiI4IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.3-EAE_USFR8aNgs6pFxWZDFc71R9T_CcQq_3Um5Lw-o"
                },
            });

            //             "headers": {
            //     "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2JhY2tlbmQudm90aGFuaGhvYW5nLm9ubGluZS9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTczMTk4NTYyOCwiZXhwIjoxNzMxOTg5MjI4LCJuYmYiOjE3MzE5ODU2MjgsImp0aSI6IjhzNzAzbmp0VnlISWZmaHUiLCJzdWIiOiI4IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.3-EAE_USFR8aNgs6pFxWZDFc71R9T_CcQq_3Um5Lw-o",
            //     "Content-Type": "application/json"
            //   },
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { items: [] };
            }

            throw error;
        }
    }


    async addToCart(bookId, quantity = 1) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser || !currentUser.token || !currentUser.user.id) {
            alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            router.push({ name: 'login' });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/add`, {
                user_id: currentUser.user.id,
                book_id: bookId,
                quantity: quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                }
            });

            console.log("Thêm vào giỏ hàng thành công:", response.data);
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error.response?.data || error.message);
            alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
        }
    }
    // Thêm sản phẩm vào giỏ hàng

    // async addToCart(bookId, quantity = 1) {
    //     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    //     const userId = currentUser?.id; // Lấy user_id từ currentUser

    //     if (!userId) {
    //         console.error('Không tìm thấy user_id. Vui lòng đăng nhập.');
    //         alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
    //         router.push({ name: 'login' });
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(`${API_URL}/add`, {
    //             user_id: userId,
    //             book_id: bookId,
    //             quantity: quantity,
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Lỗi khi thêm vào giỏ hàng:', error.response?.data || error);
    //         throw error;
    //     }
    // }


    isLoggedIn() {
        return !!localStorage.getItem("currentUser"); // Kiểm tra xem người dùng có đăng nhập hay không
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
            throw error;

        }
    }

    // Xóa mã giảm giá
    async removeCoupon() {
        try {
            const response = await axios.delete(`${API_URL}/remove-coupon`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa mã giảm giá:', error);
            throw error;

        }
    }

    // Tăng số lượng sản phẩm trong giỏ hàng
    async increaseQuantity(rowId) {
        try {
            const response = await axios.put(`${API_URL}/increase-quantity/${rowId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tăng số lượng sản phẩm trong giỏ hàng:', error);
            throw error;

        }
    }

    // Giảm số lượng sản phẩm trong giỏ hàng
    async decreaseQuantity(rowId) {
        try {
            const response = await axios.put(`${API_URL}/decrease-quantity/${rowId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi giảm số lượng sản phẩm trong giỏ hàng:', error);
            throw error;

        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeFromCart(rowId) {
        try {
            const response = await axios.delete(`${API_URL}/remove/${rowId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            throw error;

        }
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart() {
        try {
            const response = await axios.delete(`${API_URL}/clear`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
            throw error;

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
            throw error;

        }
    }
}

export default new CartService();
