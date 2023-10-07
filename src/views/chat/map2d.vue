 

// 小地图
<template >

  <!--  -->
  <div v-if="inEditor" class=" absolute z-40 top-0 w-full transform scale-125 left-96 flex">
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
        <div class="self-center">角色初始偏移 X</div>
        <input class="w-20 h-10 px-1" v-model="defaultOffsetX" @change="Change()" type="number" step="5" />
      </div>
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">角色初始偏移 Y</div>
        <input class="w-20 h-10 px-1" v-model="defaultOffsetY" @change="Change()" type="number" step="5" />
      </div>


      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">地图缩放 X</div>
        <input class="w-20 h-10 px-1" v-model="defaultScaleX" @change="Change()" type="number" step="0.05" />
      </div>
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">地图缩放 Y</div>
        <input class="w-20 h-10 px-1" v-model="defaultScaleY" @change="Change()" type="number" step="0.05" />
      </div>

      
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center"> 视角旋转偏移 </div>
        <input class="w-20 h-10 px-1" v-model="rotaAdd"  type="number" step="1" />
      </div>
      <!-- <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">地图透视变形 X</div>
        <input class="w-20 h-10 px-1" v-model="defaultPerspectiveX" @change="Change()" type="number" step="0.05" />
      </div>
      <div class="mt-2 w-full h-10 flex gap-x-5">
        <div class="self-center">地图透视变形 Y</div>
        <input class="w-20 h-10 px-1" v-model="defaultPerspectiveY" @change="Change()" type="number" step="0.05" />
      </div>  -->

    </div>
  </div>

  <div class="
        h-full
        w-full
        mx-auto 
        self-center
        relative
       overflow-hidden
      ">

    <!-- 地图 -->
    <div class=" absolute left-0 top-0 w-full h-full  ">
      <div class="w-full h-full">
        <img class="w-full h-full rounded-none pointer-events-none" :src="publicPath + minMapUrl" alt=""
          @error="imgLoadError" />
      </div>
    </div>

    <!-- 玩家位置 -->
    <div class="
                  absolute
                  left-0
                  top-0 
                ">
      <div ref="player" class="
                    w-px
                    h-px 
                    rounded-full
                    shadow-lg
                    bg-red-500
                   relative
                  " :style="playerStyle">
        <div class="w-8 h-10 absolute left-0 top-0 transform -translate-x-4 -translate-y-10 ">
          <img class="w-full h-full rounded-none pointer-events-none" :src="publicPath + minMapPointUrl" alt=""
            @error="imgLoadError" />
        </div>
      </div>
    </div>


    <!-- 玩家朝向 -->
    <div class="
                  absolute
                  left-0
                  top-0 
                ">
      <div class="
                    w-px
                    h-px 
                    rounded-full
                    shadow-lg
                    bg-red-500
                   relative
                  " :style="playerStyle + playerRotaStyle">

        <div class="w-20 h-16 absolute left-0 top-0 transform -translate-x-10 -translate-y-16 ">
          <img class="w-full h-full rounded-none pointer-events-none" :src="publicPath + viewAreaUrl" alt=""
            @error="imgLoadError" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ["inEditor"],
  components: {},
  data() {
    return {
      playerStyle: "  position:absolute; left:0px;top:0px; ",
      playerRotaStyle: ' transform:rotate(60deg);',

      oldPlayerPosX: 0,
      oldPlayerPosZ: 0,


      defaultOffsetX: 160,
      defaultOffsetY: 100,

      defaultScaleX: 2.56,
      defaultScaleY: 2.08,

      // 透视变形
      defaultPerspectiveX: 1,
      defaultPerspectiveY: 1,

      publicPath: "",
      minMapUrl: "minMap.png",
      minMapPointUrl: "minMapPoint.png",
      viewAreaUrl: "viewArea.png",

      // 偏移的方向，角色点在地图中移动的方向
      offsetDirciton: { x: 1, y: 1 },
      //旋转角度的偏移，增加值，由方向决定
      rotaAdd: 0,

      // minMapData:{},
    };
  },
  //初始化函数
  mounted() {
    this.publicPath = this.GetPublicUrl();
    // this.BeginUpdate();
  },
  methods: {
    BeginUpdate() {
      let that = this;
      setTimeout(() => {
        that.Update();
      }, 200);

      setTimeout(() => {
        that.GetMinMapData();
      }, 100);
    },
    GetMinMapData() {
      var minMapData = this.$parent.GetMinMapData();
      let offset = minMapData.minMapOffset;
      let scale = minMapData.minMapScale;

      this.minMapUrl = minMapData.minMapUrl;
      this.minMapPointUrl = minMapData.minMapPointUrl;
      this.viewAreaUrl = minMapData.viewAreaUrl;

      this.defaultOffsetX = offset.x;
      this.defaultOffsetY = offset.y;

      this.defaultScaleX = scale.x;
      this.defaultScaleY = scale.y;

      if (minMapData.offsetDirciton) {
        this.offsetDirciton = minMapData.offsetDirciton;
      }
      if (minMapData.rotaAdd) {
        this.rotaAdd = minMapData.rotaAdd;
      }

    },
    Change() {
      // this.SetPlayerMapDefaultOffset(this.scaleX, this.scaleY, this.offsetX, this.offsetY);
      this.SetInputXY();
    },
    SetPlayerMapDefaultOffset(sx, sy, ox, oy) {
      this.defaultOffsetX = ox;
      this.defaultOffsetY = oy;

      this.defaultScaleX = sx;
      this.defaultScaleY = sy;
    },

    GetPublicUrl() {
      return this.$parent.GetPublicUrl();
    },
    ChangePlayerPos(_x, _y) {
      // console.log("获取玩家坐标", _x,_y);
      _x *= this.offsetDirciton.x;
      _y *= this.offsetDirciton.y;

      if (
        Math.abs(this.oldPlayerPosX - _x) < 0.1 &&
        Math.abs(this.oldPlayerPosZ - _y) < 0.1
      ) {
        return;
      }
      // console.log("获取玩家点在地图中的位置", this.oldPlayerPosX, _x);

      this.SetInputXY(_x, _y);
    },
    ChangePlayerRota(y) {
      y += this.rotaAdd;

      // console.log("获取玩家旋转 ", y);
      this.playerRotaStyle = ' transform:rotate(' + (y) + 'deg);';
    },

    SetInputXY(x, y) {

      this.oldPlayerPosX = x;
      this.oldPlayerPosZ = y;

      // 世界坐标转换为地图坐标
      let offsetX = x * this.defaultScaleX + this.defaultOffsetX;
      let offsetY = y * this.defaultScaleY + this.defaultOffsetY;

      // let offsetX = x * this.defaultScaleX * this.defaultPerspectiveX + this.defaultOffsetX;
      // let offsetY = y * this.defaultScaleY * this.defaultPerspectiveY + this.defaultOffsetY;

      // let offsetX = this.defaultOffsetX;
      // let offsetY = this.defaultOffsetY;


      // console.log("获取玩家 转2d 坐标", offsetX, offsetY);
      // 
      this.playerStyle =
        " position:absolute; left:" + offsetX + "px; top:" + offsetY + "px; ";

    },

    Close() {
    },
    Update() {
      if (this.$parent.$refs.YJmetaBase) {

        this.$parent.$refs.YJmetaBase.ThreejsHumanChat.GetLocalPlayerPos((x, z) => {
          this.ChangePlayerPos(x, z);
        });
        this.$parent.$refs.YJmetaBase.ThreejsHumanChat.GetLocalPlayerRota((y) => {
          this.ChangePlayerRota(y);
        });
      } else {

        this.$parent.$refs.ThreejsHumanChat.GetLocalPlayerPos((x, z) => {
          this.ChangePlayerPos(x, z);
        });
        this.$parent.$refs.ThreejsHumanChat.GetLocalPlayerRota((y) => {
          this.ChangePlayerRota(y);
        });
      }
      requestAnimationFrame(this.Update);
    },
  },
};
</script>

<style scoped>

</style> 