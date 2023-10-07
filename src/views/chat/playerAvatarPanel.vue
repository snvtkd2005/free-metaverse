
// 界面右下角皮肤按钮。 角色皮肤切换界面
<template>

  <!-- 右侧按钮 -->
  <div class="absolute right-2 bottom-24">
    <div class="h-auto flex-col grid gap-y-2"> 
      <div
        class="cursor-pointer rounded-full"
        :class="openModelPanel == '模型库' ? ' bg-blue-200 ' : 'bg-gray-200'"
        @click="ChangePanel('模型库')"
      >
        <p class="p-2">{{ skin }}</p>
      </div>
    </div>
  </div>

  <!-- 模型库 模型列表选择 -->
  <div
    v-if="openModelPanel == '模型库'"
    class="
      absolute
      w-2/3
      max-w-md
      right-16
      h-60
      md:right-32
      bg-gray-200
      bottom-16
     rounded-lg
     overflow-hidden
    "
  >
    <!-- 分类table -->
    <!-- <div class="flex rounded-md bg-gray-200">
      <div
        v-for="(item, i) in modelTable"
        :key="i"
        :index="item.name"
        class="w-auto h-8 self-center mx-auto cursor-pointer flex"
        :class="selectModelTable == item.name ? 'bg-gray-100' : ''"
        @click="SelectTable(item.name)"
      >
        <div class="self-center mx-auto p-2">
          {{ item.name }}
        </div>
      </div>
    </div> -->


    <!-- 模型库 分类筛选后列表 -->
    <div
      class="
        overflow-y-auto
        overscroll-auto
        grid 
        md:grid-cols-4
        grid-cols-3
        gap-2
        w-full
        max-w-md
        p-5
        mx-auto
      "
    >
      <div
        v-for="(item, i) in modelsList"
        :key="i"
        :index="item.img"
        class="
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
        "
        v-show="item.modelType == selectModelTable"
        :class="
          selectModelItem.name == item.name ? 'bg-blue-400' : 'bg-blue-100'
        "
        @click="SelectModel(item)"
      >
        <div class=" w-full h-full self-center mx-auto">
          <img class="w-full h-full  rounded-md p-1 " :src="path + item.img" alt="" />
        </div>
      </div>
    </div>
  </div>
 
</template>

<script>

export default {
  name: "index",
  props:['openModelPanel'],
  components: {
     
  },
  data() {
    return { 

      skin:"皮肤",

      // openModelPanel: "",
      // 是否正在加载摆放的模型 或 切换角色皮肤
      loading: false,
      // 提示文字内容
      tipContent: "模型加载中，请稍候。。。", 
      selectModelTable: "角色",
      modelTable: [
        {
          name: "角色",
        },
        // {
        //   name: "特效",
        // },
        // {
        //   name: "动态模型",
        // },
        // {
        //   name: "静态模型",
        // },
      ],
       
      selectModelItem: { name: "" }, 
      avatarData: null,
      // 皮肤弹出框的角色选项
      modelsList: [],
      path:"",
    };
  }, 
  created() {
    this.avatarData = this.$parent.avatarData;
  },
  mounted() {
    this.path = this.$parent.GetPublicUrl();
    
    this.modelsList = this.avatarData.modelsList; 
  
    this.ThreejsHumanChat = this.$parent.$refs.YJmetaBase.GetThreejsHumanChat();
  },
  methods: {
    
    GetAvatarData(playerName) {
      for (let i = 0; i < this.avatarData.avatarData.length; i++) {
        if (this.avatarData.avatarData[i].name == playerName) {
          return this.avatarData.avatarData[i];
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

      // if (this.openModelPanel != e) {
      //   this.openModelPanel = e;
      // } else {
      //   this.openModelPanel = "";
      // }
      this.$parent.ChangePanel(e); 
 
    },
    //右键点击空白位置，取消模型选中
    ClearSelectModel() {
      this.CancelSelectModelIconState();
      // 删除模型
      this.ThreejsHumanChat.SelectModel();

      this.LoadingState("success");
    },
    CancelSelectModelIconState() {
      // 取消按钮选中状态
      this.selectModelItem.name = "";
    },
    SelectModel(item) {
      if (this.selectModelItem.name != "") {
        if (this.selectModelItem.name == item.name) {
          return;
        }
        this.ClearSelectModel();
      }
      this.SelectModelFn(item);
    },
    SelectModelFn(item) {
      if (item.modelType == "角色") {
        //点击角色图标，切换角色avatar
        this.ThreejsHumanChat.ChangeAvatar(item.name, true);

        if(this.$parent.ChangeAvatar){
          this.$parent.ChangeAvatar(item.name);
        }
        if(this.YJDync == undefined || this.YJDync == null){
          this.YJDync =  this.$parent.$refs.YJDync;
        }
      // console.log("更新角色皮肤 111 " , this.YJDync);

        if(this.YJDync){
          this.YJDync._YJDyncManager.updateUserSkin(item.name);
        }
      } else { 
      }
    },
    // 创建非角色模型
    SelectStaticModel(type, item) {
      // 弹出等待提示
      this.LoadingState("begin");
      this.selectModelItem.name = item.name;
      this.selectModelItem.img = item.img;
      if (type == "静态模型") {
        this.ThreejsHumanChat.SelectModel(item);
      }
      if (type == "npc") {
        this.ThreejsHumanChat.SelectModel(item);
      }
    },
    //-------------  玩家创建模型 结束 -------------
    //#endregion
 
  },
};
</script>

  <style scoped> 
</style>
