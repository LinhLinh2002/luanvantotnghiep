<template>        
<Toast />

    <HeaderComponent />
    <div class="filter-container">

        <!-- <h2 class="category-title" v-for="book in filteredBooks" :key="book.id">
    
                    <h2 v-for="bookk in book" :key="bookk.id">
                        {{ bookk.name }}
                    </h2>
                </h2> -->

        <div class="content">
            <!-- Cột trái: Danh mục -->
            <div class="left-column">
                <!-- Danh sách danh mục -->

                <div class="filter-section">
                    <h3>Lọc Sản Phẩm</h3>
                    
                
                    <div class="divider"></div>

                    <!-- Lọc theo giá -->
                    <div class="filter-price">
                        <label>Giá:</label>
                        <!-- Thanh trượt để chọn khoảng giá -->
                        <vue-slider v-model="priceRange" :min="0" :max="10000000" :tooltip="'always'"
                            :format-tooltip="formatTooltip" @change="searchBooks" />
                        <div class="price-inputs">
                            <!-- Nhập giá tối thiểu -->
                            <input type="number" v-model="priceRange[0]" placeholder="Giá nhỏ nhất"
                                @input="searchBooks" />
                            <!-- Nhập giá tối đa -->
                            <input type="number" v-model="priceRange[1]" placeholder="Giá lớn nhất"
                                @input="searchBooks" />
                        </div>
                    </div>

                    <!-- Lọc theo Nhà xuất bản -->
                    <!-- Bộ lọc Nhà Xuất Bản -->
                    <div class="filter-publisher">
                        <label>Nhà Xuất Bản <button @click="toggleFilter('publishers')" class="btn-toggle">
                                <i class="bx bx-plus"></i> <!-- Nút + -->
                            </button></label>

                        <!-- Hiển thị danh sách checkbox nếu showPublishers là true -->
                        <ul class="category-list" v-show="showPublishers">
                            <li v-for="(publisher, index) in publishers" :key="index">
                                <label>
                                    <input type="checkbox" :value="publisher.id" v-model="selectedPublisherIds"
                                        @change="searchBooks" />
                                    {{ publisher.name }}
                                </label>
                            </li>
                        </ul>
                    </div>

                    <!-- Bộ lọc Danh Mục -->
                    <div class="filter-publisher">
                        <label>Danh mục <button @click="toggleFilter('categories')" class="btn-toggle">
                                <i class="bx bx-plus"></i> <!-- Nút + -->
                            </button></label>

                        <ul class="category-list" v-show="showCategories">
                            <li v-for="(category, index) in categories" :key="index">
                                <label>
                                    <input type="checkbox" :value="category.id" v-model="selectedCategoryIds"
                                        @change="searchBooks" />
                                    {{ category.name }}
                                </label>
                            </li>
                        </ul>
                    </div>

                    <!-- Bộ lọc Tác Giả -->
                    <div class="filter-publisher">
                        <label>Tác giả <button @click="toggleFilter('authors')" class="btn-toggle">
                                <i class="bx bx-plus"></i> <!-- Nút + -->
                            </button></label>

                        <ul class="category-list" v-show="showAuthors">
                            <li v-for="(author, index) in authors" :key="index">
                                <label>
                                    <input type="checkbox" :value="author.id" v-model="selectedAuthorIds"
                                        @change="searchBooks" />
                                    {{ author.name }}
                                </label>
                            </li>
                        </ul>
                    </div>

                    <!-- Bộ lọc Dịch Giả -->
                    <div class="filter-publisher">
                        <label>Dịch giả <button @click="toggleFilter('translators')" class="btn-toggle">
                                <i class="bx bx-plus"></i> <!-- Nút + -->
                            </button></label>

                        <ul class="category-list" v-show="showTranslators">
                            <li v-for="(translator, index) in translators" :key="index">
                                <label>
                                    <input type="checkbox" :value="translator.id" v-model="selectedTranslatorIds"
                                        @change="searchBooks" />
                                    {{ translator.name }}
                                </label>
                            </li>
                        </ul>
                    </div>

                    <!-- Bộ lọc Ngôn Ngữ -->
                    <div class="filter-publisher">
                        <label>Ngôn ngữ <button @click="toggleFilter('languages')" class="btn-toggle">
                                <i class="bx bx-plus"></i> <!-- Nút + -->
                            </button></label>

                        <ul class="category-list" v-show="showLanguages">
                            <li v-for="(language, index) in languages" :key="index">
                                <label>
                                    <input type="checkbox" :value="language.id" v-model="selectedLanguageIds"
                                        @change="searchBooks" />
                                    {{ language.name }}
                                </label>
                            </li>
                        </ul>
                    </div>

                    <!-- Bộ lọc Loại Bìa -->
                    <div class="filter-publisher">
                        <label>Loại bìa <button @click="toggleFilter('coverTypes')" class="btn-toggle">
                                <i class="bx bx-plus"></i> <!-- Nút + -->
                            </button></label>

                        <ul class="category-list" v-show="showCoverTypes">
                            <li v-for="(coverType, index) in coverTypes" :key="index">
                                <label>
                                    <input type="checkbox" :value="coverType.id" v-model="selectedCoverTypeIds"
                                        @change="searchBooks" />
                                    {{ coverType.type }}
                                </label>
                            </li>
                        </ul>
                    </div>

                    <div class="filter-publisher">
                        <label>Thể Loại <button @click="toggleFilter('genres')" class="btn-toggle">
                                <i class="bx bx-plus"></i> <!-- Nút + -->
                            </button></label>

                        <ul class="category-list" v-show="showGenres">
                            <li v-for="(genre, index) in genres" :key="index">
                                <label>
                                    <input type="checkbox" :value="genre.id" v-model="selectedGenreIds"
                                        @change="searchBooks" />
                                    {{ genre.name }}
                                </label>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            <!-- Cột phải: Sách -->
            <div class="right-column">
                <!-- Hiển thị danh sách sách nếu có sách -->
                <div class="books-container" v-if="filteredBooks.length">
                    <router-link class="book-card" v-for="book in filteredBooks" :key="book.id"
                        :to="{ name: 'bookdetails', params: { id: book.id } }">
                        <img :src="book.image" alt="Book Image" class="book-image" />
                        <h4 class="book-title">{{ book.title }}</h4>

                        <p v-if="book.discount_price" class="product-price-sell discounted-price">
                            {{ formatCurrency(book.discount_price) }} đ
                        </p>
                        <p v-if="book.discount_price" class="product-price-sell original-price">
                            {{ formatCurrency(book.original_price) }} đ
                        </p>
                        <p v-else class="product-price-sell normal-price">
                            {{ formatCurrency(book.original_price) }} đ

                        </p> 

                        <!-- <p class="book-status">
                            {{ book.status ? 'Có sẵn' : 'Hết hàng' }}
                        </p> -->
                        <button class="product-button-sell" @click.prevent="addToCart(book.id)">
                            <i class="bx bxs-cart"></i> Chọn Mua
                        </button>
                    </router-link>
                </div>

                <!-- Hiển thị thông báo nếu không có sách nào -->
                <div class="no-books-container" v-else>
                    <p v-if="noBooksMessage">Không có sách tồn tại theo tiêu chí này</p>
                    <button class="clear-filters-button" @click="clearFilters">Xóa bộ lọc</button>
                </div>
            </div>


        </div>
    </div>
    <FooterComponent />
</template>

<script>
import axios from 'axios';
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';
import CartService from '/src/service/CartService.js';
import PublisherService from '@/service/PublisherService';
import CategoryService from '@/service/CategoryService';
import AuthorService from '@/service/AuthorService';
import TranslatorService from '@/service/TranslatorService';
import AttributeService from '@/service/AttributeService';
import { useToast } from 'primevue/usetoast'; // Import useToast

export default {
    name: 'FilterBooks',
    components: {
        HeaderComponent,
        FooterComponent
    },

    data() {
        return {
            showGenres: false,
            showPublishers: false,
            showCategories: false,
            showAuthors: false,
            showTranslators: false,
            showLanguages: false,
            showCoverTypes: false,
            books: [],
            publishers: [],
            categories: [],
            authors: [],
            genres: [],
            languages: [],
            coverTypes: [],
            selectedCategoryIds: [],
            selectedPublisherIds: [],
            selectedAuthorIds: [], // Tác giả đã chọn
            selectedTranslatorIds: [], // Dịch giả đã chọn
            selectedGenreIds: [], // Thể loại đã chọn
            selectedLanguageIds: [],
            selectedCoverTypeIds: [], // Loại bìa đã chọn
            priceRange: [], // Giá trị mặc định
            filteredBooks: [],
            noBooksMessage: '',
        };
    },
    mounted() {
        this.fetchCategories();
        this.fetchAuthors();
        this.fetchPublishers();
        this.fetchTranslators();
        this.fetchGenres();
        this.fetchLanguages();
        this.fetchCoverTypes();

        const query = this.$route.query;

        this.selectedAuthorIds = query.author_id ? [].concat(query.author_id) : [];
        this.selectedTranslatorIds = query.translator_id ? [].concat(query.translator_id) : [];
        this.selectedPublisherIds = query.publisher_id ? [].concat(query.publisher_id) : [];
        this.selectedCategoryIds = query.category_id ? [].concat(query.category_id) : [];
        this.selectedGenreIds = query.genre_id ? [].concat(query.genre_id) : [];
        this.selectedLanguageIds = query.language_id ? [].concat(query.language_id) : [];
        this.selectedCoverTypeIds = query.cover_type_id ? [].concat(query.cover_type_id) : [];

        this.minPrice = query.min_price ? Number(query.min_price) : null;
        this.maxPrice = query.max_price ? Number(query.max_price) : null;

        // Tự động thực hiện tìm kiếm sau khi áp dụng bộ lọc
        this.searchBooks();
    },
    computed: {
        selectedPublishers() {
            return this.publishers.filter(publisher =>
                this.selectedPublisherIds.includes(publisher.id)
            );
        },
        selectCategories() {
            return this.categories.filter(catetegory =>
                this.selectedCategoryIds.includes(catetegory.id)
            );
        },
        selectedAuthors() {
            return this.authors.filter(author =>
                this.selectedAuthorIds.includes(author.id)
            );
        },
        selectedTranslators() {
            return this.translators.filter(translator =>
                this.selectedTranslatorIds.includes(translator.id)
            );
        },
        selectedLanguages() {
            return this.languages.filter(language =>
                this.selectedLanguageIds.includes(language.id)
            );
        },
        selectedCoverTypes() {
            return this.coverTypes.filter(coverType =>
                this.selectedCoverTypeIds.includes(coverType.id) // make sure it matches 'selectedCoverTypeId'
            );
        },
        selectedGenres() {
            return this.genres.filter(genre =>
                this.selectedGenreIds.includes(genre.id)
            );
        }

    },

    methods: {
        formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN').format(amount);
        },
        toggleFilter(filter) {
            this[`show${this.capitalizeFirstLetter(filter)}`] = !this[`show${this.capitalizeFirstLetter(filter)}`];
        },

        async clearFilters() {
            // Reset tất cả các giá trị bộ lọc
            this.keywords = '';
            this.selectedAuthorIds = [];
            this.selectedTranslatorIds = [];
            this.selectedPublisherIds = [];
            this.selectedCategoryIds = [];
            this.selectedGenreIds = [];
            this.selectedLanguageIds = [];
            this.selectedCoverTypeIds = [];
            this.minPrice = null;
            this.maxPrice = null;

            // Cập nhật URL với các tham số mặc định (bỏ bộ lọc)
            this.$router.push({
                query: {}
            });

            // Gọi lại hàm tìm kiếm để lấy tất cả sách
            this.searchBooks();
        },
        async applyFilters() {
            // Xây dựng bộ lọc và gọi hàm tìm kiếm
            await this.searchBooks();
        },
        formatTooltip(value) {
            return `${value.toLocaleString()} VNĐ`; // Định dạng tiền tệ
        },
        capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        async searchBooks() {
            try {
                const params = {
                    author_id: this.selectedAuthorIds.length > 0 ? this.selectedAuthorIds : undefined,
                    translator_id: this.selectedTranslatorIds.length > 0 ? this.selectedTranslatorIds : undefined,
                    publisher_id: this.selectedPublisherIds.length > 0 ? this.selectedPublisherIds : undefined,
                    category_id: this.selectedCategoryIds.length > 0 ? this.selectedCategoryIds : undefined,
                    genre_id: this.selectedGenreIds.length > 0 ? this.selectedGenreIds : undefined,
                    language_id: this.selectedLanguageIds.length > 0 ? this.selectedLanguageIds : undefined,
                    cover_type_id: this.selectedCoverTypeIds.length > 0 ? this.selectedCoverTypeIds : undefined,
                    min_price: this.priceRange[0], // Giá trị tối thiểu
                    max_price: this.priceRange[1], // Giá trị tối đa

                };

                // Lọc các giá trị null/undefined
                const filteredParams = Object.fromEntries(
                    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
                );

                // Cập nhật URL với các tham số lọc
                this.$router.push({
                    query: filteredParams
                });

                // Gửi yêu cầu tìm kiếm đến API
                const response = await axios.get(`http://127.0.0.1:8000/api/books/search`, {
                    params: filteredParams
                });

                if (!response.data.success) {
                    this.filteredBooks = []; // Xóa danh sách sách cũ
                    this.noBooksMessage = response.data.message || 'Không tìm thấy sách nào.';
                } else {
                    this.filteredBooks = response.data.data || [];
                    this.noBooksMessage = ''; // Xóa thông báo lỗi nếu có sách
                }
            } catch (error) {
                console.error('Lỗi khi tìm kiếm sách:', error);
                this.filteredBooks = [];
                this.noBooksMessage = 'Đã có lỗi xảy ra khi tìm kiếm sách. Vui lòng thử lại!';
            }
        },

        async addToCart(bookId) {
            try {
                await CartService.addToCart(bookId, 1);
                toast.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thêm sách thành côngcông',
                    life: 3000
                });
                window.location.reload();
            } catch (error) {
                console.error('Error adding to cart:', error);
                window.location.reload();

            }
        },
        async fetchPublishers() {
            try {
                const response = await PublisherService.getAllPublishers();
                this.publishers = response.data;
            } catch (error) {
                console.error('Error fetching publishers:', error);
            }
        },
        async fetchTranslators() {
            try {
                const response = await TranslatorService.getAllTranslators();
                this.translators = response.data;

            } catch (error) {
                console.error('Error fetching translators:', error);
            }
        },

        async fetchCategories() {
            try {
                const response = await CategoryService.getAllCategories();
                this.categories = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchAuthors() {
            try {
                const response = await AuthorService.getAllAuthors();
                this.authors = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchGenres() {
            try {
                const response = await AttributeService.getAllGenres();
                this.genres = response.data; // Gán dữ liệu vào mảng genres
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        },

        async fetchLanguages() {
            try {
                const response = await AttributeService.getAllLanguages();
                this.languages = response.data; // Gán dữ liệu vào mảng languages
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        },

        async fetchCoverTypes() {
            try {
                const response = await AttributeService.getAllCoverTypes();
                this.coverTypes = response.data; // Gán dữ liệu vào mảng coverTypes
            } catch (error) {
                console.error('Error fetching cover types:', error);
            }
        },
        getPublisherName(publisherId) {
            const publisher = this.publishers.find(pub => pub.id === publisherId);
            return publisher.name;
        },
        getAuthorName(authorId) {
            const author = this.authors.find(auth => auth.id === authorId);
            return author.name;
        },
        getTranslatorName(translatorId) {
            const translator = this.translators.find(trans => trans.id === translatorId);
            return translator.name;
        },
        getGenreName(genreId) {
            const genre = this.genres.find(g => g.id === genreId);
            return genre.name;
        },
        getLanguageName(languageId) {
            const language = this.languages.find(lang => lang.id === languageId);
            return language.name;
        },
        getCoverTypeName(coverTypeId) {
            const coverType = this.coverTypes.find(cover => cover.id === coverTypeId);
            return coverType.type;
        },

    },
};
</script>

<style scoped>
.filter-container {
    width: auto; /* Để chiều rộng tự động điều chỉnh */
    max-width: 1220px; /* Giới hạn chiều rộng tối đa */
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}


.category-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: start;
}

.filter-publisher {
    font-family: Arial, sans-serif;
}

.category-list {
    list-style: none;
    padding: 0;
}

.checkbox-label {
    display: flex;
    align-items: center;
}

.checkbox-label input[type="checkbox"] {
    margin-right: 10px;
    /* Thêm khoảng cách giữa checkbox và văn bản */
}

.content {
    display: flex;
    gap: 20px;
}

.left-column {
    width: 25%;
}

.filter-price {
    margin-bottom: 20px;
}

.vue-slider {
    margin: 10px 0;
}

.price-inputs {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.price-inputs input {
    width: 48%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.right-column {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
}


.books-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    /* Có thể điều chỉnh nếu cần */
}

.no-books-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

.no-books-container p {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
}

.clear-filters-button {
    background-color: #ff4e50;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.clear-filters-button:hover {
    background-color: #e03e42;
}


/* Phần Lọc Sản Phẩm (Lọc theo giá và NSX) */
.filter-section {
    margin-top: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    /* border: 1px solid #ddd; Border cho toàn bộ phần lọc */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-price,
.filter-publisher {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    /* Border cho từng phần lọc */
    border-radius: 8px;
    background-color: #fff;
}

.filter-price label,
.filter-publisher label {
    font-weight: bold;
    margin-bottom: 10px;
    display: block;
    color: #333;
}

.category-list {
    list-style-type: none;
    padding: 0;
}

.category-list li {
    padding: 8px 15px;
    cursor: pointer;
    margin-bottom: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.category-list li.active,
.category-list li:hover {
    background-color: #f0f0f0;
    font-weight: bold;
}

/* Border cho mỗi item trong danh sách Nhà xuất bản */
.filter-publisher ul {
    border-top: 1px solid #ddd;
    padding-top: 10px;
}

.filter-price .price-inputs input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 48%;
    margin-top: 10px;
}

.filter-price button {
    background-color: #007bff;
    /* Màu nền nút */
    color: white;
    /* Màu chữ */
    font-size: 16px;
    /* Kích thước chữ */
    padding: 5px 10px;
    /* Khoảng cách bên trong */
    border: none;
    /* Không có viền */
    border-radius: 5px;
    /* Bo tròn các góc */
    cursor: pointer;
    /* Con trỏ khi hover vào nút */
    transition: background-color 0.3s ease;
    /* Hiệu ứng khi hover */
    margin-top: 15px;
    margin-left: 50px;
}

.filter-price button:hover {
    background-color: #0056b3;
    /* Màu nền khi hover */
}

.filter-price button:active {
    background-color: #004085;
    /* Màu nền khi click */
}



/* Tiêu đề danh mục */
.category-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: start;
}

/* Cột chính */
.content {
    display: flex;
    gap: 20px;
}

/* Cột trái: Danh mục */
.left-column {
    width: 25%;
}

.category-list {
    list-style-type: none;
    padding: 0;
}

.category-list li {
    padding: 10px;
    cursor: pointer;
    margin-bottom: 8px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.category-list li.active {
    background-color: #f0f0f0;
    font-weight: bold;
}

.filter-price {
    margin-bottom: 20px;
}

.vue-slider {
    margin: 10px 0;
}

.price-inputs {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.price-inputs input {
    width: 48%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

/* Cột phải: Sách */
.right-column {
    width: 70%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
}

/* Container sách */
.books-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

}

/* Thẻ sách */
.book-card {
    width: 190px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 420px;
    /* Giới hạn chiều cao để không quá dài */
}

/* Cải thiện ảnh sách */
.book-image {
    width: 100%;
    height: 180px;
    /* Giới hạn chiều cao ảnh sách */
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 15px;
    transition: transform 0.3s ease;
}

/* Tiêu đề sách */
.book-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    line-height: 1.4;
    text-align: center;
    transition: color 0.3s ease;
}

/* Giá giảm */
.discounted-price {
    color: red;
    font-weight: bold;
    font-size: 14px;
}

/* Giá thường bị gạch ngang khi có giá giảm */
.original-price {
    color: gray;
    text-decoration: line-through;
    font-size: 12px;
}

/* Giá thường (không có giảm giá) */
.normal-price {
    color: rgb(53, 46, 46);
    font-weight: bold;
    font-size: 14px;
    padding-bottom: 5px;
}   

/* Tình trạng sách */
.book-status {
    font-size: 14px;
    color: #777;
    margin-top: 10px;
    font-weight: 600;
    text-transform: uppercase;
}

/* Cải thiện hiệu ứng hover */
.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* Hiển thị tình trạng sách có sẵn và hết hàng */
.book-status.available {
    color: #4caf50;
}

.book-status.out-of-stock {
    color: #f44336;
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

/* Footer */
footer {
    margin-top: 40px;
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-top: 1px solid #e0e0e0;
}
</style>