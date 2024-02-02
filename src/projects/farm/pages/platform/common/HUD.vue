
<template>
  <!-- HUD -->
  <div class=" absolute left-0 top-0 w-full h-full pointer-events-none ">

    <div class=" absolute bottom-20  w-full   ">
      <skillPanel_virus ref="skillPanel_virus" />
    </div>

    <div class=" absolute bottom-0  w-full   ">
      <skillPanel ref="skillPanel" />
    </div>

    <!-- 左上角血条头像 -->
    <div class=" absolute left-24 top-10">
      <headerUI ref="headerUI" />
    </div>
    <div class="  absolute w-full left-0 bottom-2">
      <skillProgressUI color="blue" ref="skillProgressUI" />
    </div>

    <damageUI ref="damageUI" />
    <fireStateUI ref="fireStateUI" />
  </div>
</template>

<script>


import headerUI from "./headerUI.vue";
import skillPanel from "./skillPanel_wow_mobile.vue";
// import skillPanel from "./skillPanel_wow_pc.vue";
import skillProgressUI from "./skillProgressUI.vue";
import damageUI from "./damageUI.vue";
import fireStateUI from "./fireStateUI.vue";
import skillPanel_virus from "./skillPanel_virus.vue";

export default {
  name: "HUD",
  components: {
    skillPanel,
    headerUI,
    skillProgressUI,
    damageUI,
    fireStateUI,
    skillPanel_virus,
  },
  data() {
    return {
    };
  },
  created() {

  },
  mounted() {
  },
  methods: {

  },
};
</script>
  