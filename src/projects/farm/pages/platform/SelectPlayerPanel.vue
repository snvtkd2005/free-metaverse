

// 游戏开始前的 角色选择界面
<template>
  <div class="w-full h-full bg-white overflow-hidden">
    <div class="hidden absolute top-0 left-0 cutimg overflow-hidden">
      <canvas id="nowcanvas" class=""> </canvas>
    </div>

    <!-- 角色选择 和 场景选择 -->
    <div class="
        absolute
        top-10
        xl:top-20
        left-10
        xl:left-20
        z-60
        w-64
        xl:w-auto
        h-auto
      ">
      <!-- 角色选择 -->
      <div class="xl:w-auto w-auto h-auto self-center mx-auto">
        <div class="
            flex
            mb-2
            xl:mb-5
            origin-top-left
            w-32
            xl:w-auto
            text-3xl
            font-bold
          ">
          可选Avatar
        </div>

        <!-- 列表 -->
        <div class="
            w-full
            max-w-2xl
            h-16
            gap-3
            xl:gap-10 xl:h-2/3
            justify-items-start
            grid grid-cols-4
          ">
          <div v-for="(item, i) in playerImgPath" :key="i" :index="item.img" class="
              w-16
              h-16
              xl:w-32 xl:h-32
              transform
              hover:scale-110
              self-center
              mx-auto
              cursor-pointer
              flex
              relative
            " :class="selectPlayerName == item.name ? ' ' : ' '" @click="SelectAvatar(item)">
            <div class="self-center mx-auto w-full h-full rounded-full">
              <img class="w-full h-full rounded-full" :src="item.img" />
            </div>
            <div v-if="selectPlayerName == item.name" class="absolute bottom-0 right-0">
              <img class="w-4 h-4 xl:w-full xl:h-full object-fill" :src="publicUrl + 'images/spUI/select.png'" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧角色模型展示 -->
    <div class="absolute z-20 right-0 top-0 w-full md:w-1/2 h-full overflow-hidden">
      <playerSelect3DPanel id="contain" class="w-full h-full" ref="playerSelect3DPanel"></playerSelect3DPanel>
      <YJinputPlayerName class="absolute bottom-16 md:bottom-6 xl:bottom-2 w-full h-16" :callback="ChangeNickName" />
      <!-- 角色换装选择  -->
      <div class="
          absolute
          z-30
          left-10
          top-10
          w-1/2
          xl:w-1/2
          h-full
          overflow-hidden
          pointer-events-none
          text-black
        ">
        <SkinPanel class="w-full h-full" ref="SkinPanel" :skinData="skinData"></SkinPanel>
      </div>

      <div v-if="needEnter" class="absolute w-full bottom-4 mt-10 text-black">
        <div class="px-2 inline-block rounded-lg shadow-md bg-blue-100 cursor-pointer" @click="ClickeSelectOK()">
          进入元宇宙
        </div>
      </div>
    </div>

    <div class="
        hidden
        xl:flex
        absolute
        z-20
        right-4
        top-20
        text-black
        overflow-hidden
      ">
      <YJinput_drop class="w-32 h-16" :value="animValue" :options="animList" :callback="ChangeAnim" />

      <!--  -->
      <div v-if="this.selectPlayerName != 'litleUnityChain2'" class="mt-2 w-32 h-10 text-white cursor-pointer" @click="editorPlayer()">
        <div class="mt-2 bg-445760 rounded-md inline-block px-6 py-1">编辑</div>
      </div>
    </div>
  </div>
</template>

<script>
//角色动作数据
import PlayerAnimData from "../../data/platform/playerAnimSetting.js";

import playerSelect3DPanel from "../playerSelect3DPanel.vue";
import SkinPanel from "../SkinPanel2.vue";

import YJinput_drop from "./components/YJinput_drop.vue";
import YJinputPlayerName from "./components/YJinputPlayerName.vue";

import { GetAllModel } from "../../js/uploadThreejs.js";

export default {
  name: "index",
  props: ["userName"],
  components: {
    playerSelect3DPanel,
    SkinPanel,
    YJinput_drop,
    YJinputPlayerName,
  },
  data() {
    return {
      animValue: "idle",
      animList: [],

      skinData: {},

      language: {
        content: {
          enterUserName: "输入昵称",
          selectOK: "进入元宇宙",
        },
      },

      selectPlayerName: "小孩",

      // 角色选择界面的角色信息
      playerImgPath: [],

      publicUrl: "./public/farm/",
      userName: "",

      needEnter: false,
    };
  },
  created() {
    this.avatarData = PlayerAnimData;
  },

  mounted() {

    this.playerImgPath = this.avatarData.playerImgPath;
    for (let i = 0; i < this.playerImgPath.length; i++) {
      const element = this.playerImgPath[i];
      element.img = this.publicUrl + element.img;
    }

    window.addEventListener("keydown", this._onKeyDown);
    this.GetServerAvatar(() => {


      this.selectPlayerName = this.playerImgPath[0].name;

      if (localStorage.getItem("avatarName")) {
        this.selectPlayerName = localStorage.getItem("avatarName");
      }

      if (localStorage.getItem("userName")) {
        this.userName = localStorage.getItem("userName");
      }

      if (localStorage.getItem("needEnter")) {
        this.needEnter = true;
      }

      // this.selectPlayerName = this.avatarData.defaultUser.avatarName;
      console.log("  this.selectPlayerName =  ", this.selectPlayerName);


      this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);

      setTimeout(() => {
        this.skinData = this.$refs.playerSelect3DPanel.GetAvatarData(
          this.selectPlayerName
        ).skinData;
        if (this.skinData != undefined && this.skinData.length > 1) {
          setTimeout(() => {
            this.UpdateSkin(localStorage.getItem("playerState"));
          }, 100);
        } else {
          this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
        }

        this.updateAnimList(this.selectPlayerName);
      }, 100);
    });
  },
  methods: {
    GetServerAvatar(callback) {
      this.RequestModelByModelType("角色模型", (avatarList) => {
        console.log(" 获取所有用户上传的角色模型 ", avatarList);
        for (let i = 0; i < avatarList.length; i++) {
          const element = avatarList[i];
          // 到角色数据中，模型路径、动画数据
          let data = element.message.data;
          data.modelPath = this.$uploadUrl + element.modelPath;
          this.$refs.playerSelect3DPanel.AddAvatarData(data);

          if (element.folderBase == "farmPlayer" || element.name == "小孩") {
            continue;
          }
          // 加入到选中icon中，角色名、角色icon
          this.playerImgPath.push({
            name: element.name,
            folderBase: element.folderBase,
            img: this.$uploadUrl + element.icon,
          });
        }
        if (callback) {
          callback();
        }
      });
    },

    async RequestModelByModelType(modelType, callback) {
      GetAllModel().then((res) => {
        console.log("获取所有单品模型 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          let modelsList = [];
          for (let i = 0; i < txtDataList.length; i++) {
            let element = txtDataList[i];
            try {
              modelsList.push(JSON.parse(element));
            } catch (error) {
              element = element.substring(1);
              modelsList.push(JSON.parse(element));
            }
          }
          let temp = [];
          for (let i = 0; i < modelsList.length; i++) {
            const element = modelsList[i];
            if (element.modelType == modelType) {
              temp.push(element);
            }
          }
          if (callback) {
            callback(temp);
          }
        }
      });
    },

    ChangeNickName(e) {
      this.userName = e;
      localStorage.setItem("userName", this.userName);
    },
    editorPlayer() {
      localStorage.setItem("inAvatarEditor", "hasImport")
      let path = "/editorSingle";
      _Global.reloadTimes = 1;
      // 新窗口 新标签
      let href = this.$router.resolve({
        name: path.replace("/", ""),
        query: {
          folderBase: this.folderBase,
        },
      });
      window.open(href.href, "_blank");
    },
    updateAnimList(selectPlayerName) {
      this.animList = [];
      this.$refs.playerSelect3DPanel.GetAllAnim(
        selectPlayerName,
        (_animList) => {
          for (let i = 0; i < _animList.length; i++) {
            const element = _animList[i];
            if (element != "") {
              this.animList.push({ value: element, label: element });
            }
          }
        }
      );
    },
    GetPlayerAnimData() {
      return PlayerAnimData;
    },

    ChangeAnim(e) {
      if (this.$refs.playerSelect3DPanel) {
        this.$refs.playerSelect3DPanel.ChangeAnimDirect(e);
      }
    },
    ClickChangeSkin(item, i2) {
      item.selected = i2;
      // console.log(" 切换皮肤 ", item.part);

      let mode = item.mode;
      let part = item.part;
      let targetPath = item.modelPath[i2];

      let faceSourcePath = "";
      let faceAddPath = "";
      let state = "";
      for (let i = 0; i < this.skinData.length; i++) {
        const element = this.skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }

        state += element.selected + "_";
      }
      // console.log(" 脸部原始贴图路径 ", faceSourcePath);
      //换装
      this.$refs.playerSelect3DPanel.ChangeSkin(
        targetPath,
        part,
        mode,
        faceSourcePath
      );
      if (part == "eye") {
        this.$refs.playerSelect3DPanel.ChangeSkin(
          targetPath,
          "Face",
          mode,
          faceSourcePath
        );
        this.$refs.playerSelect3DPanel.ChangeSkin(
          faceAddPath,
          "Face",
          "addTexture",
          faceSourcePath
        );
      }

      localStorage.setItem("playerState", state);
    },
    UpdateSkin(playerState) {
      if (playerState == null || playerState == undefined) {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
        return;
      }

      let sp = playerState.split("_");
      for (let i = 0; i < this.skinData.length; i++) {
        this.skinData[i].selected = parseInt(sp[i]);
      }

      let mode = "";
      let part = "";
      let targetPath = "";

      let faceSourcePath = "";
      let faceAddPath = "";

      for (let i = 0; i < this.skinData.length; i++) {
        const element = this.skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }
      }

      for (let i = 0; i < this.skinData.length; i++) {
        const element = this.skinData[i];
        if (element.title == "eye") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
          this.$refs.playerSelect3DPanel.ChangeSkin(
            targetPath,
            "Face",
            element.mode,
            faceSourcePath
          );
          this.$refs.playerSelect3DPanel.ChangeSkin(
            faceAddPath,
            "Face",
            "addTexture",
            faceSourcePath
          );
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
        }
      }

      setTimeout(() => {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
      }, 200);
    },

    _onKeyDown(event) {
      // console.log(event.code);
      switch (event.code) {
        case "Enter":
          this.ClickeSelectOK();
          break;
        case "NumpadEnter":
          this.ClickeSelectOK();
          break;
      }
    },

    GetPublicUrl() {
      return this.publicUrl;
    },
    SelectAvatar(item) {
      console.log("选择角色", item);
      this.selectPlayerName = item.name;
      this.folderBase = item.folderBase;

      if (this.selectPlayerName == "小孩") {
        this.folderBase = "farmplayer";
      }
      // console.log("this.selectPlayerName = " + this.selectPlayerName);
      //加载3d模型
      this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);
      this.skinData = this.$refs.playerSelect3DPanel.GetAvatarData(
        this.selectPlayerName
      ).skinData;
      if (this.skinData != undefined && this.skinData.length > 1) {
        setTimeout(() => {
          this.UpdateSkin(localStorage.getItem("playerState"));
        }, 100);
      } else {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
      }
      this.updateAnimList(this.selectPlayerName);
      localStorage.setItem("avatarName", this.selectPlayerName);
    },
    ClickeSelectOK() {
      if (this.selectPlayerName == "") {
        return;
      }
      if (this.userName == "") {
        return;
      }

      localStorage.removeItem("needEnter");
      localStorage.setItem("avatarName", this.selectPlayerName);
      localStorage.setItem("userName", this.userName);

      localStorage.setItem("reloadTimes", 1);
      // 跳转页面
      this.$router.replace(
        "/editorVisit?folderBase=" + localStorage.getItem("visitfolderBase")
      );
    },
  },
};
</script>

<style >
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.scale-30 {
  --tw-scale-x: 0.3;
  --tw-scale-y: 0.3;
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
