 

// 小地图
<template >
  <div v-if="display" class="absolute w-full h-full hidden md:flex">
    <div class="
        h-auto
        w-auto
        mx-auto
        p-2
        bg-gray-400
        rounded-md
        shadow-md
        text-red-900 text-xl
        self-center
        relative
      ">
      <!-- title -->
      <div class="mx-auto">小地图</div>
      <div class="flex w-full h-auto">
        <div class="w-full h-full bg-gray-300">
          <!-- 搜索 -->
          <div class="flex w-full h-10 gap-5 text-sm leading-10">
            <!-- 坐标搜索 -->
            <div class="flex w-auto h-full gap-1 self-center">
              <div class="w-12">坐标</div>
              <div class="flex">
                <div>X:</div>
                <input v-model="inputX" class="w-16 px-1" type="number" />
              </div>
              <div class="flex">
                <div>Y:</div>
                <input v-model="inputY" class="w-16 px-1" type="number" />
              </div>
              <div class="bg-gray-100 cursor-pointer rounded-md shadow-md px-2" @click="ToChangeOffset()">
                转到坐标
              </div>
            </div>
            <!-- 热度排行榜 -->
            <div>
              <div>地块热度排行榜</div>
            </div>
            <!-- 回到原点 -->
            <div class="w-20 h-full rounded-md shadow-md bg-gray-50" @click="ClickSend('回到原点')">
              回到原点
            </div>
            <div v-if="selectMap != null" class="
                mx-auto
                w-20
                h-full
                rounded-md
                shadow-md
                bg-gray-50
                leading-10
              " @click="ClickSend('传送')">
              传送
            </div>
          </div>
          <!-- 地图 -->
          <div class="
              relative
              w-500px
              h-500px
              mt-2
              border-2
              p-px
              bg-white
              overflow-hidden
            ">
            <div class="
                absolute
                top-1/2
                left-1/2
                transform
                -translate-x-10 -translate-y-10
              " ref="dragPanel">
              <!-- 地图 -->
              <div v-for="(item, i) in planeDataList" :key="i" :index="item" class="w-32 h-32 flex map-bg" :class="selectMapId == item.mapId
                ? ' border-2 border-yellow-600 '
                : ''
                " :style="item.style" @click="ClickMap(item)">
                <div class="w-full h-full border-px border-gray-400">
                  <img class="w-full h-full rounded-none pointer-events-none" :src="item.img" alt=""
                    @error="imgLoadError" />
                </div>

                <div class="
                    absolute
                    left-1/2
                    top-1/2
                    w-10
                    h-6
                    transform
                    -translate-x-5 -translate-y-3
                    self-center
                    mx-auto
                    text-sm
                  ">
                  {{ item.pos.x }},{{ item.pos.z }}
                </div>
              </div>
              <!-- 玩家位置 -->
              <div class="
                  absolute
                  left-0
                  top-0
                  transform
                  translate-x-16 translate-y-16
                ">
                <div ref="player" class="
                    w-6
                    h-6
                    transform
                    -translate-x-3 -translate-y-3
                    rounded-full
                    shadow-lg
                    bg-red-500
                   pointer-events-none
                  " :style="playerStyle"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧地块介绍 -->
        <div class=" hidden w-1/3 h-full bg-gray-100 relative">
          <!-- 地块介绍 -->
          <div v-if="selectMap != null">
            <div class="text-left p-2">
              <!-- 地块拥有者 -->
              <div>地块拥有者：{{ selectMap.userId }}</div>

              <!-- <div>地块id：{{ selectMap.mapId }}</div> -->

              <div>
                坐标： x={{ selectMap.pos.x }} , y={{ selectMap.pos.z }}
              </div>
              <div>
                <div>缩略图:</div>
                <img class="w-full h-40" :src="selectMap.img" alt="" />
              </div>

              <div>
                <div>地块描述:</div>
                <div class="w-full h-40 border-2 p-2">
                  {{ selectMap.content }}
                </div>
              </div>
            </div>
          </div>
          <!-- 传送按钮 -->
          <div v-if="selectMap != null" class="absolute bottom-10 w-full flex">
            <div class=" hidden
                mx-auto
                w-20
                h-10
                rounded-md
                shadow-md
                bg-gray-50
                leading-10
              ">
              购买
            </div>
            <div class="
                mx-auto
                w-20
                h-10
                rounded-md
                shadow-md
                bg-gray-50
                leading-10
              " @click="ClickSend('传送')">
              传送
            </div>
          </div>
        </div>
      </div>

      <div @click="Close()" class="
          flex
          bg-gray-100
          rounded-full
          shadow-md
          w-10
          h-10
          absolute
          -right-2
          -top-2
          cursor-pointer
        ">
        <div class="self-center mx-auto">X</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["btnname", "isRouter"],
  components: {},
  data() {
    return {
      display: false,
      playerStyle: "  position:absolute; left:0px;top:0px; ",
      inputX: 0,
      inputY: 0,
      selectMapId: "",
      planeDataList: [],
      sceneFolderUrl: "https://snvtkd2005.com/socketIoServer/socketIoServer/uploadsScene/",

      planeData: {
        // 地图id
        mapId: "",
        // 用户id
        userId: "",
        // 地图缩略图
        img: "",
      },
      mapOffsetArray: [
        // 9宫格
        //x轴横着的两个
        { x: -1, z: 0 },
        { x: 1, z: 0 },

        //前面的横着的三个
        { x: -1, z: -1 },
        { x: 1, z: -1 },
        { x: 0, z: -1 },

        //后面的横着的三个
        { x: -1, z: 1 },
        { x: 1, z: 1 },
        { x: 0, z: 1 },

        // 25宫格
        //前面的横着的五个
        { x: -2, z: -2 },
        { x: -1, z: -2 },
        { x: 2, z: -2 },
        { x: 1, z: -2 },
        { x: 0, z: -2 },

        //后面的横着的五个
        { x: -2, z: 2 },
        { x: -1, z: 2 },
        { x: 2, z: 2 },
        { x: 1, z: 2 },
        { x: 0, z: 2 },

        // 左边竖着的三个
        { x: -2, z: 1 },
        { x: -2, z: 0 },
        { x: -2, z: -1 },

        // 右边竖着的三个
        { x: 2, z: 1 },
        { x: 2, z: 0 },
        { x: 2, z: -1 },
      ],
      // 已显示出来的地图id
      diplayMapId: [],
      centerX: 10000,
      centerZ: 10000,
      // 判断点击还是拖拽
      isDrag: false,

      selectMap: null,
      // 开放世界每一格的尺寸
      mapSizeX: 0,
      mapSizeY: 0,
      oneSize: 128,

      oldPlayerPosX: 0,
      oldPlayerPosZ: 0,
      inJump: false,
      doonce: 0,

    };
  },
  //初始化函数
  mounted() {
    // return;
    // console.log("打开小地图");
    // this.LoadByCenterMapId(10000, 10000,10000,10000);
  },
  methods: {
    ChangePlayerPos(_x, _y) {
      if (
        Math.abs(this.oldPlayerPosX - _x) < 0.1 &&
        Math.abs(this.oldPlayerPosZ - _y) < 0.1
      ) {
        return;
      }
      // console.log("设置玩家点在地图中的位置", this.oldPlayerPosX, _x);

      this.SetInputXY(_x, _y);
    },
    LoadMap(x, y) {
      // console.log("打开小地图");
      if (this.doonce < 1) {

        this.mapSizeX = _Global.MetaworldSize;
        this.mapSizeY = _Global.MetaworldSize;

        let el = this.$refs.dragPanel;
        let canDrag = false;
        var disx = 0;
        var disy = 0;
        let oldLeft = 0;
        let oldTop = 0;
        var that = this;
        el.addEventListener("mousedown", function (e) {
          canDrag = true;
          disx = e.pageX - el.offsetLeft;
          disy = e.pageY - el.offsetTop;
          oldLeft = el.offsetLeft;
          oldTop = el.offsetTop;
          // console.log("点击panel mousedown");
        });
        el.addEventListener("mousemove", function (e) {
          if (!canDrag) {
            return;
          }
          that.isDrag = true;
          el.style.left = e.pageX - disx + "px";
          el.style.top = e.pageY - disy + "px";

          let left = el.offsetLeft;
          let top = el.offsetTop;
          if (Math.abs(oldLeft - left) >= 120) {
            if (oldLeft - left > 0) {
              // console.log(" 向 左 拖拽 ");
              that.MoveDirection("left");
              oldLeft = left;
            } else {
              // console.log(" 向 右 拖拽 ");
              that.MoveDirection("right");
              oldLeft = left;
            }
          }
          if (Math.abs(oldTop - top) >= 120) {
            if (oldTop - top > 0) {
              // console.log(" 向 上 拖拽 ");
              that.MoveDirection("up");
              oldTop = top;
            } else {
              // console.log(" 向 下 拖拽 ");
              that.MoveDirection("down");
              oldTop = top;
            }
          }
          // console.log("点击panel mousemove");
        });
        el.addEventListener("mouseup", function (e) {
          canDrag = false;
          setTimeout(() => {
            that.isDrag = false;
          }, 200);

          // console.log("点击panel mouseup");
        });
      }

      this.SetInputXY(x, y);

      this.Update();

    },
    imgLoadError(e) {
      e.srcElement.outerHTML = "";
      e.srcElement.style.display = "none";
    },
    ClickSend(type) {
      this.ClearJump();
      if (type == "传送") {
        this.SetInputXY(this.selectMap.pos.x, this.selectMap.pos.z);

        _Global.ReportTo3D("传送", this.selectMap.pos);
        // _Global.ReportTo3D("设置角色位置", this.selectMap.pos);
      }
      if (type == "回到原点") {
        this.SetInputXY(0, 0);

        this.ChangeOffset(0, 0);

        _Global.ReportTo3D("设置角色位置", {
          x: this.inputX,
          y: 10,
          z: this.inputY,
        });
      }
    },
    ClearJump() {
      this.inJump = true;

      let that = this;
      setTimeout(() => {
        that.inJump = false;
      }, 1000);
    },
    SetInputXY(x, y) {
      this.inputX = x;
      this.inputY = y;

      this.oldPlayerPosX = this.inputX;
      this.oldPlayerPosZ = this.inputY;

      // 世界坐标转换为地图坐标
      let offsetX = (this.inputX / this.mapSizeX) * this.oneSize;
      let offsetY = (this.inputY / this.mapSizeY) * this.oneSize;

      this.playerStyle =
        " position:absolute; left:" + offsetX + "px; top:" + offsetY + "px; ";

      this.ChangeOffset(this.inputX, this.inputY);
    },
    ToChangeOffset() {
      this.ClearJump();
      this.SetInputXY(this.inputX, this.inputY);

      _Global.ReportTo3D("设置角色位置", {
        x: this.inputX,
        y: 10,
        z: this.inputY,
      });

      // this.$parent.$refs.ThreejsHumanChat.SetLocalPlayerToPos({
      //   x: this.inputX,
      //   z: this.inputY,
      // });
      // this.ChangeOffset(this.inputX, this.inputY);
    },
    ChangeOffset(x, y) {
      // console.log("查找坐标 " + x + " " + y);

      x = Math.ceil(x / this.mapSizeX);
      y = Math.ceil(y / this.mapSizeY);

      this.centerX = x + 10000;
      this.centerZ = y + 10000;

      // console.log("查找坐标 " + x + " " + y);
      // console.log(" 拖拽原点 " + this.centerX, this.centerZ);

      // 反算出mapId
      this.LoadByCenterMapId(x + 10000, y + 10000);

      x *= -this.oneSize;
      y *= -this.oneSize;

      x += 300;
      y += 300;

      let el = this.$refs.dragPanel;
      el.style.left = x + "px";
      el.style.top = y + "px";
    },
    ClickMap(mapData) {
      if (this.isDrag) {
        return;
      }
      this.selectMap = mapData;
      this.selectMapId = mapData.mapId;
      // console.log("点击地图 id = " + mapData.mapId);
    },
    LoadByCenterMapId(x, z) {
      // let x = 10000;
      // let z = 10000;

      // return;
      let mapSize = this.oneSize;
      let x1 = x - 10000;
      let z1 = z - 10000;

      // 中心位置
      this.CreateCenter(x, z, x1 * mapSize, z1 * mapSize);

      for (let i = 0; i < this.mapOffsetArray.length; i++) {
        let item = this.mapOffsetArray[i];
        const xx = x1 + item.x;
        const zz = z1 + item.z;
        const xid = x + item.x;
        const zid = z + item.z;
        this.CreateCenter(xid, zid, xx * mapSize, zz * mapSize);
      }
    },
    CreateCenter(xid, zid, x, z) {
      let mapId = xid + "-10000-" + zid;
      for (let i = 0; i < this.diplayMapId.length; i++) {
        if (mapId == this.diplayMapId[i]) {
          return;
        }
      }

      let planeData = {};
      planeData.mapId = mapId;
      planeData.pos = {
        x: (x / this.oneSize) * this.mapSizeX,
        z: (z / this.oneSize) * this.mapSizeY,
      };
      planeData.userId = "";
      
      planeData.img = "./public/textures/touming.png"; 
      _Global.ReportTo3D("获取地图id缩略图", {
        id: mapId,
        callback: (mapData) => {
          if (mapData != null) {
            planeData.img = this.sceneFolderUrl + mapData.folderBase + "/" + "thumb.jpg";
          }
        }
      })
      planeData.content = "这是一块无主地块";
      planeData.style =
        " position:absolute; left:" + x + "px; top:" + z + "px; ";
      this.planeDataList.push(planeData);
      this.diplayMapId.push(planeData.mapId);
    },
    MoveDirection(d) {
      if (d == "left") {
        this.centerX += 2;

        // console.log(" 向 左 拖拽 ");
      }
      if (d == "right") {
        this.centerX -= 2;
        // console.log(" 向 右 拖拽 ");
      }
      if (d == "up") {
        this.centerZ += 2;
        // console.log(" 向 上 拖拽 ");
      }
      if (d == "down") {
        this.centerZ -= 2;
        // console.log(" 向 下 拖拽 ");
      }
      // console.log(" 拖拽 " +this.centerX, this.centerZ );

      this.LoadByCenterMapId(this.centerX, this.centerZ);
    },
    Open() {
      if(this.display){
        this.Close();
        return;
      }
      this.display = true;
      this.$nextTick(() => {
        this.LoadMap(0, 0);
      });
      // let that = this;
      // window.addEventListener("keydown", function (event) {
      //   switch (event.keyCode) {
      //     case 87: // W
      //       that.inputX += 1;
      //       break; 
      //     case 69: // E
      //       that.inputY += 1;
      //       break; 
      //   }

      //   that.playerStyle =
      //     " position:absolute; left:" + 
      //     (that.inputX / this.mapSizeX) * that.oneSize +
      //     "px; top:" +
      //     (that.inputY / this.mapSizeY) * that.oneSize +
      //     "px; "; 
      //   that.ChangeOffset(that.inputX, that.inputY);
      // });
    },
    Close() {
      this.display = false;
      this.selectMap = null;
      this.selectMapId = "";
      cancelAnimationFrame(this.updateId);

    },
    Update() {
      if (this.display && !this.inJump) {
        _Global.ReportTo3D("获取角色位置", (x, z) => {
          this.ChangePlayerPos(x, z);
        });
      }
      this.updateId = requestAnimationFrame(this.Update);
    },
  },

  // https://blog.csdn.net/qq_38321137/article/details/121774898
  // https://blog.csdn.net/weixin_41568816/article/details/109281217
  // 自定义指令 实现可拖动
  directives: {
    drag(el, bindings) {
      el.onmousedown = function (e) {

        e.preventDefault();
        e.stopPropagation();

        var that = this;
        var disx = e.pageX - el.offsetLeft;
        var disy = e.pageY - el.offsetTop;
        let oldLeft = el.offsetLeft;
        let oldTop = el.offsetTop;
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + "px";
          el.style.top = e.pageY - disy + "px";
          let left = el.offsetLeft;
          let top = el.offsetTop;
          if (Math.abs(oldLeft - left) >= 120) {
            if (oldLeft - left > 0) {
              // console.log(" 向 左 拖拽 ");
              that.MoveDirection("left");
              oldLeft = left;
            } else {
              // console.log(" 向 右 拖拽 ");
              that.MoveDirection("right");
              oldLeft = left;
            }
          }
          if (Math.abs(oldTop - top) >= 120) {
            if (oldTop - top > 0) {
              // console.log(" 向 上 拖拽 ");
              that.MoveDirection("up");
              oldTop = top;
            } else {
              // console.log(" 向 下 拖拽 ");
              that.MoveDirection("down");
              oldTop = top;
            }
          }
        };
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
        };
      };
    },
  },
};
</script>

<style scoped>
.map-bg {
  /* --tw-bg-opacity:1;
  background-color: rgba(2, 2, 2,var(--tw-bg-opacity)) ; */

  /* --tw-bg-opacity: 1;
  background-color: rgba(52, 211, 153, var(--tw-bg-opacity)); */
  background-color: #a7c365;
}

.map-bg:hover {
  /* --tw-bg-opacity: 1;
  background-color: rgba(240, 240, 240, var(--tw-bg-opacity)); */
  background-color: #d4d4d4;
}

.w-500px {
  width: 650px;
}

.h-500px {
  height: 550px;
}
</style> 