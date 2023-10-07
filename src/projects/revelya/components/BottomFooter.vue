<template>
  <div
    class="BottomFooter bg-black inset-x-0 bottom-0 text-white font-bold flex items-center"
  >
    <div class="content flex items-center">
      <div class="text flex items-center">
        <div class="">Follow&nbsp;&nbsp;us</div>
        <img
          style="padding: 0 20px 0 20px"
          :src="$publicUrl + 'revelya/img/twiter.jpg' "
          alt=""
        />
        <img :src="$publicUrl + 'revelya/img/facebook.jpg' " alt="" />
        <img
          style="padding: 0 20px 0 20px"
          :src="$publicUrl +  'revelya/img/tiptok.jpg'"
          alt=""
        />
      </div>
      <div class="contact text-center bg-blue-500">CONTACT US</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.BottomFooter {
  height: 70px;
  width: 100%;
  position: fixed;
}
.content {
  position: absolute;
  right: 0px;
}
.content .text {
  padding-right: 30px;
  font-size: 18px;
}
.contact {
  width: 300px;
  height: 70px;
  line-height: 70px;
  font-size: 20px;
}
</style>
