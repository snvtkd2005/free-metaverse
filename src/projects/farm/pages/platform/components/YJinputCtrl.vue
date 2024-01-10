

<template>
  <div class=" w-full gap-y-2  ">
    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-full mb-1     ">
      <div v-if="item.display" class=" self-center w-1/3">
        {{ item.title }}
      </div>
      <div v-if="item.display" class=" self-center w-2/3 pr-20">
        <div v-if="item.type == 'color'" class=" flex gap-2 ">
          <YJinput_color :index="i" :value="item.value" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'toggle'" class=" w-4 h-4 ">
          <YJinput_toggle class=" w-4 h-4 " :index="i" :value="item.value" :callback="item.callback"></YJinput_toggle>
        </div>

        <div v-if="item.type == 'file' && item.filetype == 'image'" class=" flex  gap-2  ">
          <div @click="SelectHDR(item, i)" class=" w-10 h-10 bg-black cursor-pointer ">
            <img v-if="item.value" class=" w-full h-full" :src="$uploadHDRUrl + item.value.replace('.hdr', '.jpg')" />
          </div>
          <div class=" w-auto h-6 rounded-sm bg-gray-50 flex cursor-pointer " @click="SelectHDR(item, i)">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'file' && item.filetype == 'audio'" class=" flex  gap-2  ">
          <div @click="SelectAudio(item, i)" class=" w-10 h-10 bg-black cursor-pointer ">
            <audio v-if="item.value" :src="$uploadAudioUrl + item.value"></audio>
          </div>
          <div class=" w-auto h-6 rounded-sm bg-gray-50 flex  cursor-pointer" @click="SelectAudio(item, i)">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'int'" class="flex gap-2 text-black">
          <YJinput_number :value="item.value" :type="item.type" :step="item.step" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <YJinput_number :value="item.value" :step="item.step" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'slider'" class=" flex gap-2 ">
          <YJinput_range :index="i" :value="item.value" :step="item.step" :min="item.min" :max="item.max"
            :callback="item.callback" />
          <div>{{ item.value }}</div>
        </div>

        <div v-if="item.type == 'vector3'" class=" w-auto h-6 text-black ">
          <YJinput_vector3 class=" w-auto h-6 " :value="item.value" :step="item.step" :index="i"
            :callback="item.callback" />
        </div>

        <div v-if="item.type == 'drop'" class=" w-20 h-12 text-black ">
          <YJinput_drop class=" w-32 h-full " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>

        <div v-if="item.type == 'text'" class=" w-20 h-4 text-black ">
          <YJinput_text class=" w-20 h-4 " :value="item.value" :index="i" :callback="item.callback" />
        </div>

      </div>
      <div v-if="item.display && item.unit" class=" self-center ml-2 w-4  truncate">
        {{ item.unit }}
      </div>
    </div>
  </div>


  <!-- 选择HDR 选择UV图 选择音效 的弹窗 -->
  <el-dialog :title="selectTitle" class="    text-white  create-card" center v-model="isOpen"
    :modal-append-to-body="false" width="55%">

    <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap  " v-if="selectTitle == '选择HDR'">
      <div v-for="(item, i) in jpgList" :key="i" class="v self-center w-40 h-auto relative">
        <div class=" w-40 h-20 self-center mx-auto mt-2 cursor-pointer " @click="ClickHDR(i)">
          <img class=" w-full h-full object-fill hover:opacity-70 " :src="$uploadHDRUrl + item" />
        </div>
      </div>
    </div>

    <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap  " v-if="selectTitle == '选择音效'">
      <div v-for="(item, i) in audioList" :key="i" class="v self-center w-40 h-auto relative">
        <div>{{ item.name }}</div>
        <div class=" " @click="playAudio(item)">试听</div>
        <div class=" w-40 h-20 self-center mx-auto mt-2 cursor-pointer " @click="ClickAudio(item)">
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import YJinput_toggle from "./YJinput_toggle.vue";
import YJinput_color from "./YJinput_color.vue";
import YJinput_range from "./YJinput_range.vue";
import YJinput_upload from "./YJinput_upload.vue";
import YJinput_text from "./YJinput_text.vue";
import YJinput_number from "./YJinput_number.vue";
import YJinput_drop from "./YJinput_drop.vue";
import YJinput_textarea from "./YJinput_textarea.vue";
import YJinput_vector3 from "./YJinput_vector3.vue";

import { GetAllHDR, GetAllAudio } from "../../../js/uploadThreejs.js";

export default {
  name: "YJinputCtrl",
  props: ["setting"],
  components: {
    YJinput_toggle,
    YJinput_color,
    YJinput_range,
    YJinput_upload,
    YJinput_text,
    YJinput_number,
    YJinput_drop,
    YJinput_textarea,
    YJinput_vector3,
  },
  data() {
    return {

      // 加载hdr图片
      hdrList: [],
      jpgList: [],
      titleIndex: -1,
      audioList: [
        { name: "", url: "" }
      ],
      selectTitle: "",
      isOpen: false,

    };
  },
  created() {
  },
  mounted() {

  },
  methods: {

    SelectHDR(item, i) {
      if (this.inSelectHDR) {
        return;
      }
      this.selectTitle = "选择HDR";
      this.RequestGetAllHDR(this.selectTitle);

      this.isOpen = true;
      this.titleIndex = i;
    },
    ClickHDR(i) {
      this.$parent.ClickHDR(this.titleIndex, this.hdrList[i]);
      this.titleIndex = -1;
      this.isOpen = false;
    },
    async RequestGetAllHDR(type) {
      if (type == "选择HDR") {
        GetAllHDR().then((res) => {
          // console.log("获取所有 hdr ", res);
          //先记录旧照片
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;
            for (let i = 0; i < txtDataList.length; i++) {
              const element = txtDataList[i];
              if (element.includes('hdr')) {
                this.hdrList.push((element));
              } else {
                this.jpgList.push((element));
              }
            }
          }
        });
      }

      if (type == "选择音效") {
        GetAllAudio().then((res) => {
          // console.log("获取所有 hdr ", res);
          //先记录旧照片
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;
            for (let i = 0; i < txtDataList.length; i++) {
              const element = txtDataList[i];
              this.audioList.push((element));
            }
          }
        });
      }

    },

    SelectAudio(item, i) {
      this.selectTitle = "选择音效";
      this.RequestGetAllHDR(this.selectTitle);

      this.isOpen = true;
      this.titleIndex = i;
    },
    playAudio(item) {

    },
    ClickAudio(item) {

    },


    focus() {
      if (this.$parent.$parent.removeThreeJSfocus) {
        this.$parent.$parent.removeThreeJSfocus();
      }
    },
    blur() { },
  },
};
</script>

<style scoped></style>
