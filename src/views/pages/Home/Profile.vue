<template>
    <HeaderComponent />

    <div class="profile-container">
        <h2> Tài Khoản Của Tôi</h2>

        <form class="profile-form">
            <!-- Đăng ký tài khoản -->
            <div class="form-section">
                <h3>Đăng Ký Tài Khoản</h3>
                <label for="email">E-mail *</label>
                <input type="email" id="email" placeholder="Nhập email" />

                <label for="password">Mật khẩu *</label>
                <input type="password" id="password" placeholder="Nhập mật khẩu" />

                <label for="confirm-password">Xác nhận mật khẩu *</label>
                <input type="password" id="confirm-password" placeholder="Nhập lại mật khẩu" />
            </div>

            <!-- Thông tin liên hệ -->
            <div class="form-section">
                <h3>Thông Tin Liên Hệ</h3>
                <label for="address">Địa chỉ *</label>
                <input type="text" id="address" placeholder="Nhập địa chỉ" />

                <label for="full-name">Họ và Tên *</label>
                <input type="text" id="full-name" placeholder="Nhập họ và tên" />

                <label for="phone">Số điện thoại *</label>
                <input type="tel" id="phone" placeholder="Nhập số điện thoại" />
            </div>

            <!-- Địa chỉ giao hàng -->
            <div class="form-section">
                <h3>Địa Chỉ Giao Hàng</h3>
                <label for="shipping-email">E-mail *</label>
                <input type="email" id="shipping-email" placeholder="Nhập email" />

                <label for="shipping-name">Họ và Tên *</label>
                <input type="text" id="shipping-name" placeholder="Nhập họ và tên" />

                <label for="shipping-phone">Điện thoại *</label>
                <input type="tel" id="shipping-phone" placeholder="Nhập số điện thoại" />

                <label for="province">Tỉnh/Thành *</label>
                <select id="province">
                    <option value="hcm">Thành phố Hồ Chí Minh</option>
                    <option value="hn">Hà Nội</option>
                    <option value="dn">Đà Nẵng</option>
                </select>

                <label for="shipping-address">Địa chỉ *</label>
                <input type="text" id="shipping-address" placeholder="Nhập địa chỉ giao hàng" />
                
                <label for="province">Quận/Huyện *</label>
                <select id="province">
                    <option value="hcm">Thành phố Hồ Chí Minh</option>
                    <option value="hn">Hà Nội</option>
                    <option value="dn">Đà Nẵng</option>
                </select>

                <label for="province">Phường/Xã *</label>
                <select id="province">
                    <option value="hcm">Thành phố Hồ Chí Minh</option>
                    <option value="hn">Hà Nội</option>
                    <option value="dn">Đà Nẵng</option>
                </select>

                <label for="province">Quốc Gia</label>
                <select id="province">
                    <option value="hcm">Thành phố Hồ Chí Minh</option>
                    <option value="hn">Hà Nội</option>
                    <option value="dn">Đà Nẵng</option>
                </select>
            </div>

            <button type="submit" class="submit-button">Lưu Thông Tin</button>
        </form>
    </div>

    <FooterComponent />

</template>

<script>
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';
export default {
    name: 'Profile',
    components: {
        HeaderComponent,
        FooterComponent
    },

}
</script>

<style scoped>
.profile-container {
    width: 1180px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: start;
    color: #333;
    font-family: Inter, -apple-system, sans-serif;
    font-weight: 900;
    font-size: 22px;
    padding-bottom: 20px;
}

h3 {
    text-align: start;
    color: #333;
    font-family: Inter, -apple-system, sans-serif;
    font-weight: 700;
    font-size: 20px;
    padding-bottom: 20px;
}



.profile-form {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.form-section {
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
}

label {
    display: block;
    font-size: 14px;
    margin: 10px 0 5px;
    font-weight: 500;
    color: #555;
   

}

input,
select {
    width: 587px;
    height: 40px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-bottom: 15px;
    box-sizing: border-box;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
input:focus,
select:focus {
  border-color: #007bff; /* Đổi viền sang màu xanh */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Thêm ánh sáng xanh */
  outline: none; /* Xóa đường viền mặc định */
}


.submit-button {
    background-color: #007bff;
    color: #fff;
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
}

.submit-button:hover {
    background-color: #0056b3;
}
</style>
