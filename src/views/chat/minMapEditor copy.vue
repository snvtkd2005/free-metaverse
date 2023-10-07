

// 上传角色是编辑角色动作配置

<template>
  <div class="absolute top-0 w-1/4 h-1/4 left-10 flex">
    <div class="
        relative
        self-center
        w-full
        h-full
        bg-gray-100
        rounded-md
        text-xs
        px-10
      ">
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">地图偏移 X</div>
        <input class="w-20 h-10 px-1" v-model="offsetX" @change="Change()" type="number" step="0.0005" />
      </div>
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">地图偏移 Y</div>
        <input class="w-20 h-10 px-1" v-model="offsetY" @change="Change()" type="number" step="0.0005" />
      </div>


      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">地图缩放 X</div>
        <input class="w-20 h-10 px-1" v-model="scaleX" @change="Change()" type="number" step="0.00005" />
      </div>
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">地图缩放 Y</div>
        <input class="w-20 h-10 px-1" v-model="scaleY" @change="Change()" type="number" step="0.00005" />
      </div>

      <!-- <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">摄像机鸟瞰位置 X</div>
        <input class="w-20 h-10 px-1" v-model="camPosX" @change="ChangeNiankan()" type="number" step="1" />
      </div>

      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">摄像机鸟瞰位置 Y</div>
        <input class="w-20 h-10 px-1" v-model="camPosY" @change="ChangeNiankan()" type="number" step="1" />
      </div>

      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">摄像机鸟瞰位置 Z</div>
        <input class="w-20 h-10 px-1" v-model="camPosZ" @change="ChangeNiankan()" type="number" step="1" />
      </div> -->

      <!-- 摄像机lookat坐标 -->

      <!-- <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">摄像机lookat坐标 X</div>
        <input class="w-20 h-10 px-1" v-model="camTargetPosX" @change="ChangeNiankan()" type="number" step="1" />
      </div>
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">摄像机lookat坐标 Y</div>
        <input class="w-20 h-10 px-1" v-model="camTargetPosY" @change="ChangeNiankan()" type="number" step="1" />
      </div>
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">摄像机lookat坐标 Z</div>
        <input class="w-20 h-10 px-1" v-model="camTargetPosZ" @change="ChangeNiankan()" type="number" step="1" />
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      offsetX: 0.00,
      offsetY: 0.00,
      scaleX: 0.0026,
      scaleY: 0.0024,

      camPosX: -54,
      camPosY: 40,
      camPosZ: 200,

      camTargetPosX: 0,
      camTargetPosY: 0,
      camTargetPosZ: 0,
    };
  },

  mounted() {
    let that = this;
    setTimeout(() => {
      that.GetMinMapData();
    }, 2000);
  },
  methods: {
    GetMinMapData() {

      let minMapData = this.$parent.GetMinMapData();

      let offset = minMapData.minMapOffset;
      this.offsetX = offset.x;
      this.offsetY = offset.y;

      let scale = minMapData.minMapScale;
      this.scaleX = scale.x;
      this.scaleY = scale.y;

    },
    Change() {
      this.$parent.SetMinMap(this.scaleX, this.scaleY, this.offsetX, this.offsetY);
    },
    ChangeNiankan() {
      this.$parent.SetCamPos(this.camPosX, this.camPosY, this.camPosZ
        , this.camTargetPosX, this.camTargetPosY, this.camTargetPosZ);
    },
  },
};
</script>

<style>
</style>
