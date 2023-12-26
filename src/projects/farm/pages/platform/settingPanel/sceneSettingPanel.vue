
// 场景设置
<template>
  <!-- 顶部 -->
  <div class=" absolute z-10 left-2 top-2 h-10 w-full flex  text-white ">
    <!-- 顶部工具栏 -->
    <!-- table -->
    <div class=" flex flex-col gap-3  ">

      <div class=" text-left ">环境配置</div>
      <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-80     ">
        <div class=" self-center w-1/3">
          {{ item.title }}
        </div>
        <div class=" self-center w-2/3 pr-20">
          <div v-if="item.type == 'color'" class=" flex gap-2 ">
            <YJinput_color :index="i" :value="item.value" :callback="item.callback" />
          </div>

          <div v-if="item.type == 'toggle'" class=" w-4 h-4 ">
            <YJinput_toggle class=" w-4 h-4 " :index="i" :value="item.value" :callback="item.callback"></YJinput_toggle>
            <!-- <div class=" w-4 h-4 rounded-sm bg-gray-50 flex">
              <div v-if="item.value" class=" self-center mx-auto w-4 h-4 leading-4 pl-px rounded-sm text-black">
                &#10004
              </div>
            </div> -->

          </div>

          <div v-if="item.type == 'file'" class=" flex  gap-2  " @click="SelectHDR(item, i)">
            <div @click="SelectHDR(item, i)" class=" w-10 h-10 bg-black cursor-pointer ">
              <img v-if="item.value" class=" w-full h-full" :src="$uploadHDRUrl + item.value.replace('.hdr','.jpg')" />
            </div>
            <!-- <div>{{ item.value }}</div> -->
            <div class=" w-auto h-6 rounded-sm bg-gray-50 flex">
              <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
                浏览...
              </div>
            </div>
          </div>


          <!-- <div v-if="item.type == 'slider'" class=" flex gap-2 ">
            <input id="body-slider" type="range" :value="item.value" step="0.1" :min="item.min" :max="item.max">
            <div>{{ item.value }}</div>
          </div> -->

          <div v-if="item.type == 'slider'" class=" flex gap-2 ">
            <YJinput_range :index="i" :value="item.value" :step="item.step" :min="item.min" :max="item.max"
              :callback="item.callback" />
            <div>{{ item.value }}</div>
          </div>
        </div>
      </div>

      <div class=" mt-4 flex">
        <div class=" text-left ">放入到开放世界</div>
        <div class=" ml-2 p-2 h-6  bg-white text-black flex" @click="MetaWorld('添加')">
          <div class=" self-center ">+</div>
        </div>
      </div>
      <div v-for="(item, i) in metaWorldCoordinate" :key="i" class="
                   w-auto h-auto relative flex
                ">
        <div class="   w-6 h-6 ">
          X:
        </div>
        <input class=" w-16  h-6 bg-transparent border-px placeholder-gray-400 p-1" type="number" v-model="item.x"
          :placeholder="item.x" @change="MetaWorld('值改变', item)" />
        <div class="   w-6 h-6 ">
          Y:
        </div>
        <input class=" w-16  h-6 bg-transparent border-px placeholder-gray-400 p-1" type="number" v-model="item.y"
          :placeholder="item.y" @change="MetaWorld('值改变', item)" />

        <div v-if="!item.vaild" class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black" @click="MetaWorld('验证', item)">
          <div class=" self-center">验证</div>
        </div>

        <div v-if="item.vaild" class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black">
          <div class=" self-center">&#10004</div>
        </div>

        <div class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black" @click="MetaWorld('删除', item, i)">
          <div class=" self-center">-</div>
        </div>

      </div>

    </div>

  </div>
  <!-- HDR列表 -->
  <div class="  absolute z-10 -left-48 top-0 " v-if="inSelectHDR">
    <div v-for="(item, i) in jpgList" :key="i" class="
                  self-center w-40 h-auto relative
                ">
      <div class=" w-40 h-20 self-center mx-auto mt-2
                  cursor-pointer " @click="ClickHDR(i)">
        <img class=" w-full h-full    object-fill hover:opacity-70 " :src="$uploadHDRUrl + item" />
      </div>
    </div>
  </div>
</template>

<script>

import YJinput_toggle from "../components/YJinput_toggle.vue";
import YJinput_color from "../components/YJinput_color.vue";
import YJinput_range from "../components/YJinput_range.vue";


import { GetAllHDR, RequestMetaWorld } from "../../../js/uploadThreejs.js";

export default {
  name: "settingpanel",
  props: ["isScene"],
  components: {
    YJinput_toggle,
    YJinput_color,
    YJinput_range,
  },
  data() {
    return {
      // 场景设置
      // sceneSetting: [
      //   { title: "启用环境hdr", type: "toggle", value: false, callback: this.ChangeToggleHDR  },
      //   { title: "环境hdr", type: "file", url: null },
      //   { title: "启用全景球", type: "toggle", value: false, callback: this.ChangeToggleEnv  },
      //   { title: "全景球hdr", type: "file", url: null },
      //   { title: "画布背景色", type: "color", value: "#A7D0FF" },
      //   { title: "环境光强度", type: "slider", value: 1, min: 0, max: 2 },
      //   { title: "启用默认地面", type: "toggle", value: true , callback: this.ChangeToggleFloor      },
      // ],
      setting: [

        { property: "setting-hasSceneHDR", display: true, title: "启用环境hdr", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "setting-envSceneHDRPath", display: true, title: "环境hdr", type: "file", value: "" },
        { property: "setting-hasEnvmap", display: true, title: "启用全景球", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "setting-envmapPath", display: true, title: "全景球hdr", type: "file", value: "" },
        { property: "AmbientLightData-backgroundColor", display: true, title: "画布背景色", type: "color", value: "#A7D0FF", callback: this.ChangeValue },
        { property: "AmbientLightData-AmbientLightIntensity", display: true, title: "环境光强度", type: "slider", value: 1, step: 0.1, min: 0, max: 2, callback: this.ChangeValue },
        { property: "hasFloor", display: true, title: "启用默认地面", type: "toggle", value: true, callback: this.ChangeValue },
      ],
      sceneSettingData: {

      },

      titleIndex: -1,
      hdrList: [],
      jpgList: [],
      inSelectHDR: false,

      // metaWorldCoordinate: [{ x: 0, y: 0, vaild: true }],
      metaWorldCoordinate: [],
    };
  },
  created() {

  },
  mounted() {
    this.RequestGetAllHDR();



    setTimeout(() => {

      // this.sceneSetting[0].value = this.$parent.sceneData.setting.hasSceneHDR;
      // this.sceneSetting[1].url = this.$parent.sceneData.setting.envSceneHDRPath;

      // this.sceneSetting[2].value = this.$parent.sceneData.setting.hasEnvmap;
      // this.sceneSetting[3].url = this.$parent.sceneData.setting.envmapPath;

      // this.sceneSetting[4].value = this.$parent.sceneData.AmbientLightData.backgroundColor;
      // this.sceneSetting[5].value = this.$parent.sceneData.AmbientLightData.AmbientLightIntensity;

      // this.sceneSetting[6].value = this.$parent.sceneData.hasFloor;
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.$parent.sceneData);


      if (this.$parent.sceneData.metaWorldCoordinate != undefined) {
      } else {
        this.$parent.sceneData.metaWorldCoordinate = [];
      }
      this.metaWorldCoordinate = this.$parent.sceneData.metaWorldCoordinate;

    }, 2000);

    // let that = this;
    // const bodyColorInput = document.getElementById('body-color');
    // bodyColorInput.addEventListener('input', function () {
    //   that.setting[4].value = this.value;
    //   _Global.SetBackgroundColor(this.value);
    // });

    // const bodysliderInput = document.getElementById('body-slider');
    // bodysliderInput.addEventListener('input', function () {
    //   that.setting[5].value = this.value;
    //   _Global.SetAmbientLightIntensity(this.value);
    // });

  },
  methods: {

    MetaWorld(e, item, i) {
      if (e == "添加") {
        this.metaWorldCoordinate.push({ x: 0, y: 0, vaild: false });
      }
      if (e == "验证") {

        //发送到后台增加
        let fromData = new FormData();
        //服务器中的本地地址
        fromData.append("mapId", _Global.ReportTo3D("坐标转地图id", { x: item.x, z: item.y }));
        fromData.append("folderBase", this.$parent.folderBase);
        let msg = {
          type: "添加",
        }
        let s = JSON.stringify(msg);
        fromData.append("msg", s);
        RequestMetaWorld(fromData).then((res) => {
          console.log(res);
          //先记录旧照片
          if (res.data.data == true) {
            item.vaild = true;
            this.$parent.addMetaWorldCoordinate(item);
          }
        });

      }
      if (e == "删除") {
        if (item.vaild) {
          //发送到后台取消
          let fromData = new FormData();
          //服务器中的本地地址
          fromData.append("mapId", _Global.ReportTo3D("坐标转地图id", { x: item.x, z: item.y }));
          fromData.append("folderBase", this.$parent.folderBase);
          let msg = {
            type: "删除",
          }
          let s = JSON.stringify(msg);
          fromData.append("msg", s);
          RequestMetaWorld(fromData).then((res) => {
            console.log(res);
            //先记录旧照片
            // if (res.data.data == true) {
            //   item.vaild = false;
            //   this.metaWorldCoordinate.splice(i, 1);
            //   this.$parent.removeMetaWorldCoordinate(i);
            // }

            item.vaild = false;
            this.metaWorldCoordinate.splice(i, 1);
            this.$parent.removeMetaWorldCoordinate(i);
          });

        } else {
          this.metaWorldCoordinate.splice(i, 1);
        }

      }
      if (e == "值改变") {
        if (item.vaild) {
          //发送到后台取消 
          let fromData = new FormData();
          //服务器中的本地地址
          fromData.append("mapId", _Global.ReportTo3D("坐标转地图id", { x: item.x, z: item.y }));
          fromData.append("folderBase", this.$parent.folderBase);
          let msg = {
            type: "删除",
          }
          let s = JSON.stringify(msg);
          fromData.append("msg", s);
          RequestMetaWorld(fromData).then((res) => {
            console.log(res);
            item.vaild = false;
          });

        }
      }
    },

    ChangeUIState(property, e) {
      // 根据选择判断哪些属性不显示
      if (property == "target-type") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "target-value", "display", e == "area");
      }
      if (property == "effect-type") {
        if (e == "damage") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", false);
        }
      }
    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;

      console.log(i, property, e);

      // let sp = property.split('-');
      // if (sp.length == 1) {
      //   this.settingData[sp[0]] = e;
      // } else {
      //   this.settingData[sp[0]][sp[1]] = e;
      // }
      // this.ChangeUIState(property, e);

      if (property == "AmbientLightData-AmbientLightIntensity") {
        _Global.SetAmbientLightIntensity(e);
      }
      if (property == "AmbientLightData-backgroundColor") {
        _Global.SetBackgroundColor(e);
      }
      if (property == "hasFloor") {
        _Global.SetDisplayFloor(e);
      }
      if (property == "setting-hasEnvmap") {
        _Global.enableHDR(this.setting[2].value, this.setting[3].value, false);
      }
      if (property == "setting-hasSceneHDR") {
        _Global.enableHDR(this.setting[0].value, this.setting[1].value, true); 
      }
    },
    SelectHDR(item, i) {
      this.inSelectHDR = true;
      this.titleIndex = i;
    },
    ClickHDR(i) {
      this.setting[this.titleIndex].value = this.hdrList[i];

      console.log(this.titleIndex, this.hdrList, this.hdrList[i]);

      if (this.setting[this.titleIndex].title == "环境hdr") {
        //更新到三维
        _Global.enableHDR(this.setting[0].value, this.setting[1].value, true);
        // 保存到setting
        this.$parent.sceneData.setting.envSceneHDRPath = this.setting[1].value;
      }
      if (this.setting[this.titleIndex].title == "全景球hdr") {
        _Global.enableHDR(this.setting[2].value, this.setting[3].value, false);
        this.$parent.sceneData.setting.envmapPath = this.setting[3].value;
      }

      this.titleIndex = -1;
      this.inSelectHDR = false;
    },
    async RequestGetAllHDR() {
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
    },
    ChangeSetting(title, e) { 

      if (title == "碰撞") {
        this.setting.displayCollider = !this.setting.displayCollider;
        _Global.displayCollider(this.setting.displayCollider);
      }
    },

  },
};
</script>

<style scoped></style>
