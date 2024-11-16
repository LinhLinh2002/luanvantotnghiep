<template>
            <div class="divider"></div> <!-- Đường gạch ngang -->
   <footer clas="footer">
    <div class="footer-container">

        <div class="footer-column">
            <h5>Về Chúng Tôi</h5>
            <ul>
                <li><a href="#">Giới Thiệu Về Nhà Sách Phương Nam</a></li>
                <li><a href="#">Hệ Thống Nhà Sách Phương Nam</a></li>
                <li><a href="#">Điều Khoản Sử Dụng</a></li>
                <li><a href="#">Chính Sách Bảo Mật</a></li>
                <li><a href="#">Chính Sách Bán Hàng</a></li>
                <li><a href="#">Phương Thức Vận Chuyển</a></li>
            </ul>
        </div>

        <div class="footer-column">
            <h5>Tài Khoản của Tôi</h5>
            <ul>
                <li><a href="#">Đăng nhập</a></li>
                <li><a href="#">Tạo tài khoản</a></li>
            </ul>
        </div>

        <div class="footer-column">
            <h5>Hỗ Trợ Khách Hàng</h5>
            <ul>
                <li><a href="#">Các Câu Hỏi Thường Gặp</a></li>
                <li><a href="#">Chính Sách Đổi/Trả Hàng</a></li>
                <li><a href="#">Quy Định Viết Bình Luận</a></li>
            </ul>
        </div>

        <div class="footer-column">
            <h5>Liên Hệ Với Chúng Tôi</h5>
            <p>Hotline: 1900 6656</p>
            <p>Email: hotro@nhasachphuongnam.com</p>
        </div>
    </div>
</footer>
</template>

<script>
export default {
    name: "FooterComponent"
};
</script>

<style >
body {
    background-color: #fff;
}
.footer{
    background-color: #fff;
    padding-top: 40px;
    
}
.footer-container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    /* background-color: #4f85c0; */
}
.footer-column {
    width: 23%;
    /* background-color: #e71e54; */
}

.footer-column h5 {
    font-size: 18px;
    margin-bottom: 15px;
    /* display: flex; */
    width: 100%;
    /* justify-content: center; */
    color:#000;
    font-size: 15px;
    text-align: justify; 
    padding-left: 10px;
}
.footer-column ul {
    list-style: none;
    padding: 0;
    
}
.footer-column ul li {
    margin-bottom: 10px;
    text-align: justify;   /* Canh đều hai bên */
    padding-left: 10px;

}
.footer-column ul li a {
    color: #349cd8;
    text-decoration: none;
}
.footer-column ul li a:hover {
    text-decoration: underline;
}
.footer-column p {
        text-align: justify;   /* Canh đều hai bên */
    margin: 5px 0;
    font-size: 12px;
}

.divider {
    margin: 20px auto;
    width: 100%; 
    border-bottom: 1px solid #9b9a9e; 
  }


</style>

