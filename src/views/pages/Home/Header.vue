<template>
    <div class="home-header">
        <!-- <div class="header-top">
            <div class="container">
                <a class="addres-star" href="#">TP.Hồ Chí Minh</a>
                <span class="header-links">
                    <a href="#">Bookish.vn</a>
                    <a href="#">App K0M0 +</a>
                    <a href="#">Phiếu Qùa Tặng Phương Nam</a>
                </span>
            </div>
        </div>

        <div class="divider"></div> -->

        <header class="header-botton">
            <div class="header-botton1">
                <div class="logo">
                    <img src="https://nhasachphuongnam.com/images/logos/269/LOGO_NHASACHPN-XMAS-for-Web-2024.png"
                        alt="Nhà Sách Phương Nam" @click="goToBookstore">
                </div>
                <div class="icon">
                    <div class="hidden-phone">
                        <router-link to="/wishlist" class="like">
                            <i class='bx bx-heart'></i>
                            <!-- Hiển thị số lượng nếu có -->
                            <!-- <span v-if="wishlistItemCount > 0" class="wishlist-count">{{ wishlistItemCount }}</span> -->
                        </router-link>

                        <a href="#" class="call">
                            <span><i class='bx bx-phone-call'></i></span> 1900 6656
                        </a>
                    </div>
                </div>
            </div>


            <div class="header-botton2">
                <div class="danhmuc">

                    <i class='bx bx-grid-alt' @click="ShowDrop">
                        <span>Danh Mục</span></i>

                </div>
                <div id="overlay" class="overlay" @click="closeDropdown"></div>

                <div class="dropd" v-if="drop">
                    <div class="span-column">
                        <span @click="selectCategory('categories')">Danh Mục</span>
                        <span @click="selectCategory('authors')">Tác Giả</span>
                        <span @click="selectCategory('publishers')">Nhà Xuất Bản</span>
                        <span @click="selectCategory('translators')">Dịch Giả</span>
                        <span @click="selectCategory('genres')">Thể Loại</span>
                        <span @click="selectCategory('languages')">Ngôn Ngữ</span>
                    </div>
                    <div class="divider-danhmuc"></div>

                    <div class="li-column">


                        <!-- Lọc theo Danh mục -->
                        <ul v-if="selectedCategory === 'categories'">
                            <li v-for="category in categories" :key="category.id">
                                <router-link :to="{ name: 'FilterBooks', query: { category_id: category.id } }"
                                    class="router-link">
                                    {{ category.name }}
                                </router-link>
                            </li>
                        </ul>

                        <!-- Lọc theo Tác giả -->
                        <ul v-if="selectedCategory === 'authors'">
                            <li v-for="author in authors" :key="author.id">
                                <router-link :to="{ name: 'FilterBooks', query: { author_id: author.id } }"
                                    class="router-link">
                                    {{ author.name }}
                                </router-link>
                            </li>
                        </ul>

                        <!-- Lọc theo Nhà Xuất Bản -->
                        <ul v-if="selectedCategory === 'publishers'">
                            <li v-for="publisher in publishers" :key="publisher.id">
                                <router-link :to="{ name: 'FilterBooks', query: { publisher_id: publisher.id } }"
                                    class="router-link">
                                    {{ publisher.name }}
                                </router-link>
                            </li>
                        </ul>

                        <!-- Lọc theo Dịch giả -->
                        <ul v-if="selectedCategory === 'translators'">
                            <li v-for="translator in translators" :key="translator.id">
                                <router-link :to="{ name: 'FilterBooks', query: { translator_id: translator.id } }"
                                    class="router-link">
                                    {{ translator.name }}
                                </router-link>
                            </li>
                        </ul>

                        <!-- Lọc theo Thể loại -->
                        <ul v-if="selectedCategory === 'genres'">
                            <li v-for="genre in genres" :key="genre.id">
                                <router-link :to="{ name: 'FilterBooks', query: { genre_id: genre.id } }"
                                    class="router-link">
                                    {{ genre.name }}
                                </router-link>
                            </li>
                        </ul>

                        <!-- Lọc theo Ngôn ngữ -->
                        <ul v-if="selectedCategory === 'languages'">
                            <li v-for="language in languages" :key="language.id">
                                <router-link :to="{ name: 'FilterBooks', query: { language_id: language.id } }"
                                    class="router-link">
                                    {{ language.name }}
                                </router-link>
                            </li>
                        </ul>

                    </div>
                </div>



                <div class="timkiem">
                    <input v-model="searchQuery" type="text" placeholder="Khôn ninh " />
                    <button @click="searchBooks" type="button" class="btn">
                        <i class='bx bx-search-alt-2'></i>
                    </button>

                </div>

                <div class="taikhoan">
                    <!-- Hiển thị biểu tượng tài khoản nếu chưa đăng nhập, nếu đã đăng nhập hiển thị tên người dùng -->
                    <i class='bx bx-user-circle' v-if="!user" @click="showuser">
                        <span>Tài Khoản</span></i>
                    <i class='bx bx-user-circle' v-if="user" @click="showuser">
                        <span>{{ user.name }}!</span> </i>

                    <div class="user-dropdown" v-if="dropuser">
                        <!-- Hiển thị tên người dùng nếu đã đăng nhập -->
                        <template v-if="isLoggedIn">
                            <h3 v-if="user">Xin chào, {{ user.name }}</h3>
                            <router-link to="/profile" class="account-link">Tài Khoản Của Tôi</router-link>
                            <router-link to="/cart" class="account-link">Xem Giỏ Hàng</router-link>
                            <router-link to="/order" class="account-link">Đơn Hàng Của Tôi</router-link>
                            <router-link to="/wishlist" class="account-link">Danh Sách Yêu Thích</router-link>
                            <div class="order-tracking">
                                <h6>Theo dõi đơn hàng của tôi</h6>
                                <div class="order-tracking-input">
                                    <input type="text" placeholder="ID đơn hàng/E-mail" />
                                    <button class="order-btn">➔</button>
                                </div>
                            </div>
                            <button @click="logout" class="logout-btn">Đăng xuất</button>
                        </template>

                        <!-- Nếu chưa đăng nhập -->
                        <template v-else>
                            <h3>Tài Khoản Của Tôi</h3>
                            <router-link to="/auth/login" class="login-btn">Đăng nhập</router-link>
                            <router-link to="/auth/register" class="register-btn">Đăng ký</router-link>
                        </template>
                    </div>
                </div>




                <div class="giohang">
                    <i class="bx bxs-cart" @click="showcart">
                        <span class="title">Giỏ Hàng</span></i>
                    <!-- Hiển thị số lượng sản phẩm trong giỏ hàng nếu có -->
                    <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>

                    <!-- Giỏ hàng dropdown -->
                    <div v-if="dropcart" class="cart-dropdown">
                        <h3>Sản phẩm trong giỏ hàng:</h3>
                        <ul>
                            <li v-for="item in cartItems" :key="item.id" class="cart-item">
                                <img :src="item.book.image" alt="Product Image" class="product-image" />
                                <div class="item-details">
                                    <span class="item-title">{{ item.book.title }}</span><br>
                                    <span class="item-quantity">{{ item.quantity }} x {{ formatCurrency(item.price)
                                        }}</span>
                                </div>

                            </li>
                        </ul>

                        <!-- Các nút điều hướng -->
                        <div class="btn-cart">
                            <button @click="goToCart">Xem giỏ hàng</button>
                            <button @click="checkout">Thanh toán</button>
                        </div>
                    </div>
                </div>


            </div>
        </header>
    </div>
</template>

<script>
import AttributeService from '@/service/AttributeService';
import AuthorService from '@/service/AuthorService';
import CartService from '@/service/CartService';
import CategoryService from '@/service/CategoryService';
import PublisherService from '@/service/PublisherService';
import TranslatorService from '@/service/TranslatorService';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default {
    name: "HeaderComponent",
    setup() {
        const searchQuery = ref(''); // Make searchQuery reactive
        const router = useRouter();
        const cartItems = ref([]);

        const dropuser = ref(false);
        const drop = ref(false);
        const dropcart = ref(false);

        const cartItemCount = ref(0); // Thêm biến này để lưu số lượng sản phẩm trong giỏ hàng
        const selectedCategory = ref(""); // Dùng để lưu trữ danh mục được chọn
        const selectedAuthor = ref(""); // Dùng để lưu trữ danh mục được chọn

        const categories = ref([]);
        const authors = ref([]);
        const publishers = ref([]);
        const translators = ref([]);
        const genres = ref([]);
        const languages = ref([]);

        // const wishlistItemCount = ref(0); // Biến này lưu trữ số lượng sách yêu thích

        // // Hàm lấy danh sách yêu thích và cập nhật số lượng
        // const loadWishlist = async () => {
        //     try {
        //         const response = await WishlistService.getWishlist();
        //         wishlistItemCount.value = wishlist.length; // Cập nhật số lượng sách yêu thích
        //     } catch (error) {
        //         console.error("Error loading wishlist:", error);
        //     }
        // };

        const isLoggedIn = ref(false);
        const user = ref(null);


        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = localStorage.getItem("access_token");

        const ShowDrop = () => {
            // Nếu dropdown tài khoản (dropuser) đang mở thì tắt nó
            if (dropuser.value) {
                dropuser.value = false;
            }

            // Nếu dropdown giỏ hàng (dropcart) đang mở thì tắt nó
            if (dropcart.value) {
                dropcart.value = false;
            }

            // Chuyển trạng thái hiển thị dropdown danh mục
            drop.value = !drop.value;
            // console.log("Dropdown visible:", drop.value);
        };

        const showcart = () => {
            // Tắt dropdown tài khoản nếu nó đang mở
            if (dropuser.value) {
                dropuser.value = false;
            }

            // Tắt dropdown danh mục nếu nó đang mở
            if (drop.value) {
                drop.value = false;
            }

            // Chuyển trạng thái hiển thị dropdown giỏ hàng
            dropcart.value = !dropcart.value;

            if (currentUser) {
                // console.log("Giỏ hàng hiển thị:", dropcart.value);
            } else {
                this.$router.push({ name: 'login' });
            }

        }


        const showuser = () => {
            // Tắt dropdown giỏ hàng nếu nó đang mở
            if (dropcart.value) {
                dropcart.value = false;
            }

            // Tắt dropdown danh mục nếu nó đang mở
            if (drop.value) {
                drop.value = false;
            }

            // Chuyển trạng thái hiển thị dropdown tài khoản
            dropuser.value = !dropuser.value;
        };
        const goToBookstore = () => {
            router.push({ name: "bookstore" }); // Navigate to the bookstore route
        };

        const loadCategories = async () => {
            try {
                const response = await CategoryService.getAllCategories();
                categories.value = response.data;
            } catch (error) {
                // console.error("Error loading categories:", error);
            }
        };

        const loadAuthors = async () => {
            try {
                const response = await AuthorService.getAllAuthors();
                authors.value = response.data;
            } catch (error) {
                // console.error("Error loading authors:", error);
            }
        };

        const loadPublishers = async () => {
            try {
                const response = await PublisherService.getAllPublishers();
                publishers.value = response.data;
            } catch (error) {
                // console.error("Error loading publishers:", error);
            }
        };

        const loadTranslators = async () => {
            try {
                const response = await TranslatorService.getAllTranslators();
                translators.value = response.data;
            } catch (error) {
                // console.error("Error loading translators:", error);
            }
        };

        const loadGenres = async () => {
            try {
                const response = await AttributeService.getAllGenres();
                genres.value = response.data;
            } catch (error) {
                // console.error("Error loading genres:", error);
            }
        };

        const loadLanguages = async () => {
            try {
                const response = await AttributeService.getAllLanguages();
                languages.value = response.data;
                // console.log("Languages loaded:", languages.value);
            } catch (error) {
                // console.error("Error loading languages:", error);
            }
        };

        const API_URL = 'http://127.0.0.1:8000/api/auth';

        const checkLoginStatus = () => {
            const currentUser = localStorage.getItem("currentUser");
            // console.log('line 156:', currentUser)
            if (currentUser) {
                isLoggedIn.value = true;
                user.value = JSON.parse(currentUser);
            } else {
                isLoggedIn.value = false;
                user.value = null;
            }
        };

        const logout = async () => {
            try {
                const currentUser = localStorage.getItem("currentUser");
                if (!currentUser) {
                    // alert("Phiên đăng nhập không tồn tại, vui lòng đăng nhập lại.");
                    router.push({ name: "bookstore" });
                    return;
                }

                const token = localStorage.getItem("access_token");

                await axios.post(
                    `${API_URL}/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                localStorage.removeItem("currentUser");
                isLoggedIn.value = false;
                user.value = null;
                //alert("Bạn đã đăng xuất thành công!");
                router.push({ name: "bookstore" });
            } catch (error) {
                if (error.response?.status === 401) {
                    // alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
                    localStorage.removeItem("currentUser");
                    router.push({ name: "bookstore" });
                    window.location.reload();
                } else {
                    // console.error("Lỗi không xác định:", error);
                    // alert("Đăng xuất không thành công. Vui lòng thử lại.");
                }
            }
        };

        const loadCart = async () => {
            try {
                const response = await CartService.getCart();
                // console.log(response)
                cartItems.value = response ? response.cart.items : [];
                // console.log("cartItems:", cartItems, cartItems.value)
                cartItemCount.value = cartItems.value.reduce((total, item) => total + item.quantity, 0);
            } catch (error) {
                // console.log('215:', error)
            }
        };

        const goToCart = () => {
            window.location.href = '/cart';
        };

        const checkout = () => {
            window.location.href = '/checkout';
        };

        const searchBooks = () => {
            // console.log("Button clicked! Search query:", searchQuery.value);
            if (!searchQuery.value.trim()) {
                alert("Vui lòng nhập từ khóa tìm kiếm!");
                return;
            }
            // console.log("Navigating to search results...");
            router.push({ name: "SearchResults", query: { query: searchQuery.value } })
                .then(() => {
                    console.log("Successfully navigated to search results.");
                })
                .catch((error) => {
                    console.error("Error during navigation:", error);
                });
        };

        onMounted(() => {
            loadCart();
            loadCategories();
            loadAuthors();
            loadPublishers();
            loadTranslators();
            loadGenres();
            loadLanguages();
            checkLoginStatus();
        });

        const showSthing = ref("true")
        // Thêm hàm để xử lý sự kiện chọn danh mục
        const selectCategory = (category) => {
            selectedCategory.value = category;
            showSthing.value = false;

        };

        const selectAuthor = (author) => {
            selectedAuthor.value = author;
            showSthing.value = false;

            // Nếu có logic riêng cho tác giả, xử lý tại đây
        };

        // Hàm định dạng giá trị thành tiền tệ
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN').format(amount);
        };
        return {
            formatCurrency,
            // wishlistItemCount: 0,  // Khai báo biến để lưu trữ số lượng sách yêu thích
            searchQuery,
            searchBooks,
            showSthing,
            goToBookstore,
            drop,
            ShowDrop,
            cartItems,
            goToCart,
            checkout,
            dropcart,
            showcart,
            dropuser,
            showuser,
            cartItemCount,
            isLoggedIn,
            currentUser,
            token,
            user,
            logout,
            languages,
            genres,
            translators,
            publishers,
            categories,
            authors,
            selectedCategory,
            selectCategory, // Trả về hàm để sử dụng trong template
            selectedAuthor,
            selectAuthor
        };
    }
};
</script>


<style>
.wrapper-header {
    background-color: #f8f9fa;
    color: #42596d;
    font-size: 15px;
    padding: 5px 0;
    position: sticky;
    /* Đặt vị trí sticky */
    top: 0;
    /* Đảm bảo nó dính lên đầu khi cuộn */
    z-index: 1000;
    /* Đảm bảo header luôn ở trên các phần tử khác */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    /* Thêm bóng đổ để nổi bật */
}

.header-top .container {
    width: 90%;
    height: 30px;
    /* background-color: blueviolet; */
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    font-size: 16px;
    /* margin-left: 70px;
    margin-right: 70px; */
}

.header-top a {
    margin-right: 15px;
    text-decoration: none;
    color: #333536;

}

.header-top a:hover {
    text-decoration: underline;
}

.header-botton {
    /* background-color: aqua; */
    margin: 0 auto;

}

/* .home-header {
    position: sticky;
    top: 0;
    z-index: 99;
} */

.header-botton1 {
    /* background-color: #42596d; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 30px;
    margin-left: 50px;
    margin-right: 50px;
    height: 80px;
}

.header-botton1 .logo img {
    height: 70px;
    padding-left: 55px;
}

.header-botton1 .hidden-phone {
    font-size: 20px;
    padding-right: 55px;


}

.header-botton1 .call {
    color: #0a0b0c;
    text-decoration: none;
    font-weight: 600;
    font-size: 17px;

}

.header-botton1 i {
    color: #6c757d;
    font-size: 30px;
    padding-right: 5px;

}

.header-botton2 {
    background-color: #034784;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 20px;
    height: 60px;


}

.header-botton2 i {
    padding-right: 10px;
    font-size: 30px;
    padding-bottom: 10px;
    align-items: end;
    color: white;

}

.header-botton2 .timkiem {
    width: 100%;
    max-width: 500px;
    background-color: rgb(247, 247, 247);
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 0px 2px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;

}

.timkiem input {
    background: transparent;
    flex: 1;
    border: 0;
    outline: none;
    font-size: 20px;
}

.timkiem button i {
    width: 30px;
    color: #6c757d;
}

.timkiem button {
    border: 0;
    border-radius: 30%;
    background: transparent;


}

.wishlist-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 5px;
    font-size: 12px;
}

.danhmuc i {
    font-size: 28px;
    font-family: uni2-icons, sans-serif;
    color: rgb(198, 201, 224);
    cursor: pointer;
    display: inline-flex;
    /* Đảm bảo rằng icon và chữ đều là inline-flex */
    align-items: center;
    /* Căn chỉnh icon và chữ theo chiều dọc */
    font-weight: 400;
}

.danhmuc i span {
    font-size: 18px;
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 600;
    color: rgb(255, 255, 255);
    text-transform: uppercase;
    /* Chuyển tất cả thành chữ hoa */
    margin-left: 8px;
    /* Thêm khoảng cách giữa icon và chữ */
}

/* Dropdown menu styling */
.dropd {
    display: flex;
    position: absolute;
    left: 80px;
    top: 140px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    width: 800px;
    z-index: 1000;
    transition: all 0.3s ease;
    text-align: center;
    z-index: 9999;
    /* Giá trị rất cao để đảm bảo không bị đè lên */

}

.dropd .divider-danhmuc {
    width: 1px;
    background-color: #6c6bc2;
    /* Màu sắc của đường gạch */
    margin: 0 15px;
    /* Khoảng cách bên trái và bên phải của đường gạch */
}

/* Styling for the columns inside the dropdown */
.dropd .span-column,
.dropd .li-column {
    flex: 1;
    /* Equal width for both columns */
    padding: 10px;
}

.drop .span-column {
    border-right: 3px dashed #999;
    /* Đường thẳng phân cách */

}

/* Styling for individual span items */
.dropd .span-column span {
    display: block;
    padding: 10px 15px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;

}

/* Hover effect for span items */
.dropd .span-column span:hover {
    background-color: #034784;
    /* Blue background on hover */
    color: white;
    transform: translateX(5px);
    /* Slight right shift on hover */
}

/* Hover effect for li items */
.dropd .li-column li {
    padding: 10px 15px;
    cursor: pointer;
    background-color: #ffffff;
    border-bottom: 1px solid #eaeaea;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.dropd .li-column li:hover {
    background-color: #f1f1f1;
    transform: translateX(5px);
    /* Slight right shift on hover */
}

/* Adjusting padding for dropdown items */
.dropd .span-column span,
.dropd .li-column li {
    border-radius: 6px;
    padding: 8px 16px;
}



/* Mobile responsiveness */
@media (max-width: 768px) {
    .dropd {
        width: 90%;
        /* Make dropdown take up more width on smaller screens */
        left: 5%;
        display: block;
    }

    .dropd .span-column,
    .dropd .li-column {
        flex: none;
        width: 100%;
    }

    .dropd .divider {
        display: none;
        /* Hide divider on small screens */
    }
}




.divider {
    margin: 20px auto;
    width: 100%;
    border-bottom: 1px solid #9b9a9e;
}



.taikhoan {
    position: relative;
    /* Đảm bảo form định vị theo phần tử này */
}

.taikhoan i {
    font-size: 28px;
    font-family: uni2-icons, sans-serif;
    color: rgb(198, 201, 224);
    cursor: pointer;
    display: inline-flex;
    /* Đảm bảo rằng icon và chữ đều là inline-flex */
    align-items: center;
    /* Căn chỉnh icon và chữ theo chiều dọc */
    font-weight: 400;
}

.taikhoan i span {
    font-size: 18px;
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 600;
    color: rgb(255, 255, 255);
    text-transform: uppercase;
    /* Chuyển tất cả thành chữ hoa */
    margin-left: 8px;
    /* Thêm khoảng cách giữa icon và chữ */
}

.user-dropdown {
    position: absolute;
    top: 49px;
    right: -150px;
    width: 350px;
    padding: 15px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    z-index: 9999;
    /* Giá trị rất cao để đảm bảo không bị đè lên */

}

.user-dropdown h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.account-link {
    display: block;
    color: #034784;
    margin: 8px 0;
    text-decoration: none;
    font-size: 16px;
}

.order-tracking {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px 0;
}

.order-tracking h6 {
    margin-bottom: 5px;
    /* Khoảng cách bên dưới nhãn */
}

.order-tracking-input {
    display: flex;
    /* Căn ô nhập và nút trên một dòng */
    width: 100%;
}

h3 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
}

.order-tracking input {
    flex: 1;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    /* Bo góc trái */
    outline: none;
}

.order-btn {
    padding: 5px 10px;
    background-color: #ddd;
    border: 1px solid #ddd;
    border-left: none;
    /* Bỏ đường viền trái để nối liền với ô nhập */
    border-radius: 0 4px 4px 0;
    /* Bo góc phải */
    cursor: pointer;
}

.account-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.login-btn,
.register-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    margin-left: 50px;
}

.login-btn {
    background-color: #333;
    color: white;
}

.register-btn {
    background-color: #034784;
    color: white;
}

.logout-btn {
    background-color: #d42d2d;
    color: white;
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    margin-left: 90px;
    text-align: center;
}

.giohang {
    position: relative;
    cursor: pointer;
}

.giohang i {
    font-size: 28px;
    font-family: uni2-icons, sans-serif;
    color: rgb(198, 201, 224);
    cursor: pointer;
    display: inline-flex;
    /* Đảm bảo rằng icon và chữ đều là inline-flex */
    align-items: center;
    /* Căn chỉnh icon và chữ theo chiều dọc */
    font-weight: 400;
}

.giohang i span {
    font-size: 18px;
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 600;
    color: rgb(255, 255, 255);
    text-transform: uppercase;
    /* Chuyển tất cả thành chữ hoa */
    margin-left: 8px;
    /* Thêm khoảng cách giữa icon và chữ */
}

.cart-dropdown {
    width: 400px;
    height: auto;
    position: absolute;
    top: 47px;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    z-index: 9999;
    /* Giá trị rất cao để đảm bảo không bị đè lên */


}

.cart-dropdown .btn-cart button {
    width: 48%;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: inline-block;
}

.cart-dropdown .btn-cart button:first-child {
    background-color: #034784;
    color: white;
}

.cart-dropdown .btn-cart button:last-child {
    background-color: #333;
    color: white;
}

.cart-dropdown .btn-cart {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.cart-count {
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 8px;
    font-size: 12px;
    position: absolute;
    top: -10px;
    right: 95px;
}

.cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.product-image {
    width: 40px;
    /* Fixed width for the image */
    height: 40px;
    /* Fixed height for the image */
    object-fit: cover;
    /* Ensures the image maintains aspect ratio */
    margin-right: 10px;
    /* Space between image and text */
}

.item-details {
    display: flex;
    flex-direction: column;
}

.item-title {
    font-weight: bold;
}

.item-quantity {
    color: gray;
}

.btn-cart {
    background-color: #f6f6f6;
}
</style>
