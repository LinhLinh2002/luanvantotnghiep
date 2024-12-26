<template>
        <Toast />
    <div class="login-page">
        <div class="container">
            <div class="img-login">
                <img src="https://img.freepik.com/free-vector/gradient-glossary-illustration_23-2150261251.jpg?t=st=1728623406~exp=1728627006~hmac=8c4fa9967947c37a81c1931bc9b3ef70fb6bf9942a23aaf0fa4e2cc676afb893&w=740"
                    alt="login-image" class="img">
            </div>
            <div class="signin-page">
                <form @submit.prevent="loginUser">
                    <h6>Not A Member? <a @click.prevent="goToRegister" class="Signuplink">Register now</a></h6>
                    <h1>Hello Again! Login</h1>

                    <div class="input-group">
                        <input type="email" v-model="login.email" class="input-field" placeholder="Email" required>
                    </div>
                    <div class="input-group">
                        <input type="password" v-model="login.password" class="input-field" placeholder="Password"
                            required>
                    </div>

                    <div class="forgot">
                        <router-link to="/auth/forgot">Forgot Password ?</router-link>
                    </div>

                    <div class="btn-container">
                        <button class="btn-signin">Sign In</button>
                    </div>

                    <div class="conti-wit">
                        <div class="icon-container">
                            <div class="icon-item">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
                                    alt="google-login" class="social-icon" @click="loginWithGoogle">
                            </div>
                            <div class="icon-item">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png"
                                    alt="facebook-login" class="social-icon" @click="loginWithFacebook">
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
import axios from 'axios';
import { useToast } from 'primevue/usetoast'; // Import useToast

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
    setup() {
        const toast = useToast(); // Khai báo useToast
        return {
            toast, // Trả về để dùng trong methods
        };
    },
    methods: {
        async loginUser() {
            // Client-side validation
            if (!this.login.email || !this.login.password) {
                // alert("Vui lòng điền tất cả các trường!");
                this.toast.add({
                            severity: "warn",
                            summary: "Warning",
                            detail: "Vui lòng điền tất cả các trường!",
                            life: 3000,
                        });
                return;
            }
            if (!this.validateEmail(this.login.email)) {
                // alert("Địa chỉ email không hợp lệ!");
                this.toast.add({
                            severity: "warn",
                            summary: "Warning",
                            detail: "Địa chỉ email không hợp lệ!",
                            life: 3000,
                        });
                return;
            }
            if (this.login.password.length < 8) {
                // alert("Mật khẩu phải có ít nhất 8 ký tự!");
                this.toast.add({
                            severity: "warn",
                            summary: "Warning",
                            detail: "Mật khẩu phải có ít nhất 8 ký tự!",
                            life: 3000,
                        });
                return;
            }

            try {
                // Call the login function from authService
                const response = await AuthService.login(this.login);
                // console.log("Đăng nhập thành công:", response);

                // Lưu thông tin người dùng và token vào localStorage
        
                localStorage.setItem('access_token', response.data.token.access_token); // Lưu token
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));

                // Kiểm tra vai trò của người dùng và chuyển hướng
                const user = response.data.user;
                if (user.is_admin === 1) {
                    // Chuyển hướng đến trang admin nếu là quản trị viên
                    this.$router.push({ name: 'dashboard' });
                } else {
                    // Chuyển hướng đến trang bookstore nếu là người dùng bình thường
                    this.$router.push({ name: 'bookstore' });
                }
            } catch (error) {
                // console.error("Lỗi khi đăng nhập:", error);
                this.toast.add({
                        severity: "error",
                        summary: "Lỗi",
                        detail: "Đăng nhập thất bại.Vui lòng thử lạilại",
                        life: 3000,
                    });            }
        },

        loginWithGoogle() {
            // Call backend to get the Google login URL
            axios.get('http://127.0.0.1:8000/api/auth/google')
                .then(response => {
                    window.location.href = response.data.url;
                })
                .catch(error => {
                    console.error("Error during Google login:", error);
                });
        },
      

        loginWithFacebook() {
            // Gửi yêu cầu đến backend để lấy URL đăng nhập Facebook
            axios.get('http://127.0.0.1:8000/api/auth/facebook')
                .then(response => {
                    // Chuyển hướng người dùng đến URL đăng nhập của Facebook
                    window.location.href = response.data.url;
                })
                .catch(error => {
                    console.error("Lỗi khi đăng nhập bằng Facebook:", error);
                });
        },

        goToRegister() {
            this.$router.push({ name: 'register' });
        },
        validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

    },
    mounted() {
  

    },

}
</script>

<style scoped>
/* Reset mặc định */
body {
    margin: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f1f5f9;
}

.login-page {
    width: 100%;
    padding: 20px;
}

.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border: 2px solid #3b92c5;
    border-radius: 20px;
    padding: 20px;
    gap: 20px;
    max-width: 1200px;
    margin: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.img-login {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 500px;
}

.img-login img {
    width: 100%;
    max-width: 500px;
    border-radius: 20px;
    object-fit: cover;
    aspect-ratio: 1;
}

.signin-page {
    flex: 1;
    max-width: 500px;
    background-color: transparent;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #333;
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
    margin: 15px 0;
}

.input-field {
    width: 100%;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 30px;
    font-size: 16px;
    background-color: #f9f9f9;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.input-field:focus {
    border-color: #3b92c5;
    box-shadow: 0 0 5px rgba(59, 146, 197, 0.5);
}

.forgot {
    text-align: end;
    margin: 10px 0;
}

.forgot router-link {
    text-decoration: none;
    color: #333;
    font-size: 15px;
}

.forgot router-link:hover {
    color: #e756b5;
}

.btn-container {
    text-align: center;
    margin: 20px 0;
}

.btn-signin {
    padding: 15px;
    background: linear-gradient(135deg, #48c6ef, #6f86d6);
    box-shadow: 0 5px 15px rgba(72, 198, 239, 0.3);
    cursor: pointer;
    border-radius: 30px;
    width: 100%;
    max-width: 400px;
    font-size: 17px;
    color: #fff;
    transition: background-color 0.3s;
}

.btn-signin:hover {
    background: linear-gradient(135deg, #6f86d6, #48c6ef);
}

h5 {
    text-align: center;
    margin-top: 20px;
    color: #333;
}

.conti-wit {
    margin-top: 20px;
}

.icon-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
}

.icon-item {
    cursor: pointer;
}

.social-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    transition: transform 0.3s;
}

.social-icon:hover {
    transform: scale(1.1);
}

/* Responsive design */
@media (min-width: 768px) {
    .container {
        flex-direction: row;
    }

    .img-login,
    .signin-page {
        flex: 1;
    }
}

@media (max-width: 768px) {
    .container {
        flex-direction: column;
    }

    .img-login img,
    .signin-page {
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 24px;
    }

    h6 {
        font-size: 10px;
    }

    .input-field {
        font-size: 14px;
    }

    .btn-signin {
        font-size: 15px;
    }
}
</style>