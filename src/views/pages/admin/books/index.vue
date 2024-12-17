<template>
  <div class="container">
    <h1>Danh Sách Sách</h1>
    <table v-if="books.length > 0" class="book-table">
      <thead>
        <tr>
          <th>Hình Ảnh</th>
          <th>Tiêu Đề</th>
          <th>ISBN</th>
          <th>Số Lượng</th>
          <th>Giá Gốc (VND)</th>
          <th>Giá Giảm</th>
          <th>Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td><img :src="book.image || require('@/assets/placeholder.jpg')" alt="Book cover" class="book-image" /></td>
          <td>{{ book.title }}</td>
          <td>{{ book.isbn }}</td>
          <td>{{ book.quantity }}</td>
          <td>{{ formatPrice(book.original_price) }}</td>
          <td>{{ book.discount_price ? formatPrice(book.discount_price) : 'Không có' }}</td>
          <td :class="getStatusClass(book.status)">
            {{ getStatusText(book.status) }}
          </td>
          <td>
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditBook(book.id)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="openConfirmDeleteModal(book.id)" />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>Chưa có sách nào</div>

    <!-- Modal xác nhận xóa -->
    <div v-if="showConfirmModal" class="modal">
      <div class="modal-content">
        <h2>Xác nhận</h2>
        <p>Bạn có chắc chắn muốn xóa sách này?</p>
        <div class="button-group">
          <Button label="Hủy" @click="closeConfirmModal" outlined />
          <Button label="Xóa" @click="confirmDeleteBook" severity="danger" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BookService from '@/service/BookService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const books = ref([]);
const bookToDelete = ref(null);
const router = useRouter();
const showConfirmModal = ref(false);
const toast = useToast();

// Fetch books list using BookService
const fetchBooks = async () => {
  try {
    const response = await BookService.getAllBooks();
    books.value = response.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Lỗi khi lấy danh sách sách: ' + error.message, life: 3000 });
  }
};

const openEditBook = (id) => {
  router.push(`/books/${id}/edit`);
};

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN');
};

const openConfirmDeleteModal = (id) => {
  bookToDelete.value = id;
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  bookToDelete.value = null;
};

const getStatusText = (status) => {
  switch (status) {
    case 'instock':
      return 'Có sẵn';
    case 'out_of_stock':
      return 'Hết hàng';
    case 'pre_order':
      return 'Đặt trước';
    default:
      return 'Không xác định';
  }
};

const getStatusClass = (status) => {
  return {
    'status-instock': status === 'instock',
    'status-out_of_stock': status === 'out_of_stock',
    'status-pre_order': status === 'pre_order'
  };
};

const confirmDeleteBook = async () => {
  if (bookToDelete.value) {
    try {
      await BookService.deleteBook(bookToDelete.value);
      await fetchBooks();
      toast.add({ severity: 'success', summary: 'Thành công', detail: 'Sách đã được xóa', life: 3000 });
      closeConfirmModal();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Lỗi khi xóa sách: ' + error.message, life: 3000 });
    }
  }
};

onMounted(fetchBooks);
</script>

<style>
.container {
  padding: 20px;
  background-color: white;
}

.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.book-table th,
.book-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.book-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.book-image {
  width: 50px;
  height: auto;
  object-fit: cover;
}

.status-instock {
  color: green;
  font-weight: bold;
}

.status-out_of_stock {
  color: red;
  font-weight: bold;
}

.status-pre_order {
  color: orange;
  font-weight: bold;
}

/* CSS cho modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.button-group {
  display: flex;
  justify-content: space-between;
}
</style>
