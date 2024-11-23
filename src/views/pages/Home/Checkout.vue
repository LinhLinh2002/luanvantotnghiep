<template>
    <div class="home-header">
      <!-- Header trên cùng -->
      <div class="header-top">
        <div class="container">
          <a class="addres-star" href="#">TP.Hồ Chí Minh</a>
          <span class="header-links">
            <a href="#">Bookish.vn</a>
            <a href="#">App K0M0 +</a>
            <a href="#">Phiếu Qùa Tặng Phương Nam</a>
          </span>
        </div>
      </div>
  
      <div class="divider"></div>
  
      <!-- Header dưới -->
      <header class="header-botton">
        <div class="header-botton1">
          <router-link to="/bookstore" class="logo-img">
            <img src="https://nhasachphuongnam.com/images/logos/269/LOGO_NHASACHPN-XMAS-for-Web-2024.png" alt="Nhà Sách Phương Nam">
          </router-link>
          <div class="icon">
            <div class="hidden-phone">
              <a href="" class="like">
                <i class="bx bx-heart"></i>
              </a>
              <a href="#" class="call">
                <span><i class="bx bx-phone-call"></i></span> 1900 6656
              </a>
            </div>
          </div>
        </div>
      </header>
      <div class="divider"></div>

  
      <!-- Form thanh toán -->
      <div class="checkout-container">
        <h2>THANH TOÁN</h2>

          <!-- Form trái -->
        <form class="checkout-form">
            <!-- Thông tin cá nhân -->

            <div class="form-section">
              <h3>1. Thông Tin Nhận Hàng</h3>

                <a href="" class="">Thay đổi thông tin </a>

              <div class="input-row">
                    <div class="input-group">
                        <label for="name">Họ và Tên:</label>
                        <input type="text" id="name" placeholder="Nhập họ và tên" required />
                    </div>
                    <div class="input-group">
                        <label for="phone">Số Điện Thoại:</label>
                        <input type="text" id="phone" placeholder="Nhập số điện thoại" required />
                    </div>
                    <div class="input-group">
                        <label for="address">Địa Chỉ:</label>
                        <input type="text" id="address" placeholder="Nhập địa chỉ giao hàng" required />
                        </div>
              </div>

              <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" id="email" placeholder="Nhập email" required />
              </div>
            </div>
  
            <!-- Sản phẩm đã chọn -->
            <div class="form-section">
                <h3>2. Sản Phẩm Đã Chọn</h3>
              <p>Danh sách sản phẩm sẽ hiển thị ở đây...</p>
            </div>
  

  
            <!-- Ghi chú -->
            <div class="form-section">
                <h3>5. Ghi Chú</h3>
              <textarea placeholder="Nhập ghi chú (nếu có)..."></textarea>
            </div>
          
            
          <!-- Tóm tắt đơn hàng -->
          <div class="summary">
            <h3> Đơn Hàng</h3>
            <div class="summary-item">
              <span>Số lượng sản phẩm:</span>
              <span>1 sản phẩm</span>
            </div>
            <div class="summary-item">
              <span>Phí vận chuyển:</span>
              <span>19,000 đ</span>
            </div>
            <div class="summary-item">
              <span>Giảm giá:</span>
              <span>-41,700 đ</span>
            </div>
            <div class="summary-total">
              <span>Tổng cộng:</span>
              <span>116,300 đ</span>
            </div>
            <button class="btn-order">Đặt Mua (116,300 đ)</button>
          </div>

        </form>

      </div>
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import FooterComponent from "./Footer.vue";
  
  export default {
    name: "Checkout",
    components: {
      FooterComponent,
    },
  };
  </script>

<style>
body {
    background-color: #ffffff;
}

.wrapper-header {
    background-color: #ffffff;
    color: #42596d;
    font-size: 15px;
    padding: 5px 0;
}

.header-top .container {
    width: 90%;
    /* background-color: blueviolet; */
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    font-size: 16px;
    /* margin-left: 70px;
    margin-right: 70px; */
}

.header-top a {
    margin-right: 15px;
    text-decoration: none;
    color: #333536;

}

.header-top a:hover {
    text-decoration: underline;
}

.header-botton {
    /* background-color: aqua; */
    margin: 0 auto;

}

.header-botton1 {
    /* background-color: #42596d; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 30px;
    margin-left: 50px;
    margin-right: 50px;
}
.logo-img img{
    height: 50px;
}

.header-botton1 .hidden-phone {
    font-size: 20px;

}

.header-botton1 .call {
    color: #0a0b0c;
    text-decoration: none;
    font-weight: 600;
    font-size: 17px;

}

.header-botton1 i {
    color: #6c757d;
    font-size: 30px;
    padding-right: 5px;

}

.divider {
    margin: 20px auto;
    width: 100%;
    border-bottom: 1px solid #9b9a9e;
}
.checkout-container {
    width: 1180px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
h3 {
    text-align: start;
    color: #333;
    font-family: Inter, -apple-system, sans-serif;
    font-weight: 700;
    font-size: 20px;
    padding-bottom: 20px;
}
h2 {
    text-align: start;
    color: #333;
    font-family: Inter, -apple-system, sans-serif;
    font-weight: 900;
    font-size: 22px;
    padding-bottom: 20px;
}
.form-section {
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
}
/* Form bên trái */
.checkout-form {
    display: flex;
    flex-direction: column;
    gap: 30px;

}

/* Phần tóm tắt bên phải */
.summary {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.summary h3 {
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 20px;
}

.btn-order {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.btn-order:hover {
  background-color: #0056b3;
}

/* Thông tin cá nhân */
 .input-row {
    padding-top:20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

 .input-row .input-group {
  flex: 1;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  height: 80px;
  resize: none;
}

/* Responsive */
@media (max-width: 768px) {
  .checkout-container {
    flex-direction: column;
  }

  .summary {
    margin-top: 20px;
  }
}
</style>