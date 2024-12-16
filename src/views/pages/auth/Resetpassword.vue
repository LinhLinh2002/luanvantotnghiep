<template>
  <div class="login-page">
      <div class="container">
          <div class="img-login">
              <img src="https://img.freepik.com/free-vector/gradient-glossary-illustration_23-2150261251.jpg?t=st=1728623406~exp=1728627006~hmac=8c4fa9967947c37a81c1931bc9b3ef70fb6bf9942a23aaf0fa4e2cc676afb893&w=740"
                  alt="" class="img">
          </div>
          <div class="signin-page">
              <form @submit.prevent="resetPassword">
                  <h1>Reset Your Password</h1>
                  <h4>Enter a new password below</h4>

                  <div class="input-group">
                      <input type="email" v-model="email" class="textname" placeholder="Enter your email" required>
                  </div>
                  <div class="input-group">
                      <input type="password" v-model="password" class="textname" placeholder="New Password" required>
                  </div>
                  <div class="input-group">
                      <input type="password" v-model="confirmPassword" class="textname" placeholder="Confirm Password"
                          required>
                  </div>

                  <div class="input-group">
                    <input v-model="token" type="text" placeholder="Nhập mã OTP" required />

                  </div>
                  <div class="btn-container">
                      <button class="btn-In">Reset Password</button>
                  </div>

                  <div class="back-to-login">
                      <router-link to="/auth/login">Back to Login</router-link>
                  </div>
              </form>
          </div>
      </div>
  </div>
</template>
<script>

export default {
  name: 'ResetPassword',
  data() {
      return {
        email: '',
          password: '',
          confirmPassword: '',
          token: '', // Mã token người dùng nhận được qua email
      };
  },
  methods: {
    async resetPassword() {
  if (!this.token || !this.password || !this.confirmPassword) {
      alert("Please fill in all fields!");
      return;
  }

  if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
  }

  try {
      // Lấy token người dùng từ localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const token = currentUser ? currentUser.token : null;

      if (!token) {
          alert("Invalid or expired token.");
          return;
      }

      const response = await axios.post('http://127.0.0.1:8000/api/auth/password/reset', {
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        token: this.token,
      }, {
          headers: {
              Authorization: `Bearer ${token}`,  // Gửi token để xác thực
          }
      });

      alert("Password reset successfully!");
      this.$router.push({ name: 'login' });
  } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
          }
      }
  }
}
</script>

<style scoped>
/* Các kiểu dáng chung cho form đăng nhập */

body {
margin: 0;
font-family: 'Roboto', sans-serif;
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
background-color: #f1f1f1;
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
background-color: rgb(248, 250, 252);
border: 2px solid #c3d0d6;
border-radius: 20px;
padding: 40px;
gap: 20px;
max-width: 1200px;
margin: auto;
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
object-fit: cover;
border-radius: 20px;
}

.signin-page {
flex: 1;
max-width: 500px;
background-color: #ffffff;
border-radius: 20px;
padding: 30px;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
text-align: center;
color: #333;
font-weight: bold;
font-size: 28px;
margin-bottom: 20px;
}

h4 {
text-align: center;
color: #666;
font-size: 16px;
margin-bottom: 30px;
}

.input-group {
display: flex;
flex-direction: column;
margin: 10px 0;
}

.input-group input {
padding: 12px;
border: 1px solid #ccc;
border-radius: 8px;
font-size: 16px;
margin-bottom: 15px;
}

.input-group input:focus {
border-color: #4c5bb6;
outline: none;
}

.btn-container {
display: flex;
justify-content: center;
}

.btn-In {
padding: 12px 20px;
background-color: #4c5bb6;
color: white;
border: none;
border-radius: 8px;
font-size: 16px;
cursor: pointer;
transition: background-color 0.3s;
}

.btn-In:hover {
background-color: #3b4a91;
}

.back-to-login {
text-align: center;
margin-top: 20px;
}

.back-to-login a {
color: #4c5bb6;
text-decoration: none;
font-size: 14px;
}

.back-to-login a:hover {
color: #3b4a91;
}
</style>
