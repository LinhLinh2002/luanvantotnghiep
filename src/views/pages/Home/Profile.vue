<template>
  <HeaderComponent />

  <div class="profile-container">
    <h2>Tài Khoản Của Tôi</h2>

    <!-- Tabs for switching between Account and Address forms -->
    <div class="tab-buttons">
      <button @click="showForm('account')" :class="{ active: activeForm === 'account' }">Tài Khoản</button>
      <button @click="showForm('address')" :class="{ active: activeForm === 'address' }">Địa Chỉ Giao Hàng</button>
    </div>

    <!-- Account Info Form -->
    <form v-if="activeForm === 'account'" class="profile-form">
      <div class="form-section">
        <h3>Thông Tin Tài Khoản</h3>
        <label for="name">Tên Người Dùng *</label>
        <input type="text" id="name" v-model="user.name" placeholder="Nhập họ và tên" />

        <label for="email">E-mail *</label>
        <input type="email" id="email" v-model="user.email" disabled />

        <label for="password">Mật khẩu *</label>
        <input type="password" id="password" v-model="user.password" placeholder="Nhập mật khẩu" disabled />

        <label for="confirm-password">Xác nhận mật khẩu *</label>
        <input type="password" id="confirm-password" v-model="user.password" placeholder="Nhập lại mật khẩu" disabled />

        <button @click.prevent="updateUserInfo" class="submit-button">Lưu Thông Tin</button>
      </div>
    </form>

    <!-- Address Management Form -->
    <div v-if="activeForm === 'address'" class="profile-form">
      <h3>Địa Chỉ Giao Hàng</h3>

      <!-- Display message if no address exists -->
      <div v-if="addresses.length === 0">
        <p>Bạn chưa có địa chỉ. Vui lòng thêm địa chỉ mới.</p>
        <button @click="showAddAddressForm = true" class="submit-button">Thêm Địa Chỉ Mới</button>
      </div>

      <!-- Display addresses if any exist -->
      <div v-else>
        <div v-for="address in addresses" :key="address.id" class="address-item">
          <p><strong>Họ tên:</strong> {{ address.name }}</p>
          <p><strong>Số điện thoại:</strong> {{ address.phone }}</p>
          <p><strong>Email:</strong> {{ address.email }}</p>
          <p><strong>Địa chỉ:</strong> {{ address.street }}</p>
          <p><strong>Loại địa chỉ:</strong> {{ address.address_type }}</p>
          <p><strong>Mặc định:</strong> {{ address.is_default ? 'Có' : 'Không' }}</p>
          <p><strong>Tỉnh:</strong> {{ address.province }}</p>
          <p><strong>Quận/Huyện:</strong> {{ address.district }}</p>
          <p><strong>Phường/Xã:</strong> {{ address.ward }}</p>

          <div class="address-actions">
            <button @click="editAddress(address)">Sửa</button>
            <button @click="deleteAddress(address.id)">Xóa</button>
          </div>
        </div>
        <button @click="showAddAddressForm = true" class="submit-button">Thêm Địa Chỉ Mới</button>
      </div>

      <!-- Form to add/edit address -->
      <div v-if="showAddAddressForm" >
        <h2>{{ isEditing ? "Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới" }}</h2>
        <form @submit.prevent="saveAddress">
          <div>
            <label for="name">Họ và Tên:</label>
            <input v-model="newAddress.name" type="text" id="name" required />
          </div>
          <div>
            <label for="phone">Số Điện Thoại:</label>
            <input v-model="newAddress.phone" type="text" id="phone" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input v-model="newAddress.email" type="text" id="email" required />
          </div>
          <div>
            <label for="street">Địa Chỉ:</label>
            <input v-model="newAddress.street" type="text" id="street" required />
          </div>
          <div>
            <label for="province">Tỉnh:</label>
            <select v-model="newAddress.province_id" @change="fetchDistricts" required>
              <option value="" disabled>Chọn tỉnh</option>
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="district">Quận/Huyện:</label>
            <select v-model="newAddress.district_id" @change="fetchWards" :disabled="!districts.length" required>
              <option value="" disabled>Chọn quận/huyện</option>
              <option v-for="district in districts" :key="district.id" :value="district.id">
                {{ district.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="ward">Phường/Xã:</label>
            <select v-model="newAddress.ward_id" :disabled="!wards.length" required>
              <option value="" disabled>Chọn phường/xã</option>
              <option v-for="ward in wards" :key="ward.id" :value="ward.id">
                {{ ward.name }}
              </option>
            </select>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="default-address" v-model="newAddress.is_default" />
            <label for="default-address">Đặt làm địa chỉ mặc định</label>
          </div>

          <button type="submit">{{ isEditing ? "Lưu Thay Đổi" : "Thêm Địa Chỉ" }}</button>
        </form>
        <button @click="cancelAddAddress" class="cancel-button">Hủy</button>
      </div>
    </div>
  </div>

  <FooterComponent />
</template>

<script>
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';
import {
  getProvinces,
  getDistricts,
  getWards,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from "@/service/AddressService";

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      activeForm: "account",
      user: { name: "", email: "", password: '' },
      addresses: [],
      provinces: [],
      districts: [],
      wards: [],
      newAddress: {
        name: "",
        phone: "",
        street: "",
        email: "",
        address_type: "Home",
        is_default: false,
        province_id: null,
        district_id: null,
        ward_id: null,
      },
      showAddAddressForm: false,
      isEditing: false,
      editingAddressId: null
    };
  },
  mounted() {
    this.loadUserInfo();
    this.loadProvinces();
    this.loadAddresses();
  },
  methods: {
    showForm(form) {
      this.activeForm = form;
    },
    loadUserInfo() {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user) {
        this.user.name = user.name;
        this.user.email = user.email;
        this.user.password = "********"; // Hide password
      } else {
        alert("Bạn chưa đăng nhập!");
        this.$router.push({ name: 'login' });
      }
    },
    async loadProvinces() {
      try {
        const provinces = await getProvinces();
        console.log("Provinces loaded:", provinces);
        this.provinces = provinces.map(province => ({
          id: province.id,
          name: province.name
        }));
      } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh:", error);
      }
    },
    async loadAddresses() {
      try {
        const response = await getAddresses();
        console.log("Addresses loaded:", response);  // Debugging line
        this.addresses = response.data; // Assuming the API returns addresses in 'data'
      } catch (error) {
        console.error("Lỗi khi tải danh sách địa chỉ:", error);
      }
    },
    async fetchDistricts() {
      if (!this.newAddress.province_id) return;
      try {
        const districts = await getDistricts(this.newAddress.province_id);
        this.districts = districts.map(district => ({
          id: district.id,
          name: district.name
        }));
        this.newAddress.district_id = null;
        this.wards = [];
      } catch (error) {
        console.error("Lỗi khi tải danh sách quận/huyện:", error);
      }
    },
    async fetchWards() {
      if (!this.newAddress.district_id) return;
      try {
        const wards = await getWards(this.newAddress.district_id);
        this.wards = wards.map(ward => ({
          id: ward.id,
          name: ward.name
        }));
      } catch (error) {
        console.error("Lỗi khi tải danh sách phường/xã:", error);
      }
    },
    editAddress(address) {
      this.isEditing = true;
      this.showAddAddressForm = true;
      this.editingAddressId = address.id;
      this.newAddress = { ...address };
    },
    async saveAddress() {
      try {
        console.log("Saving address:", this.newAddress);
        if (this.isEditing) {
          await updateAddress(this.editingAddressId, this.newAddress);
        } else {
          await addAddress(this.newAddress);
        }
        this.loadAddresses();
        this.cancelAddAddress();
      } catch (error) {
        console.error("Error saving address:", error);
      }
    },
    cancelAddAddress() {
      this.showAddAddressForm = false;
      this.isEditing = false;
      this.newAddress = {
        name: "",
        phone: "",
        street: "",
        email: "",
        address_type: "Home",
        is_default: false,
        province_id: null,
        district_id: null,
        ward_id: null,
      };
    },
    async deleteAddress(id) {
      try {
        await deleteAddress(id);
        this.loadAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    },
    updateUserInfo() {
      console.log("Updating user info:", this.user);
      // Handle updating user info logic here
    }
  }
};
</script>

<style scoped>
/* CSS for Profile Page */
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.tab-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-buttons button {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
  border-radius: 4px;
}

.tab-buttons button:hover {
  background-color: #f4f4f4;
}

.tab-buttons .active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.profile-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.profile-form h3 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

.profile-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.profile-form input,
.profile-form select,
.profile-form button {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.profile-form input:focus,
.profile-form select:focus {
  border-color: #007bff;
  outline: none;
}

.checkbox-group {
  display: flex; /* Sử dụng flexbox để sắp xếp theo hàng */
  align-items: center; /* Căn chỉnh checkbox và chữ theo chiều dọc */
  gap: 5px; /* Khoảng cách nhỏ giữa checkbox và chữ */
  padding-bottom: 20px;
}

.checkbox-group input[type="checkbox"] {
  margin: 0; /* Xóa khoảng cách mặc định */
  padding: 0; /* Loại bỏ padding mặc định nếu có */
  width: auto; /* Đảm bảo không bị kéo dài bất thường */
}

.checkbox-group label {
  margin: 0; /* Xóa khoảng cách mặc định */
  padding: 0; /* Xóa padding không cần thiết */
  font-size: 16px; /* Đặt kích thước chữ phù hợp */
  color: #333; /* Đảm bảo màu sắc dễ nhìn */
  cursor: pointer; /* Cho phép click vào chữ để chọn checkbox */
}



.profile-form button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.profile-form button:hover {
  background-color: #0056b3;
}

.address-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.address-actions {
  display: flex;
  justify-content: space-between;
  gap: 120px;
  padding-top: 20px;
  padding-right: 10px;
  padding-left: 10px;
}

.address-actions button {
  background-color: #ff5722;
  color: #fff;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.address-actions button:hover {
  background-color: #e64a19;
}
.add-adres form {
  margin-left: 20px;
  position: relative;
  top: -1100px;
}
.submit-button {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #c82333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
  }

  .tab-buttons {
    flex-direction: column;
  }

  .tab-buttons button {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .profile-form input,
  .profile-form select,
  .profile-form button {
    padding: 12px;
  }
}
</style>