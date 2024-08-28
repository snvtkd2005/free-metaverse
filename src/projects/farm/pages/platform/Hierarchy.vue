 
<template>
  <!-- 场景模型列表 -->

  <!-- 单品名:{{ folderBase }} 总模型数量： {{modelList.length}} -->
  
  <div class="font-bold bg-gray-600 text-gray-100">{{ title }}</div>
  <div
    class="relative w-full h-full pb-10 overflow-y-auto overscroll-auto bg-gray-600 text-gray-100"
  >
    <div
      class="absolute left-0 top-0 w-full h-full"
      @click="clickEvent('关闭复制粘贴')"
      @contextmenu.prevent="onContextMenu($event)"
    ></div>

    <div class="relative h-full flex flex-col">
      <div
        v-for="(item, i) in modelList"
        :key="i"
        class="w-full pl-4 text-left text-xs px-1"
        :class="item.active ? '' : ' hidden '"
      >
        <div
          @mouseenter.stop="SetDragTop(item.uuid)"
          @mouseleave="SetDragTopOut()"
          class="w-full h-1"
          :class="inDrag ? (dragOnTop ? ' hoverBorderTop ' : '') : ''"
        ></div>

        <div
          class="flex justify-between h-5"
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
          <div
            class="w-4 h-4 self-center flex"
            :style="'margin-left:' + item.paddingLeft + 'px;'"
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
            class="w-11/12 flex justify-between cursor-pointer relative"
            @click="SelectModel(item, i)"
            :class="
              selectUUID == item.uuid
                ? ' bg-black  hover:bg-black '
                : ' hover:bg-gray-500 '
            "
            @mousedown="clickBegin(item.uuid)"
            @contextmenu.prevent="onContextMenu($event, item)"
          >
            <!-- <div
              v-if="inDrag"
              @mouseenter.stop="SetDragDown(item.uuid)"
              @mouseleave="SetDragDownOut()"
              class="absolute left-0 bottom-0 w-full h-2"
            ></div> -->
            <div
              v-if="inDrag"
              @mouseenter.stop="SetDragCenter(item.uuid)"
              class="absolute left-0 top-1 w-full h-4"
            ></div>

            <div
              class="w-2/3 self-center truncate"
              :style="'padding-left:' + item.paddingLeft + 'px;'"
            >
              {{ item.name + "-" + item.modelId }}
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

      <div
        v-if="inDrag || true"
        @mouseenter.stop="SetDragTop()"
        @mouseleave="SetDragTopOut()"
        class="w-full h-full flex-grow-0 "
        :class="inDrag ? (dragOnTop ? ' hoverBorderTop ' : '') : ''"
      ></div>
    </div>

    <!-- 悬浮信息的父物体 -->
    <div
      ref="hoverParentRef"
      class="absolute left-0 top-0 w-full h-full pointer-events-none"
    ></div>

    <div
      ref="hoverContent"
      v-show="inRightClick"
      class="absolute transform origin-bottom-left left-0 top-0 w-auto bg-white text-black border pointer-events-auto"
    >
      <div 
        class="hover:bg-gray-400 px-4 w-32 text-center cursor-pointer"
        @click="clickEvent('创建空物体')"
      >
        创建空物体
      </div>
      <div
        v-show="canCopy"
        class="hover:bg-gray-400 px-4 cursor-pointer"
        @click="clickEvent('复制')"
      >
        复制
      </div>
      <div
        class="hover:bg-gray-400 px-4"
        :class="
          canPaste ? ' cursor-pointer  ' : ' pointer-events-none text-gray-300'
        "
        @click="clickEvent('粘贴')"
      >
        粘贴
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
      inRightClick: false,
      rightClickItem: null,
      canPaste: false,
      canCopy: false,
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

    window.addEventListener("mousemove", (event) => {
      _Global.mouseX = event.clientX;
      _Global.mouseY = event.clientY;
      // console.log( _Global.mouseX,_Global.mouseY);
    });

    setTimeout(() => {
      _Global.addEventListener("改变modelId或名称", (type, data) => {
        this.upadteDataByUUID(data, type);
      });
      _Global.addEventListener("keycodeUp", (keycode) => {
        console.log("keycodeUp", keycode);
        if (_Global.infocus3d) {
          return;
        }
        if (keycode == "ArrowUp") {
          this.selectIndex--;
          this.SelectModelByIndex(this.selectIndex);
        }
        if (keycode == "ArrowDown") {
          this.selectIndex++;
          this.SelectModelByIndex(this.selectIndex);
        }
      });
    }, 2000);

    if (this.newDiv == null) {
      this.newDiv = document.createElement("div");
    }
    this.newDiv.style = `
      position:absolute;
      right:-4px;
      top:-4px; 
      // width:4px; 
      // height:4px;
      background-color:#9ca3af
      `;
  },
  methods: {
    onContextMenu(ev, item) {
      // 阻止默认的上下文菜单显示
      ev.preventDefault();
      // 右键复制
      // 弹窗右键菜单
      if (ev.button == 2) {
        this.canCopy = item && true;
        let top = 0;
        let left = 0;

        this.newDiv.appendChild(this.$refs.hoverContent);
        this.newDiv.style.display = "";
        this.newDiv.style.opacity = 0;

        if (this.canCopy) {
          var rect = ev.target.getBoundingClientRect();

          let offsetX = 100;
          let offsetY = -20;
          this.$nextTick(() => {
            let rect2 = this.$refs.hoverContent.clientWidth;
            if (rect.left > window.innerWidth - rect2) {
              offsetX -= rect2;
              this.inRightOrder = true;
            }
          });

          this.rightClickItem = this.$parent
            .SetSelectTransformByUUID(item.uuid)
            .GetData();

          top = parseInt(rect.top) + offsetY;
          left = parseInt(rect.left) + offsetX;
        } else {
          left = 100;
          top = _Global.mouseY - 20;

          let modelData = JSON.parse(localStorage.getItem("copy"));
          if (modelData) {
            this.canPaste = true;
          }
        }

        this.$nextTick(() => {
          this.$nextTick(() => {
            this.newDiv.style.top = top + "px";
            this.newDiv.style.left = left + "px";
            this.newDiv.style.opacity = 1;
          });
        });
        this.$refs.hoverParentRef.appendChild(this.newDiv);

        this.inRightClick = true;
      }
    },
    clickEvent(e) {
      if (e == "复制") {
        localStorage.setItem("copy", JSON.stringify(this.rightClickItem));
        this.inRightClick = false;
      }
      if (e == "粘贴") {
        let modelData = JSON.parse(localStorage.getItem("copy"));
        this.$parent.Paste(modelData);
        this.inRightClick = false;
      }
      if (e == "关闭复制粘贴") {
        this.inRightClick = false;
      }
      
      if (e == "创建空物体") {
        _Global._SceneModelManager.CreateEmpty();
        this.inRightClick = false;
      }
      
    },

    chengeSiblingIndex() {
      //判断是否要移动到的地方是否有效
      // 无效的情况有：移动后的父物体与移动前的父物体一致、移动后的父物体是以前的子物体、自身
      if (this.dragFromUUID == this.dragToUUID) {
        return;
      } //自身

      if (!this.dragOnTop && !this.dragOnCenter && !this.dragOnDown) {
        return;
      }
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
      // console.log(" 拖拽检视面板 ",fromIndex,toIndex);
      // console.log(" this.dragOnTop ",this.dragOnTop);
      // console.log(" this.dragOnCenter ",this.dragOnCenter);
      // console.log(" this.dragOnDown ",this.dragOnDown);
      let childId = this.modelList[fromIndex].id;
      //如果是其他物体的子物体，则从其他物体那移除
      _Global.YJ3D._YJSceneManager
        .GetLoadUserModelManager()
        .RemoveChildFromAny(childId);

      if (this.dragOnCenter) {
        let parentId = this.modelList[toIndex].id;
        this.modelList[fromIndex].parent = parentId;
        _Global.YJ3D._YJSceneManager
          .GetLoadUserModelManager()
          .SetParent(this.dragFromUUID, parentId);
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
          _Global.YJ3D._YJSceneManager
            .GetLoadUserModelManager()
            .SetChildren(this.dragToUUID, children);
        }
      }

      if (this.dragOnTop) {
        //判断是否
        let parentId = this.modelList[toIndex].parent;
        _Global.YJ3D._YJSceneManager
          .GetLoadUserModelManager()
          .SetParent(this.dragFromUUID, parentId);
      }
      if (this.dragOnDown) {
        let parentId = this.modelList[toIndex].parent;
        _Global.YJ3D._YJSceneManager
          .GetLoadUserModelManager()
          .SetParent(this.dragFromUUID, parentId);
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
    addChildren(modelList, children, pad) {
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
              active: false,
              paddingLeft: 12 * pad,
            });
            if (model.children > 0) {
              this.addChildren(modelList, model.children, pad + 1);
            }
          }
        }
      }
    },
    resetPanel(modelList) {
      console.error(" modelList data  = ", modelList);

      this.modelList = [];

      for (let i = 0; i < modelList.length; i++) {
        const e = modelList[i];

        if (e.parent == "") {
          this.modelList.push({
            id: e.id,
            uuid: e.uuid,
            modelType: e.modelType,
            modelId: e.modelId ?? "",
            name: e.name,
            npcName: e.npcName,
            parent: e.parent,
            children: e.children,
            active: true,
            paddingLeft: 0,
          });

          if (e.children.length > 0) {
            this.addChildren(modelList, e.children, 1);
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
      console.log(" this.modelList ui tree  = ", this.modelList);
    },
    clickBegin(uuid) {
      this.selectUUID = uuid;
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

    upadteDataByUUID(data, type) {
      for (let i = 0; i < this.modelList.length; i++) {
        const element = this.modelList[i];
        if (element.uuid == data.uuid) {
          if (type == "name") {
            element.name = data.name;
          }
          if (type == "modelId") {
            element.modelId = data.modelId;
          }
        }
      }
    },
    // 在3d中点击模型，反向设置检视面板选中状态
    SelectModelBy3d(uuid) {
      for (let i = 0; i < this.modelList.length; i++) {
        const element = this.modelList[i];
        if (element.uuid == uuid) {
          this.selectUUID = uuid;
          this.selectIndex = i;
          return;
        }
      }
    },
    SelectModelByIndex(i) {
      if (i >= this.modelList.length) {
        i = 0;
      }
      if (i < 0) {
        i = this.modelList.length - 1;
      }
      let item = this.modelList[i];
      console.log(" 点击检视面板选中模型 ", item);
      this.selectIndex = i;
      this.selectUUID = item.uuid;
      this.$parent.SetSelectTransformByUUID(item.uuid);
    },
    // 点击检视面板选中模型
    SelectModel(item, i) {
      console.log(" 点击检视面板选中模型 ", item);
      this.selectIndex = i;
      this.selectUUID = item.uuid;
      this.$parent.SetSelectTransformByUUID(item.uuid);
      _Global.YJ3D.removeEventListener();
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