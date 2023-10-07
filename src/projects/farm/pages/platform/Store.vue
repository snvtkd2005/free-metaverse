
<!-- // 场景编辑UI -->
<template>
  <div class="  flex-grow flex-col p-20">

    <div class=" w-auto h-20  text-left text-3xl text-black font-bold ">模型、动画、场景、虚拟形象商店</div>

    <div class=" flex ">
      <!-- 左边分类 -->
      <div class=" text-left border-b  w-40 border-r">
        <div class=" font-bold text-lg">类别</div>
        <div class=" mt-2 ">所有项目</div>

        <div class=" mt-2">

          <div v-for="(item, i) in tableList" :key="i" class="

self-center
mx-auto 
cursor-pointer

 h-auto                relative pr-2
" :class="selectSceneName == item.name ? ' ' : ' ' " >
            <div class=" flex  justify-between" @click="item.folder = !item.folder;">

              <div>
                {{ item.content }}
              </div>
              <div class="  transform scale-x-150 scale-y-75 " v-if="item.children.length > 0" :class=" item.folder?' transform rotate-180 ':''">v

              </div>
            </div>

            <div v-if=" item.folder " class=" text-xs pl-4">
              <div v-for="(item2, i2) in item.children" :key="i2" class="

self-center
mx-auto 
cursor-pointer

 h-6                
" @click="SelectTable(item2)">
                <div>
                  {{ item2.content }}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右边展示 -->
      <div>
        <!-- 导航 -->
        <div></div>
        <!-- 内容 -->
        <!-- <div> 暂无商品 </div> -->
        
        <div class=" flex gap-6 ">
          <!-- 选择列表 -->
          <div v-for="(item, i) in modelsList" :key="i" class="
                  self-center w-40 h-auto relative
                ">
            <div class=" w-40 h-40 self-center mx-auto 
                  cursor-pointer " @click="SelectModel(item.name)">
              <img class=" w-full h-full    object-fill hover:opacity-70 " :src="publicUrl + item.icon" />
            </div>
            <div class=" mt-2 px-2 flex text-xs justify-between ">
              <div>好评率100%</div>
              <div>访问量177</div>
            </div>
            <div class=" mt-2 px-2 flex text-xs justify-between  cursor-pointer  " @click="EditorModel(item)">
              <div>购买</div>
              <div>价格1</div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="infloating" class=" absolute left-0 top-0 w-full h-full flex bg-black bg-opacity-60"
      @click="infloating = false">
      <div class=" w-1/2 h-1/2 self-center mx-auto bg-white rounded-xl">
        <div class=" p-4 w-full  flex ">
          <div class=" w-1/2 h-1/2 ">
            <img class=" w-full h-full    object-fill hover:opacity-70 " :src="publicUrl + currentSceneData.icon" />
          </div>
          <div class=" relative flex-grow flex-col justify-between">
            <div>{{ currentSceneData.name }}</div>
            <div class="  absolute bottom-4 w-full ">
              <div class=" cursor-pointer inline-block px-4 py-2 bg-blue-200 text-gray-600 rounded-lg shadow-lg"
                @click="EnterScene()">立即进入</div>

            </div>
          </div>
        </div>
        <div class=" p-10 text-left ">
          <div class=" text-xl">描述：</div>
          <div class=" mt-10 ">{{ currentSceneData.describe }}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>


import PlayerAnimData from "../../data/playerAnimSetting.js";

import SceneData from "../../data/sceneData.js";
import ModelListData from "../../data/modelData.js";


export default {
  name: "gameUI",
  components: {

  },
  data() {
    return {
      hover: false,
      infloating: false,

      tableList: [
        {
          id: 10000, content: "角色",folder:true,
          children: [
            { content: "服装" },
            { content: "饰品" },
            { content: "头型" },
            { content: "动画" },
          ]
        },
        {
          id: 10000, content: "模型",folder:true,
          children: [
            { content: "场景" },
            { content: "单品" },
            { content: "动画" },
            { content: "特效" },
          ]
        },
      ],
      modelsList: [],
      publicUrl: '',
    };
  },
  created() {
    this.avatarData = PlayerAnimData;
    this.modelsList = ModelListData.modelsList;

  },
  mounted() {

    console.log(this.avatarData);
    this.publicUrl = this.$publicUrl + this.avatarData.localPath;

    this.sceneImgPath = this.avatarData.sceneList;
    this.sceneList = SceneData.sceneList;

  },
  methods: {
 
  },
};
</script>
 
<style scoped>
.z-999 {
  z-index: 999;
}

.bg-color {
  background: #28cad9;
}
</style>