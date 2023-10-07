
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
          <!-- 提问 -->
          <div v-if="item.id == 0" class=" chatContent flex leading-5 px-10">
            <div class=" text-right pr-1 bg-white rounded-lg border-2 border-gray-400 ">
              {{ item.content }}
            </div>
            <div class=" ml-2">
              <img :src="publicUrl + 'images/chatPanel/touxiang.png'" alt="">
            </div>
          </div>
          <!-- 回答 -->
          <div v-if="item.id == 1" class=" chatContent flex bg-gray-200 rounded-xl px-10">
            <div>
              <img :src="publicUrl + 'images/chatPanel/gpt.png'" alt="">
            </div>
            <div class=" pr-1 flex-grow ">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class=" w-11/12 mx-auto h-10 p bg-white rounded-full relative ">

      <input ref="roomInput" class="
                                      w-full h-full px-4
                                            text-left
                                            align-top
                                            outline-none
                                            bg-transparent 
                                            placeholder-gray-400
                                            text-black
                                            resize-none
                                          " type="text" placeholder="请输入聊天内容" v-model="currentChatStr"
        @focus="removeThreeJSfocus" />

      <div class=" absolute left-0 top-0 -z-10 ">
        <img :src="publicUrl + 'images/chatPanel/duihuakuang.png'" alt="">
      </div>
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
        { id: 0, content: 'sdfsd' },
        { id: 1, content: 'sdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsdsdfsd' },
      ],
      // 聊天内容高度
      height: 400,

      id: '',
      parentMessageId: '',
      publicUrl: '',
    };
  },
  created() {
    this.publicUrl = this.$parent.GetPublicUrl();
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
  },
  methods: {
    removeThreeJSfocus() {
      this.$parent.$refs.YJmetaBase.removeThreeJSfocus();
    },
    addThreeJSfocus() {
      this.$parent.$refs.YJmetaBase.addThreeJSfocus();
    },
    SetDisplay(b) {
      this.display = b;

      if (b) {

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

        this.chatRecodeList.push({ id: 1, content: text });
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