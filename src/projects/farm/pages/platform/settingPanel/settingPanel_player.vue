

<template>
  <div>
    <settingPanel_avatar ref="settingPanel_avatar" />

    <!-- 角色设置面板 -->
    <div class="w-full max-w-md p-2 text-white rounded-lg overflow-hidden">
      <div class="text-left">添加动作</div>
      <div class="w-full">
        <YJinputCtrl :setting="setting" />
      </div>

      <!-- <div class=" mt-4 flex h-16 ">
      <div class="  self-center ">
        用户上传的动作
      </div>
      <YJinput_drop class=" self-center ml-2 w-32  " :value="animValue" :options="animList" :callback="ChangeAnim" />
    </div> -->

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

      <div class="hidden">
        <input
          class="ml-2 outline-none w-40"
          @input="dircChangeFn"
          v-model="dirc.x"
          type="range"
          min="-1"
          :max="1"
          step="1"
        />
        <input
          class="ml-2 outline-none w-40"
          @input="dircChangeFn"
          v-model="dirc.y"
          type="range"
          min="-1"
          :max="1"
          step="1"
        />
        <input
          class="ml-2 outline-none w-40"
          @input="dircChangeFn"
          v-model="dirc.z"
          type="range"
          min="-1"
          :max="1"
          step="1"
        />
        <input
          class="ml-2 outline-none w-40"
          @input="dircChangeFn"
          v-model="dirc.w"
          type="range"
          min="0"
          :max="2"
          step="1"
        />

        <div class="w-full flex">
          <div class="cursor-pointer">stiffnessForce</div>
          <input
            class="ml-2 outline-none w-40"
            @input="dircChangeFn"
            v-model="dirc.stiffnessForce"
            type="range"
            min="0"
            :max="1"
            step="0.001"
          />
          <div>{{ dirc.stiffnessForce }}</div>
        </div>

        <div class="w-full flex">
          <div class="cursor-pointer">dragForce</div>
          <input
            class="ml-2 outline-none w-40"
            @input="dircChangeFn"
            v-model="dirc.dragForce"
            type="range"
            min="0"
            :max="1"
            step="0.01"
          />
          <div>{{ dirc.dragForce }}</div>
        </div>

        <div class="hidden w-full">
          <div class="bg-gray-400 cursor-pointer" @click="auto = !auto">
            球形碰撞
          </div>
          <input
            ref="viewFarCtrl"
            class="ml-2 outline-none w-40"
            @input="ballRadiusChangeFn"
            v-model="ballRadius"
            type="range"
            min="0.05"
            max="3"
            step="0.01"
          />
        </div>
      </div>
    </div>

    <div
      class="w-80 h-10 text-white cursor-pointer"
      @click="ClickBtnHandler('混合动作')"
    >
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        混合动作
      </div>
    </div>

    <div
      class="w-80 h-10 text-white cursor-pointer"
      @click="ClickBtnHandler('选择可映射角色')"
    >
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        映射到同骨骼角色动画
      </div>
    </div>

    <div
      v-if="settingData.boneRefPlayer != ''"
      class="w-80 h-10 text-white cursor-pointer"
      @click="ClickBtnHandler('清除角色映射')"
    >
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        清除角色映射
      </div>
    </div>

    <div
      class="w-80 h-10 text-white cursor-pointer"
      @click="ClickBtnHandler('骨骼映射面板')"
    >
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        打开角色骨骼映射面板
      </div>
    </div>

    <div
      class="w-80 h-10 text-white cursor-pointer"
      @click="ClickBtnHandler('清空骨骼映射')"
    >
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        清空骨骼映射
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
      <div
        class="bg-445760 rounded-md inline-block px-2 leading-10 cursor-pointer"
        @click="ClickBtnHandler('idle')"
      >
        idle
      </div>
      <div
        class="bg-445760 rounded-md inline-block px-2 leading-10 cursor-pointer"
        @click="ClickBtnHandler('TPose')"
      >
        TPose
      </div>
      <div
        class="bg-445760 rounded-md inline-block px-2 leading-10 cursor-pointer"
        @click="ClickBtnHandler('选中角色')"
      >
        选中角色
      </div>
      <div
        class="bg-445760 rounded-md inline-block px-2 leading-10 cursor-pointer"
        @click="ClickBtnHandler('显示骨骼')"
      >
        显示骨骼
      </div>
    </div>

    <!-- <div class=" w-80 h-10 text-white cursor-pointer " @click="ClickBtnHandler('下载模型')">
    <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">下载模型</div>
  </div> -->

    <div
      class="mt-2 w-80 h-10 text-white cursor-pointer"
      @click="ClickBtnHandler('保存')"
    >
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">保存</div>
    </div>
    <div>
      <!-- <settingPanel_npcSkill ref="settingPanel_npcSkill" />  -->
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

// import settingPanel_npcSkill from "./settingPanel_npcSkill.vue";

import settingPanel_avatar from "./settingPanel_avatar.vue";

import {
  UploadFile,
  UploadSkill,
  UploadPlayerFile,
} from "../../../js/uploadThreejs.js";

export default {
  name: "settingpanel_player",
  components: {
    settingPanel_avatar,
    YJinputCtrl,
    // settingPanel_npcSkill,
  },
  data() {
    return {
      pointType: "player",
      canSave: false,
      // 添加技能窗口
      inAddSkill: false,
      animListData: [
        // { animName: "shooting",path:"anim.json",icon:""},
      ],
      settingData: {
        name: "",
        id: "",
        height: 1.7,
        nameScale: 1,
        modelScale: 1,
        animationsData: [],
        // 扩展动作，由加载外部动画文本解析得到
        animationsExtendData: [],
        // boneList: [],
        boneRefPlayer: "",
        boneRefPlayerAnimationData: [],
        equipPosList: [],
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
        // { property: "path", title: "动作(上传记录动作信息的json文件)", type: "upload", value: "none", callback: this.ChangeValue },
        {
          property: "weapon",
          display: true,
          title: "设置拾取不同装备后的装备位置",
          type: "file",
          filetype: "weapon",
          value: "",
        },

        {
          property: "position",
          display: false,
          title: "拾取后偏移",
          type: "vector3",
          value: [0, 0, 0],
          step: 0.01,
          callback: this.ChangeValue,
        },
        {
          property: "rotation",
          display: false,
          title: "拾取后旋转",
          type: "vector3",
          value: [0, 0, 0],
          step: 0.01,
          callback: this.ChangeValue,
        },
        {
          property: "scale",
          display: false,
          title: "拾取后缩放",
          type: "vector3",
          value: [1, 1, 1],
          step: 0.01,
          callback: this.ChangeValue,
        },
      ],

      animName: "",

      animValue: "none",
      animList: [{ value: "none", label: "none" }],
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
      ballRadius: 0.5,
      dirc: {
        x: 0,
        y: 1,
        z: 0,
        w: 1,
        stiffnessForce: 0.01,
        dragForce: 0.4,
      },
    };
  },
  created() {
    this.parent = this.$parent.$parent;
  },
  mounted() {
    let modelData = JSON.parse(localStorage.getItem("modelData"));
    this.folderBase = modelData.folderBase;
    this.modelData = modelData;

    console.log("modelData in playerPanel ", modelData);
    this.settingData.name = modelData.name;
    if (modelData.message == undefined) {
      this.settingData.id = this.parent.folderBase + "";
      return;
    }

    console.log(" modelData = ", modelData);
    this.settingData = modelData.message.data;

    // if (this.settingData.boneList) {
    //   this.settingData.boneList = undefined;
    //   this.settingData.boneRefPlayer = undefined;
    //   this.settingData.boneRefPlayerAnimationData = undefined;
    // }
    this.initValue();

    this.$refs.settingPanel_avatar.initValue(this.settingData);
    this.setSettingItemByProperty("isLoop", this.currentAnimData.isLoop);

    _Global.addEventListener("单品模型加载完成",(transform)=>{
      this.transformJS = transform;
      this.ChangePlayerAnim("idle");
    });
  },
  methods: {
    ballRadiusChangeFn(v) {
      _Global.YJAmmoPlayerBody.CreateSphere(this.ballRadius);
    },
    dircChangeFn(v) {
      _Global.dirc = this.dirc;
      console.log(_Global.dirc);
    },
    ClickBtnHandler(e) {
      if (e == "混合动作") {
        let _YJAnimator = this.transformJS.GetComponent("Animator");
        _YJAnimator.layerBlendPerbone("shooting", "run");
      }
      if (e == "选择可映射角色") {
        // 只有骨骼相同，且有扩展动作的角色，才允许被映射
        // this.parent.$refs.modelSelectPanel.Init("角色模型");
        this.parent.$refs.modelSelectPanel.RequestProjectionPlayer(
          this.settingData
        );
      }
      if (e == "保存") {
        this.$refs.settingPanel_avatar.save();
        this.save();
      }
      if (e == "下载模型") {
        this.download();
      }
      if (e == "动作列表") {
        let animList = this.PlayerAnimData().GetAllAnim(this.settingData);
        console.log(" 打开动作列表 ", animList);
        this.parent.$refs.animPanel.SetVisible(true, animList);
      }
      if (e == "骨骼映射面板") {
        let bones = this.transformJS.GetComponent("MeshRenderer").GetAllBone();
        this.parent.$refs.boneConvertPanel.SetVisible(
          true,
          bones,
          this.settingData.boneList
        );
      }
      if (e == "清除角色映射") {
        this.settingData.boneRefPlayer = "";
        this.settingData.boneRefPlayerAnimationData = [];
      }
      if (e == "清空骨骼映射") {
        this.settingData.boneList = [];
      }

      if (e == "TPose") {
        this.ChangePlayerAnim("T-Pose");
      }
      if (e == "idle") {
        this.ChangePlayerAnim("idle");
      }

      if (e == "选中角色") {
        let obj = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
        _Global.YJ3D._YJSceneManager
          .GetTransformManager()
          .attach(obj.GetGroup());
      }

      if (e == "显示骨骼") {
        this.displayBoneDummy = !this.displayBoneDummy;
        _Global._SceneManager.DisplayBoneDummy(this.displayBoneDummy);
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
    SetAvatar(avatar) {
      this.$refs.settingPanel_avatar.SetAvatar(avatar);
    },
    download() {},
    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() {},
    PlayerAnimData() {
      return _Global.CreateOrLoadPlayerAnimData();
    },
    initValue() {
      console.log(" in player init ", this.settingData);
      let has = false;
      for (
        let i = this.settingData.animationsExtendData.length - 1;
        i >= 0;
        i--
      ) {
        const element = this.settingData.animationsExtendData[i];
        if (element.animName == "" || element.path == "") {
          this.settingData.animationsExtendData.splice(i, 1);
          has = true;
        }
      }
      if (has) {
        this.saveFn();
      }

      this.animate();
    },
    // 改变控制器角色动作
    ChangeAnim(e) {
      _Global.YJ3D.YJController.ChangeAnimDirect(e);
    },
    // 改变当前上传角色动作
    ChangePlayerAnim(animName) {
      console.log(" 切换动作 ", animName);
      let _YJAnimator = this.transformJS.GetComponent("Animator");
      _YJAnimator.ChangeAnim(animName);
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
      this.settingData.weaponData = undefined;
      this.settingData.weapon = undefined;
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    ChangeValue(i, e) {
      let property = this.setting[i].property;
      // return;
      this.setting[i].value = e;
      if (property == "isLoop") {
        this.currentAnimData.isLoop = e;
        // 控制动作
        _Global.YJ3D.YJPlayer.GetAvatar().ChangeAnimIsLoop(this.animName, e);
        //
        let _YJAnimator = this.transformJS.GetComponent("Animator");
        _YJAnimator.ChangeAnimIsLoop(this.animName, e);
      }
      let equipPosIndex = -1;
      if (property == "position") {
        for (let i = 0; i < this.settingData.equipPosList.length; i++) {
          const item = this.settingData.equipPosList[i];
          if (
            item.targetBone == this.boneName &&
            item.weaponType == this.weaponType
          ) {
            item.position = e;
            equipPosIndex = i;
          }
        }
      }
      if (property == "rotation") {
        for (let i = 0; i < this.settingData.equipPosList.length; i++) {
          const item = this.settingData.equipPosList[i];
          if (
            item.targetBone == this.boneName &&
            item.weaponType == this.weaponType
          ) {
            item.rotation = e;
            equipPosIndex = i;
          }
        }
      }
      if (property == "scale") {
        for (let i = 0; i < this.settingData.equipPosList.length; i++) {
          const item = this.settingData.equipPosList[i];
          if (
            item.targetBone == this.boneName &&
            item.weaponType == this.weaponType
          ) {
            item.scale = e;
            equipPosIndex = i;
          }
        }
      }
      if (
        property == "rotation" ||
        property == "position" ||
        property == "scale"
      ) {
        this.transformJS.GetComponent("MeshRenderer")
          .AddWeapon(
            this.weaponData,
            this.settingData.equipPosList[equipPosIndex],
            this.settingData.boneList
          );
      }

      console.log(i + " " + this.setting[i].value, this.animName);
    },
    SetAnimName(anim) {
      this.currentAnimData.isLoop = false;
      this.currentAnimData.path = "";
      this.setting[1].value = false;
      this.setting[0].value = anim.animName;
      this.animName = this.setting[0].value;
      this.currentAnimData.animName = this.animName;
      // console.log("编辑 ",anim);
      if (this.animName == "") {
        return;
      }
      // console.log("编辑 11 ",this.animName,this.modelData,this.modelData.name);

      // 从当前角色的动作中获取
      // this.PlayerAnimData().GetAnimDataByAnimName(this.modelData.folderBase,
      this.PlayerAnimData().GetSingleAnimDataInAvatar(
        this.modelData.message.data,
        this.animName,
        (animData) => {
          this.setting[1].value = animData.isLoop;
          this.currentAnimData.isLoop = this.setting[1].value;
          this.currentAnimData.path = animData.path;
          // console.log("编辑 22 ",animData);

          //npc播放动作
          if (animData.path != "") {
            let _YJAnimator =
            this.transformJS.GetComponent("Animator");
            _YJAnimator.ChangeAnim(this.animName);
          }
        }
      );
    },
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
            // this.PlayerAnimData().AddAllExtendAnimData(this.modelData.folderBase, items);
            this.PlayerAnimData().AddSingleExtendAnimData(
              this.modelData.message.data,
              items
            );

            // 加载动作
            // _Global.YJ3D.YJController.ChangeAnimDirect(this.animName);

            let _YJAnimator =
            this.transformJS.GetComponent("Animator");
            _YJAnimator.ChangeAnim(this.animName);
          }
        }
      });
    },

    ClickUVAnim(i, e) {
      if (this.setting[i].property == "weapon") {
        let sp = this.setting[i].property.split("-");
        if (sp.length == 1) {
          this.settingData[sp[0]] = e;
        } else {
          this.settingData[sp[0]][sp[1]] = e;
        }

        this.Utils.SetSettingItemPropertyValueByProperty(
          this.setting,
          "position",
          "display",
          e != ""
        );
        this.Utils.SetSettingItemPropertyValueByProperty(
          this.setting,
          "rotation",
          "display",
          e != ""
        );
        this.Utils.SetSettingItemPropertyValueByProperty(
          this.setting,
          "scale",
          "display",
          e != ""
        );
        if (e == "") {
          _Global.SendMsgTo3D("取消编辑");
          this.Utils.SetSettingItemByProperty(this.setting,"weapon","");
          this.transformJS.GetComponent("MeshRenderer").RemoveWeapon();
          this.weaponModel = null;

        } else {
          let weaponData = e;
          this.weaponData = e;
          this.boneName = weaponData.message.data.boneName;
          this.weaponType = weaponData.message.data.weaponType;
          this.Utils.SetSettingItemByProperty(
            this.setting,
            "weapon",
            weaponData.icon
          );
          console.log("武器数据 ", e);

          let hasBone = false;
          for (let i = 0; i < this.settingData.boneList.length; i++) {
            const item = this.settingData.boneList[i];
            if (item.targetBone == this.boneName) {
              this.Utils.SetSettingItemByProperty(
                this.setting,
                "position",
                item.position ? item.position : [0, 0, 0]
              );
              this.Utils.SetSettingItemByProperty(
                this.setting,
                "rotation",
                item.rotation ? item.rotation : [0, 0, 0]
              );
              this.Utils.SetSettingItemByProperty(
                this.setting,
                "scale",
                item.scale ? item.scale : [1, 1, 1]
              );
              hasBone = true;
            }
          }
          if (!hasBone) {
            console.error("找不到拾取武器的骨骼");
            return;
          }

          if (!this.settingData.equipPosList) {
            this.settingData.equipPosList = [];
          }
          let has = false;
          let equipData = {};

          for (let i = 0; i < this.settingData.equipPosList.length; i++) {
            const item = this.settingData.equipPosList[i];
            if (
              item.targetBone == this.boneName &&
              item.weaponType == this.weaponType
            ) {
              this.Utils.SetSettingItemByProperty(
                this.setting,
                "position",
                item.position ? item.position : [0, 0, 0]
              );
              this.Utils.SetSettingItemByProperty(
                this.setting,
                "rotation",
                item.rotation ? item.rotation : [0, 0, 0]
              );
              this.Utils.SetSettingItemByProperty(
                this.setting,
                "scale",
                item.scale ? item.scale : [1, 1, 1]
              );
              has = true;
              equipData = item;
            }
          }
          if (!has) {
            equipData = {
              targetBone: this.boneName,
              weaponType: this.weaponType,
              position: [0, 0, 0],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
            };
            this.settingData.equipPosList.push(equipData);
          }
          console.log("equipPosList ", this.settingData.equipPosList);
          //加载武器并让角色使用
          this.transformJS.GetComponent("MeshRenderer")
            .AddWeapon(
              weaponData,
              equipData,
              this.settingData.boneList,
              (weaponModel) => {
                this.weaponModel = weaponModel;
                _Global.YJ3D._YJSceneManager
                  .GetTransformManager()
                  .attach(weaponModel);
              }
            );
        }
        return;
      }
    },
    // 添加骨骼映射角色
    addBoneRefPlayer(item) {
      this.settingData.boneRefPlayer = item.id;
      this.settingData.boneRefPlayerAnimationData = item.animationsExtendData;
      this.settingData.boneList = item.boneList;
      this.settingData.equipPosList = item.equipPosList;
      this.save();
      // 更新 YJPlayerAnimData 中的数据
      // this.PlayerAnimData().UpdateAvatarDataById(this.settingData.id, this.settingData);
      this.modelData.message.data = this.settingData;
      _Global.YJ3D._YJSceneManager
        .GetSingleModelTransform()
        .SetMessage(this.getMessage());
      return;
      let refBonelist = item.message.data.boneList;
      for (let i = 0; i < refBonelist.length; i++) {
        const refbone = refBonelist[i];
        for (let j = 0; j < this.settingData.boneList.length; j++) {
          const element = this.settingData.boneList[j];
          if (element.targetBone == refbone.targetBone) {
            element.refBone = refbone.boneName;
          }
        }
      }
      this.settingData.boneRefPlayerAnimationData =
        item.message.data.animationsExtendData;
      this.save();
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
    saveBone(boneList) {
      this.settingData.boneList = boneList;
      this.save();
    },

    animate() {
      requestAnimationFrame(this.animate);
      if(_Global.YJ3D._YJSceneManager == undefined){
        return;
      } 

      if (this.transformJS) {
        let _YJAnimator = this.transformJS.GetComponent("Animator");
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
      if (
        this.currentAnimData.animName != "" &&
        this.currentAnimData.path != ""
      ) {
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
      }
      if (this.weaponModel) {
          for (let i = 0; i < this.settingData.equipPosList.length; i++) {
            const item = this.settingData.equipPosList[i];
            if (
              item.targetBone == this.boneName &&
              item.weaponType == this.weaponType
            ) {
              item.position = this.v3ToArray(this.weaponModel.position.clone(),1);
              item.rotation = this.v3ToArray(this.weaponModel.rotation.clone(),1);
              item.scale = this.v3ToArray(this.weaponModel.scale.clone(), 100);
              
              this.Utils.SetSettingItemByProperty(this.setting,"scale",item.scale );
              this.Utils.SetSettingItemByProperty(this.setting,"position",item.position );
              this.Utils.SetSettingItemByProperty(this.setting,"rotation",item.rotation );
            }
          }
        }
      // 能保存的情况下，才显示保存按钮
      console.log("角色数据 ", this.settingData);
      this.saveFn();
      // 清空动作上传输入
      // this.SetAnimName("");
    },
    saveFn() {
      // 单品中才有 updateModelTxtData
      if (this.parent.updateModelTxtData) {
        this.parent.modelData.message = this.getMessage();
        this.parent.updateModelTxtData();
        // let animList = this.PlayerAnimData().AddAllExtendAnimData(this.settingData.id, this.settingData.animationsExtendData);
        // let animList = this.PlayerAnimData().AddSingleExtendAnimData(this.getMessage() , this.settingData.animationsExtendData);
        let animList = this.PlayerAnimData().GetAllAnim(this.settingData);

        this.parent.$refs.animPanel.UpdateState(animList);
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
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
          console.log(" 上传 角色动作数据 文件成功 ");
          this.setting[0].value = "";
          this.parent.SetTip("保存成功");
          this.canSave = false;

          // let animList = this.PlayerAnimData().AddAllExtendAnimData(this.modelData.folderBase, this.animListData);
          let animList = this.PlayerAnimData().AddSingleExtendAnimData(
            this.modelData.message.data,
            this.animListData
          );

          // window.location.reload();
        }
      });
    },
  },
};
</script>

<style scoped></style>
