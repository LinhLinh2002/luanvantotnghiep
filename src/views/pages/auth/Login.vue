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
                    <h4> Wellcome back you been missed</h4>

                    <div class="input-group">
                        <input type="email" v-model="login.email" class="textname" placeholder="Email" required>
                    </div>
                    <div class="input-group">
                        <input type="password" v-model="login.password" class="pass" placeholder="Password" required>
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
                const response = await axios.post("https://backend.vothanhhoang.online/api/auth/login", this.login);
                console.log("Đăng nhập thành công:", response.data);
                localStorage.setItem("currentUser", JSON.stringify(response.data));
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
body {
    margin: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.login-page {
    background-color: rgb(88, 102, 188);
    width: 100%;
    height: 100%;
    padding-top: 50px;
}

.container {
    background-color: rgb(218, 228, 237);
    border: 2px solid #fcfcfc;
    width: 1200px;
    height: 100%;
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    justify-content: space-around;
    padding: 10px;
    border-radius: 20px;
}

.img-login img {
    width: 600px;
    height: 100%;
    border-radius: 20px;
}

.signin-page {
    background-color: transparent;
    width: 600px;
    border-radius: 20px;
    padding-left: 50px;
    padding-top: -5px;

}

h1 {
    text-align: center;
    padding-top: 40px;
    color: black;
    font-weight: normal;
    font-size: 35px;
}

h4 {
    font-size: 16px;
    font-weight: normal;
    padding-bottom: 20px;
    padding-left: 140px;
}

h6 {
    text-align: right;
    font-size: 12px;
    padding-right: 20px;
}

h6 a {
    text-decoration: none;
    color: #4c5bb6;
}

h6 a:hover {
    color: #80e4fc;
}

.input-group {
    position: relative;
    margin: 20px ;
    padding-left: 90px;
}

.input-group ::placeholder {
    color: #ccc;
    
}

.textname {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    width: 350px;
    height: 30px;
}

.pass {
    padding: 10px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    width: 350px;
    height: 30px;
}

.forgot {
    padding-left: 310px;
    padding-bottom: 20px;
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
}

.btn-In {
    padding: 10px 1px;
    background-color: #4554b3;
    border: 1px solid #e756b5;
    cursor: pointer;
    border-radius: 10px;
    width: 340px;
    height: 55px;
    font-size: 17px;
    color: #fff;
    margin-left: 30px;
}

.btn-In:hover {
    background-color: #e756b5;
}

h5 {
    text-align: center;
}
.conti-wit{
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
</style>
