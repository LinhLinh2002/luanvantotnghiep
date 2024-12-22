import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/auth"; // API base URL cho xác thực

export default {
  // Lưu token và thông tin người dùng vào localStorage
  saveToken(tokenData) {
    localStorage.setItem('currentUser', JSON.stringify(tokenData));
  },

  // Lấy token từ localStorage
  getToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.token : null;
  },

  // Xóa token khỏi localStorage (đăng xuất)
  removeToken() {
    localStorage.removeItem('currentUser');
  },

  // Gửi yêu cầu đăng nhập
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const { data } = response;

      // Lưu token và thông tin người dùng vào localStorage
      const tokenData = {
        name: data.data.user.name,
        token: data.data.token,
        user_id: data.data.user.id,
        email: data.data.user.email,
      };
      this.saveToken(tokenData);

      return data;
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      throw error; // Propagate lỗi để xử lý bên ngoài
    }
  },

  // Gửi yêu cầu đăng ký
  async register(userInfo) {
    try {
      const response = await axios.post(`${API_URL}/register`, userInfo);
      const { data } = response;

      // Nếu backend trả về token sau khi đăng ký, lưu trữ token
      if (data.data && data.data.token) {
        const tokenData = {
          name: data.data.user.name,
          token: data.data.token,
          user_id: data.data.user.id,
          email: data.data.user.email,
        };
        this.saveToken(tokenData);
      }

      return data;
    } catch (error) {
      console.error("Registration failed:", error.response ? error.response.data : error.message);
      throw error; // Propagate lỗi để xử lý bên ngoài
    }
  },

  // Lấy thông tin profile của người dùng đã đăng nhập
  async getProfile() {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
      return response.data; // Trả về thông tin profile
    } catch (error) {
      console.error("Profile retrieval failed:", error.response ? error.response.data : error.message);
      throw error; // Propagate lỗi
    }
  },

  // Cập nhật thông tin profile của người dùng
async updateProfile(profileData) {
  try {
    const token = this.getToken();  // Lấy token từ localStorage
    if (!token) {
      throw new Error("Token không tồn tại. Bạn cần đăng nhập lại.");
    }
    
    const response = await axios.put(`${API_URL}/profile/update`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data; // Trả về thông tin profile đã cập nhật
  } catch (error) {
    console.error("Profile update failed:", error.response ? error.response.data : error.message);
    throw error; // Propagate lỗi
  }
},


  // Gửi yêu cầu quên mật khẩu
  async forgotPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/password/forgot`, { email });
      return response.data;
    } catch (error) {
      console.error("Forgot password failed:", error.response ? error.response.data : error.message);
      throw error; // Propagate lỗi để xử lý bên ngoài
    }
  },

  // Gửi yêu cầu reset mật khẩu
  async resetPassword(email, password, passwordConfirmation, token) {
    try {
      const response = await axios.post(`${API_URL}/password/reset`, {
        email,
        password,
        password_confirmation: passwordConfirmation,
        token,
      });
      return response.data; // Trả về thông báo thành công
    } catch (error) {
      console.error("Password reset failed:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
};
