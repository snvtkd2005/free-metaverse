<template>
  <div class="w-full h-full relative pointer-events-auto">
    <div class="absolute left-0 top-20 md:top-20 flex">
      <div class="relative transform md:scale-100 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full -z-10">
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
            class="absolute left-0 bottom-16 w-full px-5 flex justify-between text-yellow-wow pointer-events-auto"
          >
            <div class="relative ml-1 w-20 h-8">
              <img class="w-full h-full" :src="redBtnUrl" alt="" />
              <div
                class="absolute left-0 top-1 w-full h-8 text-xs cursor-pointer"
                @click="clickEvent('接受')"
              >
                接受
              </div>
            </div>
            <div class="relative mr-4 w-20 h-8">
              <img class="w-full h-full" :src="redBtnUrl" alt="" />
              <div
                class="absolute left-0 top-1 w-full h-8 text-xs cursor-pointer"
                @click="clickEvent('拒绝')"
              >
                拒绝
              </div>
            </div>
          </div>
        </div>
        <div class="mx-auto flex pointer-events-none">
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
            <div class="flex">
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
            {{ taskData.from }}
          </div>

          <div
            class="absolute left-0 top-0 w-72 pr-2 pt-4 text-left h-auto max-h-80 ml-9 text-gray-800 mt-20 mx-auto"
          >
            <div class="font-bold text-black mb-1">
              {{ taskData.taskTitle }}
            </div>
            <div class="text-sm mb-2">{{ taskData.describe }}</div>
            <div class="font-bold text-black">任务目标</div>
            <div class="text-sm mb-2">{{ taskData.targetDescribe }}</div>
            <div class="font-bold text-black">奖励</div>

            <div
              v-if="taskData.rewardItems && taskData.rewardItems.length > 0"
              class="text-sm"
            >
              你将得到：
            </div>
            <div class="mb-1 grid gap-y-1 grid-cols-2">
              <div
                v-for="(item, i) in taskData.rewardItems"
                :key="i"
                class="pointer-events-auto"
                @mouseover="LookSkill($event, item)"
                @mouseleave="outHover()"
              >
                <div
                  v-if="item.skill != null"
                  class="w-full h-full relative flex"
                >
                  <div class=" relative">
                    <img
                      v-if="item.skill.icon"
                      class="w-9 h-9 rounded-md"
                      :src="
                        item.skill.icon.includes('http') ||
                        item.skill.icon.includes('./public')
                          ? item.skill.icon
                          : this.$uploadUVAnimUrl + item.skill.icon
                      "
                      alt=""
                    />

                    <div
                    v-if="item.count"
                    class="absolute -right-0 -bottom-0 w-4 h-4 text-white rounded-full text-xs leading-4 p-px"
                  >
                    {{ item.count }}
                  </div>

                  </div>

                  <div
                    class="h-9 w-24 text-sm border text-left flex rounded-md p-1 leading-3 overflow-hidden"
                  >
                    <div class="self-center">
                      {{ item.skill.name }}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="text-sm flex">
              <div>你将得到：{{ taskData.rewardGold }}</div>
              <div class="ml-1 mt-px">
                <img :src="goldUrl" alt="" />
              </div>
            </div>
            <div class="text-sm">经验值：{{ taskData.rewardExp }}</div>
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
      taskData: {},
      goldUrl: "./public/images/cursorList/containerframe/ui-goldicon.png",

      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      redBtnUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-up.png",
      leftIcon: "./public/images/cursorList/ui-targetingframe-skull.png",
      hoverPart: "",

    };
  },
  created() {},
  mounted() {
    // return;

    setTimeout(() => {
      // _Global.addEventListener(
      // "主角姓名",
      // () => {
      //   setTimeout(() => {
      //     this.resetTaskData(this.taskData);
      //   }, 100);
      // });

      _Global.addEventListener("openTask",(id) => {
         for (let i = 0; i < _Global.taskList.length; i++) {
           const element = _Global.taskList[i];
           if(element.id == id){
             this.resetTaskData(element);
           }
         }
      });

    }, 1000);
  },

  methods: {

    resetTaskData(taskData) {

      console.log("触发任务 ",taskData);
      this.taskData = taskData;
      taskData.describe = taskData.describe.replace(
        "${name}",
        _Global.playerName ? _Global.playerName : "哈哈"
      );
      if (taskData.targetList && taskData.targetList.length > 0) {
      
      for (let j = 0; j < taskData.targetList.length; j++) {
            const target = taskData.targetList[j];
            target.completed = false;
            if(target.type=='kill'){
              target.num = 0;
            }
        }
      }
      if (taskData.rewardItems && taskData.rewardItems.length > 0) {
        
        for (let i = 0; i < taskData.rewardItems.length; i++) {
          const element = taskData.rewardItems[i];



          if (element.type == "equip") {
            let path =
              _Global.YJ3D.$uploadUrl +
              element.id +
              "/" +
              "data.txt" +
              "?time=" +
              new Date().getTime();
            _Global.YJ3D._YJSceneManager.LoadAssset(path, (data) => {
              let equip = {
                type: "equip",
                // 唯一id
                folderBase: data.folderBase,
                icon: _Global.url.uploadUrl + data.folderBase + "/" + data.icon,
                // 装备名称
                name: data.name,
                // 品质
                qualityType: data.message.data.qualityType,
                // 部位，唯一
                part: data.message.data.partType,
                // 武器或装备
                pointType: data.message.pointType,
                // 附加属性
                propertyList: data.message.data.propertyList,
              };
              element.skill = equip;
              // console.log(" in task panel 加载装备  ", equip, element);
            });
          }
          if (element.type == "prop") {

            let data = _Global.GetPropById(element.id);
              // console.log(" in task panel 加载 道具  ", data);
            element.skill = data;
            element.skill.count = element.count;
          }
        }
      }

      this.$nextTick(()=>{
        _Global.applyEvent("界面开关", "receiveTask", true);
      });

    },
    LookSkill(ev, item) {
      // console.log(e);
      this.hoverPart = item.hoverPart; 
      let parent = ev.target;
      this.$parent.LookSkill(parent, item.skill);
    },
    outHover() {
      this.hoverPart = "";
      this.$parent.outHover();
    },
    clickEvent(e) {
      if (e == "关闭窗口") {
        // _Global.applyEvent("界面开关", "receiveTask", false);
      }
      if (e == "接受") {
        //接受任务
        _Global.applyEvent("界面开关", "receiveTask", false);
        this.$parent.$refs.taskListPanel.addTask(this.taskData);
        _Global._YJAudioManager.playAudio('1722064234835/iquestactivate.ogg');
       

      }
    },
  },
};
</script>
 