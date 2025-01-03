    <template>
        <HeaderComponent />
        <Toast />
        <div v-if="book" class="book-details-container">
            <div class="book-image-description">
                <div class="book-image">
                    <img :src="book.image" alt="Book Image">
                </div>

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

                <div class="tab-content">
                    <p v-if="activeTab === 'description'" class="book-description">
                        {{ book.description }}
                    </p>
                    <p v-if="activeTab === 'details'" class="book-details">
                    <ul class="details-list">
                        <li>
                            <span class="label">Loại sản phẩm : </span>
                            <span class="value">{{ book.cover_type.type }}</span>
                        </li>
                        <li>
                            <span class="label">Kích Thước : </span>
                            <span class="value">{{ book.length }}x{{ book.width }}x{{ book.height }}</span>
                        </li>
                        <li>
                            <span class="label">Năm xuất bản : </span>
                            <span class="value">{{ book.published_year }}</span>
                        </li>
                        <li>
                            <span class="label">Số trang : </span>
                            <span class="value">{{ book.number_pages }}</span>
                        </li>
                        <!-- <li>
                            <span class="label">Tác giả : </span>
                            <span class="value">{{ book.author.id }}</span>
                        </li> -->
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

                <p v-if="book.discount_price" class="book-price">
                    <span class="old-price">{{ formatCurrency(book.original_price) }} đ</span>
                    <span class="discounted-price">{{ formatCurrency(book.discount_price) }} đ</span>
                </p>
                <p v-else class="book-price">{{ formatCurrency(book.original_price) }} đ</p>

                <div class="quantity">
                    <span v-if="book.quantity > 0">Số lượng sách còn {{ book.quantity }}</span>
                    <span v-else style="color: red;">Hết hàng</span>
                </div>

                <!-- <input type="number" class="quantity-display" 
                 :placeholder="quantity" v-model="quantity" /> -->


                <div class="action-container">
                    <!-- Nút số lượng -->
                    <div class="quantity-selector">
                        <button @click="decreaseQuantity" :disabled="quantity <= 1 || book.quantity === 0">-</button>
                        <!-- <span>{{ quantity }}</span> -->

                        <input type="number" class="quantity-display" v-model="quantity" :placeholder="quantity"
                            :disabled="book.quantity === 0" />

                        <button @click="increaseQuantity"
                            :disabled="quantity >= book.quantity || book.quantity === 0">+</button>
                    </div>

                    <!-- Nút Chọn Mua -->
                    <button class="buy-button" @click="addToCart(book.id)" :disabled="book.quantity <= 0">

                        <i class="bx bxs-cart"></i> Chọn Mua
                    </button>

                    <button class="wishlist-button" @click="toggleWishlist(book.id)"
                        :class="{ 'active-wishlist': isInWishlist }">
                        <i class="bx bxs-heart"></i>
                        <span v-if="isInWishlist">Bỏ yêu thích</span>
                        <span v-else>Thêm vào yêu thích</span>
                    </button>

                </div>
            </div>
        </div>

        <FooterComponent />
    </template>

<script>
import BookService from '@/service/BookService';
import CartService from '@/service/CartService';
import WishlistService from '@/service/WishlistService'; // Import WishlistService
import { useToast } from 'primevue/usetoast'; // Import useToast
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';

export default {
    name: 'BookDetails',
    components: { HeaderComponent, FooterComponent },
    data() {
        return {
            book: null,
            activeTab: 'description',
            quantity: 1, // Số lượng mặc định
            isInWishlist: false, // Trạng thái yêu thích

        };
    },
    async mounted() {
        const bookId = this.$route.params.id;
        try {
            const response = await BookService.getBookById(bookId);
            this.book = response.data;

            // Nếu số lượng sách trong kho bằng 0, đặt quantity mặc định là 0
            if (this.book.quantity === 0) {
                this.quantity = 0;
            }

            await this.checkWishlistStatus(bookId);
        } catch (error) {
            console.error('Error loading book details:', error);
        }
    },
    setup() {
        const toast = useToast(); 
        return {
            toast, 
        };
    },
    methods: {
        formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN').format(amount);
        },
        async addToCart(bookId) {
            console.log('addToCart triggered'); 

            if (this.book.quantity <= 0) {
                this.toast.add({
                    severity: "error",
                    summary: "Hết hàng",
                    detail: "Sản phẩm này đã hết hàng.",
                    life: 3000,
                });
                return;
            }
            if (this.quantity > this.book.quantity) {
                this.toast.add({
                    severity: "warn",
                    summary: "Lỗi",
                    detail: `Số lượng trong kho không đủ.`,
                    life: 3000,
                });
                return;
            }

            try {
                await CartService.addToCart(bookId, this.quantity);

                // Cập nhật số lượng còn lại trong kho
                    // this.book.quantity -= this.quantity;

                this.toast.add({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Sản phẩm đã được thêm vào giỏ hàng.",
                    life: 3000,
                });
                window.location.reload();
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        this.toast.add({
                            severity: "warn",
                            summary: "Thông báo",
                            detail: "Sản phẩm đã có trong giỏ hàng hoặc đã đạt số lượng tối đa.",
                            life: 3000,
                        });
                    } else if (error.response.status === 401) {
                        this.$router.push({ name: "login" });
                    } else {
                        this.toast.add({
                            severity: "error",
                            summary: "Lỗi",
                            detail: "Không thể thêm sản phẩm vào giỏ hàng.",
                            life: 3000,
                        });
                    }
                }
            }
        },

        async addToWishlist(bookId) {
            try {
                await WishlistService.addToWishlist(bookId);
                this.isInWishlist = true;
                localStorage.setItem('wishlist_' + bookId, true); // Lưu vào localStorage
                this.toast.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Sách đã được thêm vào danh sách yêu thích.',
                    life: 3000,
                });
            } catch (error) {
                // console.error('Lỗi khi thêm sản phẩm vào danh sách yêu thích:', error);
                this.$router.push({ name: 'login' });

            }
        },

        async removeFromWishlist(bookId) {
            try {
                // console.log("Gửi yêu cầu xóa sách với ID:", bookId);

                const response = await WishlistService.removeFromWishlist(bookId);
                // console.log("Kết quả từ API:", response);

                // Nếu API trả về thành công
                if (response.status === 200) {
                    this.isInWishlist = false;
                    this.toast.add({
                        severity: "success",
                        summary: "Thành công",
                        detail: "Sách đã bị xóa khỏi danh sách yêu thích.",
                        life: 3000,
                    });
                }
            } catch (error) {
                if (error.response) {
                    // console.error("Lỗi API:", error.response.data);

                    // Nếu lỗi 404
                    if (error.response.status === 404) {
                        this.toast.add({
                            severity: "warn",
                            summary: "Không tìm thấy",
                            detail: `Sách với ID ${bookId} không tồn tại trong danh sách yêu thích.`,
                            life: 3000,
                        });
                    }
                } else {
                    // console.error("Lỗi không xác định:", error);
                    this.toast.add({
                        severity: "error",
                        summary: "Lỗi",
                        detail: "Không thể kết nối với server.",
                        life: 3000,
                    });
                }
            }
        },


        async updateWishlist() {
            try {
                const response = await WishlistService.getWishlist();
                this.wishlist = response.data; // Cập nhật danh sách yêu thích
                // console.log("Danh sách yêu thích được cập nhật:", this.wishlist);
            } catch (error) {
                // console.error("Lỗi khi lấy danh sách yêu thích:", error);
            }
        },


        async toggleWishlist(bookId) {
            if (this.isInWishlist) {
                await this.removeFromWishlist(bookId); 
            } else {
                await this.addToWishlist(bookId); 
            }
            await this.checkWishlistStatus(bookId); 
        },

        async checkWishlistStatus(bookId) {
            try {
                const response = await WishlistService.getWishlist(); 

                this.isInWishlist = response.data.some(item => Number(item.book_id) === Number(bookId));
                // console.log('isInWishlist sau khi kiểm tra:', this.isInWishlist);
            } catch (error) {
                // console.error('Lỗi khi kiểm tra trạng thái yêu thích:', error);
            }
        },




        increaseQuantity() {
            if (this.book.quantity > 0 && this.quantity < this.book.quantity) {
                this.quantity++;
            } else if (this.book.quantity === 0) {
                this.toast.add({
                    severity: "warn",
                    summary: "Thông báo",
                    detail: "Sản phẩm đã hết hàng.",
                    life: 3000,
                });
            }
        },

        decreaseQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },

    },

};
</script>

<style>
body {
    background-color: #fff;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type=number] {
    -moz-appearance: textfield;
}

.p-toast {
    font-size: 16px;
    background-color: #f8f9fa;
}

.p-toast-message {
    color: #495057;
}

.p-toast {
    z-index: 9999 !important; /* Đảm bảo toast không bị ẩn */
    position: fixed !important;
    top: 20px;
    right: 20px;
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
    width: 500px;
    /* Chiều rộng tối đa cho thẻ */
    padding: 20px;
    height: 200px;
}

.book-title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #0f1214;
}

.book-price {
    font-size: 19px;
    color: #2e2b2b;
    margin-bottom: 20px;
}

.old-price {
    font-size: 16px;
    color: #888;
    text-decoration: line-through;
    margin-right: 10px;
}

.discounted-price {
    font-size: 19px;
    color: #f44336;
    font-weight: bold;
}

.quantity {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #888;
    font-size: 15px;
    text-align: right;
    /* Align text to the right */
    margin-bottom: 10px;
    /* Add some margin for better spacing */
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

.wishlist-button {
    background-color: white;
    border: 1px solid #ccc;
    color: #ccc;
    cursor: pointer;
    padding: 10px;
    transition: background-color 0.3s, color 0.3s;
}

.wishlist-button.active-wishlist {
    background-color: #f44336;
    color: white;
}

.wishlist-button i {
    margin-right: 5px;
}

.wishlist-button:hover {
    background-color: #f0f0f0;
}

.wishlist-button.active-wishlist:hover {
    background-color: #f44336;
}
</style>
