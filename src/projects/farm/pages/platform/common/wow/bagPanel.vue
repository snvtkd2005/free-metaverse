<template>
  <div class="w-full h-full absolute left-0 top-0 pointer-events-none">
    <!-- 背包 -->
    <div class="absolute right-40 bottom-40 flex">
      <div class="relative transform scale-125 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full -z-10">
          <div class="absolute right-32 top-1">
            <img class="mr-5 w-10 h-10 rounded-full" :src="playerImg" alt="" />
          </div>
        </div>
        <div class="mx-auto flex">
          <div class="flex flex-col">
            <div class="flex">
              <img class="w-64 h-64" :src="basebagUrl" alt="" />
            </div>
          </div>

          <div
            class="absolute right-0 top-0 pointer-events-auto cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            <img :src="closeUrl" alt="" />
          </div>
        </div>
        <div class="absolute left-0 top-0 h-64 flex">
          <div
            class="text-white w-48 ml-16 pl-2 mx-auto tracking-widest mt-2.5 inline-block h-5 text-xs"
          >
            行囊
          </div>

          <div
            class="absolute left-0 top-0 w-44 h-auto max-h-64 ml-20 grid grid-cols-4 gap-1.5 pt-px pr-3 mt-16 mx-auto"
          >
            <div
              v-for="(item, i) in itemList"
              :key="i"
              class="flex w-9 h-9 relative cursor-pointer pointer-events-auto"
            >
              <iconslotVue :item="item"></iconslotVue>
            </div>
          </div>

          <div class="absolute left-0 bottom-3 ml-20 w-40 h-4">
            <div class="text-white text-xs text-right pr-5">
              {{ goldValue }}
            </div>
            <div class="absolute right-0 top-0">
              <img :src="goldUrl" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




 
<script >
import iconslotVue from "./iconslot.vue";

export default {
  props: [],
  components: {
    iconslotVue,
  },
  data() {
    return {
      itemList: [
        { index: 0, skill: null },
        { index: 1, skill: null },
        { index: 2, skill: null },
        { index: 3, skill: null },
        { index: 4, skill: null },
        { index: 5, skill: null },
        { index: 6, skill: null },
        { index: 7, skill: null },
        { index: 8, skill: null },
        { index: 9, skill: null },
        { index: 10, skill: null },
        { index: 11, skill: null },
        { index: 12, skill: null },
        { index: 13, skill: null },
        { index: 14, skill: null },
        { index: 15, skill: null },
      ],
      basebagUrl:
        "./public/images/cursorList/containerframe/ui-backpackbackground.png",
      goldUrl: "./public/images/cursorList/containerframe/ui-goldicon.png",
      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      downUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-skills-barborderhighlight.png",
      btnHilightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-quickslot-depress.png",
      playerImg:
        "https://snvtkd2005.com/socketIoServer/socketIoServer/uploads/1697436993131/thumb.png",

      btnHoverHilightUrl:
        "./public/images/cursorList/mainmenu/ui-chaticon-blinkhilight.png",
      hoverPart: "",
      dragFromIndex: -1,
      goldValue: 0,
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      _Global.addEventListener("属性改变", (v) => {
        // console.log("属性改变 " ,v);
        this.goldValue = v.gold;
      });

      // _Global.addEventListener("在动作条中调用并摧毁Prop", (id) => {
      //   for (let i = 0; i < this.itemList.length; i++) {
      //     const item = this.itemList[i];
      //     if (item.skill && item.skill.id == id) {
      //       item.skill = null;
      //     }
      //   }
      // });

      _Global.addEventListener("在动作条中调用Prop", (id) => {

        for (let i = 0; i < this.itemList.length; i++) {
          const item = this.itemList[i];
          if (item.skill && item.skill.id == id) {
            item.skill.allCount--;  
          }
        }
        let has = false;
        let change = false;
        for (let i = 0; i < this.itemList.length && !has; i++) {
          const item = this.itemList[i];
          if (item.skill && item.skill.id == id) {
            item.skill.count--;  
            if(item.skill.count<=0){
              item.skill = null;
              _Global.applyEvent("在动作条中停用prop",id);
              change = true;
            }
            has = true;
          }
        }

        if(change){
          for (let i = 0; i < this.itemList.length; i++) {
            const item = this.itemList[i];
            if (item.skill && item.skill.id == id) {
              _Global.applyEvent("替换动作条中prop的引用",id,item.skill);
              return;
            }
          }
        }
      });
      

      for (let i = 0; i < this.itemList.length; i++) {
        const item = this.itemList[i];
        item.hoverPart = "bagbase_" + i;
      }

      // let list = _Global.propList;
      // console.log(" 所有道具物品 ", list);
      // //随机取出3张卡片
      // for (let i = 0; i < list.length; i++) {
      //   const item = list[i];
      //   item.canDrag = true;
      //   item.count = 1;
      //   if (item.countType && item.countType == "group") {
      //     item.count = 20;
      //   }
      //   this.itemList[i].skill = JSON.parse(JSON.stringify(item)) ;
      // }


      let data = _Global.GetPropById("1720684572588");
      let has = false;
      for (let i = 0; i < this.itemList.length && !has; i++) {
          const element = this.itemList[i];
          if (element.skill == null) {
            element.skill = JSON.parse(JSON.stringify(data))  ;
            has = true;
          }
      }
      
      _Global.LoadEquipById("1709603486019", (equip) => {
        for (let i = 0; i < this.itemList.length; i++) {
          const element = this.itemList[i];
          if (element.skill == null) {
            element.skill = equip;
            return;
          }
        }
      });
      // _Global.LoadEquipById("1709594878614", (equip) => {
      //   for (let i = 0; i < this.itemList.length; i++) {
      //     const element = this.itemList[i];
      //     if (element.skill == null) {
      //       element.skill = equip;
      //       return;
      //     }
      //   }
      // });
      
      // let data = _Global.GetPropById("1720706871111");
      // let has = false;
      // for (let i = 0; i < this.itemList.length && !has; i++) {
      //     const element = this.itemList[i];
      //     if (element.skill == null) {
      //       element.skill = JSON.parse(JSON.stringify(data))  ;
      //       element.skill.count = 10;
      //       has = true;
      //     }
      // }

      this.updateAcionbar();




      _Global.addEventListener("加金币", (v) => {
        _Global._YJPlayerFireCtrl.GetProperty().updateBasedata({ value: v, property: "gold" });
        _Global.applyEvent("获取道具记录","金币",v);
      });

      _Global.addEventListener("加道具", (rewardItems) => {
        for (let i = 0; i < rewardItems.length; i++) {
          const skill = rewardItems[i].skill;
          let has = false;
          for (let j = 0; j < this.itemList.length && !has; j++) {
            const element = this.itemList[j];
            if (element.skill == null) {
              element.skill = skill;
              has = true; 
            }
          }
          this.updateAcionbar();
          _Global.applyEvent("获取道具记录","道具",skill.name);

        }
      });
    }, 5000);
  },

  methods: {
    updateAcionbar(){

      let idcount = [];
      for (let i = 0; i < this.itemList.length; i++) {
          const element = this.itemList[i];
          if (element.skill != null) {
            let has = false;
            for (let j = 0; j < idcount.length && !has; j++) {
              const idc = idcount[j];
              if(idc.id == element.skill.id){
                idc.skill.allCount += element.skill.count;
                has = true;
              }
            }
            if(has){
              
            }else{
              element.skill.allCount = element.skill.count;
              idcount.push({id:element.skill.id,skill:element.skill});
            }
          }
      }

      for (let j = 0; j < idcount.length; j++) {
        const idc = idcount[j];
        for (let i = 0; i < this.itemList.length; i++) {
            const element = this.itemList[i];
            if (element.skill != null && element.skill.id == idc.id) {
              element.skill.allCount = idc.skill.allCount;
            }
        } 
      }

      for (let i = 0; i < idcount.length; i++) {
        const element = idcount[i];
        _Global.applyEvent("在动作条中激活prop",element.id,element.skill)
      }
    },

    cancelDrag(e) {
      if (e == "右键点击") {
        this.checkDragFromIndex();
        this.itemList[this.dragFromIndex].inDraging = false;
      }
      if (e == "从动作条拖拽到动作条") {
      }
      if (e == "从背包拖拽到动作条") {
        this.checkDragFromIndex();
        this.itemList[this.dragFromIndex].inDraging = false;
      }

      if (e == "取消拖拽Prop") {
        this.checkDragFromIndex();
        this.itemList[this.dragFromIndex].inDraging = false;
      }

      if (e == "摧毁拖拽Prop") {
        this.checkDragFromIndex();
        let id = this.itemList[this.dragFromIndex].skill.id;
        _Global.applyEvent(
          "在背包中摧毁prop", id,this.itemList[this.dragFromIndex].skill.count
        );
        this.itemList[this.dragFromIndex].skill = null;
        this.itemList[this.dragFromIndex].inDraging = false;

        // for (let i = 0; i < this.itemList.length; i++) {
        //   const item = this.itemList[i];
        //   if (item.skill && item.skill.id == id) {
        //     item.skill.allCount--;  
        //   }
        // }

      }
    },

    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "bagBase", false);
      }
    },
    checkDragFromIndex() {
      if (_Global.dragPart) {
        this.dragFromIndex = parseInt(
          _Global.dragPart.replace("bagbase_", "")
        );
      } else {
        console.error(" 未拖拽 ");
      }
    },
    setItem(skill) {
      if (!_Global.dragPart.includes("bag")) {
        return;
      }
      if (_Global.dragPart) {
        this.dragFromIndex = parseInt(
          _Global.dragPart.replace("bagbase_", "")
        );

        this.itemList[this.dragFromIndex].skill = skill;
        this.itemList[this.dragFromIndex].inDraging = false;
        _Global.dragPart = "";
      }
    },
    removeItem(index) {
      this.itemList[index].skill = null;
      this.itemList[index].inDraging = false;
    },
  },
};
</script>   