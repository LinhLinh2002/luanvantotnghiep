<template>
    <div class="container">
        <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Quản Lý Dịch Giả</h4>
            <Button label="New + " @click="openCreateModal" />
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên dịch giả</th>
                    <th>Ngày Tạo</th>
                    <th>Ngày Cập Nhật</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="Translator in Translators" :key="Translator.id">
                    <td>{{ Translator.id }}</td>
                    <td>{{ Translator.name }}</td>
                    <td>{{ Translator.created_at ? new Date(Translator.created_at).toLocaleDateString() : 'Chưa có' }}</td>
                    <td>{{ Translator.updated_at ? new Date(Translator.updated_at).toLocaleDateString() : 'Chưa có' }}</td>
                    <td>
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditModal(Translator)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="openConfirmDeleteModal(Translator.id)" />
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showConfirmModal" class="modal">
            <div class="modal-content">
                <h2>Xác nhận</h2>
                <p>Bạn có chắc chắn muốn xóa dịch giả này?</p>
                <div class="button-group">
                    <Button label="Hủy" @click="closeConfirmModal" outlined />
                    <Button label="Xóa" @click="confirmDeleteTranslator" severity="danger" />
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h1>{{ isEditMode ? 'Sửa dịch giả' : 'Thêm dịch giả' }}</h1>
                <form @submit.prevent="isEditMode ? updateTranslator() : createTranslator()">
                    <div class="form-group">
                        <h2 for="name" class="block font-bold mb-3">Tên dịch giả:</h2>
                        <InputText type="text" class="mb-3" v-model="TranslatorForm.name" fluid />
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
import TranslatorService from '@/service/TranslatorService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const Translators = ref([]);
const showModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const TranslatorToDelete = ref(null);
const TranslatorForm = ref({ id: null, name: '' });
const errorMessage = ref('');
const toast = useToast();

const fetchTranslators = async () => {
    try {
        const response = await TranslatorService.getAllTranslators();
        Translators.value = response.data;
    } catch (error) {
        alert('Lỗi khi lấy danh sách dịch giả: ' + error.message);
    }
};

const openCreateModal = () => {
    isEditMode.value = false;
    TranslatorForm.value = { id: null, name: '' };
    showModal.value = true;
    errorMessage.value = '';
};

const openEditModal = (Translator) => {
    isEditMode.value = true;
    TranslatorForm.value = { ...Translator };
    showModal.value = true;
    errorMessage.value = '';
};

const closeModal = () => {
    showModal.value = false;
    TranslatorForm.value = { id: null, name: '' };
    errorMessage.value = '';
};

const openConfirmDeleteModal = (id) => {
    TranslatorToDelete.value = id;
    showConfirmModal.value = true;
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
    TranslatorToDelete.value = null;
};

const createTranslator = async () => {
    if (!TranslatorForm.value.name) {
        errorMessage.value = 'Tên dịch giả là bắt buộc.';
        return;
    }

    try {
        await TranslatorService.createTranslator(TranslatorForm.value);
        await fetchTranslators();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'dịch giả đã được thêm', life: 3000 });
        closeModal();
    } catch (error) {
        alert('Lỗi khi tạo dịch giả: ' + error.message);
    }
};

const updateTranslator = async () => {
    if (!TranslatorForm.value.name) {
        errorMessage.value = 'Tên dịch giả là bắt buộc.';
        return;
    }

    try {
        await TranslatorService.updateTranslator(TranslatorForm.value.id, TranslatorForm.value);
        await fetchTranslators();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'dịch giả đã được cập nhật', life: 3000 });
        closeModal();
    } catch (error) {
        alert('Lỗi khi cập nhật dịch giả: ' + error.message);
    }
};

const confirmDeleteTranslator = async () => {
    if (TranslatorToDelete.value) {
        try {
            await TranslatorService.deleteTranslator(TranslatorToDelete.value);
            await fetchTranslators();
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'dịch giả đã được xóa', life: 3000 });
            closeConfirmModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa vì tồn tại sách ', life: 3000 });
        }
    }
};

onMounted(() => {
    fetchTranslators();
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
