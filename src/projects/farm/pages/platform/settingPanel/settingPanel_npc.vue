
<template>
  <div class="w-full max-w-md p-2 h-full   text-white rounded-lg ">
    <div class="text-left">npc 设置</div>
    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div> 

    <settingPanel_npcSkill ref="settingPanel_npcSkill" />

    <div v-if="!isMoving" class=" mt-4 flex">
      <div class=" text-left ">巡逻点</div>
      <div class=" ml-2 p-2 h-6  bg-white text-black flex cursor-pointer" @click="ClickHandler('添加')">
        <div class=" self-center ">+</div>
      </div>
    </div>

    <div v-if="!isMoving" v-for="(item, i) in settingData.movePos" :key="i" class="
                   w-auto h-auto relative flex
                ">
      <div class="   w-6 h-6 ">
        X:
      </div>
      <input class=" w-16  h-6 bg-transparent border-px placeholder-gray-400 p-1" type="number" v-model="item.x"
        :placeholder="item.x" @change="ClickHandler('值改变', item, i)" />
      <div class="   w-6 h-6 ">
        Y:
      </div>
      <input class=" w-16  h-6 bg-transparent border-px placeholder-gray-400 p-1" type="number" v-model="item.y"
        :placeholder="item.y" @change="ClickHandler('值改变', item, i)" />

      <div class="   w-6 h-6 ">
        Z:
      </div>
      <input class=" w-16  h-6 bg-transparent border-px placeholder-gray-400 p-1" type="number" v-model="item.z"
        :placeholder="item.z" @change="ClickHandler('值改变', item, i)" />

      <div class=" ml-2 flex  h-6 p-1 text-sm bg-white text-black cursor-pointer " @click="ClickHandler('删除', item, i)">
        <div class=" self-center">-</div>
      </div>

    </div>




    <div class="mt-2 w-full h-10 text-white cursor-pointer" @click="ClickHandler(isMoving ? '停止巡逻' : '开始巡逻')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        {{ isMoving ? '停止巡逻' : '开始巡逻' }}
      </div>
    </div>

    <div class=" hidden w-full h-10 text-white cursor-pointer" @click="ClickHandler('设置为npc目标')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        你过来呀
      </div>
    </div>

    <div class=" hidden w-full h-10 text-white cursor-pointer" @click="ClickHandler('设置npc失去目标')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        饶命啊
      </div>
    </div>

    <div class="mt-2 w-full h-10 text-white cursor-pointer" @click="ClickHandler('刷新装备')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">刷新装备</div>
    </div>

    <div class="mt-2 w-full h-10 text-white cursor-pointer" @click="ClickHandler('保存')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">保存</div>
    </div>
  </div>
</template>

<script>
import YJinputCtrl from "../components/YJinputCtrl.vue";

import settingPanel_npcSkill from "./settingPanel_npcSkill.vue";


export default {
  name: "settingpanel_uvanim",
  components: {
    YJinputCtrl,
    settingPanel_npcSkill,
  },
  data() {
    return {
      pointType: "npc",
      movePos: [
        { x: 0, y: 0, z: 0 },
      ], //巡逻坐标点，随机顺序
      baseData: {
        camp: "bl",
        state: 'normal', //状态
        speed: 8, //移动速度
        level: 1, //等级
        health: 100, //生命值
        maxHealth: 100, //生命值 
        strength: 20, //力量
      },
      settingData: {
        name: "",
        baseData: {
          camp: "bl",
          type: "normal", //类型：普通无边框、稀有、精英，normal\rare\elite
          state: 'normal', //状态
          speed: 8, //移动速度
          level: 1, //等级
          health: 100, //生命值
          maxHealth: 100, //生命值
          strength: 20, //力量
        },
        defaultAnim: "idle", //默认动作
        relifeTime: 0,//重新生成间隔时间 秒
        avatarData: {}, //avatar模型数据
        eventType: "no",//事件类型 
        contentData: {},//事件内容数据
        inAreaRandom:false, //是否区域内随机
        canMove:true, //是否能移动
        canEquip:false, //是否能装备
        areaRadius:1, //区域半径
        movePos: [
          { x: 0, y: 0, z: 0 },
        ], //巡逻坐标点，随机顺序 
        equipList:[],//装备，含武器
        fireAudio:"", //攻击音效
        deadAudio:"", //死亡音效
        exp:30,
      },
      // npc行为
      npcActionData: {

      },

      avatar: null,
      selectCurrentIndex: 0,
      setting: [
        { property: "name", display: true, title: "名称", type: "text", value: "", callback: this.ChangeValue, },
        {
          property: "baseData-camp", display: true, title: "阵营", type: "drop", value: 10000, options: [
            // { value: 1000, label: '联盟npc' },
            // { value: 1001, label: '部落npc' },
            { value: 10000, label: '敌对' },
            { value: 10001, label: '友善' },
            { value: 10002, label: '中立' },
            { value: 1000, label: '阵营1000' },
            { value: 1001, label: '阵营1001' },
            { value: 1002, label: '阵营1002' },
            { value: 1003, label: '阵营1003' },
            { value: 1004, label: '阵营1004' },
            { value: 1005, label: '阵营1005' },
            { value: 1006, label: '阵营1006' },
            { value: 1007, label: '阵营1007' },
            { value: 1008, label: '阵营1008' },
          ], callback: this.ChangeValue,
        },
        {
          property: "baseData-type", display: true, title: "难度", type: "drop", value: "普通", options: [
            { value: 'normal', label: '普通' },
            { value: 'rare', label: '稀有' },
            { value: 'elite', label: '精英' },
          ], callback: this.ChangeValue,
        },
        { property: "baseData-maxHealth", display: true, title: "生命值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "baseData-strength", display: true, title: "攻击力", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "baseData-level", display: true, title: "等级", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        
        { property: "avatar", display: true, title: "角色", type: "file", filetype: "avatar", value: "", callback: this.ClickHandler, },
        { property: "canEquip", display: true, title: "是否能装备", type: "toggle", value: false, callback: this.ChangeValue },
        // { property: "weapon", display: false, title: "武器", type: "file", filetype: "weapon", value: "", callback: this.ClickHandler, },
        { property: "equip", display: false, title: "装备", type: "file", filetype: "equip", value: "", callback: this.ClickHandler, },
        { property: "equipList", display: false, title: "已有装备", type: "equipList", value: "", callback: this.ClickHandler, },
        { property: "relifeTime", display: true, title: "死亡后重新生成间隔时间(0表示不重新生成)", type: "num", step: 1, value: 0, callback: this.ChangeValue },
        { property: "inAreaRandom", display: true, title: "是否区域内随机移动", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "canMove", display: true, title: "是否能移动", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "areaRadius", display: false, title: "区域半径",unit:"m", type: "slider", value: 1, min: 0, max: 5, step: 0.1, callback: this.ChangeValue },
        { property: "fireAudio", display: true, title: "攻击音效", type: "file",filetype:"audio", value: "" },
        { property: "deadAudio", display: true, title: "死亡音效", type: "file",filetype:"audio", value: "" },
        { property: "exp", display: true, title: "击杀后玩家获取经验值", type: "int", step: 1, value: 30, callback: this.ChangeValue, },

      ],
      isMoving: true,

    };
  },
  created() {

    this.parent = this.$parent.$parent;
  },
  mounted() {
    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      return;
    }
    if (modelData.message == undefined) {
      this.settingData.id = this.parent.folderBase + "";
      return;
    }
    this.folderBase = modelData.folderBase;

    console.log(" modelData = ", modelData);
    this.settingData = modelData.message.data;
    // this.settingData.baseData = undefined; //重置数据时解除注释
    if (!this.settingData.baseData) {
      this.settingData.baseData = this.baseData;
    }
    if (!this.settingData.movePos) {
      this.settingData.movePos = this.movePos;
    }

    
    this.settingData.name = modelData.name;
    this.initValue();
  },
  methods: {
    ClickHandler(e, item, i) {

      if (e == "停止巡逻" || e == "开始巡逻") {
        this.isMoving = !this.isMoving;
        this.transfomJS.GetComponent("NPC")
          .UpdateNavPos(e, this.settingData.movePos);
        return;
      }

      if (e == "删除") {
        if (i == 0) { return; }
        this.settingData.movePos.splice(i, 1);
        //在场景中添加巡逻位置参考坐标点
        this.transfomJS.GetComponent("NPC")
          .UpdateNavPos(e, null, i);
        return;
      }
      if (e == "添加") {

        this.settingData.movePos.push({ x: 0, y: 0, z: 0 });
        //在场景中添加巡逻位置参考坐标点
        this.transfomJS.GetComponent("NPC")
          .UpdateNavPos(e, { x: 0, y: 0, z: 0 });
        return;
      }
      if (e == "值改变") {
        if (i == 0) { item.x = item.y = item.z = 0; return; }
        this.transfomJS.GetComponent("NPC")
          .UpdateNavPos("更新", item, i);
        // this.settingData.movePos[i].
        return;
      } 
      if (e == "保存") {
        this.save();
      }
      if (e == "刷新装备") {
        this.reload();
      }
      
      if (e == "设置为npc目标") {
        this.transfomJS.GetComponent("NPC")
          .SetNpcTarget(_Global.YJ3D.YJPlayer, true, true);
      }
      if (e == "设置npc失去目标") {
        this.transfomJS.GetComponent("NPC")
          .SetNpcTarget(null);
      }

    },
    async reload(){
      console.log(" 获取 this.settingData ",this.settingData);

      let res = await this.$axios.get(
        this.$uploadUrl + this.settingData.id+"/data.txt" +
          "?time=" +
          new Date().getTime()
      );
      console.log(" 获取 npc ",res);
      this.settingData.equipList = res.data.message.data.equipList;
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "equipList","display", this.settingData.equipList.length>0);

      this.transfomJS.GetComponent("NPC").SetMessage(this.settingData);
      this.save();
      // 用folderBase查找最新数据
       
    },
    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { },
    // 从单品编辑跳转过来后更新UI值
    initValue() {
      this.Init(this.settingData);
    },
    load(item, modelType) {
      console.log(item, modelType); 
      if (modelType == "装备模型") {
        //npc换 装备模型
        let part = item.message.data.partType || item.message.data.pickType;
        let has = false;
        let equipData = null;
        for (let i = 0; i < this.settingData.equipList.length && !has; i++) {
          const element = this.settingData.equipList[i];
          if(element.part == part){
            has = true;
            element.modelPath = item.modelPath;
            element.folderBase = item.folderBase;
            element.icon = item.icon;
            equipData = element;
          }
        }
        if(!has){
          equipData = {part:part,modelPath:item.modelPath,icon:item.icon,folderBase:item.folderBase};
          this.settingData.equipList.push(equipData);
        }

        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "equipList","display", this.settingData.equipList.length>0);
 
        this.transfomJS.GetComponent("NPC").GetEquip().addEquip({ assetId:item.folderBase});

        return;
      }


      if (modelType != "角色模型") { return; }
      //npc换角色模型
      this.settingData.avatarData = item.message.data;
      this.settingData.avatarData.modelPath = this.$uploadUrl + item.modelPath;

      this.Utils.SetSettingItemByProperty(this.setting, "avatar", this.settingData.avatarData.id+"/thumb.png");

      this.save();

      //区分首次加载和第二次加载，首次加载直接创建，第二次加载修改第一次加载的内容
 
      if (this.transfomJS == null || this.transfomJS == undefined) {
        //加载模型
        _Global.YJ3D._YJSceneManager.CreateSingleModel(
          item.modelPath,
          () => {
            this.parent.SetTip("加载模型完成");
            setTimeout(() => {
              // 控制三维
              this.transfomJS
                .SetMessage(this.getMessage());
            }, 1000);
          },
          (e) => {
            this.$parent.SetTip("出错了。加载模型出错，" + e);
          }
        );
      } else {
        let MeshRenderer = this.transfomJS.GetComponent("MeshRenderer");
        MeshRenderer.Destroy();
        let modelPath = this.$uploadUrl + item.modelPath;

        console.log(" modelPath ", modelPath);
        MeshRenderer.load(
          modelPath,
          (scope) => {
            let _YJAnimator = this.transfomJS.GetComponent("Animator");
            _YJAnimator.Destroy();
            _YJAnimator.UpdateModel(scope.GetModel(), scope.GetAnimations()); 
            this.transfomJS.SetMessage(this.getMessage());
            _YJAnimator.ChangeAnimDirect("idle");
            _Global.applyEvent("选中角色",this.transfomJS.GetComponent("NPC"));

          },
          (e) => { }
        );
      }
    },
    updateName(v) {
      this.settingData.name = v;
      this.parent.modelData.message = this.getMessage();

      // 控制三维 
      this.transfomJS.SetMessage(this.getMessage());
    },
    Init(_settingData) {

      this.transfomJS = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();

      this.settingData = _settingData;
      this.settingData.canEquip = false;
      if (this.settingData.equipList == undefined) {
        this.settingData.equipList = [];
      } 
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

      let hasEquip = false;

      hasEquip = this.settingData.equipList.length>0;

      if(hasEquip){
        this.settingData.canEquip = true;
      }
      this.settingData.weapon = undefined;
      this.settingData.weaponData = undefined;

      this.Utils.SetSettingItemByProperty(this.setting, "avatar", this.settingData.avatarData.id + "/thumb.png");
      this.Utils.SetSettingItemByProperty(this.setting, "equipList", this.settingData.equipList);
      this.Utils.SetSettingItemByProperty(this.setting, "canEquip", this.settingData.canEquip);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "canEquip", "value",this.settingData.canEquip);

      if (this.$refs.settingPanel_npcSkill) {
        this.$refs.settingPanel_npcSkill.initValue();
      }
      console.log(" npc setting data ", _settingData);
      this.ChangeUIState();

    },
    
    ChangeUIState() {
      // 根据选择判断哪些属性不显示
       
      let canEquip = this.Utils.GetSettingItemValueByProperty(this.setting, 'canEquip');
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "equip", "display",canEquip);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "equipList", "display",canEquip);

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "areaRadius", "display",
        this.Utils.GetSettingItemValueByProperty(this.setting, 'inAreaRandom'));
        
    },
    // 改变UI输入值后刷新
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;
      let sp = property.split('-');
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }

      if (property == "baseData-maxHealth") {
        this.settingData.baseData['health'] = e;
      } 

      if (property == "name" || property == "baseData-camp" ||property == "baseData-type" ) {
         
        
        // 控制三维
        this.transfomJS.SetMessage(this.getMessage());
          let npc = this.transfomJS.GetComponent("NPC");
          //更新到头像上
          _Global.applyEvent("选中角色",npc);
          npc.ResetNameColor();
           
          _Global.applyEvent("改变modelId或名称", this.transfomJS.GetData());
      }
      this.ChangeUIState();

      // console.log(i + " " + this.setting[i].value);
    },
    ClickItem(e, i){
      if (e == "移除装备") {

        let equipData =  this.settingData.equipList[i];
        this.settingData.equipList.splice(i,1);
        // //加载武器并让角色使用
        this.transfomJS.GetComponent("NPC").GetEquip().UnWearEquip(equipData.part);
        return;
      }
    },
    ClickUVAnim(i, e) {

      this.setting[i].value = e;
      let property = this.setting[i].property;

      // this.Utils.SetSettingItemByProperty(this.setting, this.setting[i].property, e);
      let sp = property.split('-');
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }

      if (this.setting[i].property == "avatar") {
        this.load(e,"角色模型");
      }
      if (this.setting[i].property == "equip") {
        this.load(e,"装备模型");
      }
      
       
    },
    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    save() {
      // 单品中才有 updateModelTxtData
      if (this.parent.updateModelTxtData) {
        this.parent.modelData.message = this.getMessage();
        this.parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },

    // 设置角色眼睛高度
    SetEyeHeight() {
      _Global.YJ3D.YJController.SetTargetHeight(
        height
      );
    },

    Update() {
      this.transfomJS.SetMessage(
        this.getMessage()
      );
      // 调用场景保存
      if (this.parent.updateSceneModelData) {
        this.parent.updateSceneModelData();
      }
    },
  },
};
</script>

<style scoped></style>
