<template>
    <div class="container">
        <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Quản Lý Danh Mục</h4>
            <Button label="New + " @click="openCreateModal" />
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên Danh Mục</th>
                    <th>Ngày Tạo</th>
                    <th>Ngày Cập Nhật</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="Category in Categories" :key="Category.id">
                    <td>{{ Category.id }}</td>
                    <td>{{ Category.name }}</td>
                    <td>{{ Category.created_at ? new Date(Category.created_at).toLocaleDateString() : 'Chưa có' }}</td>
                    <td>{{ Category.updated_at ? new Date(Category.updated_at).toLocaleDateString() : 'Chưa có' }}</td>
                    <td>
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditModal(Category)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="openConfirmDeleteModal(Category.id)" />
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showConfirmModal" class="modal">
            <div class="modal-content">
                <h2>Xác nhận</h2>
                <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
                <div class="button-group">
                    <Button label="Hủy" @click="closeConfirmModal" outlined />
                    <Button label="Xóa" @click="confirmDeleteCategory" severity="danger" />
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h1>{{ isEditMode ? 'Sửa danh mục' : 'Thêm danh mục' }}</h1>
                <form @submit.prevent="isEditMode ? updateCategory() : createCategory()">
                    <div class="form-group">
                        <h2 for="name" class="block font-bold mb-3">Tên danh mục:</h2>
                        <InputText type="text" class="mb-3" v-model="CategoryForm.name" fluid />
                        <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
                    </div>
                    <div class="button-group">
                        <Button label="Hủy" severity="success" @click="closeModal" outlined />
                        <Button type="submit" label="Lưu" icon="pi pi-check" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import CategoryService from '@/service/CategoryService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const Categories = ref([]);
const showModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const CategoryToDelete = ref(null);
const CategoryForm = ref({ id: null, name: '', });
const errorMessage = ref('');
const toast = useToast();

const fetchCategories = async () => {
    try {
        const response = await CategoryService.getAllCategories();
        console.log('Categories fetched:', response);
        Categories.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách danh mục: ' + error.message);
    }
};


const openCreateModal = () => {
    isEditMode.value = false;
    CategoryForm.value = { id: null, name: '' };
    showModal.value = true;
    errorMessage.value = '';
};

const openEditModal = (Category) => {
    isEditMode.value = true;
    CategoryForm.value = { ...Category };
    showModal.value = true;
    errorMessage.value = '';
};

const closeModal = () => {
    showModal.value = false;
    CategoryForm.value = { id: null, name: '' };
    errorMessage.value = '';
};

const openConfirmDeleteModal = (id) => {
    CategoryToDelete.value = id;
    showConfirmModal.value = true;
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
    CategoryToDelete.value = null;
};

const createCategory = async () => {
    if (!CategoryForm.value.name) {
        errorMessage.value = 'Tên danh mục là bắt buộc.';
        return;
    }
    console.log("CategoryForm gửi lên:", CategoryForm.value);
    try {
        await CategoryService.createCategory(CategoryForm.value);
        await fetchCategories();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'danh mục đã được thêm', life: 3000 });
        closeModal();
    } catch (error) {
        alert('Lỗi khi tạo danh mục: ' + error.message);
    }
};

const updateCategory = async () => {
    if (!CategoryForm.value.name) {
        errorMessage.value = 'Tên danh mục là bắt buộc.';
        return;
    }

    try {
        await CategoryService.updateCategory(CategoryForm.value.id, CategoryForm.value);
        await fetchCategories();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'danh mục đã được cập nhật', life: 3000 });
        closeModal();
    } catch (error) {
        alert('Lỗi khi cập nhật danh mục: ' + error.message);
    }
};

const confirmDeleteCategory = async () => {
    if (CategoryToDelete.value) {
        try {
            await CategoryService.deleteCategory(CategoryToDelete.value);
            await fetchCategories();
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'danh mục đã được xóa', life: 3000 });
            closeConfirmModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa vì tồn tại sách ', life: 3000 });
        }
    }
};

onMounted(() => {
    fetchCategories();
});
</script>

<style scoped>
.container {
    padding: 20px;
    background-color: white;

}
h4 {
    font-weight: 600;
    font-size: 1.8rem;

}
.table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}

.table th {
    background-color: #f4f4f4;
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
    width: 300px;
}

.close {
    cursor: pointer;
    float: right;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
}

.button-group button {
    margin-left: 10px;
}
</style>
