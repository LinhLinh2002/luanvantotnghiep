<template>
  <div class="container">
    <h1>Danh Sách Sách</h1>

    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sách theo tiêu đề hoặc ISBN"
        class="search-input" />
      <Button icon="pi pi-search" label="Tìm kiếm" class="search-button" />
    </div>

    <table v-if="filteredBooks.length > 0" class="book-table">
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
        <tr v-for="book in paginatedBooks" :key="book.id">
          <td><img :src="book.image || require('@/assets/placeholder.jpg')" alt="Book cover" class="book-image" /></td>
          <td>{{ book.title }}</td>
          <td>{{ book.isbn }}</td>
          <td>{{ book.quantity }}</td>
          <td>{{ formatCurrency(book.original_price) }}</td>
          <td>{{ book.discount_price ? formatCurrency(book.discount_price) : 'Không có' }}</td>
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

    <div v-else>Không tìm thấy sách nào</div>

    <!-- So trang -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
        << </button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            :class="{ active: currentPage === page }">
            {{ page }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"> >> </button>
    </div>

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
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const books = ref([]);
const bookToDelete = ref(null);
const router = useRouter();
const showConfirmModal = ref(false);
const toast = useToast();

const currentPage = ref(1);
const itemsPerPage = 6;

const searchQuery = ref(''); // Lưu từ khóa tìm kiếm.

const filteredBooks = computed(() => {
  // Kiểm tra nếu không có từ khóa tìm kiếm, trả về toàn bộ danh sách sách.
  if (!searchQuery.value.trim()) {
    return books.value;
  }

  // Lọc sách dựa trên từ khóa, kiểm tra tiêu đề và ISBN.
  return books.value.filter((book) => {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowerCaseQuery) ||
      book.isbn.toLowerCase().includes(lowerCaseQuery)
    );
  });
});

// Hàm tính toán danh sách sách hiển thị theo phân trang.
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBooks.value.slice(start, end);
});

// Tính tổng số trang dựa trên danh sách sách đã lọc.
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage);
});

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
const fetchBooks = async () => {
  try {
    const response = await BookService.getAllBooks();
    books.value = response.data;

    // Nếu số trang hiện tại vượt quá tổng số trang, quay lại trang cuối
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Lỗi khi lấy danh sách sách: ' + error.message, life: 3000 });
  }
};


const openEditBook = (id) => {
  router.push(`/books/${id}/edit`);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
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

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination button {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button.active {
  background-color: #13a8a1;
  color: white;
  font-weight: bold;
}

.pagination button:hover {
  background-color: #13a8a1;
  color: white;
}
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-button {
  margin-left: 10px;
}

</style>
