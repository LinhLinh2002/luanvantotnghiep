    <template>
        <div class="login-page">
            <div class="container">
                <div class="img-login">
                    <img src="https://img.freepik.com/free-vector/gradient-glossary-illustration_23-2150261251.jpg?t=st=1728623406~exp=1728627006~hmac=8c4fa9967947c37a81c1931bc9b3ef70fb6bf9942a23aaf0fa4e2cc676afb893&w=740"
                        alt="" class="img">
                </div>
                <div class="signin-page">
                    <form @submit.prevent="loginUser">
                        <h6>Not A Member? <a @click.prevent="goToRegister" class="Signuplink">Register now</a></h6>
                        <h1>Hello Again! Login</h1>
                        <!-- <h4> Wellcome back you been missed</h4> -->

                        <div class="input-group">
                            <input type="email" v-model="login.email" class="textname" placeholder="Email" required>
                        </div>
                        <div class="input-group">
                            <input type="password" v-model="login.password" class="pass" placeholder="Password"
                                required>
                        </div>
                        <div class="forgot">
                            <a href="">Forgot Password ? </a>
                        </div>

                        <div class="btn-container">
                            <button class="btn-In">Sign In</button>
                        </div>

                        <div class="conti-wit">
                            <h5> Or continue with</h5>
                            <div class="icon-container">
                                <div class="icon-item">
                                    <img src="https://nhasachphuongnam.com/design/themes/responsive/media/images/addons/hybrid_auth/icons/flat_32x32/google.png"
                                        alt="" class="">
                                </div>

                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </template>

<script>
import AuthService from '@/service/AuthService';

export default {
    name: 'Login',
    data() {
        return {
            login: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        async loginUser() {
            // Client-side validation
            if (!this.login.email || !this.login.password) {
                alert("Vui lòng điền tất cả các trường!");
                return;
            }
            if (!this.validateEmail(this.login.email)) {
                alert("Địa chỉ email không hợp lệ!");
                return;
            }
            if (this.login.password.length < 8) {
                alert("Mật khẩu phải có ít nhất 8 ký tự!");
                return;
            }

            try {
                // Call the login function from authService
                const response = await AuthService.login(this.login);
                console.log("Đăng nhập thành công:", response);
                
                // Navigate to the bookstore page after login
                this.$router.push({ name: 'bookstore' });
            } catch (error) {
                console.error("Lỗi khi đăng nhập:", error);
                alert("Đăng nhập thất bại! Vui lòng thử lại.");
            }
        },
        goToRegister() {
            this.$router.push({ name: 'register' });
        },
        validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    }
}
</script>


<style>
/* Reset mặc định */
body {
    margin: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #80a9e2;

}

.login-page {

    width: 100%;
    padding: 20px;
}

.container {
    display: flex;
    flex-wrap: wrap; /* Đảm bảo phần tử xuống dòng khi không đủ không gian */
    justify-content: center;
    align-items: center;
    background-color: rgb(218, 228, 237);
    border: 2px solid #3b92c5;
    border-radius: 20px;
    padding: 20px;
    gap: 20px; /* Khoảng cách giữa các phần tử */
    max-width: 1200px;
    margin: auto;
}

.img-login {
    flex: 1; /* Chia đều không gian giữa hình và form */
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 500px; /* Giới hạn chiều rộng tối đa */
}

.img-login img {
    width: 100%; /* Hình ảnh tự động co giãn */
    max-width: 500px; /* Giới hạn chiều rộng tối đa */
    aspect-ratio: 1; /* Giữ tỉ lệ vuông */
    object-fit: cover; /* Đảm bảo hình không bị méo */
    border-radius: 20px;
}

.signin-page {
    flex: 1; /* Chia đều không gian giữa hình và form */
    max-width: 500px; /* Giới hạn chiều rộng tối đa */
    background-color: transparent;
    border-radius: 20px;
    padding: 20px;
}

h1 {
    text-align: center;
    color: black;
    font-weight: normal;
    font-size: 28px;
    margin-bottom: 20px;
}

h6 {
    text-align: center;
    font-size: 12px;
    margin-bottom: 20px;
}

h6 a {
    text-decoration: none;
    color: #4c5bb6;
}

h6 a:hover {
    color: #80e4fc;
}

.input-group {
    display: flex;
    justify-content: center;
    margin: 10px 0;

}

.textname,
.pass {
    width: 100%;
    max-width: 400px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    font-size: 16px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Thêm hiệu ứng mượt */
}

.textname:focus,
.pass:focus {
    border-color: #4c5bb6; /* Viền màu xanh */
    box-shadow: 0 0 5px rgba(76, 91, 182, 0.5); /* Ánh sáng nhẹ */
    outline: none; /* Bỏ viền mặc định */
}


.forgot {
    text-align: end;
    margin: 10px 0;
}

.forgot a {
    text-decoration: none;
    color: black;
    font-size: 15px;
}

.forgot a:hover {
    color: #e756b5;
}

.btn-container {
    text-align: center;
    margin: 20px 0;
}

.btn-In {
    padding: 15px;
    background-color: #4554b3;
    border: 1px solid #e756b5;
    cursor: pointer;
    border-radius: 20px;
    width: 100%;
    max-width: 400px;
    font-size: 17px;
    color: #fff;
}

.btn-In:hover {
    background-color: #e756b5;
}

h5 {
    text-align: center;
}

.conti-wit {
    margin-top: 15px;
}

.icon-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
}

.icon-item img {
    height: 45px;
    width: 45px;
}

/* Responsive design */
@media (min-width: 768px) {
    .container {
        flex-direction: row; /* Hiển thị ngang khi màn hình lớn */
    }

    .img-login, 
    .signin-page {
        flex: 1; /* Chia đều không gian giữa hình ảnh và form */
        max-width: none; /* Cho phép tự co giãn */
    }
}

@media (max-width: 768px) {
    .container {
        flex-direction: column; /* Hiển thị dọc khi màn hình nhỏ */
    }

    .img-login img, 
    .signin-page {
        max-width: 100%; /* Đảm bảo chiếm toàn bộ chiều ngang */
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 24px;
    }

    h6 {
        font-size: 10px;
    }

    .textname,
    .pass {
        font-size: 14px;
    }

    .btn-In {
        font-size: 15px;
    }
}

</style>
