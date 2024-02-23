
<template>
  <!-- 模型库 模型列表选择 -->
  <div v-if="isOpen" class=" w-full h-full bg-445760 flex flex-col  ">
    <!-- 分类table -->
    <div class="flex bg-546770 h-8">
      <div v-for="(item, i) in modelTable" :key="i" :index="item.name"
        class=" mr-2 text-sm w-auto h-8 self-center  cursor-pointer flex"
        :class="selectModelTable == item.name ? 'bg-445760 text-white ' : ' text-gray-400 '"
        @click="SelectTable(item.name)">
        <div class="self-center mx-auto px-1">
          {{ item.name }}
        </div>
      </div>
      <div class=" text-white cursor-pointer pt-1 " @click="ClickHandler('刷新')">
        刷新
      </div>
    </div>

    <!-- 模型库 分类筛选后列表 -->
    <div class=" overflow-y-auto overscroll-auto flex flex-wrap w-full pt-1 grow text-white">
      <div v-for="(item, i) in modelsList" :key="i" :index="item.icon"
        class=" w-20 h-20 rounded-md  hover:bg-blue-400 cursor-pointer  flex flex-col text-xs "
        v-show="item.modelType == selectModelTable" :class="selectModelItem.name == item.name ? 'bg-blue-400' : ' '"
        @click="ChangeSceneByUI(item)">
        <div class=" w-full h-16  rounded-md self-center mx-auto">
          <img class="w-full h-full p-1 " :src="item.icon" alt="" />
        </div>
        <div class=" truncate px-1 ">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { GetAllModel, GetAllGroup } from "../../../js/uploadThreejs.js";

export default {
  name: "index",
  props: ['title'],
  components: {

  },
  data() {
    return {

      isOpen: true,
      // 提示文字内容
      tipContent: "模型加载中，请稍候。。。",
      selectModelTable: "静态模型",
      modelTable: [
        {
          name: "静态模型",
        },
      ],

      modelPos: { x: 0, y: 0 },
      selectModelItem: { name: "" },
      // 选项缩略图
      modelsList: [],
      model: null,
      inEditor: false,
      modelItem: null,
    };
  },
  created() {

  },
  mounted() {
    if (this.title == "group") {
      this.modelTable = this.UIData.customPanel.selectModel_group;
    } else {
      this.modelTable = this.UIData.customPanel.selectModel;
    }

    // console.log(" this.modelsList ", this.modelsList);

    this.RequestGetAllModel();

  },
  methods: {
    
    ClickHandler(e, item, i) {
      if (e == "刷新") {
        this.RequestGetAllModel();
      } 
    },
    SetVisible(b) {
      this.isOpen = b;
    },
    Init() { 
      this.update();

    },
    async RequestGetAllModel() {
      this.modelsList = [];
      GetAllModel().then((res) => {
        console.log("获取所有单品模型 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;

          let modelsList = [];
          for (let i = 0; i < txtDataList.length; i++) {
            let element = txtDataList[i];
            try {
              modelsList.push(JSON.parse(element));
            } catch (error) {
              element = element.substring(1);
              modelsList.push(JSON.parse(element));
            }
          }


          for (let i = 0; i < modelsList.length; i++) {
            let item = modelsList[i];
            item.icon = this.$uploadUrl + item.folderBase +  "/" + "thumb.png";

            if (item.modelType == "角色模型") {
              // 到角色数据中，模型路径、动画数据
              let data = item.message.data;
              data.modelPath = this.$uploadUrl + item.modelPath;
              _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data);
            } else {
              this.modelsList.push(item);
            }
          }
          if (this.title == "group") {

          } else {
            this.RequestGetAllGroup();
          }
        }
      });
    },
    async RequestGetAllGroup() {

      GetAllGroup().then((res) => {
        console.log("获取所有 组合 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;

          let modelsList = [];
          for (let i = 0; i < txtDataList.length; i++) {
            let element = txtDataList[i];
            modelsList.push((element));
          }
          for (let i = 0; i < modelsList.length; i++) {
            let item = modelsList[i];
            item.icon = this.$uploadGroupUrl + item.icon;
            this.modelsList.push(item);
          }

        }
      });
    },
    GetModelByName(modelName){
      for (let i = 0; i < this.modelsList.length; i++) {
        if(this.modelsList[i].name == modelName){
          return this.modelsList[i];
        }
      }
      return null;
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
      if (this.openModelPanel == e) {
        this.openModelPanel = "";
        return;
      }
      this.openModelPanel = e;
    },

    CancelSelectModelIconState() {
      // 取消按钮选中状态
      this.selectModelItem.name = "";
    },
    // 点击UI创建模型
    ChangeSceneByUI(item) {
      // console.log("切换模型 ",item);

      if (this.selectModelItem.name != "") {
        if (this.selectModelItem.name == item.name) {
          return;
        }
      }

      this.SelectModelFn(item);
    },
    // 点击UI创建模型
    SelectModelFn(item) {

      if (1 == 1
        //   item.modelType == "静态模型" 
        // || item.modelType == "动画模型" 
        // || item.modelType == "uv模型"
        // || item.modelType == "汽车模型"
        // || item.modelType == "装备模型"

      ) {


        //在角色面前生成模型
        item.pos = _Global.YJ3D._YJSceneManager.GetPlayerPosReduceHeight();

        item.rotaV3 = { x: 0, y: 0, z: 0 };
        item.scale = { x: 1, y: 1, z: 1 };
        this.modelItem = item;
        this.modelItem.id = undefined;

        if(!this._LoadUserModelManager){
          this._LoadUserModelManager =  _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager();
        }
      this._LoadUserModelManager.LoadStaticModel(item, (transform) => {
          this.$parent.CreateNewTransfrom(transform);
        });
      }
    },
    CreateGeometry(){
      let modelData = {message:{}};
      modelData.modelType = "几何体模型";
      modelData.message.pointType = "geometry";
      modelData.message.data = {
        geometryType:"box",
        isCollider:false,
        isTrigger:false,
        tiggerTag:"",
      };
      this.SelectModelFn(modelData);
    },

    //点击选中已创建的模型
    SetModel(model) {
      console.log(" 点击选中已创建的模型 ", model);

      if(!this._LoadUserModelManager){
          this._LoadUserModelManager =  _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager();
        }
      if (model != undefined) {
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
      console.log(" 控制模型 ", e);
      if (!this.model) {
        return;
      }
      
      if(!this._LoadUserModelManager){
          this._LoadUserModelManager =  _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager();
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
        this.modelPos = _Global.YJ3D._YJSceneManager.GetObjectPosToScreenPos(this.model.GetModel());
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
