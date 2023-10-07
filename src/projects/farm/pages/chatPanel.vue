
// ChatGPT 聊天对话框
<template>
  <!-- 头像 -->
  <div v-if="display" id="panel"
    class=" pointer-events-auto absolute left-0 top-0 w-full h-full p-5 flex flex-col rounded-xl bg-gray-100 bg-opacity-70 text-white origin-top-left  ">
    <div class=" absolute top-2 right-2 w-10 h-10 rounded-full flex cursor-pointer" @click="ClickClose">
      <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/tc.png'" alt="">
      <!-- <div class=" self-center mx-auto ">X</div> -->
    </div>
    <div class=" h-7 self-center text-center text-black">正在与 ChatGPT001号 聊天</div>
    <div class=" flex-grow  ">

      <div ref="roomChateRecode" class=" w-full text-black  xl:w-full h-auto  overflow-y-auto overscroll-auto"
        :style="'max-height:' + height + 'px'">
        <div v-for="(item, i) in chatRecodeList" :key="i" :index="item.id" class=" mb-2  h-auto text-left break-all ">
          <!-- 自己 -->
          <div v-if="item.id == 0" class=" chatContent flex flex-col leading-5 px-10 relative">
            <div class=" flex flex-row-reverse ">
              <div class=" ml-2 flex-shrink-0   w-12 h-12">
                <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/touxiang.png'" alt="">
              </div>
              <div class=" text-left p-2  bg-white rounded-lg border-2 border-gray-200 ">
                {{ item.content }}
              </div>
            </div>

            <div class=" text-right p-2  opacity-0  hover:opacity-100 ">
              {{ item.date }}
            </div>
          </div>
          <!-- GPT -->
          <div v-if="item.id == 1" class=" chatContent flex flex-col  rounded-xl px-10">
            <div class=" flex ">
              <div class=" mr-2 flex-shrink-0  w-12 h-12 ">
                <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/gpt.png'" alt="">
              </div>
              <div class=" p-2  bg-white rounded-lg border-2 border-gray-200  ">
                {{ item.content }}
              </div>
            </div>

            <div class=" text-left p-2 opacity-0  hover:opacity-100 ">
              {{ item.date }}
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class=" w-11/12 mx-auto h-10 p relative ">

      <div class=" absolute left-0 top-0 z-20 w-full flex ">
        <input ref="roomInput"
          :style="'background-image:url(' + publicUrl + 'images/chatPanel/duihuakuang.png) ; background-size: contain;background-repeat: no-repeat;'"
          class="  mx-auto  
                                               max-w-lg    w-full pl-4 h-5 md:h-10
                                                          text-left
                                                         text-xs md:text-base
                                                          align-top
                                                          outline-none
                                                          bg-transparent 
                                                          placeholder-gray-400
                                                          text-black
                                                          resize-none
                                                        " type="text" placeholder="请输入聊天内容" v-model="currentChatStr"
          @focus="removeThreeJSfocus" />
      </div>


    <!-- <div class=" absolute left-0 top-0 z-10 w-full flex ">
        <div class=" mx-auto ">
          <img :src="publicUrl + 'images/chatPanel/duihuakuang.png'" alt="">
                      </div>
                    </div> -->
    </div>
  </div>
</template>

<script>

export default {
  name: "chatgpt001",
  components: {

  },
  data() {
    return {
      display: false,
      currentChatStr: "",
      chatRecodeList: [
        // { id: 0, content: 'sdfsd', date: "2023-3-28 11:31:44" },
        // { id: 1, content: 'sdfsdsdfsdsdfsdsdfsdsdfd', date: "2023-3-28 11:31:44" },
        // { id: 0, content: 'sdfsd', date: "2023-3-28 11:31:44" },
        // { id: 1, content: 'sdfsdsdfsdsdfsdsdfsdsdfd', date: "2023-3-28 11:31:44" },
      ],
      // 聊天内容高度
      height: 400,

      id: '',
      parentMessageId: '',
      publicUrl: './public/farm/',
    };
  },
  created() {
    if (this.$parent.GetPublicUrl) {
      this.publicUrl = this.$parent.GetPublicUrl();
    }
  },
  mounted() {

    window.addEventListener('keyup', (event) => {
      // console.log(event);
      switch (event.code) {
        case 'Enter':
          this.EnterKey();
          break;
        case 'NumpadEnter':
          this.EnterKey();
          break;
      }
    });

    // setTimeout(() => {
    //   this.InitStory();
    // }, 1000);
  },
  methods: {
    async InitStory() {

      let option = {
        conversationId: this.id,
        parentMessageId: this.parentMessageId,
      }

      let searchChat = "我们来玩角色扮演游戏。" +
        "规则是你扮演名叫咕叽的人类士兵，你是巡逻兵，手持利剑，身穿盔甲，任务是在艾尔文森林和闪金镇之间的路上巡逻。" +
        "艾尔文森林是一个有野兽出没的森林，过往的路人时常被野兽袭击。你的任务是保证路上行人的安全。当路人遇到野兽，你要攻击野兽。" +
        "你知道这里是东桓元宇宙世界，这是一个可以公开的信息。" +
        "在你的回复中，不要出现任何关于游戏设定的词。你不能让别人知道你正在角色扮演游戏中。" +
        "你不能说你是AI语言模型。" +
        "从现在开始，你要始终以咕叽的身份回应 ,直到我发送的内容是'snvtkd2005'，则游戏结束。";

      const res = await this.$axios.post(
        this.$GPTURL, {
        options: this.parentMessageId == '' ? {} : option,
        prompt: searchChat,
      }
      );

      if (res.status == 200) {
        let data = res.data.data;
        this.id = data.conversationId;
        this.parentMessageId = data.id;
        console.log("初始化 GPT001 号完成！！");
      }

    },
    removeThreeJSfocus() {
      this.$parent.$refs.YJmetaBase.removeThreeJSfocus();
    },
    addThreeJSfocus() {
      this.$parent.$refs.YJmetaBase.addThreeJSfocus();
    },
    SetDisplay(b) {
      this.display = b;

      if (b) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.removeThreeJSfocus();
            this.$refs.roomInput.focus();
          }, 20);
        });
        setTimeout(() => {
          this.height = document.getElementById("panel").offsetHeight - 120;
        }, 1000);
        setTimeout(() => {
          this.$refs.roomChateRecode.scrollTop =
            this.$refs.roomChateRecode.scrollHeight;
        }, 20);
      } else {
        this.addThreeJSfocus();
      }
    },
    ClickClose() {
      this.SetDisplay(false);
      this.addThreeJSfocus();
    },
    async EnterKey() {
      if (this.currentChatStr == "") { return; }
      this.chatRecodeList.push({ id: 0, content: this.currentChatStr });
      let searchChat = this.currentChatStr;
      this.currentChatStr = "";


      setTimeout(() => {
        this.$refs.roomChateRecode.scrollTop =
          this.$refs.roomChateRecode.scrollHeight;
      }, 20);




      let option = {
        conversationId: this.id,
        parentMessageId: this.parentMessageId,
      }


      // const res = await this.$axios.post(
      //   "/chatgpt/chat", {
      //   options: this.parentMessageId == '' ? {} : option,
      //   prompt: "测试",
      // }
      // );

      const res = await this.$axios.post(
        this.$GPTURL, {
        options: this.parentMessageId == '' ? {} : option,
        prompt: searchChat,
      }
      );


      if (res.status == 200) {
        let data = res.data.data;

        let text = data.text;

        this.id = data.conversationId;
        this.parentMessageId = data.id;

        this.chatRecodeList.push({ id: 1, content: text, date: this.$formatDate() });
        setTimeout(() => {
          this.$refs.roomChateRecode.scrollTop =
            this.$refs.roomChateRecode.scrollHeight;
        }, 20);
      }
      console.log(res);
    },
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
</style>