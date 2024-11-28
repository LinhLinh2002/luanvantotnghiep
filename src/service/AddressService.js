import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api";

// Hàm lấy token từ localStorage (nếu có)
export const getToken = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser?.token?.access_token;
};

// Hàm lấy danh sách tỉnh (Provinces) - Không cần token
export const getProvinces = async () => {
    try {
        const response = await axios.get(`${API_URL}/provinces`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh:", error);
        throw error;
    }
};

// Hàm lấy danh sách quận/huyện theo tỉnh (Districts) - Không cần token
export const getDistricts = async (provinceId) => {
    try {
        const response = await axios.get(`${API_URL}/districts?province_id=${provinceId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải danh sách quận/huyện:", error);
        throw error;
    }
};

// Hàm lấy danh sách phường/xã theo quận/huyện (Wards) - Không cần token
export const getWards = async (districtId) => {
    try {
        const response = await axios.get(`${API_URL}/wards?district_id=${districtId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải danh sách xã/phường:", error);
        throw error;
    }
};

// Hàm lấy danh sách địa chỉ của người dùng (Cần token)
export const getAddresses = async () => {
    const token = getToken();
    if (!token) {
        console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
        alert("Bạn cần đăng nhập để lấy danh sách địa chỉ.");
        return;
    }

    try {
        const response = await axios.get(`${API_URL}/auth/addresses`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải danh sách địa chỉ:", error);
        throw error;
    }
};

// Hàm thêm địa chỉ mới (Cần token)
export const addAddress = async (address) => {
    const token = getToken();
    if (!token) {
        console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
        alert("Bạn cần đăng nhập để thêm địa chỉ.");
        return;
    }

    try {
        const response = await axios.post(`${API_URL}/auth/addresses`, address, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm địa chỉ:", error);
        throw error;
    }
};

// Hàm cập nhật địa chỉ (Cần token)
export const updateAddress = async (addressId, address) => {
    const token = getToken();
    if (!token) {
        console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
        alert("Bạn cần đăng nhập để cập nhật địa chỉ.");
        return;
    }

    try {
        const response = await axios.put(`${API_URL}/auth/addresses/${addressId}`, address, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật địa chỉ:", error);
        throw error;
    }
};

// Hàm xóa địa chỉ (Cần token)
export const deleteAddress = async (addressId) => {
    const token = getToken();
    if (!token) {
        console.error("Không tìm thấy token. Người dùng cần đăng nhập.");
        alert("Bạn cần đăng nhập để xóa địa chỉ.");
        return;
    }

    try {
        const response = await axios.delete(`${API_URL}/auth/addresses/${addressId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        throw error;
    }
};
