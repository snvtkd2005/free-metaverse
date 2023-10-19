
// 模型库
<template>
  <!-- 模型库 模型列表选择 -->
  <div v-if="isOpen" class="
      absolute
      w-full
      h-full
      flex 
      text-white 
      overflow-hidden
     pointer-events-none
    ">
    <div class=" absolute bottom-0 mx-auto w-1/2 h-1/2 p-2 bg-gray-100 
      rounded-tr-lg rounded-tl-lg pointer-events-auto ">

      <!-- 技能面板 -->
      <div class="
              w-full 
             text-gray-500 
             rounded-lg 
             relative
            ">
        <div class=" flex ">
          <div class=" text-left ">统一动作</div>
          <div class=" text-left w-6 h-6 bg-white flex text-black self-center leading-6 mx-auto cursor-pointer "
            @click="EditorSkillEvent('新建')">
            <div class=" mx-auto">
              +
            </div>
          </div>
        </div>
        <div class="mt-2 overflow-y-scroll h-96  ">
          <div v-for="(item, i) in animList" :key="i" class=" flex  text-base  text-left  h-auto mb-2     ">
            <div class=" hidden w-12 h-12 self-center mx-auto cursor-pointer" @click="EditorSkillEvent('读取', item)">
              <!-- <img class="w-full h-full object-fill hover:opacity-70" :src="item.icon" /> -->
            </div>
            <div class=" w-1/3  truncate   flex  justify-between " :class="item.has ? ' cursor-pointer text-green-500 ' : ''"
              @click="ChangeAnim(item.animName)">
              <text>{{ item.animName }}</text>
            </div>
            <div class="  w-1/3 truncate   flex  justify-between ">
              <text>{{ item.content }}</text>
            </div>


            <div class=" hidden w-10 truncate   flex  justify-between ">
              <text>{{ item.has ? '有' : '没有' }}</text>
            </div>

            <div class=" w-10 flex text-sm  justify-between">
              <div class="cursor-pointer bg-gray-100 " @click="EditorSkillEvent('编辑', item, i)">{{ UIData.base.editor }}
              </div>
            </div>

            <div v-if="!item.has" class="  w-12 cursor-pointer text-white bg-gray-500
            hover:bg-546770" @click="EditorSkillEvent('上传', item, i)">去上传</div>
          </div>
        </div>
        <div class=" absolute -right-5 -top-5 rounded-full w-10 h-10 bg-white text-black flex cursor-pointer "
          @click="isOpen = false;">
          <div class=" self-center mx-auto ">X</div>
        </div>
      </div>

      <!-- 技能添加弹窗 -->
      <div v-if="inAdd" class=" absolute top-0 right-0 text-white bg-black bg-opacity-40   ">

        <div v-for="(item, i) in skillFrom" :key="i" class=" 
               text-xs  text-left flex w-80 px-4 py-2 h-auto mb-2     ">
          <div class=" self-center w-40  truncate">
            {{ item.title }}
          </div>
          <div class=" self-center  ">
            <div v-if="item.type == 'text'" class=" w-auto h-4 text-black ">
              <YJinput_text class=" w-auto h-4 " :value="item.value" :index="i" :callback="item.callback" />
            </div>
          </div>

        </div>
        <div class=" w-40 mx-auto flex justify-between ">
          <div class="  cursor-pointer bg-black opacity-75 p-2 " @click="SkillFloatEvent('保存')">保存</div>
          <div class="  cursor-pointer bg-black opacity-75 p-2 " @click="SkillFloatEvent('取消')">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import YJinput_text from "./components/YJinput_text.vue";
import { GetAllModel, UploadPlayerFile } from "../../js/uploadThreejs.js";

export default {
  name: "index",

  components: {
    YJinput_text,
  },
  data() {
    return {
      isOpen: false,
      inAdd: false,
      modelPos: { x: 0, y: 0 },
      selectModelItem: { name: "" },
      // 选项缩略图
      animList: [
        { animName: "idle", content: "待机", has: true },
        { animName: "walk", content: "走", has: false },
        { animName: "run", content: "跑", has: false },
        { animName: "jump", content: "跳", has: false },
      ],

      skillFrom: [
        { property: "animName", title: "动作名（英文）:", type: "text", value: "", callback: this.ChangeValue },
        { property: "content", title: "动作描述:", type: "text", value: "", callback: this.ChangeValue },
      ],
      path: "",
      model: null,
      inEditor: false,
      modelItem: null,

      uploadUrl: "",

      avatarName:"",
    };
  },
  created() { },
  mounted() {
    this.path = this.$uploadUrl;

    this.folderBase = "";


  },
  methods: {
    SetVisible(b, avatarName) {
      this.isOpen = b;
      if (b) {
        this.initValue(avatarName);
      }
    },

    async initValue(avatarName) {
      this.avatarName = avatarName;
      let res = await this.$axios.get(
        this.$uploadPlayerUrl + "anim_data.txt" + "?time=" + new Date().getTime()
      );
      console.log(" anim_data res ", res);
      this.animList = res.data;

      //获取当前角色已存在的动作
      _Global.CreateOrLoadPlayerAnimData().GetAllAnim(avatarName, (temp) => {
        console.log(avatarName, temp);
        for (let i = 0; i < this.animList.length; i++) {
          const anim = this.animList[i];
          anim.has = false;
          for (let j = 0; j < temp.length; j++) {
            const element = temp[j];
            if (element == anim.animName) {
              anim.has = true;
            }
          }
        }
      });

      // this.SetSkillList(res.data);
    },
    ChangeAnim(animName) {
      let _YJAnimator = this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager
        .GetSingleModelTransform()
        .GetComponent("Animator");
      let has = _YJAnimator.ChangeAnim(animName);
      if (!has) {
        //扩展动作
        _Global.CreateOrLoadPlayerAnimData().GetExtendAnim(this.avatarName, animName, (isLoop, anim) => {
          _YJAnimator.ChangeAnimByAnimData(animName, isLoop, anim);
        });
      }

    },

    ChangeValue(i, e) {
      console.log(i, e);
      this.skillFrom[i].value = e;
    },
    SkillFloatEvent(e) {
      if (e == "保存") {
        this.saveSkill();
      }
      if (e == "取消") {
        this.inAdd = false;
      }
    },
    EditorSkillEvent(e, item, i) {
      console.log(e, item, i);
      if (e == "上传") {
        this.$parent.$refs.settingPanel_player.SetAnimName(item.animName);
        this.isOpen = false;
        return;
      }
      if (e == "读取") {
        this.ChangeAnim(item.animList[0].animName);
      }
      if (e == "新建") {
        this.editorIndex = -1;
        this.inAdd = true;
        this.skillFrom[0].value = "";
        this.skillFrom[1].value = "";
      }
      if (e == "编辑") {
        this.editorIndex = i;
        this.inAdd = true;
        this.skillFrom[0].value = item.animName;
        this.skillFrom[1].value = item.content;
      }
      if (e == "删除") {
        // 技能名为空时，运行删除
        if (item.name == "") {
          this.animList.splice(i, 1);
          this.saveSkill();
        }
      }
    },
    saveSkill() {
      if (this.inAdd) {
        if (this.editorIndex == -1) {
          this.animList.push({
            animName: this.skillFrom[0].value, content: this.skillFrom[1].value
          });
        } else {
          this.animList[this.editorIndex].animName = this.skillFrom[0].value;
          this.animList[this.editorIndex].content = this.skillFrom[1].value;
        }
      }
      let s = JSON.stringify(this.animList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append(
        "fileToUpload",
        this.$stringtoBlob(s, "anim_data.txt")
      );
      fromData.append("folderBase", this.folderBase);
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 角色 技能数据 文件成功 ");
          this.inAdd = false;
        }
      });
    },


    async RequestGetAllModel() {
      if (this.modelsList.length > 0) {
        return;
      }
      GetAllModel().then((res) => {
        console.log("获取所有单品模型 ", res);
        //先记录旧照片
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
            if (item.modelType == this.selectModelTable) {
              this.modelsList.push(item);
            }
          }

          console.log("获取 所有 角色模型 ", this.modelsList);
        }
      });
    },
    //#region 模型库
    //切换模型table
    SelectTable(e) {
      this.selectModelTable = e;
    },
    // 点击UI创建模型
    ChangeSceneByUI(item) {
      // console.log(item);
      this.isOpen = false;
      this.$parent.$refs.settingPanel_npc.load(item);
    },
  },
};
</script>