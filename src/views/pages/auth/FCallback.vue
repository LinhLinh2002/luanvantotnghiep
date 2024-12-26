<template>
    <div>
      <p>Đang xử lý đăng nhập...</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    methods: {
      async handlefacebookCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
  
        if (code) {
          try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/facebook/callback', { code });
            const { access_token, user } = response.data;
            
            // Lưu token và thông tin user vào localStorage
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            
            // Chuyển hướng người dùng về trang chính (hoặc trang mong muốn)
            this.$router.push({ name: 'bookstore' });
          } catch (error) {
            console.error('Lỗi khi xử lý callback từ facebook:', error);
          }
        } else {
          alert('Không tìm thấy mã xác thực.');
        }
      },
    },
    mounted() {
      this.handlefacebookCallback();
    },
  };
  </script>