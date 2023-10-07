
// ChatGPT 聊天对话框
<template>
  <!-- 头像 -->
  <div v-if="display" id="panel" class=" pointer-events-auto absolute left-0 top-0 w-full h-full flex flex-col  bg-gradient-to-b
                                                      from-purple-50
                                                      to-gray-200   text-white   ">
    <div class=" absolute top-2 right-2 w-10 h-10 rounded-full flex cursor-pointer" @click="ClickClose">
      <!-- <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/tc.png'" alt=""> -->
      <!-- <div class=" self-center mx-auto ">X</div> -->
    </div>

    <div class=" flex w-full h-full ">

      <!-- 左 -->
      <div class=" w-1/4 hidden md:flex  flex-col h-full  text-white ">
        <div class=" mt-4   ">
          <div
            class=" inline-block leading-4 bg-black  text-lg rounded-full shadow-lg px-8 py-4 self-center cursor-pointer "
            @click="display = false;">
            回到场景
          </div>
        </div>
        <div class=" mt-6   ">
          <div class=" inline-block leading-4 text-black font-bold text-xl   self-center   ">
            {{ chatGPTNAME }}
          </div>
        </div>
        <!-- 右侧角色模型展示 -->
        <div class="    w-full  h-5/6 overflow-hidden   ">
          <playerSelect3DPanel id="contain" class=" w-full h-full " ref="playerSelect3DPanel"></playerSelect3DPanel>
        </div>
      </div>

      <!-- 中 -->
      <div class=" w-1/3 origin-bottom-left flex-grow h-auto  relative   ">

        <div class=" absolute left-0 bottom-20 flex  w-full  h-auto  ">

          <div ref="roomChateRecode"
            class="  mx-auto max-w-6xl w-full text-black  xl:w-full h-auto origin-bottom-left  overflow-y-auto overscroll-auto"
            :style="'max-height:' + height + 'px'">
            <div v-for="(item, i) in chatRecodeList" :key="i" :index="item.id"
              class=" text-lg mb-2  h-auto text-left break-all ">
              <!-- 自己 -->
              <div v-if="item.id == 0" class=" chatContent   flex flex-col leading-8 px-10 relative">
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
              <div v-if="item.id == 1" class=" chatContent  flex flex-col leading-8 rounded-xl px-10">
                <div class=" flex ">
                  <div class=" hidden mr-2 flex-shrink-0  w-12 h-12 ">
                    <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/gpt.png'" alt="">
                  </div>
                  <div
                    class=" max-w-2xl w-auto  px-4 py-2 text-left   bg-white shadow-sm  rounded-r-3xl rounded-bl-3xl rounded-lg  ">
                    {{ item.content }}
                  </div>
                </div>
              </div>
              <!-- date 日期分割 -->
              <div v-if="item.id == 2" class=" chatContent  flex flex-col leading-8 rounded-xl px-10">
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
                                                                                          resize-none" id=""
              :rows="textareaRows" wrap="soft" placeholder="Aa" v-model="currentChatStr" :style="textareaStyle"
              @onkeydown="checkEnter(event)" @input="InputTextarea" @focus="removeThreeJSfocus"></textarea>
          </div>


        </div>
      </div>

      <!-- 右 商店、日记、记忆 -->
      <div class=" hidden md:flex  w-1/4  h-full   flex-col  ">
        <div class=" h-20"></div>
        <div class=" w-full h-5/6 self-center text-lg text-black flex flex-col gap-2 ">
          <div v-for="(item, i) in rightList" :key="i" :index="item.title"
            class=" text-lg mb-2  h-auto text-left break-all ">
            <div class=" w-11/12 h-72 mx-auto rounded-3xl flex flex-col border bg-gray-100 shadow-md">

              <div class=" w-full px-5 mx-auto text-center flex justify-between h-10 leading-10 mt-4">
                <div class=" font-bold">{{ item.title }}</div>
                <div class=" text-gray-600 cursor-pointer ">See all ></div>
              </div>
              <div v-if="item.data.length == 0" v-html="item.tip"
                class=" break-words  self-center pt-10 text-gray-400 w-2/3 h-32 text-center text-2xl">
              </div>
              <div v-if="item.data.length > 0" class=" flex mx-auto pt-5 ">
                <div v-for="(item2, i2) in item.data" :key="i2"
                  class=" origin-bottom transform text-base text-left break-all  ">
                  <div
                    class=" cursor-pointer transform w-24 h-24 xl:w-40 xl:h-40 mx-auto rounded-3xl flex flex-col border bg-gray-100 shadow-md"
                    :class="
                      item.data.length == 1 ? '' : '',
                      item.data.length == 2 ? i2 == 0 ? ' -rotate-2' : i2 == 1 ? 'rotate-2' : '' : '',
                      item.data.length == 3 ? i2 == 0 ? ' translate-x-1/3 translate-y-2 -rotate-6' : i2 == 1 ? ' -translate-x-1/6 ' : i2 == 2 ? ' -translate-x-1/3 translate-y-3 rotate-6' : '' : ''
                    ">
                    <div class=" w-full px-1 mx-auto text-center flex justify-between h-10 leading-10 ">
                      <div class=" ">{{ item2.title }}</div>
                    </div>
                    <div class=" w-full h-32 px-2">
                      <div class=" w-full h-24 block text-gray-600 text-start  item  ">
                        {{ item2.content }}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

//角色动作数据
import PlayerAnimData from "../data/playerAnimSetting.js";
import playerSelect3DPanel from "./playerSelect3DPanel.vue";
export default {
  name: "chatgpt001",
  components: {
    playerSelect3DPanel,
  },
  data() {
    return {
      display: false,
      // display: true,
      currentChatStr: "",
      // currentChatStr: "sdfsdsdfsdsdfsdsdfsdfsdsdfsdsdfsdsdfdsdfsdsdfsdsdfsdsdfsdsdfd",
      chatRecodeList: [
        // { id: 0, content: 'sdfsd', date: "2023-3-28 11:31:44" },
        // { id: 1, content: 'sdfsdsdfsdsdfsdsdfsdsdfdsdfsdsdfsdsdfsdsdfsdsdfdsdfsdsdfsdsdfsdsdfsdsdfd', date: "2023-3-28 11:31:44" },
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
      // 聊天内容高度
      height: 400,
      textareaStyle: "",
      textareaRows: 1,
      id: '',
      parentMessageId: '',
      publicUrl: './public/farm/',
      selectPlayerName: "小孩",
      chatGPTNAME: "ChatGPT001号",

      isLoaded: false,
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

    if (this.display) {
      this.LoadAvatar();
    }

    if (localStorage.getItem("parentMessageId") != undefined) {
      this.parentMessageId = localStorage.getItem("parentMessageId");
    }
    // setTimeout(() => {
    //   this.InitStory();
    // }, 1000);
  },
  methods: {

    LoadAvatar() {
      // if(this.isLoaded){
      //   return;
      // }

      this.isLoaded = true;
      this.$refs.playerSelect3DPanel.SetPlayerAnimData(PlayerAnimData.avatarData);
      this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);


      setTimeout(() => {

        this.skinData = this.GetAvatarData(this.selectPlayerName).skinData;
        if (this.skinData != undefined && this.skinData.length > 1) {
          setTimeout(() => {
            this.UpdateSkin(localStorage.getItem("playerState"));
          }, 100);
        } else {
          this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
        }

      }, 100);
    },

    UpdateSkin(playerState) {
      if (playerState == null || playerState == undefined) {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
        return;
      }

      let sp = playerState.split('_');
      for (let i = 0; i < this.skinData.length; i++) {
        this.skinData[i].selected = parseInt(sp[i]);
      }

      let mode = "";
      let part = "";
      let targetPath = "";

      let faceSourcePath = "";
      let faceAddPath = "";

      for (let i = 0; i < this.skinData.length; i++) {
        const element = this.skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }
      }


      for (let i = 0; i < this.skinData.length; i++) {
        const element = this.skinData[i];
        if (element.title == "eye") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
          this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, "Face", element.mode, faceSourcePath);
          this.$refs.playerSelect3DPanel.ChangeSkin(faceAddPath, "Face", "addTexture", faceSourcePath);
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
      }


      setTimeout(() => {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
      }, 200);

    },
    GetAvatarData(playerName) {
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      return [];
    },
    GetPublicUrl() {
      return this.publicUrl;
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
        '/chatgpt',
        // this.$GPTURL,
         {
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
      return;
      this.$parent.$refs.YJmetaBase.removeThreeJSfocus();
    },
    addThreeJSfocus() {
      this.$parent.$refs.YJmetaBase.addThreeJSfocus();
    },
    SetDisplay(b) {
      this.display = b;

      if (b) {
        this.$nextTick(() => {
          this.LoadAvatar();
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
      
      this.chatRecodeList.push({ id: 0, content: this.currentChatStr, date: this.$formatDate() });
      let searchChat = this.currentChatStr;
      this.currentChatStr = "";

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
        prompt: searchChat,
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
        if(!has){
          this.chatRecodeList.push({ id: 1, content: text, date: this.$formatDate() });
        }
        setTimeout(() => {
          this.$refs.roomChateRecode.scrollTop =
            this.$refs.roomChateRecode.scrollHeight;
        }, 20);
      } else {
      }
      console.log(res);
    },
  },
};
</script>
 
<style scoped>
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