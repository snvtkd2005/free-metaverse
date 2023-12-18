
// 模型库
<template>
  <!-- 模型库 模型列表选择 -->
  <div v-if="isOpen" class="
       relative
      w-full
      h-full
      flex 
      text-white 
      overflow-hidden
     pointer-events-none
    ">
    <div class=" self-center mx-auto w-1/2 h-3/4 p-2 bg-gray-900 
      rounded-tr-lg rounded-tl-lg pointer-events-auto relative ">

      <!-- 技能面板 -->
      <div class=" hidden
              w-full 
             text-gray-500 
             rounded-lg 
             relative
            ">
        <div class=" flex ">
          <div class=" text-left ">技能面板</div>
          <div class=" text-left w-6 h-6 bg-white flex text-black self-center leading-6 mx-auto cursor-pointer "
            @click="EditorEvent('新建')">
            <div class=" mx-auto">
              +
            </div>
          </div>
        </div>
        <div class="mt-2 overflow-y-scroll h-96  ">
          <div v-for="(item, i) in animList" :key="i" class=" flex  text-base  text-left  h-auto mb-2     ">
            <div class=" hidden w-12 h-12 self-center mx-auto cursor-pointer" @click="EditorEvent('读取', item)">
              <!-- <img class="w-full h-full object-fill hover:opacity-70" :src="item.icon" /> -->
            </div>
            <div class=" w-1/3  truncate   flex  justify-between "
              :class="item.has ? ' cursor-pointer text-green-500 ' : ''" @click="ChangeAnim(item.animName)">
              <text>{{ item.animName }}</text>
            </div>
            <div class="  w-1/3 truncate   flex  justify-between ">
              <text>{{ item.content }}</text>
            </div>


            <div class=" hidden w-10 truncate   flex  justify-between ">
              <text>{{ item.has ? '有' : '没有' }}</text>
            </div>

            <div class=" w-10 flex text-sm  justify-between">
              <div class="cursor-pointer bg-gray-100 " @click="EditorEvent('上传', item, i)">{{ UIData.base.editor }}
                <!-- <div class="cursor-pointer bg-gray-100 " @click="EditorEvent('编辑', item, i)">{{ UIData.base.editor }} -->
              </div>
            </div>

            <div v-if="!item.has" class="  w-12 cursor-pointer text-white bg-gray-500
            hover:bg-546770" @click="EditorEvent('上传', item, i)">去上传</div>

            <div v-if="item.has" class=" ml-2 w-12 cursor-pointer text-white bg-gray-500
            hover:bg-546770" @click="EditorEvent('清除', item, i)">清除</div>

            <!-- <div v-if="item.has" class=" ml-2 w-12 cursor-pointer text-white bg-gray-500
            hover:bg-546770" @click="EditorEvent('删除', item, i)">删除</div> -->
          </div>
        </div>
        <div class=" absolute -right-5 -top-5 rounded-full w-10 h-10 bg-white text-black flex cursor-pointer "
          @click="isOpen = false;">
          <div class=" self-center mx-auto ">X</div>
        </div>
      </div>

      <!-- 技能添加弹窗 -->
      <div v-if="inAdd" class=" w-auto p-4 absolute top-0 left-0 text-white    ">

        <div v-for="(item, i) in setting" :key="i"
          class=" text-xs  text-left flex justify-between w-full h-auto mb-2     ">
          <div class=" self-center w-full  truncate">
            {{ item.title }}
          </div>
          <div class=" self-center w-32 ">
            <div v-if="item.type == 'color'" class=" flex gap-2 ">
              <YJinput_color :value="item.value" :callback="item.callback" />
            </div>

            <div v-if="item.type == 'file'" class=" relative flex  gap-2 cursor-pointer  " @click="SelectFile(item, i)">
              <img v-if=" item.value " class=" w-10 h-10    object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item.value" />
              <div class=" w-auto h-6 rounded-sm bg-gray-50 flex">
                <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
                  浏览...
                </div>
              </div>
            </div>

            <div v-if="item.type == 'upload'" v-show="item.display" class=" relative flex  gap-2 cursor-pointer  ">
              <img v-if="item.value" class=" w-full h-full" :src="item.value" />

              <YJinput_upload class=" w-32 h-16 " :accept="item.accept" :index="i" :callback="item.callback" />
            </div>


            <div v-if="item.type == 'int'" class="flex gap-2 text-black">
              <YJinput_number :value="item.value" :type="item.type" :step="item.step" :index="i"
                :callback="item.callback" />
            </div>
            <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
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

            <div v-if="item.type == 'drop'" class=" w-20 h-12 text-black ">
              <YJinput_drop class=" w-full h-full " :value="item.value" :options="item.options" :index="i"
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
        <div class=" w-40 mx-auto flex justify-between ">
          <div class="  cursor-pointer bg-black opacity-75 p-2 " @click="FloatEvent('保存')">保存</div>
          <div class="  cursor-pointer bg-black opacity-75 p-2 " @click="FloatEvent('取消')">取消</div>
        </div>
      </div>



      <div v-if="inSelect" class=" flex flex-wrap">
        <div v-for="(item, i) in imgList" :key="i" class="
                  self-center w-20 h-auto relative
                ">
          <div class=" w-16 h-16 self-center mx-auto 
                  cursor-pointer " @click="ClickUVAnim(item)">
            <img class=" w-full h-full    object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item" />
          </div>
        </div>
      </div>



    </div>


  </div>
</template>

<script>

import YJinput_color from "../components/YJinput_color.vue";
import YJinput_range from "../components/YJinput_range.vue";
import YJinput_number from "../components/YJinput_number.vue";
import YJinput_text from "../components/YJinput_text.vue";
import YJinput_toggle from "../components/YJinput_toggle.vue";
import YJinput_drop from "../components/YJinput_drop.vue";
import YJinput_vector3 from "../components/YJinput_vector3.vue";
import YJinput_upload from "../components/YJinput_upload.vue";

import { GetAllModel, UploadPlayerFile } from "../../../js/uploadThreejs.js";
import { GetAllUVAnim } from "../../../js/uploadThreejs.js";

export default {
  name: "index",

  components: {
    YJinput_text,
    YJinput_toggle,
    YJinput_drop,
    YJinput_upload,
    YJinput_vector3,
    YJinput_color,
    YJinput_range,
    YJinput_number,
  },
  data() {
    return {
      isOpen: true,
      inAdd: true,
      // 触发时机
      triggerType: [
        { label: "血量达到百分比时执行", value: "health" },
        { label: "每n秒执行", value: "perSecond" },
      ],
      //目标
      targetType: [
        { label: "无需目标", value: "none" },
        { label: "随机", value: "random" },
        { label: "当前目标", value: "target" },
        { label: "区域内", value: "area" },
      ],
      // 法术效果类型
      effectType: [
        { label: "每秒伤害 debuff", value: "perDamage" },
        { label: "直接伤害", value: "damage" },
        { label: "持续伤害", value: "contDamage" },
        { label: "增生/镜像-生成n个复制", value: "hyperplasia" },
        { label: "进化-伤害提高百分比", value: "evolution" },
      ],
      settingData: {
        skillName: "致命一击",
        // 该结构表示：每10秒对当前目标造成10点伤害
        //触发时机 每间隔n秒触发、血量达到n%触发 perSecond  health
        trigger: { type: "health", value: 20 },
        //目标
        target: { type: "target", value: 1 },// random随机 target目标 area范围攻击
        //效果 damage直接伤害、perDamage每秒伤害、contDamage持续伤害、冻结、眩晕等状态
        effect: {
          type: "damage",
          value: 100,
          time: 1,
          duration: 3,
          describe: "对目标造成100点伤害",
          icon: "",
        }, //describe技能描述，duration持续时间。perDamage、冻结、眩晕等状态效果才需要持续时间
        //技能施放的有效范围 或 范围攻击的游戏范围
        vaildDis: 100, //  
        //施放时间
        castTime: 1, // 施法时间。 秒, 0表示瞬发
        animNameReady: "two hand gun before attack", // 施法准备/读条动作
        animName: "two hand gun attack", // 施法施放动作
        //效果增强
        effectEnhance: "none",
        icon: "", //技能图标
      },
      setting: [
        { property: "skillName", display: true, title: "技能名", type: "text", value: "", callback: this.ChangeValue },
        { property: "icon", display: true, title: "图标", type: "file", value: "", callback: this.ChangeValue },

        { property: "trigger-type", display: true, title: "触发时机", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "trigger-value", display: true, title: "触发值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "target-type", display: true, title: "目标", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "target-value", display: true, title: "目标数量", type: "int", step: 1, value: 1, callback: this.ChangeValue, },

        { property: "animNameReady", display: true, title: "吟唱动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "animName", display: true, title: "施放动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "vaildDis", display: true, title: "技能施放的有效范围", type: "num", step: 1, value: 0, callback: this.ChangeValue },
        { property: "castTime", display: true, title: "吟唱时间", type: "num", step: 1, value: 0, callback: this.ChangeValue },

        { property: "effect-type", display: true, title: "技能效果", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "effect-value", display: true, title: "效果值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-time", display: true, title: "每秒间隔", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-duration", display: true, title: "持续时间", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-describe", display: true, title: "效果描述", type: "text", value: "", callback: this.ChangeValue, },
        { property: "effect-icon", display: true, title: "debuff图标", type: "file", accept: "", value: "", callback: this.ChangeValue },

      ],
      imgList: [], //用户上传图片
      inSelect: false,
      animList: [],
    };
  },
  created() { },
  mounted() {
    this.path = this.$uploadUrl;

    this.initValue(this.settingData);
  },
  methods: {
    SetVisible(b, avatarName) {
      this.isOpen = b;
      if (b) {
        this.initValue(avatarName);
      }
    },

    initValue(_settingData) {
      this.settingData = _settingData;
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "trigger-type", "options", this.triggerType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "target-type", "options", this.targetType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-type", "options", this.effectType);
      
      // return;
      this.avatarName = "女射手";
      this.animList = _Global.animList;

      //获取当前角色已存在的动作
      _Global.CreateOrLoadPlayerAnimData().GetAllAnim(this.avatarName, (temp) => {
        console.log(this.avatarName, temp);
        this.animList = [];
        for (let i = 0; i < temp.length; i++) {
          const element = temp[i];
          if(element != ""){
            this.animList.push(element);
          }
        }
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameReady", "options", this.animList);
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animName", "options", this.animList);

      });

      // this.SetSkillList(res.data);
    },
    ChangeAnim(animName) {
      this.$parent.$refs.settingPanel_player.ChangePlayerAnim(animName);
    },

    ChangeValue(i, e) {
      console.log(i, e);
      this.setting[i].value = e;
      let property = this.setting[i].property;
      let sp = property.split('-');
      if (sp.length == 1) {
        this.settingData[property] = e;
        return;
      }
      this.settingData[sp[0]][sp[1]] = e;

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
        this.$parent.$refs.settingPanel_player.SetAnimName(item);
        this.isOpen = false;
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
        this.$parent.$refs.settingPanel_player.removeAnim(item.animName);
        item.has = false;
      }
    },

    SelectFile(item) {
      console.log(" ", item);
      if (item.type == 'file') {
        this.selectProperty = item.property;
        this.inSelect = true;
        this.RequestGetAllUVAnim();
      }
    },
    ClickUVAnim(item) {
      this.Utils.SetSettingItemByProperty(this.setting, this.selectProperty, item);
      this.inSelect = false;
    },
    async RequestGetAllUVAnim() {
      this.imgList.splice(0, this.imgList.length);
      GetAllUVAnim().then((res) => {
        console.log(res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const element = txtDataList[i];
            this.imgList.push((element));
          }
        }
      });
    },
    saveAnim() {
      if (this.inAdd) {
        if (this.editorIndex == -1) {
          this.animList.push({
            animName: this.animFrom[0].value.trim(), content: this.animFrom[1].value.trim()
          });
        } else {
          this.animList[this.editorIndex].animName = this.animFrom[0].value.trim();
          this.animList[this.editorIndex].content = this.animFrom[1].value.trim();
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
  },
};
</script>