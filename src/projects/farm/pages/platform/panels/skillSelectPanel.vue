
// 模型库
<template>
  <el-dialog title="选择技能" class="    text-white  create-card" center v-model="isOpen" :modal-append-to-body="false"
    width="55%">
    <div class=" cursor-pointer " @click="refesh()">
      刷新
    </div>
    <!-- 技能面板 -->
    <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap  ">
      <div v-for="(item, i) in skillList" :key="i" class=" w-20 h-24  text-base  cursor-pointer  "  @click="ClickUVAnim(item)">
        <div class=" w-12 h-12 self-center mx-auto">
          <img class="w-full h-full object-fill hover:opacity-70" :src="$uploadUVAnimUrl + item.icon" />
        </div>
        <div class=" w-full  truncate   flex  justify-between ">
          <text>{{ item.skillName }}</text>
        </div>
        <div class="  w-full   flex  justify-between text-xs ">
          <text>{{ item.describe }}</text>
        </div>
 
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: "skillSelectPanel",
  components: {
  },
  data() {
    return {
      isOpen: false,
      skillList: [],
    };
  },
  created() { },
  mounted() {
    setTimeout(() => {
      this.initValue();
    }, 5000);
  },
  methods: {
    SetVisible(b) {
      this.isOpen = b; 
    },
    initValue() {
      this.skillList = _Global.skillList;
    },
    async refesh(){
      let res = await this.$axios.get(
        this.$uploadPlayerUrl + "skill_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.skillList = res.data;
      this.skillList = _Global.skillList ;
    },
    ClickUVAnim(item) {
      console.log("选中技能", item); 
      if(this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_npc){
        this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_npc.$refs.settingPanel_npcSkill.AddSkill(item);
      }
      if(this.$parent.$refs.settingPanelCtrl.$refs.sceneSettingPanel){
        this.$parent.$refs.settingPanelCtrl.$refs.sceneSettingPanel.AddSkill(item);
      }
    },
  },
};
</script>