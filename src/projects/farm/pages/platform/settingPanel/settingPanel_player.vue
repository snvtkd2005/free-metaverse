
// 角色设置
<template>
  <settingPanel_avatar ref="settingPanel_avatar" />

  <!-- 角色设置面板 -->
  <div class="
              w-full
              max-w-md
               p-2
             text-white 
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">添加动作</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex justify-between w-80 h-auto mb-2     ">
      <div class=" self-center w-48  truncate">
        {{ item.title }}
      </div>
      <div class=" self-center w-20 ">
        <div v-if="item.type == 'color'" class=" flex gap-2 ">
          <YJinput_color :value="item.value" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'file'" class=" relative flex  gap-2 cursor-pointer  " @click="SelectFile(item, i)">
          <div>{{ item.url }}</div>
          <div class=" absolute right-0 w-auto h-6 rounded-sm bg-gray-50 flex">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'upload'" class=" relative flex  gap-2 cursor-pointer  ">
          <div>{{ item.url }}</div>
          <el-upload ref="uploadAnimBtn" class="bg-transparent" action="" :before-upload="handleBeforeUpload"
            :accept="accept" :show-file-list="false">
            <div class="p-2 w-20 cursor-pointer bg-gray-500
            hover:bg-546770">上传</div>
          </el-upload>
        </div>

        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <!-- <input id="body-num" type="number" :value="item.value"> -->
          <YJinput_number :value="item.value" :step="item.step" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'slider'" class=" flex gap-2 ">
          <!-- <input id="body-slider" type="range" :value="item.value" :step="item.step" :min="item.min" :max="item.max"> -->
          <YJinput_range :value="item.value" :step="item.step" :min="item.min" :max="item.max"
            :callback="item.callback" />
          <div>{{ item.value }}</div>
        </div>

        <div v-if="item.type == 'toggle'" class=" w-4 h-4 ">
          <YJinput_toggle class=" w-4 h-4 " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'text'" class=" w-20 h-4 text-black ">
          <YJinput_text class=" w-20 h-4 " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'drop'" class=" w-20 h-16 text-black ">
          <YJinput_drop class=" w-32 h-16 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>

        <div v-if="item.type == 'vector3'" class=" w-auto h-6 text-black ">
          <YJinput_vector3 class=" w-auto h-6 " :value="item.value" :step="item.step" :index="i"
            :callback="item.callback" />
        </div>

      </div>
      <div class=" self-center ml-2 w-4  truncate">
        {{ item.unit }}
      </div>

    </div>


    <!-- <div class=" mt-4 flex h-16 ">
      <div class="  self-center ">
        用户上传的动作
      </div>
      <YJinput_drop class=" self-center ml-2 w-32  " :value="animValue" :options="animList" :callback="ChangeAnim" />
    </div> -->

  </div>

  <div class=" w-80 h-10 text-white cursor-pointer " @click="ClickBtnHandler('选择可映射角色')">
    <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">映射到同骨骼角色动画</div>
  </div>
  
  <div v-if="settingData.boneRefPlayer!=''" class=" w-80 h-10 text-white cursor-pointer " @click="ClickBtnHandler('清除角色映射')">
    <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">清除角色映射</div>
  </div>
  
  <div class=" hidden w-80 h-10 text-white cursor-pointer " @click="ClickBtnHandler('骨骼映射面板')">
    <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">打开角色骨骼映射面板</div>
  </div>
  <div class=" w-80 h-10 text-white cursor-pointer " @click="ClickBtnHandler('动作列表')">
    <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">查看已有动作</div>
  </div>
  <div class=" w-80 h-10 text-white cursor-pointer " @click="ClickBtnHandler('下载模型')">
    <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">下载模型</div>
  </div>
  <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="ClickBtnHandler('保存')">
    <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
  </div>
  <div>

    <settingPanel_npcSkill ref="settingPanel_npcSkill" />

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



import YJinput_color from "../components/YJinput_color.vue";
import YJinput_range from "../components/YJinput_range.vue";
import YJinput_number from "../components/YJinput_number.vue";
import YJinput_text from "../components/YJinput_text.vue";
import YJinput_toggle from "../components/YJinput_toggle.vue";
import YJinput_drop from "../components/YJinput_drop.vue";
import YJinput_vector3 from "../components/YJinput_vector3.vue";
import settingPanel_npcSkill from "./settingPanel_npcSkill.vue";

import settingPanel_avatar from "./settingPanel_avatar.vue";

import { UploadFile, UploadSkill, UploadPlayerFile } from "../../../js/uploadThreejs.js";

export default {
  name: "settingpanel_player",
  components: {
    settingPanel_avatar,
    YJinput_color,
    YJinput_range,
    YJinput_number,
    YJinput_text,
    YJinput_toggle,
    YJinput_drop,
    YJinput_vector3,
    settingPanel_npcSkill,
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
      },

      setting: [
        { property: "animName", title: "动作名", type: "text", value: "", callback: this.ChangeValue },
        { property: "isLoop", title: "是否循环", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "path", title: "动作(记录动作信息的json或fbx文件)", type: "upload", value: "none", callback: this.ChangeValue },
        // { property: "path", title: "动作(上传记录动作信息的json文件)", type: "upload", value: "none", callback: this.ChangeValue },

      ],

      animName: "",

      animValue: "none",
      animList: [{ value: 'none', label: 'none' }],

      // 动作数据
      accept: ".json,.fbx",
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
  },
  methods: {
    ClickBtnHandler(e) {

      if (e == "选择可映射角色") {
        // 只有骨骼相同，且有扩展动作的角色，才允许被映射
        // this.parent.$refs.modelSelectPanel.Init("角色模型");
        this.parent.$refs.modelSelectPanel.RequestProjectionPlayer(this.settingData);
      }
      if (e == "保存") {
        this.$refs.settingPanel_avatar.save();
        this.save();
      }
      if (e == "下载模型") {
        this.download();
      }
      if (e == "动作列表") {
        console.log(" 打开动作列表 ");
        this.parent.$refs.animPanel.SetVisible(true, this.settingData.id);
      }
      if (e == "骨骼映射面板") {
        let bones = _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("MeshRenderer").GetAllBone();
        this.parent.$refs.boneConvertPanel.SetVisible(true, bones, this.settingData.boneList);
      }
      if (e == "清除角色映射") {
        this.settingData.boneRefPlayer ="";
        this.settingData.boneRefPlayerAnimationData = [];
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
    download() { },
    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() {
    }, 
    PlayerAnimData() {
      return _Global.CreateOrLoadPlayerAnimData();
    },
    async initValue() { 
    }, 
    // 改变控制器角色动作
    ChangeAnim(e) {
      _Global.YJ3D.YJController.ChangeAnimDirect(e);
    },
    // 改变当前上传角色动作
    ChangePlayerAnim(animName) {
      console.log(" 切换动作 ",animName);
      let _YJAnimator = _Global.YJ3D._YJSceneManager
        .GetSingleTransformComponent("Animator");
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
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    Init(_carData) {
      this.carData = _carData;
    },
    ChangeValue(i, e) {

      // return;
      this.setting[i].value = e;
      if (this.setting[i].property == "isLoop") {
        this.currentAnimData.isLoop = e;
        // 控制动作
        _Global.YJ3D.YJPlayer.GetAvatar().ChangeAnimIsLoop(this.animName, e);
        //
        let _YJAnimator = _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("Animator");
        _YJAnimator.ChangeAnimIsLoop(this.animName, e);

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
      this.PlayerAnimData().
        GetAnimDataByAnimName(this.modelData.name, this.animName, (animData) => {
          this.setting[1].value = animData.isLoop;
          this.currentAnimData.isLoop = this.setting[1].value;
          this.currentAnimData.path = animData.path;
          //npc播放动作
          if (animData.path != "") {
            let _YJAnimator = _Global.YJ3D._YJSceneManager
              .GetSingleTransformComponent("Animator");
            _YJAnimator.ChangeAnim(this.animName);
          }
        });


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
            this.PlayerAnimData().AddAllExtendAnimData(this.modelData.name, items);
            // 加载动作
            // _Global.YJ3D.YJController.ChangeAnimDirect(this.animName);

            let _YJAnimator = _Global.YJ3D._YJSceneManager
              .GetSingleTransformComponent("Animator");
            _YJAnimator.ChangeAnim(this.animName);
          }
        }
      });
    },

    // 添加骨骼映射角色
    addBoneRefPlayer(item) {
      this.settingData.boneRefPlayer = item.id;
      this.settingData.boneRefPlayerAnimationData = item.animationsExtendData;
      this.save();
      // 更新 YJPlayerAnimData 中的数据
      this.PlayerAnimData().UpdateAvatarDataById(this.settingData.id, this.settingData);

      _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform().SetMessage(this.getMessage());
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
      this.settingData.boneRefPlayerAnimationData = item.message.data.animationsExtendData;
      this.save();
    },

    removeAnim(_animName){
      let has = false;
      for (let i = this.settingData.animationsExtendData.length-1;!has && i >=0 ; i--) {
        const element = this.settingData.animationsExtendData[i];
        console.log(element.animName +' ---> '+ _animName + " = " + (element.animName == _animName));
        if (element.animName == _animName) {
          this.settingData.animationsExtendData.splice(i,1);
          has = true;
        }
      } 
    },
    saveBone(boneList) {
      this.settingData.boneList = boneList;
      this.save();
    },
    save() {

      if (this.settingData.animationsExtendData == undefined) {
        this.settingData.animationsExtendData = [];
      }
      console.log("添加新动作 11 ",this.currentAnimData.animName , this.animName);

      let has = false;
      for (let i = 0; i < this.settingData.animationsExtendData.length && !has; i++) {
        const element = this.settingData.animationsExtendData[i];
        console.log(element.animName +' ---> '+ this.animName + " = " + (element.animName == this.animName));
        if (element.animName == this.animName) {
          element.path = this.currentAnimData.path;
          element.isLoop = this.currentAnimData.isLoop;
          has = true;
        }
      }
      this.currentAnimData.animName = this.animName;
      if (!has) {
        console.log("添加新动作 22", this.animName);
        this.settingData.animationsExtendData.push(JSON.parse(JSON.stringify(this.currentAnimData)));
      }

      // 能保存的情况下，才显示保存按钮
      console.log("角色数据 ", this.settingData);
      // 单品中才有 updateModelTxtData
      if (this.parent.updateModelTxtData) {
        this.parent.modelData.message = this.getMessage();
        this.parent.updateModelTxtData();
        let animList = this.PlayerAnimData().AddAllExtendAnimData(this.settingData.id, this.settingData.animationsExtendData);
        this.parent.$refs.animPanel.UpdateState(animList);

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
      fromData.append(
        "fileToUpload",
        this.$stringtoBlob(s, "data.txt")
      );
      fromData.append("folderBase", this.folderBase);
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 角色动作数据 文件成功 ");
          this.setting[0].value = "";
          this.parent.SetTip("保存成功");
          this.canSave = false;

          let animList = this.PlayerAnimData().AddAllExtendAnimData(this.modelData.name, this.animListData);
          // window.location.reload();
        }
      });

    },
  },
};
</script>

<style scoped></style>
