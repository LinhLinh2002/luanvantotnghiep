<template>
  <Toast />

  <div class="home-header">
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

    <header class="header-botton">
      <div class="header-botton1">
        <router-link to="/bookstore" class="logo-img">
          <img src="https://nhasachphuongnam.com/images/logos/269/LOGO_NHASACHPN-XMAS-for-Web-2024.png"
            alt="Nhà Sách Phương Nam">
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


    <div class="checkout-container">
      <h2>THANH TOÁN ĐƠN HÀNG</h2>
      <div class="checkout-layout">


        <form class="checkout-form">
          <div class="form-section">
            <h3>1. Thông Tin Nhận Hàng</h3>

            <router-link to="/profile" class="add_adre">Thêm Địa Chỉ</router-link>

            <!-- Chọn địa chỉ -->
            <div class="select-group">
              <label for="address">Chọn địa chỉ nhận hàng</label>
              <select v-model="selectedAddress" id="address" @change="updateAddressInfo">
                <option v-for="address in addresses" :key="address.id" :value="address.id">
                  {{ address.street }}, {{ address.ward }}, {{ address.district }}, {{ address.province }},
                  {{ address.name }}, {{ address.phone }}, {{ address.email }}
                </option>
              </select>
            </div>

            <!-- Nếu có địa chỉ đã chọn -->
            <div v-if="selectedAddressInfo">
              <div class="form-row">
                <div class="input-group">
                  <label for="name">Họ và tên</label>
                  <input v-model="selectedAddressInfo.name" type="text" id="name" placeholder="Nhập tên" readonly />
                </div>
                <div class="input-group">
                  <label for="phone">Số điện thoại</label>
                  <input v-model="selectedAddressInfo.phone" type="text" id="phone" placeholder="Nhập số điện thoại"
                    readonly />
                </div>
                <div class="input-group">
                  <label for="email">Email</label>
                  <input v-model="selectedAddressInfo.email" type="email" id="email" placeholder="Nhập email"
                    readonly />
                </div>
              </div>
              <div class="input-group">
                <label for="address">Địa chỉ giao hàng</label>
                <input v-model="selectedAddressInfo.street" type="text" id="address" placeholder="Nhập địa chỉ"
                  readonly />
              </div>
              <div class="form-row">
                <div class="input-group">
                  <label for="province">Tỉnh/Thành</label>
                  <input v-model="selectedAddressInfo.province" type="text" id="province" placeholder="Nhập tỉnh/thành"
                    readonly />
                </div>
                <div class="input-group">
                  <label for="district">Quận/Huyện</label>
                  <input v-model="selectedAddressInfo.district" type="text" id="district" placeholder="Nhập quận/huyện"
                    readonly />
                </div>
                <div class="input-group">
                  <label for="ward">Xã/Phường</label>
                  <input v-model="selectedAddressInfo.ward" type="text" id="ward" placeholder="Nhập xã/phường"
                    readonly />
                </div>

              </div>
            </div>

          </div>

          <div class="form-section">
            <h3>2. Sản Phẩm Đã Chọn</h3>

            <div v-if="cartItems.length > 0">
              <table class="cart-table">
                <thead>
                  <tr>
                    <th>Hình Ảnh</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Số Lượng</th>
                    <th>Giá Bán</th>
                    <th>Tổng Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cartItems" :key="item.id">
                    <img :src="item.book.image" alt="Product Image" class="product-image" />

                    <td>{{ item.book.title }}</td>

                    <td>{{ item.quantity }}</td>

                    <td>{{ formatCurrency(item.price) }} </td>

                    <td>{{ formatCurrency(item.price * item.quantity) }} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <div class="form-section">
            <h3>3. Phương Thức Thanh Toán</h3>
            <div class="payment-method">
              <div>
                <input type="radio" id="cod" v-model="paymentMethod" name="payment" value="cod" readonly />
                <label for="cod">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div>
                <input type="radio" id="momo" v-model="paymentMethod" name="payment" value="momo" readonly />
                <label for="momo">Thanh toán bằng ví điện tử MOMO</label>
              </div>
              <div>
                <input type="radio" id="vnpay" v-model="paymentMethod" name="payment" value="vnpay" readonly />
                <label for="vnpay">Thanh toán bằng ví điện tử VNPAY</label>
              </div>
            </div>
          </div>
        </form>

        <div v-if="isPaymentSuccess" class="payment-success">
          <h2>Thanh toán thành công!</h2>
          <p>Đơn hàng của bạn đã được xác nhận.</p>
          <button @click="goToOrderPage" class="btn-success">Xem đơn hàng</button>
        </div>

        <div class="checkout-summary">
          <div class="form-section">
            <h3>4. Mã Giảm Giá</h3>
            <div class="discount-code">
              <input v-model="couponCode" type="text" placeholder="Nhập mã giảm giá..." />
              <button type="button" @click="applyDiscount" class="btn-apply">Sử Dụng</button>
            </div>

          </div>

          <!-- Tóm tắt đơn hàng -->
          <div class="summary">
            <h3>Đơn Hàng</h3>
            <div class="summary-item">
              <span>Tạm Tính:</span>
              <span>{{ formatCurrency(total) }}</span>
            </div>
            <div class="summary-item">
              <span>Phí vận chuyển:</span>
              <span>{{ formatCurrency(shippingFee) }}</span>
            </div>
            <!-- Hiển thị giảm giá (nếu có) -->
            <div v-if="discount > 0" class="summary-item">
              <span>Giảm giá:</span>
              <span>-{{ formatCurrency(discount) }}</span>
            </div>
            <div class="summary-total">
              <span>Tổng cộng:</span>
              <span>{{ formatCurrency(formattedTotal) }}</span>
            </div>
            <div class="summary-buttons">
              <router-link to="/cart" class="btn-back">Quay lại giỏ hàng</router-link>
              <router-link to="/order" @click.prevent="checkoutOrder" class="btn-order">Đặt Mua</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';

import {
  getAddresses
} from "@/service/AddressService";
import CartService from '@/service/CartService';
import FooterComponent from "./Footer.vue";
import { useToast } from 'primevue/usetoast'; // Import useToast

export default {
  name: "Checkout",
  components: {
    FooterComponent,
  },
  data() {

    return {
      cartItems: [],    
      total: 0,
      total_amount: 0, 

      addresses: [],
      shippingFee: 0,  
      discount: 0,
      couponCode: '', 
      isPaymentSuccess: false, 
      paymentMethod: 'cod',
      selectedAddress: '',
      selectedAddressInfo: null,
      savedAddresses: [],
      newAddress: {
        name: '',
        phone: '',
        address: '',
        email: '',
        district: '',
        ward: ''
      },
    };
  },
  computed: {
    formattedTotal() {
      const shippingFee = parseFloat(this.shippingFee) || 0; // Phí vận chuyển là 21000
      const discount = parseFloat(this.discount) || 0; // Giá trị giảm giá
      const total = parseFloat(this.total) || 0; // Tổng số tiền hiện tại

      this.total_amount = total + shippingFee - discount;

      this.total_amount = parseFloat(this.total_amount.toFixed(2));

      // console.log('Tổng cộng:', this.total_amount);

      return this.total_amount;
    },
    totalQuantity() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    total() {
      return this.cartItems.reduce(
        (total, item) => total + (item.quantity || 0) * (item.price || 0),
        0
      );
    },
  },

  setup() {
    const toast = useToast(); // Khai báo useToast
    return {
      toast, // Trả về để dùng trong methods
    };
  },
  methods: {
    async updateAddressInfo() {
      const selectedAddress = this.addresses.find(address => address.id === this.selectedAddress);

      if (selectedAddress) {
        // Lưu thông tin địa chỉ đã chọn
        this.selectedAddressInfo = { ...selectedAddress };

        // Gọi API tính phí vận chuyển cho giỏ hàng
        await this.updateShippingFee(selectedAddress);
      }
    }
    ,
    // Tính phí vận chuyển cho giỏ hàng
    async updateShippingFee() {
      const addressId = this.selectedAddress; // Use this.selectedAddress to get the selected address ID

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = localStorage.getItem("access_token");

      if (!token) {
        // console.error("Token không tồn tại. Người dùng có thể chưa đăng nhập.");
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/auth/checkout/shipping',
          { address_id: addressId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.shippingFee = response.data.shipping_fee;  //  API returns shipping fee as `shipping_fee`
        // console.log('Phí vận chuyển:', response.data);

      } catch (error) {
        if (error.response?.status === 401) {
          // console.error('Lỗi xác thực: Token không hợp lệ hoặc đã hết hạn');
        } else {
          // console.error('Lỗi khác:', error);
        }
      }

    },


    async loadCart() {
      try {
        const response = await CartService.getCart();
        if (response && response.cart) {
          this.cartItems = response.cart.items;
          this.total = response.cart.subtotal || 0;  // Ensure total is set correctly
        }
      } catch (error) {
        // console.error('Lỗi khi tải giỏ hàng:', error);
      }
    },
    async loadAddresses() {
      try {
        const response = await getAddresses();
        this.addresses = response.data;
        if (this.selectedAddress) {
          const selected = this.addresses.find(address => address.id === this.selectedAddress);
          if (selected) {
            this.selectedAddressInfo = selected;
          }
        }
      } catch (error) {
        // console.error("Lỗi khi tải danh sách địa chỉ:", error);
      }
    },
    async applyDiscount() {
      if (!this.couponCode) {
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = localStorage.getItem("access_token");

      if (!token) {
        // console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
        router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
        return;
      }


      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/auth/checkout/discount',
          { code: this.couponCode },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.discount > 0) {
          this.discount = response.data.discount || 0;
          this.discount_id = response.data.discount_id;

          this.toast.add({
            severity: "success",
            summary: "Thành công",
            detail: `Áp dụng mã giảm giá thành công! Bạn được giảm: ${this.formatCurrency(this.discount)}`,
            life: 3000,
          });
          return response.data;
        } else {
          this.toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: `Mã giảm giá không hợp lệ hoặc không có giảm giá.`,
            life: 3000,
          });
        }

      } catch (error) {
        if (error.response?.data?.message) {
          // Xử lý thông báo lỗi chi tiết từ API nếu có
        } else {
          this.toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: `Không thể áp dụng mã giảm giá. Vui lòng thử lại sau.`,
            life: 3000,
          });
        }
      }

    },

    async checkoutOrder() {
      if (!this.selectedAddress || !this.paymentMethod) {
        this.toast.add({
          severity: "warn",
          summary: "Không tìm thấy",
          detail: `Vui lòng chọn địa chỉ và phương thức thanh toán.`,
          life: 3000,
        });
        return;
      }

      const orderData = {
        address_id: this.selectedAddress,
        payment_method: this.paymentMethod,
        shipping_fee: this.shippingFee,
        discount_id: this.discount_id,
        discount: parseFloat(this.discount),
        total_amount: this.total_amount,
        items: this.cartItems.map(item => ({
          product_id: item.book.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      // console.log(orderData);

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = localStorage.getItem("access_token");

      if (!token) {
        //this.$router.push({ name: 'login' });  // Chuyển hướng đến trang đăng nhập
        return;
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/auth/checkout',
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.vnpUrl) {
          // console.log('Redirecting to VNPay...');
          window.location.href = response.data.vnpUrl;
          this.isPaymentSuccess = false; // Trạng thái thanh toán đang chờ xử lý

        }
        else if (response.data.momoUrl && response.data.momoUrl.original && response.data.momoUrl.original.momoUrl) {
          // console.log('Redirecting to MoMo...');
          window.location.href = response.data.momoUrl.original.momoUrl;
          this.isPaymentSuccess = false; // Trạng thái thanh toán đang chờ xử lý

        } else {
          // Xử lý thanh toán COD hoặc thông báo lỗi
          this.toast.add({
            severity: "success",
            summary: "Thành công",
            detail: "Đơn hàng của bạn đã được xác.Vui lòng theo dõi đơn hàng !",
            life: 3000,
          });
        }
      } catch (error) {
        // console.error("Lỗi khi đặt hàng:", error);
        this.toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Đặt hàng không thành công. Vui lòng thử lại sau.",
          life: 3000,
        });
      }
    },

    async handleVNPayCallback(urlParams) {
      try {

        const response = await this.$axios.get('http://127.0.0.1:8000/api/vnpay/callback', { params: urlParams });

      } catch (error) {
        // console.error('Lỗi callback VNPay:', error);
      }
    },
    async handleMoMoCallback(urlParams) {
      try {

        const response = await this.$axios.get('http://127.0.0.1:8000/api/momo/callback', { params: urlParams });
        // console.log(response.data)

        if (response.data.resultCode === '0') {

          this.toast.add({
            severity: "success",
            summary: "Thành công",
            detail: "Đơn hàng của bạn đã được xác.Vui lòng theo dõi đơn hàng !",
            life: 3000,
          }); this.isPaymentSuccess = true;
          console.log(this.isPaymentSuccess);
          this.$router.push({ name: 'order' });  

        } else {
          this.toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: "Thanh toán thất bại hoặc bị hủy. Vui lòng thử lại.",
            life: 3000,
          });
        }
      } catch (error) {
        // console.error("Lỗi callback MoMo:", error);
        // alert("Lỗi khi xử lý callback. Vui lòng thử lại sau.");

      }
    },

    goToOrderPage() {
      this.$router.push('/order');
    },


    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN').format(amount);
    },

  },

  mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('vnp_SecureHash')) {
      this.handleVNPayCallback(urlParams);
    }

    // Kiểm tra callback từ MoMo
    if (urlParams.has('resultCode')) {
      this.handleMoMoCallback(urlParams);
    }
  },

  created() {
    this.loadCart();  
    this.loadAddresses();

    if (this.selectedAddress) {
      this.updateShippingFee(this.selectedAddress);
    }
  },

};
</script>

<style>
/* Tổng quan */
body {
  background-color: #ffffff;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

/* Header */
.wrapper-header {
  color: #42596d;
  font-size: 15px;
  padding: 5px 0;
}

.header-top .container {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  font-size: 16px;
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
  margin: 0 auto;
}

.header-botton1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  margin: 0 50px;
}

.logo-img img {
  height: 70px;
  padding-left: 55px;
}

.header-botton1 .hidden-phone {
  font-size: 20px;
  padding-right: 55px;
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

/* Checkout */
h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.checkout-container {
  width: 1260px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Bố cục chính */
.checkout-layout {
  display: flex;
  gap: 30px;
}

/* Cột bên trái */
.checkout-form {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  background: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #555;
}

.input-row {
  display: flex;
  gap: 15px;
}

.add_adre {
  color: #007bff;
  font-weight: bold;
}

.select-group,
.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}

.select-group label,
.input-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.select-group select,
.input-group input {
  height: 40px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.select-group select:focus,
.input-group input:focus {
  border-color: #007bff;
  box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
}

/* Đặt các input nằm trên cùng một hàng */
.form-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  /* Khoảng cách giữa các input */
  margin-bottom: 15px;
  /* Khoảng cách dưới hàng */
}

.form-row .input-group {
  flex: 1;
  /* Đảm bảo các input có kích thước đồng đều */
}

.input-group label {
  display: block;
  /* Đảm bảo nhãn nằm trên input */
  margin-bottom: 5px;
  /* Khoảng cách giữa nhãn và input */
}

.input-group input {
  width: 100%;
  /* Input chiếm toàn bộ chiều rộng */
  padding: 10px;
  /* Thêm padding cho input */
  border: 1px solid #ccc;
  /* Viền của input */
  border-radius: 4px;
  /* Góc bo tròn */
  box-sizing: border-box;
  /* Đảm bảo padding không ảnh hưởng đến kích thước */
}

/* Bảng sản phẩm đã chọn */
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.cart-table th,
.cart-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.cart-table th {
  font-size: 14px;
  color: #333;
}

.cart-table td {
  font-size: 14px;
  color: #555;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

/* Cột bên phải */
.checkout-summary {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.discount-code {
  display: flex;
  gap: 10px;
}

.discount-code input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.discount-code .btn-apply {
  background-color: #28a745;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.discount-code .btn-apply:hover {
  background-color: #218838;
}

/* Tóm tắt đơn hàng */
.summary {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.summary h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #555;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #333;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 20px;
}

.summary-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-back,
.btn-order {
  flex: 1;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  height: 40px;
}

.btn-back {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  transition: background-color 0.3s ease;
  font-size: 12px;
}

.btn-back:hover {
  background-color: #e9ecef;
}

.btn-order {
  background-color: #007bff;
  color: #fff;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-order:hover {
  background-color: #0056b3;
}

/* Phương thức thanh toán */
.payment-method {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-method div {
  display: flex;
  align-items: center;
}

.payment-method input {
  margin-right: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .checkout-layout {
    flex-direction: column;
  }

  .checkout-summary {
    order: 1;
  }

  .checkout-form {
    order: 2;
  }
}
</style>