
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
          <el-upload ref="uploadAnimBtn" class="bg-transparent" action="" :before-upload="handleBeforeUpload" :accept="accept"
            :show-file-list="false">
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


    <div class=" mt-10 w-80 h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">{{ loadContent }}</div>
    </div>
    <div class=" w-80 h-10 text-white cursor-pointer " @click="download()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">下载模型</div>
    </div>
    <div v-if="canSave" class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="save()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>

    <!-- <div class=" mt-4 flex h-16 ">
      <div class="  self-center ">
        用户上传的动作
      </div>
      <YJinput_drop class=" self-center ml-2 w-32  " :value="animValue" :options="animList" :callback="ChangeAnim" />
    </div> -->

  </div>

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
          <img class="w-full h-full object-fill hover:opacity-70" :src="item.icon" />
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
          <div v-if="item.value!=''" class=" bg-black" @click="ChangeAnimBySkill(setting)">
            <img class=" w-12 h-12 " :src="item.value" alt="">
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

import settingPanel_avatar from "./settingPanel/settingPanel_avatar.vue";

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
  },
  data() {
    return {
      canSave: false,
      // 添加技能窗口
      inAddSkill: false,
      animListData: [
        // { animName: "shooting",path:"anim.json",icon:""},
      ],

      setting: [
        { property: "animName", title: "动作名", type: "text", value: "", callback: this.ChangeValue },
        { property: "isLoop", title: "是否循环", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "path", title: "动作(上传记录动作信息的json文件)", type: "upload", value: "none", callback: this.ChangeValue },

      ],

      animName: "",

      animValue: "none",
      animList: [{ value: 'none', label: 'none' }],

      // 动作数据
      accept: ".json,.fbx",
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


      skillFrom: [
        { property: "skillName", title: "技能名", type: "text", value: "", callback: this.ChangeValueSkill },
        { property: "icon", title: "图标", type: "upload", value: "", callback: this.ChangeValueSkill },
        { property: "animList", title: "动作", type: "drop", value: "none", options: [], callback: this.ChangeValueSkill },
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


    // _Global.SendMsgTo3D("添加组件", { component: "car", data: this.carData });
    this.modelData = JSON.parse(localStorage.getItem("modelData"));
    this.folderBase = this.modelData.folderBase;

    // this.folderBase = "farmplayer";
    console.log("modelData in playerPanel " , this.modelData);
    this.initValue();
 

  },
  methods: {
    SetAvatar(avatar) {
      this.$refs.settingPanel_avatar.SetAvatar(avatar);
    },
    download(){},
    removeThreeJSfocus() {
      this.$parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { 
    },
    SetAnimList(_animList) {
      this.animList = [];
      for (let i = 0; i < _animList.length; i++) {
        const element = _animList[i];
        this.animList.push({ value: element, label: element });
      }

      this.skillFrom[2].options = this.animList;
    },
    SetSkillList(_skillList) {
      for (let i = 0; i < _skillList.length; i++) {
        this.skillList.push(_skillList[i]);
      }
    },
    async initValue() {
      return;
      let res = await this.$axios.get(
        this.$uploadPlayerUrl + this.folderBase + "/" + this.folderBase + "_data.txt" + "?time=" + new Date().getTime()
      );
      this.animListData = res.data;

      console.log(this.animListData);
      let animList = _Global.YJ3D._YJSceneManager.CreateOrLoadPlayerAnimData().AddAllExtendAnimData("小孩", this.animListData);
      this.SetAnimList(animList);
      res = await this.$axios.get(
        this.$uploadPlayerUrl + this.folderBase + "/" + this.folderBase + "_skill_data.txt" + "?time=" + new Date().getTime()
      );
      console.log(" _skill_data res ", res);
      this.SetSkillList(res.data);
    },
    // 点击技能图标播放动画
    ChangeAnimBySkill(item) {
      this.ChangeAnim(item.setting[2].value);
    },
    ChangeValueSkill(i, e) {
      console.log(i, e);
      this.skillFrom[i].value = e;
      if (this.skillFrom[i].property == "animList") {
        this.ChangeAnim(e);
      }
    },
    ChangeAnim(e) {
      _Global.YJ3D.YJController.SetPlayerAnimName(e);
    },
    load() {
      console.log(" 打开动作列表 ");
      this.$parent.$refs.animPanel.SetVisible(true,this.modelData.name);
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
      }
      console.log(i + " " + this.setting[i].value);
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
      let s = JSON.stringify(this.skillList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append(
        "fileToUpload",
        this.$stringtoBlob(s, this.folderBase + "_skill_data.txt")
      );
      fromData.append("folderBase", this.folderBase);
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 角色 技能数据 文件成功 ");
          this.inAddSkill = false;
        }
      });
    },
    UploadSkillClick(item) {
      this.skill = item;
      console.log("  this.skill ", this.skill);
    },
    handleBeforeUpload_skillicon(file) {
      this.fileList.push(file);
      console.log(file);
      this.UploadFiles_skillicon(this.fileList[0]);
    },
    async UploadFiles_skillicon(file) {
      this.loading = true;
      this.hasModel = false;
      let fromData = new FormData(); 
      fromData.append("fileToUpload", file); 
      fromData.append("folderBase", "");


      let sp = file.name.split('.');
      let fileName = sp[0] + new Date().getTime();
      fromData.append("fileName", fileName + '.' + sp[1]);
      //上传到本地 或 0SS
      UploadSkill(fromData).then((res) => {
        console.log(" 上传文件 ", res);


        if (res.data.state == "SUCCESS") {
          this.fileList.shift();
          this.skill.value = this.$uploadSkillUrl + res.data.data.filePath;
        }
        // if (res.status == 200) {
        // }
        // //先记录旧照片
        // console.log("上传文件后的返回值", url);
      });
    },
    SetAnimName(v){
      this.setting[0].value = v;
      this.animName = this.setting[0].value; 
    },
    handleBeforeUpload(file) {
      this.animName = this.setting[0].value;
      if (this.animName == "") {
        this.$parent.SetTip("请先输入动作名");
        return;
      }

      // 还要验证文件名是否已存在，如果已存在要提示
      let fileName = file.name;
      for (let i = 0; i < this.animListData.length; i++) {
        const element = this.animListData[i];
        if (element.animName == this.animName) {
          this.$parent.SetTip("动作名重复，请重命名");
          return;
        }
        if (element.path == fileName) {
          this.$parent.SetTip("json文件已存在，请重命名后上传");
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

      UploadPlayerFile(fromData).then((res) => {
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
            this.currentAnimData.animName = this.animName;
            this.currentAnimData.path = fileName;
            let items = [this.currentAnimData];
            _Global.YJ3D._YJSceneManager.CreateOrLoadPlayerAnimData().AddAllExtendAnimData(this.modelData.name, items);
            // 加载动作
            _Global.YJ3D.YJController.SetPlayerAnimName(this.animName);

          }
        }
      });
    },

    save() {
      // 能保存的情况下，才显示保存按钮
      this.animListData.push(this.currentAnimData);
      this.Update();

    },

    Update() {
      let s = JSON.stringify(this.animListData);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append(
        "fileToUpload",
        this.$stringtoBlob(s, this.folderBase + "_data.txt")
      );
      fromData.append("folderBase", this.folderBase);
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 角色动作数据 文件成功 ");
          this.setting[0].value = "";
          this.$parent.SetTip("保存成功");
          this.canSave = false;

          let animList = _Global.YJ3D._YJSceneManager.CreateOrLoadPlayerAnimData().AddAllExtendAnimData(this.modelData.name, this.animListData);
          this.SetAnimList(animList);
          // window.location.reload();
        }
      });

    },
  },
};
</script>

<style scoped></style>
