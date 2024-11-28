<template>
    <div class="login-page">
        <div class="container">
            <div class="img-login">
                <img src="https://img.freepik.com/free-vector/gradient-glossary-illustration_23-2150261251.jpg?t=st=1728623406~exp=1728627006~hmac=8c4fa9967947c37a81c1931bc9b3ef70fb6bf9942a23aaf0fa4e2cc676afb893&w=740"
                    alt="" class="img">
            </div>
            <div class="signin-page">
                <form @submit.prevent="saveData">
                    <h6>Already have an account <a @click.prevent="goToLogin" class="Signuplink">Sign In</a>
                    </h6>
                    <h1>Hello! Sign Up</h1>

                    <div class="input-group">
                        <input type="text" v-model="register.name" class="textname" placeholder="Name" required>
                    </div>
                    <div class="input-group">
                        <input type="email" v-model="register.email" class="textname" placeholder="Email" required>
                    </div>
                    <div class="input-group">
                        <input type="password" v-model="register.password" class="pass" placeholder="Password" required>
                    </div>
                    <div class="input-group">
                        <input type="password" v-model="register.c_password" class="pass" placeholder="Confirm Password"
                            required>
                    </div>

                    <div class="btn-container">
                        <button class="btn-In" value="Save">Sign Up</button>
                    </div>

                    <div class="conti-wit">
                        <h5>Or continue with</h5>
                        <div class="icon-container">
                            <div class="icon-item">
                                <img src="https://nhasachphuongnam.com/design/themes/responsive/media/images/addons/hybrid_auth/icons/flat_32x32/google.png"
                                    alt="">
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Register',
    data() {
        return {
            register: {
                name: '',
                email: '',
                password: '',
                c_password: ''
            }
        }
    },
    methods: {
        async saveData() {
            if (!this.register.name || !this.register.email || !this.register.password || !this.register.c_password) {
                alert("Vui lòng điền tất cả các trường!");
                return;
            }
            if (!this.validateEmail(this.register.email)) {
                alert("Địa chỉ email không hợp lệ!");
                return;
            }
            if (this.register.password.length < 8) {
                alert("Mật khẩu phải có ít nhất 8 ký tự!");
                return;
            }
            if (this.register.password !== this.register.c_password) {
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }

            try {
                const response = await axios.post("http://127.0.0.1:8000/api/auth/register", this.register);
                console.log("Đăng ký thành công:", response.data);
                alert("Đăng ký thành công!");
                this.$router.push({ name: 'login' });
            } catch (error) {
                console.error("Lỗi khi đăng ký:", error);
                alert("Đăng ký thất bại! Vui lòng thử lại.");
            }
        },
        goToLogin() {
            this.$router.push({ name: 'login' });
        },
        validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    }
}
</script>

<style>
/* Reset */
body {
    margin: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

/* Tổng thể trang */
.login-page {
    background-color: #80a9e2;
    width: 100%;
    min-height: 100vh;
    padding-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    background-color: #e6edf7;
    border: 2px solid #fcfcfc;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 1200px;
    min-height: 600px; /* Đảm bảo container luôn giữ chiều cao */
}

/* Hình ảnh */
.img-login {
    flex: 1; /* Phần hình ảnh chiếm một nửa chiều rộng */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.img-login img {
    width: 100%;
    height: auto;
    max-height: 100%; /* Đảm bảo hình không vượt quá chiều cao container */
    border-radius: 20px;
    object-fit: cover; /* Đảm bảo ảnh không bị méo */
}

/* Form */
.signin-page {
    flex: 1; /* Phần form chiếm một nửa chiều rộng */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

h1 {
    font-size: 2rem;
    text-align: center;
    color: black;
    font-weight: normal;
    margin-bottom: 20px;
}

h6 {
    text-align: right;
    font-size: 14px;
    margin-bottom: 20px;
    width: 100%;
    color: #4c5bb6;
}

h6 a {
    text-decoration: none;
    color: #4c5bb6;
    font-weight: bold;
}

h6 a:hover {
    color: #80e4fc;
}

/* Input group */
.input-group {
    width: 100%;
    max-width: 350px;
    margin-bottom: 20px;
    position: relative;
}

.input-group input {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 20px;
    width: 400px; /* Tăng chiều rộng */
    outline: none;
    font-size: 16px;
    transition: border-color 0.3s;
}

.input-group input:focus {
    border-color: #4c5bb6;
    box-shadow: 0 0 4px #4c5bb6;
}

/* Button */
.btn-container {
    width: 100%;
    max-width: 350px;
    text-align: center;
    margin-top: 20px;
}

.btn-In {
    padding: 12px;
    background-color: #4554b3;
    border: none;
    border-radius: 20px;
    width: 400px;    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.btn-In:hover {
    background-color: #e756b5;
    transform: scale(1.05);
}

/* Tiếp tục với phần mạng xã hội */
.conti-wit {
    margin-top: 20px;
    text-align: center;
}

.conti-wit h5 {
    margin-bottom: 10px;
    font-size: 14px;
    color: #555;
}

.icon-container {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.icon-item img {
    height: 45px;
    width: 45px;
}

/* Responsive chỉnh sửa */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        align-items: center;
    }

    .img-login, .signin-page {
        flex: unset;
        width: 100%;
    }

    .img-login img {
        max-height: 300px;
    }

    h1 {
        font-size: 1.8rem;
    }

    .input-group input {
        font-size: 14px;
    }

    .btn-In {
        font-size: 14px;
        padding: 10px;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 1.5rem;
    }

    h6 {
        font-size: 12px;
    }

    .btn-In {
        font-size: 14px;
        padding: 8px;
    }

    .conti-wit h5 {
        font-size: 12px;
    }

    .icon-item img {
        height: 40px;
        width: 40px;
    }
}

</style>
