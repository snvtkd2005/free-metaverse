
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <!-- <ThreejsHumanChat id="ThreejsHumanChat" tabindex="-1" class="absolute left-0 top-0" ref="ThreejsHumanChat" /> -->

  <div :class="this.avatarData.setting.onlyLandscape ? 'main' : ''">
    <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

    <!-- 加载loading -->
    <loadingPanel class="absolute z-50 left-0 top-0 pointer-events-none" ref="loadingPanel" />

    <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
    <div class=" absolute left-0 top-0 w-full h-full pointer-events-none " v-if="isMobile && contrlState == 0">
      <JoystickLeftPanel class="" ref="JoystickLeftPanel" />      
      <JoystickRightPanel class="  " v-if="displayJoystick" ref="JoystickRightPanel" />

    </div>

    <dialogPanel ref="dialogPanel" v-if="isInsertPanel" />
      <!-- 鸟瞰2d点位 -->
  <div
    v-if="projectionList.length>0"
    class="absolute left-0 top-0 z-10 w-full h-full pointer-events-none"
  >
    <div>
      <div
        v-for="(item, i) in projectionList"
        :key="i"
        :index="item.id"
        class="text-xl flex cursor-pointer pointer-events-auto w-14 h-14 bg-white  "
        :style="
          ' position:absolute; left:' +
          (item.pos.x ) +
          'px;top:' +
          (item.pos.y ) +
          'px'
        "
      >
       
      </div>
    </div>
  </div>


  </div>
</template>

<script>
// 三维页
// import ThreejsHumanChat from "/@/threeJS/threeSHJKGChat.vue";

import dialogPanel from "./dialogPanel.vue";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

// 摇杆
import JoystickLeftPanel from "/@/views/chat/MOT/joystickLeft.vue";
import JoystickRightPanel from "/@/views/chat/MOT/joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel.vue";

// revelya
import AvatarData from "/@/data/playerSelectMOT.js";

import Language from "/@/data/zh_cn.js";

import { YJLoadOtherModelManager_MOT } from "/@/threeJS/YJLoadOtherModelManager_MOT.js";

import { MOT_three_Interface } from "/@/threeJS/MOT_three_Interface.js";

export default {
  name: "index",
  components: {
    // ThreejsHumanChat,
    loadingPanel,
    JoystickLeftPanel,
    JoystickRightPanel,
    YJmetaBase,
    dialogPanel,
  },
  data() {
    return {
      isInsertPanel: false,
      // 是否显示姓名条
      displayUserNameUI: false,

      // 是否显示摇杆。 右摇杆跟随左摇杆显示隐藏
      displayJoystick:true,
      //是否可交互的提示
      jiaohuTip: false,

      //房间名
      roomName: "",
      platform: "",
      selectPlayerName: "",
      playerImgPath: [],

      //角色同步数据
      user: {
        pos: [-100, -100, 0],
        rota: [0, 0, 0],
        rotateY: 1,
        animName: "idle",
        playerData: {},
        userData: {},
      },

      userName: "",
      userId: "",
      id: "",
      //姓名条
      hotPoint: [],

      pos: { x: -100, y: -100 },

      isMobile: false,

      playerDefaultX: 0,
      playerDefaultY: 0,

      language: null,
      isEn: false,
      avatarData: null,
      contrlState: 0,

      loadCompleted: false,

      windowWidth: 0,
      windowHeight: 0,

      animModelId: "",

      // 装置热点对应的点击商品热点，使用id对应
      hotPointContainHitPoint: [
        { hotPointId: "wbds", hitPointList: ["wbds_1", "wbds_2", "wbds_3"] },
        { hotPointId: "zycx", hitPointList: ["zycx_1", "zycx_2", "zycx_3"] },
        { hotPointId: "zygy", hitPointList: ["zygy_1", "zygy_2", "zygy_3"] },
        { hotPointId: "zyzbsj", hitPointList: ["zyzbsj_1", "zyzbsj_2", "zyzbsj_3"] },
        { hotPointId: "zbds", hitPointList: ["zbds_1", "zbds_2", "zbds_3"] },
        { hotPointId: "xzzj", hitPointList: ["xzzj_1", "xzzj_2", "xzzj_3"] },
      ],

      motInterface: null,

      otherLoadManager: null,

      // 是否在本地测试，本地测试时，启用弹窗。 提交git时改为false
      inLocal: true,
      // inLocal: false,

      clickHotpointDoonce: 0,


      
      projectionList: [],

    };
  },

  created() {
    this.avatarData = AvatarData;

    this.language = Language.languageCN;
    // this.language = Language.languageEN;

    this.$publicUrl += this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);

  },
  mounted() {
    this.$refs.YJmetaBase.ClickeSelectOK();


    // 进度条发送到三维页
    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    this.otherLoadManager = new YJLoadOtherModelManager_MOT(
      this.$refs.YJmetaBase.ThreejsHumanChat,
      this
    );

    this.motInterface = new MOT_three_Interface(this);

    // setTimeout(() => {
    //   let posList = ["door","zyzbsj","zycx","zygy","zbds","wbds","xzzj","dfsHUB","vote","game","collect"];
    //   for (let i = 0; i < posList.length; i++) {
    //     setTimeout(() => {
    //       // this.motInterface.ChangeViewByName("door");
    //       this.motInterface.ChangeViewByName(posList[i]);
    //     }, (i+1)*1000);
    //   }
    // }, 5000);

    // setTimeout(() => {
    //   this.motInterface.ChangeViewByName("dfshub");
    // }, 5000);

  },
  methods: {
    
    UpdateProjectionUI(_projectionList) {
      if( this.projectionList.length>= 3){return;}
      for (let i = 0; i < _projectionList.length; i++) {
        if (_projectionList[i].id.indexOf( this.animModelId) > -1) {
          let id = _projectionList[i].id.substring(11);
            this.projectionList.push({id:id,pos: _projectionList[i].pos});
          }
      }
     
      if( this.projectionList.length== 0){this.StopProjectionUI(); return;}
      if( this.projectionList.length== 3){
        this.motInterface.SendProjectionUI(this.projectionList) ; 
      }

      console.log(" 刷新 3转2 坐标位置 ", this.projectionList);
    },
    StartProjectionUI(){
      this.projectionList = [];
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetDisplayProjectionUI(true);
    },
    StopProjectionUI(){
      this.projectionList = [];
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetDisplayProjectionUI(false);
    },



    SetforcedLandscape(forcedLandscape) {
      console.log("MOT 中设置强制横屏 " + forcedLandscape);
      this.otherLoadManager.SetforcedLandscape(forcedLandscape);
    },
    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) {
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(
        id
      );
    },
    LoadingProcess(f){
      this.motInterface.SendLoadingProcess(f) ;// 3d加载进度   0-1 
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
        this.motInterface.submitGame(msg);
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
    load3dComplete() {
      this.OpenThreejs();
      setTimeout(() => {
        this.motInterface.load3dComplete();
      }, 200);


      this.$refs.YJmetaBase.ThreejsHumanChat.PlayVideo();

    },
    JoystickAxis(x, y) {
      this.$refs.YJmetaBase.ThreejsHumanChat.JoystickAxis(x, y);
    },
    JoystickAxisRight(x, y) {
      this.$refs.YJmetaBase.ThreejsHumanChat.JoystickAxisRight(x, y);
    },
    CloseDialogPanel() {
      //关闭 弹窗时，开启threejs控制

      this.StopProjectionUI();

      this.isInsertPanel = false;

      // return;
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
      if(id=="door"){return;}
      if (this.clickHotpointDoonce < 1) {
        this.motInterface.displayTip();
      }
    },
    CreateHotContent(modelData) {
      console.log(" modelData = ", modelData);
      this.clickHotpointDoonce++;
      
      this.StopProjectionUI();

      // 点击装置前的脚印，lerp 跳转到装置前
      if (modelData.type == "直接显示a点击a使用id") {
        if(modelData.id.indexOf("jump_")>-1){
          let sp = modelData.id.split('_');
          // 1，查找改id下的角色位置point数据
          let id = sp[1];
          let hotPointData =  this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetHotPointDataById(id);
          // 2，插值移动到该位置
          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerPosRotaLerp(hotPointData,()=>{

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
          this.motInterface.OpenDialog(modelData.id);
        }, 2000);
        return;
      }
      if (modelData.id.indexOf("nft") > -1) {
        this.motInterface.LoadData(modelData.id);
        return;
      }

      if (modelData.id.indexOf("door") > -1) {
        this.motInterface.LoadData(modelData.id);
        return;
      }
      // return;

      if (modelData.type == "代码控制显示a点击a使用id") {
        //视角推进完成后，点击商品热点，向父页面发送商品id

        //视角推进完成后，点击商品热点，向父页面发送商品id
        this.motInterface.LoadData(modelData.id);

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
      //   this.motInterface.OpenDialog(modelData.id);
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
        this.motInterface.LoadData(modelData.id);

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
      if(id == this.animModelId){ return;}
      
      this.animModelId = id;

      //打开 弹窗时，关闭threejs控制
      this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(false);
      this.$refs.YJmetaBase.removeThreeJSfocus();


      this.motInterface.ClickMachine(id) ;  

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
      this.motInterface.hasIn3D();


      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCamPosAndRota(
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetCamPosAndRota(
          id
        ),
        () => {

          
      // 显示指定id文字热点的 hit 和 icon 
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetAllTextHotPoint(true,id);

          this.StartProjectionUI();
          //视角推进完成后向父页面发送可以打开弹窗
          // 打开弹窗，只有返回按钮
          this.motInterface.OpenDialog(this.animModelId);

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

<style scoped>
/*竖屏*/
@media screen and (orientation: portrait) {
  .main {
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

/*手机开启横屏*/

/* @media screen and (orientation: landscape) {
	#main  {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		border: 1px solid red;
		background:deepskyblue;
		
	} 
}  */

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
</style>
