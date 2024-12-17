import axios from 'axios';
import router from '../router';

const API_URL = 'http://127.0.0.1:8000/api/auth/orders'; // URL API cho đơn hàng
const ADMIN_API_URL = 'http://127.0.0.1:8000/api/admin/orders'; // URL API cho đơn hàng của admin
const DASHBOARD_API_URL = 'http://127.0.0.1:8000/api/admin/dashboard'; // URL API cho dashboard

class OrderService {
    // Helper method to get token from localStorage
    _getAuthToken() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        return currentUser?.token?.access_token;
    }

    // Helper method to handle unauthorized access
    _handleUnauthorizedAccess() {
        alert("Bạn cần đăng nhập để tiếp tục.");
        router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
    }

    // Lấy danh sách đơn hàng cho user
    async getUserOrders() {
        const token = this._getAuthToken();

        if (!token) {
            console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
            this._handleUnauthorizedAccess();
            return;
        }

        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            return { items: [] }; // Trả về danh sách trống nếu có lỗi
        }
    }

    // Lấy chi tiết đơn hàng cho user
    async getOrderById(orderId) {
        const token = this._getAuthToken();

        if (!token) {
            console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
            this._handleUnauthorizedAccess();
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            throw error;  // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Cập nhật trạng thái đơn hàng cho user
    async updateOrderStatus(orderId, status) {
        const token = this._getAuthToken();

        if (!token) {
            console.error("Bạn cần đăng nhập để cập nhật trạng thái đơn hàng.");
            this._handleUnauthorizedAccess();
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/${orderId}/status`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                }
            });
            console.log('Cập nhật trạng thái đơn hàng thành công:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            throw error;  // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Lấy danh sách đơn hàng cho admin
    async getAdminOrders() {
        const token = this._getAuthToken();

        if (!token) {
            console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
            this._handleUnauthorizedAccess();
            return;
        }

        try {
            const response = await axios.get(ADMIN_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng cho admin:', error);
            return { items: [] }; // Trả về danh sách trống nếu có lỗi
        }
    }

    // Cập nhật trạng thái đơn hàng cho admin
    async adminUpdateOrderStatus(orderId, status) {
        const token = this._getAuthToken();

        if (!token) {
            console.error("Bạn cần đăng nhập để cập nhật trạng thái đơn hàng.");
            this._handleUnauthorizedAccess();
            return;
        }

        try {
            const response = await axios.put(`${ADMIN_API_URL}/${orderId}`, { order_status: status }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('Cập nhật trạng thái đơn hàng thành công cho admin:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái cho admin:', error);
            throw error;  // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Xóa đơn hàng (admin)
    async deleteOrder(orderId) {
        const token = this._getAuthToken();

        if (!token) {
            console.error("Bạn cần đăng nhập để xóa đơn hàng.");
            this._handleUnauthorizedAccess();
            return;
        }

        try {
            const response = await axios.delete(`${ADMIN_API_URL}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('Đơn hàng đã bị xóa:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            throw error;  // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Lấy thống kê Dashboard cho admin
    async getDashboard() {
        const token = this._getAuthToken();

        if (!token) {
            console.error("Bạn cần đăng nhập để xem thống kê.");
            this._handleUnauthorizedAccess();
            return;
        }

        try {
            const response = await axios.get(DASHBOARD_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                }
            });
            console.log('Dữ liệu dashboard:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu dashboard:', error);
            throw error;
        }
    }
    
}

export default new OrderService();
