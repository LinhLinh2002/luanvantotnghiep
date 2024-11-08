<template>
  <div class="home-header">
    <div class="header-top">
        <div class="container">
            <a class="addres-star" href="#">TP.Hồ Chí Minh</a>
            <span class="header-links">
                <a href="#">Bookish.vn</a>
                <a href="#">App K0M0 +</a>
                <a href="#">Phiếu Qùa Tặng Phương Nam</a>
            </span>
        </div>
    </div>

    <div class="divider"></div>

    <header class="header-botton">
        <div class="header-botton1">
            <div class="logo">
                <img src="https://nhasachphuongnam.com/images/logos/269/logo_ns-01-01.jpg"
                    alt="Nhà Sách Phương Nam">
            </div>
            <div class="icon">
                <div class="hidden-phone">
                    <a href="" class="like">
                        <i class='bx bx-heart'></i>
                    </a>
                    <a href="#" class="call">
                        <span><i class='bx bx-phone-call'></i></span> 1900 6656
                    </a>
                </div>
            </div>
        </div>


        <div class="header-botton2">
            <div class="danhmuc">
                <a href="" class="">
                    <i class='bx bx-grid-alt'></i></a>
            </div>

            <div class="timkiem">
                <input type="text" placeholder="Muôn kiếp nhân sinh" />
                <button type="submit" class="btn"><i class='bx bx-search-alt-2'></i></button>
            </div>

            <div class="taikhoan">
                <a href="http://localhost:8080/#/signin" class=""><i class='bx bx-user-circle'> </i></a>
            </div>

            <div class="giohang">
                <a href="" class=""><i class='bx bxs-cart'> </i> </a>
            </div>
        </div>
    </header>
</div>
</template>

<script>
export default {
    name: "HeaderComponent"
};
</script>

<style>
@import "../Home/style.css";

</style>
