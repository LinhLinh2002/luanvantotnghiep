<template>
  <div class="container">
    <div class="item">
      <img src="https://deliciousvietnam.net/wp-content/uploads/BanhMi_NgonVietnam01-1200x750.jpg" class="image" />
      <div class="text">
        <h2 class="title">Bánh Mì</h2>
        <h3 class="price">15.000 đđ</h3>
        <h4 class="mota">Chán bánh mì vãi cả chèchè</h4>
        <button class="btn">Buy Now</button>
      </div>
    </div>
    <div class="item1">
      <img src="https://chuphinhmenu.com/wp-content/uploads/2020/01/chup-anh-tra-sua-concept-dep-2020_0008.jpg"
        class="image" />
      <div class="text">
        <h2 class="title">Trà Sữa</h2>
        <h3 class="price">35.000 đđ</h3>
        <h4 class="mota">Likkkkkeeeeee</h4>
        <button class="btn1">Buy Now</button>
      </div>
    </div>
  </div>
</template>


<script setup>

</script>

<style scoped>
body {
  width: 100%;

}

.container {
  display: flex;
  justify-content: space-around;
  padding: 50px;
  background-color: #f5f5f5;
}

.item {
  background-color: #ffffff;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-left: 200px;
}

.item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.item1 {
  background-color: #ffffff;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-right: 200px;
}

.item1:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.image {
  width: 100%;
  height: 250px;
}

.text {
  padding: 20px;
}

.title {
  font-size: 20px;
  color: #333;
  margin: 10px 0;
}

.price {
  font-size: 16px;
  color: #e67e22;
  margin: 5px 0;
}

.mota {
  font-size: 14px;
  color: #777;
  margin: 10px 0;
  padding-top: 20px;
}

.btn {
  background-color: #d35400;
  color: #0e0d0d;
  padding: 10px 20px;
  border: 2px solid #ffffff;
  border-radius: 25px;
  font-size: 16px;
  margin-top: 40px;
}

.btn:hover {
  background-color: #ffffff;
  border: 2px solid #d35400;
  position: relative;
  top:10px;
}

.btn1 {
  background-color: #ffffff;
  color: #0e0d0d;
  padding: 10px 20px;
  border: 2px solid #d35400;
  border-radius: 25px;
  font-size: 16px;
  margin-top: 40px;

}

.btn1:hover {
  background-color: #d35400;
}
</style>