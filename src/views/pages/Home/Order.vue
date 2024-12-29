<template>
  <HeaderComponent />
  <div class="order-container">
    <h2>Đơn Hàng Của Tôi</h2>

    <!-- Hiển thị danh sách đơn hàng -->
    <div v-if="orders.length > 0" class="order-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order Date</th>
            <th>Shipping Fee</th>
            <th>Giá Giảm</th>
            <th>Total</th>
            <th>Status</th>
            <th>Chi Tiết</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td> {{ order.order_date }}</td>
            <td> {{ formatCurrency(order.shipping_fee) }} đ</td>
            <td>{{ formatCurrency(order.total_discount) }} </td>
            <td> {{ formatCurrency(order.total_amount) }} đ</td>
            <td>
              <span :class="formatOrderStatus(order.order_status).class">
                {{ formatOrderStatus(order.order_status).label }}
              </span>
            </td>
            <td>
              <router-link :to="{ name: 'orderdetails', params: { id: order.id } }">
                <i class="view-icon fas fa-eye"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <p>Không có đơn hàng nào.</p>
    </div>
  </div>
  <FooterComponent />
</template>

<script>
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';
import OrderService from '@/service/OrderService';

export default {
  name: 'Order',
  components: {
    HeaderComponent,
    FooterComponent
  },
  data() {
    return {
      orders: [],  // Lưu trữ danh sách đơn hàng
    };
  },
  created() {
    this.fetchOrders();  // Gọi hàm lấy đơn hàng khi component được tạo
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN').format(amount);
    },
    // Hàm lấy đơn hàng từ API
    async fetchOrders() {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          throw new Error("User is not logged in");
        }

        // Check if the user is an admin or a regular user
        if (currentUser.role === 'admin') {
          this.orders = await OrderService.getAdminOrders(); // Fetch orders for admin
        } else {
          this.orders = await OrderService.getUserOrders(); // Fetch orders for user
        }
      } catch (error) {
        this.error = "Lỗi khi tải danh sách đơn hàng: " + error.message;
        console.error(this.error);
      }
    },

    formatOrderStatus(status) {
      const statusMap = {
        ordered: { label: "Đã đặt hàng", class: "status-ordered" },
        shipping: { label: "Đang giao hàng", class: "status-shipping" },
        delivered: { label: "Đã giao hàng", class: "status-delivered" },
        rejected: { label: "Từ chối nhận hàng", class: "status-rejected" },
        returned: { label: "Đã hoàn trả", class: "status-returned" },
        canceled: { label: "Đã hủy", class: "status-canceled" },
      };

      return statusMap[status] || { label: "Không xác định", class: "status-default" };
    }

  },
};
</script>

<style scoped>
.order-container {
  width: 1180px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.order-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.order-list th,
.order-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.order-list th {
  background-color: #034784;
  color: white;
  font-weight: bold;
}

.order-list td {
  font-size: 14px;
  color: #333;
}

/* Styles for different order statuses */
.order-list .status-canceled {
  background-color: #ffdddd;
  color: red;
  padding: 3px 5px;
  border-radius: 3px;
}

.order-list .status-shipping {
  background-color: #fff5cc;
  color: orange;
  padding: 3px 5px;
  border-radius: 3px;
}

.order-list .status-delivered {
  background-color: #d4edda;
  color: green;
  padding: 3px 5px;
  border-radius: 3px;
}

.order-list .status-rejected {
  background-color: #ffcccc;
  color: darkred;
  padding: 3px 5px;
  border-radius: 3px;
}

.order-list .status-returned {
  background-color: #f8d7da;
  color: #721c24;
  padding: 3px 5px;
  border-radius: 3px;
}

.order-list .status-ordered {
  background-color: rgb(180, 179, 179);
  color: rgb(56, 55, 55);
  padding: 3px 5px;
  border-radius: 3px;
}

.order-list .status-default {
  background-color: #e9ecef;
  color: #333;
  padding: 3px 5px;
  border-radius: 3px;
}


.view-icon {
  font-size: 18px;
  color: #007bff;
  cursor: pointer;
}

.view-icon:hover {
  color: #0056b3;
}
</style>
