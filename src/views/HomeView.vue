<template>
  <div class="homeview">
    <router-link to="/bookstore" class="">Cửa Hàng Sách</router-link>
    <router-link to="/admin" class="">Trang Quản Lý</router-link>
    <router-link to="/auth/login" class="">Trang Đăng Nhập</router-link>
    <router-link to="/auth/register" class="">Trang Đăng Ký</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    document.title = 'HomeView';
  },
};
</script>

<style scoped>
.homeview {
  background-color: rgb(30, 37, 131);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
}

.homeview a, .homeview router-link {
  color: #fff;
  text-decoration: none;
  font-size: 20px;
}
</style>
