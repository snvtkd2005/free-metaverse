
// 游戏主界面: 底部技能栏
<template>
  <!-- 底部技能栏 -->
  <div v-if="actionBar"
    class=" md:hidden flex  absolute bottom-2  xl:bottom-10 w-full pointer-events-none  h-12 text-sm text-white">


    <div class=" w-auto px-2 mx-auto h-full flex gap-2 pointer-events-auto bg-color rounded-lg ">

      <div v-for="(item, i) in skillList" :key="i" class=" p-1 w-12 h-12 text-left " :class="0 == item.id
        ? ' '
        : ' cursor-pointer '
        " @click="UserModel(item)" @mouseover="LookSkill($event, item); hover = true;" @mouseleave="hover = false;">

        <div class=" relative flex w-full h-full   ">
          <div class=" self-center mx-auto w-full h-full  bg-white rounded-xl ">
            <img class=" w-10 h-10 rounded-lg" :src="item.icon" alt="">
          </div>
          <!-- <div v-if="item.count>0" class=" absolute -right-1 -top-1 w-6 h-4 flex bg-yellow-600 rounded-xl ">
            <div class=" self-center mx-auto ">
              {{ item.count }}
            </div>
          </div> -->

          <!-- <div v-if="(!hasTarget && item.name !='') ||  (item.name !='' && item.count==0)   " class=" absolute left-0 top-0 w-full h-full rounded-xl bg-black opacity-20">
          </div> -->
        </div>
      </div>

    </div>
  </div>

  <div v-if="actionBar"
    class="  flex  absolute right-0 bottom-0 w-40 pointer-events-auto  h-40 text-sm text-white">

    <div class=" absolute left-0 top-0 w-16 h-16 flex bg-black bg-opacity-50 rounded-full "
    @click="clickSkill('攻击')">
        <!-- <img class=" w-10 h-10 rounded-full" :src="item.icon" alt=""> -->
        <div class="  self-center mx-auto  "> 攻击 </div>
      </div>
  </div>


  <div v-if="hover" class=" absolute w-2 h-2  text-white  " :style="' position:absolute; left:' +
    (hoverPanelOffset.x) +
    'px;top:' +
    (hoverPanelOffset.y) +
    'px'
    ">
    <div class=" absolute  text-center left-0 top-0 origin-bottom transform -translate-y-6 -translate-x-10 w-20 h-6 bg-black bg-opacity-40 ">

      <div class=" px-px  text-yellow-100">
        {{ skillDescribe.title }}
      </div>
      <div class=" text-yellow-100">
        {{ skillDescribe.describe }}
      </div>
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
      hoverPanelOffset: { x: 120, y: 120 },
      actionBar: true, //底部动作栏 
      skillList: [
        { id: 10000, type: "attack", name: "南瓜", count: 10 },
        // { id: 10001, type: "attack", name: "胡萝卜", count: 10 },
        // { id: 0, name: "" },
        // { id: 0, name: "" },
        // { id: 0, name: "" },
      ],
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
 
    // setTimeout(() => {
    //   _Global.YJ3D._YJSceneManager.CreateOrLoadPlayerAnimData().GetSkillList("小孩", this.SetSkillList);
    // }, 5000);

  },
  methods: {

    SetSkillList(_skillList) {
      console.log("in skill panel ", _skillList);
      for (let i = 0; i < _skillList.length; i++) {
        this.skillList.push(_skillList[i]);
      }
      this.actionBar = true;
    },
    SetTargetVaild(b) {
      this.hasTarget = b;
    },
    LookSkill(e, item) {

      this.skillDescribe.title = item.name;
      this.hoverPanelOffset.x = e.clientX;
      this.hoverPanelOffset.y = 840;
      // this.hoverPanelOffset.y = e.clientY;
      // console.log("鼠标悬浮在技能上 ", item);
      // console.log("鼠标悬浮在技能上 2 ", e, this.hoverPanelOffset);
    },
    clickSkill(e) {
      console.log("点击技能 ",e);
      if(e=="攻击"){
        // this.UserModel(this.skillList[index]);
        _Global.YJ3D.YJController.SetInteractiveNPC("点击技能");
      }
    },
    //动作栏。 使用技能或物体
    UserModel(item) {
      //播放角色动作
      console.log(" 点击技能栏 ", item);
      _Global.SendMsgTo3D("点击技能栏", item.animList[0].animName);
    },
  },
};
</script>
 
<style scoped>
.bg-color {
  background: #28cad9;
}
</style>