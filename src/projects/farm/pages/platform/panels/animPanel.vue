

<template>
  <div
    v-if="isOpen"
    class="absolute w-full h-full flex text-white overflow-hidden pointer-events-none"
  >
    <div
      class="absolute bottom-0 mx-auto w-1/2 h-1/2 p-2 bg-gray-100 rounded-tr-lg rounded-tl-lg pointer-events-auto"
    >
      <div class="w-full text-gray-500 rounded-lg relative">
        <div class="flex">
          <div class="text-left">统一动作</div>
          <div
            class="text-left w-6 h-6 bg-white flex text-black self-center leading-6 mx-auto cursor-pointer"
            @click="EditorEvent('新建')"
          >
            <div class="mx-auto">+</div>
          </div>
        </div>
        <div class="mt-2 overflow-y-scroll h-96">
          <div
            v-for="(item, i) in animList"
            :key="i"
            class="flex text-base text-left h-auto mb-2"
          >
            <div
              class="hidden w-12 h-12 self-center mx-auto cursor-pointer"
              @click="EditorEvent('读取', item)"
            >
              <!-- <img class="w-full h-full object-fill hover:opacity-70" :src="item.icon" /> -->
            </div>
            <div
              class="w-1/3 truncate flex justify-between"
              :class="item.has ? ' cursor-pointer text-green-500 ' : ''"
              @click="ChangeAnim(item.animName)"
            >
              <text>{{ item.animName }}</text>
            </div>
            <div class="w-1/3 truncate flex justify-between">
              <text>{{ item.content }}</text>
            </div>

            <div class="hidden w-10 truncate flex justify-between">
              <text>{{ item.has ? "有" : "没有" }}</text>
            </div>

            <div class="w-10 flex text-sm justify-between">
              <div
                class="cursor-pointer bg-gray-100"
                @click="EditorEvent('上传', item, i)"
              >
                {{ UIData.base.editor }}
                <!-- <div class="cursor-pointer bg-gray-100 " @click="EditorEvent('编辑', item, i)">{{ UIData.base.editor }} -->
              </div>
            </div>

            <div
              v-if="!item.has"
              class="w-12 cursor-pointer text-white bg-gray-500 hover:bg-546770"
              @click="EditorEvent('上传', item, i)"
            >
              去上传
            </div>

            <div
              v-if="item.has"
              class="ml-2 w-12 cursor-pointer text-white bg-gray-500 hover:bg-546770"
              @click="EditorEvent('清除', item, i)"
            >
              清除
            </div>

            <!-- <div v-if="item.has" class=" ml-2 w-12 cursor-pointer text-white bg-gray-500
            hover:bg-546770" @click="EditorEvent('删除', item, i)">删除</div> -->
          </div>
        </div>
        <div
          class="absolute -right-5 -top-5 rounded-full w-10 h-10 bg-white text-black flex cursor-pointer"
          @click="isOpen = false"
        >
          <div class="self-center mx-auto">X</div>
        </div>
      </div>

      <div
        v-if="inAdd"
        class="absolute top-0 right-0 text-white bg-black bg-opacity-40"
      >
        <div
          v-for="(item, i) in animFrom"
          :key="i"
          class="text-xs text-left flex w-80 px-4 py-2 h-auto mb-2"
        >
          <div class="self-center w-40 truncate">
            {{ item.title }}
          </div>
          <div class="self-center">
            <div v-if="item.type == 'text'" class="w-auto h-4 text-black">
              <YJinput_text
                class="w-auto h-4"
                :value="item.value"
                :index="i"
                :callback="item.callback"
              />
            </div>
          </div>
        </div>
        <div class="w-40 mx-auto flex justify-between">
          <div
            class="cursor-pointer bg-black opacity-75 p-2"
            @click="FloatEvent('保存')"
          >
            保存
          </div>
          <div
            class="cursor-pointer bg-black opacity-75 p-2"
            @click="FloatEvent('取消')"
          >
            取消
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YJinput_text from "../components/YJinput_text.vue";
import { GetAllModel, UploadPlayerFile } from "../../../js/uploadThreejs.js";

//  动作库 
export default {
  name: "animPanel",

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

      animFrom: [
        {
          property: "animName",
          title: "动作名（英文）:",
          type: "text",
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "content",
          title: "动作描述:",
          type: "text",
          value: "",
          callback: this.ChangeValue,
        },
      ],
      path: "",
      model: null,
      inEditor: false,
      modelItem: null,
      uploadUrl: "", 
    };
  },
  created() {},
  mounted() {
    this.path = this.$uploadUrl;

    this.folderBase = "";
  },
  methods: {
    SetVisible(b, currentAnimList) {
      this.isOpen = b;
      if (b) {
        this.initValue(currentAnimList);
      }
    },

    initValue(currentAnimList) {
      this.animList = _Global.animList; 
      for (let i = 0; i < this.animList.length; i++) {
        const anim = this.animList[i];
        anim.has = false;
        for (let j = 0; j < currentAnimList.length; j++) {
          const element = currentAnimList[j];
          if (element == anim.animName) {
            anim.has = true;
          }
        }
      } 
    },
    UpdateState(temp) {
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
    },
    ChangeAnim(animName) {
      this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_player.ChangePlayerAnim(
        animName
      );
    },

    ChangeValue(i, e) {
      console.log(i, e);
      this.animFrom[i].value = e;
    },
    FloatEvent(e) {
      if (e == "保存") {
        this.saveAnim();
      }
      if (e == "取消") {
        this.inAdd = false;
      }
    },
    EditorEvent(e, item, i) {
      console.log(e, item, i);
      if (e == "上传") {
        this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_player.SetAnimName(
          item
        );
        return;
      }
      if (e == "读取") {
        this.ChangeAnim(item.animList[0].animName);
      }
      if (e == "新建") {
        this.editorIndex = -1;
        this.inAdd = true;
        this.animFrom[0].value = "";
        this.animFrom[1].value = "";
      }
      if (e == "编辑") {
        this.editorIndex = i;
        this.inAdd = true;
        this.animFrom[0].value = item.animName;
        this.animFrom[1].value = item.content;
      }
      if (e == "删除") {
        // 技能名为空时，运行删除
        // if (item.name == "") {
        //   this.animList.splice(i, 1);
        //   this.saveAnim();
        // }

        this.animList.splice(i, 1);
        this.saveAnim();
      }

      if (e == "清除") {
        // 清除角色的这一条动作记录
        this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_player.removeAnim(
          item.animName
        );
        item.has = false;
      }
    },
    saveAnim() {
      if (this.inAdd) {
        if (this.editorIndex == -1) {
          this.animList.push({
            animName: this.animFrom[0].value.trim(),
            content: this.animFrom[1].value.trim(),
          });
        } else {
          this.animList[this.editorIndex].animName =
            this.animFrom[0].value.trim();
          this.animList[this.editorIndex].content =
            this.animFrom[1].value.trim();
        }
      }
      let s = JSON.stringify(this.animList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", this.$stringtoBlob(s, "anim_data.txt"));
      fromData.append("folderBase", this.folderBase);
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 角色 动作数据 文件成功 ");
          this.inAdd = false;
        }
      });
    },
  },
};
</script>