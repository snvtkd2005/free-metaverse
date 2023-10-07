<template>
  <div class="MenuList text-white">
    <div
      class="dex_center flex justify-around items-center"
      v-show="dexShow"
      @click="showDex"
    >
      <div>DEX CENTER</div>
      <div class="icon">
        <img :src="$publicUrl + 'revelya/img/menu.png'" alt="" />
      </div>
    </div>
    <div class="dex_center_list" v-show="!dexShow">
      <div class="top flex justify-around items-center" @click="showDex">
        <div>DEX CENTER</div>
        <div class="icon">
          <img :src="$publicUrl + 'revelya/img/arrow.png'" alt="" />
        </div>
      </div>
      <div class="line"></div>
      <div class="content">
        <div>Swap</div>
        <div style="margin: 15px 0 15px 0">Liquidity</div>
        <div style="margin: 0px 0 15px 0">Pool</div>
        <div>Farm</div>
      </div>
    </div>
    <div
      class="nft_center flex justify-around items-center"
      v-show="ntfShow"
      @click="showNtf"
    >
      <div>NFT CENTER</div>
      <div class="icon">
        <img :src="$publicUrl + 'revelya/img/menu.png'" alt="" />
      </div>
    </div>
    <div class="nft_center_list" v-show="!ntfShow">
      <div class="top flex justify-around items-center" @click="showNtf">
        <div>NFT CENTER</div>
        <div class="icon">
          <img :src="$publicUrl + 'revelya/img/arrow.png'" alt="" />
        </div>
      </div>
      <div class="line"></div>
      <div class="content">
        <div>NFT Collection</div>
        <div style="margin: 15px 0 15px 0">Marketplace</div>
        <div>NFT Staking</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ntfShow: true,
      dexShow: true,
    };
  },
  mounted() {
    console.log(this.$publicUrl);
  },
  methods: {
    showDex() {
      this.dexShow = !this.dexShow;
    },
    showNtf() {
      this.ntfShow = !this.ntfShow;
    },
  },
};
</script>

<style scoped>
.MenuList {
  font-size: 14px;
  font-weight: bold;
  font-family: "Source Han Sans JP";
  position: absolute;
  left: 40px;
  top: 306px;
}
.icon {
  width: 20px;
  height: 8px;
  line-height: 30px;
  margin-left: 80px;
}
.dex_center {
  width: 250px;
  height: 40px;
  background-color: #000000ba;
  line-height: 40px;
  border-radius: 8px;
  cursor: pointer;
}
.dex_center_list {
  width: 252px;
  height: 202px;
  background-color: #000000ba;
  border-radius: 8px;
}
.dex_center_list .top {
  padding-top: 10px;
  cursor: pointer;
}
.line {
  margin: 11px 10px 11px 10px;
  border-bottom: rgba(255, 255, 255, 0.518) dotted 3px;
}
.content {
  padding-left: 24px;
}
.nft_center {
  width: 250px;
  height: 40px;
  background-color: #000000ba;
  line-height: 40px;
  border-radius: 8px;
  margin-top: 5px;
  cursor: pointer;
}
.nft_center_list {
  width: 252px;
  height: 160px;
  background-color: #000000ba;
  border-radius: 8px;
  margin-top: 5px;
}
.nft_center_list .top {
  cursor: pointer;
  padding-top: 10px;
}
</style>
