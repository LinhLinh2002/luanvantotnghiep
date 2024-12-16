<template>
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
                        <h5> Or continue with</h5>
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
        loginWithGoogle() {
            // Call backend to get the Google login URL
            axios.get('http://127.0.0.1:8000/api/auth/google')
                .then(response => {
                    // Redirect user to Google login URL
                    window.location.href = response.data.url;



                })
                .catch(error => {
                    console.error("Error during Google login:", error);
                });
        },
        handleGoogleCallback() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code'); // Lấy mã code từ URL
            if (code) {
                axios
                    .post('http://localhost:8000/api/auth/google/callback', { code })
                    .then((response) => {
                        console.log('Login Response:', response.data);

                        // Lưu token và thông tin user vào localStorage
                        localStorage.setItem(
                            'access_token',
                            response.data.access_token.access_token
                        );
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        aler('ok, 120')
                        // Chuyển hướng tới trang bookstore
                        next('/bookstore');
                    })
                    .catch((error) => {
                        console.error('Error during login:', error);
                        alert('Login failed!');
                    });
            }
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


        async handleFacebookCallback() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code'); // Lấy mã code từ URL

            if (code) {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/auth/facebook/callback', { code });
                    const { accessToken, user } = response.data;

                    // Lưu token và thông tin user vào localStorage
                    localStorage.setItem('access_token', accessToken);
                    localStorage.setItem('user', JSON.stringify(user));

                    // Chuyển hướng tới trang bookstore
                    this.$router.push({ name: 'bookstore' });
                } catch (error) {
                    console.error('Error during Facebook login:', error);
                    alert('Login failed!');
                }
            } else {
                alert('Mã code không tồn tại!');
            }
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
        this.handleGoogleCallback(); // Gọi khi component load
    },

}
</script>

<style scoped>
/* Reset mặc định */
body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    background-color: #4554b3;
    border: 1px solid #e756b5;
    cursor: pointer;
    border-radius: 30px;
    width: 100%;
    max-width: 400px;
    font-size: 17px;
    color: #fff;
    transition: background-color 0.3s;
}

.btn-signin:hover {
    background-color: #e756b5;
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