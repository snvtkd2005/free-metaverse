
// 右下角的场景按钮。场景切换界面
<template>
  <!-- 右侧按钮 -->
  <div class="  absolute right-8 md:right-4 top-4 md:top-10  flex flex-col pointer-events-none  ">

    <div class="h-auto flex-col text-base space-y-2"> 

        <div class=" flex ">

          <div class="cursor-pointer rounded-full " @click="ChangeScene('scene1')">
            <div class="p-2">农场</div>
          </div>
          <div class="cursor-pointer rounded-full " @click="ChangeScene('scene2')">
            <div class="p-2">会议室</div>
          </div>

          <div class="cursor-pointer rounded-full " @click="ChangeScene('scene3')">
            <div class="p-2">彩虹城</div>
          </div>

          <div class="cursor-pointer rounded-full " @click="ChangeScene('scene4')">
            <div class="p-2">雪城</div>
          </div>
        </div>


        <div class=" flex ">

          <div class="cursor-pointer rounded-full " @click="ClickInterface('打印场景物体')">
            <div class="p-2">打印场景物体</div>
          </div>

        </div>

        <div class="h-auto flex-col text-base space-y-2">
          <div class="flex">
            <div class="cursor-pointer rounded-full" @click="ClickInterface('做动作', 1)">
              <div class="p-2">idle动作</div>
            </div>

            <div class="cursor-pointer rounded-full" @click="ClickInterface('做动作', 2)">
              <div class="p-2">走路动作</div>
            </div>
          </div>

          <!-- <div class="flex">
            <div class="cursor-pointer rounded-full" @click="ClickInterface('播放视频', 1)">
              <div class="p-2">播放视频</div>
            </div> 
          </div> -->



        </div>

    </div>
  </div>
</template>

<script>


export default {
  name: "index",
  components: {

  },
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

      inDriving: false,
      inCallDriving: false,
      callDrivingLater: null,
    };
  },
  created() {

  },
  mounted() {
    // this.path = this.$parent.GetPublicUrl();

  },
  methods: {
    ChangeScene(e) {
      _Global.ChangeScene(e);
    },
    ClickInterface(title, e) {

      let content = "";
      for (let i = 0; i < this.modelTable.length; i++) {
        const element = this.modelTable[i];
        if (element.title == title) {
          for (let ii = 0; ii < element.data.length; ii++) {
            const el2 = element.data[ii];
            if (el2.id == e) {
              content = el2.content;
            }
          }
        }
      }

      if (title == "播放视频") {
        _Global.PlayVideoById();
      }
      
      if (title == "打印场景物体") {
        this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetAllModel();
      }

      if (title == "发表情") {
        _Global.SetPlayerExpression(content);
      }
      if (title == "做动作") {
        _Global.SetPlayerAnim(content);
      }

      if (title == "切换视角") {
        if (this.viewName == "舞台") {
          this.viewName = "自身";
        } else {
          this.viewName = "舞台";
        }
        _Global.SetAllPlayerToStageView(this.viewName == "舞台");

      }
      if (title == "全员荧光棒") {
        _Global.AllPickLightStick(e == 1);
        return;
      }


      if (title == "荧光棒") {
        _Global.PickLightStick(e);
      }

      if (title == '灯牌') {
        _Global.PickDengPai(e);
      }


      if (title == "换男角色") {
        _Global.ChangeAvatar(e == 1 ? "maleHair1" : e == 2 ? "maleHair2" : "maleHair3");
      }

      if (title == "换男角色演唱会") {
        _Global.ChangeAvatar(e == 1 ? "malelook1" : e == 2 ? "malelook2" : "malelook3");
      }

      if (title == "换女角色") {
        _Global.ChangeAvatar(e == 1 ? "femaleHair1" : e == 2 ? "femaleHair2" : "femaleHair3");
      }
      if (title == "换女角色演唱会") {
        _Global.ChangeAvatar(e == 1 ? "femalelook1" : e == 2 ? "femalelook2" : "femalelook3");
      }



      if (title == "全员鼓掌") {
        _Global.AllHandClap(e == 1);
      }

      if (title == "气球雨") {
        _Global.BalloonRain(e != undefined, e);
      }

      if (title == '播放烟花') {
        _Global.PlayFireWorks();
      }

      if (title == '全员落座') {
        _Global.AllSitting(e == 1);
      }

      if (title == '全屏播放') {
        _Global.SetVideoFullScreen();
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
