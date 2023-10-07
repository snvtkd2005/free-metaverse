<template>
<div class=" main">

  <div class="Dialog  transform scale-85 md:scale-100 ">
    <div @click="Close('recruit')" class="close">X</div>
    <div class="content">
      <div class="left_content   ">
        <img :src="$publicUrl + 'revelya/img/RecruitImg.png'" alt="" />
      </div>
      <div class="right_content">
        <div class="title">RECRUIT</div>
        <div class="show_content">
          REVELYAは、Web2.0時代からめまぐるしく変化する「Web3.0」時代の中で、エンジニア、事業開発、バックオフィスとして共に携わるメンバーを募集しております。
          <br /><br />
          システム開発やメタバース、ブロックチェーンなどの成長を続けるデジタル社会においてWeb3.0のイノベーションとビジネスと繋げるサービスを提供しております。IT技術を活用するFintechのデジタル社会での新しい経済圏に携わりたい方、今後も成長を続けるWeb3.0時代の未来を先駆となりたい方のお問合せ、お待ちしております。
        </div>
        <div class="bottom_btn text-center"  @click="navigation">VIEW MORE</div>
      </div>
    </div>
</div>
  </div>
</template>

<script>
export default {
    methods:{
    navigation() {
      // window.location.href = "https://revelay.onrender.com/#/recruit";
      window.open( "https://revelay.onrender.com/#/recruit");
      
    },
    Close(e){
      this.$parent.Close(e);
    }
  }
};
</script>

<style scoped>

.scale-85{
  --tw-scale-x:.85;
  --tw-scale-y:.85;
}
@media (min-width: 768px) {
    .main{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .Dialog {
    width: 1080px;
    height: 600px;
    background-color: #000000ba;
    border-radius: 12px;
    position: absolute;
    top: 0;
     bottom: 0;
     left: 0;
     right: 0;
     margin: auto;
    display: flex;
    align-items: center;
    color: white;
  }
  .show_content {
    padding-left: 50px;
    width: 420px;
  }
  .close {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgb(0, 0, 0);
    text-align: center;
    line-height: 64px;
    font-size: 22px;
    font-weight: bold;
    position: absolute;
    right: 25px;
    top: 20px;
    cursor: pointer;
  }
  .content {
    display: flex;
  }
  .left_content {
    width: 540px;
    height: 600px;
    position: relative;
    right: 10px;
  }
  .right_content {
    width: 540px;
    padding-top: 95px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .title {
    font-weight: bold;
    font-family: "Source Han Sans JP";
    font-size: 35px;
    padding: 0 0 33px 50px;
  }
  .bottom_btn {
    position: relative;
    bottom: -50px;
    left: 50px;
    width: 160px;
    height: 40px;
    border-radius: 20px;
    background-color: #ff8900;
    line-height: 35px;
    border: 3px white solid;
    box-sizing: border-box;
    font-weight: bold;
    font-family: "Source Han Sans JP";
    cursor: pointer;
  }
}
@media (max-width: 767px) {
  .Dialog {
    width: 100%;
    height: 100%;
    /* height: 356px; */
    background-color: #000000ba;
    border-radius: 12px;
    position: relative;
    color: white;
  }
  .close {
    position: absolute;
    right: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(0, 0, 0);
    text-align: center;
    line-height: 40px;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .right_content  {
height: 300px;overflow-y: scroll;
  }
  .right_content .title {
    font-weight: bold;
    font-family: "Source Han Sans JP";
    font-size: 35px;
    padding: 40px 0 33px 0px;
    text-align: center;
  }
  .show_content {
    padding-left: 10px;
  }
  .bottom_btn {
    /* position: absolute; */
    /* bottom: -50px; */
    /* left: 50px; */
    width: 160px;
    height: 40px;
    border-radius: 20px;
    background-color: #ff8900;
    line-height: 35px;
    border: 3px white solid;
    box-sizing: border-box;
    font-weight: bold;
    font-family: "Source Han Sans JP";
    cursor: pointer;
    margin: 0px auto;
margin-top: 45px;margin-bottom: 20px;position: relative;bottom: 20px;
  }

  
}
</style>
