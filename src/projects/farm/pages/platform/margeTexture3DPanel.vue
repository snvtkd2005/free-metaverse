


<template>
  <div>

  <div id="contain" class="w-full h-full overflow-hidden  " ref="YJ3dscene"></div>

  <div class=" absolute top-0 left-0 cutimg overflow-hidden">
    <canvas id="nowcanvas" class="bg-white"> </canvas>
  </div>
  </div>
</template>

<script>

import { YJ3dScene_margeTexture } from "/@/threeJS/YJ3dScene_margeTexture.js";


export default {
  name: "index",
  props: [],
  components: {

  },
  data() {
    return {

      language: null,

      // 皮肤弹出框的角色选项
      modelsList: [],

      selectPlayerName: "nanhai",
      selectSceneName: "scene1",

      // 角色选择界面的角色信息
      playerImgPath: [],
      sceneImgPath: [],

      publicUrl: "./public/newsMeta/",
      userName: "aaa",
      avatarData: null,
    };
  },
  created() {
    this._YJ3dScene = null;
  },
  mounted() {
    // this.publicUrl = this.$parent.$parent.GetPublicUrl();
    // this.publicUrl = this.$parent.$parent.GetPublicUrl();

    if (this._YJ3dScene == null) {
      this._YJ3dScene = new YJ3dScene_margeTexture(this.$refs.YJ3dscene, this);
    }
  },
  methods: {
    GetPublicUrl() {
      return this.publicUrl;
    },

    SetPlayerAnimData(_avatarData) {
      this.avatarData = _avatarData;
    },
    GetAvatarData(playerName) {
      for (let i = 0; i < this.avatarData.length; i++) {
        if (this.avatarData[i].name == playerName) {
          return this.avatarData[i];
        }
      }
    },
    ChangeSkin(targetPath, title, mode,faceSourcePath) {
      this._YJ3dScene.ChangeSkin(targetPath, title, mode,faceSourcePath);
    },
    SelectAvatar(e) {
      this.selectPlayerName = e;

      // console.log("this.selectPlayerName = " + this.selectPlayerName);
      //加载3d模型
      this._YJ3dScene.ChangeAvatarByCustom(this.GetAvatarData(this.selectPlayerName));
    },
    Close() {
      this._YJ3dScene.Close();
    },
  },
};
</script>

<style scoped>

.cutimg{
  width: 512px;
  height: 512px;
}
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.z-60 {
  z-index: 60;
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
