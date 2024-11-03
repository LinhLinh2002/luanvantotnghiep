<template>
    <div class="container">
        <!-- Button to open modal -->
        <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Quản Lý Nhà Đồng Xuất Bản</h4>
            <Button label="New +" @click="openCreateModal" />
        </div>

        <!-- Table of co-publishers -->
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên Nhà Đồng Xuất Bản</th>
                    <th>Hình ảnh</th>
                    <th>Ngày Tạo</th>
                    <th>Ngày Cập Nhật</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="coPublisher in coPublishers" :key="coPublisher.id">
                    <td>{{ coPublisher.id }}</td>
                    <td>{{ coPublisher.name }}</td>
                    <td>
                        <img v-if="coPublisher.image" :src="coPublisher.image" alt="Co Publisher Image"
                            class="publisher-image" />
                    </td>
                    <td>{{ coPublisher.created_at ? new Date(coPublisher.created_at).toLocaleDateString() : 'Chưa có' }}
                    </td>
                    <td>{{ coPublisher.updated_at ? new Date(coPublisher.updated_at).toLocaleDateString() : 'Chưa có' }}
                    </td>
                    <td>
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditModal(coPublisher)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="openConfirmDeleteModal(coPublisher.id)" />
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Create/Edit Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h1>{{ isEditMode ? 'Sửa Nhà Đồng Xuất Bản' : 'Thêm Nhà Đồng Xuất Bản' }}</h1>
                <form @submit.prevent="isEditMode ? updateCoPublisher() : createCoPublisher()">
                    <div class="form-group">
                        <h2 for="name" class="block font-bold mb-3">Tên Nhà Đồng Xuất Bản:</h2>
                        <InputText type="text" class="mb-3" v-model="coPublisherForm.name" fluid />
                    </div>

                    <div class="form-group">
                        <h2 for="image" class="block font-bold mb-3">Hình Ảnh:</h2>
                        <input type="file" @change="onFileChange" accept="image/*" />
                        <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="image-preview" />
                    </div>

                    <div class="button-group">
                        <Button label="Hủy" severity="success" @click="closeModal" outlined />
                        <Button type="submit" label="Lưu" icon="pi pi-check" />
                    </div>
                </form>
            </div>
        </div>

        <!-- Confirm Delete Modal -->
        <div v-if="showConfirmModal" class="modal">
            <div class="modal-content">
                <h2>Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa Nhà Đồng Xuất Bản này?</p>
                <div class="button-group">
                    <Button label="Hủy" severity="success" @click="closeConfirmModal" outlined />
                    <Button label="Xóa" severity="danger" @click="deleteCoPublisher" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CoPublisherService from '@/service/CoPublisherService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const coPublishers = ref([]);
const showModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const coPublisherToDelete = ref(null);
const coPublisherForm = ref({ id: null, name: '', image: null });
const imagePreview = ref(null);
const toast = useToast();

const fetchCoPublishers = async () => {
    try {
        const response = await CoPublisherService.getAllCoPublishers();
        coPublishers.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách Nhà Đồng Xuất Bản: ' + error.message);
    }
};

const openCreateModal = () => {
    isEditMode.value = false;
    resetForm();
    showModal.value = true;
};

const openEditModal = (coPublisher) => {
    isEditMode.value = true;
    coPublisherForm.value = { ...coPublisher };
    imagePreview.value = coPublisher.image;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    resetForm();
};

const resetForm = () => {
    coPublisherForm.value = { id: null, name: '', image: null };
    imagePreview.value = null;
};

const createCoPublisher = async () => {
    const formData = prepareFormData();
    try {
        await CoPublisherService.createCoPublisher(formData);
        await fetchCoPublishers();
        showToast('Nhà Đồng Xuất Bản đã được thêm');
        closeModal();
    } catch (error) {
        alert('Lỗi khi tạo Nhà Đồng Xuất Bản: ' + error.message);
    }
};

const updateCoPublisher = async () => {
    const payload = {
        name: coPublisherForm.value.name,
        image: coPublisherForm.value.image ? coPublisherForm.value.image : null,
    };
    try {
        await CoPublisherService.updateCoPublisher(coPublisherForm.value.id, payload);
        await fetchCoPublishers();
        showToast('Nhà Đồng Xuất Bản đã được cập nhật');
        closeModal();
    } catch (error) {
        alert('Lỗi khi cập nhật Nhà Đồng Xuất Bản: ' + error.message);
    }
};

const openConfirmDeleteModal = (id) => {
    coPublisherToDelete.value = id;
    showConfirmModal.value = true;
};

const deleteCoPublisher = async () => {
    try {
        await CoPublisherService.deleteCoPublisher(coPublisherToDelete.value);
        await fetchCoPublishers();
        showToast('Nhà Đồng Xuất Bản đã được xóa');
        closeConfirmModal();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa vì tồn tại sách ', life: 3000 });
    }
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
    coPublisherToDelete.value = null;
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        coPublisherForm.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const prepareFormData = () => {
    const formData = new FormData();
    formData.append('name', coPublisherForm.value.name);
    if (coPublisherForm.value.image) {
        formData.append('image', coPublisherForm.value.image);
    }
    return formData;
};

const showToast = (detail) => {
    toast.add({ severity: 'success', summary: 'Thành công', detail, life: 3000 });
};

onMounted(fetchCoPublishers);
</script>

<style scoped>
.publisher-image {
    width: 50px;
    height: auto;
}

.image-preview {
    width: 100px;
    height: auto;
    margin-top: 10px;
}

.container {
    padding: 20px;
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
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
}

.close {
    cursor: pointer;
    float: right;
    font-size: 20px;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
</style>
