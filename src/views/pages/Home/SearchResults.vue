<template>
    <HeaderComponent />
    <Toast />
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
                <!-- <   -->

                <p v-if="book.discount_price" class="discounted-price">
                    {{ formatCurrency(book.discount_price) }} đ
                </p>
                <p v-if="book.discount_price" class="original-price">
                    {{ formatCurrency(book.original_price) }} đ
                </p>
                <p v-else class="normal-price">
                    {{ formatCurrency(book.original_price) }} đ
                </p>


                <p v-if="book.quantity === 0" class="out-of-stock">Hết hàng</p>

                <button class="product-button-sell" v-if="book.quantity > 0" @click.prevent="addToCart(book.id)">
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
import Dropdown from 'primevue/dropdown';
import { useToast } from "primevue/usetoast";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import FooterComponent from "./Footer.vue";
import HeaderComponent from "./Header.vue";
import CartService from "/src/service/CartService.js";
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

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN').format(amount);
        };
        // Danh sách tùy chọn sắp xếp
        const sortOptions = [
            { label: "Mới nhất", value: { sortBy: "created_at", sortOrder: "desc" } },
            { label: "Giá tăng dần", value: { sortBy: "original_price", sortOrder: "asc" } },
            { label: "Giá giảm dần", value: { sortBy: "original_price", sortOrder: "desc" } },
            { label: "Tên A-Z", value: { sortBy: "title", sortOrder: "asc" } },
            { label: "Tên Z-A", value: { sortBy: "title", sortOrder: "desc" } },
        ];
        // console.log("Các tùy chọn sắp xếp:", sortOptions);

        const selectedSort = ref(sortOptions[0].value);
        // console.log("Giá trị mặc định của selectedSort:", selectedSort.value);

        // Hàm tìm kiếm sách
        const searchBooks = async (query, authorId = null, sortBy = "created_at", sortOrder = "desc") => {
            if (!query.trim()) {
                books.value = [];
                // console.log("Từ khóa tìm kiếm rỗng!");
                return;
            }

            isLoading.value = true;
            try {
                const response = await BookSearchService.searchBooks(query, authorId, sortBy, sortOrder);
                books.value = response?.data || [];
                if (books.value.length === 0) {
                    // console.log("Không tìm thấy sách nào!");
                }
            } catch (error) {
                // console.error("Lỗi khi tìm kiếm:", error);
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
            // console.log("Giá trị selectedSort khi chọn:", selectedSort.value);

            const { sortBy, sortOrder } = selectedSort.value?.value || {};
            if (sortBy && sortOrder) {
                searchBooks(searchQuery.value, null, sortBy, sortOrder);
            } else {
                // console.error("Giá trị selectedSort không hợp lệ:", selectedSort.value);
            }
        };
        watch(
            () => route.query.query,
            (newQuery) => {
                searchQuery.value = newQuery || "";
                // console.log("Query mới nhận được:", searchQuery.value);

                // Thực hiện tìm kiếm ngay khi có query
                if (searchQuery.value) {
                    const { sortBy, sortOrder } = selectedSort.value?.value || {};
                    searchBooks(searchQuery.value, null, sortBy, sortOrder);
                }
            },
            { immediate: true } // Thực hiện ngay khi component được mount
        );

        onMounted(() => {
            const initialQuery = route.query.query || "";
            searchQuery.value = initialQuery;

            // console.log("Từ khóa tìm kiếm ban đầu:", initialQuery);

            if (initialQuery) {
                const { sortBy, sortOrder } = selectedSort.value?.value || {};
                searchBooks(initialQuery, null, sortBy, sortOrder);
            }
        });

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
                // console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
                toast.add({
                    severity: "error",
                    summary: "Lỗi",
                    detail: "Không thể thêm sản phẩm vào giỏ hàng.",
                    life: 3000,
                });
            }
        };

        return {
            formatCurrency,
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

.out-of-stock {
    color: red;
    font-weight: bold;
}

/* Phong cách cho nút */
.product-button-sell {
    background-color: #0056b3;
    color: white;
    padding: 12px 20px;
    /* Khoảng cách đều cho các nút */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 16px;
    /* Kích thước chữ đồng nhất */
    width: 100%;
    /* Nút rộng hết chiều ngang */
    margin-top: auto;
    /* Căn chỉnh nút ở dưới cùng */
    transition: background-color 0.3s ease;
    /* Hiệu ứng hover mượt mà */
}

/* Hiệu ứng hover cho nút */
.product-button-sell:hover {
    background-color: #5b91cc;
}

.discounted-price {
    color: red;
    font-weight: bold;
    font-size: 14px;
}

.original-price {
    color: gray;
    text-decoration: line-through;
    font-size: 12px;
}

.normal-price {
    color: rgb(53, 46, 46);
    font-weight: bold;
    font-size: 14px;
}


/* Điều chỉnh layout */
.book-item {
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 15px;
    /* Điều chỉnh padding để tạo không gian hơn */
    width: 240px;
    height: 100%;
    /* Đảm bảo các mục có chiều cao đồng nhất */
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
    height: 100px;
}

.book-item p {
    margin: 5px 0;
    font-size: 14px;
}
</style>
