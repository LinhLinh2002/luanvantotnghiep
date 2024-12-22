<template>
  <HeaderComponent />

  <div class="cart-container">
    <h2>CHI TIẾT GIỎ HÀNG</h2>

    <!-- Render cart items if available -->
    <div v-if="cartItems.length > 0" class="cart-items">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.book.image" alt="Product Image" class="product-image" />
        <div class="product-info">
          <span class="product-title">{{ item.book.title }}</span>
          <span class="product-price">{{ formatCurrency(item.price) }} </span>
          <div class="quantity-controls">
            <button @click="decreaseQuantity(item.id)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item.id)">+</button>
          </div>
          <span class="product-total">{{ formatCurrency(item.price * item.quantity) }} </span>
          <button @click="removeItem(item.id)" class="remove-button">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Show message when cart is empty -->
    <div v-else>
      <p>Giỏ hàng của bạn trống.</p>
    </div>

    <!-- Cart footer with total and coupon section -->
    <div class="cart-footer" v-if="cartItems.length">
      <p class="total">Tổng Cộng: {{ formatCurrency(total) }} </p>

      <div class="button-group">
        <!-- Nhóm nút bên trái -->
        <div class="left-buttons">
          <router-link to="/bookstore" class="continue-shopping">
            Tiếp tục mua hàng
          </router-link>

          <button @click="clearCart" class="clear-cart-button">
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        <!-- Nút bên phải -->
        <router-link to="/checkout" class="checkout">
          Thanh Toán
        </router-link>
      </div>

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
      if (!amount && amount !== 0) {
        return "0 đ";
      }
      return amount.toLocaleString("vi-VN") + " đ";
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

/* Danh sách sản phẩm */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Từng sản phẩm trong danh sách */
.cart-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  gap: 15px;
}

/* Hình ảnh sản phẩm */
.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

/* Thông tin sản phẩm (Tên, giá, số lượng, tổng tiền) */
.product-info {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 0.5fr;
  align-items: center;
  width: 100%;
  gap: 15px;
  font-size: 14px;
}

/* Tên sản phẩm */
.product-title {
  font-weight: bold;
  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Giá sản phẩm */
.product-price,
.product-total {
  text-align: center;
  font-weight: bold;
  color: #034784;
}

/* Điều chỉnh số lượng sản phẩm */
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* Nút điều chỉnh số lượng */
.quantity-controls button {
  padding: 5px 10px;
  background-color: #034784;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-controls button:hover {
  background-color: #022d5a;
}

/* Nút xóa sản phẩm */
.remove-button {
  background-color: #d9534f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
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
</style>