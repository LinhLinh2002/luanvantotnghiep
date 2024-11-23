    <template>
        <HeaderComponent />

        <div v-if="book" class="book-details-container">
            <div class="book-image-description">
                <div class="book-image">
                    <img :src="book.image" alt="Book Image">
                </div>

                <!-- Tab Navigation -->
                <div class="tab-navigation">
                    <button :class="{ active: activeTab === 'description' }" @click="activeTab = 'description'">
                        Mô tả sản phẩm
                    </button>
                    <button :class="{ active: activeTab === 'details' }" @click="activeTab = 'details'">
                        Thông tin chi tiết
                    </button>
                    <button :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">
                        Đánh giá khách hàng
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Mô tả sản phẩm -->
                    <p v-if="activeTab === 'description'" class="book-description">
                        {{ book.description }}
                    </p>
                    <!-- Thông tin chi tiết sách -->
                    <p v-if="activeTab === 'details'" class="book-details">
                    <ul class="details-list">
                        <li>
                            <span class="label">Loại sản phẩm : </span>
                            <span class="value">{{ book.cover_type.type }}</span>
                        </li>
                        <li>
                            <span class="label">Kích Thước : </span>
                            <span class="value">{{ book.size }}</span>
                        </li>
                        <li>
                            <span class="label">Năm xuất bản : </span>
                            <span class="value">{{ book.published_year }}</span>
                        </li>
                        <li>
                            <span class="label">Số trang : </span>
                            <span class="value">{{ book.number_pages }}</span>
                        </li>
                        <li>
                            <span class="label">Tác giả : </span>
                            <span class="value">{{ book.author.name }}</span>
                        </li>
                        <li>
                            <span class="label">Dịch giả : </span>
                            <span class="value">{{ book.translator.name }}</span>
                        </li>
                        <li>
                            <span class="label">Nhà xuất bản : </span>
                            <span class="value">{{ book.publisher.name }}</span>

                        </li>
                    </ul>
                    </p>
                    <p v-if="activeTab === 'reviews'" class="book-reviews">
                        Chưa có đánh giá cho sách này.
                    </p>
                </div>
            </div>
            <div class="book-info">
                <h2 class="book-title">{{ book.title }}</h2>
                <p class="book-price">Giá: {{ book.original_price }} đ</p>

                <div class="action-container">
                    <!-- Nút số lượng -->
                    <div class="quantity-selector">
                        <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                        <span class="quantity-display">{{ quantity }}</span>
                        <button @click="increaseQuantity" :disabled="quantity >= 99">+</button>
                    </div>

                    <!-- Nút Chọn Mua -->
                    <button class="buy-button" @click="addToCart(book.id)">
                        <i class="bx bxs-cart"></i> Chọn Mua
                    </button>
                </div>
            </div>
        </div>

        <FooterComponent />
    </template>

<script>
import BookService from '@/service/BookService';
import CartService from '@/service/CartService.js';
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';

export default {
    name: 'BookDetails',
    components: {
        HeaderComponent,
        FooterComponent
    },
    //props: ['id'],
    data() {
        return {
            book: null,
            bookId: null, // Lưu bookId trong data
            activeTab: 'description', // Tab mặc định là Mô tả sản phẩm
            cartItemCount: 0, // Thêm biến để lưu số lượng giỏ hàng
            quantity: 1, // Số lượng mặc định

        };
    },
    async mounted() {
        const bookId = this.$route.params.id; // Lấy id từ params
        console.log("bookId:", bookId); // In ra để kiểm tra
        try {
            const response = await BookService.getBookById(bookId);
            this.book = response.data;
        } catch (error) {
            console.error('Error loading book details:', error);
        }
    },
    methods: {
        async addToCart(bookId, quantity = 1) {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser || !currentUser.token) {
                alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
                router.push({ name: 'login' });
                return;
            }

            try {
                const response = await axios.post(`${API_URL}/add`, {
                    user_id: currentUser.user_id,
                    book_id: bookId,
                    quantity: quantity,
                }, {
                    headers: { Authorization: `Bearer ${currentUser.token}` }
                });
                console.log("Sản phẩm đã được thêm vào giỏ hàng:", response.data);
                return response.data;
            } catch (error) {
                console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.response?.data || error);
                throw error;
            }
        },


        // Bạn có thể thêm một phương thức để xử lý đăng nhập người dùng và lưu trữ dữ liệu người dùng trong localStorage
        async loginUser(response) {
            localStorage.setItem("currentUser", JSON.stringify(response.data));
            // console.log("Người dùng đã đăng nhập thành công:", response.data);
        },

        increaseQuantity() {
            if (this.quantity < 99) {
                this.quantity++;
            }
        },
        decreaseQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        }
    }
};
</script>

<style>
body {
    background-color: #fff;
}

.book-details-container {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 50px;
    gap: 20px;
    background-color: #fff;
}

.book-image-description {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.book-image img {
    max-width: 384px;
    height: 400px;
    padding-left: 30px;
    border-radius: 8px;
    margin-bottom: 15px;
}

.tab-navigation {
    display: flex;
    gap: 20px;
    margin-top: 15px;
}

.tab-navigation button {
    padding: 10px 0;
    font-size: 12px;
    color: #000;
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: relative;
    /* giữ gạch chân dưới thành phần đó */
}

.tab-navigation button.active {
    color: #034784;
}

.tab-navigation button.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #034784;
}

.tab-content {
    margin-top: 20px;
    padding-left: 100px;
    width: 100%;
    text-align: justify;
}

.details-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* Chia thành hai cột đều nhau */
    gap: 10px 20px;
    /* Khoảng cách giữa các hàng và cột */
    list-style: none;
    padding: 0;
}


.details-list li {
    display: flex;
    align-items: center;
    /* Căn giữa các phần tử theo chiều dọc */
    margin-bottom: 5px;
    /* Giảm khoảng cách giữa các hàng */
}

.details-list .label {
    font-weight: bold;
    width: auto;
    /* Bỏ chiều rộng cố định */
    margin-right: 8px;
    /* Khoảng cách nhỏ giữa nhãn và giá trị */
}

.details-list .value {
    flex: 1;
}


.book-description,
.book-details,
.book-reviews {
    font-size: 12px;
    color: #333;
    line-height: 1.6;

}

.book-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 500px;
    border-radius: 8px;
    /* Bo tròn viền */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    /* Đổ bóng nhẹ */
    max-width: 450px;
    /* Chiều rộng tối đa cho thẻ */
    padding: 20px;
}

.book-title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #0f1214;
}

.action-container {
    display: flex;
    align-items: center;
    gap: 20px;
    /* Khoảng cách giữa nút số lượng và nút Chọn Mua */
}

.quantity-selector {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 20px;
    overflow: hidden;
}

.quantity-selector button {
    /* background-color: #f1f1f1; */
    border: none;
    padding: 8px 12px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    transition: background-color 0.2s;
}

.quantity-selector button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.quantity-selector .quantity-display {
    width: 40px;
    text-align: center;
    font-size: 16px;
    padding: 5px 0;
    background-color: #fff;
    color: #333;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
}

.book-price {
    font-size: 19px;
    color: #2e2b2b;
    margin-bottom: 20px;
}

.buy-button {
    background-color: #034784;
    color: #fff;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    align-self: flex-start;
    transition: background-color 0.2s;

}

.buy-button:hover {
    background-color: #023a6b;
    transform: scale(1.05);
    /* Phóng to nhẹ khi hover */

}
</style>
