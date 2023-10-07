
// 右下角的场景按钮。场景切换界面
<template>
  <!-- 右侧按钮 -->
  <div class=" hidden  absolute right-2 bottom-40">
    <div class="h-auto flex-col grid gap-y-2">
      <div class="cursor-pointer rounded-full" :class="openModelPanel == '场景' ? ' bg-blue-200 ' : 'bg-gray-200'"
        @click="ChangePanel('场景')">
        <p class="p-2">{{ title }}</p>
      </div>
    </div>
  </div>

  <!-- 模型库 模型列表选择 -->
  <div v-if="openModelPanel == '场景'" class="
              absolute
              w-2/3
              right-16
              max-w-md
              h-60
              md:right-32
              bg-gray-200
              bottom-16
             rounded-lg
             overflow-hidden
            ">
  <!-- 分类table -->
  <!-- <div class="flex rounded-md bg-gray-200">
      <div
        v-for="(item, i) in modelTable"
        :key="i"
        :index="item.name"
        class="w-auto h-8 self-center mx-auto cursor-pointer flex"
        :class="selectModelTable == item.name ? 'bg-gray-100' : ''"
        @click="SelectTable(item.name)"
      >
        <div class="self-center mx-auto p-2">
          {{ item.name }}
        </div>
              </div>
            </div> -->


    <!-- 模型库 分类筛选后列表 -->
    <div class="
                overflow-y-auto
                overscroll-auto
                grid 
                md:grid-cols-4
                grid-cols-3
                gap-2
                w-11/12
                max-w-md
                p-5
                mx-auto
              ">
      <div v-for="(item, i) in modelsList" :key="i" :index="item.img" class="
                  w-16
                  h-16
                  bg-blue-100
                  self-center
                  mx-auto
                  rounded-md
                  shadow-md
                  hover:bg-blue-400
                  cursor-pointer
                  flex
                " v-show="item.modelType == selectModelTable" :class="
                  selectModelItem.name == item.name ? 'bg-blue-400' : 'bg-blue-100'
                " @click="ChangeSceneByUI(item)">
        <div class=" w-full h-full self-center mx-auto">
          <img class="w-full h-full  rounded-md p-1 " :src="path + item.icon" alt="" />
        </div>
      </div>
    </div>
  </div>

  <!-- 场景切换loading背景图 -->
  <div v-if="loading" class="  pointer-events-none absolute z-50 left-0 top-0 w-full h-full">
    <img class=" w-full h-full" :src="path + sceneImg" alt="">

    <div class=" absolute left-1/2 transform -translate-x-28 w-56 h-5 bottom-20   ">
      <div class=" text-white ">正在加载，请稍候...{{ loadingProcess }}%</div>
    </div>
    <div class=" absolute left-1/2 transform -translate-x-28 w-56 h-5 bottom-10 border  ">
      <div class=" h-full bg-green-500  " :style="'width: ' + loadingProcess + '%'"></div>
    </div>
  </div>
</template>

<script>

//角色动作数据
import PlayerAnimData from "../data/playerAnimSetting.js";
import AvatarData from "../data/sceneSetting.js";
import AvatarData2 from "../data/sceneSetting2.js";
import AvatarData3 from "../data/sceneSetting3.js";
import AvatarData4 from "../data/sceneSetting4.js";
import AvatarData5 from "../data/sceneSetting_fengchao.js";
import AvatarData6 from "../data/sceneSetting_jitan.js";

export default {
  name: "index",
  props: ['openModelPanel'],
  components: {

  },
  data() {
    return {

      title: "场景",

      // openModelPanel: "",
      // 是否正在加载
      loading: false,
      // 提示文字内容
      tipContent: "模型加载中，请稍候。。。",
      selectModelTable: "场景",
      modelTable: [
        {
          name: "角色",
        },
        // {
        //   name: "特效",
        // },
        // {
        //   name: "动态模型",
        // },
        // {
        //   name: "静态模型",
        // },
      ],

      selectModelItem: { name: "" },
      avatarData: null,
      // 选项缩略图
      sceneList: [
        // { sceneName: "", settingData: null }
      ],
      path: "",
      sceneImg: "",
      loadingProcess: 10,
      sceneName: '',
    };
  },
  created() {
    this.avatarData = PlayerAnimData;

    this.sceneList.push({ sceneName: "scene1", settingData: AvatarData });
    this.sceneList.push({ sceneName: "scene2", settingData: AvatarData2 });
    this.sceneList.push({ sceneName: "scene3", settingData: AvatarData3 });
    this.sceneList.push({ sceneName: "scene4", settingData: AvatarData4 });
    this.sceneList.push({ sceneName: "scene5", settingData: AvatarData5 });
    this.sceneList.push({ sceneName: "scene6", settingData: AvatarData6 });
  },
  mounted() {
    this.path = this.$parent.GetPublicUrl();

    this.modelsList = this.avatarData.sceneList;
    this.sceneImg = this.modelsList[0].img;
    this.sceneName = this.modelsList[0].name;

    this.ThreejsHumanChat = this.$parent.$refs.YJmetaBase.GetThreejsHumanChat();

  },
  methods: {

    //#region 模型库
    //切换模型table
    SelectTable(e) {
      this.selectModelTable = e;
    },

    //------------- 玩家创建模型 开始 -------------
    //切换模式。浏览模式和编辑模式。
    //编辑模式，地面变为网格，可从背包资源中选择模型放入场景中
    ChangePanel(e) {
      // if (this.openModelPanel != e) {
      //   this.openModelPanel = e;
      // } else {
      //   this.openModelPanel = "";
      // }
      this.$parent.ChangePanel(e);
    },

    CancelSelectModelIconState() {
      // 取消按钮选中状态
      this.selectModelItem.name = "";
    },
    ChangeSceneByUI(item) {
      console.log("切换场景 ", item);
      if (this.selectModelItem.name != "") {
        if (this.selectModelItem.name == item.name) {
          return;
        }
        this.ClearSelectModel();
      }
      this.$parent.ChangePanel('');

      this.sceneImg = item.img;

      this.DisplayLoading();

      this.SelectModelFn(item);
    },
    ChangeScene(s) {

      for (let i = 0; i < this.modelsList.length; i++) {
        const item = this.modelsList[i];
        if (item.name == s) {
          this.sceneImg = item.img;
        }
      }
      this.DisplayLoading();


      for (let i = 0; i < this.sceneList.length; i++) {
        const item = this.sceneList[i];
        if (item.name == s) {
          this.$parent.ClickChangeScene(item.settingData);
        }
      }

    },
    DisplayLoading() {
      this.loading = true;
      this.loadingProcess = 0;
    },
    LoadingProcess(f) {
      this.loadingProcess = parseInt(f * 100);
    },
    load3dComplete() {
      this.loading = false;
    },

    GetCurrentSceneName() {
      return this.sceneName;
    },
    SelectScene(sceneName) {
      for (let i = 0; i < this.modelsList.length; i++) {
        const item = this.modelsList[i];
        if (item.name == sceneName) {
          this.sceneImg = item.img;
        }
      }

      console.log("获取场景数据 ",sceneName);
      for (let i = 0; i < this.sceneList.length; i++) {
        const item = this.sceneList[i];
        if (item.sceneName == sceneName) {
          return (item.settingData);
        }
      }

    },
    SelectModelFn(item) {
      if (item.modelType == "场景") {
        console.log(" 切换场景 " + item.name);
        for (let i = 0; i < this.sceneList.length; i++) {
          const element = this.sceneList[i];
          if (element.sceneName == item.name) {
            this.$parent.ClickChangeScene(item.settingData);
          }
        } 
      }
    },
    // 创建非角色模型
    SelectStaticModel(type, item) {
      // 弹出等待提示
      this.LoadingState("begin");
      this.selectModelItem.name = item.name;
      this.selectModelItem.img = item.img;
      if (type == "静态模型") {
        this.ThreejsHumanChat.SelectModel(item);
      }
      if (type == "npc") {
        this.ThreejsHumanChat.SelectModel(item);
      }
    },
    //-------------  玩家创建模型 结束 -------------
    //#endregion

  },
};
</script>

<style scoped></style>
