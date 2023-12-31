
<!-- // 场景编辑UI -->
<template>
  <div class="  flex-grow flex-col mt-10 md:mt-0 p-2 md:p-20 overflow-y-scroll">

    <div class="   w-auto text-left h-12 text-xl xl:text-3xl text-black font-bold ">开放世界（无缝大地图,未开放）</div>

    <div class=" gap-6 grid grid-cols-3 xl:grid-cols-7 md:grid-cols-5   ">
      <!-- 选择列表 -->
      <div v-for="(item, i) in metaWorldList" :key="i" class="
                  self-center  cursor-pointer  w-auto h-auto  relative
                " @click="SelectMetaWorld(item)">
        <div class=" w-20 h-14 xl:w-40 xl:h-28  self-center mx-auto">
          <img class=" w-full h-full    object-fill hover:opacity-70 " :src=" item.icon" />
        </div>
        <div class="  mt-2 px-2 flex text-xs justify-between ">
          <div>{{ item.name }}</div>
        </div>
        <div class=" hidden mt-2 px-2 flex text-xs justify-between ">
          <div>点赞158</div>
          <div>访问量177</div>
        </div>

        <div class=" hidden mt-2 px-2 flex text-xs justify-between  cursor-pointer  ">
          <div>作者:{{ item.author }}</div>
        </div>
      </div>
    </div>

    <div class=" hidden mt-10 w-auto text-left h-12 text-xl xl:text-3xl text-black font-bold ">平台案例</div>
    <div class=" hidden  space-x-20 ">
      <!-- 选择列表 -->
      <div v-for="(item, i) in sceneList" :key="i" class="

                  self-center
                  cursor-pointer
      w-auto h-auto  relative
                " :class="selectSceneName == item.name ? ' ' : ' '" @click="SelectScene(item.name)">
        <div class=" w-20 h-14 xl:w-40 xl:h-28 self-center mx-auto">
          <img class=" w-full h-full    object-fill hover:opacity-70 " :src="publicUrl + item.icon" />
        </div>
        <div class=" mt-2 px-2 flex text-xs justify-between ">
          <div>点赞158</div>
          <div>访问量177</div>
        </div>

        <div class=" mt-2 px-2 flex text-xs justify-between  cursor-pointer  ">
          <div>作者:{{ item.author }}</div>
        </div>
      </div>
    </div>

    <div class=" mt-10 w-auto text-left h-12 text-xl xl:text-3xl text-black font-bold ">用户创建场景</div>
    <div class="  gap-6 grid grid-cols-3 xl:grid-cols-7 md:grid-cols-5 ">
      <!-- 选择列表 -->
      <div v-for="(item, i) in userSceneList" :key="i" class="

                  self-center 
                  cursor-pointer
      w-auto h-auto  relative
                " :class="selectSceneName == item.name ? ' ' : ' '" @click="SelectUserScene(item)">
        <div class=" w-20 h-14 xl:w-40 xl:h-28 self-center mx-auto">
          <img class=" w-full h-full    object-fill hover:opacity-70 " :src="$uploadSceneUrl + item.icon" />
        </div>
        <div class=" mt-2 px-2 flex text-sm justify-between  cursor-pointer  ">
          <div>{{ item.name }}</div>
        </div>
        <div class=" mt-2 px-2 flex text-xs justify-between ">
          <div>点赞158</div>
          <div>访问量177</div>
        </div>

        <div class=" mt-2 px-2 flex text-xs justify-between  cursor-pointer  ">
          <div>作者:{{ item.author }}</div>
        </div>
      </div>
    </div>



    <div v-if="infloating" class=" absolute left-0 top-0 w-full h-full flex bg-black bg-opacity-60"
      @click="infloating = false">
      <div class=" w-11/12 h-11/12 md:w-1/2 md:h-1/2 self-center mx-auto bg-white rounded-xl">
        <div class=" p-4 w-full  flex ">
          <div class=" w-1/2 h-1/2 ">
            <img class=" w-full h-full    object-fill hover:opacity-70 "
              :src="currentSceneData.baseUrl + currentSceneData.icon" />
          </div>
          <div class=" relative flex-grow flex-col justify-between">
            <div>{{ currentSceneData.name }}</div>
            <div class="  absolute bottom-4 w-full ">
              <div class=" cursor-pointer inline-block px-4 py-2 bg-blue-200 text-gray-600 rounded-lg shadow-lg"
                @click="EnterScene()">立即进入</div>

            </div>
          </div>
        </div>
        <div class=" p-10 text-left ">
          <div class=" text-xl">描述：</div>
          <div class=" mt-10 ">{{ currentSceneData.describe }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import PlayerAnimData from "../../data/playerAnimSetting.js";

import SceneData from "../../data/sceneData.js";
import {
  GetAllScene,
} from "../../js/uploadThreejs.js";

export default {
  name: "gameUI",
  components: {

  },
  data() {
    return {
      hover: false,
      infloating: false,
      playerImg: "",
      avatarName: "小孩",
      playerName: "hhh",

      projectionList: [
      ],

      tableList: [
        { id: 10000, content: "探索", },
        { id: 10000, content: "个人虚拟形象", },
        { id: 10000, content: "虚拟形象商店", },
        { id: 10000, content: "创作", },
      ],
      sceneList: [],
      userSceneList: [],
      // 开放世界入口
      metaWorldList: [
        { name: "开放世界中心", icon: "./public/textures/metaworld.png", x: 0, z: 0 }
      ],
      selectSceneName: "scene1",
      currentSceneData: null,
      publicUrl: '',
      // 是否有目标，目标为npc、其他玩家
      sceneType: "平台案例",
      avatarData: null,
    };
  },
  created() {
    this.avatarData = PlayerAnimData;

  },
  mounted() {

    // console.log(this.avatarData);
    this.publicUrl = this.$publicUrl + this.avatarData.localPath;

    this.sceneList = SceneData.sceneList;
    this.RequestGetAllScene();

  },
  methods: {
    SelectMetaWorld(item) {
      console.log("加载开放世界坐标",item);
      let href = this.$router.resolve({
        name: "metaWorld",
        query: {
          x: item.x,
          z: item.z,
        }
      });
      window.open(href.href, "_blank");
    },

    SelectUserScene(item) {


      this.folderBase = item.folderBase;
      localStorage.setItem("modelType", item.modelType);
      localStorage.setItem("modelData", JSON.stringify(item));
      this.sceneType = "用户场景";

      for (let i = 0; i < this.userSceneList.length; i++) {
        const element = this.userSceneList[i];
        if (element.name == item.name) {
          this.currentSceneData = element;
        }
      }

      this.currentSceneData.baseUrl = this.$uploadSceneUrl;
      this.infloating = true;

      return;

    },
    async RequestGetAllScene() {

      GetAllScene().then((res) => {
        console.log("获取所有 场景 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const scene = txtDataList[i];
            scene.icon = scene.folderBase +"/"+  "thumb.jpg";
            this.userSceneList.push((scene));
            // this.userSceneList.push(JSON.parse(scene));
          }
        }
      });
    },
    SelectScene(e) {

      this.sceneType = "平台案例";

      this.selectSceneName = e;

      for (let i = 0; i < this.sceneList.length; i++) {
        const element = this.sceneList[i];
        if (element.name == e) {
          this.currentSceneData = element;
        }
      }
      this.currentSceneData.baseUrl = this.publicUrl;

      this.infloating = true;
      return;



      this.$parent.SelectScene(this.selectSceneName);

      console.log("选择场景 ", e);



    },
    EnterScene() {

      // this.$parent.SelectScene(this.selectSceneName); 
      if (this.sceneType == "用户场景") {
        // 新窗口 新标签
        localStorage.setItem("sceneName", this.currentSceneData.id);
        let href = this.$router.resolve({
          name: "editorVisit",
          query: {
            folderBase: this.folderBase
          }
        });
        window.open(href.href, "_blank");
        return;
      }
      // 新窗口 新标签
      localStorage.setItem("sceneName", this.currentSceneData.id);
      let href = this.$router.resolve({
        name: "directOpen"
      });
      window.open(href.href, "_blank");
    },
    ChangeScene(sceneName) {
      this.actionBar = sceneName == "3dfarm";
      // console.error(" 切换房间 ",sceneName);
    },
    //向动作栏添加icon
    CreateIconTo(name, pos) {
      console.log(" 生成icon ", name);
      this.projectionList.push({ content: name, pos: pos });

      for (let i = 0; i < this.modelIconList.length; i++) {
        const element = this.modelIconList[i];
        if (element.name == name) {
          element.count += 10;
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
      if (data.count == 0) { return; }
      console.log(" 点击技能栏 ", e, f);
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
.z-999 {
  z-index: 999;
}

.bg-color {
  background: #28cad9;
}
</style>