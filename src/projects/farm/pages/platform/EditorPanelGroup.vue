
<!-- 组合编辑 -->
<template>
  <div class="  absolute left-0 top-0  w-full h-full flex flex-col ">

    <!-- 顶部工具栏 -->
    <div class=" absolute z-20 left-0 top-0 w-full flex bg-445760  text-gray-200 " :style="topStyle">
      <div class=" flex ">
        <div v-for="(item, i) in tableList" :key="i"
          class="  flex w-auto h-full text-center cursor-pointer  hover:bg-546770  " @click="ChangeTable(item)">
          <div v-if="item.display" class=" w-auto px-12 flex ">
            <div  class=" self-center">
              {{ item.content }}
            </div>
            <div v-if="  (item.id == 'save_model' && !item.value) ||
              (item.id == 'save_thrumb' && !item.value)">
              *
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间3d画面 -->
    <div class=" absolute " :style="panel3dStyle">
      <YJmetaBase ref="YJmetaBase" />
      <div class="  absolute left-0 top-0 w-full h-full pointer-events-none ">
        <HUD ref="HUD" />
      </div>

      <!-- 修改名称 -->
      <div class=" absolute left-2 top-2 flex text-white ">
        <div class="   w-auto h-6 mt-1">
          组合名:
        </div>
        <input class=" bg-transparent placeholder-gray-400 p-1" type="text" v-model="modelData.name"
          :placeholder="modelData.name" @focus="removeThreeJSfocus" @blur="addThreeJSfocus" />
      </div>

      <!-- <div ref="container" class=" absolute z-auto left-0 top-0 w-1/2 h-1/2 bg-black "></div> -->
      <!-- 与后台交互的操作提示 -->
      <!---->
      <div v-if="tipData.opening" class=" absolute left-0 top-10 w-full flex  ">
        <div class=" mx-auto flex w-auto  bg-blue-400 text-white text-xl rounded-lg h-10">
          <div class=" px-4  mx-auto self-center ">
            {{ tipData.tipContent }}
          </div>
        </div>
      </div>

      <!-- 操作提示 -->
      <div class=" hidden md:flex absolute left-0 bottom-2 w-auto pointer-events-none  ">
        <div class="  flex w-auto text-white text-md rounded-lg h-auto">
          <div class=" px-4 text-left mx-auto self-center ">
            键盘操作：<br>
            G:重力开关<br>
            Esc:取消选中<br>
            F:上下车<br>
            T:扔掉武器<br>
            Ctrl+D:原地复制选中模型<br>
          </div>
        </div>
      </div>


      <div class=" hidden absolute top-0 left-0 cutimg overflow-hidden">
        <canvas id="nowcanvas" class="bg-white"> </canvas>
      </div>
      <!-- 右上角按钮 -->
      <div class=" absolute right-2 top-2 ">
        <settingPanel ref="settingPanel" />
      </div>
    </div>

    <!-- 右侧检视面板 -->
    <div class=" absolute right-0 top-0 h-full bg-546770" :style="settingPanelStyle">
      <settingPanelCtrl ref="settingPanelCtrl" />
    </div>

    <!-- 中间下部模型面板 -->
    <div :style="modelPanelStyle">
      <modelPanel title="group" ref="modelPanel" />
    </div>

    <!-- 左边场景模型面板 -->
    <div class=" absolute z-10 left-0  " :style="hierarchyStyle">
      <hierarchy ref="hierarchyPanel" title="组合模型列表" />
    </div>

    <loadingPanel :loadingUrl="loadingUrl" class="absolute z-50 left-0 top-0 w-full h-full " ref="loadingPanel" />
    <modelSelectPanel ref="modelSelectPanel" />
    <!-- 给npc添加技能 -->
    <skillSelectPanel ref="skillSelectPanel" />

    <!-- 截图区域安全区域 -->
    <PanelCut @cancel="CancelCut" ref="PanelCut" />

  </div>
</template>

<script>

import YJmetaBase from "./YJmetaBase.vue";

import PanelCut from "./PanelCut.vue";

import modelPanel from "./panels/modelPanel.vue";

import modelSelectPanel from "./panels/modelSelectPanel.vue";
import skillSelectPanel from "./panels/skillSelectPanel.vue";

import settingPanelCtrl from "./settingPanel/settingPanelCtrl.vue";

import HUD from "./common/HUD.vue";

import hierarchy from "./Hierarchy.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";

import { SceneManager } from "../../js/SceneManagerEditor.js";


import { Interface } from "../../js/Interface_editor.js";
import { YJuserData } from "../../js/YJuserData.js";

import {
  GetAllGroup, UploadGroupFile
} from "../../js/uploadThreejs.js";

export default {
  name: "EditorPanel",
  components: {
    loadingPanel, YJmetaBase,
    modelPanel,
    modelSelectPanel,
    skillSelectPanel,
    PanelCut,
    hierarchy,
    settingPanelCtrl,
    HUD,
  },
  data() {
    return {
      panelData: {
        topStyle: {
          height: 0,
        },
        settingPanelStyle: {
          width: 0,
        },
        modelPanelStyle: {
          left: 0,
          top: 0,
          width: 500,
          height: 500,
        },
        hierarchyStyle: {
          left: 0,
          top: 0,
          width: 500,
          height: 500,
        },
        panel3dStyle: {
          left: 0,
          top: 0,
          width: 500,
          height: 500,
        },
      },
      panel3dStyle: "",
      hierarchyStyle: "",
      modelPanelStyle: "",
      settingPanelStyle: "",
      topStyle: "",

      panelState: {
        // setting: false,
        setting: true,
        model: true,
        uvAnim: false,
        screen: false,
        particle: false,
        npc: false,
        interactive: false,
        weapon: false,
      },
      hover: false,
      infloating: false,

      _SceneManager: null,
      _YJuserData: null,
      tableList: [
        { id: "import", content: "导入", display: false },
        { id: 'save_thrumb', content: "截图（制作缩略图）", display: true, value: true },
        { id: "save_setting", content: "保存场景配置", display: false, },
        { id: 'save_model', content: "保存组合", display: true, value: true },
        { id: "single_collider", content: "显示碰撞体", display: false, value: false },
        { id: "single_planeState", content: "隐藏地面", display: false, value: true },
        { id: "save_view", content: "设置为访问视角", display: false, value: false },
        { id: "load_view", content: "还原到访问视角", display: false, value: false },
        { id: "release", content: "发布", display: false, },
      ],
      viewFar: 5,

      // npc音效
      npcMusicUrl: '',

      inMeeting: false,
      meetingOwner: '',
      oldSceneName: "",


      inLoadCompleted: false,
      //房间名
      roomName: "",
      platform: "",
      selectPlayerName: "",
      playerImgPath: [],


      userName: "",
      id: "",

      pos: { x: -100, y: -100 },

      isMobile: false,

      language: null,
      isEn: false,
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,
      inThreejs: false,

      viewFarIndex: 2,
      // viewFar: [0, -8, -16],

      displayMinMap: true,

      niaokanUI: false,
      projectionList: [
        { id: '10001', content: '岛2', pos: { x: -500, y: -500 } },
        { id: '10002', content: '岛3', pos: { x: -500, y: -500 } },
        { id: '10003', content: '岛4', pos: { x: -500, y: -500 } },
        { id: '10004', content: '岛5', pos: { x: -500, y: -500 } },
        { id: '10005', content: '岛1', pos: { x: -500, y: -500 } },
      ],
 

      publicUrl: "",

      userData: {},
      initCompleted: false,

      avatarId: "",
      modelData: {},

      InDriving: false,
      inputing: false,
      Interface: null,
      modelList: [],
      folderBase: "wenjjjwe",
      loadingUrl: "",
      sceneData: {
        // 房间名，用房间名来区分多个项目的同步
        roomName: "3dfarm",
        platform: "pcweb",
        hasEditored: false,

        // 场景txt路径
        // sceneTexPath: "models/Scene/scene.txt",

        // modelPath: 'models/Scene/',
        // 场景txt路径
        // sceneTexPath: "scene.txt",
        // npcTexPath: "npc.json",
        // 界面设置
        setting: {

          // 是否始终强制横屏
          onlyLandscape: true,

          // 是否应用辉光效果
          useBloom: false,
          // useBloom:true,
          // 资源路径，资源的文件夹包裹。由此来区分不同的项目内容
          localPath: "farm/",
          // 自定义鼠标光标
          cursorUrl: "",
          title: "多人线上农场",

          // 是否显示 "切换操作模式" 按钮
          hasChangeCtrlState: true,

          // 是否显示 "3d音乐" 按钮
          hasBGM: false,
          BGMurl: "musicverse/bg.mp3",

          //舍弃。该值由 cameraOffset 在YJController.中计算得出 键鼠控制时, 摄像机到角色的距离
          camZ: -8,
          // 镜头拉远最大距离
          camWheelMax: -300,

          // 右上角中英文切换按钮
          righttopBtn: false,

          // 键盘C键切换操作模式
          keyC: false,
          // 键盘Q键 第一人称视角和第三人称视角切换
          keyQ: false,
          // 键盘M键 打开小地图
          keyM: false,
          // 是否启用鼠标滚轮推进拉远摄像机
          canMouseWheel: true,
          // 键盘G键 是否允许开关重力.
          canEnableGravity: true,

          // 是否开启滑动阻尼 
          canDampingRota: false,


          // 是否有天空球
          hasEnvmap: false,
          // 天空球全景图路径
          envmapPath: "020.hdr",

          hasSceneHDR: false,
          envSceneHDRPath: "020.hdr",



          // 是否启用摄像机遮挡时拉近摄像机功能
          // hasCamRaycast: false,
          hasCamRaycast: true,
          camRaycastMode: "near",  // near 视角拉近 ; transparent 透明遮挡物。
          // camRaycastMode: "transparent",  // near 视角拉近 ; transparent 透明遮挡物。

          // 是否启用3d做法的小地图
          hasMinMap: false,
          // 是否启用2d做法的小地图
          has2dMinMap: false,
          // 是否在小地图编辑状态
          inMinMapEditor: false,

          // 是否鸟瞰开场
          hasAerialView: false,

          //是否开始时锁定到鸟瞰位置
          isLockStartAerial: false,

          // 是否第一人称视角
          // firstPerson :true,

          // 是否有角色
          hasAvatar: true,

          // 操作方式。 0 键鼠控制/遥感控制，1 鼠标点击地面 
          contrlState: 0,
          //舍弃/>-1控制隐藏角色。该值由 cameraOffset 在YJController.中计算得出 键鼠控制时，摄像机距离
          wheelValue: -8,
          // 摄像机在角色后方的偏移位置。该值决定在后方的高度和角度
          cameraOffset: { x: 0, y: 1.5, z: -4 },
          // cameraOffset: { x: 0, y: 5, z: -7 },
          // cameraOffset: { x: 0, y: 10, z: -14 },

          // 配置渲染模式/渲染效果
          render: {
            outputEncoding: "sRGBEncoding",
          },

          speedData: {
            // 刚体初始移动速度
            moveSpeed: 5,
            // 行走速度
            walkSpeed: 5,
            // 按住左shift加速，奔跑速度
            runSpeed: 8,
            // 刚体移动最大速度
            minSpeed: 1.5,
            // 刚体移动最小速度
            maxSpeed: 5,
            // 重力关闭后，允许飞行，上升速度
            upSpeed: 4,
            // 重力关闭后，允许飞行，飞行速度
            flySpeed: 10,
          },

          // 摄像机上下旋转的限制弧度. x顶部角度，y底部角度
          // targetRota: { x: -1.25, y: -0.03 },
          targetRota: { x: -1.56, y: 1.3 },


          playerPos: { x: 0, y: 20, z: 0 },
          playerRotaV3: { x: 0, y: 0, z: 0 },
          // 玩家刚体高度
          playerHeight: 1.7,
          // 摄像机目标父物体，在刚体中心位置的Y轴偏移量。该值决定摄像机高度
          camOffsetY: 0.0,
          // 摄像机视野
          cameraFov: 60,

          //是否有寻路网格
          hasPathfinding: false,

          // 玩家刚体半径
          playerRadius: 0.2,
        },

        // 热点数据
        hotPointData: {
          // YJTriggerArea脚本中旋转物体的旋转速度
          triggerAreaRotaSpeed: 0.01,
        },

        // 是否有地面碰撞
        hasFloor: true,
        // 地面尺寸
        floorSize: { x: 10, y: 10 },
        // 所在开放世界坐标
        metaWorldCoordinate: [],

        // 小地图数据
        minMapData: {
          // 小地图图片路径
          minMapUrl: "minMap.png",
          minMapPointUrl: "minMapPoint.png",
          viewAreaUrl: "viewArea.png",

          minMapOffset: { x: 160, y: 100 },
          minMapScale: { x: 2.56, y: 2.08 },
          // 小地图在界面中的位置
          minMapPlanePos: { x: -0, y: -0.45, z: -1 },
          minMapPlaneMobilePos: { x: 0, y: -0.43, z: -1 },
        },

        // 环境光和方向光参数
        AmbientLightData: {
          //环境光 纯白颜色、强度
          AmbientLightIntensity: 1,

          // 方向光坐标和强度
          hasDirectionalLight: true,
          // DirectionalLightPos: { x: 255, y: 30, z: -115 },
          DirectionalLightPos: { x: 0, y: 30, z: 0 },
          DirectionalLightIntensity: 1,


          backgroundColor: '#A7D0FF',

        },

      },
      sceneLoadUrl: "",
      oldFileName: "",
      sceneModelListDataPath: "",
      clickModelJS: null,
      inCreate: true,

      tipData: {
        opening: false,
        current: 1,
        count: 10,
        tipContent: "sdfsdf",
      }
    };
  },
  created() {

    this.sceneLoadUrl = this.$uploadGroupUrl;
  },
  mounted() {

    if (_Global.reloadTimes == 1) {
      window.location.reload();
      _Global.reloadTimes = 0;
    }
    this.Interface = new Interface(this, true);
    this._YJuserData = new YJuserData(this);

    if (this.$route.path.toLowerCase().includes("editorscene")) {
      localStorage.setItem("modelType", "场景");
    }

    if (this.$route.params.folderBase != undefined) {
      this.folderBase = this.$route.params.folderBase;
    } else if (this.$route.query.folderBase != undefined) {
      this.folderBase = this.$route.query.folderBase;
    } else {
      let modelData = JSON.parse(localStorage.getItem("modelData"));
      this.modelData = modelData;
      this.oldFileName = this.modelData.name;
      this.folderBase = modelData.folderBase;
    }

    // this.loadingName = "loading.jpg";
    // this.loadingUrl = this.$uploadSceneUrl + this.folderBase + "/" + this.loadingName + '?time=' + new Date().getTime();
    // console.log(" this.folderBase ", this.folderBase, this.loadingUrl);

    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);
    this.$refs.PanelCut.Init(_Global.YJ3D);

    this.$refs.settingPanelCtrl.ChangePanel('');

    // 没有icon表示为新建的场景
    // if (this.modelData.icon) {
    //   this.inCreate = false;
    //   this.RequestGetAllSceneData();
    //   return;
    // } else {
    //   this.updateSceneTxtData(() => {
    //     this.updateSceneData(() => {
    //       this.updateSceneModelDataNone();
    //     });
    //   });
    //   this.Enter();
    // }



    if (this.modelData.modelType == undefined) {
      this.RequestGetAllScene(() => {
        // console.log(" this.modelData  = ", this.modelData);
        // console.log(" this.modelData.icon  = ", this.modelData.icon);
        if (this.modelData.icon == undefined) {
          // console.log(" 新建场景  ==== ");

          this.updateSceneTxtData(() => {
            this.updateSceneData(() => {
              this.updateSceneModelDataNone();
            });
          });
          this.Enter();

        } else {
          this.inCreate = false;
          this.RequestGetAllSceneData();
        }

      });
    }

    this.setPanelSize();
    this.$refs.hierarchyPanel.init();

  },
  methods: {
    setMaxMin(isMax) {
      if (isMax) {

        this.panelData.settingPanelStyle.width = 0;
        this.panelData.topStyle.height = 0;
        this.panelData.topStyle.display = "none";

        this.panelData.hierarchyStyle.left = 0;
        this.panelData.hierarchyStyle.top = 0;
        this.panelData.hierarchyStyle.width = 0;
        this.panelData.hierarchyStyle.height = 0;

        this.panelData.modelPanelStyle.left = 0;
        this.panelData.modelPanelStyle.bottom = 0;
        this.panelData.modelPanelStyle.width = 0;
        this.panelData.modelPanelStyle.height = 0;
        this.panelData.modelPanelStyle.display = "none";

        this.panelData.panel3dStyle.left = 0;
        this.panelData.panel3dStyle.top = 0;
        this.panelData.panel3dStyle.width = window.innerWidth;
        this.panelData.panel3dStyle.height = window.innerHeight;
        // console.log("界面全部尺寸 ", this.panelData);

        if (_Global.YJ3D && _Global.YJ3D.YJRaycaster) {
          _Global.YJ3D.YJRaycaster.SetOffset(0, 0);
        }

        this.resizePanel();
        return;
      }
      this.setPanelSize();
    },
    // 计算各个panel的宽高
    setPanelSize() {
      this.panelData.settingPanelStyle.width = 280;

      this.panelData.topStyle.height = 40;
      this.panelData.topStyle.display = "";

      this.panelData.hierarchyStyle.left = 0;
      this.panelData.hierarchyStyle.top = this.panelData.topStyle.height;
      this.panelData.hierarchyStyle.width = 240;
      this.panelData.hierarchyStyle.height = window.innerHeight - this.panelData.topStyle.height;

      this.panelData.modelPanelStyle.left = this.panelData.hierarchyStyle.width;
      this.panelData.modelPanelStyle.bottom = 0;
      this.panelData.modelPanelStyle.width = window.innerWidth - this.panelData.settingPanelStyle.width - this.panelData.hierarchyStyle.width;
      this.panelData.modelPanelStyle.height = 200;
      this.panelData.modelPanelStyle.display = "";

      this.panelData.panel3dStyle.left = this.panelData.hierarchyStyle.width;
      this.panelData.panel3dStyle.top = this.panelData.topStyle.height;
      this.panelData.panel3dStyle.width = window.innerWidth - this.panelData.settingPanelStyle.width - this.panelData.hierarchyStyle.width;
      this.panelData.panel3dStyle.height = window.innerHeight - this.panelData.topStyle.height - this.panelData.modelPanelStyle.height;
      // console.log("界面全部尺寸 ", this.panelData);

      if (_Global.YJ3D && _Global.YJ3D.YJRaycaster) {
        _Global.YJ3D.YJRaycaster.SetOffset(this.panelData.hierarchyStyle.width, this.panelData.topStyle.height);
      }
      if (this.$refs.settingPanelCtrl.$refs.settingPanel) {
        this.$refs.settingPanelCtrl.$refs.settingPanel.fullScreen = false;
      }

      this.resizePanel();
    },
    resizePanel() {
      this.panel3dStyle = `
      position: absolute; 
      left: ${this.panelData.panel3dStyle.left}px;
      top: ${this.panelData.panel3dStyle.top}px;
      width: ${this.panelData.panel3dStyle.width}px;
      height: ${this.panelData.panel3dStyle.height}px;`;

      this.hierarchyStyle = `
      position: absolute; 
      left: ${this.panelData.hierarchyStyle.left}px;
      top: ${this.panelData.hierarchyStyle.top}px;
      width: ${this.panelData.hierarchyStyle.width}px;
      height: ${this.panelData.hierarchyStyle.height}px;`;

      this.modelPanelStyle = `
      position: absolute; 
      display: ${this.panelData.modelPanelStyle.display}; 
      left: ${this.panelData.modelPanelStyle.left}px;
      bottom: ${this.panelData.modelPanelStyle.bottom}px;
      width: ${this.panelData.modelPanelStyle.width}px;
      height: ${this.panelData.modelPanelStyle.height}px;`;

      this.settingPanelStyle = ` 
      width: ${this.panelData.settingPanelStyle.width}px; 
      `;

      this.topStyle = ` 
      display: ${this.panelData.topStyle.display}; 
      height: ${this.panelData.topStyle.height}px; 
      `;

    },

    GetPlayerAnimData() {
      return this._YJuserData.GetPlayerAnimData();
    },

    addMetaWorldCoordinate(item) {
      if (this.sceneData.metaWorldCoordinate == undefined) {
        this.sceneData.metaWorldCoordinate = [];
      }
      // this.sceneData.metaWorldCoordinate.push(item);
      this.updateSceneData();
    },
    removeMetaWorldCoordinate(i) {
      this.sceneData.metaWorldCoordinate.splice(i, 1);
      this.updateSceneData();
    },

    async RequestGetAllScene(callback) {
      GetAllGroup().then((res) => {
        // console.log("获取所有场景数据，查找当前场景数据  ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const item = txtDataList[i];
            // let item = JSON.parse(element);
            if (item.folderBase == this.folderBase) {
              localStorage.setItem("modelData", JSON.stringify(item));
              this.modelData = item;
              this.oldFileName = this.modelData.name;
              if (callback) {
                callback();
              }
              return;
            }
          }
          if (callback) {
            callback();
          }
        }
      });
    },

    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      this.inputing = true;
      _Global.YJ3D.removeEventListener();
    },
    addThreeJSfocus() {
      if (this.inputing) {
        //
        if (this.oldFileName != this.modelData.name) {
          this.updateSceneTxtData();
          this.oldFileName = this.modelData.name;
        }
      }
      _Global.YJ3D.threeJSfocus();
      this.inputing = false;

    },
    Enter() {
      this.inLoadCompleted = true;

      this._YJuserData.Enter(this.folderBase);
      // 用户首次进入先使用默认角色
      // let avatarId = PlayerAnimData.defaultUser.avatarId;

      // // 用户第二次进入，使用用户选择的角色
      // if (localStorage.getItem("avatarId")) {
      //   avatarId = localStorage.getItem("avatarId");
      // }
      // // 如果场景限制角色，则使用场景限制角色
      // if (this.sceneData.avatarList && this.sceneData.avatarList.length > 0) {
      //   avatarId = this.sceneData.avatarList[this.Utils.RandomInt(0, this.sceneData.avatarList.length - 1)].folderBase;
      // }

      // this.userName = "aa";
      // if (localStorage.getItem("userName")) {
      //   this.userName = localStorage.getItem("userName");
      // }

      // this.avatarId = avatarId;
      // this.sceneData.roomName = this.folderBase;

      // this.userData = {
      //   userName: this.userName,
      //   roomName: this.sceneData.roomName,
      //   platform: this.sceneData.platform,
      //   avatarId: avatarId,
      // };

      // this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData);
      // _Global.YJ3D.SetNickName(this.userName);


      //场景设置
      this._SceneManager = new SceneManager(
        _Global.YJ3D.scene,
        _Global.YJ3D.renderer,
        _Global.YJ3D.camera,
        _Global.YJ3D,
        _Global.YJ3D._YJSceneManager.GetmodelParent(),
        this,
        () => {
          // if (callback) {
          //   callback();
          // }

        }
      );
      this.$refs.modelPanel.Init();

    },

    async RequestGetAllSceneData() {
      let res = await this.$axios.get(
        this.sceneLoadUrl + this.folderBase + "/" + "setting.txt" + "?time=" + new Date().getTime()
      );
      console.log(" 获取场景配置 ", res.data);
      this.sceneData = res.data;
      // this.sceneData.setting.hasCamRaycast = false;
      // this.sceneData.setting.camOffsetY = this.sceneData.setting.playerHeight / 2;

      this._YJuserData.SetSceneData(this.sceneData);
      this.Enter();
    },
    async RequestGetAllSceneModelData() {
      // console.log(" 获取场景 模型   000 ",this.inCreate);

      if (this.inCreate) {
        setTimeout(() => {
          this.updateSceneModelData();
        }, 100);
        return;
      }

      // let path = this.sceneLoadUrl + this.folderBase + "/" + this.folderBase + "_scene.txt";
      // console.log(" 获取场景 模型文本路径 ", path);
      let res = await this.$axios.get(
        this.sceneLoadUrl + this.folderBase + "/" + "scene.txt" + "?time=" + new Date().getTime()
      );

      this.modelList.splice(0, this.modelList.length);

      let data = res.data;
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        this.modelList.push(element);
      }
      console.log(" 获取场景 模型 ", data, data.length, this.modelList, this.modelList.length);


      _Global.YJ3D._YJSceneManager.CreateSenceBy(this.modelList);

      // setTimeout(() => {
      //   this.modelList = [];
      // this.modelList = _Global.YJ3D._YJSceneManager
      //   .Create_LoadUserModelManager()
      //   .GetModelList();

      // }, 5000);
    },

    // 保存场景简要信息。新建时调用
    updateSceneTxtData(callback) {
      // console.log(this.modelData);

      this.modelData.icon = this.folderBase + "/" + "thumb.jpg";

      let s = JSON.stringify(this.modelData);
      let fromData = new FormData();
      //服务器中的本地地址 
      fromData.append("fileToUpload", this.$stringtoBlob(s, "data.txt"));
      fromData.append("folderBase", this.folderBase);
      UploadGroupFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传模型数据文件成功 ");

          if (callback) {
            callback();
          }
        }
      });

    },

    // 保存场景配置数据。新建时调用、配置改变时主动调用
    updateSceneData(callback) {
      this.sceneData.hasEditored = true;
      if (callback) {
        callback();
      }
      return;
    },

    /**
     *
     * 
     */

    editorModelList(type, item) {

      this.tableList[2].value = false;
      if (type == "增加") {
        this.modelList.push(item);
      }
      if (type == "删除") {
        console.log("删除 ", item);
        let uuid = item.uuid;
        for (let i = 0; i < this.modelList.length; i++) {
          const element = this.modelList[i];
          if (element.uuid == uuid) {
            this.modelList.splice(i, 1);
          }
        }
        console.log(this.modelList);
        // this.modelList.remove(item);
      }
    },

    // 保存场景模型列表数据，同时更新模型massage数据
    updateSceneModelData() {
      this.modelList = [];
      this.modelList = _Global.YJ3D._YJSceneManager
        .Create_LoadUserModelManager()
        .GetModelList();
      console.log("this.modelList 1111 ", this.modelList);
      // return;
      let s = JSON.stringify(this.modelList);
      let fromData = new FormData();
      //服务器中的本地地址 
      fromData.append("fileToUpload", this.$stringtoBlob(s, "scene.txt"));
      fromData.append("folderBase", this.folderBase);
      UploadGroupFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 场景模型清单数据 成功 ");
          this.SetTip("保存场景模型成功");
        }
      });
    },
    updateSceneModelDataNone() {
      this.modelList = [];
      let s = JSON.stringify(this.modelList);
      let fromData = new FormData();
      //服务器中的本地地址 
      fromData.append("fileToUpload", this.$stringtoBlob(s, "scene.txt"));
      fromData.append("folderBase", this.folderBase);
      UploadGroupFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
        }
      });

      _Global.YJ3D._YJSceneManager.LoadDone();

    },


    // 保存模型缩略图，并上传
    updateModelIconPic(dataurl) {
      // _Global.YJ3D.scene.background = null;

      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append(
        "fileToUpload",
        this.$dataURLtoBlob(dataurl, "thumb.jpg")
      );
      fromData.append("folderBase", this.folderBase);
      UploadGroupFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传模型缩略图 ");

          this.SetTip("缩略图制作成功！");
        }
      });

    },

    SetTip(tipContent) {
      this.tipData.opening = true;
      this.tipData.tipContent = tipContent;
      setTimeout(() => {
        this.tipData.opening = false;
      }, 2000);
    },
    CancelCut() {

      _Global.SendMsgTo3D("单品", "显示角色");
      // _Global.ChangeFirstThird(false);
      _Global.SetEnableGravity(true);
      _Global.SetDisplayFloor(true);
    },
    ChangeTable(item) {

      if (item.content.includes("截图")) {

        this.$refs.PanelCut.safeOrder = true;
        _Global.SetEnableGravity(false);
        _Global.SetDisplayFloor(false);
        _Global.SendMsgTo3D("单品", "隐藏角色");
        // _Global.ChangeFirstThird(true); 
        return;
      } 
      if (item.content.includes("保存组合")) {
        item.value = true;
        this.updateSceneModelData();
        return;
      }  
    },


    SelectModel(item) {
      _Global.YJ3D._YJSceneManager.SelectModel(item.uuid);
    },

    viewFarFn(e) {
      _Global.YJ3D.YJController.SetCameraWheelPos(-this.viewFar);
      // 取消焦点
      this.$refs.viewFarCtrl.blur();

    },
    changeViewSliderValue(e) {
      this.viewFar = -e;
    },

    UpdateSkin(_YJPlayer, playerName, playerState) {
      _YJPlayer.ChangeSkinCompleted();
      return;
    },

    SetNpcMusicUrl(npcName) {
    },
    ChangePanel(e) {
      this.$refs.settingPanelCtrl.ChangePanel(e);
    },


    ChangeAvatar(playerName, callback) {

    },
    GetUseId() {
      return this.$refs.YJDync.GetUseId();
    },
    //由角色选择界面传入 角色类型、用户名
    ClickSelectPlayerOK(selectPlayerName, userName) {

      this.inLoadCompleted = true;

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.DisplayLoading();
      }

      this._YJuserData.ClickSelectPlayerOK(selectPlayerName, userName);
      // this.userName = userName;
      // localStorage.setItem("username", this.userName);
      // this.avatarName = selectPlayerName;

      // this.userData = {
      //   userName: userName,
      //   roomName: this.sceneData.roomName,
      //   platform: this.sceneData.platform,
      //   modelType: selectPlayerName,
      // }; 
      // this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData); 
      // _Global.YJ3D.SetNickName(userName);

      console.log("场景加载完成------------");

      var that = this;

      window.onfocus = function () {
        // console.log("激活焦点");
      };
      window.onblur = function () {
        // console.log("失去焦点");
        that.$refs.YJmetaBase.ThreejsHumanChat.YJController.onblur();
      };
    },


    SetTriggerOverlap(b, id, owner) {
      if (this._SceneManager) {
        this._SceneManager.SetTriggerOverlap(b, id, owner);
      }
      this.Interface.SetTriggerOverlap(b, id, name);
    },

    LoadingProcess(f) {
      // 3d加载进度   0-1 
      // console.log(" 加载场景进度 " ,f);

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.LoadingProcess(f);
      }
    },

    load3dComplete(callback) {
      console.log("场景加载完成------------");


      if (!this.initCompleted) {


        _Global.YJ3D.PlayVideo();
        _Global.YJ3D.AddVideoListener();


        this.$nextTick(() => {
          this.Interface.SelectPlayerCompleted(this.avatarName, this.userName);

        });

        this._SceneManager.ChangeScene(this.sceneData);


        this.$nextTick(() => {
          if (this.$refs.YJDync) {
            if (!this.sceneData.modelPath.includes("Scene3")) {
              this.$refs.YJDync.InitDync(this.userData);
            } else {
              //在开车场景，关闭同步。因为开车非常费流量。2个人1小时30块
              _Global.mainUser = true;
            }
          } else {
            _Global.mainUser = true;
          }
        });

      } else {

        if (this.$refs.YJDync) {
          this.$refs.YJDync.ChangeRoom(this.sceneData.roomName);
        }
      }

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.load3dComplete();
      }
      this.initCompleted = true;

      this.Interface.load3dComplete();

      this.$refs.YJmetaBase.OpenThreejs();
      setTimeout(() => {
        this.OpenThreejs();
      }, 1000);
    },
    OpenThreejs() {
      this.inThreejs = true;
      if (this.$refs.loadingPanel) {
        this.$refs.loadingPanel.DisplayLoading(false);
      }

      // setTimeout(() => {
      //   this.ChangeViewById(10004);
      // }, 2000);
    },
    // 3转2坐标
    UpdateProjectionUI(_projectionList) {
      // this.projectionList=[];
      // this.projectionList = _projectionList;
      for (let i = 0; i < _projectionList.length; i++) {
        for (let ii = 0; ii < this.projectionList.length; ii++) {
          if (_projectionList[i].id == this.projectionList[ii].id) {
            this.projectionList[ii].pos = _projectionList[i].pos;
          }
          // if(_projectionList[i].id == this.projectionList[i].id){
          //   this.projectionList[i].pos = _projectionList[i].pos;
          // }
        }
      }
      // console.log(" 3转2 ",_projectionList);
    },

    SetViewState(e) {
      this.displayMinMap = e == "人视";
      this.niaokanUI = e == "鸟瞰";

      if (e == "人视") {
        for (let ii = 0; ii < this.projectionList.length; ii++) {
          this.projectionList[ii].pos.x = -500;
          this.projectionList[ii].pos.y = -500;
        }
      }
    },



    // 点击角色NPC，显示NPC下方的光圈
    ClickPlayer(owner) {
      if (this._SceneManager) {
        this._SceneManager.ClickPlayer(owner);
      }
      // console.log(owner);
      //点击npc,显示与npc的聊天框
      if (this.$refs.chatPanel && owner.GetName() == "ChatGPT001号") {
        this.$refs.chatPanel.SetDisplay(true);
      }
      if (this.$refs.chatPanelNPC && (owner.GetName() == "咕叽" || owner.GetName() == "坐")) {
        this.$refs.chatPanelNPC.SetYJNPC(owner, this.userName);
        this.$refs.chatPanelNPC.SetDisplay(true);
      }
    },

    RightClick(hitObject, hitPoint) {
      this._SceneManager.RightClick(hitObject, hitPoint);
    },
    ClickModel(hitObject) {
      if (hitObject == null || hitObject.name == "floor") {
        this.ClickFloor();
        return;
      }
      if (this._SceneManager) {
        this._SceneManager.ClickModel(hitObject);
      }

      console.log(" 点击模型 ", hitObject);
      // if (this.$refs.modelPanel) {
      //   this.$refs.modelPanel.SetModel(hitObject.owner);
      // }
      if (hitObject.transform != undefined) {

        console.log(" 点击模型 transform ", hitObject.transform);

        // 激活上一个选中模型的碰撞
        if (this.clickModelJS != null) {
          _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().EditorEnd(this.clickModelJS);
          _Global.YJ3D._YJSceneManager._YJTransformManager.detach();
          this.clickModelJS = null;
        }
        this.SetSelectTransform(hitObject.transform);
      }
    },
    CreateNewTransfrom(transform) {
      this.ClickFloor();
      //添加到模型列表
      this.editorModelList("增加", transform.GetData());
      this.SetSelectTransform(transform);
    },
    SetSelectTransformByUUID(uuid) {
      this.ClickFloor();
      this.SetSelectTransform(_Global.YJ3D._YJSceneManager.GetLoadUserModelManager().GetTransformByUUID(uuid));
    },
    SetSelectTransform(transform) {
      this.clickModelJS = transform;
      _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().EditorStart(this.clickModelJS);
      _Global.YJ3D._YJSceneManager._YJTransformManager.attach(transform.GetGroup());
      this.UpdateComponentPanel();

    },
    UpdateComponentPanel() {
      _Global.YJ3D._YJSceneManager.SetSelectTransform(this.clickModelJS);
      this._SceneManager.SetTargetModel(null);

      let component = this.clickModelJS.GetComponent("UVAnim");
      if (component != null) {
        this.ChangePanel('uvAnim');
        this.$nextTick(() => {
          this.$refs.settingPanelCtrl.$refs.settingPanel_uvAnim.Init(component.GetData());
        });
        console.log(component);
        return;
      }
      component = this.clickModelJS.GetComponent("Screen");
      if (component != null) {
        this.ChangePanel('screen');
        let msg = this.clickModelJS.GetMessage();
        this.$nextTick(() => {
          this.$refs.settingPanelCtrl.$refs.settingPanel_screen.Init(msg.data);
        });
        console.log(component);
        return;
      }

      component = this.clickModelJS.GetComponent("Particle");
      if (component != null) {
        this.ChangePanel('particle');
        let msg = this.clickModelJS.GetMessage();
        this.$nextTick(() => {
          this.$refs.settingPanelCtrl.$refs.settingPanel_particle.Init(msg.data);
        });
        console.log(component);
        return;
      }
      component = this.clickModelJS.GetComponent("NPC");
      if (component != null) {
        this.ChangePanel('npc');
        let msg = this.clickModelJS.GetMessage();
        this.$nextTick(() => {
          this.$refs.settingPanelCtrl.$refs.settingPanel_npc.Init(msg.data);
        });
        console.log(component);
        // 
        this._SceneManager.SetTargetModel(this.clickModelJS);
        return;
      }
      component = this.clickModelJS.GetComponent("Weapon");
      if (component != null) {
        this.ChangePanel('weapon');
        let msg = this.clickModelJS.GetMessage();
        this.$nextTick(() => {
          this.$refs.settingPanelCtrl.$refs.settingPanel_weapon.Init(msg.data);
        });
        // console.log(component);
        console.log("武器请到武器单品中设置");
        return;
      }
      component = this.clickModelJS.GetComponent("Interactive");
      if (component != null) {
        this.ChangePanel('interactive');
        let msg = this.clickModelJS.GetMessage();
        this.$nextTick(() => {
          this.$refs.settingPanelCtrl.$refs.settingPanel_interactive.Init(msg.data);
        });
        console.log(component);
        return;
      }
      component = this.clickModelJS.GetComponent("Trail");
      if (component != null) {
        this.ChangePanel('trail');
        let msg = this.clickModelJS.GetMessage();
        this.$nextTick(() => {
          this.$refs.settingPanelCtrl.$refs.settingPanel_trail.Init(msg.data);
        });
        console.log(component);
        return;
      }
    },

    DelModel() {
      // 激活上一个选中模型的碰撞
      if (this.clickModelJS != null) {
        this.editorModelList("删除", this.clickModelJS.GetData());

        _Global.YJ3D._YJSceneManager._YJTransformManager.detach();
        _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().DelUserModel(this.clickModelJS);
        this.clickModelJS = null;
        this.ChangePanel('');

      }
    },
    DuplicateModel() {
      if (this.clickModelJS != null) {
        _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().DuplicateModel(this.clickModelJS.GetData(), (transform) => {
          _Global.YJ3D._YJSceneManager._YJTransformManager.attach(transform.GetGroup());
          this.clickModelJS = transform;

          this.$refs.hierarchyPanel.SelectModelBy3d(this.clickModelJS.GetUUID());
          this.tableList[2].value = false;

          // this.modelList = [];
          // this.modelList = _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().GetModelList();
        });
      }
    },
    ClickFloor() {

      if (this.clickModelJS != null) {
        _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().EditorEnd(this.clickModelJS);
        _Global.YJ3D._YJSceneManager._YJTransformManager.detach();
        this.clickModelJS = null;
        this.ChangePanel("");
      }
    },
    HoverObject(hoverObject, hoverPoint) {
      if (this._SceneManager) {
        this._SceneManager.HoverObject(hoverObject, hoverPoint);
      }
    },

    CreateHotContent(modelData, owner) {
      console.log("点击热点 ", modelData, owner);
      this.Interface.LoadData(modelData.id);
      if (this._SceneManager) {
        this._SceneManager.CreateHotContent(modelData, owner);
      }
    },

    ClickHotPointOwner(hitObject) {

      let hotPointData = hitObject.owner.GetHotPointData();
      // console.log(" hotpointdata  ", hotPointData);
      if (hotPointData.type) {
        if (hotPointData.type == "设置角色位置") {

          _Global.YJ3D._YJSceneManager.SetPlayerPosRota(
            hotPointData.pos,
            hotPointData.rotaV3
          );

          //视角拉近
          _Global.YJ3D.YJController.ChangeToPersonView();

          _Global.YJ3D.YJController.ChangeCameraToFar();
          this.viewFarIndex = 2;
        }
      }

    },

    ClickInstancedMesh(InstancedMeshOwner, index) {
      // console.log(InstancedMeshOwner);return;
      if (InstancedMeshOwner.GetComponent("Particle") != null) {
        this.SetSelectTransform(InstancedMeshOwner);
        return;
      }
      InstancedMeshOwner.Click(index);

      _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().LoadStaticModel(
        InstancedMeshOwner.GetModelData(), (transform) => {
          this.clickModelJS = transform;
        }
      );
    },

    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) {
      _Global.YJ3D._YJSceneManager.ChangeViewById(id);
    },

    ChangeViewFar() {
      this.viewFarIndex++;
      if (this.viewFarIndex >= this.viewFar.length) {
        this.viewFarIndex = 0;
      }
      let far = this.viewFar[this.viewFarIndex];
      // _Global.YJ3D.YJController.ChangeCameraFar();
      _Global.YJ3D.YJController.SetCameraWheelPos(far);
    },

    GetPublicUrl() {
      return this.publicUrl;
    },
    GetSceneTexPath() {
      return this.GetModelUrl() + this.sceneData.sceneTexPath;
    },
    GetModelUrl() {
      return this.sceneData.modelPath;
    },
    GetPublicModelUrl() {
      return this.GetPublicUrl() + this.sceneData.modelPath;
    },


    //获取小地图图片url
    GetMinMapData() {
      let minMapData = this.sceneData.minMapData;
      return minMapData;
    },
    ClickNiaokan() {
      _Global.YJ3D.YJController.ResetToNiaokanView();
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