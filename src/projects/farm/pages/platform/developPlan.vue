
<!-- // 场景编辑UI -->
<template>
  <div class="  flex-grow flex-col p-20">

    <div class=" w-auto h-20  text-left text-3xl text-black font-bold ">开发计划/平台功能</div>

    <div class=" flex ">

      <!-- 右边展示 -->
      <div class=" ml-4">

        <div class=" grid grid-cols-2 ">
          <div v-for="(item, i) in witkeyList" :key="i" class="
            self-center  mx-auto h-auto text-left mb-4 w-2/3  flex relative
            ">
            <div :class="item.isChild ? ' ml-20' : ''" class=" bg-gray-200 p-2 rounded-lg shadow-sm  ">

              <div class=" chatContent " >
                {{ i + 1 }} {{ item.content }}
              </div>
            </div>
            <div class=" absolute left-0 top-0 w-3 h-3 rounded-full " :class="item.isCompleted ? ' bg-green-400 ' : ' hidden'"></div>
            <!-- <div class=" mt-1 text-sm">发布日期：{{item.date}}</div> -->

          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>


export default {
  name: "gameUI",
  components: {

  },
  data() {
    return {
      hover: false,

      tableList: [
        {
          id: 10000, content: "角色", folder: true,
          children: [
            { content: "服装" },
            { content: "饰品" },
            { content: "头型" },
            { content: "动画" },
          ]
        },
        {
          id: 10000, content: "模型", folder: true,
          children: [
            { content: "场景" },
            { content: "单品" },
            { content: "动画" },
            { content: "特效" },
          ]
        },
      ],

      witkeyList: [
        { isChild: false, content: " npc攻击、受伤、死亡 ", tip: "", date: "", isCompleted: true },
        { isChild: false, content: " npc寻路功能、巡逻路径设置 ", tip: "", date: "", isCompleted: true },
        { isChild: false, content: " 多人模式场景漫游 ", tip: "", date: "", isCompleted: true },

        { isChild: false, title: " 单个模型上传  ", content: " 单个fbx、gltf、glb模型上传。 使用的贴图与模型放在同级目录。上传时选择模型类型  ", tip: "服装", date: "2023-4-23 18:02", isCompleted: true },
        { isChild: false, title: " hdr模块  ", content: " 独立hdr模块，在场景设置-环境配置中单独选择 ", tip: "服装", date: "2023-4-23 18:02", isCompleted: true },
        {
          isChild: false, title: " 关键帧动画模型  ", content: " 带动画的模型，支持多个动画，默认循环播放 ", tip: "服装",
          date: "2023-4-23 18:02", isCompleted: true
        },
        { isChild: false, title: " 关键帧动画模型  ", content: " 配置播放模式。播放模式如loop、pingpang、once、全部播放、播放单个、顺序播放  ", tip: "服装", date: "2023-4-23 18:02", isCompleted: false },
        { isChild: false, title: " uv动画模型  ", content: " uv动画模型，做UV偏移动画，支持横纵向移动、uv缩放比例、播放速度。如：特效、烟花、热点  ", tip: "服装", date: "2023-4-23 18:02", isCompleted: true },
        { isChild: false, title: " 角色模型上传且映射动作  ", content: " 角色模型上传且映射动作  ", tip: "服装", date: "2023-4-23 18:02", isCompleted: true },
        { isChild: false, title: " 组合模型  ", 
        content: " 组合单个模型，方便在场景中快速摆放  ", 
        tip: "服装", date: "2023-4-23 18:02", isCompleted: true },
        { isChild: false, title: " 摆放模型生成场景  ", content: " 编辑（移动、缩放、旋转、删除）模型、配置太阳光、初始视角、环境光hdr  ", tip: "服装", date: "2023-4-23 18:02", isCompleted: true },
        { isChild: false, title: " 编辑的场景设置密码  ", content: " 编辑好场景后，如果不希望公开，可设置密码，访问需要输入密码。   ", tip: "服装", date: "2023-4-23 18:02", isCompleted: false },
        { isChild: false, content: " 简易粒子特效 ", tip: "", date: "", isCompleted: true },
        
        {
          isChild: false, title: " 场景交互触发  ",
          content: " 制作场景交互：区域trigger、触发后执行事件、通过id控制模型是否显示、是否播放动画   ",
          tip: "服装", date: "2023-4-23 18:02", isCompleted: false
        },
        {
          isChild: false, title: " 场景和组合编辑模式下支持上传   ",
          content: " 场景和组合编辑模式下支持上传，独立使用、也可发布到公共素材库   ",
          tip: "服装", date: "2023-4-23 18:02", isCompleted: false
        },


      ],

      publicUrl: '',
    };
  },
  created() {

  },
  mounted() {


  },
  methods: {

  },
};
</script>
 
<style scoped>
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

.z-999 {
  z-index: 999;
}

.bg-color {
  background: #28cad9;
}</style>