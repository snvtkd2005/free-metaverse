
<template>
  <!-- 技能面板 -->
  <div class="
              w-full
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
      <div v-for="(item, i) in skillList" :key="i" class=" relative text-xs  text-left  w-20 h-auto mb-2     ">
        <div class="w-12 h-12 self-center mx-auto " @mouseenter="skillHover = i">
          <img class="w-full h-full object-fill hover:opacity-70" :src="this.$uploadUVAnimUrl + item.icon" />
        </div>
        <div class="mt-2 w-28 truncate px-2 flex text-sm justify-between ">
          <text>{{ item.skillName }}</text>
        </div>
        <div class="mt-2 px-2 flex text-xs justify-between">
          <div class="cursor-pointer" @click="EditorSkillEvent('编辑', item, i)">{{ UIData.base.editor }}</div>
          <div class="cursor-pointer" @click="EditorSkillEvent('删除', item, i)">{{ UIData.base.delete }}</div>
        </div>
        <div v-if="skillHover == i" @mouseleave="skillHover = -1"
          class=" p-1 text-xs bg-black bg-opacity-70 absolute left-0 top-0 w-full h-full">
          <div>{{ item.describe }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 技能编辑弹窗 -->
  <skillItemEditorPanel ref="skillItemEditorPanel"></skillItemEditorPanel>


  <div>

  </div>
</template>

<script>
 
import skillItemEditorPanel from "../panels/skillItemEditorPanel.vue";

import { UploadFile, UploadSkill, UploadPlayerFile } from "../../../js/uploadThreejs.js";

export default {
  name: "settingpanel_npcSkill", //npc技能
  components: { 
    skillItemEditorPanel,
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
      skillList: [],
      skillHover: -1,
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
    AddSkill(skill) {
      this.skillList.push(skill);
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

    initValue() {
      this.settingData = this.$parent.settingData;
      if (this.settingData.skillList == undefined) {
        this.settingData.skillList = [];
      }
      this.skillList = this.settingData.skillList;

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
      // _Global.YJ3D.YJController.ChangeAnimDirect(e);
      let _YJAnimator = _Global.YJ3D._YJSceneManager
        .GetSingleTransformComponent("Animator");
      _YJAnimator.ChangeAnim(e);
    },
 
    EditorSkillEvent(e, item, i) {
 
      if (e == "新建") {
        this.$parent.$parent.$refs.skillSelectPanel.SetVisible(true);
        //如果是npc，则关闭npc的巡逻动作
        // if (this.$parent.pointType == "npc") {
        //   this.$parent.ClickHandler("停止巡逻");
        // }
      }
      if (e == "编辑") {
        this.editorIndex = i;
        this.inAddSkill = true;
         
        this.$refs.skillItemEditorPanel.dialogTitle = "编辑技能";
        this.$refs.skillItemEditorPanel.initValue(JSON.parse(JSON.stringify(item)));
      }
      if (e == "删除") {
        this.skillList.splice(i, 1);
        this.saveSkill();
      }
    },
    saveSkill(settingData) {
      if (this.inAddSkill) {
        if (this.editorIndex == -1) {
        } else {
          this.skillList[this.editorIndex] = settingData;
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
