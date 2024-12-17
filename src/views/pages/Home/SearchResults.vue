<template>
    <HeaderComponent />

    <div class="search-results">
        <h2>Kết quả tìm kiếm cho: "{{ searchQuery }}"</h2>

        <div v-if="books.length > 0">
            <div v-for="book in books" :key="book.id" class="book-item">
                <router-link :to="{ name: 'bookdetails', params: { id: book.id } }">
                    <img :src="book.image" alt="Book Image" class="book-image" />
                    <h3>{{ book.title }}</h3>
                </router-link>
                <p>{{ book.author }}</p>
                <p>{{ book.price }}₫</p>
            </div>
        </div>

        <div v-else>
            <p>Không tìm thấy sách nào!</p>
        </div>
    </div>
    <FooterComponent />

</template>

<script>
import BookSearchService from '@/service/BookSearchService';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';

export default {
    name: "SearchResults",
    components: {
        HeaderComponent,
        FooterComponent,
    },
    setup() {
        const books = ref([]);
        const searchQuery = ref('');
        const route = useRoute();

        // Khi trang được tải, lấy query từ URL và tìm kiếm sách
        onMounted(async () => {
            searchQuery.value = route.query.query || '';
            await searchBooks(searchQuery.value);
        });

        const searchBooks = async (query) => {
            try {
                // Gọi API tìm kiếm sách với query
                const response = await BookSearchService.searchBooks(query);
                if (response.data && response.data.length > 0) {
                    books.value = response.data;
                } else {
                    books.value = [];
                    console.log("Không tìm thấy sách nào!");
                }
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
            }
        };


        return {
            books,
            searchQuery
        };
    }
};

</script>

<style scoped>
.search-results {
    width: 1180px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.book-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.book-image {
    width: 100px;
    height: 150px;
    margin-right: 20px;
}

.book-item h3 {
    font-size: 18px;
    margin: 0;
}

.book-item p {
    margin: 5px 0;
}
</style>