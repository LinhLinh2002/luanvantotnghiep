<template>
    <div class="home-header">
        <div class="header-top">
            <div class="container">
                <a class="addres-star" href="#">TP.Hồ Chí Minh</a>
                <span class="header-links">
                    <a href="#">Bookish.vn</a>
                    <a href="#">App K0M0 +</a>
                    <a href="#">Phiếu Qùa Tặng Phương Nam</a>
                </span>
            </div>
        </div>

        <div class="divider"></div>

        <header class="header-botton">
            <div class="header-botton1">
                <div class="logo">
                    <img src="https://nhasachphuongnam.com/images/logos/269/LOGO_NHASACHPN-XMAS-for-Web-2024.png"
                        alt="Nhà Sách Phương Nam" @click="goToBookstore">
                </div>
                <div class="icon">
                    <div class="hidden-phone">
                        <a href="" class="like">
                            <i class='bx bx-heart'></i>
                        </a>
                        <a href="#" class="call">
                            <span><i class='bx bx-phone-call'></i></span> 1900 6656
                        </a>
                    </div>
                </div>
            </div>


            <div class="header-botton2">
                <div class="danhmuc">

                    <i class='bx bx-grid-alt' @click="ShowDrop"></i>

                </div>
                <ul class="dropd" v-if="drop">
                    <span>Danh Muc 
                        <li v-for="category in categories" :key="category.id">
                        {{ category.name }}
                    </li>
                    </span>
                    <span>Tác Giả
                        <li v-for="author in authors " :key="author.id">
                            {{ author.name }}
                        </li>
                    </span>
                </ul>

                <div class="timkiem">
                    <input type="text" placeholder="Muôn kiếp nhân sinh" />
                    <button type="submit" class="btn"><i class='bx bx-search-alt-2'></i></button>
                </div>

                <div class="taikhoan">
                    <i class='bx bx-user-circle' @click="showuser"></i>
                    <div class="user-dropdown" v-if="dropuser">
                        <!-- Hiển thị tên người dùng nếu đã đăng nhập -->
                        <template v-if="isLoggedIn">
                            <h3 v-if="user">Xin chào, {{ user.name }}</h3>
                            <router-link to="/profile" class="account-link">Tài Khoản Của Tôi </router-link>

                            <router-link to="/order" class="account-link">Đơn Hàng Của Tôi </router-link>
                            <router-link to="/" class="account-link">Danh Sách Yêu Thích </router-link>
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
                    <i class="bx bxs-cart" @click="showcart"></i>
                    <!-- Hiển thị số lượng sản phẩm trong giỏ hàng nếu có -->
                    <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>

                    <!-- Giỏ hàng dropdown -->
                    <div v-if="dropcart" class="cart-dropdown">
                        <h3>Sản phẩm trong giỏ hàng:</h3>
                        <ul>
                            <li v-for="item in cartItems" :key="item.id">
                                <img :src="item.book.image" alt="Product Image" class="product-image" />
                                {{ item.book.title }} - {{ item.quantity }} x {{ item.price }}
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
import CartService from '@/service/CartService';
import CategoryService from '@/service/CategoryService';
import AuthorService from '@/service/AuthorService';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
    name: "HeaderComponent",
    setup() {
        const router = useRouter();
        const drop = ref(false);
        const cartItems = ref([]);
        const dropcart = ref(false);
        const cartItemCount = ref(0); // Thêm biến này để lưu số lượng sản phẩm trong giỏ hàng

        const categories = ref([]);
        const authors = ref([]);

        const dropuser = ref(false);
        const isLoggedIn = ref(false);
        const user = ref(null);

        const ShowDrop = () => {
            drop.value = !drop.value;
            console.log("Dropdown visible:", drop.value);
        };
        const showcart = () => {
            dropcart.value = !dropcart.value;
            console.log("Giỏ hàng hiển thị:", dropcart.value);
        };
        const showuser = () => {
            dropuser.value = !dropuser.value;
        }
        const goToBookstore = () => {
            router.push({ name: "bookstore" }); // Navigate to the bookstore route
        };
        const loadCategories = async () => {
            try {
                const response = await CategoryService.getAllCategories();
                categories.value = response.data;  // Gán đúng dữ liệu trả về từ API
                console.log("Categories loaded:", categories.value);  // Kiểm tra xem danh mục có được tải về không
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        const loadAuthors = async () => {
            try {
                const response = await AuthorService.getAllAuthors();
                categories.value = response.data;  // Gán đúng dữ liệu trả về từ API
                console.log("Authors loaded:", authors.value);  // Kiểm tra xem danh mục có được tải về không
            } catch (error) {
                console.error("Error loading authors:", error);
            }
        };

        // URL API
        const API_URL = 'http://127.0.0.1:8000/api/auth';

        // Kiểm tra trạng thái đăng nhập
        const checkLoginStatus = () => {
            const currentUser = localStorage.getItem("currentUser");
            console.log('line 156:', currentUser)
            if (currentUser) {
                isLoggedIn.value = true;
                user.value = JSON.parse(currentUser);  // Lấy thông tin người dùng từ localStorage
            } else {
                isLoggedIn.value = false;
                user.value = null;
            }
        };

        // Hàm đăng xuất
        const logout = async () => {
            try {
                const currentUser = localStorage.getItem("currentUser");
                console.log('line 169:', currentUser)
                if (!currentUser) {
                    alert("Phiên đăng nhập không tồn tại, vui lòng đăng nhập lại.");
                    router.push({ name: "login" });
                    return;
                }

                const token = JSON.parse(currentUser)?.token;

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
                alert("Bạn đã đăng xuất thành công!");
                router.push({ name: "bookstore" });
            } catch (error) {
                if (error.response?.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
                    localStorage.removeItem("currentUser");
                    router.push({ name: "login" }); //web đang out ở trạng thái này
                } else {
                    console.error("Lỗi không xác định:", error);
                    alert("Đăng xuất không thành công. Vui lòng thử lại.");
                }
            }
        };


        // Hàm tải giỏ hàng từ API
        const loadCart = async () => {
            try {
                const response = await CartService.getCart();
                console.log(response)
                cartItems.value = response ? response.cart.items : [];
                console.log("cartItems:", cartItems, cartItems.value)
                cartItemCount.value = cartItems.value.reduce((total, item) => total + item.quantity, 0);
            } catch (error) {
                console.log('215:',error)
                // console.error("Error loading cart:", {
                //     message: error.message,
                //     response: error.response ? error.response.data : "No response data",
                //     config: error.config,
                // });
                //alert("Không thể tải giỏ hàng. Vui lòng thử lại sau!");
            }
        };

        // Điều hướng đến trang giỏ hàng
        const goToCart = () => {
            window.location.href = '/cart';
        };

        // Xử lý thanh toán
        const checkout = () => {
            window.location.href = '/checkout';
        };

        onMounted(() => {
            loadCart();
            loadCategories();
            loadAuthors ();
            checkLoginStatus();

        });

        return {
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
            cartItemCount, // Trả về biến này để sử dụng trong template
            categories,
            authors,
            isLoggedIn,
            user,
            logout,
        };
    }
};

// const cart = ref();
// api => cart.value

</script>

<style>
.wrapper-header {
    background-color: #f8f9fa;
    color: #42596d;
    font-size: 15px;
    padding: 5px 0;
}

.header-top .container {
    width: 90%;
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

.header-botton1 {
    /* background-color: #42596d; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 30px;
    margin-left: 50px;
    margin-right: 50px;
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
    background-color: rgb(218, 228, 237);
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 0px 2px;
}

.dropd {
    background-color: rgb(238, 235, 241);
    width: 400px;
    height: auto;
    position: absolute;
    left: 132px;
    top: 235px;
}

.divider {
    margin: 20px auto;
    width: 100%;
    border-bottom: 1px solid #9b9a9e;
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
/* .taikhoan {
    background-color: #3f4895;
} */
.user-dropdown {
    position: absolute;
    top: 235px;
    right: 200px;
    width: 350px;
    padding: 15px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
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
    margin: 5px;
    text-align: center;
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

.cart-dropdown {
    width: 400px;
    height: auto;
    position: absolute;
    top: 50px;
    right: 0;

    background: white;
    border: 1px solid #ddd;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;

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
    /* Màu nền giống "Đăng ký" */
    color: white;
}

.cart-dropdown .btn-cart button:last-child {
    background-color: #333;
    /* Màu nền giống "Đăng nhập" */
    color: white;
}

/* Đảm bảo khoảng cách giữa các nút */
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
    right: -10px;
}

.btn-cart {
    background-color: #f6f6f6;
}
</style>
