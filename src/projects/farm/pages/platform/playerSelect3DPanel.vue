


<template>
  <div id="contain" class="w-full h-full  " ref="YJ3dscene"></div>
</template>

<script>

import { YJ3dScene_playerSelect } from "/@/threeJS/common/YJ3dScene_playerSelect.js";
import { Interface } from "../../js/Interface_editor.js";

export default {
  name: "playerSelect3DPanel",
  props: [],
  components: {

  },
  data() {
    return {
      avatarData: null,
    };
  },
  created() {
    this._YJ3dScene = null;
    new Interface(this, false);
  },
  mounted() { 
  },
  methods: {
    LoadModel(modelPath){
      this._YJ3dScene.LoadModel(modelPath);
    },
    DelModel(modelPath){
      this._YJ3dScene.DelModel(modelPath);
    },

    GetPublicUrl() {
      return this.publicUrl;
    },
    
    ChangeSkin(targetPath, title,mode,faceSourcePath){
      this._YJ3dScene.ChangeSkin(targetPath, title,mode,faceSourcePath);
    },
    
    ChangeSkinCompleted(){
      this._YJ3dScene.ChangeSkinCompleted();
    },
    NeedChangeSkin(){
      this._YJ3dScene.NeedChangeSkin();
    },
    GetAllAnim(callback){
      return this._YJ3dScene.CreateOrLoadPlayerAnimData().GetAllAnim(this.avatarData,callback);
    },
    GetAvatarData(id) {
      return this._YJ3dScene.CreateOrLoadPlayerAnimData().GetAvatarDataById(id);
    },
    SelectAvatar(selectPlayerId,callback) {

      if (this._YJ3dScene == null) {
        this._YJ3dScene = new YJ3dScene_playerSelect(this.$refs.YJ3dscene, this.$parent);
      }

      this._YJ3dScene.NeedChangeSkin(); 
      this._YJ3dScene.CreateOrLoadPlayerAnimData().GetAvatarDataById(selectPlayerId,(avatarData)=>{

        let modelData = {
          name:avatarData.name,
          modelType:"角色模型",
          modelPath:avatarData.modelPath,
          message:{
            data:avatarData
          }
        }
        localStorage.setItem("modelData", JSON.stringify(modelData));
        this.avatarData = avatarData;
        //加载3d模型
        this._YJ3dScene.ChangeAvatarByCustom(avatarData,callback);

      });
    },
    AddAvatarData (avatarData){
      if (this._YJ3dScene == null) {
        this._YJ3dScene = new YJ3dScene_playerSelect(this.$refs.YJ3dscene, this.$parent);
      }
      this._YJ3dScene.CreateOrLoadPlayerAnimData().AddAvatarData(avatarData);
    },
    GetFaceModel() {
      this._YJ3dScene.GetFaceModel();
    },
    ResetToTPose() {
      this._YJ3dScene.ResetToTPose();
    },
    ChangeAnimDirect(animName){
      this._YJ3dScene.ChangeAnimDirect(animName);
    },
    Close() {
      this._YJ3dScene.Close();
    },
  },
};
</script>

<style scoped>
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
