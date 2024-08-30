
<template>
  <!-- 右上角按钮 -->
  <div class="h-10 flex gap-x-1 text-gray-200">

    <div class=" p-2 flex  h-10 text-center  cursor-pointer  bg-black bg-opacity-40  "
      :class="panelState.grid ? ' bg-opacity-80 ' : 'bg-opacity-40'" @click=" ClickEvent('grid')">
      <div class=" self-center">
        grid
      </div>
    </div>

    <div class=" p-2 flex  h-10 text-center  cursor-pointer  bg-black bg-opacity-40  "
      :class="panelState.free ? ' bg-opacity-80 ' : 'bg-opacity-40'" @click=" ClickEvent('自由穿行')">
      <div class=" self-center">
        自由穿行
      </div>
    </div>

    <div
      class="p-2 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
      :class="
        sceneSetting.hasDirectionalLight ? ' bg-opacity-80 ' : 'bg-opacity-40 '
      "
      @click="ClickEvent('太阳光')"
    >
      <div class="self-center">太阳光</div>
    </div>

    <div
      class="p-2 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
      @click="ClickEvent('环境光')"
    >
      <div class="self-center">环境光</div>
    </div>
  </div> 
</template>

<script>
export default {
  name: "settingpanel",
  components: {},
  data() {
    return {
      // 场景设置
      sceneSetting: {
        hasAmbientLight: true,
        hasDirectionalLight: true,
        displayCollider: false,
      },  
      panelState: {
        setting: true, 
        free: false,
        grid:false,
      },
      fullScreen: false, 
    };
  },
  created() {},
  mounted() {
    this.parent = this.$parent;

    setTimeout(() => {
      if (_Global.YJ3D && _Global.YJ3D._YJSceneManager) {
        this.sceneSetting.hasDirectionalLight =
          _Global.YJ3D._YJSceneManager.GetSceneData().AmbientLightData.hasDirectionalLight;
      }
    }, 5000);
  },
  methods: { 
    ClickEvent( e) {
      
      if ("grid" == e) {
        this.panelState.grid = !this.panelState.grid;
        _Global.YJ3D._YJSceneManager.ToggleGrid(this.panelState.grid);
        return;
      }
      if ("自由穿行" == e) {
        this.panelState.free = !this.panelState.free;
        if(this.panelState.free){
          _Global.YJ3D.YJController.GetAmmo().SetGravityActive(false);
          _Global.YJ3D.YJController.GetAmmo().SetRigidbodyEnable(false);

        }else{
          _Global.YJ3D.YJController.GetAmmo().SetGravityActive(true);
          _Global.YJ3D.YJController.GetAmmo().SetRigidbodyEnable(true);

        }
        return;
      }
      if (e == "太阳光") {
        this.sceneSetting.hasDirectionalLight =
          !this.sceneSetting.hasDirectionalLight;
        _Global.YJ3D._YJSceneManager.VisibleDirectionalLight(
          this.sceneSetting.hasDirectionalLight
        );
        return;
      }
      if (e == "环境光") {
        this.sceneSetting.hasAmbientLight = !this.sceneSetting.hasAmbientLight;
        _Global.YJ3D._YJSceneManager.SetAmbientIntensity(
          this.sceneSetting.hasAmbientLight ? 1 : 0
        );
        return;
      } 
    },
  },
};
</script>

<style scoped></style>
