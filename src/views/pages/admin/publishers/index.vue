<template>
    <div class="container">
        <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Quản lý Nhà Xuất Bản</h4>
            <Button label="New + " @click="openCreateModal" />
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên Nhà Xuất Bản</th>
                    <th>Quốc Gia</th>
                    <th>Hình Ảnh</th>
                    <th>Ngày Tạo</th>
                    <th>Ngày Cập Nhật</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="publisher in publishers" :key="publisher.id">
                    <td>{{ publisher.id }}</td>
                    <td>{{ publisher.name }}</td>
                    <td>{{ publisher.country }}</td>
                    <td>
                        <img v-if="publisher.image" :src="publisher.image" alt="Publisher Image" class="publisher-image" />
                    </td>
                    <td>{{ publisher.created_at ? new Date(publisher.created_at).toLocaleDateString() : 'Chưa có' }}</td>
                    <td>{{ publisher.updated_at ? new Date(publisher.updated_at).toLocaleDateString() : 'Chưa có' }}</td>
                    <td>
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditModal(publisher)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="openConfirmDeleteModal(publisher.id)" />
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showConfirmModal" class="modal">
            <div class="modal-content">
                <h2>Xác nhận</h2>
                <p>Bạn có chắc chắn muốn xóa nhà xuất bản này?</p>
                <div class="button-group">
                    <Button label="Hủy" @click="closeConfirmModal" outlined />
                    <Button label="Xóa" @click="confirmDeletePublisher" severity="danger" />
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h1>{{ isEditMode ? 'Sửa Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản' }}</h1>
                <form @submit.prevent="isEditMode ? updatePublisher() : createPublisher()">
                    <div class="form-group">
                        <h2 for="name" class="block font-bold mb-3">Tên Nhà Xuất Bản:</h2>
                        <InputText type="text" class="mb-3" v-model="publisherForm.name" fluid />
                        <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
                    </div>
                    <div class="form-group">
                        <h2 for="country" class="block font-bold mb-3">Quốc Gia:</h2>
                        <InputText type="text" class="mb-3" v-model="publisherForm.country" fluid />
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
    </div>
</template>

<script setup>
import PublisherService from '@/service/PublisherService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const publishers = ref([]);
const showModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const publisherToDelete = ref(null);
const publisherForm = ref({ id: null, name: '', country: '', image: null });
const errorMessage = ref('');
const imagePreview = ref(null);
const toast = useToast();

const fetchPublishers = async () => {
    try {
        const response = await PublisherService.getAllPublishers();
        publishers.value = response.data;
    } catch (error) {
        // alert('Lỗi khi lấy danh sách nhà xuất bản: ' + error.message);
    }
};

const openCreateModal = () => {
    isEditMode.value = false;
    resetForm();
    showModal.value = true;
};

const openEditModal = (publisher) => {
    isEditMode.value = true;
    publisherForm.value = { ...publisher };
    imagePreview.value = publisher.image;
    showModal.value = true;
    errorMessage.value = '';
};

const closeModal = () => {
    showModal.value = false;
    resetForm();
};

const resetForm = () => {
    publisherForm.value = { id: null, name: '', country: '', image: null };
    imagePreview.value = null;
    errorMessage.value = '';
};

const openConfirmDeleteModal = (id) => {
    publisherToDelete.value = id;
    showConfirmModal.value = true;
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
    publisherToDelete.value = null;
};

const createPublisher = async () => {
    const formData = new FormData();
    formData.append('name', publisherForm.value.name);
    formData.append('country', publisherForm.value.country);
    if (publisherForm.value.image) {
        formData.append('image', publisherForm.value.image);
    }

    if (!publisherForm.value.name || !publisherForm.value.country) {
        errorMessage.value = 'Tên và Quốc Gia là bắt buộc.';
        return;
    }

    try {
        await PublisherService.createPublisher(formData);
        await fetchPublishers();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Nhà xuất bản đã được thêm', life: 3000 });
        closeModal();
    } catch (error) {
        // alert('Lỗi khi tạo nhà xuất bản: ' + error.message);
        toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Nhà xuất bản bị trùng tên', life: 3000 });

    }
};
const updatePublisher = async () => {
    const payload = {
        name: publisherForm.value.name,
        country: publisherForm.value.country,
        image: publisherForm.value.image ? publisherForm.value.image : null,
    };

    try {
        await PublisherService.updatePublisher(publisherForm.value.id, payload);
        await fetchPublishers();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Nhà xuất bản đã được cập nhật', life: 3000 });
        closeModal();
    } catch (error) {
        // console.error("Error updating publisher:", error.response.data);
        // alert('Lỗi khi cập nhật nhà xuất bản: ' + error.response.data.message);
        toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Nhà xuất bản bị trùng tên', life: 3000 });

    }
};



const confirmDeletePublisher = async () => {
    if (publisherToDelete.value) {
        try {
            await PublisherService.deletePublisher(publisherToDelete.value);
            await fetchPublishers();
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Nhà xuất bản đã được xóa', life: 3000 });
            closeConfirmModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa vì tồn tại sách ', life: 3000 });
        }
    }
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        publisherForm.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

onMounted(() => {
    fetchPublishers();
});
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
    width: 400px;
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
