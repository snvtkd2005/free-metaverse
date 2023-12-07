
// 游戏主界面: 消灭病毒游戏技能栏
<template>
  <!-- 底部技能栏 -->
  <div v-if="actionBar"
    class="  flex  absolute bottom-2  xl:bottom-10 w-full pointer-events-none  h-12 text-sm text-white">


    <div class=" w-auto px-2 mx-auto h-full flex gap-2 pointer-events-auto rounded-lg ">

      <div v-for="(item, i) in skillList" :key="i" class=" p-1 w-12 h-12 text-left " :class="0 == item.id
        ? ' '
        : ' cursor-pointer '
        " @click="UserModel(item)" @mouseover="LookSkill($event, item); hover = true;" @mouseleave="hover = false;">

        <div class=" relative flex w-full h-full   ">
          <div class=" self-center mx-auto w-full h-full  bg-white rounded-xl ">
            <img class=" w-10 h-10 rounded-lg" :src="item.icon" alt="">
          </div>
          <div v-if="item.count>0" class=" absolute -right-1 -top-1 w-4 h-4 flex bg-yellow-600 rounded-xl ">
            <div class=" self-center mx-auto ">
              {{ item.count }}
            </div>
          </div>
          <!-- <div class=" self-center mx-auto ">
              {{ item.name }}
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
        <div class="  self-center mx-auto  "> 攻击 </div>
      </div>
  </div>


  <div v-if="hover" class=" absolute w-2 h-2  text-white  " :style="' position:absolute; left:' +
    (hoverPanelOffset.x) +
    'px;bottom:' +
    (hoverPanelOffset.y) +
    'px'
    ">
    <div class=" absolute  text-center left-0 top-0 origin-bottom transform -translate-y-6 -translate-x-10 w-32 h-auto bg-black bg-opacity-40 ">
      <div class=" text-yellow-100 text-left text-sm">
        {{ skillDescribe.describe2 }}
      </div>
      <div class=" text-yellow-100">
        {{ skillDescribe.describe }}
      </div>
      <div class=" px-px text-yellow-100">
        {{ skillDescribe.title }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "skillPanel_virus",
  components: {

  },
  data() {
    return {
      actionBar: true, //底部动作栏 
      hover: false,
      hoverPanelOffset: { x: 120, y: 220 },
      skillList: [
        { id: 10000,buff:"addArmor", type:"kouzhao", name: "口罩",describe:"防护",describe2:"", count: 0,buffValue:0 ,icon:"" },
        { id: 10001,buff:"addArmor", type: "fanghufu", name: "防护服",describe:"防护",describe2:"", count: 0,buffValue:0,icon:"" }, 
        { id: 10002,buff:"addHealth", type: "zhongcaoyao", name: "中草药汤剂",describe:"生命",describe2:"", count: 0,buffValue:0 ,icon:""}, 
        { id: 10003,buff:"addArmor", type: "jiujingpenghu", name: "酒精喷壶",describe:"防护",describe2:"", count: 0,buffValue:0,icon:"" }, 
        { id: 10004,buff:"addEnergy", type: "nengliang", name: "能量补给",describe:"能量",describe2:"每次攻击消耗30点能量，对最多3个目标造成伤害", count: 0,buffValue:0,icon:"" }, 
      ],
      skillDescribe: {
        title: "技能名",
        describe: "",
        describe2: "",
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
    initIcon(skill){
      // console.log("in skill panel 22 ", skill);
      for (let i = 0; i < this.skillList.length; i++) {
        const item =  this.skillList[i];
        if(item.type == skill.type){
          item.count = skill.count;
          item.buffValue = skill.value;
          item.icon = this.$uploadUVAnimUrl + skill.imgPath;
          item.describe = (item.buff=="addArmor"?"护甲":item.buff=="addHealth"?"生命":"能量") + " +"+item.buffValue;
        }
      } 
    },
    SetSkillCount(skill) {
      // console.log("in skill panel ", skill);
      for (let i = 0; i < this.skillList.length; i++) {
        const item =  this.skillList[i];
        if(item.type == skill.type){
          item.count = skill.count;
        }
      } 
    },
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
      this.skillDescribe.describe = item.describe;
      this.skillDescribe.describe2 = item.describe2;
      this.hoverPanelOffset.x = e.clientX;
      this.hoverPanelOffset.y = 100;
      // this.hoverPanelOffset.y = e.clientY;
      // console.log("鼠标悬浮在技能上 ", item);
      // console.log("鼠标悬浮在技能上 2 ", e, this.hoverPanelOffset);
    },
    clickSkill(e) {
      console.log("点击技能 ",e);
      if(e=="攻击"){ 
        _Global.YJ3D.YJController.SetInteractiveNPC("点击技能");
      }
    },
    //动作栏。 使用技能或物体
    UserModel(item) {
      //播放角色动作
      console.log(" 点击技能栏 ", item);
      if(item.count<=0){
        console.log(" 道具数量为0");
        return;
      }
      _Global.SceneManager.UserModel(item);
      return;
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