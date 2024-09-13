<template>
  <div id="app" class="absolute left-0 top-0 w-full h-full flex overflow-hidden">
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
</style>

