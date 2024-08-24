
// 场景设置
<template>
  <!-- 顶部 -->
  <div class=" w-full p-2 text-white ">
    <!-- 顶部工具栏 -->
    <!-- table -->
    <div class=" flex flex-col gap-3  ">

      <div class=" text-left ">环境配置</div>
      <div>
        <YJinputCtrl :setting="setting"/>
      </div> 

      <!-- 放入到开放世界 -->
      <div class=" mt-4  ">
        <div class=" mb-2 flex">
          <div class=" text-left ">放入到开放世界</div>
          <div class=" ml-2 p-2 h-6  bg-white text-black flex cursor-pointer" @click="MetaWorld('添加')">
            <div class=" self-center ">+</div>
          </div>
        </div>
        <div v-for="(item, i) in metaWorldCoordinate" :key="i" class="  w-auto h-auto relative flex  ">
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

          <div v-if="!item.vaild" class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black cursor-pointer"
            @click="MetaWorld('验证', item)">
            <div class=" self-center">验证</div>
          </div>

          <div v-if="item.vaild" class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black">
            <div class=" self-center">&#10004</div>
          </div>

          <div class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black cursor-pointer " @click="MetaWorld('删除', item, i)">
            <div class=" self-center">-</div>
          </div>

        </div>

      </div>

      <!-- 角色 -->
      <div class=" mt-4  ">
        <div class=" mb-2 flex">
          <div class=" text-left ">角色</div>
          <div class=" ml-2 p-2 h-6  bg-white text-black flex  cursor-pointer " @click="ClickHandler('添加角色')">
            <div class=" self-center ">+</div>
          </div>
        </div>
        <div class=" flex flex-wrap gap-2">
          <div v-for="(item, i) in avatarList" :key="i" class=" w-auto h-auto relative flex ">
            <div @click="ClickHandler('修改角色', item, i)" class=" w-10 h-10 bg-black cursor-pointer ">
              <img v-if="item.icon" class=" w-full h-full" :src="$uploadUrl + item.icon" />
            </div>
            <div class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black  cursor-pointer"
              @click="ClickHandler('删除角色', item, i)">
              <div class=" self-center">-</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技能 -->
      <div class=" mt-4  ">
        <div class=" mb-2 flex">
          <div class=" text-left ">技能</div>
          <div class=" ml-2 p-2 h-6  bg-white text-black flex  cursor-pointer " @click="ClickHandler('添加技能')">
            <div class=" self-center ">+</div>
          </div>
        </div>
        <div class=" flex flex-wrap gap-2">
          <div v-for="(item, i) in skillList" :key="i" class=" w-auto h-auto relative flex ">
            <div @click="ClickHandler('修改技能', item, i)" class=" w-10 h-10 bg-black cursor-pointer ">
              <img v-if="item.icon" class=" w-full h-full" :src="$uploadUVAnimUrl + item.icon" />
            </div>
            <div class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black  cursor-pointer"
              @click="ClickHandler('删除技能', item, i)">
              <div class=" self-center">-</div>
            </div>
          </div>
        </div>
      </div>

      <div class=" mt-4  ">
        <div class=" mb-2 flex">
          <div class=" text-left ">道具</div>
          <div class=" ml-2 p-2 h-6  bg-white text-black flex  cursor-pointer " @click="ClickHandler('添加道具')">
            <div class=" self-center ">+</div>
          </div>
        </div>
        <div class=" flex flex-wrap gap-2">
          <div v-for="(item, i) in propList" :key="i" class=" w-auto h-auto relative flex ">
            <div @click="ClickHandler('修改道具', item, i)" class=" w-10 h-10 bg-black cursor-pointer ">
              <img v-if="item.icon" class=" w-full h-full" :src="$uploadUVAnimUrl + item.icon" />
            </div>
            <div class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black  cursor-pointer"
              @click="ClickHandler('删除道具', item, i)">
              <div class=" self-center">-</div>
            </div>
          </div>
        </div>
      </div>

      

      <!-- icon和启动画面 -->
      <div class=" mt-4  ">
        <div class="  ">
          <div class=" text-left ">icon</div>
          <div class=" flex ">
            <div class=" w-16 h-16 relative flex  gap-2 cursor-pointer  ">
              <YJinput_upload scene="scene" index="icon" :folderBase="folderBase" :fileName="thumbName" accept=".jpg,.png" :callback="ChangeImage" />
            </div>
            <div  class=" w-10 h-10 bg-black cursor-pointer ">
              <img v-if="thumbUrl" class=" w-full h-full" :src="thumbUrl" />
            </div>
          </div>
        </div>
        
        <div class=" mt-2 ">
          <div class=" text-left ">loading</div>
          <div class=" flex ">
            <div class=" w-16 h-16 relative flex  gap-2 cursor-pointer  ">
              <YJinput_upload scene="scene" index="loading" :folderBase="folderBase" :fileName="loadingName" accept=".jpg,.png" :callback="ChangeImage" />
            </div>
            <div   class=" w-10 h-10 bg-black cursor-pointer ">
              <img v-if="loadingUrl" class=" w-full h-full" :src="loadingUrl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  
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

  <skillItemEditorPanel ref="skillItemEditorPanel" />
  <propItemEditorPanel ref="propItemEditorPanel" />
</template>

<script>

import YJinput_toggle from "../components/YJinput_toggle.vue";
import YJinput_color from "../components/YJinput_color.vue";
import YJinput_range from "../components/YJinput_range.vue";
import YJinput_upload from "../components/YJinput_upload.vue";

import YJinputCtrl from "../components/YJinputCtrl.vue";

import skillItemEditorPanel from "../panels/skillItemEditorPanel.vue";
import propItemEditorPanel from "../panels/propItemEditorPanel.vue";

import { GetAllHDR, RequestMetaWorld } from "../../../js/uploadThreejs.js";

export default {
  name: "settingpanel",
  props: ["isScene"],
  components: {
    YJinput_toggle,
    YJinput_color,
    YJinput_range,
    YJinput_upload,
    YJinputCtrl,
    skillItemEditorPanel,
    propItemEditorPanel,
  },
  data() {
    return {
      // 场景设置
      setting: [
        { property: "setting-onlyLandscape", display: true, title: "是否强制横屏", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "setting-hasSceneHDR", display: true, title: "启用环境hdr", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "setting-envSceneHDRPath", display: true, title: "环境hdr", type: "file",filetype:"hdr", value: "" },
        { property: "setting-hasEnvmap", display: true, title: "启用全景球", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "setting-envmapPath", display: true, title: "全景球hdr", type: "file",filetype:"hdr", value: "" },
        { property: "setting-hasBGM", display: true, title: "启用背景音乐", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "setting-BGMurl", display: true, title: "背景音乐", type: "file",filetype:"audio", value: "" },
        { property: "setting-useBloom", display: true, title: "启用辉光", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "bloomData-bloomTexStrength", display: false, title: "辉光贴图强度", type: "num",step:0.1, value: "0.1", callback: this.ChangeValue },
        { property: "setting-enabledGravity", display: true, title: "启用重力", type: "toggle", value: false, callback: this.ChangeValue },
        
        { property: "AmbientLightData-backgroundColor", display: true, title: "画布背景色", type: "color", value: "#A7D0FF", callback: this.ChangeValue },
        // { property: "AmbientLightData-ambientColor", display: true, title: "环境光颜色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        { property: "AmbientLightData-AmbientLightIntensity", display: true, title: "环境光强度", type: "slider", value: 1, step: 0.1, min: 0, max: 2, callback: this.ChangeValue },
        { property: "AmbientLightData-hasFog", display: true, title: "启用雾效", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "AmbientLightData-fogColor", display: true, title: "雾颜色", type: "color", value: "#A7D0FF", callback: this.ChangeValue },
        { property: "AmbientLightData-fogNear", display: true, title: "雾近距离", type: "int", value: "30", callback: this.ChangeValue },
        { property: "AmbientLightData-fogFar", display: true, title: "雾远距离", type: "int", value: "250", callback: this.ChangeValue },
        // { property: "AmbientLightData-DirectionalLightIntensity", display: true, title: "太阳光强度", type: "slider", value: 1, step: 0.1, min: 0, max: 2, callback: this.ChangeValue },
        
        { property: "shadowData-resource", display: true, title: "阴影分辨率", type: "int", value: "256", callback: this.ChangeValue },
        
        { property: "hasGrid", display: true, title: "启用grid", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "hasFloor", display: true, title: "启用默认地面", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "setting-hasCamRaycast", display: true, title: "启用摄像机遮挡", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "setting-multiGame", display: true, title: "启用多人模式", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "setting-hasAvatar", display: true, title: "启用第三人称角色", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "setting-hasHUD", display: true, title: "是否有界面", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "setting-targetRota", display: true, title: "上下角度限制", type: "vector2xy", step:0.01, value: true, callback: this.ChangeValue },
        // { property: "setting-cameraOffset", display: true, title: "视角中心偏移", type: "vector3xyz", step:0.01, value: true, callback: this.ChangeValue },
        {
          property: "setting-gameType", display: true, title: "游戏类型", type: "drop", value: 'WOW', options: [
            // { value: 'Roguelike', label: '肉鸽' },
            { value: 'DMRoguelike', label: '弹幕肉鸽' },
            // { value: 'DMGame', label: '塔防' },
            { value: 'MMD', label: '数字人' }, 
            { value: 'WOW', label: 'MMORPG' }, 
          ], callback: this.ChangeValue,
        },
        {
          property: "user-camp", display: false, title: "阵营", type: "drop", value: 1000, options: [
            // { value: 1000, label: '联盟npc' },
            // { value: 1001, label: '部落npc' },
            { value: 10000, label: '部落' },
            { value: 1000, label: '联盟' },
            // { value: 9000, label: '中立' },
          ], callback: this.ChangeValue,
        },
        {
          property: "controllerType", display: false, title: "控制方式", type: "drop", value: 1000, options: [
            { value: 1000, label: 'wow' },
            { value: 1001, label: 'roguelike' },
          ], callback: this.ChangeValue,
        },
        // {
        //   property: "setting-projection", display: true, title: "投影", type: "drop", value: 'perspective', options: [
        //     { value: 'orthographic', label: 'orthographic' },
        //     { value: 'perspective', label: 'perspective' },
        //   ], callback: this.ChangeValue,
        // }, 
      ],
      sceneData: {
       
      },
      avatarList: [],
      skillList: [],
      propList: [],
      thumbUrl: "",
      thumbName:"",
      loadingName:"",
      loadingUrl: "", 
      folderBase:"",
      // metaWorldCoordinate: [{ x: 0, y: 0, vaild: true }],
      metaWorldCoordinate: [],
    };
  },
  created() {

    this.parent = this.$parent.$parent;
  },
  mounted() {

    setTimeout(() => {
      this.thumbName =    "thumb.jpg";
      this.loadingName =   "loading.jpg";
      
      this.thumbUrl = this.$uploadSceneUrl + this.parent.folderBase + "/" +this.thumbName;
      this.loadingUrl = this.$uploadSceneUrl + this.parent.folderBase + "/" +this.loadingName;

      this.folderBase =  this.parent.folderBase;
      this.sceneData = this.parent.sceneData;
      if (this.sceneData.avatarList == undefined) {
        this.sceneData.avatarList = [];
      }
      if (this.sceneData.skillList == undefined) {
        this.sceneData.skillList = [];
      }
      this.avatarList = this.sceneData.avatarList;
      this.skillList = this.sceneData.skillList;
      _Global.skillList = this.skillList;

      if (this.sceneData.propList == undefined) {
        this.sceneData.propList = [];
      }

      if (this.sceneData.hasGrid == undefined) {
        this.sceneData.hasGrid = true;
      }
      
      this.propList = this.sceneData.propList;
      // _Global.propList = this.propList;
      
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.sceneData); 

      this.ChangeUIState();

      if (this.sceneData.metaWorldCoordinate != undefined) {
      } else {
        this.sceneData.metaWorldCoordinate = [];
      }
      this.metaWorldCoordinate = this.sceneData.metaWorldCoordinate;

    }, 2000);

  },
  methods: {

    AddSkill(skill) {
      this.skillList.push(skill);
    },
    AddProp(item){
      this.propList.push(item);
    },
    load(item, modelType) {
      console.log(item, modelType);
      if (modelType == "装备模型") {
        return;
      }
      if (modelType == "角色模型") {
        this.avatarList.push({ folderBase: item.folderBase, icon: item.icon });
        return;
      }

    },
    ClickHandler(e, item, i) {
      if (e == "添加角色") {
        this.parent.$refs.modelSelectPanel.Init("角色模型");
      }
      if (e == "删除角色") {
        this.avatarList.splice(i, 1);
      }


      if (e == "添加技能") {
        this.parent.$refs.skillSelectPanel.SetVisible(true);
      }
      if (e == "修改技能") {
        this.skillIndex = i;
        this.$refs.skillItemEditorPanel.dialogTitle = "编辑技能";
        this.$refs.skillItemEditorPanel.initValue(JSON.parse(JSON.stringify(item)));
        this.$refs.skillItemEditorPanel.displayTriggerType(); 
      }
      if (e == "删除技能") {
        this.skillList.splice(i, 1);
      }


      if (e == "添加道具") {
        this.parent.$refs.propSelectPanel.SetVisible(true);
      }
      if (e == "修改道具") {
        this.propIndex = i;
        this.$refs.propItemEditorPanel.dialogTitle = "编辑道具";
        this.$refs.propItemEditorPanel.initValue(JSON.parse(JSON.stringify(item)));
      }
      if (e == "删除道具") {
        this.propList.splice(i, 1);
      }



    },
    saveSkill(skillData){
      this.skillList[this.skillIndex] = skillData;
    },
    saveProp(item){
      this.propList[this.propIndex] = item;
    },

    MetaWorld(e, item, i) {
      if (e == "添加") {
        this.metaWorldCoordinate.push({ x: 0, y: 0, vaild: false });
      }
      if (e == "验证") {

        //发送到后台增加
        let fromData = new FormData();
        //服务器中的本地地址
        fromData.append("mapId", _Global.ReportTo3D("坐标转地图id", { x: item.x, z: item.y }));
        fromData.append("folderBase", this.parent.folderBase);
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
            this.parent.addMetaWorldCoordinate(item);
          }
        });

      }
      if (e == "删除") {
        if (item.vaild) {
          //发送到后台取消
          let fromData = new FormData();
          //服务器中的本地地址
          fromData.append("mapId", _Global.ReportTo3D("坐标转地图id", { x: item.x, z: item.y }));
          fromData.append("folderBase", this.parent.folderBase);
          let msg = {
            type: "删除",
          }
          let s = JSON.stringify(msg);
          fromData.append("msg", s);
          RequestMetaWorld(fromData).then((res) => {
            console.log(res);
            item.vaild = false;
            this.metaWorldCoordinate.splice(i, 1);
            this.parent.updateSceneData();
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
          fromData.append("folderBase", this.parent.folderBase);
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

    ChangeUIState() {
      // 根据选择判断哪些属性不显示

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "setting-envSceneHDRPath", "display",
        this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-hasSceneHDR'));

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "setting-envmapPath", "display",
        this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-hasEnvmap'));

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "setting-BGMurl", "display",
        this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-hasBGM'));

      let hasFog = this.Utils.GetSettingItemValueByProperty(this.setting, 'AmbientLightData-hasFog');
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "AmbientLightData-fogColor", "display", hasFog );
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "AmbientLightData-fogNear", "display", hasFog );
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "AmbientLightData-fogFar", "display", hasFog );


        let useBloom  = this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-useBloom');
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "bloomData-bloomTexStrength", "display", useBloom );
        
        
    },
    ChangeImage(type, e) {
      console.log(type, e);
      if (type == "icon") {
        this.thumbUrl = this.$uploadSceneUrl + this.folderBase + "/" + this.thumbName+'?time='+new Date().getTime();
      }
      if (type == "loading") {
        this.loadingUrl = this.$uploadSceneUrl + this.folderBase + "/" + this.loadingName+'?time='+new Date().getTime();
      }
      
    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;

      console.log(i, property, e);

      let sp = property.split('-');
      if (sp.length == 3) {
        if(this.sceneData[sp[0]][sp[1]] == undefined){
          this.sceneData[sp[0]][sp[1]] = {};
        }
        this.sceneData[sp[0]][sp[1]][sp[2]] = e;
      }else if (sp.length == 1) {
        this.sceneData[sp[0]] = e;
      } else {
        if(this.sceneData[sp[0]] == undefined){
          this.sceneData[sp[0]] = {};
        }
        this.sceneData[sp[0]][sp[1]] = e;
      }

      this.ChangeUIState();

      if (property == "AmbientLightData-AmbientLightIntensity") {
        _Global.YJ3D._YJSceneManager.SetAmbientIntensity(e);
      }
      if (property == "AmbientLightData-DirectionalLightIntensity") {
        _Global.YJ3D._YJSceneManager.SetDirectionalIntensity(e);
      }
      
      if (property == "AmbientLightData-backgroundColor") {
        _Global.SetBackgroundColor(e);
      }
      
      if (property == "AmbientLightData-ambientColor") {
        _Global.YJ3D._YJSceneManager.SetAmbientColor(e);
      }

      if (property == "hasFloor") {
        this.sceneData.hasFloor = e;
        _Global.YJ3D._YJSceneManager.SetDisplayFloor(e);
      }
      
      if (property == "hasGrid") {
        this.sceneData.hasGrid = e;
        _Global.YJ3D._YJSceneManager.ToggleGrid(e);
      }
      
      if (property == "setting-hasEnvmap") {
        _Global.enableHDR(
          this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-hasEnvmap'),  
          this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-envmapPath'), 
          false);
      }
      if (property == "setting-hasSceneHDR") {
        _Global.enableHDR(
          this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-hasSceneHDR'),  
          this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-envSceneHDRPath'),  
          true);
      }
      if (property == "setting-hasBGM") {
        this.sceneData.setting.hasBGM = e;
      }
      if (property == "setting-targetRota") {
        _Global.YJ3D.YJController.SetMinMax(e); 
      }
      if (property == "setting-hasCamRaycast") {
        _Global.YJ3D.YJController.SetSetting(this.sceneData.setting); 
      }
      
      if (property == "setting-projection") {
        _Global.YJ3D.changeProjection(e);
      }
      if(property.toLowerCase().includes("fog")){
        _Global.SendMsgTo3D("设置雾",{
          visible:this.Utils.GetSettingItemValueByProperty(this.setting, 'AmbientLightData-hasFog'),
          color:this.Utils.GetSettingItemValueByProperty(this.setting, 'AmbientLightData-fogColor'),
          near:this.Utils.GetSettingItemValueByProperty(this.setting, 'AmbientLightData-fogNear'),
          far:this.Utils.GetSettingItemValueByProperty(this.setting, 'AmbientLightData-fogFar'),
        });
      } 
    }, 
    ClickHDR(i,hdrUrl) {
      this.setting[i].value = hdrUrl;
      if (this.setting[i].title == "环境hdr") {
        //更新到三维
        _Global.enableHDR(
          this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-hasSceneHDR'),  
          this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-envSceneHDRPath'),  
          true);
        // 保存到setting
        this.sceneData.setting.envSceneHDRPath =  this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-envSceneHDRPath');
      }
      if (this.setting[i].title == "全景球hdr") {
        _Global.enableHDR(
          this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-hasEnvmap'),  
          this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-envmapPath'), 
          false);
        this.sceneData.setting.envmapPath = this.Utils.GetSettingItemValueByProperty(this.setting, 'setting-envmapPath');
      }
 
    }, 
    ClickUVAnim(i,e){
      
      this.setting[i].value = e;
      let property = this.setting[i].property;
      
      if (property == "setting-BGMurl") {
        this.sceneData.setting.BGMurl = e;
      }
      console.log(" property " ,property,e );
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
