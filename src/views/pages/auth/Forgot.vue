<template>
  <div class="login-page">
    <div class="container">
      <div class="img-login">
        <img
          src="https://img.freepik.com/free-vector/gradient-glossary-illustration_23-2150261251.jpg?t=st=1728623406~exp=1728627006~hmac=8c4fa9967947c37a81c1931bc9b3ef70fb6bf9942a23aaf0fa4e2cc676afb893&w=740"
          alt="Login illustration" class="img">
      </div>
      <div class="signin-page">
        <form @submit.prevent="forgotPassword">
          <h1>Forgot Your Password?</h1>
          <!-- <h4>Enter your email address and we will send you a link to reset your password.</h4> -->

          <div class="input-group">
            <input
              type="email"
              v-model="email"
              class="textname"
              placeholder="Email"
              required
              :class="{'input-error': emailError}" 
            />
          </div>

          <div v-if="emailError" class="error-message">Please enter a valid email address.</div>

          <div class="btn-container">
            <button class="btn-In" type="submit">Send Reset Link</button>
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
import AuthService from '@/service/AuthService';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      emailError: false
    };
  },
  methods: {
    async forgotPassword() {
      if (!this.validateEmail(this.email)) {
        this.emailError = true;
        return;
      }
      this.emailError = false;

      try {
        const response = await AuthService.forgotPassword(this.email);
        alert("Check your email for the reset link.");
        this.$router.push({ name: 'resetpassword' }); 
      } catch (error) {
        alert("Error sending reset link: " + error.message);
        console.error(error);
      }
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
};
</script>

<style scoped>
/* Các kiểu dáng chung cho form forgot password */

body {
  margin: 0;
  font-family: 'Verdana', 'Geneva', 'Tahoma', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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

h4 {
  text-align: center;
  color: #555;
  font-size: 16px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.input-group input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
}

.input-group input:focus {
  border-color: #4c5bb6;
}

.input-error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
  text-align: center;
  margin-top: 5px;
}

.btn-container {
  text-align: center;
  margin: 20px 0;
}

.btn-In {
  padding: 15px;
    background: linear-gradient(135deg, #48c6ef, #6f86d6);
    box-shadow: 0 5px 15px rgba(72, 198, 239, 0.3);
    cursor: pointer;
    border-radius: 30px;
    width: 100%;
    max-width: 200px;
    font-size: 17px;
    color: #fff;
    transition: background-color 0.3s;
}

.btn-In:hover {
  background: linear-gradient(135deg, #6f86d6, #48c6ef);
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
}

.back-to-login router-link {
  color: #4c5bb6;
  font-size: 14px;
  text-decoration: none;
}

.back-to-login :hover {
  color: #1e768b;
}
</style>
