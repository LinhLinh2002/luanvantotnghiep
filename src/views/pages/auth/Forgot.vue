<template>
    <div class="login-page">
      <div class="container">
        <div class="img-login">
          <img src="https://img.freepik.com/free-vector/gradient-glossary-illustration_23-2150261251.jpg?t=st=1728623406~exp=1728627006~hmac=8c4fa9967947c37a81c1931bc9b3ef70fb6bf9942a23aaf0fa4e2cc676afb893&w=740"
            alt="" class="img">
        </div>
        <div class="signin-page">
          <form @submit.prevent="loginUser">
            <h1>Login</h1>
  
            <div class="input-group">
              <input type="email" v-model="login.email" class="textname" placeholder="Email" required>
            </div>
  
           
  
            <button type="submit" v-if="!showForgotPassword">Login</button>
          </form>
          
          <div class="conti-wit">
            <h5> Or continue with</h5>
            <div class="icon-container">
              <div class="icon-item">
                <img src="https://nhasachphuongnam.com/design/themes/responsive/media/images/addons/hybrid_auth/icons/flat_32x32/google.png"
                  alt="" class="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
<script>
    
export default {
    setup() {
        
    },
}
</script>
<style scoped>
/* Các kiểu dáng chung cho form đăng nhập */

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
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: rgb(218, 228, 237);
  border: 2px solid #3b92c5;
  border-radius: 20px;
  padding: 20px;
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
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 20px;
}

.signin-page {
  flex: 1;
  max-width: 500px;
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

.forgot-password-form {
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.forgot-password-form input {
  width: 100%;
}

.forgot-password-form button {
  padding: 10px;
  background-color: #4c5bb6;
  color: white;
  border: none;
  border-radius: 5px;
}

.forgot-password-form button:hover {
  background-color: #3b4a91;
}
</style>
