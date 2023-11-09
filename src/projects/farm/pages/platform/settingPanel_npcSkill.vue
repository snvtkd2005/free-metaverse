
<template>
  <!-- 技能面板 -->
  <div class="
              w-80
              max-w-md
               p-2
             text-white 
             rounded-lg
             overflow-hidden 
            ">
    <div class=" flex ">
      <div class=" text-left ">技能设置</div>
      <div class=" text-left w-6 h-6 bg-white flex text-black self-center leading-6 mx-auto cursor-pointer "
        @click="EditorSkillEvent('新建')">
        <div class=" mx-auto">
          +
        </div>
      </div>
    </div>
    <div class="mt-2 gap-3 grid grid-cols-3 flex-row-reverse">
      <div v-for="(item, i) in skillList" :key="i" class=" text-xs  text-left  w-20 h-auto mb-2     ">
        <div class="w-12 h-12 self-center mx-auto cursor-pointer" @click="EditorSkillEvent('读取', item)">
          <img class="w-full h-full object-fill hover:opacity-70"
            :src="this.$uploadUrl + this.folderBase + '/' + item.icon" />
        </div>
        <div class="mt-2 w-28 truncate px-2 flex text-sm justify-between ">
          <text>{{ item.name }}</text>
        </div>
        <div class="mt-2 px-2 flex text-xs justify-between">
          <div class="cursor-pointer" @click="EditorSkillEvent('编辑', item, i)">{{ UIData.base.editor }}</div>
          <div class="cursor-pointer" @click="EditorSkillEvent('删除', item, i)">{{ UIData.base.delete }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 技能添加弹窗 -->
  <div v-if="inAddSkill" class=" text-white bg-black bg-opacity-40   ">

    <div v-for="(item, i) in skillFrom" :key="i" class=" 
               text-xs  text-left flex w-80 px-4 py-2 h-auto mb-2     ">
      <div class=" self-center w-40  truncate">
        {{ item.title }}
      </div>
      <div class=" self-center  ">

        <div v-if="item.type == 'upload'" class=" relative flex  gap-2 cursor-pointer  ">
          <div v-if="item.value != ''" class=" bg-black" @click="ChangeAnimBySkill(setting)">
            <img class=" w-12 h-12 " :src="this.$uploadUrl + this.folderBase + '/' + item.value" alt="">
          </div>
          <el-upload class="bg-transparent" action="" :before-upload="handleBeforeUpload_skillicon" :accept="acceptImage"
            :show-file-list="false">
            <div class="p-2 w-20 cursor-pointer bg-gray-500
            hover:bg-546770" @click="UploadSkillClick(item)">上传</div>
          </el-upload>
        </div>

        <div v-if="item.type == 'text'" class=" w-20 h-4 text-black ">
          <YJinput_text class=" w-20 h-4 " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'drop'" class=" w-20 h-16 text-black ">
          <YJinput_drop class=" w-32 h-16 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>

      </div>

    </div>
    <div class=" w-40 mx-auto flex justify-between ">
      <div class="  cursor-pointer bg-black opacity-75 p-2 " @click="SkillFloatEvent('保存')">保存</div>
      <div class="  cursor-pointer bg-black opacity-75 p-2 " @click="SkillFloatEvent('取消')">取消</div>
    </div>
  </div>

  <div>

  </div>
</template>

<script>

import YJinput_color from "./components/YJinput_color.vue";
import YJinput_range from "./components/YJinput_range.vue";
import YJinput_number from "./components/YJinput_number.vue";
import YJinput_text from "./components/YJinput_text.vue";
import YJinput_toggle from "./components/YJinput_toggle.vue";
import YJinput_drop from "./components/YJinput_drop.vue";
import YJinput_vector3 from "./components/YJinput_vector3.vue";


import { UploadFile, UploadSkill, UploadPlayerFile } from "../../js/uploadThreejs.js";

export default {
  name: "settingpanel_npcSkill", //npc技能
  components: {
    YJinput_color,
    YJinput_range,
    YJinput_number,
    YJinput_text,
    YJinput_toggle,
    YJinput_drop,
    YJinput_vector3,
  },
  data() {
    return {
      canSave: false,
      // 添加技能窗口
      inAddSkill: false,
      animList: [],
      animListData: [
        // { animName: "shooting",path:"anim.json",icon:""},
      ],
      settingData: {},

      skillFrom: [
        { property: "skillName", title: "技能名", type: "text", value: "", callback: this.ChangeValue },
        { property: "icon", title: "图标", type: "upload", value: "", callback: this.ChangeValue },
        { property: "animList", title: "动作", type: "drop", value: "none", options: [], callback: this.ChangeValue },
      ],
      skillList: [
        // {
        //   name: "挥剑", icon: "", animList: [
        //     { animName: "shooting", path: "anim.json", icon: "" }
        //   ]
        // },
      ],
    };
  },
  created() {

  },
  mounted() {
    setTimeout(() => {
      this.initValue();
    }, 1000);

  },
  methods: {
    ClickBtnHandler(e) {


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
      this.$parent.removeThreeJSfocus();
    },
    addThreeJSfocus() {
    },

    GetAnimList() {
      let _animList = _Global.animList;
      this.animList = [];
      for (let i = 0; i < _animList.length; i++) {
        const element = _animList[i];
        this.animList.push({ value: element.animName, label: element.content });
      }
      this.skillFrom[2].options = this.animList;
    },
    initValue() {
      this.folderBase = this.$parent.folderBase;
      this.settingData = this.$parent.settingData;
      if (this.$parent.pointType == "npc") {
        this.folderBase = this.settingData.id;
        if (this.settingData.skillList == undefined) {
          this.settingData.skillList = [];
        }
        this.skillList = this.settingData.skillList;
      } else {

      }

      if (this.settingData.skillList == undefined) {
        this.settingData.skillList = [];
      }
      this.skillList = this.settingData.skillList;

      if (this.animList.length == 0) {
        this.GetAnimList();
      }
    },

    // 点击技能图标播放动画
    ChangeAnimBySkill(item) {
      this.ChangeAnim(item.setting[2].value);
    },
    ChangeValue(i, e) {
      console.log(i, e);
      this.skillFrom[i].value = e;
      if (this.skillFrom[i].property == "animList") {
        this.ChangeAnim(e);
      }
    },
    // 改变控制器角色动作
    ChangeAnim(e) {
      // _Global.YJ3D.YJController.SetPlayerAnimName(e);
      let _YJAnimator = _Global.YJ3D._YJSceneManager
        .GetSingleTransformComponent("Animator");
      _YJAnimator.ChangeAnim(e);
    },

    SkillFloatEvent(e) {
      if (e == "保存") {
        this.saveSkill();
      }
      if (e == "取消") {
        this.inAddSkill = false;
      }
    },
    EditorSkillEvent(e, item, i) {
      if (e == "读取") {
        this.ChangeAnim(item.animList[0].animName);
      }
      if (e == "新建") {
        this.editorSkillIndex = -1;
        this.inAddSkill = true;
        this.skillFrom[0].value = "";
        this.skillFrom[1].value = "";
        this.skillFrom[2].value = "";
        //如果是npc，则关闭npc的巡逻动作
        if (this.$parent.pointType == "npc") {
          this.$parent.ClickHandler("停止巡逻");
        }
      }
      if (e == "编辑") {
        this.editorSkillIndex = i;
        this.inAddSkill = true;
        this.skillFrom[0].value = item.name;
        this.skillFrom[1].value = item.icon;
        this.skillFrom[2].value = item.animList[0].animName;
      }
      if (e == "删除") {
        // 技能名为空时，运行删除
        if (item.name == "") {
          this.skillList.splice(i, 1);
          this.saveSkill();
        }
      }
    },
    saveSkill() {
      if (this.inAddSkill) {
        if (this.editorSkillIndex == -1) {
          this.skillList.push({
            name: this.skillFrom[0].value, icon: this.skillFrom[1].value, animList: [
              { animName: this.skillFrom[2].value }
            ]
          });
        } else {
          this.skillList[this.editorSkillIndex].name = this.skillFrom[0].value;
          this.skillList[this.editorSkillIndex].icon = this.skillFrom[1].value;
          this.skillList[this.editorSkillIndex].animList[0].animName = this.skillFrom[2].value;
        }
      }
      this.settingData.skillList = this.skillList;
      this.inAddSkill = false;
    },
    UploadSkillClick(item) {
      this.skill = item;
      console.log("  this.skill ", this.skill);
    },
    handleBeforeUpload_skillicon(file) {
      this.UploadFiles_skillicon(file);
    },
    async UploadFiles_skillicon(file) {
      this.loading = true;
      this.hasModel = false;
      let fromData = new FormData();
      fromData.append("fileToUpload", file);
      fromData.append("folderBase", this.folderBase);

      let fileName = file.name;

      // let sp = file.name.split('.');
      // let fileName = sp[0] + new Date().getTime()+ '.' + sp[1];
      // fromData.append("fileName", fileName );
      //上传到本地 或 0SS
      UploadFile(fromData).then((res) => {
        console.log(" 上传文件 ", res);
        if (res.data == "SUCCESS") {
          this.skill.value = fileName;
        }
        // if (res.status == 200) {
        // }
        // //先记录旧照片
        // console.log("上传文件后的返回值", url);
      });
    },
    save() {

    },

  },
};
</script>

<style scoped></style>
