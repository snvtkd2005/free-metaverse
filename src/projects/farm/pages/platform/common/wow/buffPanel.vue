

<template>
  <!-- buff栏 -->
  <div
    class="absolute lett-0 top-0 flex w-full pointer-events-none h-full text-sm text-white"
  >
    <div
      class="absolute left-0 top-0 w-full h-full flex  "
    >
    <div class=" absolute right-40 top-4 gap-4    mx-auto   px-2  flex flex-row-reverse  rounded-lg">
      
      <div
        v-for="(item, i) in buffList"
        :key="i"
        class=" w-9 h-9 transform scale-125 text-left "
      >
        <div class="relative flex flex-col">
          <div class="self-center mx-auto w-9 h-9 bg-white rounded-xl cursor-pointer pointer-events-auto"
          
        @contextmenu.prevent="onContextMenu($event, item)"
        @mouseover="LookSkill($event, item);"
        @mouseleave="outHover()" 
          >
            <img class="w-full h-full rounded-lg" :src="item.icon" alt="" />
          </div>
          <div class="hidden w-auto self-center truncate justify-between">
            <text>{{ item.skillName }}</text>
          </div>
          <div class="w-auto self-center truncate flex justify-between">
            <text>{{ item.duration }}</text>
          </div>
        </div>
    </div>
      </div>
    </div>

    <div
      class="absolute left-0 top-0 w-full h-full flex "
    >
    <div class=" absolute right-48 top-40  gap-4 w-auto flex flex-row-reverse  px-2 mx-auto ">
      <div
        v-for="(item, i) in debuffList"
        :key="i"
        class=" w-9 h-9 transform scale-125 text-left" 
      >
        <div class="relative flex flex-col">
          <div class="self-center mx-auto w-9 h-9 bg-black  rounded-md  pointer-events-auto "

          @mouseover=" LookSkill($event, item); "
          @mouseleave="outHover()" 
          >
            <img class="w-full h-full " :src="item.icon" alt="" />
          </div>
          <div class="hidden w-auto self-center truncate justify-between">
            <text>{{ item.skillName }}</text>
          </div>
          <div class="w-auto self-center truncate flex justify-between">
            <text>{{ item.duration }}</text>
          </div>
        </div>
      </div>
    </div>
    </div>
 
  </div>
</template>

<script>
export default {
  name: "buffPanel",
  components: {},
  data() {
    return {
      buffList: [
        // {
        //   id: 'id',
        //   icon: 'icon',
        //   duration: 'duration',
        //   describe: 'describe',
        //   skillName: 'effect.skillName',
        // },
      ],
      debuffList: [
        // {
        //   id: 'id',
        //   icon: 'icon',
        //   duration: 'duration',
        //   describe: 'describe',
        //   skillName: 'effect.skillName',
        // },
      ], 
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      _Global.addEventListener("主角头像", (s) => {
        _Global._YJPlayerFireCtrl.addEventListener("添加debuff", (debuff) => {
          debuff.icon = _Global.url.uploadUVAnimUrl + debuff.icon;
          this.debuffList.push(debuff);
        });

        _Global._YJPlayerFireCtrl.addEventListener("debuffCD", (debuff) => {
          for (let i = 0; i < this.debuffList.length; i++) {
            const element = this.debuffList[i];
            if (element.id == debuff.id) {
              element.duration = debuff.duration;
              this.$forceUpdate();
              return;
            }
          }
        });

        _Global._YJPlayerFireCtrl.addEventListener("移除debuff", (id) => {
          for (let i = 0; i < this.debuffList.length; i++) {
            const element = this.debuffList[i];
            if (element.id == id) {
              this.debuffList.splice(i, 1);
              if (this.hoverId == id) {
                this.hover = false;
              }
              return;
            }
          }
        });

        _Global._YJPlayerFireCtrl.addEventListener("添加buff", (buff) => {
          buff.icon = _Global.url.uploadUVAnimUrl + buff.icon;
          this.buffList.push(buff);
        });
        _Global._YJPlayerFireCtrl.addEventListener("移除buff", (id) => {
          console.log("移除buff", (id), this.buffList);
          for (let i = 0; i < this.buffList.length; i++) {
            const element = this.buffList[i];
            if (element.id == id) {
              this.buffList.splice(i, 1);
              if (this.hoverId == id) {
                this.hover = false;
              }
              return;
            }
          }
        });

        _Global._YJPlayerFireCtrl.addEventListener("buffCD", (buff) => {
          for (let i = 0; i < this.buffList.length; i++) {
            const element = this.buffList[i];
            if (element.id == buff.id) {
              element.duration = buff.duration;
              this.$forceUpdate();
              return;
            }
          }
        });
      });
    }, 2000);
  },
  methods: {
    LookSkill(ev, item) {
      item.hoverPart = "buff";
      this.hoverPart = item.hoverPart;
      let parent = ev.target;
      this.$parent.LookSkill(parent, item); 
    },
    outHover() {
      this.hoverPart = "";
      this.$parent.outHover();
    },
    //buff动作栏。 右键取消增益buff 
    onContextMenu(ev, item) { 
      ev.preventDefault(); 
      if (ev.button == 2) {
        // 右键取消buff
        _Global._YJPlayerFireCtrl.applyEvent("解除技能",item);
      }
    },
  },
};
</script>
