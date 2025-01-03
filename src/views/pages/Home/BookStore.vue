<template>
    <div class="wrapper">
        <Toast />

        <HeaderComponent />

        <div class="home-body">
            <div class="banner">
                <div class="list">
                    <div class="item-1 ">
                        <img src="https://nhasachphuongnam.com/images/promo/294/Banner-L%E1%BB%8Bch-2025-890x396.jpg"
                            alt="">
                    </div>
                    <a class="item-2 " href="http://localhost:5173/books/20">
                        <img src="https://nhasachphuongnam.com/images/promo/287/1.jpg" alt="">
                    </a>
                    <a class="item-3 " href="http://localhost:5173/books/21">
                        <img src="https://nhasachphuongnam.com/images/promo/287/2.jpg" alt="">
                    </a>
                </div>

                <div class="list-1">
                    <div class="item-4 ">
                        <img src="https://nhasachphuongnam.com/images/promo/279/1__3_.jpg" alt="">
                    </div>
                    <a class="item-5 " href="http://localhost:5173/books/22">
                        <img src="https://nhasachphuongnam.com/images/promo/279/2__3_.jpg" alt="">
                    </a>
                    <a class="item-6 " href="http://localhost:5173/books/24">
                        <img src="https://nhasachphuongnam.com/images/promo/279/3__4_.jpg" alt="">
                    </a>
                    <a class="item-7 " href="http://localhost:5173/books/23">
                        <img src="https://nhasachphuongnam.com/images/promo/296/Banner-S%E1%BB%A8-%C4%90O%C3%80N-IWAKURA-%C4%91%E1%BA%A1t-gi%E1%BA%A3i-288x187.jpg"
                            alt="">
                    </a>
                </div>

                <div class="list-2">
                    <!-- <div class="item-8">
                        <img src="https://nhasachphuongnam.com/images/promo/274/block_2.jpg" alt="" class="">
                    </div> -->
                    <div class="item-9">
                        <img src="https://nhasachphuongnam.com/images/promo/295/Vouchers---20241106-20.png  " alt=""
                            class="">
                    </div>
                    <!-- <div class="item-10">
                        <img src="https://nhasachphuongnam.com/images/promo/274/block_1.jpg" alt="" class="">
                    </div> -->
                    <div class="item-11">
                        <img src="https://nhasachphuongnam.com/images/promo/295/Vouchers---20241106-30.png" alt=""
                            class="">
                    </div>
                    <div class="item-12">
                        <img src="https://nhasachphuongnam.com/images/promo/295/Vouchers---20241106-50.png" alt=""
                            class="">
                    </div>
                </div>
            </div>

            <div class="bestsellers">
                <h4 class="textsell">Bestsellers</h4>
                <!-- <div class="textsell-2">
                    <a href="">Phương Nam Book</a>
                    <a href="">English Books</a>
                    <a href="">Văn Học</a>
                    <a href="">Kỹ Năng</a>
                    <a href="">Kinh Tế</a>
                    <a href="">Thiếu Nhi</a>
                </div> -->
                <div class="product-list-sell">
                    <router-link v-for="book in bestsellerBooks" :key="book.id"
                        :to="{ name: 'bookdetails', params: { id: book.id } }" class="product-card-sell">

                        <div class="cart-icon-sell"></div>
                        <img :src="book.image" alt="Product Image" class="product-image">
                        <p class="product-name-sell">{{ book.title }}</p>

                        <p v-if="book.discount_price" class="product-price-sell discounted-price">
                            {{ formatCurrency(book.discount_price) }} đ
                        </p>

                        <p v-if="book.discount_price" class="product-price-sell original-price">
                            {{ formatCurrency(book.original_price) }} đ
                        </p>

                        <p v-else class="product-price-sell normal-price">
                            {{ formatCurrency(book.original_price) }} đ
                        </p>

                        <button class="product-button-sell" v-if="book.quantity > 0"
                            @click.prevent="addToCart(book.id)">
                            <i class="bx bxs-cart"></i>Chọn Mua
                        </button>


                        <p v-if="book.quantity === 0" class="out-of-stock">Hết hàng</p>


                    </router-link>
                </div>
            </div>

            <div class="vietnambook">
                <h4 class="textvnbook">Sách Tiếng Việt</h4>
                <!-- <div class="textvn-2">
                    <a href="">Văn Học</a>
                    <a href="">Kinh Tế</a>
                    <a href="">Kỹ Năng</a>
                    <a href="">Thiếu Nhi</a>
                    <a href="">Tuổi Mới Lớn</a>
                </div> -->
                <div class="product-list-sell-1">
                    <router-link v-for="book in books" :key="book.id"
                        :to="{ name: 'bookdetails', params: { id: book.id } }" class="product-card-sell-1">

                        <div class="cart-icon-sell"></div>
                        <img :src="book.image" alt="Product Image" />
                        <p class="product-name-sell">{{ book.title }}</p>

                        <!-- Hiển thị giá -->
                        <p v-if="book.discount_price" class="product-price-sell discounted-price">
                            {{ formatCurrency(book.discount_price) }} đ
                        </p>
                        <p v-if="book.discount_price" class="product-price-sell original-price">
                            {{ formatCurrency(book.original_price) }} đ
                        </p>
                        <p v-else class="product-price-sell normal-price">
                            {{ formatCurrency(book.original_price) }} đ

                        </p>
                        <button class="product-button-sell" v-if="book.quantity > 0"
                            @click.prevent="addToCart(book.id)">
                            <i class="bx bxs-cart"></i>Chọn Mua
                        </button>
                        <p v-if="book.quantity === 0" class="out-of-stock">Hết hàng</p>



                    </router-link>

                </div>

            </div>


            <!-- <div class="icon-container-1">
                <div v-for="publisher in publishers" :key="publisher.id" class="icon-item">
                    <img v-if="publisher.image" :src="publisher.image" alt="Publisher Image" class="publisher-image" />
                    <p>{{ publisher.name }}</p>
                </div>
            </div> -->

            <div class="textbook">
                <h5 class="textbook-1">Sách Tình Cảm</h5>
                <!-- <div class="textbook-2">
                    <a href="">Bộ Chân Trời Sáng Tạo</a>
                    <a href="">Bộ Cánh Diều Vàng</a>
                    <a href="">Bộ Kết Nối Tri Thức</a>
                    <a href="">Sách Tiếng Anh</a>
                    <a href="">Sách Tham Khảo</a>
                </div> -->
                <div class="product-list-sell">
                    <router-link v-for="book in loveBooks" :key="book.id"
                        :to="{ name: 'bookdetails', params: { id: book.id } }" class="product-card-sell">

                        <div class="cart-icon-sell"></div>
                        <img :src="book.image" alt="Product Image" class="product-image">
                        <p class="product-name-sell">{{ book.title }}</p>

                        <!-- Hiển thị giá -->
                        <p v-if="book.discount_price" class="product-price-sell discounted-price">
                            {{ formatCurrency(book.discount_price) }} đ
                        </p>
                        <p v-if="book.discount_price" class="product-price-sell original-price">
                            {{ formatCurrency(book.original_price) }} đ
                        </p>
                        <p v-else class="product-price-sell normal-price">
                            {{ formatCurrency(book.original_price) }} đ

                        </p>

                        <button class="product-button-sell" v-if="book.quantity > 0"
                            @click.prevent="addToCart(book.id)">
                            <i class="bx bxs-cart"></i>Chọn Mua
                        </button>
                        <p v-if="book.quantity === 0" class="out-of-stock">Hết hàng</p>


                    </router-link>
                </div>
            </div>
            <div class="pic">
                <img src="https://nhasachphuongnam.com/images/promo/292/0655fcef07fca1a2f8ed.jpg" alt="" class="">
                <img src="https://nhasachphuongnam.com/images/promo/277/4__3_.jpg" alt="" class="">
                <img src="https://nhasachphuongnam.com/images/promo/277/1__2_.jpg" alt="" class="">
                <img src="https://nhasachphuongnam.com/images/promo/277/3__3_.jpg" alt="" class="">

            </div>
            <div class="englishbook">
                <h5 class="texteng-1">English Books</h5>
                <!-- <div class="texteng-2">
                    <a href="">Children</a>
                    <a href="">Fiction</a>
                    <a href="">Business</a>
                    <a href="">Self-help</a>
                </div> -->
                <div class="product-list-sell">
                    <router-link v-for="book in englishBooks" :key="book.id"
                        :to="{ name: 'bookdetails', params: { id: book.id } }" class="product-card-sell">

                        <div class="cart-icon-sell"></div>
                        <img :src="book.image" alt="Product Image" class="product-image">
                        <p class="product-name-sell">{{ book.title }}</p>

                        <p v-if="book.discount_price" class="product-price-sell discounted-price">
                            {{ formatCurrency(book.discount_price) }} đ
                        </p>
                        <p v-if="book.discount_price" class="product-price-sell original-price">
                            {{ formatCurrency(book.original_price) }} đ
                        </p>
                        <p v-else class="product-price-sell normal-price">
                            {{ formatCurrency(book.original_price) }} đ

                        </p>
                        <button class="product-button-sell" v-if="book.quantity > 0"
                            @click.prevent="addToCart(book.id)">
                            <i class="bx bxs-cart"></i>Chọn Mua
                        </button>
                        <p v-if="book.quantity === 0" class="out-of-stock">Hết hàng</p>


                    </router-link>
                </div>
                <!-- <div class="btn-more">
                    <button class="see-more">Xem Thêm</button>
                </div> -->
            </div>

            <div class="icon-container-2">
                <div class="icon-item-2">
                    <img src="https://nhasachphuongnam.com/images/promo/246/harry_potter_1.png" alt="">
                </div>
                <div class="icon-item-2">
                    <img src="https://nhasachphuongnam.com/images/promo/246/wimpy_kid_8561-gz.png" alt="">
                </div>
                <div class="icon-item-2">
                    <img src="https://nhasachphuongnam.com/images/promo/246/captain_underpants_f1r7-lf.png" alt="">
                </div>
                <div class="icon-item-2">
                    <img src="https://nhasachphuongnam.com/images/promo/246/bad_guys_1.png" alt="">
                </div>
                <div class="icon-item-2">
                    <img src="https://nhasachphuongnam.com/images/promo/246/marvel_c14u-wb.png" alt="">
                </div>
                <div class="icon-item-2">
                    <img src="https://nhasachphuongnam.com/images/promo/246/dog_man_udso-pa.png" alt="">
                </div>
                <div class="icon-item-2">
                    <img src="https://nhasachphuongnam.com/images/promo/246/geronimo_stilton_xjpn-km.png" alt="">
                </div>
                <div class="icon-item-2">
                    <img src="https://nhasachphuongnam.com/images/promo/246/guinness_ehg1-hd.png" alt="">
                </div>
            </div>


            <div class="pic-1">
                <img src="https://nhasachphuongnam.com/images/promo/279/Banners-T%E1%BA%ADp---V%E1%BB%9F-H%E1%BB%8Dc-Sinh-590x300.jpg"
                    alt="" class="">
                <img src="https://nhasachphuongnam.com/images/promo/279/Banners-VPP-590x300.jpg" alt="" class="">
            </div>


            <div class="connect">
                <span class="text-conn">Giữ Kết Nối</span>
                <div class="connect-form">
                    <input type="email" class="email-input" placeholder="Nhập địa chỉ email">
                    <button class="btn-conn"><i class='bx bxs-right-arrow'></i></button>
                </div>

            </div>

        </div>
    </div>
    <button id="scroll-to-top" class="scroll-to-top" @click="scrollToTop">
        ^
    </button>
    <FooterComponent />
</template>

<script>
import BookService from '@/service/BookService';
import PublisherService from '@/service/PublisherService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';


import { useRouter } from 'vue-router';
import CartService from '/src/service/CartService.js';

export default {
    name: 'bookstores',
    components: {
        HeaderComponent,
        FooterComponent,
    },
    setup() {
        const router = useRouter();
        const currentUser = ref(null);
        const books = ref([]);
        const bestsellerBooks = ref([]);
        const loveBooks = ref([]);
        const toast = useToast();
        const publishers = ref([]);
        const englishBooks = ref([]);

        const addToCart = async (bookId) => {
            try {
                await CartService.addToCart(bookId, 1);
                toast.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Sản phẩm đã được thêm vào giỏ hàng',
                    life: 3000
                }); window.location.reload();

            } catch (error) {
                router.push({ name: 'login' });
            }
        };

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN').format(amount);
        };

        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        onMounted(async () => {
            window.addEventListener('scroll', () => {
                const scrollButton = document.getElementById('scroll-to-top');
                if (window.scrollY > 100) {
                    scrollButton.style.display = 'block';
                } else {
                    scrollButton.style.display = 'none';
                }
            });

            try {
                currentUser.value = JSON.parse(localStorage.getItem('currentUser'));
                console.log('Thông tin người dùng:', currentUser.value);

                const response = await BookService.getAllBooks();
                books.value = response.data;

                loveBooks.value = books.value.filter(book => book.id >= 16 && book.id <= 19);

                bestsellerBooks.value = books.value.filter(book => book.id >= 10 && book.id <= 14);

                const publisherResponse = await PublisherService.getAllPublishers();
                publishers.value = publisherResponse.data;

                englishBooks.value = books.value.filter(book => book.id >= 20 && book.id <= 24);


            } catch (error) {
                // console.error('Lỗi khi tải danh sách sách hoặc nhà xuất bản:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Có lỗi xảy ra khi tải dữ liệu.',
                    life: 3000
                });
            }
        });

        return {
            scrollToTop,
            formatCurrency,
            books,
            loveBooks,
            bestsellerBooks,
            addToCart,
            currentUser,
            publishers,
            englishBooks, // Trả về biến sách tiếng Anh
        };
    },
};
</script>



<style>
@import "../Home/style.css";
</style>
