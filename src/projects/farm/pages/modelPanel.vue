
// 右下角的场景按钮。场景切换界面
<template>
  <!-- 右侧按钮 -->
  <div class="  absolute right-8 md:right-4 bottom-4 md:bottom-96">
    <div class="h-48 flex-col space-y-2">
      <div class="cursor-pointer rounded-full" :class="openModelPanel == '模型' ? ' bg-blue-400 text-gray-200 ' : 'bg-gray-200 text-gray-500'"
        @click="ChangePanel('模型')">
        <p class="p-2">{{ title }}库</p>
      </div>

      <div class="cursor-pointer rounded-full "  :class="inMount ? ' bg-blue-400 text-gray-200 ' : 'bg-gray-200 text-gray-500 '" @click="OnSitting()">
        <div class="p-2">坐骑</div>
      </div>
      <div v-if="inDriving" class="cursor-pointer rounded-full " 
       :class="inMount ? ' bg-blue-400 text-gray-200 ' : 'bg-gray-200 text-gray-500 '"
        @click="OnOutCar()">
        <div class="p-2">下车</div>
      </div>
      <div v-if="inCallDriving" class="cursor-pointer rounded-full " 
       :class="inMount ? ' bg-blue-400 text-gray-200 ' : 'bg-gray-200 text-gray-500 '"
        @click="OnInCar()">
        <div class="p-2">上车</div>
      </div>
      
    </div>
  </div>

  <!-- 模型库 模型列表选择 -->
  <div v-if="openModelPanel == '模型'" class="
                                  absolute
                                  md:w-2/3
                                  w-32
                                  right-24
                                  max-w-md
                                  h-60
                                  md:right-32
                                  bg-gray-200
                                  bottom-16
                                 rounded-lg
                                 overflow-hidden
                                ">
    <!-- 分类table -->
    <div class="flex rounded-md bg-gray-200">
      <div v-for="(item, i) in modelTable" :key="i" :index="item.name" class="w-auto h-8 self-center  cursor-pointer flex"
        :class="selectModelTable == item.name ? 'bg-gray-100' : ''" @click="SelectTable(item.name)">
        <div class="self-center mx-auto p-2">
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- 模型库 分类筛选后列表 -->
    <div class="
                                    overflow-y-auto
                                    overscroll-auto
                                    grid 
                                    md:grid-cols-4
                                    grid-cols-1
                                    gap-2
                                    w-11/12
                                    max-w-md
                                    p-5
                                    mx-auto
                                  ">
      <div v-for="(item, i) in modelsList" :key="i" :index="item.icon" class="
                                      w-16
                                      h-16
                                      bg-blue-100
                                      self-center
                                      mx-auto
                                      rounded-md
                                      shadow-md
                                      hover:bg-blue-400
                                      cursor-pointer
                                      flex
                                    " v-show="item.modelType == selectModelTable" :class="
                                      selectModelItem.name == item.name ? 'bg-blue-400' : 'bg-blue-100'
                                    " @click="ChangeSceneByUI(item)">
        <div class=" w-full h-full self-center mx-auto">
          <img class="w-full h-full  rounded-md p-1 " :src="path + item.icon" alt="" />
        </div>
      </div>
    </div>
  </div>

  <div v-if="inEditor"
    class=" absolute left-0 top-0 w-48 h-48 flex flex-col justify-between transform -translate-x-24 -translate-y-24 pointer-events-none "
    :style="
      ' position:absolute; left:' +
      (modelPos.x) +
      'px;top:' +
      (modelPos.y) +
      'px'">
    <div class=" w-full flex justify-between">
      <div class=" ctrlModelBtn  " @click="ctrlModel('左转')">
        <div class=" ctrlModelBtnText  ">左转</div>
      </div>
      <div class=" ctrlModelBtn " @click="ctrlModel('右转')">
        <div class=" ctrlModelBtnText  ">右转</div>
      </div>
    </div>
    <div class=" w-full flex justify-between">
      <div class=" ctrlModelBtn  " @click="ctrlModel('删除')">
        <div class=" ctrlModelBtnText  ">删除</div>
      </div>
      <div class=" ctrlModelBtn " @click="ctrlModel('确定')">
        <div class=" ctrlModelBtnText  ">确定</div>
      </div>
    </div>
  </div>
</template>

<script>

//角色动作数据
import ModelListData from "../data/modelData.js";
import AvatarData from "../data/sceneSetting.js";

export default {
  name: "index",
  props: ['openModelPanel'],
  components: {

  },
  data() {
    return {

      title: "模型",

      // openModelPanel: "",
      // 是否正在加载
      loading: false,
      // 提示文字内容
      tipContent: "模型加载中，请稍候。。。",
      selectModelTable: "静态模型",
      modelTable: [
        // {
        //   name: "角色",
        // },
        // {
        //   name: "特效",
        // },
        // {
        //   name: "动态模型",
        // },
        {
          name: "静态模型",
        },
      ],

      modelPos: { x: 0, y: 0 },
      selectModelItem: { name: "" },
      avatarData: null,
      // 选项缩略图
      modelsList: [],
      path: "",
      model: null,
      inEditor: false,
      modelItem: null,

      inMount: false,
      
      inDriving:false,
      inCallDriving :false,
      callDrivingLater:null,
    };
  },
  created() {

  },
  mounted() {
    this.path = this.$parent.GetPublicUrl();

    this.modelsList = ModelListData.modelsList;

    this.ThreejsHumanChat = this.$parent.$refs.YJmetaBase.GetThreejsHumanChat();


    setTimeout(() => {
      this._LoadUserModelManager = this.ThreejsHumanChat._YJSceneManager.Create_LoadUserModelManager();
      this._LoadUserModelManager.SetDelModelHandler(() => {
        this.model = null;
        this.inEditor = false;
      });
    }, 2000);
    this.update();
  },
  methods: {
    OnSitting() {
      this.inMount = !this.inMount;

      this.ThreejsHumanChat.YJPlayer.SelectMount(this.inMount?"fox":"");
      _Global.DirectSendUserData();
      let sp = this.ThreejsHumanChat.$parent.avatarData.setting.speedData.walkSpeed;
      this.ThreejsHumanChat._YJSceneManager.GetAmmo().SetMoveSpeed(this.inMount?sp*1.6:sp);
      
    },
    CallDriving(b){
      this.inCallDriving = b;
      if(this.callDrivingLater!=null){
        clearTimeout(this.callDrivingLater);
      }
      if( this.inCallDriving ){
        this.callDrivingLater = setTimeout(() => {
          this.OnInCar();
        }, 1500);
      }
    },
    OnInCar(){
      this.inDriving = true;
      this.inCallDriving = false;
      this.$parent.InCar();
    },
    OnOutCar(){
      this.$parent.OutCar();
      this.inDriving = false;
    },
    //#region 模型库
    //切换模型table
    SelectTable(e) {
      this.selectModelTable = e;
    },

    //------------- 玩家创建模型 开始 -------------
    //切换模式。浏览模式和编辑模式。
    //编辑模式，地面变为网格，可从背包资源中选择模型放入场景中
    ChangePanel(e) {
      this.$parent.ChangePanel(e);
    },

    CancelSelectModelIconState() {
      // 取消按钮选中状态
      this.selectModelItem.name = "";
    },
    ChangeSceneByUI(item) {
      // console.log("切换模型 ",item);

      if (this.selectModelItem.name != "") {
        if (this.selectModelItem.name == item.name) {
          return;
        }
      }

      this.SelectModelFn(item);
    },
    SelectModelFn(item) {
      if (item.modelType == "静态模型") {
        if (this.model) {
          if (this.modelItem.id) {
            this._LoadUserModelManager.CreateCollider(this.model);
          } else {
            this._LoadUserModelManager.clearGroup(this.model);
          }
        }

        //在角色面前生成模型
        item.pos = this.ThreejsHumanChat._YJSceneManager.GetPlayerPosReduceHeight();
        item.rotaV3 = { x: 0, y: 0, z: 0 };
        item.scale = { x: 1, y: 1, z: 1 };
        this.modelItem = item;
        this.modelItem.id = undefined;
        this._LoadUserModelManager.LoadStaticModel(item, (model) => {
          model.modelItem = this.modelItem;
          this._LoadUserModelManager.CreateVolume(model.GetModel(), this.modelItem.volume);

          model.modelItem.id = undefined;
          this.model = model;
          this.inEditor = true;
          // console.log(this.model);
          // console.log(item);

        });
      }

    },

    //点击选中已创建的模型
    SetModel(model) {      
      if (model != undefined &&model.modelItem != undefined && model.modelItem.modelTag == "userModel") {
        if (this.model) {
          if (this.modelItem.id) {
            this._LoadUserModelManager.CreateCollider(this.model);
          } else {
            this._LoadUserModelManager.DelCreateModel(this.model);
          }
        }

        this._LoadUserModelManager.SelectModel(model);
        this.modelItem = model.modelItem;
        console.log(" 模型信息为 ", this.modelItem);
        this.model = model;
        this.inEditor = true;
      }
    },
    ctrlModel(e) {
      if (!this.model) {
        return;
      }
      switch (e) {
        case '左转':
          // this.model.rotation.y -= 0.1;
          // this.model.RotaY(-0.1);
          this.modelItem.rotaV3.y -= 0.1;
          this._LoadUserModelManager.RotaY(this.modelItem.rotaV3.y);
          break;
        case '右转':
          // this.model.rotation.y += 0.1;
          // this.model.RotaY(0.1);
          this.modelItem.rotaV3.y += 0.1;
          this._LoadUserModelManager.RotaY(this.modelItem.rotaV3.y);

          break;
        case '删除':
          this._LoadUserModelManager.DelUserModel(this.modelItem, true);
          this._LoadUserModelManager.DelCreateModel(this.model);
          this.model = null;
          this.inEditor = false;
          break;
        case '确定':
          //在确定摆放物体时，先判断当前位置是否有空间允许放置
          if (!this._LoadUserModelManager.invaildArea) {
            return;
          }


          console.log(" 确定摆放 ", this.modelItem.id);
          this.modelItem.pos = this.model.GetPos();

          if (this.modelItem.id == undefined) {
            this._LoadUserModelManager.AddUserModel(this.modelItem, true, this.model);
          } else {
            this._LoadUserModelManager.EditorUserModel(this.modelItem, true);
          }
          this._LoadUserModelManager.CreateCollider(this.model);

          this.model = null;
          this.inEditor = false;
          break;

        default:
          break;
      }
    },
    update() {
      requestAnimationFrame(this.update);
      if (this.model) {
        this.modelPos = this.ThreejsHumanChat._YJSceneManager.GetObjectPosToScreenPos(this.model.GetModel());
      }
    }

    //-------------  玩家创建模型 结束 -------------
    //#endregion

  },
};
</script>

<style scoped>
.ctrlModelBtn {
  pointer-events: auto;
  cursor: pointer;
  color: white;
  border-radius: 9999px;
  background-color: gray;
  width: 60px;
  height: 60px;
  display: flex;
}

.ctrlModelBtnText {
  align-self: center;
  margin: auto;
}
</style>
