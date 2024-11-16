<template>
    <HeaderComponent />

    <div class="cart-container">
        <h2>CHI TIẾT GIỎ HÀNG </h2>
        
        <div v-if="cartItems.length" class="cart-items">
            <div 
                v-for="item in cartItems" 
                :key="item.rowId" 
                class="cart-item">
                
                <img :src="item.image" alt="Product Image" class="product-image" />
                
                <div class="product-details">
                    <h3>{{ item.title }}</h3>
                    <p>Giá: {{ item.original_price }} đ</p>
                    <p>Số lượng: {{ item.quantity }}</p>
                    
                    <div class="quantity-controls">
                        <button @click="decreaseQuantity(item.rowId)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button @click="increaseQuantity(item.rowId)">+</button>
                    </div>
                    
                    <button @click="removeItem(item.rowId)" class="remove-button">Xóa</button>
                </div>
            </div>
        </div>

        <div v-else>
            <p>Giỏ hàng của bạn trống.</p>
        </div>

        <div class="cart-footer" v-if="cartItems.length">
            <div class="coupon-section">
                <input 
                    v-model="couponCode" 
                    placeholder="Nhập mã giảm giá" 
                    class="coupon-input" />
                <button @click="applyCoupon" class="apply-coupon-button">Áp dụng mã giảm giá</button>
            </div>
            <p class="total">Tổng cộng: {{ total }} đ</p>
            <button @click="clearCart" class="clear-cart-button">Xóa toàn bộ giỏ hàng</button>
        </div>
    </div>
    <FooterComponent />

</template>

<script>
import HeaderComponent from './Header.vue';
import FooterComponent from './Footer.vue';
import CartService from '@/service/CartService';

export default {
    name: 'Cart',
    components: {
        HeaderComponent,
        FooterComponent
    },
    data() {
        return {
            cartItems: [],
            couponCode: '',
            total: 0
        };
    },
    async mounted() {
        await this.loadCart();
    },
    methods: {
        async loadCart() {
            try {
                const response = await CartService.getCart();
                this.cartItems = response.items;
                this.total = response.total;
            } catch (error) {
                console.error('Lỗi khi tải giỏ hàng:', error);
            }
        },
        async increaseQuantity(rowId) {
            try {
                await CartService.increaseQuantity(rowId);
                await this.loadCart();
            } catch (error) {
                console.error('Lỗi khi tăng số lượng:', error);
            }
        },
        async decreaseQuantity(rowId) {
            try {
                await CartService.decreaseQuantity(rowId);
                await this.loadCart();
            } catch (error) {
                console.error('Lỗi khi giảm số lượng:', error);
            }
        },
        async removeItem(rowId) {
            try {
                await CartService.removeItem(rowId);
                await this.loadCart();
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
            }
        },
        async clearCart() {
            try {
                await CartService.clearCart();
                await this.loadCart();
            } catch (error) {
                console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
            }
        },
        async applyCoupon() {
            try {
                await CartService.applyCoupon(this.couponCode);
                await this.loadCart();
                this.couponCode = '';
            } catch (error) {
                console.error('Lỗi khi áp dụng mã giảm giá:', error);
            }
        }
    }
};
</script>

<style scoped>
.cart-container {
    width: 1180px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: start;
    color: #333;
    font-family: Inter, -apple-system, sans-serif;
    font-weight: 900;
    letter-spacing: normal;
    font-size:20px;

}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.cart-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
    gap: 15px;
}

.product-image {
    width: 80px;
    height: 80px;
    margin-right: 15px;
    border-radius: 8px;
}

.product-details {
    flex: 1;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 5px;
}

.quantity-controls button,
.remove-button {
    padding: 5px 10px;
    background-color: #034784;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.remove-button {
    background-color: #d9534f;
}

.coupon-section {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.coupon-input {
    padding: 5px;
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.apply-coupon-button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #5cb85c;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.clear-cart-button {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #d9534f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: block;
    width: 100%;
    text-align: center;
}

.total {
    font-weight: bold;
    margin-top: 20px;
    font-size: 1.2em;
}

.cart-footer {
    margin-top: 20px;
    text-align: right;
}
</style>
