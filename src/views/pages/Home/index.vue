<template>
    <h3>Danh Sách Book</h3>
    <table>
      <thead>
        <tr>
          <th @click="sort('title')">
            Tiêu Đề
            <span v-if="sortKey === 'title'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('isbn')">
            ISBN
            <span v-if="sortKey === 'isbn'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('quantity')">
            Số Lượng
            <span v-if="sortKey === 'quantity'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('original_price')">
            Giá Gốc (VND)
            <span v-if="sortKey === 'original_price'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('discount_price')">
            Giá Giảm
            <span v-if="sortKey === 'discount_price'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in sortedBooks" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.isbn }}</td>
          <td>{{ book.quantity }}</td>
          <td>{{ (book.original_price) }}</td>
          <td>{{ book.discount_price}}</td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup>
  import BookService from '@/service/BookService';
  import { onMounted, ref, computed } from 'vue';
  
  const books = ref([]);
  const sortKey = ref(null);
  const sortOrder = ref('asc'); 
  
  const fetchBooks = async () => {
    try {
      const response = await BookService.getAllBooks();
      books.value = response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
  
  const sort = (key) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc'; 
    }
  };
  
  const sortedBooks = computed(() => {
    return books.value.slice().sort((a, b) => {
      if (!sortKey.value) return 0;
      const modifier = sortOrder.value === 'asc' ? 1 : -1;
      if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
      if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
      return 0;
    });
  });
  
  // Định dạng giá tiền
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };
  
  onMounted(fetchBooks);
  </script>
  
  <style>
  th {
    cursor: pointer;
    user-select: none;
  }
  </style>