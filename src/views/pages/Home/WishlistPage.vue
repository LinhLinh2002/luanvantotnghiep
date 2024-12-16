<template>
  <HeaderComponent />
  <div class="wishlist-container">
    <h2>Danh sách yêu thích</h2>

    <div v-if="wishlist.length > 0" class="wishlist">
      <router-link v-for="item in wishlist" :key="item.id" :to="{ name: 'bookdetails', params: { id: item.book.id } }"
        class="wishlist-item">
        <div class="wishlist-item-info">
          <img :src="item.book.image" alt="Book Image" class="wishlist-item-image" />
          <div class="wishlist-item-details">
            <h3>{{ item.book.title }}</h3>
            <p>{{ item.book.author }}</p>
            <p class="price">{{ item.book.original_price }} đ</p>
          </div>
        </div>
        <button class="remove-button" @click.prevent="removeFromWishlist(item.id)">
          <i class="bx bx-trash"></i> Xóa
        </button>
      </router-link>


    </div>

    <div v-else class="empty-wishlist">
      <p>Danh sách yêu thích của bạn đang trống.</p>
    </div>

    <router-link to="/bookstore" class="continue-shopping-button black-button">Tiếp Tục Mua Hàng</router-link>

  </div>
  <FooterComponent />
</template>

<script>
import WishlistService from '@/service/WishlistService';
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';

export default {
  name: 'WishlistPage',
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      wishlist: [], // Danh sách sách yêu thích
    };
  },
  async mounted() {
    await this.loadWishlist();
  },
  methods: {
    async loadWishlist() {
      try {
        const response = await WishlistService.getWishlist();
        this.wishlist = response.data; // Cập nhật danh sách yêu thích
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
      }
    },
    async removeFromWishlist(id) {
      try {
        await WishlistService.removeFromWishlist(id); // Gọi API xóa sách khỏi yêu thích
        this.wishlist = this.wishlist.filter(item => item.id !== id); // Xóa khỏi danh sách
      } catch (error) {
        console.error('Lỗi khi xóa sách khỏi danh sách yêu thích:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Wishlist Container Styles */
.wishlist-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Title Styles */
h2 {
  text-align: center;
  color: #333;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 30px;
}

/* Wishlist Items Styles */
.wishlist {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* Ensure 4 items per row */
  gap: 15px;
  justify-content: center;
}

.wishlist-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
  margin-bottom: 30px;
}

.wishlist-item:hover {
  transform: scale(1.02);
}

/* Book Info Styles */
.wishlist-item-info {
  margin-bottom: 10px;
}

.wishlist-item-image {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 8px;
}

.wishlist-item-details {
  text-align: center;
  margin-top: 5px;
}

.wishlist-item-details h3 {
  font-size: 14px;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.wishlist-item-details p {
  font-size: 11px;
  color: #666;
  margin: 3px 0;
}

.wishlist-item-details .price {
  font-size: 13px;
  color: #e53935;
  font-weight: bold;
}

/* Remove Button Styles */
.remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  gap: 5px;
  /* Khoảng cách giữa icon và text */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.remove-button:hover {
  background-color: #ff7875;
  transform: translateY(-2px);
  /* Hiệu ứng nổi khi hover */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.remove-button i {
  font-size: 16px;
}

.continue-shopping-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
  margin-top: auto;
  /* Ensures it stays at the bottom */
}

.continue-shopping-button:hover {
  background-color: #333;
}

/* Empty Wishlist Styles */
.empty-wishlist {
  text-align: center;
  font-size: 16px;
  color: #999;
  font-style: italic;
  margin-top: 50px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .wishlist-container {
    padding: 20px;
  }

  .wishlist-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .wishlist-item-info {
    margin-bottom: 10px;
  }

  .remove-button {
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 20px;
  }
}
</style>
