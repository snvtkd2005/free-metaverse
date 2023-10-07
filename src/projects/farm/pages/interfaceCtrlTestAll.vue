
// 右下角的场景按钮。场景切换界面
<template>
  <!-- 右侧按钮 -->
  <div
    class="
      absolute
      z-50
      right-8
      md:right-4
      top-4
      md:top-10
      flex flex-col
      pointer-events-none
    "
  >
    <div class="h-auto flex-col text-base space-y-2">
      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换男角色', 1)"
        >
          <div class="p-2">换男角色发型1</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换男角色', 2)"
        >
          <div class="p-2">换男角色发型2</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换男角色', 3)"
        >
          <div class="p-2">换男角色发型3</div>
        </div>
      </div>

      <div
        class="cursor-pointer rounded-full"
        @click="ClickInterface('全员落座', 1)"
      >
        <div class="p-2">全员落座</div>
      </div>
      <div
        class="cursor-pointer rounded-full"
        @click="ClickInterface('全员落座')"
      >
        <div class="p-2">全员取消落座</div>
      </div>

      <div
        class="cursor-pointer rounded-full"
        @click="ClickInterface('全员鼓掌', 1)"
      >
        <div class="p-2">全员鼓掌</div>
      </div>
      <div
        class="cursor-pointer rounded-full"
        @click="ClickInterface('全员鼓掌')"
      >
        <div class="p-2">全员取消鼓掌</div>
      </div>

      <div class="hidden flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换女角色', 1)"
        >
          <div class="p-2">换女角色发型1</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换女角色', 2)"
        >
          <div class="p-2">换女角色发型2</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换女角色', 3)"
        >
          <div class="p-2">换女角色发型3</div>
        </div>
      </div>
    </div>

    <div class="h-auto flex-col text-base space-y-2">
      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('做动作', 1)"
        >
          <div class="p-2">idle动作</div>
        </div>

        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('做动作', 2)"
        >
          <div class="p-2">走路动作</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('做动作', 3)"
        >
          <div class="p-2">hello动作</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('做动作', 4)"
        >
          <div class="p-2">打call</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('做动作', 5)"
        >
          <div class="p-2">挥荧光棒</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('做动作', 6)"
        >
          <div class="p-2">鼓掌</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('做动作', 7)"
        >
          <div class="p-2">比耶</div>
        </div>
      </div>

      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('发表情', 1)"
        >
          <div class="p-2">发表情1</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('发表情', 2)"
        >
          <div class="p-2">发表情2</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('发表情', 3)"
        >
          <div class="p-2">发表情3</div>
        </div>

        <div class="cursor-pointer rounded-full" @click="ChangeScene('scene1')">
          <div class="p-2">签到厅</div>
        </div>
        <div class="cursor-pointer rounded-full" @click="ChangeScene('scene2')">
          <div class="p-2">会议厅</div>
        </div>
        <div class="cursor-pointer rounded-full" @click="ChangeScene('scene3')">
          <div class="p-2">演唱会</div>
        </div>

        
        <div class="cursor-pointer rounded-full" @click="ClickInterface('主动断开')">
          <div class="p-2">主动断开</div>
        </div>
      </div>

      <div class="flex"></div>

      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('荧光棒', 1)"
        >
          <div class="p-2">拿荧光棒1</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('荧光棒', 2)"
        >
          <div class="p-2">拿荧光棒2</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('荧光棒', 3)"
        >
          <div class="p-2">拿荧光棒3</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('荧光棒')"
        >
          <div class="p-2">取消荧光棒</div>
        </div>

        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('全屏播放')"
        >
          <div class="p-2">全屏播放</div>
        </div>
      </div>

      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 1)"
        >
          <div class="p-2">拿灯牌1</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 2)"
        >
          <div class="p-2">拿灯牌2</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 3)"
        >
          <div class="p-2">拿灯牌3</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 4)"
        >
          <div class="p-2">拿灯牌4</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 5)"
        >
          <div class="p-2">拿灯牌5</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 6)"
        >
          <div class="p-2">拿灯牌6</div>
        </div>
      </div>

      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 7)"
        >
          <div class="p-2">拿灯牌7</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 8)"
        >
          <div class="p-2">拿灯牌8</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 9)"
        >
          <div class="p-2">拿灯牌9</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 10)"
        >
          <div class="p-2">拿灯牌10</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 11)"
        >
          <div class="p-2">拿灯牌11</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 12)"
        >
          <div class="p-2">拿灯牌12</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌', 13)"
        >
          <div class="p-2">拿灯牌13</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('灯牌')"
        >
          <div class="p-2">取消灯牌</div>
        </div>
      </div>

      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换男角色演唱会', 1)"
        >
          <div class="p-2">换男角色演唱会1</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换男角色演唱会', 2)"
        >
          <div class="p-2">换男角色演唱会2</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换男角色演唱会', 3)"
        >
          <div class="p-2">换男角色演唱会3</div>
        </div>
      </div>

      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换女角色演唱会', 1)"
        >
          <div class="p-2">换女角色演唱会1</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换女角色演唱会', 2)"
        >
          <div class="p-2">换女角色演唱会2</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('换女角色演唱会', 3)"
        >
          <div class="p-2">换女角色演唱会3</div>
        </div>
      </div>
    </div>

    <div class="hidden mt-4 h-auto flex-col text-base space-y-2">
      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('全员荧光棒', 1)"
        >
          <div class="p-2">全员拿荧光棒</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('全员荧光棒')"
        >
          <div class="p-2">全员取消荧光棒</div>
        </div>
      </div>
      <div class="flex"></div>

      <div class="flex"></div>

      <div class="flex">
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('气球雨', 1)"
        >
          <div class="p-2">气球雨1</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('气球雨', 2)"
        >
          <div class="p-2">气球雨2</div>
        </div>
        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('气球雨')"
        >
          <div class="p-2">取消气球雨</div>
        </div>

        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('播放烟花')"
        >
          <div class="p-2">播放烟花</div>
        </div>

        <div
          class="cursor-pointer rounded-full"
          @click="ClickInterface('视频下线')"
        >
          <div class="p-2">视频下线</div>
        </div>
      </div>
    </div>
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

      inDriving: false,
      inCallDriving: false,
      callDrivingLater: null,
    };
  },
  created() {},
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
      if (title == "发表情") {
        _Global.SetPlayerExpression(content);
      }
      if (title == "做动作") {
        _Global.SetPlayerAnim(content);
        _Global.DelDengPai();
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

      if (title == "灯牌") {
        _Global.PickDengPai(e);
      }

      if (title == "换男角色") {
        _Global.ChangeAvatar(
          e == 1 ? "maleHair1" : e == 2 ? "maleHair2" : "maleHair3"
        );
      }

      if (title == "换男角色演唱会") {
        _Global.ChangeAvatar(
          e == 1 ? "malelook1" : e == 2 ? "malelook2" : "malelook3"
        );
      }

      if (title == "换女角色") {
        _Global.ChangeAvatar(
          e == 1 ? "femaleHair1" : e == 2 ? "femaleHair2" : "femaleHair3"
        );
      }
      if (title == "换女角色演唱会") {
        _Global.ChangeAvatar(
          e == 1 ? "femalelook1" : e == 2 ? "femalelook2" : "femalelook3"
        );
      }

      if (title == "全员鼓掌") {
        _Global.AllHandClap(e == 1);
      }

      if (title == "气球雨") {
        _Global.BalloonRain(e != undefined, e);
      }

      if (title == "播放烟花") {
        _Global.PlayFireWorks();
      }

      if (title == "全员落座") {
        _Global.AllSitting(e == 1);
      }

      if (title == "全屏播放") {
        _Global.SetVideoFullScreen();
      }

      if (title == "视频下线") {
        _Global.ChangeAcivityPosition({
          PosType: 9,
          ContentType: 2,
          PosStatus: 2,
        });
      }

      if (title == "主动断开") {
        _Global.SelfCloseConnect();
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
