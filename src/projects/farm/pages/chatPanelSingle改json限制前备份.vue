
// ChatGPT 聊天对话框
<template>
  <!-- 头像 -->
  <div v-if="display" id="panel" class=" pointer-events-auto absolute left-0 top-0 w-full h-full flex flex-col  bg-gradient-to-b
                   from-purple-50
                   to-gray-200   text-white   ">

    <!-- 背景 -->
    <div class=" z-auto absolute left-0 top-0 w-full h-full">
      <img class=" w-full h-full " :src="publicUrl + bgPath" alt="">
    </div>

    <!-- 树 -->
    <img class=" absolute left-0 top-0   origin-top-left transform scale-170 opacity-30  " :src="publicUrl + shuPath" />
    <!-- 草 -->
    <div class=" absolute right-0 bottom-0 origin-bottom-right transform scale-160 opacity-80 ">
      <img :src="publicUrl + caoPath" />
    </div>


    <div class=" absolute z-10 flex w-full h-full  overflow-hidden ">

      <!-- 左 -->
      <div class=" w-1/4 hidden md:flex  flex-col h-full  text-white relative ">
        <div class="  mt-4   w-full  h-full overflow-hidden   ">
          <div class=" absolute right-2 -bottom-6 ml-24   ">
            <div class=" inline-block leading-4 text-white font-bold text-xl   self-center   ">
              {{ chatGPTNAME }}
            </div>
            <img class="  " ref="videoGPT " :src="publicUrl + currentChatAnimPath" />
          </div>
        </div>

      <!-- <div class="  absolute right-0 bottom-20   ">
          <div class="  rounded-full w-20 h-20 ">
            <video class=" w-full h-full rounded-full " :src="publicUrl+'videos/糖糖.mp4'" autoplay muted></video>
                                                                                                        </div>
                                                                                                      </div> -->
      </div>

      <!-- 中 -->
      <div class=" w-1/3 origin-bottom-left flex-grow h-auto  relative   ">

        <div class=" absolute left-0 bottom-20 flex  w-full  h-auto  ">

          <div ref="roomChateRecode"
            class="  mx-auto max-w-6xl w-full text-black  xl:w-full h-auto origin-bottom-left  overflow-y-auto overscroll-auto"
            :style="'max-height:' + height + 'px'">
            <div v-for="(item, i) in chatRecodeList" :key="i" :index="item.id"
              class=" text-sm md:text-lg leading-5 md:leading-8 mb-2  h-auto text-left break-all ">
              <!-- 自己 -->
              <div v-if="item.id == 0" class=" chatContent   flex flex-col  px-10 relative">
                <div class=" flex flex-row-reverse ">
                  <div class=" hidden ml-2 flex-shrink-0   w-12 h-12">
                    <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/touxiang.png'" alt="">
                  </div>
                  <div
                    class=" max-w-2xl  w-auto  px-4 py-2 text-left text selfChatBg shadow-sm  rounded-l-3xl rounded-tr-3xl rounded-lg ">
                    {{ item.content }}
                  </div>
                </div>
              </div>
              <!-- GPT -->
              <div v-if="item.id == 1" class=" chatContent  flex flex-col  rounded-xl px-10">
                <div class=" flex ">
                  <div class=" hidden mr-2 flex-shrink-0  w-12 h-12 ">
                    <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/gpt.png'" alt="">
                  </div>

                  <!-- v-html="item.content" -->
                  <div
                    class=" max-w-2xl w-auto  px-4 py-2 text-left   bg-white shadow-sm  rounded-r-3xl rounded-bl-3xl rounded-lg  ">
                    {{ item.content }}
                  </div>
                </div>
              </div>
              <!-- date 日期分割 -->
              <div v-if="item.id == 2" class=" chatContent  flex flex-col rounded-xl px-10">
                <div class=" text-center p-2 text-gray-700 ">
                  {{ item.date }}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class=" absolute bottom-4 w-full mx-auto h-auto flex   ">

          <div class="  max-w-4xl w-5/6 py-2 bg-gray-400 h-auto rounded-3xl flex mx-auto ">
            <textarea ref="roomInputtextarea" class="  mx-auto  self-end
                    w-full pl-8 pr-6 h-auto
                             text-left
                            text-xs md:text-base
                             outline-none
                             bg-transparent 
                             placeholder-gray-200
                             text-white overflow-hidden overflow-y-scroll
                             resize-none" id="" :rows="textareaRows" wrap="soft" placeholder="Aa"
              v-model="currentChatStr" :style="textareaStyle" @compositionstart="compositionstart()"
              @compositionend="compositionend()" @onkeydown="checkEnter(event)" @input="InputTextarea"
              @focus="removeThreeJSfocus"></textarea>
          </div>


        </div>
      </div>

    </div>
  </div>

  <!-- 左侧小头像 -->
  <div class=" absolute z-50 left-4 bottom-20 w-20 h-20">
    <img class=" w-full h-full rounded-full bg-gray-300 p-1 cursor-pointer " :src="publicUrl + chatAnim[chatIndex].icon"
      @click="CallSelectChat()">
  </div>


  <div v-if="inSelectPanel" class=" absolute z-50 left-24 bottom-32 ">
    <div class=" flex h-40  gap-4  ">
      <div v-for="(item, i) in chatAnim" :key="i" :index="item.name"
        class=" w-24 h-24 text-sm md:text-lg leading-5 md:leading-8 mb-2 text-left break-all ">
        <div class=" w-full h-full">
          <img class=" w-full h-full rounded-full bg-gray-300 p-1 hover:bg-blue-300 cursor-pointer "
            :src="publicUrl + item.icon" @mouseover="SelectChatPreview(i)" @click="SelectChat(i)">
        </div>
      </div>
    </div>
  </div>

  <div v-if="chatPreviewIndex != -1" class=" absolute z-50 left-0 top-0 h-full w-full flex pointer-events-none ">
    <div class=" flex h-1/2 w-1/2 overflow-hidden rounded-2xl   self-center mx-auto bg-black bg-opacity-50  text-white ">
      <div class=" w-full h-full flex ">
        <div class="  ">
          <img class=" w-auto h-full p-1 cursor-pointer " :src="publicUrl + chatAnim[chatPreviewIndex].anim[0].path">
        </div>
        <div class=" pt-20 text-sm md:text-lg leading-5 md:leading-8 mb-2 text-left break-all ">
          <div>{{ chatAnim[chatPreviewIndex].story }} </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>

//角色故事数据
import ChatStoryData from "../data/chatStoryData.js";

export default {
  name: "chatgpt001",
  components: {
  },
  data() {
    return {
      needLogin: false,
      // display: false,
      display: true,
      currentChatStr: "",
      // currentChatStr: "sdfsdsdfsdsdfsdsdfsdfsdsdfsdsdfsdsdfdsdfsdsdfsdsdfsdsdfsdsdfd",
      chatRecodeList: [
        // { id: 0, content: 'sdfsd', date: "2023-3-28 11:31:44" },
        // { id: 1, content: "'<p>感谢您的回复，我会尽快为您提供答案。😊</p> ' ", date: "2023-3-28 11:31:44" },
        // { id: 2, date: "2023-3-28 11:31" },
      ],
      rightList: [
        // {
        //   title: "Store", data: [
        //     { title: "", content: "鞋子" },
        //     { title: "", content: "冰淇淋" },
        //   ]
        // },
        {
          title: "Diary", data: [
            { title: "日记1", content: "今天是我们认识的第一天" },
            { title: "日记2", content: "今天是我们认识的第二天" },
            { title: "日记3", content: "今天是我们认识的第三天今天是我们认识的第三天今天是我们认识的第三天今天是我们认识的第三天" },
          ]
        },
        {
          title: "Memory", tip: "Facts about you will be <br/> shown here",
          data: [
            { title: "记忆1", content: "今天是我们认识的第一天" },

          ]
        },
      ],

      chatAnim: [
        {
          name: "云烟",
          icon: "images/chatPanel/云烟_icon.png",
          small: "images/chatPanel/云烟_small.png",
          story: "我是云烟，一位穿着汉服的、可爱美丽的女孩",
          anim: [
            { animName: "idle", path: "images/chatPanel/gif/daiji.gif" },
            { animName: "speakBefore", path: "images/chatPanel/gif/shuohuaBefore.gif" },
            { animName: "speak", path: "images/chatPanel/gif/shuohua.gif" },
            { animName: "smile", path: "images/chatPanel/gif/daxiao.gif" },
            { animName: "smileKeep", path: "images/chatPanel/gif/daxiaoKeep.gif" },
          ]
        },
        {
          name: "凌霄",
          icon: "images/chatPanel/凌霄_icon.png",
          small: "images/chatPanel/凌霄_small.png",
          story: "我是凌霄",
          anim: [
            { animName: "idle", path: "images/chatPanel/gifMan/daiji.gif" },
            { animName: "speakBefore", path: "images/chatPanel/gifMan/shuohuaBefore.gif" },
            { animName: "speak", path: "images/chatPanel/gifMan/shuohua.gif" },
            { animName: "smile", path: "images/chatPanel/gifMan/daxiao.gif" },
            { animName: "smileKeep", path: "images/chatPanel/gifMan/daxiaoKeep.gif" },
          ]
        },
      ],
      chatIndex: 0,
      chatPreviewIndex: -1,
      inSelectPanel: false,

      bgPath: "images/chatPanel/bg.png",
      currentChatAnimPath: "images/chatPanel/gif/daiji.gif",

      shuPath: "images/chatPanel/gif/shu.gif",
      caoPath: "images/chatPanel/gif/cao.gif",

      // 聊天内容高度
      height: 400,
      textareaStyle: "",
      textareaRows: 1,
      id: '',
      parentMessageId: '',
      publicUrl: './public/farm/',
      selectPlayerName: "小孩",
      chatGPTNAME: "云烟",
      // chatGPTNAME: "凌霄",

      isLoaded: false,
      replying: false,
      searchChat: "",
      compositionEnd: true,
      enterKeyUp: true,
    };
  },
  created() {
    if (this.$parent.GetPublicUrl) {
      this.publicUrl = this.$parent.GetPublicUrl();
    }

    this.height = window.innerHeight - 120;
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


    // if (localStorage.getItem("parentMessageId") != undefined) {
    //   this.parentMessageId = localStorage.getItem("parentMessageId");
    // }

    return;


    if (localStorage.getItem("chatIndex") != undefined) {
      this.SelectChat(parseInt(localStorage.getItem("chatIndex")));
    } else {
      setTimeout(() => {
        this.InitStory(() => {
          this.$refs.roomInputtextarea.focus();
        });
      }, 100);
    }

  },
  methods: {
    CallSelectChat() {
      this.inSelectPanel = !this.inSelectPanel;
      this.chatPreviewIndex = -1;
    },
    SelectChatPreview(e) {
      this.chatPreviewIndex = e;
    },
    // 选择角色后切换故事
    SelectChat(e) {
      this.inSelectPanel = false;
      this.chatPreviewIndex = -1;

      this.parentMessageId = "";

      this.chatIndex = e;
      localStorage.setItem("chatIndex", this.chatIndex);

      this.chatGPTNAME = this.chatAnim[this.chatIndex].name;
      this.currentChatAnimPath = this.loadAnimPath("idle");
      setTimeout(() => {
        this.InitStory(() => {
          this.$refs.roomInputtextarea.focus();
        });
      }, 100);
    },
    GetStroy(name) {
      for (let i = 0; i < ChatStoryData.modelsList.length; i++) {
        const element = ChatStoryData.modelsList[i];
        if (element.name == name) {
          return element.story;
        }
      }
    },

    loadAnimPath(animName) {
      for (let i = 0; i < this.chatAnim.length; i++) {
        const element = this.chatAnim[i];
        if (this.chatGPTNAME == element.name) {
          for (let ii = 0; ii < element.anim.length; ii++) {
            const ee = element.anim[ii];
            if (ee.animName == animName) {
              return ee.path;
            }
          }
        }
      }
    },
    async InitStory(callback) {
      this.chatRecodeList = [];

      let option = {
        conversationId: this.id,
        parentMessageId: this.parentMessageId,
      }

      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Accept': '*/*'
        },
      };

      let searchChat = this.GetStroy(this.chatGPTNAME);

      console.log(" 故事 ",searchChat);
      const res = await this.$axios.post(
        // "/chatgpt", 
        this.$GPTURL,
        {
          options: this.parentMessageId == '' ? {} : option,
          prompt: searchChat,
        }
      );




      if (res.status == 200) {
        let data = res.data.data;

        let text = data.text;

        this.chatRecodeList.push({ id: 1, content: text, date: this.$formatDate() });
       
        this.id = data.conversationId;
        this.parentMessageId = data.id;
        if (callback) {
          callback();
        }
        console.log(this.chatGPTNAME +  "初始化完成！！", res);
      }

    },

    compositionstart() {
      this.compositionEnd = false;
    },
    compositionend() {
      this.compositionEnd = true;
      console.log("结束输入");
    },
    checkEnter(event) {
      //兼容Chrome和Firefox
      event = (event) ? event : ((window.event) ? window.event : "");
      var keyCode = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
      var altKey = event.ctrlKey || event.metaKey;
      if (keyCode == 13 && altKey) { //ctrl+enter换行
        var newDope = $(this).val() + "\n";// 获取textarea数据进行 换行
        $(this).val(newDope);
      } else if (keyCode == 13) { //enter发送
        event.preventDefault();//禁止回车的默认换行
      }
    },
    InputTextarea(e) {
      this.textareaStyle = 'height: auto';
      this.$refs.roomInputtextarea.scrollTop = 0;
      this.textareaRows = Math.ceil(this.$refs.roomInputtextarea.scrollHeight / 24);
      if (this.textareaRows >= 5) {
        this.textareaRows = 5;
      }
      // this.textareaStyle = "height: "+ this.$refs.roomInputtextarea.scrollHeight+'px' ;
      // console.log(this.$refs.roomInputtextarea.scrollHeight);
      // console.log(this.textareaRows);
    },
    async EnterKey() {
      if (this.currentChatStr == "") { return; }
      // if(!this.compositionEnd){return;}
      // if(!this.enterKeyUp){return;}
      // if(this.enterKeyUp){
      //   this.enterKeyUp = false;
      // }




      if (this.replying) {
        this.chatRecodeList.splice(this.chatRecodeList.length - 1, 1);

        this.chatRecodeList.push({ id: 0, content: this.currentChatStr, date: this.$formatDate() });
        this.searchChat += this.currentChatStr;
        this.currentChatStr = "";

      } else {
        this.replying = true;
        this.chatRecodeList.push({ id: 0, content: this.currentChatStr, date: this.$formatDate() });
        this.searchChat = this.currentChatStr;
        this.currentChatStr = "";

      }

      setTimeout(() => {
        this.textareaRows = 1;

        this.$refs.roomChateRecode.scrollTop =
          this.$refs.roomChateRecode.scrollHeight;
      }, 20);




      let option = {
        conversationId: this.id,
        parentMessageId: this.parentMessageId,
      }

      // setTimeout(() => {
      // }, 500);
      this.chatRecodeList.push({ id: 1, content: "...", date: this.$formatDate() });

      // const res = await this.$axios.post(
      //   "/chatgpt/chat", {
      //   options: this.parentMessageId == '' ? {} : option,
      //   prompt: "测试",
      // }
      // );

      const res = await this.$axios.post(
        this.$GPTURL, {
        options: this.parentMessageId == '' ? {} : option,
        prompt: this.searchChat,
      }
      );


      if (res.status == 200) {
        let data = res.data.data;

        let text = data.text;

        this.id = data.conversationId;
        this.parentMessageId = data.id;

        localStorage.setItem("parentMessageId", this.parentMessageId);

        let has = false;
        for (let i = this.chatRecodeList.length - 1; i >= 0 && !has; i--) {
          const element = this.chatRecodeList[i];
          if (element.content == "...") {
            // this.chatRecodeList.splice(i, 1);
            element.content = text;
            has = true;
          }
        }
        if (!has) {
          this.chatRecodeList.push({ id: 1, content: text, date: this.$formatDate() });
        }

        // this.$refs.videoGPT.muted = false;
        // this.$refs.videoGPT.play();

        this.currentChatAnimPath = this.loadAnimPath("speakBefore");
        setTimeout(() => {
          this.currentChatAnimPath = this.loadAnimPath("speak");
          setTimeout(() => {
            this.currentChatAnimPath = this.loadAnimPath("idle");
            setTimeout(() => {
              this.currentChatAnimPath = this.loadAnimPath("smile");
              setTimeout(() => {
                this.currentChatAnimPath = this.loadAnimPath("smileKeep");
                setTimeout(() => {
                  this.currentChatAnimPath = this.loadAnimPath("idle");
                }, 3000);
              }, 625);
            }, 1000);
          }, 10000);
        }, 600);

        this.replying = false;
        setTimeout(() => {
          this.$refs.roomChateRecode.scrollTop =
            this.$refs.roomChateRecode.scrollHeight;
        }, 20);
      } else {
        this.replying = false;
        this.currentChatStr = "";
        setTimeout(() => {
          this.textareaRows = 1;

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
.scale-170 {
  --tw-scale-x: 2.65;
  --tw-scale-y: 2.65;
}

.scale-160 {
  --tw-scale-x: 1.15;
  --tw-scale-y: 1.15;
}

.item {
  /* font-size: 12px; */
  /* font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; */
  overflow: hidden;
  /* width: 280px; */
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  -webkit-line-clamp: 4;
  white-space: wrap;

}


.selfChatBg {
  background-color: rgb(254, 251, 247);
}



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


::-webkit-scrollbar {
  /* 滚动条整体部分 */
  /* width:0px; */
  border-radius: 10px;
  width: 10px;
  margin-right: 2px;
  /* display: block !important; */
  /* 控制滑动条是否显示 */
  /* display: none; */
}

::-webkit-scrollbar-button {
  /* 滚动条两端的按钮 */
  width: 10px;
  background-color: #adadad;
  display: none;
}

::-webkit-scrollbar:horizontal {
  height: 10px;
  margin-bottom: 2px;
}

::-webkit-scrollbar-track {
  /* 外层轨道 */
  border-radius: 10px;
  background-color: #cc5959;
  display: none;

}

::-webkit-scrollbar-track-piece {
  /*内层轨道，滚动条中间部分背景 */
  background-color: #ffffff;
  border-radius: 10px;
  display: none;

}

::-webkit-scrollbar-thumb {
  /* 滑块 */
  width: 10px;
  border-radius: 5px;
  background: #adadad79;

}

::-webkit-scrollbar-corner {
  /* 边角 */
  width: 10px;
  background-color: #cbcbcb;
  display: none;
}

::-webkit-scrollbar-thumb:hover {
  /* 鼠标移入滑块 */
  background: #adadad;
}
</style>