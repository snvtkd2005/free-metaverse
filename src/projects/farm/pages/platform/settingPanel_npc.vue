
<template>
  <div class="w-80 max-w-md p-2 text-white rounded-lg overflow-hidden">
    <div class="text-left">npc 设置</div>

    <div v-for="(item, i) in setting" :key="i" class="text-xs text-left flex w-80 h-auto mb-2">
      <div class="self-center w-40 truncate" v-show="item.display">
        {{ item.title }}
      </div>
      <div class="self-center w-20" v-show="item.display">
        <div v-if="item.type == 'text'" class="w-32 h-auto text-black">
          <YJinput_text class="w-full h-auto" :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'drop'" class=" w-20 h-16 text-black ">
          <YJinput_drop class=" w-32 h-16 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>
        <div v-if="item.type == 'int'" class="flex gap-2 text-black">
          <YJinput_number :value="item.value" :type="item.type" :step="item.step" :index="i" :callback="item.callback" />
        </div>
      </div>
    </div>

    <div class="mt-10 w-80 h-10 text-white cursor-pointer" @click="ClickHandler('设置为npc目标')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        设置为npc目标
      </div>
    </div>

    <div class=" w-80 h-10 text-white cursor-pointer" @click="ClickHandler('设置npc失去目标')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        设置npc失去目标
      </div>
    </div>

    <div class=" w-80 h-10 text-white cursor-pointer" @click="ClickHandler('加载角色模型')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        加载角色模型
      </div>
    </div>

    <div class="mt-2 w-80 h-10 text-white cursor-pointer" @click="ClickHandler('保存')">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">保存</div>
    </div>
  </div>
</template>

<script>
import YJinput_text from "./components/YJinput_text.vue";
import YJinput_number from "./components/YJinput_number.vue";
import YJinput_drop from "./components/YJinput_drop.vue";

export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_text,
    YJinput_number,
    YJinput_drop,
  },
  data() {
    return {
      pointType: "npc",
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
          state: 'normal', //状态
          speed: 8, //移动速度
          level: 1, //等级
          health: 100, //生命值
          maxHealth: 100, //生命值
          strength: 20, //攻击力
        },
        defaultAnim: "idle", //默认动作
        avatarData: {},
        eventType: "no",//事件类型 
        contentData: {},//事件内容数据
      },
      // npc行为
      npcActionData: {

      },

      avatar: null,
      selectCurrentIndex: 0,
      setting: [
        { property: "name", display: true, title: "npc名称", type: "text", value: "", callback: this.ChangeValue, },
        {
          property: "camp", display: true, title: "阵营", type: "drop", value: "lm", options: [
            { value: 'lm', label: '联盟' },
            { value: 'bl', label: '部落' },
          ], callback: this.ChangeValue,
        },
        { property: "health", display: false, title: "生命值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "level", display: true, title: "等级", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
      ],

    };
  },
  created() { },
  mounted() {
    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      return;
    }
    if (modelData.message == undefined) {
      this.settingData.id = this.$parent.folderBase + "";
      return;
    }

    console.log(" modelData = ", modelData);
    this.settingData = modelData.message.data;
    // this.settingData.baseData = undefined; //重置数据时解除注释
    if (!this.settingData.baseData) {
      this.settingData.baseData = this.baseData;
    }
    this.settingData.name = modelData.name;
    this.initValue();
  },
  methods: {
    ClickHandler(e) {
      if (e == "加载角色模型") {
        this.openModelPanel();
      }
      if (e == "保存") {
        this.save();
      }

      if (e == "设置为npc目标") {
        _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("NPC")
          .SetTarget(_Global.YJ3D.YJPlayer);
      }
      if (e == "设置npc失去目标") {
        _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("NPC")
          .SetTarget(null);
      }

    },
    removeThreeJSfocus() {
      this.$parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { },
    setSettingItemByProperty(property, value) {
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == property) {
          element.value = value;
        }
      }
    },
    getSettingItemByProperty(property) {
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == property) {
          return element.value;
        }
      }
      return null;
    },
    // 从单品编辑跳转过来后更新UI值
    initValue() {
      this.setSettingItemByProperty("name", this.settingData.name);
      this.setSettingItemByProperty("health", this.settingData.baseData.health);
      this.setSettingItemByProperty("level", this.settingData.baseData.level);
      this.setSettingItemByProperty("camp", this.settingData.baseData.camp);
      this.setSettingItemByProperty("height", this.settingData.height);
    },
    openModelPanel() {
      this.$parent.$refs.modelSelectPanel.Init("角色模型");
    },
    load(item) {
      console.log(item);
      this.settingData.avatarData = item.message.data;
      this.settingData.avatarData.modelPath = this.$uploadUrl + item.modelPath;

      this.save();

      //区分首次加载和第二次加载，首次加载直接创建，第二次加载修改第一次加载的内容

      let singleTransform =
        _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
      if (singleTransform == null) {
        //加载模型
        _Global.YJ3D._YJSceneManager.CreateSingleModel(
          data.modelPath,
          () => {
            console.log("加载模型完成 33 ");
            this.$parent.SetTip("加载模型完成");
            setTimeout(() => {
              this.$parent.tipData.opening = false;
            }, 1000);
            this.avatar =
              _Global.YJ3D._YJSceneManager
                .GetSingleModelTransform()
                .GetComponent("Animator");
            this.ChangeAnim(0);
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
            singleTransform.GetComponent("NPC").UpdateModel(item.message.data);
          },
          (e) => { }
        );
      }
    },
    updateName(v) {
      this.settingData.name = v;
      this.$parent.modelData.message = {
        pointType: this.pointType,
        data: this.settingData,
      };

      // 控制三维
      _Global.YJ3D._YJSceneManager
        .GetSingleModelTransform()
        .SetMessage(this.getMessage());
    },
    Init(_settingData) {
      this.settingData = _settingData;
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == "name") {
          element.value = this.settingData.name;
        }
      }
      console.log(" npc setting data ", _settingData);
    },
    // 改变UI输入值后刷新
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;
      if (property == "camp") {
        this.settingData.baseData[property] = e;
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
      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = this.getMessage();
        this.$parent.updateModelTxtData();
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

    ChangeAnim(i) {
      this.avatar.ChangeAnimByIndex(i);
    },
    Update() {
      // _Global.SendMsgTo3D("刷新Transform", this.$parent.modelData.message);

      _Global.YJ3D._YJSceneManager.UpdateTransform(
        {
          pointType: this.pointType,
          data: this.settingData,
        }
      );
      // 调用场景保存
      if (this.$parent.updateSceneModelData) {
        this.$parent.tableList[2].value = true;
        this.$parent.updateSceneModelData();
      }
    },
  },
};
</script>

<style scoped></style>
