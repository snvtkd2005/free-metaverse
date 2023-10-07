
// 游戏主界面: 左上角血条头像
<template>

  <!-- 头像 -->
  <div class=" absolute left-2 top-2 h-20 flex text-white origin-top-left transform scale-50 xl:scale-100 " @mouseenter="hover = true" @mouseleave="hover = false">

    <div v-if="avatarName!=''" class=" w-20 h-20  ">
      <img :src="publicUrl + 'images/gameUI/' + avatarName + '.png'" alt="">
    </div>

    <div class=" ml-1 w-32 h-20   ">
      <div class=" pt-2 h-10 text-center truncate">{{ playerName }}</div>

      <div class=" relative ">
        <!-- <div class=" absolute left-0 top-0">
          <img :src="publicUrl + 'images/gameUI/zhuangtailan_lan 8.png'" alt="">
        </div> -->
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

  </div>

  <!-- 底部技能栏 -->
  <div v-if="actionBar" class=" flex  absolute bottom-2  xl:bottom-10 w-full pointer-events-none  h-12 text-sm text-white">


    <div class=" w-auto px-2 mx-auto h-full flex gap-2 pointer-events-auto bg-color rounded-lg ">

      <div v-for="(item, i) in modelIconList" :key="i" :index="item.id" class=" p-1 w-12 h-12 text-left " :class="
        0 == item.id
          ? ' '
          : ' cursor-pointer '
      " @click="UserModel(item)">

        <div class=" relative flex w-full h-full   ">
          <div class=" self-center mx-auto w-full h-full  bg-white rounded-xl "
            :class="hasTarget && item.count > 0 ? ' pointer-events-auto ' : ' pointer-events-none '">

            <img v-if="item.name!=''" :class="item.id != 0 ? ' ' : 'opacity-0  '" class=" p-1 "
              :src="publicUrl + 'images/' + item.name + '.png'" alt="">
          </div>

          <!-- <div class=" self-center mx-auto ">胡萝卜</div> -->
          <div v-if="item.count>0" class=" absolute -right-1 -top-1 w-6 h-4 flex bg-yellow-600 rounded-xl ">
            <div class=" self-center mx-auto ">
              {{ item.count }}
            </div>
          </div>

          <div v-if="(!hasTarget && item.name !='') ||  (item.name !='' && item.count==0)   " class=" absolute left-0 top-0 w-full h-full rounded-xl bg-black opacity-20">
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- 3d转2d坐标映射 -->
  <div v-if="1==2" class=" absolute left-0 top-0 w-full h-full pointer-events-none">
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
      <div class="
            w-full
            h-full  
            flex 
          ">
        <div class="  self-center
            mx-auto ">
        </div>
      </div>
    </div>
  </div>

</template>

<script>

// import { YJ3dScene_playerHeader } from "/@/threeJS/YJ3dScene_playerHeader.js";


export default {
  name: "gameUI",
  components: {

  },
  data() {
    return {
      hover: false,
      playerImg: "",
      avatarName: "小孩",
      playerName: "hhh",
      actionBar:true, //底部动作栏
      health: 100, //生命值
      maxHealth: 100, //最大生命值
      energy: 100, //能量值
      maxEnergy: 100, //最大能量值
      icon: '',

      projectionList: [
      ],
      hlbCount: 10,
      ngCount: 0,

      modelIconList: [
        { id: 10000, type: "attack", name: "南瓜", count: 10 },
        { id: 10001, type: "attack", name: "胡萝卜", count: 10 },
        { id: 0, name: "" },
        { id: 0, name: "" },
        { id: 0, name: "" },
      ],


      publicUrl: '',
      // 是否有目标，目标为npc、其他玩家
      hasTarget: false,
    };
  },
  created() {

  },
  mounted() {
    // this._YJ3dScene_playerHeader = null;

    this.publicUrl = this.$parent.GetPublicUrl();

  },
  methods: {

    ChangeScene(sceneName){
      this.actionBar = sceneName=="3dfarm";
      // console.error(" 切换房间 ",sceneName);
    },
    //向动作栏添加icon
    CreateIconTo(name, pos) {
      console.log(" 生成icon ", name);
      this.projectionList.push({ content: name, pos: pos });

      for (let i = 0; i < this.modelIconList.length; i++) {
        const element = this.modelIconList[i];
        if(element.name == name){
          element.count +=10;
          return;
        }
      }
      // if (name == "南瓜") {

      //   this.ngCount += 10;
      //   // this.ngCount++;
      // }
      // if (name == "胡萝卜") {
      //   this.hlbCount += 10;
      //   // this.hlbCount++; 
      // }
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
    UserModel(data) {

      let e, f;
      // if (data.type == "attack") {
      // }
      e = data.type;
      f = data.name;
      if(data.count==0){return;}
      console.log(" 点击技能栏 ",e,f);
      if (this.$parent._YJGameManager) {
        this.$parent._YJGameManager.UserModel(e, f, () => { 
          data.count--;
        });
      }

    },
    InitPlayerHeader() {
      return;
      if (this._YJ3dScene_playerHeader == null) {
        // console.log("======= 初始化头像 =========");
        this._YJ3dScene_playerHeader = new YJ3dScene_playerHeader(this.$refs.YJ3dscene, this);
      }
    },
    ChangeAvatar(avatarData, callback) {
      return;

      this._YJ3dScene_playerHeader.ChangeAvatarByCustom(avatarData, callback);
    },

    // 设置头像框上的角色名
    SetPlayerName(e, f) {
      this.playerName = e;
      this.avatarName = f;

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
.bg-color {
  background: #28cad9;
}

.mask {
  /* -webkit-mask-image:url('/@/assets/headerimage.png');
  mask-image: url('/@/assets/headerimage.png'); */
 
}
</style>