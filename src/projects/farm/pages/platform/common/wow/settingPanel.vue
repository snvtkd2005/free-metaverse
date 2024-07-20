<template>
  <div class="w-full h-full flex relative pointer-events-auto">
    <div class="w-2/3 px-20 h-3/4 -mt-28 relative mx-auto self-center">
      <div class="w-full relative bg-gray-600 mx-auto">
        <div class="w-full h-8 flex">
          <div class="w-full border-2 leading-8 text-yellow-400">设置选项</div>
          <div
            class="w-8 h-8 border-2 cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            <img class="transform scale-125" :src="closeUrl" alt="" />
          </div>
        </div>

        <div class="opacity-0 w-full">搜索</div>
      </div>
      <div class="hidden mx-auto flex">
        <div class="flex flex-col">
          <div class="flex">
            <div
              class="w-64 h-64"
              style="
                background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-general-topleft.png);
              "
            ></div>
            <div
              class="w-32 h-64"
              style="
                background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-general-topright.png);
              "
            ></div>
          </div>
          <div class="flex">
            <div
              class="w-64 h-64"
              style="
                background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-general-bottomleft.png);
              "
            ></div>

            <div
              class="w-32 h-64"
              style="
                background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-general-bottomright.png);
              "
            ></div>
          </div>
        </div>
      </div>
      <div class="px-4 pb-10 w-full h-full flex border-2 bg-gray-600">
        <!-- 左 -->
        <div class="w-64 pt-4 text-left border bg-gray-800">
          <div
            v-for="(item, i) in lefMenuList"
            :key="i"
            class="flex w-full mb-8 relative"
          >
            <div class="w-full h-auto relative">
              <div class="text-white w-full pl-6 bg-gray-900">
                {{ item.title }}
              </div>
              <div
                v-for="(item2, i) in item.children"
                :key="i"
                class="flex pl-10 relative text-left cursor-pointer hover:bg-gray-700"
                @click="clickTitle(item2)"
                :class="
                  childTitle == item2.title
                    ? ' bg-gray-500 text-white '
                    : ' text-yellow-400 '
                "
              >
                <div class="w-40 h-7 relative">
                  <div class="absolute w-full leading-7">{{ item2.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右 -->
        <div class="w-full h-full px-6 pt-7 flex flex-col relative bg-gray-600">
          <div class="text-left text-lg text-white">{{ childTitle }}</div>
          <div class="absolute right-10 top-7">
            <div>
              <img :src="redBtnUrl" alt="" />
            </div>
            <div
              class="absolute left-0 top-1 w-32 text-yellow-400 h-4 text-xs"
              @click="reset(childTitle)"
            >
              默认设置
            </div>
          </div>
          <div class="mx-auto w-5/6 h-1 mt-1 bg-gray-400"></div>
          <div class="flex-grow overflow-y-scroll">
            <div
              v-for="(item, i) in currentData.children"
              :key="i"
              class="flex w-full mt-6 relative"
            >
              <div class="w-full h-auto relative">
                <div
                  class="text-yellow-400 text-left w-full pl-6 mb-4 bg-gray-900"
                >
                  {{ item.title }}
                </div>
                <div
                  v-for="(item2, i) in currentData[item.field]"
                  :key="i"
                  class="flex pl-10 relative text-yellow-400"
                >
                  <div class="flex justify-between">
                    <div class="w-64 h-7 relative text-left">
                      <div class="w-full leading-7">{{ item2.title }}</div>
                    </div>

                    <div
                      class="w-auto cursor-pointer"
                      @click="clickTitle2(item2)"
                      :class="
                        childTitle2 == item2.title
                          ? ' text-white '
                          : ' text-yellow-400 '
                      "
                    >
                      <div
                        class="w-40 bg-black rounded-md bg-opacity-80 hover:bg-gray-800"

                        v-if="item2.type == 'key'"
                      >
                        {{ item2.keytext }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="relative w-full text-yellow-400">
        <div class="absolute h-8 right-4 bottom-0">
          <img class="w-full h-full" :src="redBtnUrl" alt="" />
          <div
            class="absolute left-0 top-1 w-32 h-8 text-xs cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            关闭
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



 
<script >
import npcStoryData from "../../../../data/npcStoryData";
export default {
  props: [],
  components: {},
  data() {
    return {
      lefMenuList: [
        {
          title: "游戏功能",
          children: [
            // { field: "control", title: "控制" },
            // { field: "panel", title: "界面" },
            // { field: "actionBar", title: "动作条" },
            // { field: "comba", title: "战斗" },
            // { field: "", title: "社交" },
            { field: "keyData", title: "快捷键" },
          ],
        },
        // {
        //   title: "易用性",
        //   children: [
        //     { field: "control", title: "综合" },
        //     { field: "panel", title: "色盲模式" },
        //     { field: "actionBar", title: "文本转语音" },
        //   ],
        // },
        // {
        //   title: "系统",
        //   children: [
        //     { field: "control", title: "图形" },
        //     { field: "panel", title: "音频" },
        //     { field: "actionBar", title: "语言" },
        //     { field: "actionBar", title: "网络" },
        //   ],
        // },
      ],
      currentData: {},
      childTitle: "快捷键",
      childTitle2:"",
      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      redBtnUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-up.png",

      btnHilightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-quickslot-depress.png",
      btnHoverHilightUrl:
        "./public/images/cursorList/mainmenu/ui-chaticon-blinkhilight.png",
      playerImg: "./public/images/cursorList/mainmenu/inv_misc_book_09.png",
      hoverPart: "",
    };
  },
  created() {},
  mounted() {
    console.log(" in setting panel ");
    setTimeout(() => {
      this.clickTitle(this.lefMenuList[0].children[0]);
    }, 20);
  },

  methods: {
    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "setting", false);

        if (this.keyEvent) {
          _Global.removeEventListener(this.keyEvent);
          this.keyEvent = null;
        }
      }
    },
    clickTitle(item) {
      this.childTitle = item.title;
      let field = item.field;
      if (_Global.GameSetting[field]) {
        this.currentData = _Global.GameSetting[field];
        if (field == "keyData") {
          for (let i = 0; i < this.currentData.children.length; i++) {
            let secField = this.currentData.children[i].field;
            for (let j = 0; j < this.currentData[secField].length; j++) {
              this.currentData[secField][j].type = "key";
              let key = this.currentData[secField][j].key;
              this.currentData[secField][j].keytext = key
                .replace("Key", "")
                .replace("Digit", "")
                .replace("Minus", "-")
                .replace("Equal", "=")
                .replace("Space", "空格键");
            }
          }
          this.keyEvent = (keycode) => {
            // 按键在配置中设置
            if(this.selectKey){
              // console.log(" in setting panel ", keycode);
              this.selectKey.key = keycode;
              this.selectKey.keytext = keycode
                .replace("Key", "")
                .replace("Digit", "")
                .replace("Minus", "-")
                .replace("Equal", "=")
                .replace("Space", "空格键");
              this.selectKey = null;
              this.childTitle2 = "";

              _Global.SaveGameSetting();
              _Global.applyEvent("快捷键改变");
              
            }
          };

          _Global.addEventListener("keycodeUp", this.keyEvent);
        } else {
          if (this.keyEvent) {
            _Global.removeEventListener(this.keyEvent);
            this.keyEvent = null;
          }
        }
      }
    },
    clickTitle2(item) {
      if(item.type == "key"){
        this.childTitle2 = item.title;
        this.selectKey = item;
      }
    },
    reset() {},
  },
};
</script>

<style scoped>
</style>