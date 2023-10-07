<template>
  <div class=" absolute left-0 top-0 w-full h-full pointer-events-none ">
    <Header class=" pointer-events-auto "></Header>
    <!-- <div class="loading_content">
      <img src="/@/assets/img/farm/loading_icon.png" alt="" />
    </div> -->
    <Footer class=" pointer-events-auto "></Footer>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style  scoped>
.Loading {
  /* background: #94b0c1; */
  width: 100%;
  /* height: 100%; */

}

.loading_content {
  padding-top: 18%;
  padding-right: 5%;
  display: flex;
  justify-content: center;
  align-items: center;

}

.content {
  color: white;
  font-size: 15px;
  padding-right: 10px;
  font-weight: bold;
  padding-top: 10px;
}

img {
  width: 162px;
  height: 48px;
}
</style>
