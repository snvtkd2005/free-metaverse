
// ChatGPT 聊天对话框
<template>
  <!-- 头像 -->
  <div v-if="display" id="panel"
    class=" pointer-events-auto absolute left-0 top-0 w-full h-full p-px flex flex-col rounded-xl bg-gray-100 bg-opacity-70 text-white origin-top-left  ">
    <div class=" absolute top-1 right-1 w-10 h-10 rounded-full flex cursor-pointer" @click="ClickClose">
      <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/tc.png'" alt="">
      <!-- <div class=" self-center mx-auto ">X</div> -->
    </div>
    <div class=" h-7 self-center text-center text-black">正在与 {{ npcName }} 聊天</div>
    <div class=" flex-grow py-2  ">

      <div ref="roomChateRecode" class=" mt-4 w-full text-black  xl:w-full h-auto  overflow-y-auto overscroll-auto"
        :style="'max-height:' + height + 'px'">
        <div v-for="(item, i) in chatRecodeList" :key="i" :index="item.id" class=" mb-2  h-auto text-left break-all ">
          <!-- 自己 -->
          <div v-if="item.id == 0" class=" chatContent flex flex-col leading-5 px-2 relative">
            <div class=" flex flex-row-reverse ">
              <div class=" ml-2 flex-shrink-0   w-12 h-12">
                <img class=" w-full h-full " :src="publicUrl + item.icon" alt="">
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
          <div v-if="item.id == 1" class=" chatContent flex flex-col  rounded-xl px-2">
            <div class=" flex ">
              <div class=" mr-2 flex-shrink-0  w-12 h-12 ">
                <img class=" w-full h-full " :src="publicUrl + item.icon" alt="">
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
                                                     max-w-lg    w-full pl-4 pb-2 h-5 md:h-10
                                                                text-left
                                                               text-xs md:text-base
                                                                align-top
                                                                outline-none
                                                                bg-transparent 
                                                                placeholder-gray-400
                                                                text-black
                                                                resize-none
                                                              " type="text" placeholder="请输入聊天内容"
          v-model="currentChatStr" @focus="removeThreeJSfocus" />
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

  components: {

  },
  data() {
    return {
      npcName: "",
      display: false,
      currentChatStr: "",
      chatRecodeList: [
        // { id: 0, content: 'sdfsd', date: "2023-3-28 11:31:44" },
        // { id: 1, content: 'sdfsdsdfsdsdfsdsdfsdsdfd', date: "2023-3-28 11:31:44" },
        // { id: 0, content: 'sdfsd', date: "2023-3-28 11:31:44" },
        // { id: 1, content: 'sdfsdsdfsdsdfsdsdfsdsdfd', date: "2023-3-28 11:31:44" },
      ],
      chatRecodeArray: [
        // {npcName:"",chatRecodeList:[]}
      ],
      // 聊天内容高度
      height: 400,

      id: '',
      parentMessageId: '',
      publicUrl: './public/farm/',
      userName: "",
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

    SetYJNPC(yjnpc, userName) {
      this.chatRecodeList = [];
      this.npcName = yjnpc.GetName();
      // console.log( this.chatRecodeArray, this.npcName);
      for (let i = 0; i < this.chatRecodeArray.length; i++) {
        const element = this.chatRecodeArray[i];
        if (element.npcName == this.npcName) {
          for (let ii = 0; ii < element.chatRecodeList.length; ii++) {
            this.chatRecodeList.push(element.chatRecodeList[ii]);

          }
        }
      }

      this._YJNPC = yjnpc;
      let userId = this._YJNPC.GetId();
      let icon = this._YJNPC.GetIcon();
      for (let i = 0; i < this.chatRecodeList.length; i++) {
        const element = this.chatRecodeList[i];
        if (element.id == 1 && element.userId == userId) {
          element.icon = icon;
        }
      }

      this.userName = userName;
      let data = {};
      data.from = userName;
      data.action = "idle";
      data.message = "你好!";

      this._YJNPC.SendMsg(JSON.stringify(data), (text) => {
      });
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
    AddRecode(npcName, recode) {
      let has = false;
      for (let i = 0; i < this.chatRecodeArray.length; i++) {
        const element = this.chatRecodeArray[i];
        if (element.npcName == npcName) {
          has = true;
        }
      }
      if (has) {
        for (let i = 0; i < this.chatRecodeArray.length; i++) {
          const element = this.chatRecodeArray[i];
          if (element.npcName == npcName) {
            element.chatRecodeList.push(recode);
          }
        }
      } else {
        let chatRecodeList = [];
        chatRecodeList.push(recode);
        this.chatRecodeArray.push({ npcName: npcName, chatRecodeList: chatRecodeList });
      }
    },
    async EnterKey() {
      if (this.currentChatStr == "") { return; }

      let userIcon = 'images/gameUI/' + this.$parent.avatarName + '.png';
      let recode = { id: 0, icon: userIcon, content: this.currentChatStr };
      this.chatRecodeList.push(recode);

      this.AddRecode(this.npcName, recode);

      let searchChat = this.currentChatStr;
      this.currentChatStr = "";


      setTimeout(() => {
        this.$refs.roomChateRecode.scrollTop =
          this.$refs.roomChateRecode.scrollHeight;
      }, 20);

      let data = {};
      data.from = this.userName;
      data.action = "idle";
      // data.message = "from是" + this.userName + "。" + searchChat + " 继续。";
      data.message = searchChat;

      this._YJNPC.SendMsg(JSON.stringify(data), (text) => {
        if (text == "" || text == null) { return; }
        let recode = { id: 1, userId: this._YJNPC.GetId(), icon: this._YJNPC.GetIcon(), content: text, date: this.$formatDate() };
        this.chatRecodeList.push(recode);
        this.AddRecode(this.npcName, recode);
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