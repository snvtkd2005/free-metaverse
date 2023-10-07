// 游戏开始前的 角色选择界面
<template>
  <div class="container-wrap">
    <div class="user-select-wrap">
      <div class="model-area">
        <div class="model">
          <!-- <div id="contain" class="model-show" ref="YJ3dscene"></div> -->
          <playerSelect3DPanel
            id="contain"
            class="model-show"
            ref="playerSelect3DPanel"
          ></playerSelect3DPanel>

          <div class="nickname">
            <div class="nickname-box">
              <div>{{ language.content.enterUserName }}：</div>
              <div>{{ userName }}</div>
              <!-- <input type="text" ref="nickNameInput" v-model="userName" :placeholder="language.content.enterUserName"
                @keyup.enter="ClickeSelectOK"> -->
            </div>
          </div>
        </div>
      </div>
      <div class="avatar-area">
        <div class="select-txt">
          <img
            :src="publicUrl + '/images/user/select-txt.png'"
            alt="{{ language.content.selectAvatar }}"
          />
          <div class="gold-line"></div>
        </div>
        <div class="avatar-list">
          <div
            v-for="(item, i) in playerImgPath"
            :key="i"
            :index="item.img"
            class="avatar-box"
            :class="selectPlayerName == item.name ? 'bg-white' : 'bg-red'"
            @click="SelectAvatar(item.name)"
          >
            <div class="avatar">
              <img class="avatar-pic" :src="publicUrl + item.img" />
              <div v-if="selectPlayerName == item.name" class="selected-box">
                <img
                  class="selected"
                  :src="publicUrl + '/images/user/selected.png'"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="enter-scene">
          <div class="enter-scene-btn" @click="ClickeSelectOK()">
            <img
              :src="publicUrl + '/images/user/enter.png'"
              alt="{{ language.content.selectOK }}"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="absolute left-0 top-0 w-1/2 h-full"></div>
</template>

<script>
//角色动作数据
import PlayerAnimData from "../data/playerAnimSetting.js";

import playerSelect3DPanel from "./playerSelect3DPanel.vue";

export default {
  name: "index",
  props: [],
  components: {
    playerSelect3DPanel,
  },
  data() {
    return {
      language: {
        content: {
          enterUserName: "昵称",
          selectOK: "进入元宇宙",
          selectScene: "选择场景",
        },
      },

      // 皮肤弹出框的角色选项
      modelsList: [],

      selectPlayerName: "nanhai",
      selectSceneName: "scene1",

      // 角色选择界面的角色信息
      playerImgPath: [],
      sceneImgPath: [],

      publicUrl: "",
      userName: "",
    };
  },
  created() {
    this.avatarData = PlayerAnimData;
    // this.avatarData = this.$parent.avatarData;
    // this.language = this.$parent.language;

    // this.language.content.selectOK = "进入元宇宙";
    // this.language.content.selectScene = "选择场景";
  },
  mounted() {
    this.playerImgPath = this.avatarData.playerImgPath;
    this.sceneImgPath = this.avatarData.sceneList;
    this.modelsList = this.avatarData.modelsList;
    // this.publicUrl = this.$parent.GetPublicUrl();
    
    this.publicUrl = this.$publicUrl + "newsMeta/";

    // console.log("_Global.userData ",_Global.userData);

    let logininfo = JSON.parse(localStorage.getItem("loginInfo"));
    _Global.userData = logininfo;
    console.log("loginInfo", _Global.userData);

    if (_Global.userData == undefined || _Global.userData == null) {
      this.selectPlayerName = this.avatarData.defaultUser.avatarName;
    } else {
      this.selectPlayerName = _Global.userData.char_ext;
      // this.userName = "嘉宾" + _Global.userData.user_iid;
      this.userName =  "嘉宾" +this.numToString(logininfo.user_iid);
      if (this.selectPlayerName == "" || this.selectPlayerName == null) {
        this.selectPlayerName = this.avatarData.defaultUser.avatarName;
      }
      if (this.userName == "" || this.userName == null) {
        this.userName = "";
      }
    }

    //输入框重新获取焦点
    // this.$refs.nickNameInput.focus();

    this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);
  },
  methods: {
    numToString(num) {
      let n = parseInt(num);
      if (n < 10) {
        return "000" + n;
      }
      if (n < 100) {
        return "00" + n;
      }
      if (n < 1000) {
        return "0" + n;
      }
      return "" + n;
    },
    GetPublicUrl() {
      return this.publicUrl;
    },
    SelectScene(e) {
      this.selectSceneName = e;
      this.$parent.SelectScene(this.selectSceneName);
    },
    SelectAvatar(e) {
      this.selectPlayerName = e;
      this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);
    },
    ClickeSelectOK() {
      if (this.selectPlayerName == "") {
        return;
      }
      if (this.userName == "") {
        return;
      }

      localStorage.setItem("avatarName", this.selectPlayerName);
      localStorage.setItem("userName", this.userName);
      _Global.reloadTimes = 1;
      this.$router.replace({
        path: "/newsmeta/" + this.userName,
        query:{
          userName:this.userName
        }
      });
      // this.$parent.ClickSelectPlayerOK(this.selectPlayerName, this.userName);
    },
  },
};
</script>

<style scoped>
/*竖屏*/

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

/*new style*/
.container-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.user-select-wrap {
  height: 100%;
  width: 100%;
  background-image: url(/images/user/user-back.png);
  background-size: cover;
  display: flex;
  align-items: center;
}

.model-area {
  width: 40%;
  height: 90%;
}

.avatar-area {
  width: 60%;
  height: 90%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-content: space-between;
  align-items: center;
}

.avatar-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  max-width: 45rem;
}

.avatar-box {
  width: 25%;
  margin: 3% auto;
}

.select-txt img {
  width: 18%;
}

.select-txt {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.gold-line {
  width: 4rem;
  border-bottom: 1px solid #f2cb91;
  margin-top: 1rem;
}

.avatar {
  text-align: center;
  background: rgb(242, 205, 205);
  border-radius: 1rem;
  position: relative;
  margin: auto 5%;
  cursor: pointer;
}

img.avatar-pic {
  width: 80%;
  margin-top: 10%;
  margin-bottom: 10%;
}

img.selected {
  width: 100%;
}

.selected-box {
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 20%;
}

.enter-scene {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.enter-scene-btn {
  width: 22%;
  min-width: 10rem;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
}

.enter-scene-btn img {
  width: 100%;
}

.nickname-box {
  display: flex;
  width: 60%;
  background: white;
  height: 2.5rem;
  border-radius: 5px;
  line-height: 2.5rem;
  align-items: center;
  margin: auto;
}

.nickname-box div {
  margin-left: 5%;
}

.nickname-box input {
  font-size: 1rem;
  border: none;
  outline: none;
  width: 50%;
}

.nickname {
  width: 100%;
  position: absolute;
  bottom: 10%;
}

.bg-white .avatar {
  background-color: white;
}

.model {
  width: 100%;
  height: 100%;
  position: relative;
}

.model-show {
  width: 100%;
  height: 100%;
}

@media screen and (max-width: 992px) {
  .nickname {
    bottom: 3%;
  }

  .nickname-box {
    height: 2rem;
    min-width: 11rem;
  }

  .nickname-box div {
    font-size: 0.8rem;
  }

  .nickname-box input {
    font-size: 0.8rem;
  }
}
@media screen and (orientation: portrait) {
  .container-wrap {
    position: absolute;
    width: 100vh;
    height: 100vw;
    top: 0;
    left: 100vw;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
    transform-origin: 0% 0%;
  }
}
</style>
