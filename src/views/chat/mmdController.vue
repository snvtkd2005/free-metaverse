

// MMD 舞姬控制界面

<template>

  <div class=" w-full h-full relative flex pointer-events-none  ">
    <div class=" absolute bottom-5 right-5 w-40 mx-auto flex justify-between">
      <div class="w-16 h-16 relative z-10  flex  self-center pointer-events-auto cursor-pointer " @click="ChangeMMDAnim('动作一')">
        <div class=" w-full h-full absolute left-0 top-0 -z-10 rounded-full bg-gray-400 opacity-100 "></div>
        <p class=" self-center mx-auto text-white ">动作一</p>
      </div>
      <div class="w-16 h-16 relative z-10  flex  self-center  pointer-events-auto cursor-pointer " @click="ChangeMMDAnim('动作二')">
        <div class=" w-full h-full absolute left-0 top-0 -z-10 rounded-full bg-gray-400 opacity-100 "></div>
        <p class=" self-center mx-auto text-white ">动作二</p>
      </div>
      
    </div>
  </div>
</template>

<script>
 

export default {
  components: {},
  data() {
    return {
      
      
    };
  },

  mounted() {},
  methods: { 
    ChangeMMDAnim(animName){
      let an = "classic";
      if(animName == "动作一"){
        an = this.$publicUrl+"models/mmd/Kizuna/classic.vmd";
      }
      if(animName == "动作二"){
        an = this.$publicUrl+"models/mmd/vmds/wavefile_v2.vmd";
      }
      this.$parent.ChangeMMDAnim( {mmdName:"初音",animName:an});
    },
  },
};
</script>

<style>
</style>
