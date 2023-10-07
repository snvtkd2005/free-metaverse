
// 游戏主界面: 左上角血条头像
<template>

  <!-- 头像 -->
  <div class=" absolute left-2 top-2 h-20 flex text-white " @mouseenter="hover = true" @mouseleave="hover = false">
    <div class=" w-20 h-20 mask rounded-full bg-gray-400  ">
      <div id="contain" class="w-full h-full rounded-full " ref="YJ3dscene"></div>
    </div>
    <div class=" ml-1 w-32 h-20   ">
      <div class=" pt-2 h-10 text-center truncate">{{ playerName }}</div>
      <div class=" h-5  border relative ">
        <div class=" h-full bg-green-500  " :style="'width: ' + GetHealth() + '%'"></div>
        <div v-if="hover" class=" absolute  left-0 top-0 w-full text-center text-xs  ">
          {{ this.health + "/" + this.maxHealth }}</div>

      </div>
      <div class=" h-5  border relative ">
        <div class=" h-full bg-blue-500  " :style="'width: ' + GetEnergy() + '%'"></div>
        <div v-if="hover" class=" absolute  left-0 top-0 w-full text-center text-xs  ">
          {{ this.energy + "/" + this.maxEnergy }}</div>
      </div>
    </div>

  </div>

  <!-- 底部技能栏 -->
  <div class=" absolute flex bottom-10 w-full z-20 h-12 text-sm text-white">
    <div class=" w-96 mx-auto h-full flex gap-2  bg-black bg-opacity-40">
      <div class="opacity-0  w-12 h-12 p-1 " @click="UserModel('death')">死亡</div>
      <div class=" relative flex  w-12 h-12 p-1 " @click="UserModel('attack')">
        <div class=" absolute left-0 top-0  w-full h-full">
          <img :src="publicUrl + 'images/attack.png'" alt="">
        </div>
        <!-- <div class=" absolute left-0 top-0 flex w-full h-full ">
          <div class=" self-center mx-auto ">巴掌</div>
        </div> -->

      </div>
      <div class=" opacity-0 bg-white w-12 h-12 p-1 " @click="UserModel('attack')">攻击</div>
      <div class=" opacity-0 bg-white w-12 h-12 p-1 " @click="UserModel('attack')">攻击</div>
      <div class=" opacity-0  w-12 h-12 p-1 " @click="UserModel('attack')">攻击</div>
      <div :class="ngCount > 0 ? '  ' : 'opacity-0  '" class=" relative flex  w-12 h-12 p-1  ">
        <div class=" absolute left-0 top-0 w-full h-full"
          :class="hasTarget&&ngCount > 0 ? ' pointer-events-auto ' : ' pointer-events-none '" @click="UserModel('attack', '南瓜')">
          <img :src="publicUrl + 'images/南瓜.png'" alt="">
        </div>


        <div class=" self-center mx-auto ">南瓜</div>
        <div class=" absolute right-0 bottom-0  ">{{ ngCount }}</div>

        <div v-if="!hasTarget" class=" absolute left-0 top-0 w-full h-full bg-black opacity-30">
        </div>
      </div>
      <div :class="hlbCount > 0 ? ' ' : 'opacity-0  '" class=" relative flex  w-12 h-12 p-1   ">
        <div class=" absolute left-0 top-0 w-full h-full"
          :class="hasTarget&&hlbCount > 0 ? ' pointer-events-auto ' : ' pointer-events-none '" @click="UserModel('attack', '胡萝卜')">
          <img :src="publicUrl + 'images/胡萝卜.png'" alt="">
        </div>

        <div class=" self-center mx-auto ">胡萝卜</div>
        <div class=" absolute right-0 bottom-0  ">{{ hlbCount }}</div>

        <div v-if="!hasTarget" class=" absolute left-0 top-0 w-full h-full bg-black opacity-30">
        </div>
      </div>
    </div>
  </div>

  <!-- 3d转2d坐标映射 -->
  <div class=" absolute left-0 top-0 w-full h-full pointer-events-none">
    <div v-for="(item, i) in projectionList" :key="i" :index="item.id" class=" text-sm flex
     w-12 h-12  " :style="
       ' position:absolute; left:' +
       (item.pos.x) +
       'px;top:' +
       (item.pos.y) +
       'px'
     ">
      <div class=" absolute left-0 top-0 w-full h-full">
        <img :src="publicUrl + 'images/' + item.content + '.png'" alt="">
      </div>
      <!-- :style="' position:absolute; left:'+item.pos.x+'px;top:'+i*100+'px'" -->
      <div class="
            w-full
            h-full  
            flex 
          ">
        <div class="  self-center
            mx-auto ">
          {{ item.content + ' ' }}

        </div>
      </div>
    </div>

  </div>
</template>

<script>

import { YJ3dScene_playerHeader } from "/@/threeJS/YJ3dScene_playerHeader.js";


export default {
  name: "gameUI",
  components: {

  },
  data() {
    return {
      hover: false,
      playerImg: "",
      playerName: "hhh",
      health: 100, //生命值
      maxHealth: 100, //最大生命值
      energy: 100, //能量值
      maxEnergy: 100, //最大能量值
      icon: '',

      projectionList: [
      ],
      hlbCount: 0,
      ngCount: 0,
      publicUrl: '',
      // 是否有目标，目标为npc、其他玩家
      hasTarget: false,
    };
  },
  created() {

  },
  mounted() {
    this._YJ3dScene_playerHeader = null;

    this.publicUrl = this.$parent.GetPublicUrl();

  },
  methods: {


    //向动作栏添加icon
    CreateIconTo(name, pos) {
      console.log(" 生成icon ", name);
      this.projectionList.push({ content: name, pos: pos });
      if (name == "南瓜") {

        this.ngCount += 10;
        // this.ngCount++;
      }
      if (name == "胡萝卜") {
        this.hlbCount += 10;
        // this.hlbCount++; 
      }
    },
    UpdateIconTo(name, pos) {
      // console.log(" 更新icon ", name);
      for (let i = 0; i < this.projectionList.length; i++) {
        const element = this.projectionList[i];
        if (element.content == name) {
          element.pos = pos;
        }
      }
    },
    DelIconTo(name) {

      for (let i = 0; i < this.projectionList.length; i++) {
        const element = this.projectionList[i];
        if (element.content == name) {
          this.projectionList.splice(i, 1);
          return;
        }
      }

    },


    SetTargetVaild(b) {
      this.hasTarget = b;
    },

    //动作栏。 使用技能或物体
    UserModel(e, f) {

      if (this.$parent._YJGameManager) {
        this.$parent._YJGameManager.UserModel(e, f, () => {
          if (f == "南瓜") { this.ngCount--; }
          if (f == "胡萝卜") { this.hlbCount--; }
        });
      }

    },
    InitPlayerHeader() {
      if (this._YJ3dScene_playerHeader == null) {
        // console.log("======= 初始化头像 =========");
        this._YJ3dScene_playerHeader = new YJ3dScene_playerHeader(this.$refs.YJ3dscene, this);
      }
    },
    ChangeAvatar(avatarData, callback) {
      this._YJ3dScene_playerHeader.ChangeAvatarByCustom(avatarData, callback);
    },

    // 设置头像框上的角色名
    SetPlayerName(e) {
      this.playerName = e;
    },
    SetHealth(e, t) {
      this.health = e;
      if (t) {
        this.maxHealth = t;
      }
    },
    GetHealth() {
      return parseInt(this.health / this.maxHealth * 100);
    },
    SetEnergy(e, t) {
      this.energy = e;
      if (t) {
        this.maxEnergy = t;
      }
    },
    GetEnergy() {
      return parseInt(this.energy / this.maxEnergy * 100);
    },
  },
};
</script>
 
<style scoped>
.mask {
  /* -webkit-mask-image:url('/@/assets/headerimage.png');
  mask-image: url('/@/assets/headerimage.png'); */

}
</style>