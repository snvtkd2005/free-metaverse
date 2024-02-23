
// 游戏主界面: 玩家技能栏
<template>
  <!-- 玩家技能栏 -->
  <div v-if="actionBar" class=" absolute right-0 bottom-0 w-40 h-40 flex pointer-events-none text-sm text-white">

    <div class=" w-auto px-2 mx-auto h-full flex gap-2 pointer-events-auto rounded-lg ">

      <div class=" absolute left-0 top-0 w-12 h-12 text-left pointer-events-auto cursor-pointer " 
       @click="UserModel(skill_first)" @mouseover="LookSkill($event, skill_first); hover = true;" @mouseleave="hover = false;">
        <div class=" relative flex w-full h-full   ">
          <div class=" self-center mx-auto w-full h-full  bg-black rounded-full ">
            <img class=" w-full h-full rounded-full" :src="$uploadUVAnimUrl + skill_first.icon" alt="">
          </div> 
        </div>
      </div>

    </div>



    <div class=" hidden absolute  w-2 h-2  text-white  " :style="' position:absolute; left:' +
      (hoverPanelOffset.x) +
      'px;top:' +
      (hoverPanelOffset.y) +
      'px'
      ">
      <div
        class="  p-2 absolute bottom-0 left-0   text-center origin-bottom transform -translate-y-6 -translate-x-10 w-32 h-auto rounded-md bg-black  ">

        <div class=" px-px  text-yellow-100">
          {{ skillDescribe.title }}
        </div>
        <div class=" text-xs text-yellow-100">
          {{ skillDescribe.describe }}
        </div>
      </div>
    </div>
  </div>
  <!-- bg-black bg-opacity-30 -->


  <div v-if="actionBar" class="  flex  absolute right-0 bottom-0 w-28 h-28  pointer-events-auto   text-sm text-white">
    <div class=" absolute left-0 top-0 w-16 h-16 flex bg-black bg-opacity-50 rounded-full cursor-pointer " @click="clickSkill('攻击')">
      <!-- <img class=" w-10 h-10 rounded-full" :src="item.icon" alt=""> -->
      <div class="  self-center mx-auto  "> 攻击 </div>
    </div>
  </div>
  
</template>

<script>

export default {
  name: "skillPanel",
  components: {

  },
  data() {
    return {
      hover: false,
      hoverPanelOffset: { x: 120, y: 0 },
      actionBar: true, //底部动作栏 
      skillList: [
        { id: 10000, type: "attack", name: "南瓜", count: 10 },
        // { id: 10001, type: "attack", name: "胡萝卜", count: 10 },
        // { id: 0, name: "" },
        // { id: 0, name: "" },
        // { id: 0, name: "" },
      ],
      skill_first:{},
      skillDescribe: {
        title: "技能名",
        describe: "",
      },
      // 是否有目标，目标为npc、其他玩家
      hasTarget: false,
    };
  },
  created() {

  },
  mounted() {


    setTimeout(() => {
      console.log("_Global.skillList_scene ",_Global.skillList_scene);
      if (_Global.skillList_scene == undefined || _Global.skillList_scene.length == 0) {
        this.actionBar = false;
        return;
      }
      this.skillList = _Global.skillList_scene;
      this.skill_first = this.skillList[0];
    }, 3000);
  },
  methods: {

    SetSkillList(_skillList) {
      console.log("in skill panel ", _skillList);
      for (let i = 0; i < _skillList.length; i++) {
        this.skillList.push(_skillList[i]);
      }
      this.skill_first = this.skillList[0];
      this.actionBar = true;
    },
    SetTargetVaild(b) {
      this.hasTarget = b;
    },
    LookSkill(e, item) {

      this.skillDescribe.title = item.skillName;
      this.skillDescribe.describe = item.describe;
      this.hoverPanelOffset.x = e.clientX;
      // this.hoverPanelOffset.y = 840;
      // this.hoverPanelOffset.y = e.clientY;
      // console.log("鼠标悬浮在技能上 ", item);
      // console.log("鼠标悬浮在技能上 2 ", e, this.hoverPanelOffset);
    },
    clickSkill(e) {
      // console.log("点击技能 ", e);
      if (e == "攻击") {
        _Global.YJ3D.YJController.SetInteractiveNPC("点击技能", "普通攻击");
        return;
      }
    },
    //动作栏。 使用技能或物体
    UserModel(item) {
      //播放角色动作
      console.log(" 点击技能栏 ", item);
      _Global.YJ3D.YJController.SetInteractiveNPC("点击技能", item);
    },
  },
};
</script>
 
<style scoped>
.bg-color {
  background: #28cad9;
}
</style>