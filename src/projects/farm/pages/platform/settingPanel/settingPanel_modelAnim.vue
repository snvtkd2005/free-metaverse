

<template>
   <div>
  <settingPanel_localOffset ref="settingPanel_localOffset" />

  <div class="w-full max-w-md p-2 text-white rounded-lg overflow-hidden">
    <div class="text-left">添加动画</div>
    <div class="w-full">
      <YJinputCtrl :setting="setting" />
    </div>

    <!-- 动作播放进度滑块 -->
    <div class="flex w-full">
      <div class="bg-gray-400 cursor-pointer" @click="auto = !auto">
        {{ auto ? "暂停" : "播放" }}
      </div>
      <div class="w-16 ml-2">
        {{ animClip.currentTime + "/" + animClip.duration }}
      </div>
      <input
        ref="viewFarCtrl"
        class="ml-2 outline-none w-40"
        @input="sliderChangeFn"
        v-model="animClip.currentTime"
        type="range"
        min="0"
        :max="animClip.duration"
        step="1"
      />
    </div>
  </div>

  <div
    class="w-80 h-10 text-white cursor-pointer"
    @click="ClickBtnHandler('动作列表')"
  >
    <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
      查看已有动作
    </div>
  </div>

  <div class="mt-2 w-11/12 h-10 mx-auto text-white flex justify-between">
    <div v-for="(item, i) in animList" :key="i">
      <div
        class="bg-445760 rounded-md inline-block px-2 leading-10 cursor-pointer"
        @click="ClickBtnHandler('播放动作', item)"
      >
        {{ item.animName }}
      </div>
    </div>
  </div>

  <div class="mt-2 w-80 h-10 text-white">
    <div
      class="mt-2 bg-445760 rounded-md inline-block px-14 py-1 cursor-pointer"
      @click="ClickBtnHandler('保存')"
    >
      保存
    </div>
  </div>
 </div>
</template>

<script>
/**
 * 角色动作上传面板：
 * 先查询到所有动作
 *  动作名不可与已有的动作名同名
 *  动作json文件不可与已有的文件同名
 *
 * 上传后播放动作、显示保存按钮
 * 点击保存后才能保存到文本
 */

import YJinputCtrl from "../components/YJinputCtrl.vue";

import settingPanel_localOffset from "./settingPanel_localOffset.vue";

import {
  UploadFile,
  UploadSkill,
  UploadPlayerFile,
} from "../../../js/uploadThreejs.js";

export default {
  name: "settingpanel_modelAnim",
  components: {
    YJinputCtrl,
    settingPanel_localOffset,
  },
  data() {
    return {
      pointType: "modelAnim",
      canSave: false,
      animListData: [{ animName: "shooting", path: "anim.json", icon: "" }],
      settingData: {
        name: "",
        id: "",
        modelScale: 1,
        // 扩展动作，由加载外部动画文本解析得到
        animationsExtendData: [],
        localOffset: {}, //局部偏移
        isLookatCam: false, //是否始终朝向视图
        isLockY: false, //是否锁定Y轴
      },

      setting: [
        {
          property: "animName",
          display: true,
          title: "动作名",
          type: "text",
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "isLoop",
          display: true,
          title: "是否循环",
          type: "toggle",
          value: true,
          callback: this.ChangeValue,
        },
        {
          property: "path",
          display: true,
          title: "动作(记录动作信息的json或fbx文件)",
          type: "upload",
          accept: ".json,.fbx",
          value: "none",
          callback: this.ChangeValue,
          handleBeforeUpload: this.handleBeforeUpload,
        },        
        { property: "isLookatCam", display: true, title: "是否始终朝向视图", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "isLockY", display: true, title: "锁定在Y轴旋转", type: "toggle", value: false, callback: this.ChangeValue },
      
        // { property: "path", title: "动作(上传记录动作信息的json文件)", type: "upload", value: "none", callback: this.ChangeValue },
      ],

      animName: "",

      animValue: "none",
      animList: [],
      // accept: ".json,.fbx,.glb",
      acceptImage: ".jpg,.png",

      loadContent: "打开动作列表",
      inSelect: false,
      folderBase: "",
      fileName: "",
      fileList: [],
      currentAnimData: {
        animName: "",
        isLoop: false,
        path: "",
        icon: "",
      },
      animClip: {
        currentTime: 0,
        duration: 100,
      },
      auto: true,
    };
  },
  created() {
    this.parent = this.$parent.$parent;
  },
  mounted() {
    // _Global.SendMsgTo3D("添加组件", { component: "car", data: this.carData });
    let modelData = JSON.parse(localStorage.getItem("modelData"));
    this.folderBase = modelData.folderBase;

    this.modelData = modelData;

    // this.folderBase = "farmplayer";
    console.log("modelData in model anim Panel ", modelData);
    this.settingData.name = modelData.name;
    if (modelData.message == undefined) {
      this.settingData.id = this.parent.folderBase + "";
      return;
    }

    console.log(" in modelanim  modelData = ", modelData);
    this.settingData = modelData.message.data;

    this.initValue();

    this.setSettingItemByProperty("isLoop", this.currentAnimData.isLoop);

    _Global.addEventListener("单品模型加载完成", (transform) => {
      this.transformJS = transform;
      if (this.animList.length > 0) {
        this.ClickBtnHandler("播放动作", this.animList[0]);
      } 
      this._YJAnimator = _Global.YJ3D._YJSceneManager.GetSingleTransformComponent("Animator");
    });
  },
  methods: {
    ClickBtnHandler(e, item) {
      if (e == "播放动作") {
        let _YJAnimator =
          _Global.YJ3D._YJSceneManager.GetSingleTransformComponent("Animator");
        _YJAnimator.ChangeAnim(item.animName);
        console.log(e, item);
        this.setting[0].value = item.animName;
        this.setting[1].value = item.isLoop;
        this.setting[2].value = item.path;

        this.currentAnimData.path = item.path;
        this.currentAnimData.isLoop = item.isLoop;
        this.currentAnimData.animName = item.animName;
        this.animName = item.animName;
      }
      if (e == "保存") {
        this.save();
      }
    },
    setSettingItemByProperty(property, value) {
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == property) {
          element.value = value;
        }
      }
    },
    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() {},
    initValue() {
      if(this.settingData.isLookatCam == undefined){
        this.settingData.isLookatCam = false;
      }
      if(this.settingData.isLockY == undefined){
        this.settingData.isLockY = false;
      }
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

      // 如果有动作，播放第一个动作
      if (
        this.settingData.animationsExtendData &&
        this.settingData.animationsExtendData.length > 0
      ) {
        let has = false;
        for (
          let i = this.settingData.animationsExtendData.length - 1;
          i >= 0;
          i--
        ) {
          if (
            this.settingData.animationsExtendData[i].animName == "" ||
            this.settingData.animationsExtendData[i].path == ""
          ) {
            this.settingData.animationsExtendData.splice(i, 1);
            has = true;
          }
        }
        this.animList = this.settingData.animationsExtendData;

        if (has) {
          // 单品中才有 updateModelTxtData
          if (this.parent.updateModelTxtData) {
            this.parent.modelData.message = this.getMessage();
            this.parent.updateModelTxtData();
          } else {
            // 在场景编辑中的修改
            this.Update();
          }
        }
      }

      this.animate();
    },
    updateName(v) {
      this.settingData.name = v;
      this.parent.modelData.message = this.getMessage();

      // 控制三维
      _Global.YJ3D._YJSceneManager
        .GetSingleModelTransform()
        .SetMessage(this.getMessage());
    },

    getMessage() { 
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    Init(_carData) {
      this.carData = _carData;
    },
    ChangeValue(i, e) {
      let property = this.setting[i].property;
      // return;
      this.setting[i].value = e;
      this.settingData[property] = e;

      if (property == "isLoop") {
        this.currentAnimData.isLoop = e;
        // 控制动作
        _Global.YJ3D.YJPlayer.GetAvatar().ChangeAnimIsLoop(this.animName, e);
        //
        this._YJAnimator =
          _Global.YJ3D._YJSceneManager.GetSingleTransformComponent("Animator");
        _YJAnimator.ChangeAnimIsLoop(this.animName, e);
      }
      if (property == "isLockY" || property == "isLookatCam"){
        this.settingData.pointType = this.pointType;
        this._YJAnimator.SetMessage(this.settingData);
      }
 
      console.log(i + " " + this.setting[i].value, this.animName);
    },
    SetAnimName(anim) {
      this.setting[0].value = anim.animName;
      this.animName = this.setting[0].value;
      this.currentAnimData.animName = this.animName;
      if (this.animName == "") {
        return;
      }
      // 从当前角色的动作中获取
      this.GetAnimDataByAnimName(
        this.modelData.name,
        this.animName,
        (animData) => {
          this.setting[1].value = animData.isLoop;
          this.currentAnimData.isLoop = this.setting[1].value;
          this.currentAnimData.path = animData.path;
          //npc播放动作
          if (animData.path != "") {
            let _YJAnimator =
              _Global.YJ3D._YJSceneManager.GetSingleTransformComponent(
                "Animator"
              );
            _YJAnimator.ChangeAnim(this.animName);
          }
        }
      );
    },
    GetAnimDataByAnimName() {},
    handleBeforeUpload(file) {
      this.animName = this.setting[0].value;
      if (this.animName == "") {
        this.parent.SetTip("请先输入动作名");
        return;
      }

      // 还要验证文件名是否已存在，如果已存在要提示
      let fileName = file.name;
      for (let i = 0; i < this.animListData.length; i++) {
        const element = this.animListData[i];
        if (element.animName == this.animName) {
          this.parent.SetTip("动作名重复，请重命名");
          return;
        }
        if (element.path == fileName) {
          this.parent.SetTip("json文件已存在，请重命名后上传");
          return;
        }
      }

      this.fileList.push(file);

      console.log(file);
      // console.log(fileList);
      // return;

      if (this.loading) {
        return;
      }

      this.UploadFiles(this.fileList[0]);
    },

    // 上传动作文件
    async UploadFiles(file) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.hasModel = false;
      let fromData = new FormData();
      fromData.append("fileToUpload", file);
      fromData.append("folderBase", this.folderBase);

      let fileName = file.name;

      this.$uploadFile(fromData).then((res) => {
        console.log(" 上传文件 ", res);
        if (res.data == "SUCCESS") {
          this.fileList.shift();
          this.loading = false;
          if (this.fileList.length > 0) {
            console.log("准备上传。。", fileName);
            this.UploadFiles(this.fileList[0]);
          } else {
            console.log(" 上传文件完成 ");
            this.canSave = true;
            this.currentAnimData.path = fileName;
            this.currentAnimData.animName = this.animName;
            // this.$uploadUrl + this.folderBase + "/" +
            let items = [this.currentAnimData];
            this.AddAllExtendAnimData(this.modelData.name, items);
            // 加载动作
            // _Global.YJ3D.YJController.ChangeAnimDirect(this.animName);

            let _YJAnimator =
              _Global.YJ3D._YJSceneManager.GetSingleTransformComponent(
                "Animator"
              );
            _YJAnimator.ChangeAnim(this.animName);
          }
        }
      });
    },
    AddAllExtendAnimData() {
      if (this.settingData.animationsExtendData == undefined) {
        this.settingData.animationsExtendData = [];
      }
      console.log(
        "添加新动作 11 ",
        this.currentAnimData.animName,
        this.animName
      );
      let has = false;
      for (
        let i = 0;
        i < this.settingData.animationsExtendData.length && !has;
        i++
      ) {
        const element = this.settingData.animationsExtendData[i];
        console.log(
          element.animName +
            " ---> " +
            this.animName +
            " = " +
            (element.animName == this.animName)
        );
        if (element.animName == this.animName) {
          element.path = this.currentAnimData.path;
          element.isLoop = this.currentAnimData.isLoop;
          has = true;
        }
      }
      this.currentAnimData.animName = this.animName;
      if (!has) {
        console.log("添加新动作 22", this.animName);
        this.settingData.animationsExtendData.push(
          JSON.parse(JSON.stringify(this.currentAnimData))
        );
      }
    },
    removeAnim(_animName) {
      let has = false;
      for (
        let i = this.settingData.animationsExtendData.length - 1;
        !has && i >= 0;
        i--
      ) {
        const element = this.settingData.animationsExtendData[i];
        console.log(
          element.animName +
            " ---> " +
            _animName +
            " = " +
            (element.animName == _animName)
        );
        if (element.animName == _animName) {
          this.settingData.animationsExtendData.splice(i, 1);
          has = true;
        }
      }
    },
    animate() {
      requestAnimationFrame(this.animate);

      let singleTransform =
        _Global.YJ3D._YJSceneManager.GetSingleModelTransform();

      if (singleTransform) {
        let _YJAnimator =
          _Global.YJ3D._YJSceneManager.GetSingleTransformComponent("Animator");
        // _YJAnimator.ChangeAnim(this.animName);

        let { time, duration } = _YJAnimator.GetCurrentTime();
        time = parseInt(time * 24);
        duration = parseInt(duration * 24);
        this.animClip.duration = duration;

        if (this.auto) {
          this.animClip.currentTime = time;
        } else {
          _YJAnimator.SetCurrentTime(this.animClip.currentTime / 24);
        }
        // console.log(" 动画 "+time + " / " + duration);
      }
    },
    v3ToArray(v3, scale) {
      return [v3.x / scale, v3.y / scale, v3.z / scale];
    },
    save() {
      this.AddAllExtendAnimData();
      // 能保存的情况下，才显示保存按钮
      console.log("角色数据 ", this.settingData);
      // 单品中才有 updateModelTxtData
      if (this.parent.updateModelTxtData) {
        this.parent.modelData.message = this.getMessage();
        this.parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }

      // 清空动作上传输入
      // this.SetAnimName("");
    },

    Update() {
      let s = JSON.stringify(this.animListData);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", this.$stringtoBlob(s, "data.txt"));
      fromData.append("folderBase", this.folderBase);
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 模型动画数据 文件成功 ");
          this.setting[0].value = "";
          this.parent.SetTip("保存成功");
          this.canSave = false;
          
          _YJAnimator.ChangeAnim(this.animName);

        }
      });
    },
  },
};
</script>

<style scoped></style>
