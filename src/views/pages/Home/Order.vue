<template>
  <HeaderComponent />
    <div class="order-container">
        <h2>Đơn Hàng Của Tôi</h2>
    </div>
  <FooterComponent />

</template>

<script>
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';

export default {
    name:'Order',
    components: {
        HeaderComponent,
        FooterComponent
    }
}
</script>

<style scoped>

</style>