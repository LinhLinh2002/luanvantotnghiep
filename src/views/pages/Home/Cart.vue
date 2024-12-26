<template>
  <HeaderComponent />

  <div class="cart-container">
    <h2>CHI TIẾT GIỎ HÀNG</h2>

    <!-- Kiểm tra nếu không có sản phẩm trong giỏ -->
    <div v-if="cartItems.length">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Hình Ảnh</th>
            <th>Tên Sách</th>
            <th>Giá Sách</th>
            <th>Số Lượng</th>
            <th>Thành Tiền</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id">
            <td>
              <img :src="item.book.image" alt="Hình ảnh sách" class="product-image" />
            </td>
            <td>{{ item.book.title }}</td>
            <td>{{ formatCurrency(item.price) }} đ</td>
            <td>
              <div class="quantity-controls">
                <button @click="decreaseQuantity(item.id)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(item.id)">+</button>
              </div>
            </td>
            <td>{{ formatCurrency(item.price * item.quantity) }} đ</td>
            <td>
              <button @click="removeItem(item.id)" class="remove-button">
                <i class="fa fa-trash"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-footer">
        <p class="total">Tổng Cộng: {{ formatCurrency(total) }} đ</p>
        <div class="button-group">
          <div class="left-buttons">
            <router-link to="/bookstore" class="continue-shopping">
              Tiếp tục mua hàng
            </router-link>
            <button @click="clearCart" class="clear-cart-button">
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
          <router-link to="/checkout" class="checkout">
            Thanh Toán
          </router-link>
        </div>
      </div>
    </div>

    <!-- Thông báo khi giỏ hàng trống -->
    <div v-else class="empty-cart">
      <p>Giỏ hàng của bạn đang trống!</p>
      <router-link to="/bookstore" class="continue-shopping">Quay lại mua hàng</router-link>
    </div>
  </div>

  <FooterComponent />
</template>



<script>
import CartService from '@/service/CartService';
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';

export default {
  name: 'Cart',
  components: {
    HeaderComponent,
    FooterComponent
  },
  data() {
    return {
      cartItems: [],    // Array to store cart items
      couponCode: '',   // Coupon code for discount
      total: 0,         // Total price of items in the cart
    };
  },
  async mounted() {
    await this.loadCart();  // Load cart when component mounts
  },
  methods: {
    // Method to load the cart from API
    // Xử lý thanh toán

    async loadCart() {
      try {
        const response = await CartService.getCart();
        if (response && response.cart) {
          this.cartItems = response.cart.items;
          this.total = response.cart.subtotal || 0;  // Ensure total is set correctly
        }
      } catch (error) {
        console.error('Lỗi khi tải giỏ hàng:', error);
      }
    },

    // Method to increase product quantity in cart
    async increaseQuantity(id) {
      try {
        await CartService.increaseQuantity(id);
        await this.loadCart();  // Reload cart after updating quantity
        window.location.reload();

      } catch (error) {
        console.error('Lỗi khi tăng số lượng:', error);
      }
    },

    // Method to decrease product quantity in cart
    async decreaseQuantity(id) {
      try {
        await CartService.decreaseQuantity(id);
        await this.loadCart();  // Reload cart after updating quantity
        window.location.reload();

      } catch (error) {
        console.error('Lỗi khi giảm số lượng:', error);
      }
    },

    // Method to remove product from cart
    async removeItem(id) {
      try {
        await CartService.removeItem(id);  // Ensure using removeItem instead of removeFromCart
        await this.loadCart();  // Reload cart after removing item
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    },

    // Method to clear all items from cart
    async clearCart() {
      try {
        await CartService.clearCart();
        await this.loadCart();  // Reload cart after clearing
      } catch (error) {
        console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
      }
    },
    formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN').format(amount);
    },
  }
};
</script>

<style scoped>
/* Container chính của giỏ hàng */
.cart-container {
  width: 1180px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề chính */
h2 {
  text-align: start;
  color: #333;
  font-family: Inter, -apple-system, sans-serif;
  font-weight: 900;
  letter-spacing: normal;
  font-size: 20px;
  margin-bottom: 20px;
}

/* Bảng giỏ hàng */
.cart-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 14px;
}

.cart-table th,
.cart-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.cart-table th {
  background-color: #f7f7f7;
  font-weight: bold;
}

.cart-table .product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

/* Cải tiến điều chỉnh số lượng sản phẩm */
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
  width: 100px; /* Chiều rộng tổng */
  height: 36px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto; /* Đảm bảo căn giữa nằm giữa */

}

/* Nút tăng/giảm */
.quantity-controls button {
  width: 36px;
  height: 36px;
  background-color: transparent;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-controls button:hover {
  background-color: #f0f0f0;
}

/* Số lượng */
.quantity-controls span {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 36px;
}

/* Nút xóa */
.remove-button {
  background-color: #d9534f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #c9302c;
}

/* Footer tổng */
.cart-footer {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  /* Xếp dọc các phần tử */
  gap: 15px;
}

/* Thanh ngang trên "Tổng cộng" */
.total {
  font-weight: bold;
  font-size: 1.2em;
  color: #333;
  text-align: right;
  /* Canh phải */
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
  /* Thanh ngang trên */
}

/* Thanh ngang dưới "Tổng cộng" */
.total::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background-color: #ddd;
  /* Màu của thanh ngang */
  margin-top: 10px;
}

/* Nhóm các nút hành động */
.button-group {
  display: flex;
  justify-content: space-between;
  /* Tách nút bên trái và phải */
  align-items: center;
  /* Canh giữa theo chiều dọc */
  margin-top: 10px;
}

/* Nhóm nút bên trái */
.button-group .left-buttons {
  display: flex;
  gap: 10px;
  /* Khoảng cách giữa các nút bên trái */
}

/* Nút "Tiếp tục mua hàng" */
.continue-shopping {
  padding: 10px 15px;
  background-color: #034784;
  color: #fff;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}

/* Nút "Xóa giỏ hàng" */
.clear-cart-button {
  padding: 10px 15px;
  background-color: #d9534f;
  color: #fff;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}

/* Nút "Thanh toán" */
.checkout {
  padding: 10px 20px;
  background-color: #2320c5;
  color: #fff;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}


/* Nút tiếp tục mua hàng */
.continue-shopping {
  padding: 10px 15px;
  background-color: #034784;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s ease;
}

.continue-shopping:hover {
  background-color: #022d5a;
}

/* Nút xóa toàn bộ giỏ hàng */
.clear-cart-button {
  padding: 10px 15px;
  background-color: #d9534f;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-cart-button:hover {
  background-color: #c9302c;
}

/* Nút thanh toán */
.checkout {
  padding: 10px 15px;
  background-color: #2320c5;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s ease;
}

.checkout:hover {
  background-color: #1b18a5;
}
.empty-cart {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #333;
}

.empty-cart p {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 20px;
}

.empty-cart .continue-shopping {
  display: inline-block;
  padding: 10px 20px;
  background-color: #034784;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.empty-cart .continue-shopping:hover {
  background-color: #022d5a;
}

</style>