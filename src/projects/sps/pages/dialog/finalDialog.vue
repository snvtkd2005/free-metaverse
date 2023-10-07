<template>
  <div class="indexDialog">
    <BlogDialog ref="blog"></BlogDialog>
    <BusinessDialog ref="business"></BusinessDialog>
    <CompanyDialog ref="company"></CompanyDialog>
    <RecruitDialog ref="recruit"></RecruitDialog>
    <WorkDialog ref="work"></WorkDialog>
    <ElevatorDialog ref="elevator"></ElevatorDialog>
    <RidingDialog ref="riding"></RidingDialog>
    <RidingSecDialog ref="ridingSec"></RidingSecDialog> 
  </div>
</template>

<script>
import BlogDialog from "./blogDialog.vue";
import BusinessDialog from "./businessDialog.vue";
import CompanyDialog from "./companyDialog.vue";
import RecruitDialog from "./recruitDialog.vue";
import WorkDialog from "./workDialog.vue";
import ElevatorDialog from "./elevatorDialog.vue";
import RidingSecDialog from "./ridingSecDialog.vue"
import RidingDialog from "./ridingDialog.vue"
import { Interface_UI } from "../../js/InterfaceUI";
export default {
  // props: ["showDialogNum"],
  data(){
    return{
      showDialogNum:0,
    }
  },
  components: {
    BlogDialog,
    BusinessDialog,
    CompanyDialog,
    RecruitDialog,
    WorkDialog,
    RidingDialog,
    ElevatorDialog,
    RidingSecDialog
  },
  mounted(){
    new Interface_UI(this)
  }
};
</script>

<style></style>
