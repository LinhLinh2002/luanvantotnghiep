<template>
    <HeaderComponent />

    <div class="search-results">
        <h2>Kết quả tìm kiếm cho: "{{ searchQuery }}"</h2>

        <div class="controls">
            <!-- Dropdown Sắp Xếp -->
            <label for="sortOptions">Sắp xếp:</label>
            <Dropdown id="sortOptions" v-model="selectedSort" :options="sortOptions" optionLabel="label"
                @change="handleSort" class="sort-dropdown" />
        </div>

        <!-- Hiển thị trạng thái loading -->
        <div v-if="isLoading" class="loading-indicator">
            <p>Đang tìm kiếm sách...</p>
        </div>

        <!-- Hiển thị danh sách sách -->
        <div v-else-if="books.length > 0" class="book-list">
            <div v-for="book in books" :key="book.id" class="book-item">
                <router-link :to="{ name: 'bookdetails', params: { id: book.id } }">
                    <img :src="book.image" alt="Book Image" class="book-image" />
                    <h3>{{ book.title }}</h3>
                </router-link>
                <p>{{ book.status ? 'Có sẵn' : 'Hết hàng' }}</p>
                <p>{{ book.original_price }} ₫</p>
                <button class="product-button-sell" @click.prevent="addToCart(book.id)">
                    <i class="bx bxs-cart"></i> Chọn Mua
                </button>
            </div>
        </div>

        <!-- Khi không tìm thấy sách -->
        <div v-else>
            <p>Không tìm thấy sách nào!</p>
        </div>
    </div>

    <FooterComponent />
</template>

<script>
import BookSearchService from "@/service/BookSearchService";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import FooterComponent from "./Footer.vue";
import HeaderComponent from "./Header.vue";
import CartService from "/src/service/CartService.js";
import Dropdown from 'primevue/dropdown';

export default {
    name: "SearchResults",
    components: {
        HeaderComponent,
        FooterComponent,
        Dropdown,
    },
    setup() {
        const books = ref([]);
        const searchQuery = ref("");
        const isLoading = ref(false);

        const route = useRoute();
        const toast = useToast();

        // Danh sách tùy chọn sắp xếp
        const sortOptions = [
            { label: "Mới nhất", value: { sortBy: "created_at", sortOrder: "desc" } },
            { label: "Giá tăng dần", value: { sortBy: "original_price", sortOrder: "asc" } },
            { label: "Giá giảm dần", value: { sortBy: "original_price", sortOrder: "desc" } },
            { label: "Tên A-Z", value: { sortBy: "title", sortOrder: "asc" } },
            { label: "Tên Z-A", value: { sortBy: "title", sortOrder: "desc" } },
        ];
        const selectedSort = ref(sortOptions[0].value);

        // Hàm tìm kiếm sách
        const searchBooks = async (query, authorId = null, sortBy = "created_at", sortOrder = "desc") => {
            if (!query.trim()) {
                books.value = [];
                console.log("Từ khóa tìm kiếm rỗng!");
                return;
            }

            isLoading.value = true;
            try {
                const response = await BookSearchService.searchBooks(query, authorId, sortBy, sortOrder);
                books.value = response?.data || [];
                if (books.value.length === 0) {
                    console.log("Không tìm thấy sách nào!");
                }
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
                toast.add({
                    severity: "error",
                    summary: "Lỗi",
                    detail: "Không thể tìm kiếm sách. Vui lòng thử lại!",
                    life: 3000,
                });
            } finally {
                isLoading.value = false;
            }
        };

        // Xử lý khi người dùng thay đổi tiêu chí sắp xếp
        const handleSort = () => {
            const { sortBy, sortOrder } = selectedSort.value;
            searchBooks(searchQuery.value, null, sortBy, sortOrder);
        };

        // Theo dõi thay đổi URL để tìm kiếm
        watch(
            () => route.query.query,
            (newQuery) => {
                searchQuery.value = newQuery || "";
                if (searchQuery.value) {
                    handleSort();
                }
            },
            { immediate: true }
        );

        // Thêm sản phẩm vào giỏ hàng
        const addToCart = async (bookId) => {
            try {
                await CartService.addToCart(bookId, 1);
                toast.add({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Sản phẩm đã được thêm vào giỏ hàng.",
                    life: 3000,
                });
                window.location.reload();

            } catch (error) {
                console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
                toast.add({
                    severity: "error",
                    summary: "Lỗi",
                    detail: "Không thể thêm sản phẩm vào giỏ hàng.",
                    life: 3000,
                });
            }
        };

        return {
            books,
            searchQuery,
            addToCart,
            isLoading,
            sortOptions,
            selectedSort,
            handleSort,
        };
    },
};
</script>

<style scoped>
.search-results {
    max-width: 1300px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 30px;
    font-weight: 600;
}

.controls {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 15px;
    margin-bottom: 20px;
}

.sort-dropdown {
    width: 200px;
}

.book-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.book-item {
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 10px;
    width: 240px;
    height: 450px;
}

.book-item:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

.book-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 15px;
}

.book-item h3 {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin: 0;
}

.book-item p {
    margin: 5px 0;
    font-size: 14px;
    color: #666;
}

.product-button-sell {
    background-color: #0056b3;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 15px;
}

.product-button-sell:hover {
    background-color: #5b91cc;
}
</style>
