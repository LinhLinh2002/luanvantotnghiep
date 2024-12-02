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
                    <td>{{ order.street }}, {{ order.ward }}, {{ order.district }}, {{ order.province }}</td>
                    <td>{{ formatDate(order.order_date) }}</td>
                    <td>{{ formatCurrency(order.total_amount) }}</td>
                    <td>{{ formatOrderStatus(order.order_status) }}</td>
                    <td>
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
                        <select v-model="orderForm.order_status" class="mb-3">
                            <option value=" ordered">Đang xử lý</option>
                            <option value="shipping ">Đang giao hàng</option>
                            <option value="delivered">Hoàn thành</option>
                            <option value="canceled">Đã hủy</option>
                            <option value="rejected">Từ chối nhận hàng</option>
                            <option value="returned">Hoàn hàng</option>

                        </select>
                    </div>
                    <div class="button-group">
                        <Button label="Hủy" severity="success" @click="closeModal" outlined />
                        <Button type="submit" label="Lưu" icon="pi pi-check" />
                    </div>
                </form>
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
const showConfirmModal = ref(false);
const orderToDelete = ref(null);
const orderForm = ref({ id: null, order_status: 'pending' });
const toast = useToast();

// Định dạng ngày
const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });

// Định dạng tiền tệ
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Định dạng trạng thái đơn hàng
const formatOrderStatus = (status) => ({
    ordered: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Hoàn thành'
    , canceled: 'Đã hủy',
    rejected: 'Từ chối nhận hàng',
    returned: 'Hoàn hàng'

}[status] || 'Không xác định');

// Lấy danh sách đơn hàng
const fetchOrders = async () => {
    try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            throw new Error("User is not logged in");
        }

        // Gọi API lấy danh sách đơn hàng của admin
        const response = await OrderService.getAdminOrders();
        orders.value = response;

    } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng:', error);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách đơn hàng', life: 3000 });
    }
};

// Mở modal sửa
const openEditModal = (order) => {
    orderForm.value = { ...order };
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

        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật trạng thái đơn hàng', life: 3000 });
    }
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
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease-in-out;
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

.close:hover {
    color: #000;
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
