<template>
  <div class="w-full h-full relative pointer-events-none">
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

        <div class="absolute left-0 top-0 w-full h-full z-10">
          <div
            class="absolute left-0 bottom-16 w-full px-5 flex justify-between text-yellow-wow"
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
        <div class="mx-auto flex">
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
            <div class="text-sm mb-2">{{ taskData.target }}</div>
            <div class="font-bold text-black">奖励</div>

            <div
              v-if="taskData.rewardItem && taskData.rewardItem.length > 0"
              class="text-sm"
            >
              你将得到：
            </div>
            <div class="mb-1 grid gap-y-1 grid-cols-2">
              <div
                v-for="(item, i) in taskData.rewardItem"
                :key="i"
                class="flex"
              >
                <div>
                  <img
                    v-if="item.icon"
                    class="w-9 h-9 rounded-md pointer-events-none"
                    :src="
                      item.icon.includes('http') ||
                      item.icon.includes('./public')
                        ? item.icon
                        : this.$uploadUVAnimUrl + item.icon
                    "
                    alt=""
                  />
                </div>

                <div
                  class="h-9 w-24 text-sm border text-left flex rounded-md  p-1  leading-3 overflow-hidden"
                > 
                <div class=" self-center ">
                  {{ item.name }}

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
      taskData: {
        from: "神秘人",
        taskTitle: "净化",
        describe: "危机四伏，小心点，${name}。燃烧军团的爪牙无穷无尽，请增援我们",
        target: "消灭10个食尸鬼和10个憎恶",
        rewardItem: [
          {
            type: "equip",
            id: "1709558796473",
            icon: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-rfinger.png",
            name: "戒指",
          },
          {
            type: "equip",
            id: "1709594878614",
            icon: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-rfinger.png",
            name: "戒指",
          },
          {
            type: "prop",
            id: "1720702607945",
            icon: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-rfinger.png",
            name: "药水",
            count: 5,
          },
        ],
        rewardGold: 10,
        rewardExp: 100,
      },
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
      this.resetTaskData(this.taskData);
    }, 5000);
  },

  methods: {
    resetTaskData(taskData) {
      taskData.describe = taskData.describe.replace(
        "${name}",
        _Global.playerName ? _Global.playerName : "哈哈"
      );
      if (taskData.rewardItem && taskData.rewardItem.length > 0) {
        for (let i = 0; i < taskData.rewardItem.length; i++) {
          const element = taskData.rewardItem[i];
          if (element.type == "equip") {
            let path =
              _Global.YJ3D.$uploadUrl +
              element.id +
              "/" +
              "data.txt" +
              "?time=" +
              new Date().getTime();
            _Global.YJ3D._YJSceneManager.LoadAssset(path, (data) => {
              element.name = data.name;
              element.icon =
                _Global.YJ3D.$uploadUrl + data.folderBase + "/" + data.icon;
            });
          }
          if (element.type == "prop") {
            let data = _Global.GetPropById(element.id);
            console.log("获取道具 ", data);
            element.name = data.name;
            element.icon = _Global.url.uploadUVAnimUrl + data.icon;
          }
        }
      }
    },
    LookSkill(ev, item) {
      // console.log(e);
      this.hoverPart = item.hoverPart;
      _Global.hoverPart = item.hoverPart;
      let parent = ev.target;
      this.$parent.LookSkill(parent, item);
    },
    outHover() {
      this.hoverPart = "";
      this.$parent.outHover();
    },
    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "receiveTask", false);
      }
    },
    clickSkill(ev, item) {},
  },
};
</script>

<style scoped>
.scalex {
  transform: translateX(-32px) scaleX(-1);
}

.skill-img {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  opacity: 0.99;
}

.centerBg {
  width: 256px;
  height: 64px;
  /* background-size: cover;  */
  /* background-repeat: no-repeat;  */
  /* background-position: center;   */
  background-position: 0% 0;
  /* background-position: 0px 64px; */
  /* background-image: url(./public/images/cursorList/ui-mainmenubar-human.png); */
}
.dmtip {
  --tw-bg-opacity: 0.51;
  background-color: rgba(107, 114, 128, var(--tw-bg-opacity));
}
.brightness-50 {
  filter: brightness(0.5);
}
.chatContent {
  /* vue中如何将双击选中文字的默认事件取消 */
  -moz-user-select: text;
  /*火狐*/
  -webkit-user-select: text;
  /*webkit浏览器*/
  -ms-user-select: text;
  /*IE10*/
  -khtml-user-select: text;
  /*早期浏览器*/
  user-select: text;
}
</style>