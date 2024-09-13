


<template>
  <!-- 角色皮肤选择  -->
  <div class="absolute top-2 xl:top-10 left-0 md:left-10 z-60 w-64 xl:w-auto h-1/2  pointer-events-none ">
    <div class="
                                              xl:w-auto
                                              w-auto
                                              h-auto  
                                              self-center
                                              mx-auto 
                                            ">
      <!-- 列表 -->
      <div class="
   
                                                 flex-row
                                                w-auto
                                               max-w-2xl
                                               h-auto
                                               gap-3 xl:gap-0
                                                xl:h-2/3
                                               justify-items-start text-white
                                              ">
        <div v-for="(item, i) in skinData" :key="i" :index="item.img" class="
                                                  w-32 h-16
                                              xl:w-auto xl:h-auto
                                                  self-center
                                                  flex-row
                                                 relative
                                                 mb-px xl:mb-10 pointer-events-auto
                                                ">

          <div class=" text-left self-center mx-auto text-base xl:text-xl">
            {{ item.content }}
          </div>
          <div class=" mt-px xl:mt-4 flex gap-px md:gap-5 w-auto ">

            <div v-for="(item2, i2) in item.icon" :key="i2" class="
                                                  w-10 h-10
                                              xl:w-20 xl:h-20
                                               transform
                                                 hover:scale-110
                                                  self-center
                                                  mx-auto 
                                                  cursor-pointer
                                                  flex
                                                 relative
                                                 rounded-full
                           
                                                " :class="item.selected == i2 ? 'bg-green-400' : 'bg-gray-400'"
              @click="ClickChangeSkin(item, i2)">

              <div class="  w-full h-full self-center mx-auto">
                <img class=" rounded-full p-1 w-full h-full " :src="publicUrl + item2" alt="">
                <!-- {{ item2 }} -->
              </div>


            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: "index",
  props: ["skinData"],
  components: {

  },
  data() {
    return {
      // skinData: {},
      publicUrl: "./public/farm/",

    };
  },
  created() {
  },

  mounted() {
    console.log(" 加载到换装数据 ", this.skinData);
  },
  methods: {

    ClickChangeSkin(item, i2) {
      this.$parent.ClickChangeSkin(item, i2);
    },
    UpdateSkin(playerState) {
      this.$parent.UpdateSkin(playerState);
    },
    GetPublicUrl() {
      return this.publicUrl;
    },


  },
};
</script>

<style >
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.scale-30 {
  --tw-scale-x: .3;
  --tw-scale-y: .3;
}

.z-60 {
  z-index: 60;
}

/* 阻止长按复制 */
.stop-long-hover {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.max-w-1200 {
  max-width: 1200px;
}

::-webkit-scrollbar {
  /* 滚动条整体部分 */
  /* width:0px; */
  border-radius: 10px;
  width: 10px;
  margin-right: 2px;
  /* display: block !important; */
  /* 控制滑动条是否显示 */
  display: none;
}

::-webkit-scrollbar-button {
  /* 滚动条两端的按钮 */
  width: 10px;
  background-color: #adadad;
  display: none;
}

::-webkit-scrollbar:horizontal {
  height: 10px;
  margin-bottom: 2px;
}

::-webkit-scrollbar-track {
  /* 外层轨道 */
  border-radius: 10px;
}

::-webkit-scrollbar-track-piece {
  /*内层轨道，滚动条中间部分 */
  background-color: #cbcbcb;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  /* 滑块 */
  width: 10px;
  border-radius: 5px;
  background: #adadad;
}

::-webkit-scrollbar-corner {
  /* 边角 */
  width: 10px;
  background-color: #cbcbcb;
  display: none;
}

::-webkit-scrollbar-thumb:hover {
  /* 鼠标移入滑块 */
  background: #adadad;
}
</style>
