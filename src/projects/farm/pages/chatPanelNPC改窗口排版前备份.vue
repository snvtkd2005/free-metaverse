
// ChatGPT 聊天对话框
<template>
  <!-- 头像 -->
  <div v-if="display" id="panel"
    class=" pointer-events-auto absolute left-0 top-0 w-full h-full p-5 flex flex-col rounded-xl bg-gray-100 bg-opacity-70 text-white origin-top-left  ">
    <div class=" absolute top-2 right-2 w-10 h-10 rounded-full flex cursor-pointer" @click="ClickClose">
      <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/tc.png'" alt="">
      <!-- <div class=" self-center mx-auto ">X</div> -->
    </div>
    <div class=" h-7 self-center text-center text-black">正在与 {{ npcName }} 聊天</div>
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
  props:['npcName'],
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
 
    this._YJNPC = null;
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

    SetYJNPC(e){
      this._YJNPC = e; 
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

      this._YJNPC.SendMsg(searchChat, (text) => {
        this.chatRecodeList.push({ id: 1, content: text, date: this.$formatDate() });
        setTimeout(() => {
          this.$refs.roomChateRecode.scrollTop =
            this.$refs.roomChateRecode.scrollHeight;
        }, 20);
      });
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