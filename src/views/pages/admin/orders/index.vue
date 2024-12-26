    <template>
        <div class="container">
            <div class="flex flex-wrap gap-2 items-center justify-between">
                <h2 class="m-0">Quản Lý Đơn Hàng</h2>
            </div>

            <!-- Bảng danh sách đơn hàng -->
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Người đặt</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>{{ order.name }}</td>
                        <td>{{ order.phone }}</td>
                        <td>{{ order.street }}, {{ order.ward.name }}, {{ order.district.name }}, {{ order.province.name }}</td>                        
                        <td>{{ formatDate(order.order_date) }}</td>
                        <td>{{ formatCurrency(order.total_amount) }}</td>
                        <td>{{ formatOrderStatus(order.order_status) }}</td>
                        <td>
                            <Button icon="pi pi-eye" outlined rounded class="mr-2"
                                @click="openOrderDetailModal(order.id)" />
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditModal(order)" />
                            <Button icon="pi pi-trash" outlined rounded severity="danger"
                                @click="openConfirmDeleteModal(order.id)" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal Sửa Trạng Thái -->
            <div v-if="showModal" class="modal">
                <div class="modal-content">
                    <span class="close" @click="closeModal">&times;</span>
                    <h1>Sửa Trạng Thái Đơn Hàng</h1>
                    <form @submit.prevent="updateOrder">
                        <div class="form-group">
                            <h2 for="status" class="block font-bold mb-3">Trạng Thái Đơn Hàng:</h2>

                            <!-- <select v-model="orderForm.order_status" class="mb-3">
                                <option v-for="status in getNextOrderStatuses(orderForm.order_status)" :value="status"
                                    :key="status">
                                    {{ formatOrderStatus(status) }}
                                </option>
                            </select> -->

                            <select v-model="orderForm.order_status" class="mb-3">
                                <option v-for="status in allStatuses" :value="status" :key="status">
                                    {{ formatOrderStatus(status) }}
                                </option>
                            </select>  
                            <!-- //dc chon het -->
                        </div>
                        <div class="button-group">
                            <Button label="Hủy" severity="success" @click="closeModal" outlined />
                            <Button type="submit" label="Lưu" icon="pi pi-check" />
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal Chi Tiết Đơn Hàng -->
            <div v-if="showDetailModal" class="modal">
                <div class="modal-content">
                    <button class="close-btn" @click="closeDetailModal">×</button>
                    <h1>Chi Tiết Đơn Hàng</h1>
                    <div v-if="selectedOrder">
                        <p><strong>ID:</strong> {{ selectedOrder.id }}</p>
                        <p><strong>Người đặt:</strong> {{ selectedOrder.user.name }}</p>
                        <p><strong>Số điện thoại:</strong> {{ selectedOrder.user.phone }}</p>
                        <p><strong>Địa chỉ:</strong> {{ selectedOrder.street }}, {{ selectedOrder.ward }}, {{
                            selectedOrder.district }}, {{ selectedOrder.province }}</p>
                        <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.order_date) }}</p>
                        <p><strong>Tổng tiền:</strong> {{ formatCurrency(selectedOrder.total_amount) }}</p>
                        <h3>Chi tiết sản phẩm:</h3>
                        <ul>
                            <li v-for="item in selectedOrder.order_details" :key="item.id">
                                {{ item.book.title }} - {{ item.quantity }} x {{ formatCurrency(item.price) }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Modal Xác Nhận Xóa -->
            <div v-if="showConfirmModal" class="modal">
                <div class="modal-content">
                    <h2>Xác nhận</h2>
                    <p>Bạn có chắc chắn muốn xóa đơn hàng này?</p>
                    <div class="button-group">
                        <Button label="Hủy" @click="closeConfirmModal" outlined />
                        <Button label="Xóa" @click="confirmDeleteOrder" severity="danger" />
                    </div>
                </div>
            </div>
        </div>
    </template>

<script setup>
import OrderService from '@/service/OrderService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const orders = ref([]);
const showModal = ref(false);
const showDetailModal = ref(false);
const showConfirmModal = ref(false);
const orderToDelete = ref(null);
const selectedOrder = ref(null);
const orderForm = ref({ id: null, order_status: 'ordered' });
const toast = useToast();

// Định dạng ngày
const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });

// Định dạng tiền tệ
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Định dạng trạng thái đơn hàng
const formatOrderStatus = (status) => ({
    ordered: 'Đã đặt hàng',
    shipping: 'Đang giao hàng',
    delivered: 'Hoàn thành',
    rejected: 'Từ chối nhận hàng',
    returned: 'Hoàn hàng',
    canceled: 'Đã hủy',

}[status] || 'Không xác định');

// Lấy danh sách đơn hàng
const fetchOrders = async () => {
    try {
        const response = await OrderService.getAdminOrders();
        orders.value = response;
    } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng:', error);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.message, life: 3000 });
    }
};

// Cập nhật trạng thái đơn hàng
// const getNextOrderStatuses = (currentStatus) => {
//     const statusOrder = ['ordered', 'shipping', 'delivered', 'rejected', 'returned', 'canceled'];
//     const currentIndex = statusOrder.indexOf(currentStatus);
//     return statusOrder.slice(currentIndex + 1);  // Lấy tất cả các trạng thái sau trạng thái hiện tại
// };
//dc chon het 
const allStatuses = ['ordered', 'shipping', 'delivered', 'rejected', 'returned', 'canceled'];

// Mở modal xem chi tiết
const openOrderDetailModal = async (orderId) => {
    try {
        const order = await OrderService.getAdminOrderById(orderId);
        selectedOrder.value = order;
        showDetailModal.value = true;
    } catch (error) {
        console.error('Lỗi khi tải chi tiết đơn hàng:', error);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải chi tiết đơn hàng', life: 3000 });
    }
};

// Mở modal sửa
const openEditModal = (order) => {
    // Cập nhật orderForm với trạng thái của đơn hàng hiện tại
    orderForm.value = { ...order, order_status: order.order_status };
    showModal.value = true;
};


// Đóng modal
const closeModal = () => {
    showModal.value = false;
};

// Cập nhật trạng thái đơn hàng
const updateOrder = async () => {
    try {
        console.log("Request Payload:", {
            id: orderForm.value.id,
            order_status: orderForm.value.order_status
        });
        await OrderService.adminUpdateOrderStatus(orderForm.value.id, orderForm.value.order_status);
        await fetchOrders();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Trạng thái đơn hàng đã được cập nhật', life: 3000 });
        closeModal();
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật trạng thái đơn hàng', life: 3000 });
    }
};

// Đóng modal xem chi tiết
const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedOrder.value = null;
};

// Mở modal xác nhận xóa đơn hàng
const openConfirmDeleteModal = (orderId) => {
    orderToDelete.value = orderId;
    showConfirmModal.value = true;
};

// Đóng modal xác nhận xóa
const closeConfirmModal = () => {
    showConfirmModal.value = false;
};

// Xóa đơn hàng
const confirmDeleteOrder = async () => {
    try {
        await OrderService.deleteOrder(orderToDelete.value);
        await fetchOrders();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đơn hàng đã được xóa', life: 3000 });
        closeConfirmModal();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa đơn hàng', life: 3000 });
    }
};

// Khởi tạo dữ liệu
onMounted(fetchOrders);

</script>


<style scoped>
.container {
    padding: 20px;
    background-color: #ffffff;
}

.table {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid #ccc;
    padding: 12px;
    text-align: left;
}

.table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 600px;
    max-width: 90%;
    animation: slideIn 0.3s ease-in-out;
    position: relative;
    overflow: hidden;
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: #000;
}

h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
}

p {
    margin: 10px 0;
    font-size: 16px;
    color: #555;
    line-height: 1.5;
}

p strong {
    color: #333;
    font-weight: bold;
}

h3 {
    font-size: 18px;
    margin-top: 20px;
    color: #444;
    font-weight: bold;
}

ul {
    margin-top: 10px;
    padding-left: 20px;
    list-style-type: disc;
}

ul li {
    font-size: 16px;
    color: #555;
    margin-bottom: 5px;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.close {
    cursor: pointer;
    font-size: 24px;
    color: #888;
    position: absolute;
    top: 10px;
    right: 10px;
    transition: color 0.3s;
}



h1 {
    font-size: 22px;
    color: #333;
    margin-bottom: 20px;
}

h2 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #555;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    display: block;
}

.form-group select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 16px;
    background-color: #f9f9f9;
    transition: border-color 0.3s ease;
}

.form-group select:focus {
    border-color: #007BFF;
    outline: none;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.button-group button {
    margin-left: 10px;
    padding: 10px 20px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.button-group button:hover {
    background-color: #007BFF;
    color: white;
}

.button-group button:focus {
    outline: none;
}
</style>
