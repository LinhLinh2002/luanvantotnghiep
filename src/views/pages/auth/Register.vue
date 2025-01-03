<template>
    <Toast />
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
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from '@/service/AuthService'; // Import your AuthService
import { useToast } from 'primevue/usetoast'; // Import useToast

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
        };
    },
    setup() {
        const toast = useToast(); 
        return {
            toast, 
        };
    },
    methods: {
        async saveData() {
            if (!this.register.name || !this.register.email || !this.register.password || !this.register.c_password) {
                // alert("Please fill out all fields!");
                this.toast.add({
                    severity: "warn",
                    summary: "Warning",
                    detail: "Vui lòng điền tất cả các trường!",
                    life: 3000,
                });
                return;
            }
            if (!this.validateEmail(this.register.email)) {
                // alert("Địa chỉ email không hợp lệ!");
                this.toast.add({
                    severity: "warn",
                    summary: "Warning",
                    detail: "Địa chỉ email không hợp lệ!",
                    life: 3000,
                });
                return;
            }
            if (this.register.password.length < 8) {
                // alert("Mật khẩu phải có ít nhất 8 ký tự!");
                this.toast.add({
                    severity: "warn",
                    summary: "Warning",
                    detail: "Mật khẩu phải có ít nhất 8 ký tự!",
                    life: 3000,
                });
                return;
            }
            if (this.register.password !== this.register.c_password) {
                this.toast.add({
                    severity: "warn",
                    summary: "Warning",
                    detail: "Mật khẩu không khớp!",
                    life: 3000,
                });
                return;                
            }

            try {
                const response = await AuthService.register({
                    name: this.register.name,
                    email: this.register.email,
                    password: this.register.password,
                    c_password: this.register.c_password // Ensure this is being sent correctly
                });
                // console.log("Registration successful:", response);
                // alert("Registration successful!");
                this.toast.add({ 
                    severity: 'success',
                    summary: 'Thành công',
                    detail: "Đăng ký thành công!",
                    life: 3000,
                });
                this.$router.push({ name: 'login' }); // Redirect to login page
            } catch (error) {
                console.error("Registration failed:", error);
                //alert("Registration failed! Please try again.");
                this.$router.push({ name: 'login' }); // Redirect to login page

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
};
</script>

<style>
/* Reset */
body {
    margin: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

/* Tổng thể trang */
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

/* Hình ảnh */
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

/* Form */
.signin-page {
    flex: 1;
    /* Phần form chiếm một nửa chiều rộng */
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
    width: 100%;  /* Made it responsive */
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
    background: linear-gradient(135deg, #48c6ef, #6f86d6);
    box-shadow: 0 5px 15px rgba(72, 198, 239, 0.3);
    border: none;
    border-radius: 20px;
    width: 100%; /* Made it responsive */
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.btn-In:hover {
    background: linear-gradient(135deg, #6f86d6, #48c6ef);
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
@media (max-width: 1024px) {
    .container {
        flex-direction: column;
        align-items: center;
    }

    .signin-page {
        width: 100%; /* Ensure form takes up full width on tablets */
    }

    .img-login img {
        max-height: 250px; /* Limit image size on smaller screens */
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

@media (max-width: 768px) {
    .container {
        flex-direction: column;
        align-items: center;
    }

    .img-login,
    .signin-page {
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
