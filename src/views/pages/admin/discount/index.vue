<template>
    <div class="container">
        <div class="header">
            <h2>Quản Lý Mã Giảm Giá</h2>
            <Button label="New + " @click="openCreateModal" />
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Mã Giảm Giá</th>
                    <th>Loại Giảm Giá</th>
                    <th>Giá Trị Giảm</th>
                    <th>Giá Trị Giỏ Hàng</th>
                    <th>Ngày Bắt Đầu</th>
                    <th>Ngày Kết Thúc</th>
                    <th>Giới Hạn Sử Dụng</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="discount in discounts" :key="discount.id">
                    <td>{{ discount.id }}</td>
                    <td>{{ discount.code }}</td>
                    <td>{{ discount.discount_type }}</td>
                    <td>{{ formatCurrency(discount.discount_value) }}</td>
                    <td>{{ formatCurrency(discount.cart_value) }}</td>
                    <td>{{ formatDate(discount.start_date) }}</td>
                    <td>{{ formatDate(discount.end_date) }}</td>
                    <td>{{ discount.usage_limit }}</td>
                    <td>{{ discount.is_active ? 'Hoạt động' : 'Không hoạt động' }}</td>
                    <td>
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditModal(discount)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="openConfirmDeleteModal(discount.id)" />
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Confirm Delete Modal -->
        <div v-if="showConfirmModal" class="modal">
            <div class="modal-content">
                <h3>Xác nhận</h3>
                <p>Bạn có chắc chắn muốn xóa mã giảm giá này?</p>
                <div class="button-group">
                    <button @click="closeConfirmModal">Hủy</button>
                    <button @click="confirmDeleteDiscount" class="danger">Xóa</button>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>{{ isEditMode ? 'Sửa Mã Giảm Giá' : 'Thêm Mã Giảm Giá' }}</h3>
                <form @submit.prevent="isEditMode ? updateDiscount() : createDiscount()">
                    <div class="form-group">
                        <label>Mã Giảm Giá</label>
                        <input v-model="discountForm.code" type="text" required />
                    </div>
                    <div class="form-group">
                        <label>Loại Giảm Giá</label>
                        <select v-model="discountForm.discount_type" required>
                            <option value="fixed">Cố định</option>
                            <option value="percent">Phần trăm</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Giá Trị Giảm</label>
                        <input v-model="discountForm.discount_value" type="number" required />
                    </div>
                    <div class="form-group">
                        <label>Giá Trị Giỏ Hàng</label>
                        <input v-model="discountForm.cart_value" type="number" required />
                    </div>
                    <div class="form-group">
                        <label>Ngày Bắt Đầu</label>
                        <input v-model="discountForm.start_date" type="date" required />
                    </div>
                    <div class="form-group">
                        <label>Ngày Kết Thúc</label>
                        <input v-model="discountForm.end_date" type="date" required />
                    </div>
                    <div class="form-group">
                        <label>Giới Hạn Sử Dụng</label>
                        <input v-model="discountForm.usage_limit" type="number" required />
                    </div>

                    <div class="form-group checkbox-group">
                        <input v-model="discountForm.is_active" type="checkbox" id="isActive" />
                        <label for="isActive">Trạng Thái</label>
                    </div>


                    <div class="button-group">
                        <button @click="closeModal">Hủy</button>
                        <button type="submit">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import DiscountService from '@/service/DiscountService';

export default {
    setup() {
        const discounts = ref([]);
        const showModal = ref(false);
        const showConfirmModal = ref(false);
        const isEditMode = ref(false);
        const discountForm = ref({
            id: null,
            code: '',
            discount_type: 'fixed',
            discount_value: 0,
            cart_value: 0,
            start_date: '',
            end_date: '',
            usage_limit: 0,
            is_active: false,
        });
        const discountToDelete = ref(null);

        const fetchDiscounts = async () => {
            try {
                const data = await DiscountService.getDiscounts();
                discounts.value = data.data;
            } catch (error) {
                console.error(error.message);
            }
        };

        const openCreateModal = () => {
            isEditMode.value = false;
            resetForm();
            showModal.value = true;
        };

        const openEditModal = (discount) => {
            isEditMode.value = true;
            discountForm.value = { ...discount };
            discountForm.value.is_active = discount.is_active ? true : false;  // Đảm bảo giá trị boolean đúng
            showModal.value = true;
        };


        const closeModal = () => {
            showModal.value = false;
        };

        const createDiscount = async () => {
            console.log('Sending data:', discountForm.value); // Kiểm tra dữ liệu gửi đi
            try {
                const response = await DiscountService.createDiscount(discountForm.value);
                console.log('API response:', response.data); // Kiểm tra phản hồi từ API
                await fetchDiscounts();
                closeModal();
            } catch (error) {
                console.error('Error creating discount:', error.response?.data || error.message);
            }
        };


        const updateDiscount = async () => {
            try {
                await DiscountService.updateDiscount(discountForm.value.id, discountForm.value);
                await fetchDiscounts();
                closeModal();
            } catch (error) {
                console.error(error.message);
            }
        };

        const openConfirmDeleteModal = (id) => {
            discountToDelete.value = id;
            showConfirmModal.value = true;
        };

        const closeConfirmModal = () => {
            showConfirmModal.value = false;
        };

        const confirmDeleteDiscount = async () => {
            try {
                await DiscountService.deleteDiscount(discountToDelete.value);
                await fetchDiscounts();
                closeConfirmModal();
            } catch (error) {
                console.error(error.message);
            }
        };

        const resetForm = () => {
            discountForm.value = {
                id: null,
                code: '',
                discount_type: 'fixed',
                discount_value: 0,
                cart_value: 0,
                start_date: '',
                end_date: '',
                usage_limit: 0,
                is_active: false,
            };
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString();
        };
        // Hàm định dạng giá trị thành tiền tệ
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN').format(amount);
        };

        onMounted(() => {
            fetchDiscounts();
        });

        return {
            formatCurrency,
            discounts,
            showModal,
            showConfirmModal,
            isEditMode,
            discountForm,
            discountToDelete,
            fetchDiscounts,
            openCreateModal,
            openEditModal,
            closeModal,
            createDiscount,
            updateDiscount,
            openConfirmDeleteModal,
            closeConfirmModal,
            confirmDeleteDiscount,
            formatDate,
        };
    },
};
</script>



<style scoped>
.container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

h2 {
    font-weight: 600;
    font-size: 1.8rem;
    color: #333;
    margin: 0;
}

.new-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.new-button:hover {
    background-color: #0056b3;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 0.95rem;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.table th,
.table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.table th {
    background-color: #f4f4f4;
    font-weight: 600;
    color: #555;
}

.table tbody tr:hover {
    background-color: #f1f1f1;
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
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
}

@keyframes fadeIn {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

h3 {
    margin: 0 0 15px;
    font-size: 1.5rem;
    color: #333;
    text-align: center;
}


.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    /* Bố trí nhãn và input theo chiều dọc */
}

.form-group label {
    margin-bottom: 5px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
}

.form-group input,
.form-group select {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}


/* Checkbox chỉnh riêng */
.form-group input[type="checkbox"] {
    width: auto;
    margin-right: 10px;
    transform: scale(1.2);
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.button-group button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-group button:hover {
    opacity: 0.9;
}

.button-group .danger {
    background-color: #dc3545;
    color: white;
}

.button-group .danger:hover {
    background-color: #c82333;
}

.button-group .save {
    background-color: #28a745;
    color: white;
}

.button-group .save:hover {
    background-color: #218838;
}

/* BUTTON ACTION (EDIT/DELETE) */
/* Form chỉnh sửa checkbox */
.form-group.checkbox-group {
    display: flex;
    align-items: center;
    /* Căn giữa checkbox và nhãn theo chiều dọc */
    gap: 10px;
    /* Khoảng cách giữa checkbox và nhãn */
    margin-bottom: 15px;
    /* Khoảng cách giữa các mục */
}

.form-group.checkbox-group input[type="checkbox"] {
    margin: 0;
    /* Xóa margin mặc định của checkbox */
    transform: scale(1.2);
    /* Tăng kích thước checkbox */
    cursor: pointer;
    /* Thêm con trỏ chuột khi hover */
}

.form-group.checkbox-group label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
    cursor: pointer;
    /* Cho phép nhấp vào nhãn để check */
}

.table td button {
    padding: 5px 12px;
    border: none;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s;
}

.table td button:hover {
    transform: scale(1.05);
    /* Hiệu ứng hover nhẹ */
}

.table td button.edit {
    background-color: #137017;
    color: white;
}

.table td button.edit:hover {
    background-color: #25c247;
}

.table td button.delete {
    background-color: #dc3545;
    color: white;
}

.table td button.delete:hover {
    background-color: #c82333;
}
</style>
