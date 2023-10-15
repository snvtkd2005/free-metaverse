
// 模型库
<template>
  <!-- 模型库 模型列表选择 -->
  <div
    v-if="isOpen"
    class="
      absolute
      w-full
      h-full
      flex
       bg-gray-500 bg-opacity-70
      text-white 
      overflow-hidden
    "
    @click="isOpen=false"
  >
    <div class=" self-center mx-auto w-1/2 h-1/2 bg-gray-100 
      rounded-tr-lg rounded-tl-lg ">
      <!-- 分类table -->
      <div class="flex bg-546770">
        <div
          v-for="(item, i) in modelTable"
          :key="i"
          :index="item.name"
          class="text-sm w-auto h-8 self-center cursor-pointer flex"
          :class="
            selectModelTable == item.name
              ? 'bg-445760 text-white '
              : ' text-gray-400 '
          "
          @click="SelectTable(item.name)"
        >
          <div class="self-center mx-auto px-1">
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- 模型库 分类筛选后列表 -->
      <div
        class="
          overflow-y-auto
          overscroll-auto
          grid
          md:grid-cols-5
          grid-cols-1
          gap-px
          mt-1
          w-full 
          px-1
          mx-auto
          h-full
        "
      >
        <div
          v-for="(item, i) in modelsList"
          :key="i"
          :index="item.icon"
          class="
            w-32
            h-32
            mx-auto
            rounded-md
            hover:bg-blue-400
            cursor-pointer
            flex flex-col
            text-xs
            text-black
          "
          v-show="item.modelType == selectModelTable"
          :class="selectModelItem.name == item.name ? 'bg-blue-400' : ' '"
          @click="ChangeSceneByUI(item)"
        >
          <div class="w-full h-full rounded-md self-center mx-auto">
            <img class="w-full h-full p-1" :src="path + item.icon" alt="" />
          </div>
          <div class="truncate px-1">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetAllModel } from "../../js/uploadThreejs.js";

export default {
  name: "index",

  components: {},
  data() {
    return {
      isOpen: false,
      // 是否正在加载
      loading: false,
      // 提示文字内容
      tipContent: "模型加载中，请稍候。。。",
      selectModelTable: "静态模型",
      modelTable: [
        // {name:"静态模型"}
      ],

      modelPos: { x: 0, y: 0 },
      selectModelItem: { name: "" },
      // 选项缩略图
      modelsList: [],
      path: "",
      model: null,
      inEditor: false,
      modelItem: null,

      uploadUrl: "",
    };
  },
  created() {},
  mounted() {
    this.path = this.$uploadUrl;
  },
  methods: {
    SetVisible(b) {
      this.isOpen = b;
    },
    Init(e) {
      this.modelTable = [];
      if (e != undefined) {
        this.selectModelTable = e;
        this.modelTable.push({ name: e });
      } else {
        this.modelTable = this.UIData.customPanel.modelTemplate;
      }
      this.SetVisible(true);
      console.log("  this.modelTable ", this.modelTable);
      this.RequestGetAllModel();
    },
    async RequestGetAllModel() {
      if(this.modelsList.length>0){ 
        return;
      }
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
            if (item.modelType == this.selectModelTable) {
              this.modelsList.push(item);
            }
          }

          console.log("获取 所有 角色模型 ", this.modelsList);
        }
      });
    },
    //#region 模型库
    //切换模型table
    SelectTable(e) {
      this.selectModelTable = e;
    },
    // 点击UI创建模型
    ChangeSceneByUI(item) {
      // console.log(item);
      this.isOpen = false;
      this.$parent.$refs.settingPanel_npc.load(item);
    },
  },
};
</script>