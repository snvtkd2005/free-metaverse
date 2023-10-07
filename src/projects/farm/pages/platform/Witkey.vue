
<!-- // 场景编辑UI -->
<template>
  <div class="  flex-grow flex-col p-20">

    <div class=" w-auto h-20  text-left text-3xl text-black font-bold ">发布模型、动画、场景、虚拟形象需求</div>

    <div class=" flex ">
      <!-- 左边分类 -->
      <div class=" text-left border-b  w-40 border-r">
        <div class=" font-bold text-lg">类别</div>
        <div class=" mt-2 ">所有项目</div>

        <div class=" mt-2">

          <div v-for="(item, i) in   tableList  " :key="i" class="

self-center
mx-auto 
cursor-pointer

 h-auto                relative pr-2
" :class="selectSceneName == item.name ? ' ' : ' '">
            <div class=" flex  justify-between" @click="item.folder = !item.folder;">

              <div>
                {{ item.content }}
              </div>
              <div class="  transform scale-x-150 scale-y-75 " v-if=" item.children.length > 0 "
                :class=" item.folder ? ' transform rotate-180 ' : '' ">v

              </div>
            </div>

            <div v-if=" item.folder " class=" text-xs pl-4">
              <div v-for="(  item2, i2  ) in   item.children  " :key=" i2 " class="

self-center
mx-auto 
cursor-pointer

 h-6                
" @click=" SelectTable(item2) ">
                <div>
                  {{ item2.content }}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右边展示 -->
      <div class=" ml-4">
        <!-- 导航 -->
        <div></div>
        <!-- 内容 -->
        <!-- <div> 暂无商品 </div> -->
        <div class="  ">
          <div v-for="(  item, i  ) in   witkeyList  " :key=" i " class="
            self-center
            mx-auto 
             bg-gray-200 
            h-auto rounded-lg shadow-sm p-2     text-left      mb-4    
            ">
            <div class=" chatContent ">
              {{i+1}}. {{ item.content }}
            </div>
            <div class=" mt-1 text-sm">发布日期：{{item.date}}</div>

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
        {id: 10000, content: "想要一个烟花效果,参考 https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F46081675-1177-4deb-b79b-eea8c959b845%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1684836728&t=d0fcdf7f85531eb5c9e15a7115d23f0e ", tip: "服装",date:"2023-4-23 18:02"},
        {id: 10000, content: "想要迪迦奥特曼模型", tip: "服装",date:"2023-4-23 18:02"},
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
}
</style>