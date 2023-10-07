
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <!-- <ThreejsHumanChat id="ThreejsHumanChat" tabindex="-1" class="absolute left-0 top-0" ref="ThreejsHumanChat" /> -->

  <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

  <!-- 加载loading -->
  <loadingPanel class="absolute z-50 left-0 top-0 pointer-events-none" ref="loadingPanel" />
  <dialogPanel ref="dialogPanel" v-if="isInsertPanel" />


  <!-- 鸟瞰2d点位 -->
  <div v-if="niaokanUI" class="absolute left-0 top-0 z-10 w-full h-full pointer-events-none overflow-hidden">
    <div>
      <div v-for="(item, i) in projectionList" :key="i" :index="item.id"
        class="text-xl flex cursor-pointer pointer-events-auto   w-10 h-10 transform -translate-x-5 -translate-y-5  "
        :style="' position:absolute; left: ' +
          (item.pos.x) +
          'px;top: ' +
          (item.pos.y) +
          'px'
          " @click="ClickProjectionId(item.id)">
        <div class=" flex  w-full h-full  rounded-full bg-gray-400 bg-opacity-50  ">
          <div class=" self-center mx-auto text-white ">
            {{ (i + 1) }}
          </div>
        </div>
        <!-- :style="' position:absolute; left:'+item.pos.x+'px;top:'+i*100+'px'" -->

      </div>
    </div>
  </div>
</template>

<script>
// 三维页
// import ThreejsHumanChat from "/@/threeJS/threeSHJKGChat.vue";

import dialogPanel from "./dialogPanel.vue";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

// 加载进度页
import loadingPanel from "./loadingPanel.vue";

// 配置文件
import AvatarData from "../data/sceneSetting.js";

import { SceneManager } from "../js/SceneManager.js";

import { deepClone } from "/@/utils/deepclone.js";
import { Interface } from "../js/Interface.js";
export default {
  name: "index",
  components: {
    loadingPanel,
    YJmetaBase,
    dialogPanel,
  },
  data() {
    return {
      isInsertPanel: false,
      // 是否显示姓名条
      displayUserNameUI: false,

      // 是否显示摇杆。 右摇杆跟随左摇杆显示隐藏
      displayJoystick: true,
      //是否可交互的提示
      jiaohuTip: false,

      clickHotpointDoonce: 0,

      niaokanUI: true,

      _SceneManager: null,
      projectionList: [],
      Interface: null,
    };
  },

  created() {
    this.avatarData = AvatarData;

    this.$publicUrl += this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);

    // window.onChangeViewById += this.ChangeViewById;
    // var myevent = new CustomEvent('onChangeViewById',{
    //   detail:{

    //   },
    // });
    this.Interface = new Interface(this);
    // window.onChangeViewById(10001);
  },
  mounted() {
    this.$refs.YJmetaBase.ClickeSelectOK();


    // 进度条发送到三维页
    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    // this.otherLoadManager = new YJLoadOtherModelManager_MOT(
    //   this.$refs.YJmetaBase.ThreejsHumanChat,
    //   this
    // );


  },
  methods: {

    GetPublicUrl() {
      return this.publicUrl;
    },
    GetSceneTexPath() {
      return this.GetModelUrl() + this.avatarData.sceneTexPath;
    },
    GetModelUrl() {
      return this.avatarData.modelPath;
    },
    GetPublicModelUrl() {
      return this.GetPublicUrl() + this.avatarData.modelPath;
    },

    // 3转2坐标
    UpdateProjectionUI(_projectionList) {
      // this.projectionList = [];
      if (this.projectionList.length != _projectionList.length) {
        this.projectionList = deepClone(_projectionList);
      }
      for (let i = 0; i < _projectionList.length; i++) {
        for (let ii = 0; ii < this.projectionList.length; ii++) {
          if (_projectionList[i].id == this.projectionList[ii].id) {
            this.projectionList[ii].pos = _projectionList[i].pos;
            // console.log("设置投影坐标 ");
          }
        }
      }
      // console.log(" 3转2 ", _projectionList);
    },
    ClickProjectionId(id) {
      // this.oldDialogId = id;
      // this.oldDialogId =hotPointData.id;
      console.log("点击热点 ", id);
      // this.HotPointFn(
      //   this.$refs.ThreejsHumanChat._YJSceneManager.GetHotPointDataById(id)
      // );

      //打开 弹窗时，关闭threejs控制
      this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(false);
      this.$refs.YJmetaBase.removeThreeJSfocus();

      // 摄像机插值移动到热点前方距离x的位置，并朝向热点

      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ResetSingleCtrl(
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetCamPosAndRota(id),
        () => {

          console.log("点击 热点后 移动到热点前方  ");

          this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(true);
          this.$refs.YJmetaBase.addThreeJSfocus();
        }
      );

    },

    SetforcedLandscape(forcedLandscape) {
      console.log("MOT 中设置强制横屏 " + forcedLandscape);

    },
    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) {
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(
        id
      );
    },
    LoadingProcess(f) {
      this.Interface.SendLoadingProcess(f);// 3d加载进度   0-1 
    },
    // 接收 界面前端 接口发过来信息
    InterfaceMsg(msg) {
      if (msg == "开始游戏") {
        console.log("点击 游戏 的热点---开始游戏 ");
        this.otherLoadManager.BeginGame();
      }
    },
    // 向 界面前端 接口发送
    SendInterface(msg) {
      if (msg == "游戏完成") {

        if (this.inLocal) {
          setTimeout(() => {
            if (this.$refs.dialogPanel) {
              this.$refs.dialogPanel.loadMsg("游戏完成");
            }
          }, 1000);
        }
        this.Interface.submitGame(msg);
        return;
      }
      if (msg == "游戏开始") {
      }

    },

    GetPublicUrl() {
      return this.$publicUrl;
    },
    OpenThreejs() {
      this.$refs.YJmetaBase.OpenThreejs();
    },
    // 如果3d加载好了能点击跳转时候 执行一下
    load3dComplete(callback) {
      this.OpenThreejs();
      setTimeout(() => {
        this.Interface.load3dComplete();
      }, 200);

      //场景设置
      this._SceneManager = new SceneManager(
        this.$refs.YJmetaBase.ThreejsHumanChat.scene,
        this.$refs.YJmetaBase.ThreejsHumanChat.renderer,
        this.$refs.YJmetaBase.ThreejsHumanChat.camera,
        this.$refs.YJmetaBase.ThreejsHumanChat,
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetmodelParent(),
        this,
        () => {
          if (callback) {
            callback();
          }

        }
      );

      this._SceneManager.ChangeScene(this.avatarData);

      this.$refs.YJmetaBase.ThreejsHumanChat.PlayVideo();

      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetViewState("鸟瞰");
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetAmmoEnabled(false);

    },
    JoystickAxis(x, y) {
      this.$refs.YJmetaBase.ThreejsHumanChat.JoystickAxis(x, y);
    },
    JoystickAxisRight(x, y) {
      this.$refs.YJmetaBase.ThreejsHumanChat.JoystickAxisRight(x, y);
    },
    CloseDialogPanel() {
      //关闭 弹窗时，开启threejs控制
      this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(true);
      this.$refs.YJmetaBase.addThreeJSfocus();

      this.isInsertPanel = false;

      return;
      //相机位置还原
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ResetToBeforeOnlyMove(
        () => {
          this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(
            true
          );
          this.$refs.YJmetaBase.addThreeJSfocus();

          this.animModelId = "";

        }
      );
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.PlayAnimModel(
        this.animModelId,
        "rewind"
      );
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        this.animModelId,
        true
      );

      for (let i = 0; i < this.hotPointContainHitPoint.length; i++) {
        const item = this.hotPointContainHitPoint[i];
        if (item.hotPointId == this.animModelId) {
          // console.log("显示指定热点id 的点击id " + item.hotPointId );
          for (let j = 0; j < item.hitPointList.length; j++) {
            const hitid = item.hitPointList[j];
            // console.log("显示指定 的点击id " + hitid );
            this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetHotPointCtrl(
              hitid,
              "代码控制显示a点击a使用id",
              "隐藏点击"
            );
          }
        }
      }
      if (this.animModelId == "game") {
        console.log(" 关闭游戏 ");
        this.otherLoadManager.CloseGame();
      }

      // 隐藏所有文字热点的 hit 和 icon 
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetAllTextHotPoint(false);
      // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetHotPointCtrl(this.animModelId,"代码控制显示a点击a使用id","隐藏点击");
    },


    // 进入trigger有效区域，向前端发送显示提示窗口
    EnterTriggerArea(id) {
      // console.log(" 进入 trigger id " + id);
      if (id == "door") { return; }
      if (this.clickHotpointDoonce < 1) {
        this.Interface.displayTip();
      }
    },
    CreateHotContent(modelData) {
      console.log(" modelData = ", modelData);
      this.clickHotpointDoonce++;


      if (this.inLocal) {

        //打开 弹窗时，关闭threejs控制
        this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(false);
        this.$refs.YJmetaBase.removeThreeJSfocus();
        this.isInsertPanel = true;

        this.$nextTick(() => {
          if (this.$refs.dialogPanel) {
            this.$refs.dialogPanel.loadData(modelData);
          }
        });
      }
      return;


      // 点击装置前的脚印，lerp 跳转到装置前
      if (modelData.type == "直接显示a点击a使用id") {
        if (modelData.id.indexOf("jump_") > -1) {
          let sp = modelData.id.split('_');
          // 1，查找改id下的角色位置point数据
          let id = sp[1];
          let hotPointData = this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetHotPointDataById(id);
          // 2，插值移动到该位置
          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerPosRotaLerp(hotPointData, () => {

            // lerp到底位置后，需要再次调用直接跳转到该位置.以让水平方向旋转正确    
            this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(id);
          });

          // console.log(" 跳转到装置 " + id + " 前",hotPointData );
          return;
        }
      }


      // 传送门没有弹窗
      if (modelData.id == "dfshub") {
        // 播放模型第二段动画
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.PlayAnimModel2(
          modelData.id,
          "two"
        );
        setTimeout(() => {
          this.Interface.OpenDialog(modelData.id);
        }, 2000);
        return;
      }
      if (modelData.id.indexOf("nft") > -1) {
        this.Interface.LoadData(modelData.id);
        return;
      }

      if (modelData.id.indexOf("door") > -1) {
        this.Interface.LoadData(modelData.id);
        return;
      }
      // return;

      if (modelData.type == "代码控制显示a点击a使用id") {
        //视角推进完成后，点击商品热点，向父页面发送商品id

        //视角推进完成后，点击商品热点，向父页面发送商品id
        this.Interface.LoadData(modelData.id);

        if (this.inLocal) {
          if (this.$refs.dialogPanel) {
            this.$refs.dialogPanel.loadData(modelData);
          }
        }

        return;
      }


      // // 是否需要推进视角
      // if (modelData.type == "直接显示a点击a使用id") {
      //   //视角推进完成后，点击商品热点，向父页面发送商品id
      //   this.Interface.OpenDialog(modelData.id);
      //   if (this.inLocal) {
      //     if (this.$refs.dialogPanel) {
      //       this.$refs.dialogPanel.OpenDialog(modelData);
      //     }
      //   }
      //   return;
      // }


      if (modelData.type == "代码控制显示a点击a使用ida显示point") {
        //视角推进完成后，点击商品热点，向父页面发送商品id

        //视角推进完成后，点击商品热点，向父页面发送商品id
        this.Interface.LoadData(modelData.id);

        if (this.inLocal) {
          if (this.$refs.dialogPanel) {
            this.$refs.dialogPanel.loadData(modelData);
          }
        }
        console.log(" in 显示文字 text 上的icon ");

        return;
      }

      // 查找相机坐标和相机lookat坐标，设置相机位置
      let id = modelData.id;
      if (id == this.animModelId) { return; }

      this.animModelId = id;






      //打开 弹窗时，关闭threejs控制
      this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(false);
      this.$refs.YJmetaBase.removeThreeJSfocus();


      this.Interface.ClickMachine(id);

      // 播放模型第二段动画
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.PlayAnimModel(
        id,
        "two"
      );

      // 隐藏热点
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        id,
        false
      );
      //向前端发送正在跳转角度
      this.Interface.hasIn3D();


      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCamPosAndRota(
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetCamPosAndRota(
          id
        ),
        () => {


          // 显示指定id文字热点的 hit 和 icon 
          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetAllTextHotPoint(true, id);

          //视角推进完成后向父页面发送可以打开弹窗
          // 打开弹窗，只有返回按钮
          this.Interface.OpenDialog(this.animModelId);

          if (this.inLocal) {
            this.isInsertPanel = true;

            if (this.animModelId == "game") {
              console.log("点击 游戏 的热点---开始游戏 ");
              this.otherLoadManager.BeginGame();
            } else {
              // this.$nextTick(() => {
              //   this.$refs.dialogPanel.loadData(modelData);
              // });
            }
          }

          //点击热点后，在装置旁边显示装置的文字
          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetHotPointCtrl(
            "text_" + id,
            "代码控制显示a点击a使用ida显示point",
            "显示点击"
          );

          // 一个热点id只控制单个其他热点的显示与隐藏
          // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetHotPointCtrl(id,"代码控制显示a点击a使用id","显示点击");

          // 一个热点id需要控制多个其他热点的显示与隐藏
          for (let i = 0; i < this.hotPointContainHitPoint.length; i++) {
            const item = this.hotPointContainHitPoint[i];
            if (item.hotPointId == this.animModelId) {
              // console.log("显示指定热点id 的点击id " + item.hotPointId );
              for (let j = 0; j < item.hitPointList.length; j++) {
                const hitid = item.hitPointList[j];
                // console.log("显示指定 的点击id " + hitid );
                this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetHotPointCtrl(
                  hitid,
                  "代码控制显示a点击a使用id",
                  "显示点击"
                );
              }
            }
          }
        }
      );

      // console.log(" 点击 MOT 热点 ",modelData);
    },
  },
};
</script>
 
