<template>
    <div class="statistics-container">
        <h2>Thống Kê Đơn Hàng</h2>
        <div v-if="loading" class="loading">Đang tải...</div>
        <div v-else>
            <div class="stats-row">
                <div class="stat-item total-orders">
                    <i class="pi pi-shopping-cart stat-icon"></i>
                    <p><strong>Tổng số đơn hàng:</strong> {{ statistics.totalOrders }}</p>
                </div>
                <div class="stat-item total-revenue">
                    <i class="pi pi-dollar stat-icon"></i>
                    <p><strong>Tổng doanh thu:</strong> {{ statistics.totalRevenue }}</p>
                </div>
                <div class="stat-item pending-orders">
                    <i class="pi pi-clock stat-icon"></i>
                    <p><strong>Đơn hàng đang chờ:</strong> {{ statistics.pendingOrders }}</p>
                </div>
                <div class="stat-item canceled-orders">
                    <i class="pi pi-times stat-icon"></i>
                    <p><strong>Đơn hàng bị hủy:</strong> {{ statistics.canceledOrders }}</p>
                </div>
                <div class="stat-item returned-orders">
                    <i class="pi pi-undo stat-icon"></i>
                    <p><strong>Đơn hàng trả lại:</strong> {{ statistics.returnedOrders }}</p>
                </div>
            </div>

            <h3>Số lượng đơn hàng theo tháng:</h3>
            <ul class="month-orders-list">
                <li v-for="(item, index) in statistics.ordersByMonth" :key="index">
                    <span class="month">{{ item.month }} / {{ item.year }}:</span>
                    <span class="order-count">{{ item.count }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import OrderService from '@/service/OrderService';

export default {
    data() {
        return {
            statistics: {
                totalOrders: 0,
                totalRevenue: 0,
                pendingOrders: 0,
                canceledOrders: 0,
                returnedOrders: 0,
                ordersByMonth: []
            },
            loading: true
        };
    },
    mounted() {
        this.fetchStatistics();
    },
    methods: {
        async fetchStatistics() {
            try {
                this.loading = true;
                const data = await OrderService.getDashboard();
                this.statistics = data;
            } catch (error) {
                console.error('Lỗi khi lấy thống kê:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.statistics-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 1300px;
    margin: 0 auto;
}

h2 {
    text-align: center;
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
}

.loading {
    text-align: center;
    font-size: 18px;
    color: #888;
}

.stats-row {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 15px;
}

.stat-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-width: 200px;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #fff;
    text-align: center;
    font-size: 18px;
}

.stat-icon {
    font-size: 2rem;
    margin-right: 10px;
}

.total-orders {
    background-color: #42a5f5; /* Màu xanh dương */
}

.total-revenue {
    background-color: #66bb6a; /* Màu xanh lá */
}

.pending-orders {
    background-color: #ffa726; /* Màu cam */
}

.canceled-orders {
    background-color: #ef5350; /* Màu đỏ */
}

.returned-orders {
    background-color: #ab47bc; /* Màu tím */
}

h3 {
    color: #555;
    font-size: 20px;
    margin-top: 30px;
    margin-bottom: 15px;
}

.month-orders-list {
    list-style-type: none;
    padding: 0;
}

.month-orders-list li {
    background-color: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
}

.month {
    font-weight: bold;
    color: #333;
}

.order-count {
    color: #555;
}
</style>
