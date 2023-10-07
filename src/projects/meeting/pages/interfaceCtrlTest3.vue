
// 右下角的场景按钮。场景切换界面
<template>
  <!-- 右侧按钮 -->
  <div v-if="skinData.length > 0" class="
      absolute
      z-50
      right-8
      md:right-4
      top-0
      flex flex-col
      pointer-events-none
    ">
    <div class="h-auto flex-col text-base space-y-2">

      <div class=" flex ">

        <div class=" grid  ">
          <div v-for="(item, i) in 2" :key="i" class="">
            <div class="cursor-pointer rounded-full" @click="ClickInterface('换性别', i); headIndex = i;">
              <div class="p-1" :class="headIndex == i ? ' bg-blue-400 rounded-full text-white ' : ''">{{ i == 0 ? '男性' :
                '女性' }}
              </div>
            </div>
          </div>
        </div>

        <div class=" grid grid-cols-4 ">
          <div v-for="(item, i) in skinData[1].icon" :key="i" class="">
            <div class="cursor-pointer rounded-full" @click="ClickInterface('换发型', i); hairIndex = i;">
              <div class="p-1" :class="hairIndex == i ? ' bg-blue-400 rounded-full text-white ' : ''">换发型{{ i + 1 }}</div>
            </div>
          </div>
        </div>

      </div>

      <div class=" grid grid-cols-4 ">
        <div v-for="(item, i) in skinData[2].icon" :key="i" class=" ">
          <div class="cursor-pointer rounded-full" @click="ClickInterface('换衣服', i); coatIndex = i;">
            <div class="  p-1" :class="coatIndex == i ? ' bg-blue-400 rounded-full text-white ' : ''">换衣服{{ i + 1 }}</div>
          </div>
        </div>
      </div>

      <div class=" grid grid-cols-4 ">
        <div v-for="(item, i) in skinData[3].icon" :key="i" class=" ">
          <div class="cursor-pointer rounded-full" @click="ClickInterface('换裤子', i); pantsuitIndex = i;">
            <div class="  p-1" :class="pantsuitIndex == i ? ' bg-blue-400 rounded-full text-white ' : ''">换裤子{{ i + 1 }}
            </div>
          </div>
        </div>
      </div>


      <div class=" grid grid-cols-4 ">
        <div v-for="(item, i) in skinData[4].icon" :key="i" class="">
          <div class="cursor-pointer rounded-full" @click="ClickInterface('换鞋子', i); shoesIndex = i;">
            <div class="p-1" :class="shoesIndex == i ? ' bg-blue-400 rounded-full text-white ' : ''">换鞋子{{ i + 1 }}</div>
          </div>
        </div>
      </div>

      <div class=" grid grid-cols-4 ">
        <div v-for="(item, i) in skinData[5].icon" :key="i" class="">
          <div class="cursor-pointer rounded-full" @click="ClickInterface('换套装', i); taoIndex = i;">
            <div class="p-1" :class="taoIndex == i ? ' bg-blue-400 rounded-full text-white ' : ''">换套装{{ i + 1 }}</div>
          </div>
        </div>
      </div>
 


    </div>

    <div class="h-auto flex-col text-base space-y-2"></div>
  </div>
</template>

<script>
export default {
  name: "index",
  components: {},
  data() {
    return {
      viewName: "舞台",
      title: "切换视角",

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
          title: "做动作",
          data: [
            { id: 1, content: "idle" },
            { id: 2, content: "walk" },
            { id: 3, content: "hello" },
            { id: 4, content: "dacall" },
            { id: 5, content: "brandish" },
            { id: 6, content: "handClap" },
            { id: 7, content: "yeah" },
          ],
        },
        {
          title: "发表情",
          data: [
            { id: 1, content: "images/mico.png" },
            { id: 2, content: "images/胡萝卜.png" },
            { id: 3, content: "images/南瓜.png" },
          ],
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

      hairIndex: 0,
      coatIndex: 0,
      pantsuitIndex: 0,
      shoesIndex: 0,
      taoIndex: 0,
      headIndex: 0,

      inTao: false,
      skinData: [],
      gander: "male",
    };
  },
  created() { },
  mounted() {
    // this.path = this.$parent.GetPublicUrl();
    setTimeout(() => {
      this.skinData = _Global.GetTexiaoData.maleSkinData;
      console.error(" 界面换装数据", this.skinData);
    }, 1000);

    let sp = localStorage.getItem("playerState").split("_");
    if (sp.length == 6) {
      sp.push("-1");
    }

    this.gander = sp[0];
    this.headIndex = this.gander == "male" ? 0 : 1;

    this.hairIndex = sp[1];
    this.coatIndex = sp[2];
    this.pantsuitIndex = sp[3];
    this.shoesIndex = sp[4];
    this.taoIndex = sp[5];
    this.inTao = this.taoIndex!= -1;
  },
  methods: {
    ChangeScene(e) {
      _Global.ChangeScene(e);
    },
    ClickInterface(title, e) {
      if (title == "换性别") {

        if (e == 0) {
          this.skinData = _Global.GetTexiaoData.maleSkinData;
        }
        if (e == 1) {
          this.skinData = _Global.GetTexiaoData.femaleSkinData;
        }

        if (this.hairIndex >= this.skinData[1].icon.length) {
          this.hairIndex = this.skinData[1].icon.length - 1;
        }
        if (this.coatIndex >= this.skinData[2].icon.length) {
          this.coatIndex = this.skinData[2].icon.length - 1;
        }
        if (this.pantsuitIndex >= this.skinData[3].icon.length) {
          this.pantsuitIndex = this.skinData[3].icon.length - 1;
        }
        if (this.shoesIndex >= this.skinData[4].icon.length) {
          this.shoesIndex = this.skinData[4].icon.length - 1;
        }

        this.gander = e == 0 ? "male" : "female";

        _Global.ChangeSkin("head", 0, this.gander);
        _Global.ChangeSkin("hair", this.hairIndex, this.gander);
        _Global.ChangeSkin("coat", this.coatIndex, this.gander);
        _Global.ChangeSkin("pantsuit", this.pantsuitIndex, this.gander);
        _Global.ChangeSkin("shoes", this.shoesIndex, this.gander);

      }
      if (title == "换发型") {
        _Global.ChangeSkin("hair", e, this.gander);
      }
      if (title == "换衣服") {
        _Global.ChangeSkin("coat", e, this.gander);
        if (this.inTao) {
          _Global.ChangeSkin("pantsuit", this.pantsuitIndex, this.gander);
          this.inTao = false;
        }
      }

      if (title == "换裤子") {
        _Global.ChangeSkin("pantsuit", e, this.gander);
        if (this.inTao) {
          _Global.ChangeSkin("coat", this.coatIndex, this.gander);
          this.inTao = false;
        }

      }
      if (title == "换鞋子") {
        _Global.ChangeSkin("shoes", e, this.gander);
      }

      if (title == "换套装") {
        _Global.ChangeSkin("suit", e, this.gander);
        this.inTao = true;
      }
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  background: rgb(223, 223, 223);
  color: rgb(85, 85, 85);
  display: inline-block;
  pointer-events: auto;
}
</style>
