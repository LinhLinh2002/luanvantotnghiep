<template>
    <div class="container">
        <div class="flex flex-wrap gap-2 items-center justify-between">
            <h2 class="m-0">Quản Lý Tác Giả</h2>
            <Button label="New + " @click="openCreateModal" />
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên Tác Giả</th>
                    <th>Ngày Tạo</th>
                    <th>Ngày Cập Nhật</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="author in authors" :key="author.id">
                    <td>{{ author.id }}</td>
                    <td>{{ author.name }}</td>
                    <td>{{ author.created_at ? new Date(author.created_at).toLocaleDateString() : 'Chưa có' }}</td>
                    <td>{{ author.updated_at ? new Date(author.updated_at).toLocaleDateString() : 'Chưa có' }}</td>
                    <td>
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditModal(author)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="openConfirmDeleteModal(author.id)" />
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showConfirmModal" class="modal">
            <div class="modal-content">
                <h2>Xác nhận</h2>
                <p>Bạn có chắc chắn muốn xóa tác giả này?</p>
                <div class="button-group">
                    <Button label="Hủy" @click="closeConfirmModal" outlined />
                    <Button label="Xóa" @click="confirmDeleteAuthor" severity="danger" />
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h1>{{ isEditMode ? 'Sửa Tác Giả' : 'Thêm Tác Giả' }}</h1>
                <form @submit.prevent="isEditMode ? updateAuthor() : createAuthor()">
                    <div class="form-group">
                        <h2 for="name" class="block font-bold mb-3">Tên Tác Giả:</h2>
                        <InputText type="text" class="mb-3" v-model="authorForm.name" fluid />
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
import AuthorService from '@/service/AuthorService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const authors = ref([]);
const showModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const authorToDelete = ref(null);
const authorForm = ref({ id: null, name: '' });
const errorMessage = ref('');
const toast = useToast();

const fetchAuthors = async () => {
    try {
        const response = await AuthorService.getAllAuthors();
        authors.value = response.data;
    } catch (error) {
        // alert('Lỗi khi lấy danh sách tác giả: ' + error.message);
    }
};

const openCreateModal = () => {
    isEditMode.value = false;
    authorForm.value = { id: null, name: '' };
    showModal.value = true;
    errorMessage.value = '';
};

const openEditModal = (author) => {
    isEditMode.value = true;
    authorForm.value = { ...author };
    showModal.value = true;
    errorMessage.value = '';
};

const closeModal = () => {
    showModal.value = false;
    authorForm.value = { id: null, name: '' };
    errorMessage.value = '';
};

const openConfirmDeleteModal = (id) => {
    authorToDelete.value = id;
    showConfirmModal.value = true;
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
    authorToDelete.value = null; // Reset ID khi đóng modal
};

const createAuthor = async () => {
    if (!authorForm.value.name) {
        errorMessage.value = 'Tên tác giả là bắt buộc.';
        return;
    }

    try {
        await AuthorService.createAuthor(authorForm.value);
        await fetchAuthors();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tác giả đã được thêm', life: 3000 });
        closeModal();
    } catch (error) {
        // alert('Lỗi khi tạo tác giả: ' + error.message);
        toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Tac giả bị trùng tên', life: 3000 });

    }
};

const updateAuthor = async () => {
    if (!authorForm.value.name) {
        errorMessage.value = 'Tên tác giả là bắt buộc.';
        return;
    }

    try {
        await AuthorService.updateAuthor(authorForm.value.id, authorForm.value);
        await fetchAuthors();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tác giả đã được cập nhật', life: 3000 });
        closeModal();
    } catch (error) {
        // alert('Lỗi khi cập nhật tác giả: ' + error.message);
        toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Tác giả bị trùng tên', life: 3000 });

    }
};

const confirmDeleteAuthor = async () => {
    if (authorToDelete.value) {
        try {
            await AuthorService.deleteAuthor(authorToDelete.value);
            await fetchAuthors();
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Tác giả đã được xóa', life: 3000 });
            closeConfirmModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa vì tồn tại sách ', life: 3000 });
        }
    }
};

onMounted(() => {
    fetchAuthors();
});
</script>

<style scoped>
.container {
    padding: 20px;
    background-color: white;
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

}
.title {
    margin: 0;

}

.new-button {
    margin: 0;
}

.table {
    width: 100%;
    margin-top: 10px;
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
