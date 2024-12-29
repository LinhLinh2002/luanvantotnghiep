<template>
  <HeaderComponent />
  <Toast />

  <div class="profile-container">
    <h2>Tài Khoản Của Tôi</h2>

    <!-- Tabs for switching between Account and Address forms -->
    <div class="tab-buttons">
      <button @click="showForm('account')" :class="{ active: activeForm === 'account' }">Tài Khoản</button>
      <button @click="showForm('address')" :class="{ active: activeForm === 'address' }">Địa Chỉ Giao Hàng</button>
    </div>

    <!-- Account Info Form -->
    <form v-if="activeForm === 'account'" class="profile-form" @submit.prevent="updateUserInfo">
      <div class="form-section">
        <h3>Thông Tin Tài Khoản</h3>
        <label for="name">Tên Người Dùng *</label>
        <input type="text" id="name" v-model="user.name" placeholder="Nhập họ và tên" required />

        <label for="email">E-mail *</label>
        <input type="email" id="email" v-model="user.email" disabled />

        <label for="password">Mật khẩu *</label>
        <input type="password" id="password" v-model="user.password" placeholder="Nhập mật khẩu" disabled />

        <label for="confirm-password">Xác nhận mật khẩu *</label>
        <input type="password" id="confirm-password" v-model="user.password" placeholder="Nhập lại mật khẩu" disabled />

        <button type="submit" class="submit-button">Lưu Thông Tin</button>
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
      <div :class="['overlay', showAddAddressForm ? '' : 'hidden']">
        <div class="popup-form">
          <h2>{{ isEditing ? "Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới" }}</h2>
          <form @submit.prevent="saveAddress">

            <div class="input-row">
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
                <input v-model="newAddress.email" type="email" id="email" required />
              </div>
            </div>

            <div class="input-row">
              <div class="input-wide">
                <label for="street">Địa Chỉ:</label>
                <input v-model="newAddress.street" type="text" id="street" required />
              </div>
            </div>

            <div class="input-row">
              <div>
                <label for="province">Tỉnh:</label>
                <select v-model="newAddress.province_id" @change="fetchDistricts" required>
                  <option value="" disabled>Chọn tỉnh</option>
                  <option v-for="province in provinces" :key="province.id" :value="province.id"
                    :placeholder="province.name">
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
            </div>

            <!-- <div class="checkbox-group">
                <input type="checkbox" id="default-address" v-model="newAddress.is_default" />
                <label for="default-address">Đặt làm địa chỉ mặc định</label>
              </div> -->

            <button type="submit">{{ isEditing ? "Lưu Thay Đổi" : "Thêm Địa Chỉ" }}</button>
            <button @click="cancelAddAddress" type="button" class="cancel-button">Hủy</button>
          </form>
        </div>
      </div>


    </div>
  </div>

  <FooterComponent />
</template>

<script>
import {
  addAddress,
  deleteAddress,
  getAddresses,
  getDistricts,
  getProvinces,
  getWards,
  updateAddress
} from "@/service/AddressService";
import AuthService from '@/service/AuthService';
import { useToast } from 'primevue/usetoast'; // Import useToast
import FooterComponent from './Footer.vue';
import HeaderComponent from './Header.vue';

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      activeForm: "address",
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
  setup() {
    const toast = useToast(); // Khai báo useToast
    return {
      toast, // Trả về để dùng trong methods
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
    validatePhoneNumber(phone) {
      const phoneRegex = /^[0-9]{10}$/;
      return phoneRegex.test(phone);
    },
    loadUserInfo() {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user) {
        this.user.name = user.name;
        this.user.email = user.email;
        this.user.password = "********"; // Hide password
      } else {
        // alert("Bạn chưa đăng nhập!");
        this.$router.push({ name: 'login' });
      }
    },
    async loadProvinces() {
      try {
        const provinces = await getProvinces();
        // console.log("Provinces loaded:", provinces);
        this.provinces = provinces.map(province => ({
          id: province.id,
          name: province.name
        }));
      } catch (error) {
        // console.error("Lỗi khi tải danh sách tỉnh:", error);
      }
    },
    async loadAddresses() {
      try {
        const response = await getAddresses();
        // console.log("Addresses loaded:", response);  // Debugging line   
        this.addresses = response.data; // Assuming the API returns addresses in 'data'
      } catch (error) {
        // console.error("Lỗi khi tải danh sách địa chỉ:", error);
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
        // Đảm bảo district_id được duy trì nếu nó còn hợp lệ
        if (!this.districts.some(d => d.id === this.newAddress.district_id)) {
          this.newAddress.district_id = null;
        }
        this.wards = []; // Xóa danh sách phường/xã cũ
      } catch (error) {
        // console.error("Lỗi khi tải danh sách quận/huyện:", error);
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
        // Đảm bảo ward_id được duy trì nếu nó còn hợp lệ
        if (!this.wards.some(w => w.id === this.newAddress.ward_id)) {
          this.newAddress.ward_id = null;
        }
      } catch (error) {
        // console.error("Lỗi khi tải danh sách phường/xã:", error);
      }
    },
    async editAddress(address) {
      this.isEditing = true;
      this.showAddAddressForm = true;
      this.editingAddressId = address.id;
      this.newAddress = { ...address }; // Sao chép dữ liệu địa chỉ cần sửa

      // Tải danh sách tỉnh, quận/huyện, phường/xã
      if (!this.provinces.length) {
        await this.loadProvinces();
      }
      if (this.newAddress.province_id) {
        await this.fetchDistricts(); // Tải quận/huyện theo tỉnh
      }
      if (this.newAddress.district_id) {
        await this.fetchWards(); // Tải phường/xã theo quận/huyện
      }
    },

    async saveAddress() {
      if (!this.validatePhoneNumber(this.newAddress.phone)) {
        // alert("Số điện thoại phải bao gồm đúng 10 chữ số.");
        this.toast.add({
          severity: "warn",
          summary: "Lỗi",
          detail: `Số điện thoại phải bao gồm đúng 10 chữ số.`,
          life: 3000,
        });
        return;
      }
      try {
        // console.log("Saving address:", this.newAddress);
        if (this.isEditing) {
          await updateAddress(this.editingAddressId, this.newAddress);
        } else {
          await addAddress(this.newAddress);
        }
        this.loadAddresses();
        this.showAddAddressForm = false;
      } catch (error) {
        // console.error("Error saving address:", error);
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
    async deleteAddress(addressId) {
      try {
        await deleteAddress(addressId);
        this.loadAddresses();
      } catch (error) {
        // console.error("Lỗi khi xóa địa chỉ:", error);
      }
    },
    async updateUserInfo() {
      this.loading = true;
      this.error = null;

      try {
        const updatedUser = await AuthService.updateProfile(this.user);  // Gọi hàm updateProfile
        this.user = updatedUser; // Cập nhật lại thông tin người dùng trong component nếu cần
        // alert("Thông tin tài khoản đã được cập nhật thành công!");
      } catch (error) {
        this.error = "Có lỗi xảy ra trong quá trình cập nhật. Vui lòng thử lại!";
        // console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* CSS cho trang tài khoản */

/* Container chính */
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề chính */
h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

/* Tabs chuyển đổi giữa Tài Khoản và Địa Chỉ */
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

/* Form chỉnh sửa thông tin */
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

/* Danh sách địa chỉ */
.address-item {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.address-item p {
  flex: 1 1 calc(33.333% - 15px);
  margin: 0;
  padding: 5px;
  box-sizing: border-box;
}

.address-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  padding-left: 350px;
}

.address-actions button {
  max-width: 120px;
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

/* Popup thêm/sửa địa chỉ */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 70%;
  position: relative;
}

.popup-form h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

.popup-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.input-row>div {
  flex: 1;
  min-width: 150px;
}

.input-wide {
  flex: 100%;
}

.popup-form form button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.popup-form form button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #c82333;
}

/* Ẩn overlay và popup khi không sử dụng */
.hidden {
  display: none;
}

/* Responsive */
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
}
</style>