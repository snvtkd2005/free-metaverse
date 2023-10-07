<template>
  <div
    class="TopHeader flex justify-between items-center h-20 text-white bg-black inset-x-0 top-0"
  >
    <div class="px-4"><img :src="$publicUrl + 'revelya/img/logo.jpg'" alt="" /></div>
    <div class="px-4 flex items-center">
      <div class="flex items-center menu">
        <div class="px-8">MEMBER</div>
        <div class="px-8">ABOUT&nbsp;&nbsp;US</div>
        <div class="px-8">NEWS</div>
        <div class="px-8">BUSINESS</div>
      </div>
      <div class="h-20 line"></div>
      <div class="language flex items-center font-bold">
        <div class="english text-center">EN</div>
        <div class="line2"></div>
        <div class="jpanese">JP</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.TopHeader {
  font-size: 14px;
  position: fixed;
}
.line {
  border-right: 1px solid rgba(255, 255, 255, 0.331);
}
.line2 {
  border-right: 2px solid rgba(255, 255, 255, 0.852);
  height: 30px;
  margin: 0 17px 0 17px;
}
.menu {
  font-weight: bold;
}
.language {
  padding-right: 20px;
}
.english {
  border-radius: 50%;
  background-color: rgb(0, 128, 155);
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin-left: 30px;
}
.jpanese {
  border-bottom: 1px solid white;
}
</style>
