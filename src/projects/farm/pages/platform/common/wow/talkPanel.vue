<template>
  <div class="w-full h-full relative pointer-events-none">
    <div class="absolute left-0 top-20 md:top-20 flex">
      <div class="relative transform md:scale-100 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full pointer-events-none -z-10">
          <div class="absolute left-1 top-1">
            <img class="w-16 h-16 rounded-full" :src="leftIcon" alt="" />
          </div>
          <div
            class="absolute right-6 mr-0.5 top-3.5 pointer-events-auto cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            <img :src="closeUrl" alt="" />
          </div>
        </div>

        <div
          class="absolute left-0 top-0 w-full h-full z-10 pointer-events-none"
        >
          <div
            class="absolute left-0 bottom-16 w-full px-5 flex justify-between text-yellow-wow "
          >
            <div class="relative ml-1 w-20 h-8   pointer-events-auto cursor-pointer"
            @click="clickEvent('关闭窗口')"
            >
              <img class="w-full h-full" :src="redBtnUrl" alt="" />
              <div
                class="absolute left-0 top-1 w-full h-8  text-xs"
              >
                再见
              </div>
            </div>
            <div class="relative mr-4 w-20 h-8  pointer-events-auto cursor-pointer" 
            @click="clickEvent('关闭窗口')"
            >
              <img class="w-full h-full  " :src="redBtnUrl" alt="" />
              <div class="absolute left-0 top-1  w-full h-8 text-xs  " >
                关闭
              </div>
            </div>
          </div>
        </div>
        <div class="mx-auto  flex pointer-events-none">
          <div class="flex flex-col">
            <div class="flex">
              <div
                class="w-64 h-64"
                style="
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-questgreeting-topleft.png);
                "
              ></div>
              <div
                class="w-32 h-64"
                style="
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-questgreeting-topright.png);
                "
              ></div>
            </div>
            <div class="flex ">
              <div
                class="w-64 h-64"
                style="
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-questgreeting-botleft.png);
                "
              ></div>

              <div
                class="w-32 h-64"
                style="
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-questgreeting-botright.png);
                "
              ></div>
            </div>
          </div>
        </div>
        <div class="absolute left-0 top-0 h-96 flex">
          <div
            class="text-yellow-wow w-48 ml-24 pl-2 mx-auto tracking-widest mt-6 inline-block h-5 text-xs"
          >
            {{ from }}
          </div>

          <div
            class="absolute left-0 top-0 w-72 pr-2 pt-4 text-left h-auto max-h-80 ml-9 text-gray-800 mt-20 mx-auto"
          >
            <div>{{ textContent }}</div>
            <div class="mb-1 grid gap-y-1 grid-cols-2">
              <div
                v-for="(item, i) in taskData"
                :key="i"
                class="pointer-events-auto cursor-pointer"
                @click="clickEvent('选择任务', item)"
              >
                <div
                  class="h-9 w-24 text-sm text-left flex rounded-md p-1 leading-3 overflow-hidden"
                >
                  <div class="self-center text-lg mr-2 font-bold"
                  :class="item.state == 0 ? ' text-yellow-wow' : item.state == 1 ? 'text-gray-400' : 'text-yellow-wow'"
                  >
                    {{ item.state == 0 ? "!" : item.state == 1 ? "?" : "?" }}
                  </div>
                  <div class="self-center">
                    {{ item.task.taskTitle }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



 
<script >
export default {
  props: [],
  components: {},
  data() {
    return {
      taskData: [{ state: 0, task: { id: "sdfsdf", taskTitle: "sdfsdfsdf" } }],
      goldUrl: "./public/images/cursorList/containerframe/ui-goldicon.png",

      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      redBtnUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-up.png",
      leftIcon: "./public/images/cursorList/ui-targetingframe-skull.png",
      hoverPart: "",
      textContent: "sdfsdfsdfsdfsd",
      from: "",
    };
  },
  created() {},
  mounted() {
    // return;

    setTimeout(() => {
      _Global.addEventListener("openTalk", (talkData) => {
        if (_Global.panelState.task) {
          return;
        }

        this.leftIcon = talkData.icon;
        this.textContent = talkData.textContent;
        this.from = talkData.from; 
        this.fromId = talkData.fromId; 
        this.taskData = talkData.taskData;

        // console.log("  this.taskData ", this.taskData);
        this.$nextTick(() => {
          _Global.applyEvent("界面开关", "taskList", false);
          _Global.applyEvent("界面开关", "shop", false);

          _Global.applyEvent("界面开关", "talk", true);
        });
        _Global.talkPos = _Global._YJPlayerFireCtrl.GetWorldPos().clone();

      });
    }, 1000);
  },

  methods: {
    clickEvent(e, item) {
      // console.log(e);
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "talk", false);
      }
      if (e == "选择任务") {
        if(item.state!=0){
          //点击正在进行中的任务，直接打开任务日志面板
          _Global.applyEvent("界面开关", "taskList", true);
          _Global.applyEvent("界面开关", "talk", false);
          return;
        }
        _Global.applyEvent("openTask",{
          taskId: item.task.id,
          from:this.from,
          fromId:this.fromId,
          icon:this.leftIcon,
        });
        _Global.applyEvent("界面开关", "talk", false);
      }
    },
  },
};
</script>
<style scoped>
.cursor-pointer {
    /* cursor: pointer; */
    cursor: none;
}
</style>