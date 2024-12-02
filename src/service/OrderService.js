import axios from 'axios';
import router from '../router';

const API_URL = 'http://127.0.0.1:8000/api/orders'; // URL API cho đơn hàng
const ADMIN_API_URL = 'http://127.0.0.1:8000/api/admin/orders'; // URL API cho đơn hàng của admin

class OrderService {
    // Lấy danh sách đơn hàng cho user
    async getUserOrders() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
            alert("Bạn cần đăng nhập để xem đơn hàng.");
            router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
            return;
        }

        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                },
                params: { user_id: currentUser.id } // Lọc đơn hàng theo user_id
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { items: [] }; // Nếu không có đơn hàng, trả về danh sách trống
            }
            throw error;
        }
    }

    // Lấy danh sách đơn hàng cho admin
    async getAdminOrders() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;
        try {
            const response = await axios.get(ADMIN_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                },
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { items: [] }; // Nếu không có đơn hàng, trả về danh sách trống
            }
            throw error;
        }
    }

    // Lấy thông tin chi tiết đơn hàng
    async getOrderById(orderId) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
            alert("Bạn cần đăng nhập để xem chi tiết đơn hàng.");
            router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            throw error;
        }
    }

    // Cập nhật trạng thái đơn hàng cho người dùng
    async updateOrderStatus(orderId, status) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        if (!token) {
            console.error("Bạn cần đăng nhập để cập nhật trạng thái đơn hàng.");
            alert("Bạn cần đăng nhập để thay đổi trạng thái đơn hàng.");
            router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/${orderId}/status`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            });
            console.log('Cập nhật trạng thái đơn hàng thành công:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            throw error;
        }
    }

    // Cập nhật trạng thái đơn hàng cho admin
    async adminUpdateOrderStatus(orderId, status) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        try {
            const response = await axios.put(`${ADMIN_API_URL}/${orderId}`, { order_status:status }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Cập nhật trạng thái đơn hàng thành công:', response.data);
            return response.data;
        } catch (error) {
            console.log(order_status);
            
            console.error('Lỗi khi cập nhật trạng thái cho admin:', error);
            throw error;
        }
    }

    // Xóa đơn hàng (admin)
    async deleteOrder(orderId) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token?.access_token;

        try {
            const response = await axios.delete(`${ADMIN_API_URL}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Đơn hàng đã bị xóa:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            throw error;
        }
    }
}

export default new OrderService();
