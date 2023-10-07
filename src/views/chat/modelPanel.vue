
// 模型列表界面
<template>
  <!-- 模型列表选择 -->
  <div class="absolute w-96 h-32 right-5 bg-gray-200 bottom-14">
    <!-- 分类table -->
    <div class="flex rounded-md bg-gray-200 self-start">
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
    </div>
    <!-- 筛选后模型列表 -->
    <div
      class="
        overflow-y-auto
        overscroll-auto
        grid grid-cols-4
        gap-5
        w-96
        h-20
        px-5
      "
    >
      <div
        v-for="(item, i) in modelsList"
        :key="i"
        :index="item.modelData.img"
        class="
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
        "
        v-show="item.modelType == selectModelTable"
        :class="
          selectModelItem.name == item.modelData.name
            ? 'bg-blue-400'
            : 'bg-blue-100'
        "
        @click="SelectModel(item)"
      >
        <div class="self-center mx-auto p-2">
          <img
            class="w-full h-full"
            :src="$publicUrl + item.modelData.img"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetPathFolders, LoadFile } from "/@/utils/api.js";

export default {
  name: "index",
  components: {},
  data() {
    return {
      selectModelTable: "角色",
      modelTable: [
        {
          name: "角色",
        },
        {
          name: "npc",
        },
        {
          name: "特效",
        },
        {
          name: "动态模型",
        },
        {
          name: "静态模型",
        },
      ],
      openModelPanel: false,

      selectModelItem: { name: "", img: "" },
      modelsList: [],

      serverPath: "",
    };
  },
  mounted() {
    this.serverPath = "C:/wamp/www/vue/yjwebgame/public/"; //+"models/players";

    var that = this;
    this.$nextTick(function () {
      that.Load();
    });
  },
  methods: {
    //#region 加载用户上传模型库
    async Load() {
      //加载角色模型
      let path = "models/players";
      let fromData = new FormData();
      fromData.append("filePath", this.serverPath + path);
      let response = await GetPathFolders(fromData);
      for (let i = 0; i < response.length; i++) {
        const item = response[i];
        this.LoadTxt("角色", item, this.serverPath + path);
      }

      // 加载npc模型;
      path = "models/npc";
      fromData.set("filePath", this.serverPath + path);
      response = await GetPathFolders(fromData);
      for (let i = 0; i < response.length; i++) {
        const item = response[i];
        this.LoadTxt("npc", item, this.serverPath + path);
      }

      //加载静态模型
      path = "models/staticModels";
      fromData.set("filePath", this.serverPath + path);
      response = await GetPathFolders(fromData);
      for (let i = 0; i < response.length; i++) {
        const item = response[i];
        this.LoadStaticModelTxt(item, this.serverPath + path);
      }
    },
    async LoadTxt(type, filePath, serverPath) {
      // console.log("加载文本", this.serverPath+"/" +filePath+"/"+filePath+"_avatar.txt");
      let fromData = new FormData();
      fromData.append(
        "dataPath",
        serverPath + "/" + filePath + "/" + filePath + "_avatar.txt"
      );
      let response = await LoadFile(fromData);
      if (response == null || response == "") {
        return;
      }
      response.assetId = filePath;
      console.log("加载 角色 数据",response);
      this.modelsList.push({ modelType: type, modelData: response });
    },

    async LoadStaticModelTxt(filePath, serverPath) {
      let fromData = new FormData();
      fromData.append(
        "dataPath",
        serverPath + "/" + filePath + "/" + filePath + "_modelData.txt"
      );
      let response = await LoadFile(fromData);
      if (response == null || response == "") {
        return;
      }
      // console.log("加载角色数据",response);
      this.modelsList.push({ modelType: "静态模型", modelData: response });
    },

    //#endregion

    //#region
    //#endregion

    //#region 模型库
    //切换模型table
    SelectTable(e) {
      this.selectModelTable = e;
    },

    //------------- 玩家创建模型 开始 -------------

    SelectModel(item) {
      // console.log("点击创建", item);
      if (item.modelType == "角色") {
        //点击角色图标，切换角色avatar
        this.$parent.$refs.ThreejsHumanChat.ChangeAvatarByCustom(
          item.modelData,
          true
        );
      } else {
        this.$parent.SelectStaticModel(item.modelType,item.modelData);
      }
    },

    //-------------  玩家创建模型 结束 -------------
    //#endregion
  },
};
</script>

  <style scoped>
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
/* 阻止长按复制 */
.stop-long-hover {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.max-w-1200 {
  max-width: 1200px;
}
::-webkit-scrollbar {
  /* 滚动条整体部分 */
  /* width:0px; */
  border-radius: 10px;
  width: 10px;
  margin-right: 2px;
  /* display: block !important; */
  /* 控制滑动条是否显示 */
  display: none;
}
::-webkit-scrollbar-button {
  /* 滚动条两端的按钮 */
  width: 10px;
  background-color: #adadad;
  display: none;
}
::-webkit-scrollbar:horizontal {
  height: 10px;
  margin-bottom: 2px;
}
::-webkit-scrollbar-track {
  /* 外层轨道 */
  border-radius: 10px;
}
::-webkit-scrollbar-track-piece {
  /*内层轨道，滚动条中间部分 */
  background-color: #cbcbcb;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  /* 滑块 */
  width: 10px;
  border-radius: 5px;
  background: #adadad;
}
::-webkit-scrollbar-corner {
  /* 边角 */
  width: 10px;
  background-color: #cbcbcb;
  display: none;
}
::-webkit-scrollbar-thumb:hover {
  /* 鼠标移入滑块 */
  background: #adadad;
}
</style>
