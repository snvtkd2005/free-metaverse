<template>
  <div class="w-full h-full relative pointer-events-none">
    <div
      v-show="showPanel"
      class="absolute left-0 top-20 md:top-20 flex pointer-events-auto"
    >
      <div class="relative transform md:scale-100 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full -z-10">
          <div class="absolute left-1 top-1">
            <img class="w-16 h-16 rounded-full" :src="leftIcon" alt="" />
          </div>
        </div>

        <div
          class="absolute left-0 top-0 w-full h-full z-10 pointer-events-none"
        >
          <div
            class="absolute right-16 mr-5 top-2 cursor-pointer pointer-events-auto"
            @click="clickEvent('关闭窗口')"
          >
            <img :src="closeUrl" alt="" />
          </div>

          <div
            class="absolute left-0 bottom-20 w-full h-6 px-5 text-yellow-wow pointer-events-auto"
          >
            <div class="w-auto flex justify-between h-6">
              <div class="flex mt-1 -ml-1 h-6">
                <div class="relative w-28 h-8">
                  <img class="w-full h-full" :src="redBtnUrl" alt="" />
                  <div
                    class="absolute left-0 top-1 w-full h-5 text-xs cursor-pointer"
                    @click="clickEvent('放弃任务')"
                  >
                    放弃任务
                  </div>
                </div>

                <div class="relative w-24 h-8">
                  <img class="w-full h-full" :src="redBtnUrl" alt="" />
                  <div
                    class="absolute left-0 top-1 w-full h-5 text-xs cursor-pointer"
                    @click="clickEvent('共享任务')"
                  >
                    共享任务
                  </div>
                </div>

                <div class="relative w-24 h-8 "
                
                >
                  <img class="w-full h-full" :src="redBtnUrl" alt="" />
                  <div
                    class="absolute left-0 top-1 w-full h-5 text-xs "
                    @click="clickEvent('完成任务')"
                    :class="selectIsCompleted?' cursor-pointer ':' text-gray-400 '" 
                  >
                    完成任务
                  </div>
                </div>
              </div>

              <div class="mt-1 h-6 mr-2">
                <div class="relative mr-16 w-20 h-8">
                  <img class="w-full h-full" :src="redBtnUrl" alt="" />
                  <div
                    class="absolute left-0 top-1 w-full h-5 text-xs cursor-pointer"
                    @click="clickEvent('关闭窗口')"
                  >
                    关闭
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pointer-events-none mx-auto flex">
          <div class="flex flex-col">
            <div class="flex">
              <div
                class="w-64 h-64"
                style="
                  width: 512px;
                  height: 512px;
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-questlogdualpane-left.png);
                "
              ></div>
              <div
                class="w-64 h-64"
                style="
                  width: 256px;
                  height: 512px;
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-questlogdualpane-right.png);
                "
              ></div>
            </div>
          </div>
        </div>
        <div class="absolute left-0 top-0 w-full h-full flex">
          <div
            class="text-white w-48 ml-24 pl-2 mx-auto tracking-widest mt-4 inline-block h-5 text-xs"
          >
            任务日志
          </div>
          <div class="flex w-full h-auto">
            <!-- 左 -->
            <div
              class="absolute left-0 top-0 w-72 pr-2 pt-4 text-left h-auto max-h-80 ml-9 text-yellow-wow mt-20 mx-auto"
            >
              <div v-for="(item, i) in taskListData" :key="i" class="flex">
                <div
                  class="h-5 w-full text-sm text-left flex rounded-md p-1 leading-3 cursor-pointer pointer-events-auto"
                  @click="clickEvent('切换任务', item,i)"
                >
                  <div class="self-center">
                    {{ item.taskTitle }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 右 -->
            <div v-if="taskData"
              class="absolute left-80 top-0 w-72 pr-2 pt-4 text-left h-auto max-h-80 ml-9 text-gray-800 mt-20 mx-auto"
            >
              <div class="hidden font-bold text-black mb-1">
                {{ taskData.taskTitle }}
              </div>
              <div class="text-sm mb-2">{{ taskData.describe }}</div>
              <div class="hidden font-bold text-black">任务目标</div>
              <div class=" hidden text-sm mb-2">{{ taskData.target }}</div>
              
              <div>
                <div v-for="(target, ii) in taskData.targetList" :key="ii" class="flex">
                  <div
                    v-if="target.type == 'kill'"
                    class="h-5 w-full text-xs text-left flex rounded-md p-1 leading-3 cursor-pointer pointer-events-auto"
                  >
                    <div v-show="!target.completed" class="self-center">
                      -{{ target.num }}/{{ target.need }} 消灭{{ target.name }}
                    </div>
                    <div v-show="target.completed">已完成</div>
                  </div>
                </div>
              </div>
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

    <div
      v-show="showRight"
      class="absolute right-20 top-20 md:top-40 flex text-yellow-wow pointer-events-auto"
    >
      <div v-for="(item, i) in taskListData" :key="i" class="flex"
      @click="clickEvent('点击右侧任务名',i)"
      >
        <div
          class="h-5 w-full text-sm text-left rounded-md cursor-pointer pointer-events-auto"
        >
          <div class="-ml-3 flex">
            <div
              class="w-4 h-4 rounded-full bg-black text-center self-center leading-4"
            >
              {{ i + 1 }}
            </div>
            <div class="ml-1 self-center text-base">
              {{ item.taskTitle }}
            </div>
          </div>
          <div>
            <div v-for="(target, ii) in item.targetList" :key="ii" class="flex text-white">
              <div
                v-if="target.type == 'kill'"
                class="h-5 w-full text-xs text-left flex rounded-md p-1 leading-3 cursor-pointer pointer-events-auto"
              >
                <div v-show="!target.completed" class="self-center">
                  -{{ target.num }}/{{ target.need }} 消灭{{ target.name }}
                </div>
                <div v-show="target.completed">已完成</div>
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
  props: ["showPanel"],
  components: {},
  data() {
    return {
      showRight: true,
      taskListData: [],
      selectIndex:0,
      selectIsCompleted:false,//当前选择的任务是否已完成
      taskData: null,
      goldUrl: "./public/images/cursorList/containerframe/ui-goldicon.png",

      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      redBtnUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-up.png",
      leftIcon: "./public/images/cursorList/mainmenu/ui-questlog-bookicon.png",
      hoverPart: "",
    };
  },
  created() {},
  mounted() {
    // return;
    setTimeout(() => {
      // 监听杀死敌人
      _Global.addEventListener("3d加载完成", () => {
        for (let i = 0; i < this.taskListData.length; i++) {
          const element = this.taskListData[i];
          this.resetTaskData(element);
        }
        _Global.addEventListener("杀死npc", (npcname) => {
          // console.log(" 杀死npc ", npcname);
          for (let i = 0; i < this.taskListData.length; i++) {
            const element = this.taskListData[i];
            let allCompleted = true;
            for (let j = 0; j < element.targetList.length; j++) {
              const target = element.targetList[j];
              if (!target.completed ) {
                allCompleted = false; 
                if ( target.type == "kill" && target.name == npcname) {
                  target.num++;
                  // console.log(" 任务进度 ",target.type + target.num + "/" + target.need);
                  if (target.num >= target.need) {
                    target.completed = true;
                    allCompleted = true; 
                    continue;
                  }
                }
              }
            }
            
            //完成是否任务
            element.allCompleted = allCompleted;
            if(this.selectIndex == i){
              this.selectIsCompleted = allCompleted;
            }
            if(element.allCompleted){
              // 从正在进行中移除
              for (let i = _Global.user.currentTaskList.length-1; i >=0 ; i--) {
                const cutaskId = _Global.user.currentTaskList[i].taskId;
                if(cutaskId == element.id){
                // 并添加到可完成中
                let task = _Global.user.currentTaskList[i];
                _Global.user.canCompletedTaskList.push(task);
                _Global._YJNPCManager.GetNpcComponentById(task.fromId).SetNPCHeaderUp("task_2");
                _Global.user.currentTaskList.splice(i,1);
                }
              }
            }
          }
        });
      });
    }, 1000);
  },

  methods: {
    addTask(taskData){
      // console.log("添加任务 ",taskData);
      this.taskListData.push(taskData);
      if(this.taskListData.length==1){
        this.taskData = taskData;
      }
    },
    resetTaskData(taskData) {
      if (taskData.loaded) {
        return;
      }
      taskData.loaded = true;
      taskData.describe = taskData.describe.replace(
        "${name}",
        _Global.playerName ? _Global.playerName : "哈哈"
      );
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
            element.skill = data;
            element.skill.count = element.count;
          }
        }
      }
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
    clickEvent(e, item,i) {
      console.log(e, item,i);
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "taskList", false);

      }
      if (e == "切换任务") {
        this.selectIndex = i;
        this.selectIsCompleted = this.taskListData[this.selectIndex].allCompleted;
        this.taskData = item; 
      }
      
      if (e == "完成任务") {
        // 点击完成任务，获取奖励
        let item = this.taskListData[this.selectIndex];

          // 从可完成中移除
          for (let i = _Global.user.canCompletedTaskList.length-1; i >=0 ; i--) {
            const element = _Global.user.canCompletedTaskList[i].taskId;
            if(element == item.id){
              let task = _Global.user.canCompletedTaskList[i];
              _Global.user.completedTaskList.push(task);
              _Global.user.canCompletedTaskList.splice(i,1);
              _Global._YJNPCManager.GetNpcComponentById(task.fromId).CheckNextTask();
            }
          }


        // 装备道具、金币奖励放到背包,经验值加
        _Global.applyEvent("加金币",item.rewardGold);
        _Global.applyEvent("加经验",item.rewardExp);
        _Global.applyEvent("加道具",item.rewardItems);
        this.taskListData.splice(this.selectIndex,1);
        if(this.taskListData.length==0){
          this.taskData = null;
          this.selectIsCompleted = false;
        }else{
          this.selectIndex--;
          this.taskData = this.taskListData[this.selectIndex];
          this.selectIsCompleted = this.taskListData[this.selectIndex].allCompleted;
        }
        _Global._YJAudioManager.playAudio('1722064261056/iquestcomplete.ogg');

      }
      
      if (e == "点击右侧任务名") { 
        // _Global.applyEvent("界面开关", 'taskList',true);
        this.$parent.$refs.ActionPanelVue.clickMenu( 'taskList');
        this.selectIndex = item;
        this.selectIsCompleted = this.taskListData[this.selectIndex].allCompleted;
      }
      
      console.log(e);
    },
    clickSkill(ev, item) {},
  },
};
</script>
<style scoped>
.cursor-pointer {
    /* cursor: pointer; */
    cursor: none;
}
</style>