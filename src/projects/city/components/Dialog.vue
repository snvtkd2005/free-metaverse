<template>
  <div
    class="
      Dialog
      self-center
      transform
      scale-50
      -translate-x-32
      md:scale-100 md:translate-x-0
    "
  >
    <div class="inner_box">
      <div class="close" @click="Close()">×</div>
      <div class="content">
        <div class="title">What is GuildQB?</div>
        <div class="middle_text">
          GuildQB is a social web3 platform specialized for GameFi. Their vision
          is to create an ecosystem that maximizes the benefits to players in
          their guild, while also creating a platform that will push for
          interoperability across the different gaming metaverses. Guild members
          will also have the opportunity to earn additional incentives through
          the building of gaming tools or making connections to the entire
          GameFi/BCG industry.
        </div>
        <div class="link underline flex">
          <img
            class="w-2 h-2 self-center mr-2"
            :src="this.$publicUrl + 'city/img/arrow.png'"
            alt=""
          />
          <a href="https://scholars-lab.com" target="_blank"
            >https://scholars-lab.com/</a
          >
        </div>
        <div class="btn">Coming soon!</div>
      </div>
      <div class="line"></div>
      <div class="w-full h-20 px-16 -mt-4 flex gap-4">
        <a href="https://discord.com/invite/YfAfUHpjjc" target="_blank">
          <img
            class="pic"
            :src="this.$publicUrl + 'city/img/Discord.png'"
            alt=""
          />
        </a>

        <img class="pic" :src="this.$publicUrl + 'city/img/2.png'" alt="" />
        <img
          class="pic"
          :src="this.$publicUrl + 'city/img/facebook.png'"
          alt=""
        />
        
        <a href="https://twitter.com/GuildQBdiscord.gg/guildqb" target="_blank">
          <img
            class="pic cursor-pointer"
            :src="this.$publicUrl + 'city/img/twiter.png'"
            alt=""
          />
        </a>
        <a
          href="https://www.youtube.com/channel/UCkfd5R9q8RyxUYE1abTfpU9"
          target="_blank"
        >
          <img
            class="pic cursor-pointer"
            :src="this.$publicUrl + 'city/img/youtube.png'"
            alt=""
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    SetIframeSrc(src) {},
    Init() {},
    Close() {
      this.$parent.Close();
    },
  },
};
</script>

<style>
.Dialog {
  width: 680px;
  height: 840px;
  background-color: #000000a1;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-top: 5%; */
}

.inner_box {
  width: 640px;
  height: 800px;
  background-color: #000000b1;
  position: relative;
}

.close {
  width: 60px;
  height: 60px;
  background-color: #2dffbc57;
  font-size: 50px;
  text-align: center;
  line-height: 55px;
  color: white;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}

.content {
  padding-top: 40px;
  padding-left: 48px;
}

.title {
  color: #2dffbc;
  font-size: 48px;
}

.middle_text {
  color: #bbffe9;
  font-size: 14px;
  line-height: 30px;
  padding: 30px 0 30px 0;
}

.link a {
  color: #bbffe9;
}

.btn {
  width: 200px;
  height: 57px;
  border: 1px solid #2dffbc;
  margin-top: 36px;
  color: #2dffbc;
  font-size: 28px;
  text-align: center;
  line-height: 57px;
  cursor: pointer;
}

.line {
  width: 80%;
  margin: 50px auto;
  border-bottom: 0.5px solid #2dffbc37;
}

.pic {
  width: 26px;
  height: 26px;
  /* padding-left: 51px; */
}
</style>