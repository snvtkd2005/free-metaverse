

// 上传角色是编辑角色动作配置

<template>

  <div class=" hidden md:flex  absolute z-0 top-0 w-full h-full left-0 overflow-hidden pointer-events-none">
    <div class=" absolute mapSize mapScale transform -rotate-90 left-0 bottom-0 ">
      <div class=" absolute left-0 top-0 w-full h-full ">
        <img class=" w-full h-full opacity-0" :src=" path + mapUrl" alt="">
      </div>
      <div class=" absolute left-0 top-0 w-full h-full flex">
        <div class=" absolute z-10 left-0 top-0 w-px h-px transform rotate-90 bg-red-500  pointer-events-none " :style="playerStyle">
            <div class=" absolute w-14 h-16 transform -translate-x-7 -translate-y-20  ">
              <img class="  w-12 h-20 " :src=" path + mapPointUrl" alt="">
            </div>
          </div>
      </div>
    </div>
  </div>

  <!-- <div class="absolute top-0 w-full h-full left-0 flex">
    <div class=" relative mapSize  self-center mx-auto ">
      <div class=" absolute left-0 top-0 w-full h-full ">
        <img class=" w-full h-full opacity-70" :src=" path + mapUrl" alt="">
      </div>
      <div class=" absolute left-0 top-0 w-full h-full flex">
        <div class=" absolute z-10 left-0 top-0 w-px h-px bg-red-500  pointer-events-none " :style="playerStyle">
            <div class=" absolute w-14 h-16 transform -translate-x-7 -translate-y-20  ">
              <img class="  w-14 h-20 " :src=" path + mapPointUrl" alt="">
            </div>
          </div>
      </div>
    </div>
  </div> -->


  <div v-if="inEditor" class="absolute top-0 w-1/4 h-1/4 left-10 flex">
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


      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">2d地图缩放 </div>
        <input class="w-20 h-10 px-1" v-model="oneSize" type="number" step="1" />
      </div>

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
      mapUrl: "",
      mapPointUrl: "",
      path: '',
      scale: 40,
      playerStyle: "  position:absolute; left:0px;top:0px; ",
      oneSize:0.6,
      // oneSize:5.2,
      inEditor:false,
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
      // this.inEditor = this.$parent.avatarData.setting.inMinMapEditor;

      this.path = this.$parent.$publicUrl;
      let minMapData = this.$parent.GetMinMapData();

      this.mapUrl = minMapData.minMapUrl;
      this.mapPointUrl = minMapData.minMapPointUrl;

      let offset = minMapData.minMapOffset;
      this.offsetX = offset.x;
      this.offsetY = offset.y;

      let scale = minMapData.minMapScale;
      this.scaleX = scale.x;
      this.scaleY = scale.y;

      this.animate();
    },
    Change() {
      this.$parent.SetMinMap(this.scaleX, this.scaleY, this.offsetX, this.offsetY);
    },
    Update2DmapPos(pos){
      // console.log("2d map pos " ,pos);
      
      let x = pos.x ;
      let y = pos.z ;

      // 世界坐标转换为地图坐标
      let offsetX = (x / 1) * this.oneSize + 1024/2 ;
      let offsetY = (y / 1) * this.oneSize + 512/2;

      this.playerStyle =
        " position:absolute; left:" + offsetX + "px; top:" + offsetY + "px; ";

    },
    animate(){
      requestAnimationFrame(this.animate);
      this.Update2DmapPos(this.$parent.$refs.ThreejsHumanChat.YJController.GetPlayerWorldPos());
    },
  },
};
</script>

<style>
.mapScale{
  --tw-scale-x:.88;
  --tw-scale-y:1.00;
  --tw-translate-x:-275px;
  --tw-translate-y:130px;
}
.mapSize{
  width: 1024px;
  height: 512px;
}

</style>
