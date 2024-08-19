<template>
  <div class="w-full h-full relative pointer-events-none">
    <!-- 动作条 -->
    <div class="absolute left-0 top-0 xl:top-20 flex">
      <div class="relative transform scale-75 xl:scale-100 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full -z-10">
          <div class="absolute left-1 top-1">
            <img class="w-16 h-16 rounded-full" :src="leftIcon" alt="" />
          </div>
          <div
            class="absolute right-7 top-2 pointer-events-auto cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            <img :src="closeUrl" alt="" />
          </div>
        </div>
        <div class="mx-auto flex">
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
        <div class="absolute left-0 top-0 h-96 flex">
          <div
            class="text-yellow-400 w-48 ml-24 pl-2 mx-auto tracking-widest mt-4 inline-block h-5 text-xs"
          >
            {{ from }}
          </div>

          <div
            class="absolute left-0 top-0 w-72 h-auto max-h-80 ml-9 grid grid-cols-2 gap-5 mt-20 justify-between mx-auto pt-2"
          >
            <div
              v-for="(item, i) in goodsList"
              :key="i"
              class="flex relative pointer-events-none"
            >
              <div class="w-36 h-9 relative">
                <div class="flex">
                  <img
                    class="w-9 h-9 cursor-auto pointer-events-auto"
                    :class="[]"
                    :src="this.$uploadUVAnimUrl + item.skill.icon"
                    alt=""
                    @contextmenu.prevent="onContextMenu($event, item)"
                    @touchend="touchItem(item);outHover()"
                    @mouseover="LookSkill($event, item)"
                    @mouseleave="outHover()"
                  />
                  <img
                    v-if="hoverPart == item.hoverPart"
                    class="absolute left-0 top-0 w-9 h-9 opacity-30 transform scale-110 pointer-events-none"
                    :src="btnHoverHilightUrl"
                    alt=""
                  />
                  <div class="px-1 flex flex-col relative">
                    <div class="text-yellow-wow text-sm">{{ item.name }}</div>
                    <div class="flex">
                      <div class="text-white h-4 text-sm text-left">
                        {{ item.skill.gold }}
                      </div>
                      <img class="ml-1 w-4 h-4" :src="goldUrl" alt="" />
                    </div>
                  </div>

                  <div
                    v-if="item.isDeleled"
                    class="absolute left-0 top-0 w-full h-full bg-red-800 bg-opacity-50"
                  ></div>
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
      goodsList: [
        // {
        //   icon: "https://snvtkd2005.com/socketIoServer/socketIoServer/uploads/1697436993131/thumb.png",
        //   level: 0,
        // },
      ],
      topleftUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-general-topleft.png",
      toprightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-general-topright.png",
      bottomleftUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-general-bottomleft.png",
      bottomrightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-general-bottomright.png",
      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      downUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-skills-barborderhighlight.png",
      btnHilightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-quickslot-depress.png",
      btnHoverHilightUrl:
        "./public/images/cursorList/mainmenu/ui-chaticon-blinkhilight.png",
      leftIcon: "./public/images/cursorList/mainmenu/inv_misc_book_09.png",
      goldUrl: "./public/images/cursorList/containerframe/ui-goldicon.png",

      hoverPart: "",
      from: "",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      _Global.addEventListener("openShop", (data) => {
        this.leftIcon = data.icon;
        if (this.from == data.from) {
          this.checkGold();
          return;
        }
        this.from = data.from;
        this.resetGoodsData(data.goodsList);
        console.log(" in shop panel this.data ", data);
      });
    }, 5000);
  },

  methods: {
    resetGoodsData(goodsList) {
      for (let i = 0; i < goodsList.length; i++) {
        const element = goodsList[i];

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
        }

        let data = _Global.GetPropById(element.id);
        data.count = 1;
        if (data.countType == "group") {
          data.groupCount = 20;
        }
        if (data.gold == undefined) {
          data.gold = 1;
        }
        // data. = 1;
        // console.log(" in task panel 加载 道具  ", data);
        element.hoverPart = "shop_" + i;
        element.skill = data;
      }

      this.goodsList = goodsList;
      this.checkGold();
      _Global.applyEvent("界面开关", "talk", false);
      _Global.applyEvent("界面开关", "task", false);
    },
    checkGold() {
      let gold = _Global._YJPlayerFireCtrl
        .GetProperty()
        .GetPropertyValue("gold");
      for (let i = 0; i < this.goodsList.length; i++) {
        const element = this.goodsList[i];
        element.isDeleled = gold < element.skill.gold;
      }
      
      this.$nextTick(() => {
        _Global.applyEvent("界面开关", "shop", true);
      });

      _Global.talkPos = _Global._YJPlayerFireCtrl.GetWorldPos().clone();
    },

    LookSkill(ev, item) {
      // console.log(e);
      this.hoverPart = item.hoverPart;
      _Global.hoverPart = item.hoverPart;
      let parent = ev.target;
      this.$parent.LookSkill(parent, item.skill);
    },
    outHover() {
      this.hoverPart = "";
      this.$parent.outHover();
    },
    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "shop", false);
      }
    },

    clickItemFn(item){
      // 判断是否可以购买
      let gold = _Global._YJPlayerFireCtrl.GetProperty().GetPropertyValue("gold");
      if (gold < item.skill.gold) {
        return;
      }
      // 购买商品
      _Global.applyEvent("加金币", -item.skill.gold);
      _Global.applyEvent("加道具", [item]);
      this.checkGold();
    },
    onContextMenu(ev, item) {
      // 阻止默认的上下文菜单显示
      ev.preventDefault();
      if (ev.button == 2) {
        this.clickItemFn(item); 
      }
    }, 
    touchItem(item){
      this.clickItemFn(item);
    }
  },
};
</script>

<style scoped>
.cursor-pointer {
  /* cursor: pointer; */
  cursor: none;
}
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