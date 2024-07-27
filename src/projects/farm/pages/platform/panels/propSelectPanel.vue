

<template>
  <el-dialog title="选择道具" class="    text-white  create-card" center v-model="isOpen" :modal-append-to-body="false"
    width="55%">
    <div class=" cursor-pointer " @click="refesh()">
      刷新
    </div>
    <!-- 道具面板 -->
    <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap  ">
      <div v-for="(item, i) in propList" :key="i" class=" w-20 h-24  text-base  cursor-pointer  "  @click="ClickUVAnim(item)">
        <div class=" w-12 h-12 self-center mx-auto">
          <img class="w-full h-full object-fill hover:opacity-70" :src="$uploadUVAnimUrl + item.icon" />
        </div>
        <div class=" w-full  truncate   flex  justify-between ">
          <text>{{ item.name }}</text>
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
  name: "propSelectPanel",
  components: {
  },
  data() {
    return {
      isOpen: false,
      propList: [],
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
      this.propList = _Global.propList;
    },
    async refesh(){
      let res = await this.$axios.get(
        this.$uploadPlayerUrl + "prop_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.propList = res.data;
      this.propList = _Global.propList ;
    },
    ClickUVAnim(item) {
      console.log("选中道具", item); 
      if(this.$parent.$refs.settingPanelCtrl.$refs.sceneSettingPanel){
        this.$parent.$refs.settingPanelCtrl.$refs.sceneSettingPanel.AddProp(item);
      }
    },
  },
};
</script>