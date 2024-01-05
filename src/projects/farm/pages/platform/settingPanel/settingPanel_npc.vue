
<template>
  <div class="w-full max-w-md p-2 text-white rounded-lg overflow-hidden">
    <div class="text-left">npc 设置</div>

    <div v-for="(item, i) in setting" :key="i" class="text-xs text-left flex w-full h-auto mb-2">
      <div class="self-center w-1/2 truncate" v-show="item.display">
        {{ item.title }}
      </div>
      <div class="self-center w-20" v-show="item.display">
        <div v-if="item.type == 'text'" class="w-32 h-auto text-black">
          <YJinput_text class="w-full h-auto" :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'drop'" class=" w-16 h-12 text-black ">
          <YJinput_drop class=" w-32 h-12 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>
        <div v-if="item.type == 'int'" class="flex gap-2 text-black">
          <YJinput_number :value="item.value" :type="item.type" :step="item.step" :index="i" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <YJinput_number :value="item.value" :type="item.type" :step="item.step" :index="i" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'image'" class="flex gap-2 text-black">
          <div @click="item.callback('加载武器模型')" class=" w-10 h-10 bg-black cursor-pointer ">
            <img v-if="item.value" class=" w-full h-full" :src="item.value" />
          </div>
          <div v-if="item.value" class=" h-4 w-10 bg-white cursor-pointer" @click="item.callback('移除武器模型', item)">移除</div>
        </div>
      </div>
    </div>

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


    <settingPanel_npcSkill ref="settingPanel_npcSkill" />


    <div class="mt-10 w-full h-10 text-white cursor-pointer" @click="ClickHandler(isMoving ? '停止巡逻' : '开始巡逻')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        {{ isMoving ? '停止巡逻' : '开始巡逻' }}
      </div>
    </div>

    <div class=" w-full h-10 text-white cursor-pointer" @click="ClickHandler('设置为npc目标')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        你过来呀
      </div>
    </div>

    <div class=" w-full h-10 text-white cursor-pointer" @click="ClickHandler('设置npc失去目标')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        饶命啊
      </div>
    </div>

    <div class=" w-full h-10 text-white cursor-pointer" @click="ClickHandler('加载角色模型')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        加载角色模型
      </div>
    </div>

    <div class="mt-2 w-full h-10 text-white cursor-pointer" @click="ClickHandler('保存')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">保存</div>
    </div>
  </div>
</template>

<script>
import YJinput_text from "../components/YJinput_text.vue";
import YJinput_number from "../components/YJinput_number.vue";
import YJinput_drop from "../components/YJinput_drop.vue";
import settingPanel_npcSkill from "./settingPanel_npcSkill.vue";


export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_text,
    YJinput_number,
    YJinput_drop,
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
        strength: 20, //攻击力
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
          strength: 20, //攻击力
        },
        defaultAnim: "idle", //默认动作
        relifeTime: 0,//重新生成间隔时间 秒
        avatarData: {}, //avatar模型数据
        eventType: "no",//事件类型 
        contentData: {},//事件内容数据
        movePos: [
          { x: 0, y: 0, z: 0 },
        ], //巡逻坐标点，随机顺序
        //武器 
        weaponData: {},
      },
      // npc行为
      npcActionData: {

      },

      avatar: null,
      selectCurrentIndex: 0,
      setting: [
        { property: "name", display: true, title: "npc名称", type: "text", value: "", callback: this.ChangeValue, },
        {
          property: "camp", display: true, title: "阵营", type: "drop", value: 10000, options: [
            // { value: 1000, label: '联盟npc' },
            // { value: 1001, label: '部落npc' },
            { value: 10000, label: '敌对' },
            { value: 1000, label: '友善' },
            // { value: 9000, label: '中立' },
          ], callback: this.ChangeValue,
        },
        {
          property: "type", display: true, title: "难度", type: "drop", value: "普通", options: [
            { value: 'normal', label: '普通' },
            { value: 'rare', label: '稀有' },
            { value: 'elite', label: '精英' },
          ], callback: this.ChangeValue,
        },
        { property: "maxHealth", display: true, title: "生命值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "strength", display: true, title: "攻击力", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "level", display: true, title: "等级", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "weapon", display: true, title: "装备", type: "image", value: 1, callback: this.ClickHandler, },
        { property: "relifeTime", display: true, title: "重新生成间隔时间", type: "num", step: 1, value: 0, callback: this.ChangeValue },
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
        _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("NPC")
          .UpdateNavPos(e, this.settingData.movePos);
        return;
      }

      if (e == "删除") {
        if (i == 0) { return; }
        this.settingData.movePos.splice(i, 1);
        //在场景中添加巡逻位置参考坐标点
        _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("NPC")
          .UpdateNavPos(e, null, i);
        return;
      }
      if (e == "添加") {

        this.settingData.movePos.push({ x: 0, y: 0, z: 0 });
        //在场景中添加巡逻位置参考坐标点
        _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("NPC")
          .UpdateNavPos(e, { x: 0, y: 0, z: 0 });
        return;
      }
      if (e == "值改变") {
        if (i == 0) { item.x = item.y = item.z = 0; return; }
        _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("NPC")
          .UpdateNavPos("更新", item, i);
        // this.settingData.movePos[i].
        return;
      }


      if (e == "加载武器模型") {
        this.parent.$refs.modelSelectPanel.Init("装备模型");
      }
      if (e == "移除武器模型") {
        item.value = "";
        this.settingData.weaponData = undefined;
        let singleTransform = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
        singleTransform.GetComponent("NPC").RemoveWeapon();
      }

      if (e == "加载角色模型") {
        this.parent.$refs.modelSelectPanel.Init("角色模型");
      }
      if (e == "保存") {
        this.save();
      }

      if (e == "设置为npc目标") {
        _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("NPC")
          .SetNpcTarget(_Global.YJ3D.YJPlayer, true, true);
      }
      if (e == "设置npc失去目标") {
        _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("NPC")
          .SetNpcTarget(null);
      }

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

        this.settingData.weaponData = item;
        //加载武器并让角色使用
        this.Utils.SetSettingItemByProperty(this.setting, "weapon", this.$uploadUrl + this.settingData.weaponData.icon);

        let singleTransform =
          _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
        singleTransform.GetComponent("NPC").SetMessage(this.settingData);

        return;
      }



      if (modelType != "角色模型") { return; }
      //npc换角色模型
      this.settingData.avatarData = item.message.data;
      this.settingData.avatarData.modelPath = this.$uploadUrl + item.modelPath;

      this.save();

      //区分首次加载和第二次加载，首次加载直接创建，第二次加载修改第一次加载的内容

      let singleTransform =
        _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
      if (singleTransform == null) {
        //加载模型
        _Global.YJ3D._YJSceneManager.CreateSingleModel(
          item.modelPath,
          () => {
            this.parent.SetTip("加载模型完成");
            setTimeout(() => {
              // 控制三维
              _Global.YJ3D._YJSceneManager
                .GetSingleModelTransform()
                .SetMessage(this.getMessage());
            }, 1000);
          },
          (e) => {
            this.$parent.SetTip("出错了。加载模型出错，" + e);
          }
        );
      } else {
        let MeshRenderer = singleTransform.GetComponent("MeshRenderer");
        MeshRenderer.Destroy();
        let modelPath = this.$uploadUrl + item.modelPath;

        console.log(" modelPath ", modelPath);
        MeshRenderer.load(
          modelPath,
          (scope) => {
            let _YJAnimator = singleTransform.GetComponent("Animator");
            _YJAnimator.Destroy();
            _YJAnimator.UpdateModel(scope.GetModel(), scope.GetAnimations());
            singleTransform.GetComponent("NPC").SetMessage(this.settingData);

          },
          (e) => { }
        );
      }
    },
    updateName(v) {
      this.settingData.name = v;
      this.parent.modelData.message = this.getMessage();

      // 控制三维
      _Global.YJ3D._YJSceneManager
        .GetSingleModelTransform()
        .SetMessage(this.getMessage());
    },
    Init(_settingData) {
      this.settingData = _settingData;
      this.Utils.SetSettingItemByProperty(this.setting, "name", this.settingData.name);
      this.Utils.SetSettingItemByProperty(this.setting, "maxHealth", this.settingData.baseData.maxHealth);
      this.Utils.SetSettingItemByProperty(this.setting, "level", this.settingData.baseData.level);
      this.Utils.SetSettingItemByProperty(this.setting, "camp", this.settingData.baseData.camp);
      this.Utils.SetSettingItemByProperty(this.setting, "strength", this.settingData.baseData.strength);
      this.Utils.SetSettingItemByProperty(this.setting, "height", this.settingData.height);
      this.Utils.SetSettingItemByProperty(this.setting, "relifeTime", this.settingData.relifeTime);
      this.Utils.SetSettingItemByProperty(this.setting, "type", this.settingData.baseData.type ? this.settingData.baseData.type : "normal");

      if (this.settingData.weaponData) {
        this.Utils.SetSettingItemByProperty(this.setting, "weapon", this.$uploadUrl + this.settingData.weaponData.icon);
      }else{
        this.Utils.SetSettingItemByProperty(this.setting, "weapon","");
      }

      if (this.$refs.settingPanel_npcSkill) {
        this.$refs.settingPanel_npcSkill.initValue();
      }
      console.log(" npc setting data ", _settingData);
    },
    // 改变UI输入值后刷新
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;
      if (property == "camp"
        || property == "maxHealth"
        || property == "strength"
        || property == "type"
        || property == "level"
      ) {
        this.settingData.baseData[property] = e;
        if (property == "maxHealth") {
          this.settingData.baseData['health'] = e;
        }
      } else {
        this.settingData[property] = e;
      }
      if (property == "name" || property == "camp") {
        // 控制三维
        _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform()
          .SetMessage(this.getMessage());
      }

      console.log(i + " " + this.setting[i].value);
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
      _Global.YJ3D._YJSceneManager.UpdateTransform(
        this.getMessage()
      );
      // 调用场景保存
      if (this.parent.updateSceneModelData) {
        this.parent.tableList[2].value = true;
        this.parent.updateSceneModelData();
      }
    },
  },
};
</script>

<style scoped></style>
