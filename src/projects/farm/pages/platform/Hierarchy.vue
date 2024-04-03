 
<template>
  <!-- 场景模型列表 -->

  <!-- 单品名:{{ folderBase }} 总模型数量： {{modelList.length}} -->
  <div
    class="w-full h-full pb-10 overflow-y-auto overscroll-auto bg-gray-600 text-gray-100"
  >
    <div class="font-bold">{{ title }}</div>
    <div class="relative">
      <div 
        v-for="(item, i) in modelList"
        :key="i"
        class="w-full pl-4 text-left text-xs px-1"
        :class="item.active ? '' : ' hidden '"
      >
        <div
          class="flex justify-between h-6"
          :class="
            inDrag
              ? dragOnTop
                ? ' hoverBorderTop '
                : dragOnDown
                ? ' hoverBorderDown '
                : dragOnCenter
                ? 'hoverBorder'
                : ''
              : ''
          "
        >
          <div class="w-4 h-4 self-center flex"
          :style=" 'margin-left:'+ item.paddingLeft+'px;'"
          >
            <div
              v-if="item.children.length"
              class="w-full h-full bg-black leading-4 mx-auto text-center text-xl"
              @click="onoffFolder(item)"

            >
              {{ item.folder ? "-" : "+" }}
            </div>
          </div>
          <div
            class="w-11/12 flex justify-between hover:bg-gray-500 relative"
            @click="SelectModel(item)"
            :class="
              (selectUUID == item.uuid ? ' bg-black ' : '',
              inDrag ? ' cursor-default' : 'cursor-pointer')
            "
            @mousedown="clickBegin(item.uuid)"
          >
            <div
              v-if="inDrag"
              @mouseenter.stop="SetDragTop(item.uuid)"
              @mouseleave="SetDragTopOut()"
              class="absolute left-0 top-0 w-full h-1.5"
            ></div>
            <div
              v-if="inDrag"
              @mouseenter.stop="SetDragDown(item.uuid)"
              @mouseleave="SetDragDownOut()"
              class="absolute left-0 bottom-0 w-full h-1.5"
            ></div>
            <div
              v-if="inDrag"
              @mouseenter.stop="SetDragCenter(item.uuid)"
              class="absolute left-0 top-1 w-full h-3"
            ></div>

            <div class="w-2/3 self-center truncate"
            :style=" 'padding-left:'+ item.paddingLeft+'px;'"
            >
              {{ item.name + '-' +  item.modelId  }}
              {{ item.modelType == "NPC模型" ? item.npcName : "" }}
            </div>
            <div class="self-center text-left truncate w-12">
              {{ item.modelType }}
            </div>
          </div>
          <!-- <div class=" ml-2 mt-1 w-8 "> 
          <div>锁定</div>
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HierarchyPanel",
  props: ["title"],
  components: {},
  data() {
    return {
      inDrag: false,
      dragOnTop: false,
      dragOnDown: false,
      dragOnCenter: false,
      dragFromUUID: "",
      dragToUUID: "",
      selectUUID: "",
      clickTimes: 0,
      modelList: [],
    };
  },
  created() {},
  mounted() {
    window.addEventListener("mouseup", () => {
      if (this.inDrag) {
        this.chengeSiblingIndex();
      }
      this.inDrag = false;
      cancelAnimationFrame(this.updateId);
    });
  },
  methods: {
    chengeSiblingIndex() {
      //判断是否要移动到的地方是否有效
      // 无效的情况有：移动后的父物体与移动前的父物体一致、移动后的父物体是以前的子物体、自身
      if (this.dragFromUUID == this.dragToUUID) {
        return;
      } //自身

      let fromIndex = 0;
      let toIndex = 0;
      for (let i = 0; i < this.modelList.length; i++) {
        const model = this.modelList[i];
        if (model.uuid == this.dragFromUUID) {
          fromIndex = i;
        }
        if (model.uuid == this.dragToUUID) {
          toIndex = i;
        }
      }
      
      let childId = this.modelList[fromIndex].id;
      //如果是其他物体的子物体，则从其他物体那移除
      _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().RemoveChildFromAny(childId);

      if (this.dragOnCenter) {
        let parentId = this.modelList[toIndex].id;
        this.modelList[fromIndex].parent = parentId;
        _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().SetParent(this.dragFromUUID,parentId);
        let has = false;
        for (
          let i = 0;
          i < this.modelList[toIndex].children.length && !has;
          i++
        ) {
          const element = this.modelList[toIndex].children[i];
          if (element == this.modelList[fromIndex].id) {
            has = true;
          }
        }
        if (!has) {

          let children = this.modelList[toIndex].children;
          children.push(childId);
          _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().SetChildren(this.dragToUUID,children);

        }
      }

      if (this.dragOnTop) {
        //判断是否
        let parentId = this.modelList[toIndex].parent;
        _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().SetParent(this.dragFromUUID,parentId);

      }
      if (this.dragOnDown) {
        let parentId = this.modelList[toIndex].parent;
        _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().SetParent(this.dragFromUUID,parentId);
      }
      _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().UpdateModelList();
      console.log(this.modelList);
    },
    init() {
      _Global.addEventListener("modelList", (modelList) => {
        this.resetPanel(modelList);
      });
    },
    onoffFolder(item) {
      item.folder = !item.folder;
      let children = [];

      let siblingIndex = 0;
      for (let i = 0; i < this.modelList.length; i++) {
        const model = this.modelList[i];
        if (model.parent == item.id) {
          if (item.folder) { 
            model.active = true;
          } else {
            model.active = false;
          }
        }
      }
    },
    addChildren(modelList,children, pad) {
      for (let i = 0; i < children.length; i++) {
        const childId = children[i];
        for (let j = 0; j < modelList.length; j++) {
          const model = modelList[j];
          if (model.id == childId) {
            let e = model;
            this.modelList.push({
              id: e.id,
              uuid: e.uuid,
              modelType: e.modelType,
              name: e.name,
              npcName: e.npcName,
              parent: e.parent,
              children: e.children,
              active:false,
              paddingLeft:12*pad,
            });
            if (model.children > 0) {
              this.addChildren(modelList,model.children,pad+1);
            }
          }
        }
      }
    },
    resetPanel(modelList) {

      console.log(" modelList data  = " , modelList);

      this.modelList = [];

      for (let i = 0; i < modelList.length; i++) {
        const e = modelList[i];

        if (e.parent == "") {

          this.modelList.push({
              id: e.id,
            uuid: e.uuid,
            modelType: e.modelType,
            modelId: e.modelId??"",
            name: e.name,
            npcName: e.npcName,
            parent: e.parent,
            children: e.children,
            active:true,
            paddingLeft:0,
          });

          if (e.children.length > 0) {
            this.addChildren(modelList,e.children,1);
          }
        }
      }

      // for (let i = 0; i < this.modelList.length; i++) {
      //   const model = this.modelList[i];
      //   model.active = true;
      //   if (model.parent == "") {
      //     model.folder = false;
      //   } else {
      //   }
      // }
      console.log(" this.modelList ui tree  = " , this.modelList);
    },
    clickBegin(uuid) {
      this.dragFromUUID = uuid;
      this.inDrag = false;
      this.clickTimes = 0;
      this.animate();
    },

    SetDragTop(uuid) {
      this.dragToUUID = uuid;
      this.dragOnTop = true;
      this.dragOnDown = false;
      this.dragOnCenter = false;
    },
    SetDragDown(uuid) {
      this.dragToUUID = uuid;
      this.dragOnTop = false;
      this.dragOnDown = true;
      this.dragOnCenter = false;
    },
    SetDragCenter(uuid) {
      this.dragToUUID = uuid;
      this.dragOnDown = false;
      this.dragOnTop = false;
      this.dragOnCenter = true;
    },
    SetDragDownOut(v) {
      this.dragOnDown = false;
    },
    SetDragTopOut(v) {
      this.dragOnTop = false;
    },

    // 在3d中点击模型，反向设置检视面板选中状态
    SelectModelBy3d(uuid) {
      for (let i = 0; i < this.modelList.length; i++) {
        const element = this.modelList[i];
        if (element.uuid == uuid) {
          this.selectUUID = uuid;
        }
      }
    },
    // 点击检视面板选中模型
    SelectModel(item) {
      console.log(" 点击检视面板选中模型 ", item);
      this.selectUUID = item.uuid;
      this.$parent.SetSelectTransformByUUID(item.uuid);
    },
    animate() {
      if (!this.inDrag) {
        this.updateId = requestAnimationFrame(this.animate);
        this.clickTimes++;
        // console.log(this.clickTimes);
        if (this.clickTimes > 60) {
          //鼠标切换成拖拽
          this.inDrag = true;
        }
      }
    },
  },
};
</script>
 
<style scoped>
.hoverBorderTop:hover {
  border-top-width: 4px;
  border-color: yellow;
}
.hoverBorderDown:hover {
  border-bottom-width: 4px;
  border-color: yellow;
}
.hoverBorder:hover {
  border-width: 4px;
  border-color: yellow;
}
div {
  user-select: none;
}
</style>