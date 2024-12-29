<template>
  <HeaderComponent />
  <Toast />

  <div class="order-container">
    <h2>Chi Tiết Đơn Hàng</h2>

    <!-- Hiển thị thông tin đơn hàng -->
    <div v-if="order">
      <table class="order-info-table">
        <tr>
          <td><strong>Tên </strong></td>
          <td>{{ order.name }}</td>
        </tr>
        <tr>
          <td><strong>Số điện thoại </strong></td>
          <td>{{ order.phone }}</td>
        </tr>
        <tr>
          <td><strong>Địa chỉ </strong></td>
          <td>{{ order.street }}, {{ order.ward.name }}, {{ order.district.name }}, {{ order.province.name }}</td>
        </tr>
        <tr>
          <td><strong>Mã Đơn Hàng:</strong></td>
          <td>{{ order.id }}</td>
        </tr>
        <tr>
          <td><strong>Ngày Đặt:</strong></td>
          <td>{{ formatDate(order.order_date) }}</td>
        </tr>
        <tr>
          <td><strong>Trạng Thái:</strong></td>
          <td>
            <span :class="translateOrderStatus(order.order_status).class">
              {{ translateOrderStatus(order.order_status).label }}
            </span>
          </td>
        </tr>
        <tr>
          <td><strong>Giảm Giá:</strong></td>
          <td>{{ formatPrice(order.total_discount) }}</td>
        </tr>
        <tr>
          <td><strong>Phí Vận Chuyển:</strong></td>
          <td>{{ formatPrice(order.shipping_fee) }}</td>
        </tr>
        <tr>
          <td><strong>Tổng Thanh Toán:</strong></td>
          <td>{{ formatPrice(order.total_amount) }}</td>
        </tr>
      </table>

      <h3>Sản Phẩm Trong Đơn Hàng</h3>
      <table class="order-items-table">
        <thead>
          <tr>
            <th>Tên Sản Phẩm</th>
            <th>Số Lượng</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.order_details" :key="item.id">
            <td>{{ item.book ? item.book.title : "Đang tải..." }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatPrice(item.price) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Hiển thị thông tin giao dịch -->
      <div v-if="order.transaction">
        <h3>Thông Tin Giao Dịch</h3>
        <table class="transaction-info-table">
          <tr>
            <td><strong>Mã Giao Dịch:</strong></td>
            <td>{{ order.transaction.id }}</td>
          </tr>
          <tr>
            <td><strong>Phương Thức Thanh Toán:</strong></td>
            <td>{{ order.transaction.payment_method }}</td>
          </tr>
          <tr>
            <td><strong>Trạng Thái Thanh Toán:</strong></td>
            <td>
              <span :class="getTransactionStatusClass(order.transaction.transaction_status)">
                {{ formatTransactionStatus(order.transaction.transaction_status) }}

              </span>
            </td>
          </tr>
          <tr>
            <td><strong>Ngày Thanh Toán:</strong></td>
            <td>{{ formatDate(order.transaction.transaction_date) }}</td>
          </tr>
        </table>
      </div>

      <!-- Hiển thị nút Hủy Đơn hoặc Quay lại Trang Chủ -->
      <button v-if="order.order_status !== 'canceled'
        && order.order_status !== 'shipping'
        && order.order_status !== 'delivered'
        && order.order_status !== 'rejected'
        && order.order_status !== 'returned'" @click="cancelOrder">
        Hủy Đơn Hàng
      </button>
      <button v-else @click="goToHomePage" class="btn-go-home">
        Quay Lại Trang Chủ
      </button>

    </div>

    <div v-else>
      <p>Đang tải thông tin đơn hàng...</p>
    </div>
  </div>
  <FooterComponent />
</template>


<script>
import { mapState } from "vuex";
import FooterComponent from "./Footer.vue";
import HeaderComponent from "./Header.vue";
import OrderService from "@/service/OrderService";
import { useToast } from 'primevue/usetoast'; // Import useToast

export default {
  name: "OrderDetails",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      order: null,
      orderId: this.$route.params.id, // ID đơn hàng từ URL
    };
  },
  setup() {
    const toast = useToast(); // Khai báo useToast
    return {
      toast, // Trả về để dùng trong methods
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  async created() {
    try {
      this.order = await OrderService.getOrderById(this.orderId);
    } catch (error) {
      // console.error("Lỗi khi tải chi tiết đơn hàng:", error);
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN"); // Format ngày kiểu Việt Nam
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("vi-VN") + " VND";
    },
    async cancelOrder() {
      if (confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) {
        try {
          await OrderService.updateOrderStatus(this.orderId, "canceled");
          this.order.order_status = "canceled";
          // alert("Đơn hàng đã được hủy.");
          this.toast.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đơn hàng đã được hủy.',
            life: 3000,
          });
          this.$router.push({ name: 'order' });
        } catch (error) {
          // console.error("Lỗi khi hủy đơn hàng:", error);
          // alert("Có lỗi xảy ra khi hủy đơn hàng.");
          this.toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Có lỗi xảy ra khi hủy đơn hàng.',
            life: 3000,
          });
        }
      }
    },
    goToHomePage() {
      this.$router.push({ name: 'bookstore' });
    },
    translateOrderStatus(status) {
      const statusMap = {
        ordered: "Đã đặt hàng",
        shipping: "Đang giao hàng",
        delivered: "Đã giao hàng",
        rejected: "Từ chối nhận hàng",
        returned: "Đã hoàn trả",
        canceled: "Đã hủy",
      };

      // Return both the translated status and the corresponding CSS class
      return {
        label: statusMap[status] || "Không xác định",
        class: `status-${status}`  // This will map to the class name like status-ordered, status-shipping, etc.
      };
    },


    formatTransactionStatus(status) {
      const statusMap = {
        pending: 'Đang chờ xử lý',
        paid: 'Hoàn thành',
        failed: 'Thất bại',
        refunded: 'Đã hoàn tiền',
      };
      return statusMap[status] || 'Không xác định';
    },
    getTransactionStatusClass(transaction_status) {
      switch (transaction_status) {
        case "pending":
          return "status-pending";
        case "paid":
          return "status-paid";
        case "refunded":
          return "status-refunded";
        case "failed":
          return "status-failed";
        default:
          return "status-default";
      }
    },
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.transaction-info-table,
.order-info-table,
.order-items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.transaction-info-table td,
.order-info-table td,
.order-items-table th,
.order-items-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  font-size: 1.1rem;
  color: #333;
}

.transaction-info-table td:first-child,
.order-info-table td:first-child,
.order-items-table th {
  width: 200px;
}

.status-pending {
  background-color: #fff5cc;
  color: orange;
  padding: 3px 5px;
  border-radius: 3px;
}

.status-paid {
  background-color: #d4edda;
  color: green;
  padding: 3px 5px;
  border-radius: 3px;
}

.status-failed {
  background-color: #ffdddd;
  color: red;
  padding: 3px 5px;
  border-radius: 3px;
}

.order-info-table,
.order-items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.order-info-table td,
.order-items-table th,
.order-items-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.order-items-table th {
  background-color: #034784;
  color: white;
  font-weight: bold;
}

.order-info-table td {
  font-size: 1.1rem;
  color: #333;
}

.order-items-table td {
  font-size: 1rem;
  color: #333;
}

.order-info-table td:first-child,
.order-items-table th {
  width: 200px;
}

button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin-top: 45px;
  width: 100%;
}

button:hover {
  background-color: #c0392b;
}

button:focus {
  outline: none;
}

.btn-go-home {
  background-color: #3498db;
  /* Màu xanh dương */
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin-top: 45px;
  width: 100%;
}

.btn-go-home:hover {
  background-color: #2980b9;
  /* Màu khi hover */
}

.btn-go-home:focus {
  outline: none;
}


.status-ordered {
  background-color: #fff5cc;
  color: orange;
  padding: 3px 5px;
  border-radius: 3px;
}

.status-shipping {
  background-color: #d4edda;
  color: green;
  padding: 3px 5px;
  border-radius: 3px;
}

.status-delivered {
  background-color: #d4edda;
  color: green;
  padding: 3px 5px;
  border-radius: 3px;
}

.status-rejected {
  background-color: #ffdddd;
  color: red;
  padding: 3px 5px;
  border-radius: 3px;
}

.status-returned {
  background-color: #f8d7da;
  color: #721c24;
  padding: 3px 5px;
  border-radius: 3px;
}

.status-canceled {
  background-color: #ffdddd;
  color: red;
  padding: 3px 5px;
  border-radius: 3px;
}
</style>
