
<template>
  <div class=" absolute left-0 top-0 w-full h-full pointer-events-none ">

    <skillPanel ref="skillPanel" />
    <div class=" absolute left-24 top-10">
      <!-- 左上角血条头像 -->
      <headerUI ref="headerUI" />
    </div>
    <div class="  absolute w-full left-0 bottom-2">
      <skillProgressUI ref="skillProgressUI" />
    </div>

    <damageUI ref="damageUI" />
    <fireStateUI ref="fireStateUI" />
  </div>
</template>

<script>


import headerUI from "./headerUI.vue";
import skillPanel from "./skillPanel.vue";
import skillProgressUI from "./skillProgressUI.vue";
import damageUI from "./damageUI.vue";
import fireStateUI from "./fireStateUI.vue";

export default {
  name: "HUD",
  components: {
    skillPanel,
    headerUI,
    skillProgressUI,
    damageUI,
    fireStateUI,
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
  