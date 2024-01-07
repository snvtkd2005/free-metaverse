
<!-- // 场景编辑UI -->
<template>
  <div class="absolute left-0 top-0 z-999 w-full h-full flex flex-col">
    <button ref="opacityBtn" class="opacity-0"></button>
    <!-- 顶部 -->
    <div class="
        absolute
        z-20
        left-0
        top-0
        h-10
        w-full
        flex
        bg-445760
        text-gray-200
      ">
      <!-- 顶部工具栏 -->
      <!-- table -->
      <div class="flex">
        <el-upload v-if="hasImport" class="bg-transparent" action="" multiple :before-upload="handleBeforeUpload"
          :accept="accept" :show-file-list="false">
          <!-- :before-upload="changeFile" -->
          <div class="p-2 w-20 cursor-pointer hover:bg-546770">导入</div>
        </el-upload>

        <div class="hidden relative w-40 cursor-pointer">
          <label class="absolute left-0 cursor-pointer mt-2 ml-2">导入文件夹</label>
          <input class="absolute left-0 w-full opacity-0 h-full cursor-pointer" title="" ref="fileRef" type="file"
            name="file" webkitdirectory @change.stop="change" />
        </div>

        <div v-for="(item, i) in tableList" :key="i" :index="item.id" class="px-12 flex h-10 text-center hover:bg-546770">
          <div v-if="item.display" class="self-center" :class="0 == item.id ? ' ' : ' cursor-pointer '"
            @click="ChangeTable(item)">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- 中部 -->

    <!-- 摆放模型 -->

    <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />
    <div class="hidden absolute top-0 left-0 cutimg overflow-hidden">
      <canvas id="nowcanvas" class="bg-white"> </canvas>
    </div>
    <loadingPanel class="absolute z-50 left-0 top-0" ref="loadingPanel" />

    <!-- 右侧检视面板 @click="inAddComponent=false;"-->
    <div class="absolute right-0 top-0 w-80 h-full bg-546770">
      <settingPanelCtrl ref="settingPanelCtrl" />
      
      <!-- <div class=" mt-10 w-80 h-10 border-t text-white cursor-pointer " @click.stop="inAddComponent=true;">
        <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">Add Component</div>
      </div>
      <div class="  mt-2 w-80 flex   " v-if="inAddComponent">
        <addComponent ref="addComponent" />
      </div> -->
    </div>

    <!-- 修改名称 -->
    <div class="absolute left-2 top-12 flex text-white">
      <div class="w-auto h-6 mt-1">单品名:</div>
      <input class="bg-transparent placeholder-gray-400 p-1" type="text" v-model="modelData.name"
        :placeholder="modelData.name" @focus="removeThreeJSfocus" @blur="addThreeJSfocus" />
    </div>

    <!-- 截图区域安全区域 -->
    <PanelCut @cancel="CancelCut" ref="PanelCut" />

    <modelSelectPanel ref="modelSelectPanel" />
    <animPanel ref="animPanel" />
    <boneConvertPanel ref="boneConvertPanel" />

    <div class=" absolute left-24 top-10">
      <!-- 左上角血条头像 -->
      <headerUI ref="headerUI" />
    </div>

    <skillProgressUI ref="skillProgressUI" />

    <!-- 与后台交互的操作提示 -->
    <!---->
    <div v-if="tipData.opening" class="absolute left-0 top-10 w-full flex">
      <div class="
          mx-auto
          flex
          w-auto
          bg-blue-400
          text-white text-xl
          rounded-lg
          h-10
        ">
        <div class="px-4 mx-auto self-center">
          {{ tipData.tipContent }} --- {{ tipData.uploadProgress }}
        </div>
      </div>
    </div>

    <div class="
        hidden
        md:flex
        absolute
        left-0
        bottom-10
        w-auto
        pointer-events-none
      ">
      <div class="flex w-auto text-white text-md rounded-lg h-10">
        <div class="px-4 text-left mx-auto self-center">
          键盘操作：<br />
          G:重力开关<br />
          F:上下车<br />
          T:扔掉武器<br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerAnimData from "../../data/platform/playerAnimSetting.js";

import AvatarData from "../../data/platform/sceneSetting_editor.js";

import YJmetaBase from "./YJmetaBase.vue";

import PanelCut from "./PanelCut.vue";

import modelSelectPanel from "./panels/modelSelectPanel.vue";
import animPanel from "./panels/animPanel.vue";
import boneConvertPanel from "./panels/boneConvertPanel.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";

import settingPanelCtrl from "./settingPanel/settingPanelCtrl.vue";

import headerUI from "./common/headerUI.vue";
import skillProgressUI from "./common/skillProgressUI.vue";

import addComponent from "./components/addComponent.vue";

import { SceneManager } from "../../js/SceneManagerEditor.js";
import { Interface } from "../../js/Interface_editor.js";

import { UploadFile, GetAllModel } from "../../js/uploadThreejs.js";

export default {
  name: "EditorPanel",
  components: {
    loadingPanel,
    YJmetaBase,
    modelSelectPanel,
    animPanel,
    boneConvertPanel,
    settingPanelCtrl,
    
    addComponent,
    PanelCut,
    headerUI,
    skillProgressUI,
  },
  data() {
    return {
      inAddComponent: false,
      hasUI: true,
      panelState: {
        // setting: false,
        setting: false,
        model: false,
        uvAnim: false,
        car: false,
        player: false,
        screen: false,
        particle: false,
        avatar: false,
        npc: false,
        interactive: false,
        trail: false,
        
      },
      hover: false,
      infloating: false,

      _SceneManager: null,
      hasImport: true,
      tableList: [
        { id: "single_cut", display: true, content: "截图（制作缩略图）" },
        { id: "single_collider", display: true, content: "隐藏碰撞体", value: true },
        { id: "single_usercollider", display: true, content: "激活碰撞体", value: true },
        // { id: "single_first", content: "第一人称视角" },
        // { id: "single_third", content: "第三人称视角" },
        { id: "single_planeState", display: true, content: "隐藏地面", value: true },
        // { id: 10000, content: "保存", },
        // { id: 10000, content: "发布", },
      ],
      viewFar: 5,

      inLoadCompleted: false,

      userName: "",
      userId: "",
      id: "",

      isMobile: false,

      language: null,
      isEn: false,
      avatarData: null,
      // playerAnimData: null,
      contrlState: 0,

      inThreejs: false,

      publicUrl: "",

      userData: {},
      initCompleted: false,

      avatarId: "",

      InDriving: false,
      Interface: null,
      modelList: [],

      cTime: "",
      currentTime: "",
      loading: false,
      height: 1.7,
      modelData: {},
      fileName: "",
      fileList: [],
      fileSize: 5,
      accept: ".jpg,.jpeg,.bmp,.png,.bin,.gltf,.glb,.fbx,.FBX",
      loadTip: "加载中，请稍候。。。",

      folderPath: "models/staticModels/",
      hasModel: false,
      modelName: "",
      hasbin: false,
      folderBase: "wenjjjwe",
      inputing: false,
      oldFileName: "",
      sceneData: {},

      tipData: {
        opening: false,
        current: 1,
        count: 10,
        tipContent: "sdfsdf",
        uploadProgress: "",
      },
      currentSettingPanel: null,
    };
  },
  created() {
    this.avatarData = AvatarData;
    this.sceneData = AvatarData;

    this.publicUrl = this.$publicUrl + this.avatarData.setting.localPath;
  },
  mounted() {
    if (_Global.reloadTimes == 1) {
      window.location.reload();
      _Global.reloadTimes = 0;
    }
    this.Interface = new Interface(this, true);

    if (this.$route.path.toLowerCase().includes("editorsingle")) {
      localStorage.setItem("modelType", "模型");
    }

    let avatarId = PlayerAnimData.defaultUser.avatarId;
    if (localStorage.getItem("avatarId")) {
      avatarId = localStorage.getItem("avatarId");
    }
    
    this.userName = "aa";
    if (localStorage.getItem("userName")) {
      this.userName = localStorage.getItem("userName");
    }
    this.avatarId = avatarId;

    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData) {
      this.modelData = modelData;
      this.oldFileName = this.modelData.name;
      this.folderBase = modelData.folderBase;
    }

    if (this.$route.params.folderBase != undefined) {
      this.folderBase = this.$route.params.folderBase;
    } else if (this.$route.query.folderBase != undefined) {
      this.folderBase = this.$route.query.folderBase;
    } else {
    }

    // 如从虚拟形象编辑进入，则不显示导入按钮,并且不额外加载角色模型
    if (localStorage.getItem("inAvatarEditor")) {
      localStorage.removeItem("inAvatarEditor");
      this.hasImport = false;
    }
    console.log("this.modelData ", this.modelData);

    this.RequestGetAllModel(() => {
      this.Load();
    });
  },
  methods: {

    setSettingDisplayById(id, display) {
      for (let i = 0; i < this.tableList.length; i++) {
        const element = this.tableList[i];
        if (element.id == id) {
          element.display = display;
        }
      }
    },

    ChangePanel(e) {
      this.$refs.settingPanelCtrl.ChangePanel(e);
      setTimeout(() => {
        this.currentSettingPanel = this.$refs.settingPanelCtrl.$refs["settingPanel_" + e];
      }, 200); 
    },
    Load() {
      this.hasUI = false;

      if (this.modelData.modelType == "uv模型") {
        this.hasImport = false;
        this.setSettingDisplayById("single_collider", false);
        this.setSettingDisplayById("single_usercollider", false);
        this.setSettingDisplayById("single_planeState", false);
      }

      if (this.modelData.modelType == "汽车模型") {
        this.hasImport = false;
        this.setSettingDisplayById("single_collider", false);
        this.setSettingDisplayById("single_usercollider", false);
        this.setSettingDisplayById("single_planeState", false);
      }

      if (this.modelData.modelType == "NPC模型") {
        this.hasImport = false;
        this.setSettingDisplayById("single_collider", false);
        this.setSettingDisplayById("single_usercollider", false);
        this.setSettingDisplayById("single_planeState", false);
      }
      if (this.modelData.modelType == "装备模型") {
        setTimeout(() => {
          _Global.YJ3D._YJSceneManager
            .CreateOrLoadPlayerAnimData()
            .GetAllAnim(this.avatarId, (temp) => {
              let animList = _Global.animList;
              let canAnimList = [];
              for (let i = 0; i < animList.length; i++) {
                const anim = animList[i];
                anim.has = false;
                for (let j = 0; j < temp.length; j++) {
                  const element = temp[j];
                  if (element == anim.animName && element != "") {
                    anim.has = true;
                    canAnimList.push({ label: anim.content, value: anim.animName });
                  }
                }
              }
              this.$refs.settingPanelCtrl.$refs.settingPanel_weapon.SetAnimList(canAnimList);
            });
        }, 1000);
      }

      if (this.modelData.modelType == "角色" ||this.modelData.modelType == "拖尾模型"  ) {
        this.hasImport = false;
      }

      if (this.modelData.modelType == "角色模型") {
        setTimeout(() => {
          this.$refs.settingPanelCtrl.$refs.settingPanel_player.SetAvatar(
            _Global.YJ3D._YJSceneManager.GetSingleModelTransform()
          );
        }, 3000);
      }


      let modelTemplate = this.UIData.customPanel.templateList[0].template;
      for (let i = 0; i < modelTemplate.length; i++) {
        const element = modelTemplate[i];
        if (element.name == this.modelData.modelType) {
          this.ChangePanel(element.panel);
        }
      }

      // console.error("this.modelData load ",modelTemplate, this.modelData);

      this.userData = {
        userName: this.userName,
        roomName: this.avatarData.roomName,
        platform: this.avatarData.platform,
        avatarId: this.avatarId,
      };

      this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData);

      _Global.YJ3D.SetNickName(this.userName);
      // 初始化截图
      this.$refs.PanelCut.Init(_Global.YJ3D);
    },

    // 获取所有单品
    async RequestGetAllModel(callback) {
      GetAllModel().then((res) => {
        console.log("获取所有单品模型 ", this.folderBase, res);
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

          for (let i = 0; i < modelsList.length; i++) {
            let item = modelsList[i];
            if (item.modelType == "角色模型") {
              // 到角色数据中，模型路径、动画数据
              if (item.message) {
                let data = item.message.data;
                data.modelPath = this.$uploadUrl + item.modelPath;
                _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data);
              }
            }
          }

          for (let i = 0; i < modelsList.length; i++) {
            let item = modelsList[i];
            if (item.folderBase == this.folderBase) {
              localStorage.setItem("modelData", JSON.stringify(item));
              this.modelData = item;
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
    // 使用id获取其模型路径
    GetModelPathByFolderBase(folderBase, callback) {
      console.log("" + folderBase);
      GetAllModel().then((res) => {
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;

          for (let i = 0; i < txtDataList.length; i++) {
            const element = txtDataList[i];
            let item = JSON.parse(element);
            if (item.folderBase + "" == folderBase + "") {
              if (callback) {
                callback(item.modelPath);
              }
              return;
            }
          }
        }
      });
    },

    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      _Global.YJ3D.removeEventListener();
      this.inputing = true;
    },
    addThreeJSfocus() {
      if (this.inputing) {
        //
        if (this.oldFileName != this.modelData.name) {
          this.oldFileName = this.modelData.name;
          if (this.modelData.modelType == "角色模型") {
            this.$refs.settingPanelCtrl.$refs.settingPanel_player.updateName(this.oldFileName);
          }
          this.updateModelTxtData();
        }
      }
      _Global.YJ3D.threeJSfocus();
      this.inputing = false;
    },

    // 模型数据上传完成后，保存并上传其文本文件数据
    updateModelTxtData() {
      console.log(this.modelData);

      if (this.modelData.message == undefined) {
        if (this.modelData.modelType == "角色模型") {
          this.modelData.message = this.$refs.settingPanelCtrl.$refs.settingPanel_player.getMessage();
        }
      }


      this.modelData.icon =
        this.folderBase + "/" + this.folderBase + "_thumb.png";

      let s = JSON.stringify(this.modelData);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append(
        "fileToUpload",
        this.$stringtoBlob(s, this.folderBase + "_data.txt")
      );
      fromData.append("folderBase", this.folderBase);
      this.$uploadFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传模型数据文件成功 ");
          this.SetTip("保存成功");
        }
      });
    },

    // 保存模型缩略图，并上传
    updateModelIconPic(dataurl) {
      _Global.YJ3D.scene.background = null;

      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append(
        "fileToUpload",
        this.$dataURLtoBlob(dataurl, this.folderBase + "_thumb.png")
      );
      fromData.append("folderBase", this.folderBase);
      this.$uploadFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传模型缩略图 ");
          this.SetTip("缩略图制作成功！");
        }
      });

      _Global.YJ3D._YJSceneManager.ResetBackgroundColor();
      localStorage.setItem("modelData", JSON.stringify(this.modelData));
      this.updateModelTxtData();
    },
    CancelCut() {
      _Global.SendMsgTo3D("单品", "显示角色");
      // _Global.ChangeFirstThird(false);
      _Global.SetEnableGravity(true);
      _Global.SetDisplayFloor(true);
    },

    ChangeTable(item) {
      console.log(item);
      // 截图
      if (item.id == "single_cut") {
        this.$refs.PanelCut.safeOrder = true;
        //关闭重力、隐藏角色、隐藏地面、隐藏碰撞体、视角放到物体几何中心

        _Global.SetEnableGravity(false);
        _Global.SetDisplayFloor(false);
        // _Global.ChangeFirstThird(true);
        _Global.SendMsgTo3D("单品", "隐藏角色");
        return;
      }
      // 是否显示碰撞体
      if (item.id == "single_collider") {
        item.value = !item.value;
        item.content = item.value ? "隐藏碰撞体" : "显示碰撞体";
        _Global.SendMsgTo3D("单品", item.content);
        return;
      }

      // 是否激活碰撞体
      if (item.id == "single_usercollider") {
        item.value = !item.value;
        item.content = item.value ? "激活碰撞体" : "忽略碰撞体";
        _Global.SendMsgTo3D("单品", item.content);
        return;
      }

      // 切换到第一人视角
      if (item.id == "single_first") {
        _Global.ChangeFirstThird(true);
        _Global.SetEnableGravity(false);
        return;
      }

      // 切换到第三人视角
      if (item.id == "single_third") {
        _Global.ChangeFirstThird(false);
        _Global.SetEnableGravity(true);
        return;
      }

      // 隐藏地面
      if (item.id == "single_planeState") {
        item.value = !item.value;
        item.content = item.value ? "隐藏地面" : "显示地面";
        _Global.SetDisplayFloor(item.value);
        // if (!item.value) {
        //   _Global.ChangeFirstThird(true);
        //   _Global.SetEnableGravity(false);
        // }
        return;
      }
    },

    // 文件夹上传 方法
    change() {
      console.log(this.$refs.fileRef.files); //文件列表
      let files = this.$refs.fileRef.files;
      this.loadCount = files.length;

      for (let i = 0; i < files.length; i++) {
        this.fileList.push(files[i]);
      }

      if (this.loading) {
        return;
      }

      this.tipData.opening = true;
      this.tipData.current = 1;
      this.tipData.count = this.fileList.count;
      this.tipData.tipContent =
        "正在上传 " + this.tipData.current + "/" + this.tipData.count;

      this.UploadFilesDire(this.fileList[0]);
    },
    // 文件夹上传 方法
    async UploadFilesDire(file) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.hasModel = false;
      let that = this;
      let filePath = file.webkitRelativePath.replace("/" + file.name, "");

      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", file);
      fromData.append("folderName", filePath);
      //是否为根目录。根目标表示整个文件夹上传。
      fromData.append("isBase", "false");
      //模型或场景文件夹的根目录在创建时由服务器返回
      fromData.append("folderBase", this.folderBase);

      // const res = await this.$axios.post(
      //   "/upload", fromData
      // );

      // console.log("res", res);
      // this.fileList.shift();
      // this.loading = false;
      // if (this.fileList.length > 0) {
      //   this.UploadFilesDire(this.fileList[0]);
      // } else {
      //   // 清空input file
      //   this.$refs.fileRef.value = "";
      //   console.log(" 所有文件上传完成 ");
      // }
      // return;

      //上传到本地 或 0SS
      this.$uploadFile(fromData).then((res) => {
        //先记录旧照片
        console.log(" 上传文件 ", res);
        if (res.data == "SUCCESS") {
          this.fileList.shift();
          this.loading = false;
          if (this.fileList.length > 0) {
            this.tipData.current++;
            this.tipData.tipContent =
              "正在上传 " + this.tipData.current + "/" + this.tipData.count;

            this.UploadFilesDire(this.fileList[0]);
          } else {
            // 清空input file
            this.$refs.fileRef.value = "";
            this.$refs.opacityBtn.focus();

            this.tipData.tipContent = "上传完成";
            this.tipData.uploadProgress = "";

            setTimeout(() => {
              this.tipData.opening = false;
            }, 2000);

            console.log(" 所有文件上传完成 ");
          }
        }
      });
    },

    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      console.log("文件上传成功");
    },
    handleBeforeUpload(file) {
      // if (this.fileSize) {
      //   const isLt = file.size / 1024 / 1024 < this.fileSize;
      //   if (!isLt) {
      //     this.SetErrorTip(`上传文件大小不能超过 ${this.fileSize} MB!`);
      //     return false;
      //   }
      // }

      this.fileList.push(file);

      console.log(file);
      // console.log(fileList);
      // return;

      // let filename = file.name;
      // if (filename.indexOf(".gltf") > -1 || filename.indexOf(".fbx") > -1
      //   || filename.indexOf(".FBX") > -1) {
      //   this.fileName = file.name;
      // }

      // if (this.cTime == "") {
      //   this.currentTime = parseInt(new Date().getTime()) + "";
      //   this.cTime = "" + this.currentTime;
      //   // this.cTime = this.$getDateYM() + "/" + this.currentTime;
      // }
      this.tipData.opening = true;
      this.tipData.current = 1;
      this.tipData.count = this.fileList.length;
      this.tipData.tipContent =
        "正在上传 " + this.tipData.current + "/" + this.tipData.count;

      if (this.loading) {
        return;
      }

      this.UploadFiles(this.fileList[0]);
    },

    async UploadFiles(file) {
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.hasModel = false;
      let that = this;

      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", file);
      // 单个文件上传，可多选。上传后放在根目录
      //模型或场景文件夹的根目录在创建时由服务器返回
      fromData.append("folderBase", this.folderBase);

      // const res = await this.$axios.post(
      //   '/upload',
      //   fromData
      // );

      // console.log("res", res);
      // this.fileList.shift();
      // this.loading = false;
      // if (this.fileList.length > 0) {
      //   this.UploadFiles(this.fileList[0]);
      // }
      // return;

      let fileName = file.name.toLowerCase();
      if (
        fileName.indexOf(".gltf") > -1 ||
        fileName.indexOf(".fbx") > -1 ||
        fileName.indexOf(".glb") > -1
      ) {
        this.modelName = file.name;
      }

      //上传到本地 或 0SS
      this.$uploadFile(fromData, (progressEvent) => {
        console.log("上传进度 ", progressEvent);
        let num = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
        this.tipData.uploadProgress = num + "%";
      }).then((res) => {
        console.log(" 上传文件 ", res);

        if (fileName.indexOf(".bin") > -1) {
          this.hasbin = true;
        }

        console.log("准备上传。。", fileName, this.hasbin);

        if (res.data == "SUCCESS") {
          this.fileList.shift();
          this.loading = false;
          if (this.fileList.length > 0) {
            this.tipData.current++;
            this.tipData.tipContent =
              "正在上传 " + this.tipData.current + "/" + this.tipData.count;

            this.UploadFiles(this.fileList[0]);
          } else {
            console.log(" 上传文件完成 ");

            if (this.modelName == "") {
              this.tipData.tipContent =
                "出错了。请选择模型文件，gltf+bin+贴图 或 glb ";
              return;
            }
            if (this.modelName.indexOf(".gltf") > -1 && !this.hasbin) {
              this.tipData.tipContent = "出错了。上传gltf文件需要+bin文件";
              return;
            }

            this.tipData.tipContent = "正在加载模型...";

            console.log(
              "正在加载模型 33 ",
              this.folderBase + "/" + this.modelName
            );

            this.$refs.opacityBtn.focus();
            //删除上一步的模型
            //加载模型
            _Global.YJ3D._YJSceneManager.CreateSingleModel(
              "https://snvtkd2005.com/socketIoServer/socketIoServer/uploads/" +
              this.folderBase +
              "/" +
              this.modelName,
              () => {
                console.log("加载模型完成 33 ");
                this.tipData.tipContent = "加载模型完成";
                setTimeout(() => {
                  this.tipData.opening = false;
                  if (this.modelData.modelType == "角色模型") {

                    this.$refs.settingPanelCtrl.$refs.settingPanel_player.SetAvatar(
                      _Global.YJ3D._YJSceneManager.GetSingleModelTransform()
                    );
                  }
                }, 1000);

                this.modelData.modelPath =
                  this.folderBase + "/" + this.modelName;

                this.updateModelTxtData();
              },
              (e) => {
                this.tipData.tipContent = "出错了。加载模型出错，" + e;
              }
            );
          }
        }
        // if (res.status == 200) {
        // }
        // //先记录旧照片
        // console.log("上传文件后的返回值", url);
      });
    },
    SetTip(tipContent) {
      this.tipData.opening = true;
      this.tipData.tipContent = tipContent;
      setTimeout(() => {
        this.tipData.opening = false;
      }, 2000);
    },

    SelectModel(item) {
      _Global.YJ3D._YJSceneManager.SelectModel(
        item.uuid
      );
    },
    SelectScene(e) {
      this.selectSceneName = e;

      for (let i = 0; i < this.sceneList.length; i++) {
        const element = this.sceneList[i];
        if (element.name == e) {
          this.currentSceneData = element;
        }
      }
      this.infloating = true;
    },

    viewFarFn(e) {
      _Global.YJ3D.YJController.SetCameraWheelPos(
        -this.viewFar
      );
      // 取消焦点
      this.$refs.viewFarCtrl.blur();
    },
    changeViewSliderValue(e) {
      this.viewFar = -e;
    },
    GetPlayerAnimData() {
      return PlayerAnimData;
    },
    GetAvatarData(playerName) {
      console.error(" 查找角色信息  ", playerName);

      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      console.error(" 角色信息未找到 ", playerName);
    },

    UpdateSkin(_YJPlayer, playerName, playerState) {
      // this._SceneManager.UpdateSkin(_YJPlayer, playerName, playerState);
      // return;

      // console.error(" 同步换装数据 ",playerName, playerState);
      if (
        playerName != "litleUnityChain2" ||
        playerState == null ||
        playerState == undefined
      ) {
        _YJPlayer.ChangeSkinCompleted();
        return;
      }

      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      let skinData = avatarData.skinData;
      if (skinData == undefined || skinData.length <= 1) {
        return;
      }
      let sp = playerState.split("_");
      for (let i = 0; i < skinData.length; i++) {
        skinData[i].selected = parseInt(sp[i]);
      }
      let mode = "";
      let part = "";
      let targetPath = "";

      let faceSourcePath = "";
      let faceAddPath = "";

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }
      }

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == "eye") {
          targetPath = element.modelPath[element.selected];

          _YJPlayer.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
          _YJPlayer.ChangeSkin(
            targetPath,
            "Face",
            element.mode,
            faceSourcePath
          );
          _YJPlayer.ChangeSkin(
            faceAddPath,
            "Face",
            "addTexture",
            faceSourcePath
          );
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
        }
      }
      setTimeout(() => {
        _YJPlayer.ChangeSkinCompleted();
      }, 500);
    },
    Photo(callback) {
      return this._SceneManager.Photo(callback);
    },
    SetNpcMusicUrl(npcName) { },

    ClickChangeScene(sceneSetting) { },
    //切换场景
    ChangeScene(sceneSetting) {
      this.avatarData = sceneSetting;
      this.publicUrl = this.$publicUrl + this.avatarData.setting.localPath;

      // 程序加载场景
      this.$refs.YJmetaBase.Reload();
      _Global.YJ3D._YJSceneManager.ChangeScene();

      if (this._SceneManager != null) {
        this._SceneManager.ChangeScene(this.avatarData);
      }

      if (this.$refs.YJDync) {
        this.$refs.YJDync.LeaveRoom();
      }
    },
    GetUseId() {
      return this.$refs.YJDync.GetUseId();
    },
    //由角色选择界面传入 角色类型、用户名
    ClickSelectPlayerOK(selectPlayerName, userName) {
      this.userName = userName;
      localStorage.setItem("username", this.userName);
      this.avatarId = selectPlayerName;

      this.hasPlayerSelectPanel = false;
      this.inLoadCompleted = true;
      this.userData = {
        userName: userName,
        roomName: this.avatarData.roomName,
        platform: this.avatarData.platform,
        modelType: selectPlayerName,
      };

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.DisplayLoading();
      }

      // console.log(userData);

      this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData);

      // 显示玩家姓名条
      _Global.YJ3D.SetNickName(userName);

      console.log("场景加载完成------------");
    },

    SetTriggerOverlap(b, id, owner) {
      if (this._SceneManager) {
        this._SceneManager.SetTriggerOverlap(b, id, owner);
      }
      this.Interface.SetTriggerOverlap(b, id, name);
      if (id == "car") {
        let userd = false;
        if (b && !this.InDriving) {
          userd = this._SceneManager.SetCar(owner);
        } else {
          this._SceneManager.SetCar(null);
        }
      }
    },

    InCar() {
      this._SceneManager.InCar();
      this.InDriving = true;
    },
    OutCar() {
      this._SceneManager.OutCar();
      this.InDriving = false;
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

      let modelData = JSON.parse(localStorage.getItem("modelData"));
      console.log(" modelData ", modelData);

      if (!this.initCompleted) {
        _Global.YJ3D.PlayVideo();
        _Global.YJ3D.AddVideoListener();

        this.hasGameUI = true;

        this.$nextTick(() => {
          if (this.$refs.YJDync) {
            if (!this.avatarData.modelPath.includes("Scene3")) {
              this.$refs.YJDync.InitDync(this.userData);
            } else {
              //在开车场景，关闭同步。因为开车非常费流量。2个人1小时30块
              _Global.mainUser = true;
            }
          } else {
            _Global.mainUser = true;
          }
        });

        //场景设置
        this._SceneManager = new SceneManager(
          _Global.YJ3D.scene,
          _Global.YJ3D.renderer,
          _Global.YJ3D.camera,
          _Global.YJ3D,
          _Global.YJ3D._YJSceneManager.GetmodelParent(),
          this,
          () => {
            if (callback) {
              callback();
            }
          }
        );

        this._SceneManager.ChangeScene(this.sceneData);
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
      // new SceneManager_MaterialSetting(
      // _Global.YJ3D.scene,
      // _Global.YJ3D.renderer,
      // _Global.YJ3D.camera,
      // _Global.YJ3D
      // );
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
      // console.log(" 3转2 ",_projectionList);
    },

    SetViewState(e) { },

    // 点击角色NPC，显示NPC下方的光圈
    ClickPlayer(owner) {
      this._SceneManager.ClickPlayer(owner);
    },

    RightClick(hitObject, hitPoint) {
      this._SceneManager.RightClick(hitObject, hitPoint);
    },
    ClickModel(hitObject) {
      this._SceneManager.ClickModel(hitObject);
    },
    HoverObject(hoverObject, hoverPoint) {
      if (this._SceneManager) {
        this._SceneManager.HoverObject(hoverObject, hoverPoint);
      }
    },

    CreateHotContent(modelData, owner) {
      console.log("点击热点 ", modelData, owner);

      this.Interface.LoadData(modelData.id);
    },
    ClickHotPointOwner(hitObject) { },

    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) { },

    ChangeViewFar() { },

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

    //获取小地图图片url
    GetMinMapData() {
      let minMapData = this.avatarData.minMapData;
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