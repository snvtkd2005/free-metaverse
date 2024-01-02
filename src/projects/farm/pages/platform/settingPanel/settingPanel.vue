
<template> 
  <!-- 右上角按钮 -->
  <div class="h-10 flex gap-x-1  text-gray-200">

    <!-- :class="panelState.setting ? ' bg-blue-400 text-gray-200 ' : 'bg-gray-200 text-gray-500'" -->
    <div class=" hidden cursor-pointer  bg-black bg-opacity-40 " @click=" ChangePanel('导出')">
      <p class="p-2">导出</p>
    </div>
    <div class="cursor-pointer  bg-black bg-opacity-40 " @click=" ChangePanel('设置')">
      <p class="p-2">设置</p>
    </div>
    <div class=" hidden   p-2 flex  h-10 text-center  cursor-pointer  bg-black bg-opacity-40  "
      :class="panelState.model ? ' bg-opacity-80 ' : 'bg-opacity-40'" @click=" ChangePanel('模型')">
      <div class=" self-center">
        模型库
      </div>
    </div>

    <div class=" p-2 flex  h-10 text-center  cursor-pointer  bg-black bg-opacity-40  "
      :class="sceneSetting.hasDirectionalLight ? ' bg-opacity-80 ' : 'bg-opacity-40 '" @click="ChangeSetting('太阳光')">
      <div class=" self-center">
        太阳光
      </div>
    </div>

    <div class=" p-2 flex h-10 text-center cursor-pointer  bg-black bg-opacity-40 " @click="ChangeSetting('启动')">
      <div class=" self-center">
        启动
      </div>
    </div>
    <div class=" p-2 flex h-10 text-center cursor-pointer  bg-black bg-opacity-40 " @click="ChangePanel('全屏')">
      <div class=" self-center">
        {{fullScreen?'缩小':'全屏'}}
      </div>
    </div>
  </div>
</template>

<script>



export default {
  name: "settingpanel",
  components: {

  },
  data() {
    return {
      // 场景设置
      sceneSetting: {
        hasDirectionalLight: true,
        displayCollider: false,
      },
      // openModelPanel: "",
      openModelPanel: "设置",
      panelState: {
        setting: true,
        model: true,
      },
      fullScreen:false,
    };
  },
  created() {

  },
  mounted() {

  },
  methods: {

    ChangePanel(e) {
      
      if ("全屏" == e) {
        this.fullScreen = !this.fullScreen; 
        this.$parent.setMaxMin(this.fullScreen);
        return;
      }
      if ("导出" == e) {
        // 由服务器把场景配置、场景模型数据、模型文件夹、程序文件夹等打包成zip压缩包下载
        // 
        return;
      }
      if ("设置" == e) {
        this.$parent.ChangePanel('setting');
        return;
      }
      if ("模型" == e) {
        this.panelState.model = !this.panelState.model;
        this.$parent.$refs.modelPanel.SetVisible(this.panelState.model);
        return;
      }
      if (this.openModelPanel == e) {
        this.openModelPanel = "";
        return;
      }
      this.openModelPanel = e;
    },
    ChangeSetting(title, e) {
      if (title == "太阳光") {
        this.sceneSetting.hasDirectionalLight = !this.sceneSetting.hasDirectionalLight;
        _Global.SendMsgTo3D("设置太阳光开关", this.sceneSetting.hasDirectionalLight);
        return;
      }
      if (title == "启动") {

        let path = "/editorVisit";
        // 新窗口 新标签
        let href = this.$router.resolve({
          name: path.replace("/", ""),
          query: {
            folderBase: this.$parent.folderBase,
          },
        });
        window.open(href.href, "_blank");
        return;
      }

    },

  },
};
</script>

<style scoped></style>
