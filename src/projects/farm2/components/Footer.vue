<template>
  <!-- <div class=" absolute bottom-0 h-10 bg-gray-600 w-full text-white flex">
    <div class="">Follow us</div>
    <div class=" w-40 h-full flex ">
      <img class=" w-6 h-5 " src="/@/assets/img/farm/cat.png"   />
      <img src="/@/assets/img/farm/plane.png"   />
      <img src="/@/assets/img/farm/facebook.png"  />
      <img src="/@/assets/img/farm/bird.png"   />
      <img src="/@/assets/img/farm/youtube.png"   />
    </div>
  </div> -->
  <div class="footer text-white  ">
    <div class=" flex absolute right-10  md:right-20 gap-x-7 ">
      <div class=" ">Follow us</div>

      <img :src="this.$publicUrl + 'farm/img/cat.png' "      alt="" />
      <img :src="this.$publicUrl + 'farm/img/plane.png' "     alt="" />
      <img :src="this.$publicUrl + 'farm/img/facebook.png' "  alt="" />
      <img :src="this.$publicUrl + 'farm/img/bird.png' "      alt="" />
      <img :src="this.$publicUrl + 'farm/img/youtube.png' "   alt="" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped >
.footer_content {
  color: white;
  position: absolute;
  right: 356px;
}

.footer_icon {
  position: absolute;
  right: 48px;
  display: flex;
  justify-content: space-around;
  align-items: center;

}

img {
  width: 25px;
  height: 20px;
  /* padding-right: 30px; */
  /* margin-right: 30px; */
  cursor: pointer;
}

img:hover {
  transform: scale(1.1);
  transition: 0.5s;
}

.footer {
  display: flex;
  align-items: center;
  height: 55px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #292727;


}
</style>
