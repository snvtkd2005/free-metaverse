<template>
  <div class=" w-full h-full   "
  > 
     <!-- 中间内容  路由页面内容 content-->
        <div
      class="
        contentView
        absolute
        z-10
        overflow-y-auto overflow-x-hidden
        w-full
        h-full 
        md:overflow-visible
      " 
    > 
        <router-view :key="$route.query.t"  />
    </div>
  </div>
</template>



<script> 
// import data  from "/@/data/sqlInterfaceData2.js";

// import UnityProgress from "/@/assets/TemplateData/UnityProgress.js"; 
// import UnityLoader from "/@/assets/TemplateData/UnityLoader.js"; 

export default {
  name: "home",

  components: { 
  },
  data() {
    return { 
    };
  }, 

  mounted() {
    
  },
  methods: {
    
  },
};
</script>

<style>
img{
  border-radius: 6px;
}
.card{
  background-color: white;
  border-radius: 6px;
}

</style>
<style scoped>
.main {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;
}
.content {
  position: relative;
  top: -80px;
}

.threejs {
  width: 500px;
  height: 500px;
}


</style>
  