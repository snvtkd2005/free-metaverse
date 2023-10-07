<template>
  <div class=" absolute left-0 top-0 w-full h-full pointer-events-none">
    <!-- 左侧导航栏 -->
    <Menu class=" pointer-events-auto "></Menu>
    <!-- 
      1.DEX CENTER
      2.COMPANY
      3.NEWS
      4.BUSINESS
       -->
        <!-- self-center mx-auto -->
    <Dialog class="  pointer-events-auto  " v-if="inOtherType" :type="dialogType"> </Dialog>
    <!-- About弹窗 -->
    <AboutDialog class=" pointer-events-auto " v-if="inAboutDialog"></AboutDialog>
    <!-- Recruit弹窗 -->
    <RecruitDialog class="  pointer-events-auto " v-if="inRecruiDialog"></RecruitDialog>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import Dialog from "../components/Dialog.vue";
import AboutDialog from "../components/AboutDialog.vue";
import RecruitDialog from "../components/RecruitDialog.vue";
export default {
  components: {
    Menu,
    Dialog,
    AboutDialog,
    RecruitDialog,
  },
  data() {
    return {
      dialogType: 1,
      inAboutDialog: false,
      inRecruiDialog: false,
      inOtherType: false,
    };
  },
  methods: {
    Close(e) {
      if (e == "about") {
        this.inAboutDialog = false;
      }
      if (e == "recruit") {
        this.inRecruiDialog = false;
      }
      
      if (e == "other") {
        this.inOtherType = false;
      }
      this.$parent.SetMinMapDisplay(true);

    },
    LoadDialog(id) {
      console.log("显示弹窗id " + id);
      if (id == "10000") {
        this.inOtherType = true;
        this.dialogType = 2;
      }
      if (id == "10006") {
        this.inOtherType = true;
        this.dialogType = 1;
      }

      if (id == "10004") {
        this.inOtherType = true;
        this.dialogType = 3;
      }
      if (id == "10003") {
        this.inOtherType = true;
        this.dialogType = 4;
      }

      if(id=="10005"){
        this.inOtherType =true;
        this.dialogType = 5;
      }

      if (id == "10001") {
        this.inAboutDialog = true;
      }

      if (id == "10002") {
        this.inRecruiDialog = true;
      }

      this.$parent.SetMinMapDisplay(false);
    },
  },
};
</script>

<style></style>
