<template>
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
                <ul class="category-list">
                    <li v-for="(category, index) in categories" :key="index" @click="selectCategory(category)"
                        :class="{ active: category.id === selectedCategoryId }">
                        {{ category.name }}
                    </li>
                </ul>


                <div class="filter-section">
                    <h3>Lọc Sản Phẩm</h3>
                    <div class="divider"></div>

                    <!-- Lọc theo giá -->
                    <div class="filter-price">
                        <label>Giá:</label>
                        <vue-slider v-model="priceRange" :min="10000" :max="658700" :tooltip="'always'"
                            :format-tooltip="formatTooltip"></vue-slider>
                        <div class="price-inputs">
                            <input type="number" v-model="priceRange[0]" placeholder="Giá nhỏ nhất" />
                            <input type="number" v-model="priceRange[1]" placeholder="Giá lớn nhất" />
                        </div>
                        <button @click="applyFilters">Áp dụng bộ lọc</button>
                    </div>
                    <div class="divider"></div>

                    <!-- Lọc theo Nhà xuất bản -->
                    <div class="filter-publisher">
                        <label>Nhà Xuất Bản:</label>
                        <ul class="category-list">
                            <li v-for="(publisher, index) in publishers" :key="index"
                                @click="selectPublisher(publisher)"
                                :class="{ active: publisher.id === selectedPublisherId }">
                                {{ publisher.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Cột phải: Sách -->
            <div class="right-column">
                <div class="books-container" v-if="books.length">
                    <rotuer-link class="book-card" v-for="book in filteredBooks" :key="book.id"
                        :to="{ name: 'bookdetails', params: { id: book.id } }">
                        <img :src="book.image" alt="Book Image" class="book-image" />
                        <h4 class="book-title">{{ book.title }}</h4>
                        <h3>{{ book.original_price }} đ</h3>
                        <p class="book-status">
                            {{ book.status ? 'Có sẵn' : 'Hết hàng' }}
                        </p>
                    </rotuer-link>
                </div>
                <div v-else>
                    <p>Không tìm thấy sách nào thuộc danh mục này.</p>
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

export default {
    name: 'FilterBooks',
    components: { HeaderComponent, FooterComponent },

    data() {
        return {
            books: [],
            publishers: [],
            categories: [],
            selectedCategoryId: null,
            selectedPublisherId: null,
            priceRange: [10000, 658700], // Giá trị mặc định
            minPrice: null,
            maxPrice: null,
            filteredBooks: [],
        };
    },
    mounted() {
        this.fetchCategories();
        this.fetchPublishers();
        this.fetchBooks();
        this.fetchBooksByQuery(); // Thêm hàm này để lấy dữ liệu theo URL

    },

    methods: {
        formatTooltip(value) {
            return `${value.toLocaleString()} đ`;
        },

        selectCategory(category) {
            console.log('113:',category);
            this.selectedCategoryId = category.id; // Gán danh mục được chọn
            this.filteredBooks = this.books.filter(book => book.category_id === category.id); // Lọc danh sách sách

            // Thay đổi URL khi người dùng chọn danh mục
            this.$router.push({
                name: 'FilterBooks', // Tên route
                query: { type: 'categories', id: category.id }, // Cập nhật query params
            });

            // Fetch sách nếu cần dữ liệu từ API
            this.fetchBooksByQuery();
        },


        selectPublisher(publisher) {
            this.selectedPublisherId = publisher.id;
            this.filteredBooks = this.books.filter(book => book.publisher_id === publisher.id);
        },
        async fetchBooksByQuery() {
            const { type, id } = this.$route.query;

            // Kiểm tra xem URL có query params hợp lệ hay không
            if (type === 'categories' && id) {
                this.selectedCategoryId = parseInt(id); // Gán `selectedCategoryId` để hiển thị danh mục
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:8000/api/books/search`,
                        { params: { category_id: id } } // Gửi `id` của danh mục
                    );
                    this.books = response.data.data; // Cập nhật danh sách sách
                    this.filteredBooks = this.books; // Lọc mặc định
                } catch (error) {
                    console.error('Error fetching books by query:', error);
                }
            }
        },
        async applyFilters() {
            const params = {
                min_price: this.priceRange[0],  // Giá thấp nhất
                max_price: this.priceRange[1],  // Giá cao nhất

            };

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/books/search', { params });
                this.filteredBooks = response.data.data;  // Lấy dữ liệu sách lọc từ API
                if (this.filteredBooks.length === 0) {
                    console.warn('Không tìm thấy sách nào với bộ lọc hiện tại.');
                }
            } catch (error) {
                console.error('Lỗi khi áp dụng bộ lọc:', error);
            }
        },


        async fetchPublishers() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/publishers');
                this.publishers = response.data.data;
            } catch (error) {
                console.error('Error fetching publishers:', error);
            }
        },

        async fetchCategories() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories');
                this.categories = response.data.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },

        async fetchBooks() {
            const { type, id } = this.$route.query;
            let url = 'http://127.0.0.1:8000/api/books/search';
            const params = { [type + '_id']: id };

            try {
                const response = await axios.get(url, { params });
                this.books = response.data.data;
                this.categoryName = this.getCategoryName(type);
                this.selectedCategoryId = id;
                this.selectedPublisherId = id;
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        },

        getCategoryName(type) {
            switch (type) {
                case 'category':
                    return 'Category';
                default:
                    return 'Books';
            }
        },
    },
};
</script>

<style scoped>
.filter-container {
    width: 1180px;
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

.content {
    display: flex;
    gap: 20px;
}

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
    /* border: 1px solid #ddd; */
    margin-bottom: 8px;
    border-radius: 5px;
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

.right-column {
    width: 70%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
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

/* Container chính */
.filter-container {
    width: 1180px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
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
    width: 250px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 300px;
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

/* Giá sách */
.book-price {
    font-size: 20px;
    font-weight: bold;
    color: #e53935;
    margin-bottom: 10px;
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

/* Footer */
footer {
    margin-top: 40px;
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-top: 1px solid #e0e0e0;
}
</style>
