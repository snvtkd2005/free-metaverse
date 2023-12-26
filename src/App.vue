<template>
  <div id="app" class="absolute left-0 top-0 w-full h-full flex">
    <router-view />
  </div>
</template>

 <script>
export default {
  data() {
    return {};
  },
  mounted() {
  },
  methods: {},
};
</script>



<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.hover\:bg-546770:hover{
  background-color: #546770;
}

.bg-546770{
  background-color: #546770;
}

.bg-445760{
  background-color: #445760;
}

.z-60{
  z-index: 60;
}
.bg-color {
  background-color: #0e4774;
}

/* 边框厚度 */
.border-r-px {
  border-right-width: 1px;
}
.border-px {
  border-width: 1px;
}
/* 高 */
.h-78px {
  height: 78px;
}
.h-120px {
  height: 120px;
}
.h-300px {
  height: 300px;
}
.h-330px {
  height: 330px;
}
.h-370px {
  height: 370px;
}
.h-440px {
  height: 440px;
}
.h-475px {
  height: 475px;
}

.h-480px {
  height: 480px;
}
.h-575px {
  height: 575px;
}

.h-595px {
  height: 595px;
}
.h-680px {
  height: 680px;
}
.h-695px {
  height: 695px;
}

.h-710px {
  height: 710px;
}
.h-715px {
  height: 715px;
}
.h-775px {
  height: 775px;
}
.h-800px {
  height: 800px;
}

.h-1020px {
  height: 1020px;
}
.h-1030px {
  height: 1030px;
}
.h-1075px {
  height: 1075px;
}
/* 限制最宽 */
.max-w-1540px {
  max-width: 1540px;
}
.max-w-1200px {
  max-width: 1200px;
}

/* 宽 */
.w-78px {
  width: 78px;
}
.w-485px {
  width: 485px;
}
.w-530px {
  width: 530px;
}
.w-800px {
  width: 800px;
}
.w-875px {
  width: 875px;
}

.w-1200px {
  width: 1200px;
}

.w-21\/24 {
  width: 86.83333%;
}

/* ------------- */
.from-color {
  --tw-gradient-from: #7d95a9;
  --tw-gradient-stops: var(--tw-gradient-from),
    var(--tw-gradient-to, rgba(125, 149, 169, 0));
}
.to-color {
  --tw-gradient-to: #033258;
}




::-webkit-scrollbar {
  /* 滚动条整体部分 */
  /* width:0px; */
  border-radius: 10px;
  width: 6px;
  margin-right: 2px;
  /* display: block !important; */
  /* 控制滑动条是否显示 */
  /* display: none; */
}

::-webkit-scrollbar-button {
  /* 滚动条两端的按钮 */
  width: 10px;
  background-color: #606266;
  display: none;
}

::-webkit-scrollbar:horizontal {
  height: 10px;
  margin-bottom: 2px;
}

::-webkit-scrollbar-track {
  /* 外层轨道 */
  border-radius: 10px;
  background-color: #606266;
  display: none;

}

::-webkit-scrollbar-track-piece {
  /*内层轨道，滚动条中间部分背景 */
  background-color: #ffffff;
  border-radius: 10px;
  display: none;

}

::-webkit-scrollbar-thumb {
  /* 滑块 */
  width: 6px;
  border-radius: 5px;
  background: #606266;
}

::-webkit-scrollbar-corner {
  /* 边角 */
  width: 10px;
  background-color: #cbcbcb;
  display: none;
}

::-webkit-scrollbar-thumb:hover {
  /* 鼠标移入滑块 */
  background: #606266;
}
</style>


<style>
a {
  text-decoration: none !important;
  /* 去掉a标签下划线   !important 表示最高优先级*/
}

@media (min-width: 768px) {
  .md\:h-335px {
    height: 335px;
  }
  .md\:h-370px {
    height: 370px;
  }
  .md\:h-717px {
    height: 717px;
  }
  .md\:w-1200px {
    width: 1200px;
  }
}
.basis-10{
  flex-basis: 2.5rem; /* 40px */
}
/* 高 */
.h-78px {
  height: 78px;
}
.h-100px {
  height: 100px;
}

/* 移动端 轮播图高度 */
.h-m-Carousel {
  height: 230px;
}
.h-footer {
  height: 300px;
}

/*  */
.h-187px {
  height: 187px;
}
.h-220px {
  height: 220px;
}
.h-250px {
  height: 280px;
}
.h-300px {
  height: 300px;
}
.h-330px {
  height: 330px;
}
.h-335px {
  height: 335px;
}
.h-370px {
  height: 370px;
}
.h-400px {
  height: 400px;
}
.h-475px {
  height: 475px;
}

.h-480px {
  height: 480px;
}
.h-575px {
  height: 575px;
}

.h-695px {
  height: 695px;
}

.h-700px {
  height: 700px;
}

.h-715px {
  height: 715px;
}
.h-775px {
  height: 775px;
}
.h-820px {
  height: 820px;
}
.h-900px {
  height: 900px;
}
.h-1020px {
  height: 1020px;
}
.h-1030px {
  height: 1030px;
}
.h-1075px {
  height: 1075px;
}

.top-710px {
  top: 715px;
}

/* 限制最宽 */
.max-w-1540px {
  max-width: 1540px;
}
.max-w-1200px {
  max-width: 1200px;
}

.min-w-1200px {
  min-width:1200px ;
}

/* 浅蓝 */
.bg-color-shallow {
  background-color: #609dca;
}
/* 中蓝 */
.bg-color-center {
  background-color: #3c7097;
}
/* 深蓝 */
.bg-color-depth {
  background-color: #28587e;
}

.bg-color {
  background-color: #022b63;
}
.bg-color-footer {
  background-color: #0e4774;
}

/* 宽 */
.w-78px {
  width: 78px;
}
.w-485px {
  width: 485px;
}
.w-530px {
  width: 530px;
}
.w-800px {
  width: 800px;
}
.w-875px {
  width: 875px;
}

.w-1200px {
  width: 1200px;
}

/* scale */
.scale-25{
  --tw-scale-x:.25;
  --tw-scale-y:.25;
}
.scale-85{
  --tw-scale-x:.85;
  --tw-scale-y:.85;
}
/* border */
.border-px {
  border-width: 1px;
}
/* 文字颜色 */
.text-title-color {
  color: #08397c;
}
.-z-10 {
  z-index: -10;
}
</style>

