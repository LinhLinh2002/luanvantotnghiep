import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/auth"; // Your API base URL for authentication

export default {
  // Save the token to localStorage
  saveToken(tokenData) {
    localStorage.setItem('currentUser', JSON.stringify(tokenData));
  },

  // Get the token from localStorage
  getToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.token : null;
  },

  // Remove the token from localStorage (logout)
  removeToken() {
    localStorage.removeItem('currentUser');
  },
  
  setToken(token) {
    localStorage.setItem('token', token);  // Lưu token vào localStorage
  },

  // Send a login request to the backend and return the response
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const { data } = response;
      
      // Save the token and user info to localStorage
      const tokenData = {
        name: data.data.user.name,
        token: data.data.token,
        user_id: data.data.user.id,
        email: data.data.user.email,
      };
      
      this.saveToken(tokenData);
      
      return data;
    } catch (error) {
      throw error; // Propagate the error so it can be handled in the component
    }
  },

  
};
