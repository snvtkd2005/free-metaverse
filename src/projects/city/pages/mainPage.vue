<template>
<div class=" absolute left-0 top-0 -z-10 w-full h-full">
  <img class=" w-full h-full " :src="$publicUrl +'city/img/bg.png'" alt="">
</div>
    <div class="body text-left">

      <div class="left">
        <div class="logo">
          <img :src="$publicUrl +'city/img/logo.png'" />
        </div>
        <div class="bottom">
          <div class="name">
            <img :src="$publicUrl +'city/img/text.png' " />
          </div>
          <div class="describe">
            <p>
              Guild QB aims to create an interconnected ecosystem of games,
              NFTs, and communities to maximize player benefit and enable
              interoperability across the GameFi ecosystem. We will research
              high level games, grant scholarships from the Guild, and expand
              our gaming audience. Guild users can also earn additional
              incentives by building gaming tools and making connections to the
              entire GameFI/BCG industry.
            </p>
          </div>
          <div class="connect">
            <a href="#">Discoad</a>
            <a href="#">Twitter</a>
            <a href="#">YouTube</a>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
          </div>
          <div class="copyright">
            <p>Copyright © 2022 GuildQB.inc All rights reserved.</p>
          </div>
        </div>
      </div>
      <div class="right" @click="toCity">
        <img :src="$publicUrl +'city/img/tu.png'" />
      </div>
    </div>
</template>

<script>
export default {
  methods:{
    // 跳转城市详情页
    toCity(){
      this.$router.push('/city')
    }
  }
}
</script>

<style>
.body {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}

.left,
.right {
  height: calc(100vh - 40px);
}
  @media screen and (max-width: 750px) {
   .left,
.right{height: 100%;} 
  }
.right{
  cursor: pointer;
}
.left {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
  @media screen and (max-width: 750px) {
    .left{width: 100%;}
  }
	@media screen and (max-width: 750px) {
    .left .logo {    margin: 10px 0 20px;
	text-align: center;}
}

.left .logo img {
  width: 70px;
  height: 70px;
}

  @media screen and (max-width: 750px) {
    .left .bottom .name{    margin: 20px 0 20px;
	text-align: center;}

  }
.left .bottom .name img {
  width: 260px;
  height: 80px;
}

.left .bottom .describe {
  margin: 10px 0 20px;
  width: 80%;


}
  @media screen and (max-width: 750px) {
    .left .bottom .describe{	margin: 10px 0 0;
	text-align: center;
    width: 100%;}

  }
.left .bottom .describe p {
  font-size: 12px;
  color: #fff;
  line-height: 25px;
}

.left .bottom .connect {
  padding: 30px 0 10px;
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
  @media screen and (max-width: 750px) {
    .left .bottom .connect{width: 100%;}
  }

.left .bottom .connect a {
  padding: 0 0 2px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  text-decoration: none;
  border-bottom: 3px solid #303030;
}
  @media screen and (max-width: 750px) {
	.left .bottom .connect a{
    padding: 6px 0;
    width: 100%;} 
  }

.left .bottom .copyright {
  padding: 10px 0 20px;
}

.left .bottom .copyright p {
  font-size: 10px;
  color: #fff;
}

.right {
  width: 40%;
}
@media screen and (max-width: 750px) {
  .right{ width: 100%;}
}
.right img {
  width: 100%;
  height: 100%;
}
  @media screen and (max-width: 750px) {
   .right img{height: auto;} 
  }
</style>