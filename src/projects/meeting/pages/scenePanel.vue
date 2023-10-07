
// 右下角的场景按钮。场景切换界面
<template>


  <!-- 场景切换loading背景图 -->
  <div v-if="loading" class=" pointer-events-none absolute z-50 left-0 bg-gray-400  top-0 w-full h-full">
    <!-- <img class=" w-full h-full" :src="path + sceneImg" alt=""> -->

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
import AvatarData from "../data/sceneSetting_login.js";
import AvatarData2 from "../data/sceneSetting_meeting.js";
import AvatarData3 from "../data/sceneSetting_music.js";
import AvatarData4 from "../data/sceneSetting4.js";

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
      modelsList: [],
      path: "",
      sceneImg: "",
      loadingProcess: 10,
      sceneName: '',
    };
  },
  created() {
    this.avatarData = PlayerAnimData;
    // this.avatarData = this.$parent.avatarData;
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

      if (s == "scene1") {
        this.$parent.ClickChangeScene(AvatarData);
      }
      if (s == "scene2") {
        this.$parent.ClickChangeScene(AvatarData2);
      }
      if (s == "scene3") {
        this.$parent.ClickChangeScene(AvatarData3);
      }
      if (s == "scene4") {
        this.$parent.ClickChangeScene(AvatarData4);
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
      if (sceneName == "scene1") {
        return AvatarData;
      }
      if (sceneName == "scene2") {
        return AvatarData2;
      }
      if (sceneName == "scene3") {
        return AvatarData3;
      }
      if (sceneName == "scene4") {
        return AvatarData4;
      }
    },
    SelectModelFn(item) {
      if (item.modelType == "场景") {
        console.log(" 切换场景 " + item.name);
        if (item.name == "scene1") {
          this.$parent.ClickChangeScene(AvatarData);
        }
        if (item.name == "scene2") {
          this.$parent.ClickChangeScene(AvatarData2);
        }

        if (item.name == "scene3") {
          this.$parent.ClickChangeScene(AvatarData3);
        }
        if (item.name == "scene4") {
          this.$parent.ClickChangeScene(AvatarData4);
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
