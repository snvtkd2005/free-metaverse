
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <div class="  absolute left-0 top-0  z-0 w-full h-full ">

    <!-- 顶部 -->
    <div class=" absolute z-20 left-0 top-0 h-10 w-full flex bg-gray-800  text-gray-100 border-b border-gray-400  ">
      <!-- left logo -->
      <div class=" w-4 md:w-30 self-center ">

      </div>

      <!-- table -->
      <div class=" flex ">
        <div v-for="(item, i) in tableList" :key="i" :index="item.id"
          class=" px-2 md:px-10 text-sm md:text-base flex  h-10 text-center  hover:border-gray-200 border-b border-gray-400 " 
          :class="currentTable == item.content
            ? ' bg-gray-600 '
            : ' cursor-pointer '
            " @click="ChangeTable(item)">
          <div class=" self-center">
            {{ item.content }}
          </div>
        </div>
      </div>
      <!-- right -->
      <div>

      </div>

    </div>



    <!-- 中部 -->
    <div class=" flex z-10 absolute left-0 top-0  w-full h-full bg-gray-100 overflow-hidden">
      <!-- 左 -->
      <div class=" hidden  w-44 h-full bg-gray-300 self-center border-r border-gray-400  ">
        <div class=" border-b border-gray-400 h-12 flex ">
          <div class=" self-center mx-auto "> YJ</div>

        </div>
        <div>

          <div v-for="(item, i) in menuList" :key="i" class="
          flex
          self-center
          mx-auto 
          cursor-pointer pointer-events-none
          w-44 h-10              
          " @click="SelectScene(item.name)">

            <div class=" mt-2 px-2 flex text-base  self-center mx-auto text-center ">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
      <!-- 右 -->
      <div class="  flex-grow flex-col  ">

        <div class=" relative  flex w-full h-full ">
          <router-view></router-view>
        </div>
      </div>
    </div>


  </div>
</template>

<script>



export default {
  name: "indexHome",
  components: {
  },
  data() {
    return {
      hover: false,
      infloating: false,
      playerImg: "",
      avatarName: "小孩",
      playerName: "hhh",

      projectionList: [
      ],
      currentTable:"",
      // 顶部导航栏
      tableList:[],
      // tableList: [
      //   { id: 10000, content: "元宇宙", routerPath: "/selectScene", },
      //   { id: 10000, content: "虚拟形象", routerPath: "/selectPlayer", },
      //   { id: 10000, content: "素材库", routerPath: "/store", },
      //   { id: 10000, content: "模型需求", routerPath: "/witkey", },
      //   { id: 10000, content: "创作", routerPath: "/selfPanel", },
      //   { id: 10000, content: "开发计划", routerPath: "/developPlan", },
      // ],
      // tableList: [
      //   { id: 10000, content: "Metaverse", routerPath: "/selectScene", },
      //   { id: 10000, content: "Avatar", routerPath: "/selectPlayer", },
      //   { id: 10000, content: "Store", routerPath: "/store", },
      //   { id: 10000, content: "Need", routerPath: "/witkey", },
      //   { id: 10000, content: "CustomCreate", routerPath: "/selfPanel", },
      //   { id: 10000, content: "DevPlan", routerPath: "/developPlan", },
      // ],


      menuList: [
        { id: 10000, content: "首页", routerPath: "/selectScene", },
        { id: 10000, content: "个人资料", routerPath: "/selectPlayer", },
        { id: 10000, content: "信息", routerPath: "", },
        { id: 10000, content: "好友", routerPath: "", },
        { id: 10000, content: "虚拟形象", routerPath: "", },
        { id: 10000, content: "道具", routerPath: "", },
        { id: 10000, content: "交易", routerPath: "", },
        { id: 10000, content: "群组", routerPath: "", },
        { id: 10000, content: "博客", routerPath: "", },
        { id: 10000, content: "官方商店", routerPath: "", },
        { id: 10000, content: "礼品卡", routerPath: "", },
      ],
      sceneList: [],
      sceneImgPath: [],
      selectSceneName: "scene1",
      currentSceneData: null,
      publicUrl: '',
      // 是否有目标，目标为npc、其他玩家
      hasTarget: false,
    };
  },

  created() {
    this.tableList = this.UIData.tableList;
  },
  mounted() {

  },
  methods: {
    ChangeTable(item) {
      this.currentTable = item.content;
      this.$router.push(
        {
          path: item.routerPath,
        }
      );
    },
    GetPublicUrl() {
      return this.publicUrl;
    },

  },
};
</script>

<style scoped></style>
