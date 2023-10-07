<template>
  <div class="top_box">
    <div class="left">
      <img  :src="this.$publicUrl + 'farm/img/metaLogo.png' "  alt="" />
    </div>
    <div class="flex">
      <div class="flex mr-3">
        <div class="self-center text mr-1 cursor-pointer">Menu</div>
        <div class=" w-12 h-auto relative ">
          <div class="absolute left-0 top-0 w-12 h-12 ">
            <img class="circle"  :src="this.$publicUrl + 'farm/img/circle.png' "    alt="" />
          </div>

          <div class="absolute left-0 top-0 w-12 h-12 flex ">
            <div  class=" w-6 h-6 self-center mx-auto  ">

            <img
              :src="this.$publicUrl + 'farm/img/points.png' "  
              alt=""
            />
            </div>
          </div>
        </div>
      </div>
      <div class="wallets">Wallets</div>
    </div>
    <!-- <div class="select_box"></div> -->
  </div>
</template>

<script>
export default {};
</script>

<style scoped >
.top_box {
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
}

img {
  width: 100%;
  height: 100%;
}

.logo_title {
  color: white;
  font-weight: bold;
  width: 200px;
  font-size: 25px;
}

.text {
  color: white;
  font-weight: bold;
}

.points {
  position: relative;
  left: 15px;
  width: 23px;
  height: 23px;
}

.circle {
  position: relative;
  width: 46px;
  height: 46px;
}

.left {
  width: 60px;
  height: 45px;
}

.wallets {
  border: 2px solid white;
  width: 148px;
  height: 48px;
  background-color: #ff6c00;
  color: white;
  line-height: 48px;
  text-align: center;
  border-radius: 25px;
  cursor: pointer;
}
</style>
