

<template>
  <div class=" w-full gap-y-0.5  flex flex-col  ">
    <div v-for="(item, i) in setting" :key="i"
      class=" text-xs mx-auto  text-left flex w-full px-1 mb-1 justify-between     ">
      <div v-if="item.display" class=" self-center w-20">
        {{ item.title }}
      </div>
      <div v-if="item.display" class=" self-center  ">
        <div v-if="item.type == 'color'" class=" flex gap-2 ">
          <YJinput_color :index="i" :value="item.value" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'toggle'" class=" w-4 h-4 ">
          <YJinput_toggle class=" w-4 h-4 " :index="i" :value="item.value" :callback="item.callback"></YJinput_toggle>
        </div>

        <div v-if="item.type == 'file' && item.filetype == 'hdr'" class=" flex  gap-2  ">
          <div @click="SelectItem('选择HDR', item, i)" class=" w-10 h-10 bg-black cursor-pointer ">
            <img v-if="item.value" class=" w-full h-full" :src="$uploadHDRUrl + item.value.replace('.hdr', '.jpg')" />
          </div>
          <div class=" w-auto h-6 rounded-sm bg-gray-50 flex cursor-pointer " @click="SelectItem('选择HDR', item, i)">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'file' && item.filetype == 'image'" class=" flex  gap-2  ">
          <div @click="SelectItem('选择通用图片', item, i)" class=" w-10 h-10 bg-black cursor-pointer ">
            <img v-if="item.value" class=" w-full h-full" :src="$uploadUVAnimUrl + item.value" />
          </div>
          <div class=" w-auto h-6 rounded-sm bg-gray-50 flex cursor-pointer " @click="SelectItem('选择通用图片', item, i)">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'file' && item.filetype == 'audio'" class=" flex  gap-2  ">
          <div class=" w-32 h-6  cursor-pointer ">
            <audio v-if="item.value" class="w-full h-full" controls :src="$uploadAudioUrl + item.value"></audio>
          </div>
          <div class=" w-20 h-6 rounded-sm  flex ">
            <div class=" text-xs pl-1 self-center w-10 h-full leading-6 bg-gray-50  rounded-sm text-black  cursor-pointer"
              @click="SelectItem('选择音效', item, i)">
              浏览...
            </div>
            <div v-if="item.value"
              class=" text-xs ml-2 self-center w-auto h-full leading-6 bg-gray-50  rounded-sm text-black cursor-pointer "
              @click="SelectItem('移除音效', item, i)">
              移除
            </div>
          </div>
        </div>

        <div v-if="item.type == 'file' && item.filetype == 'particle'" class=" flex  gap-2  ">
          <div @click="SelectItem('选择特效', item, i)" class=" w-10 h-10  cursor-pointer ">
            <img v-if="item.value" class=" w-full h-full" :src="$uploadGroupUrl + item.value + '/thumb.jpg'" />
          </div>
          <div class=" w-auto h-6 rounded-sm  flex ">
            <div
              class=" text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50  rounded-sm text-black cursor-pointer "
              @click="SelectItem('选择特效', item, i)">
              浏览...
            </div>

            <div v-if="item.value"
              class=" text-xs ml-2 self-center mx-auto w-10 h-6 leading-6 bg-gray-50  rounded-sm text-black cursor-pointer "
              @click="SelectItem('移除特效', item, i)">
              移除
            </div>
          </div>
        </div>

        <div v-if="item.type == 'file' && item.filetype == 'weapon'" class=" flex  gap-2  ">
          <div @click="SelectItem('选择武器', item, i)" class=" w-10 h-10  cursor-pointer ">
            <img v-if="item.value" class=" w-full h-full" :src="$uploadUrl + item.value" />
          </div>
          <div class=" w-auto h-6 rounded-sm  flex ">
            <div
              class=" text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50  rounded-sm text-black cursor-pointer "
              @click="SelectItem('选择武器', item, i)">
              浏览...
            </div>

            <div v-if="item.value"
              class=" text-xs ml-2 self-center mx-auto w-10 h-6 leading-6 bg-gray-50  rounded-sm text-black cursor-pointer "
              @click="SelectItem('移除武器', item, i)">
              移除
            </div>
          </div>
        </div>

        <div v-if="item.type == 'file' && item.filetype == 'avatar'" class=" flex  gap-2  ">
          <div @click="SelectItem('选择avatar', item, i)" class=" w-10 h-10  cursor-pointer ">
            <img v-if="item.value" class=" w-full h-full" :src="$uploadUrl + item.value" />
          </div>
          <div class=" w-auto h-6 rounded-sm  flex ">
            <div
              class=" text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50  rounded-sm text-black cursor-pointer "
              @click="SelectItem('选择avatar', item, i)">
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

        <div v-if="item.type == 'drop'" class=" w-full h-10 text-black ">
          <YJinput_drop class=" w-full h-full " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>

        <div v-if="item.type == 'text'" class=" w-20 h-4 text-black ">
          <YJinput_text class=" w-20 h-4 " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'textarea'" class=" w-32 h-auto text-black ">
          <YJinput_textarea class=" w-full h-20 " :value="item.value" :index="i" :callback="item.callback" />
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
        <div class=" w-40 h-20 self-center mx-auto mt-2 cursor-pointer " @click="ClickItem(selectTitle, i)">
          <img class=" w-full h-full object-fill hover:opacity-70 " :src="$uploadHDRUrl + item" />
        </div>
      </div>
    </div>

    <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap  " v-if="selectTitle == '选择音效'">
      <div v-for="(item, i) in audioList" :key="i" class="v self-center w-40 h-auto relative">
        <div class=" w-40 h-20 self-center mx-auto mt-2 cursor-pointer " @click="ClickItem(selectTitle, i)">

          <div class=" rounded-xl bg-gray-100 border w-full">
            <audio class="w-full" controls :src="this.$uploadAudioUrl + item.folderBase + '/' + item.name"> </audio>
          </div>

          <div class=" flex flex-wrap w-5/6 gap-3">
            <div v-for="(tagItem, ii) in item.tags " :key="ii" class=" border rounded-3xl border-gray-300 w-auto h-8 ">
              <div class=" flex h-full text-gray-600">
                <div class=" self-center mx-auto px-4 ">{{ tagItem }}</div>
              </div>
            </div>
          </div>
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>

    <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap  " v-if="selectTitle == '选择通用图片'">
      <div v-for="(item, i) in uvAnimList" :key="i" class="v self-center w-40 h-auto relative">
        <div class=" w-16 h-16 self-center mx-auto mt-2 cursor-pointer " @click="ClickItem(selectTitle, i)">
          <img class=" w-full h-full object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item" />
        </div>
      </div>
    </div>

    <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap  " v-if="selectTitle == '选择特效'">
      <div v-for="(item, i) in particleList" :key="i" class="v self-center w-40 h-auto relative">
        <div class=" w-16 h-16 self-center mx-auto mt-2 cursor-pointer " @click="ClickItem(selectTitle, i)">
          <img class=" w-full h-full object-fill hover:opacity-70 " :src="$uploadGroupUrl + item.icon" />
        </div>
      </div>
    </div>

    <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap  " v-if="selectTitle == '选择武器' || selectTitle == '选择avatar'">
      <div v-for="(item, i) in modelList" :key="i" class="v self-center w-40 h-auto relative">
        <div class=" w-16 h-16 self-center mx-auto mt-2 cursor-pointer " @click="ClickItem(selectTitle, i)">
          <img class=" w-full h-full object-fill hover:opacity-70 " :src="$uploadUrl + item.icon" />
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
import YJinput_textarea from "./YJinput_textarea.vue";
import YJinput_number from "./YJinput_number.vue";
import YJinput_drop from "./YJinput_drop.vue";
import YJinput_vector3 from "./YJinput_vector3.vue";

import {
  GetAllHDR, GetAllAudio, GetAllUVAnim
  , GetAllGroup
  , GetAllModel

} from "../../../js/uploadThreejs.js";

export default {
  name: "YJinputCtrl",
  props: ["setting"],
  components: {
    YJinput_toggle,
    YJinput_color,
    YJinput_range,
    YJinput_upload,
    YJinput_text,
    YJinput_textarea,
    YJinput_number,
    YJinput_drop,
    YJinput_vector3,
  },
  data() {
    return {

      // 加载hdr图片
      hdrList: [],
      uvAnimList: [],
      particleList: [],
      jpgList: [],
      settingIndex: -1,
      audioList: [],
      modelList: [],
      selectTitle: "",
      isOpen: false,

    };
  },
  created() {
  },
  mounted() {

  },
  methods: {
    SelectUVAnim(item, i) {
      this.selectTitle = "选择通用图片";
      this.RequestGetAllHDR(this.selectTitle);
      this.isOpen = true;
      this.settingIndex = i;
    },
    SelectHDR(item, i) {
      this.selectTitle = "选择HDR";
      this.RequestGetAllHDR(this.selectTitle);

      this.isOpen = true;
      this.settingIndex = i;
    },
    SelectAudio(item, i) {
      this.selectTitle = "选择音效";
      this.RequestGetAllHDR(this.selectTitle);

      this.isOpen = true;
      this.settingIndex = i;
    },

    SelectItem(e, item, i) {
      this.settingIndex = i;

      if (e == "选择特效") {
        this.selectTitle = e;
      }
      if (e == "选择武器") {
        this.selectTitle = e;
      }
      if (e == "选择avatar") {
        this.selectTitle = e;
      }
      
      if (e == "选择HDR") {
        this.selectTitle = e;
      }
      if (e == "选择通用图片") {
        this.selectTitle = e;
      }
      if (e == "选择音效") {
        this.selectTitle = e;
      }
      if (e == "移除特效") {
        this.ClickUVAnim("");
        return;
      }
      if (e == "移除音效") {
        this.ClickUVAnim("");
        return;
      }
      
      if (e == "移除武器") {
        this.ClickUVAnim("");
        return;
      }
      
      this.RequestGetAllHDR(this.selectTitle);
      this.isOpen = true;
    },

    ClickAudio(item) {
    },
    ClickItem(e, i) {
      if (e == "选择通用图片") {
        this.ClickUVAnim(this.uvAnimList[i]);
      }
      if (e == "选择HDR") {
        this.ClickHDR(i);
      }
      if (e == "选择特效") {
        this.ClickUVAnim(this.particleList[i].folderBase);
      }
      if (e == "选择音效") {
        this.ClickUVAnim(this.audioList[i].folderBase + '/' + this.audioList[i].name);
      }
      
      if (e == "选择武器") {
        this.ClickUVAnim(this.modelList[i]);
      }
      if (e == "选择avatar") {
        this.ClickUVAnim(this.modelList[i]);
      }
      
      this.settingIndex = -1;
      this.isOpen = false;
    },

    ClickParticle(i) {
      this.$parent.ClickParticle(this.settingIndex, this.particleList[i]);

    },
    ClickHDR(i) {
      this.$parent.ClickHDR(this.settingIndex, this.hdrList[i]);
    },
    ClickUVAnim(item) {
      // console.log(" 选择通用图片 000 ", i, this.$parent
      //   , this.$parent.$parent
      //   , this.$parent.$parent.$parent
      //   , this.$parent.$parent.$parent.$parent
      // );

      if (this.$parent.ClickUVAnim) {
        this.$parent.ClickUVAnim(this.settingIndex, item);
      } else
        if (this.$parent.$parent.ClickUVAnim) {
          this.$parent.$parent.ClickUVAnim(this.settingIndex, item);
        } else
          if (this.$parent.$parent.$parent.ClickUVAnim) {
            this.$parent.$parent.$parent.ClickUVAnim(this.settingIndex, item);
          } else
            if (this.$parent.$parent.$parent.$parent.ClickUVAnim) {
              this.$parent.$parent.$parent.$parent.ClickUVAnim(this.settingIndex, item);
            }
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
          this.audioList = [];
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
      if (type == "选择通用图片") {
        this.uvAnimList = [];
        GetAllUVAnim().then((res) => {
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;
            for (let i = 0; i < txtDataList.length; i++) {
              const element = txtDataList[i];
              this.uvAnimList.push((element));
            }
          }
        });
      }

      if (type == "选择特效") {
        this.particleList = [];
        GetAllGroup().then((res) => {
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;
            for (let i = 0; i < txtDataList.length; i++) {
              const element = txtDataList[i];
              this.particleList.push((element));
            }
          }
        });
      }

      if (type == "选择武器" || type == "选择avatar" ) {
        let selectModelTable = "装备模型";
        if(type == "选择avatar" ){
          selectModelTable = "角色模型";
        }
        this.modelList = [];
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
              if (item.modelType == selectModelTable) {
                item.icon = item.folderBase + "/" + "thumb.png";
                this.modelList.push(item);
              }
            }
          }
        });
      }

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
