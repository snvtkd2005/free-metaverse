

<template>
  <!-- buff栏 -->
  <div
    class="absolute lett-0 top-0 flex w-full pointer-events-none h-full text-sm text-white"
  >
    <div
      class="absolute left-0 top-0 w-full h-full flex  "
    >
    <div class=" absolute right-40 top-4  mx-auto   px-2  flex flex-row-reverse gap-2 pointer-events-auto rounded-lg">
      
      <div
        v-for="(item, i) in buffList"
        :key="i"
        class="p-1 w-12 h-12 text-left"
        :class="0 == item.id ? ' ' : ' cursor-pointer '"
        @click="UserModel(item)"
        @mouseover="
          LookSkill($event, item);
          hover = true;
        "
        @mouseleave="hover = false"
      >
        <div class="relative flex flex-col">
          <div class="self-center mx-auto w-10 h-10 bg-white rounded-xl">
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
    <div class=" absolute right-40 top-40 w-auto flex flex-row-reverse  px-2 mx-auto pointer-events-auto rounded-lg">
      <div
        v-for="(item, i) in debuffList"
        :key="i"
        class="p-1 w-12 h-12 text-left"
        :class="0 == item.id ? ' ' : ' cursor-pointer '"
        @click="UserModel(item)"
        @mouseover="
          LookSkill($event, item);
          hover = true;
        "
        @mouseleave="hover = false"
      >
        <div class="relative flex flex-col">
          <div class="self-center mx-auto w-10 h-10 bg-white rounded-xl">
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
      v-if="hover"
      class="absolute w-2 h-2 text-white"
      :style="
        ' position:absolute; left:' +
        hoverPanelOffset.x +
        'px;top:' +
        hoverPanelOffset.y +
        'px'
      "
    >
      <div
        class="p-2 absolute bottom-0 left-0 text-center origin-bottom transform -translate-y-6 -translate-x-10 w-32 h-auto rounded-md bg-black"
      >
        <div class="px-px text-yellow-100">
          {{ describe.title }}
        </div>
        <div class="text-xs text-yellow-100">
          {{ describe.describe }}
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
      hover: false,
      hoverId: "",
      hoverPanelOffset: { x: 120, y: 0 },
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
      describe: {
        title: "技能名",
        describe: "",
      },
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
          // console.log("移除buff", (id));
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
    LookSkill(e, item) {
      this.hoverId = item.id;
      this.describe.title = item.skillName;
      this.describe.describe = item.describe;
      this.hoverPanelOffset.x = e.clientX;
      // this.hoverPanelOffset.y = 840;
      this.hoverPanelOffset.y = e.clientY;
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
    UserModel(item) {},
  },
};
</script>
