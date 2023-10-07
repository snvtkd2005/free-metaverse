
// ChatGPT 聊天对话框
<template>
  <!-- 头像 -->
  <div v-if="display" id="panel"
    class=" pointer-events-auto absolute left-0 top-0 w-full h-full flex flex-col  bg-gradient-to-b
                                                                                                                                      from-purple-50
                                                                                                                                      to-gray-200   text-white   ">

    <div class=" hidden absolute top-2 right-2 w-10 h-10 rounded-full cursor-pointer" @click="ClickClose">
      <!-- <img class=" w-full h-full " :src="publicUrl + 'images/chatPanel/tc.png'" alt=""> -->
      <!-- <div class=" self-center mx-auto ">X</div> -->
    </div>
    <div class=" z-auto absolute left-0 top-0 w-full h-full">
      <img class=" w-full h-full " :src="publicUrl + bgPath" alt="">
    </div>

    <img class=" absolute left-0 top-0   origin-top-left transform scale-170 opacity-30  " :src="publicUrl + shuPath" />
  <!-- origin-top-right transform scale-150 -->
    <!-- <div class="   ">
      </div> -->
    <!-- <div class="  absolute left-0 top-0 w-48 h-48 bg-white opacity-25 ">
                                                            </div> -->

    <div class=" absolute right-0 bottom-0 origin-bottom-right transform scale-160 opacity-80 ">
      <img :src="publicUrl + caoPath" />
    </div>


    <div class=" absolute z-10 flex w-full h-full  overflow-hidden ">

      <!-- 左 -->
      <div class=" w-1/4 hidden md:flex  flex-col h-full  text-white relative ">
      <div class=" mt-4   ">
        <!-- <div
            class=" inline-block leading-4 bg-black  text-lg rounded-full shadow-lg px-8 py-4 self-center cursor-pointer "
            @click="display = false;">
                                                                                回到场景
                                                                              </div> -->

          <!-- inline-block -->
          <div
            class=" hidden  mb-4  leading-4 bg-black  text-lg rounded-full shadow-lg px-8 py-4 self-center cursor-pointer "
            @click="display = false;">
            购买点卡
          </div>
        </div>

      <!-- <div class=" mt-6   ">
          <div class=" inline-block leading-4 text-black font-bold text-xl   self-center   ">
            {{ chatGPTNAME }}
                                                                      </div>
                                                                    </div> -->

      <!-- 左侧角色模型展示 -->
      <!-- <div class="    w-full  h-5/6 overflow-hidden   ">
                                                                                          <playerSelect3DPanel id="contain" class=" w-full h-full " ref="playerSelect3DPanel"></playerSelect3DPanel>
                                                                                        </div> -->

      <!-- <div class="    w-full  h-5/6 overflow-hidden   ">
          <div class=" mt-4 ">
            <video ref="videoGPT" :src="publicUrl + 'videos/tt.mp4'" autoplay muted></video>
                                                                            </div>
                                                                          </div> -->



        <div class="    w-full  h-full overflow-hidden   ">
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
            <textarea ref="roomInputtextarea"
              class="  mx-auto  self-end
                                                                                                                                                                 w-full pl-8 pr-6 h-auto
                                                                                                                                                                          text-left
                                                                                                                                                                         text-xs md:text-base
                                                                                                                                                                          outline-none
                                                                                                                                                                          bg-transparent 
                                                                                                                                                                          placeholder-gray-200
                                                                                                                                                                          text-white overflow-hidden overflow-y-scroll
                                                                                                                                                                          resize-none"
              id="" :rows="textareaRows" wrap="soft" placeholder="Aa" v-model="currentChatStr" :style="textareaStyle"
              @compositionstart="compositionstart()" @compositionend="compositionend()" @onkeydown="checkEnter(event)"
              @input="InputTextarea" @focus="removeThreeJSfocus"></textarea>
          </div>


        </div>
      </div>

      <!-- 右 商店、日记、记忆 -->
      <div class=" hidden md:hidden  w-1/4  h-full   flex-col  ">
        <div class=" h-10"></div>

        <div class=" w-full h-5/6 self-center text-lg text-black flex flex-col gap-2 ">
          <div v-for="(item, i) in rightList" :key="i" :index="item.title"
            class=" text-lg mb-2  h-auto text-left break-all ">
            <div class=" w-11/12 h-72 mx-auto rounded-3xl flex flex-col border bg-gray-100 shadow-md overflow-hidden ">

              <div class=" w-full px-5 mx-auto text-center flex justify-between h-10 leading-10 mt-4">
                <div class=" font-bold">{{ item.title }}</div>
                <div class=" text-gray-600 cursor-pointer ">See all ></div>
              </div>
              <div v-if="item.data.length == 0" v-html="item.tip"
                class=" break-words  self-center pt-10 text-gray-400 w-2/3 h-32 text-center text-2xl">
              </div>
              <div v-if="item.data.length > 0" class=" flex mx-auto pt-5  ">
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

  <div v-if="needLogin" class=" absolute left-0 top-0 w-full h-full ">
    <login ref="loginPanel" />
  </div>
  <div v-if="needSelect" class=" z-50  absolute left-0 top-0 w-full h-full flex text-black bg-gray-100 overflow-hidden ">
    <div class=" w-1/3 gap-28 h-2/3 flex mx-auto self-center justify-between ">

      <div class=" h-full cursor-pointer " @click="SelectChat('凌霄')">
        <div class=" inline-block leading-4  font-bold text-xl   self-center   ">
          凌霄
        </div>
        <img class=" " ref="videoGPT " :src="publicUrl + 'images/chatPanel/gifMan/daiji.gif'" />
      </div>

      <div class=" h-full cursor-pointer  " @click="SelectChat('云烟')">
        <div class=" inline-block leading-4  font-bold text-xl   self-center   ">
          云烟
        </div>
        <img class=" transform scale-125  mt-40 " ref="videoGPT " :src="publicUrl + 'images/chatPanel/gif/daiji.gif'" />
      </div>
    </div>
  </div>

  <div class=" z-50 absolute left-0 top-0 ">
    <audio ref="playMp3" autoplay  id="playMp3" ></audio>

  </div>
</template>

<script>
import login from "./login/login.vue";

//角色动作数据
import PlayerAnimData from "../data/playerAnimSetting.js";

import ChatStoryData from "../data/chatStoryData.js";

import playerSelect3DPanel from "./playerSelect3DPanel.vue";

import request from "/@/utils/request_baidu";

export default {
  name: "chatgpt001",
  components: {
    playerSelect3DPanel,
    login,
  },
  data() {
    return {
      needSelect: false,
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
          anim: [
            { animName: "idle", path: "images/chatPanel/gifMan/daiji.gif" },
            { animName: "speakBefore", path: "images/chatPanel/gifMan/shuohuaBefore.gif" },
            { animName: "speak", path: "images/chatPanel/gifMan/shuohua.gif" },
            { animName: "smile", path: "images/chatPanel/gifMan/daxiao.gif" },
            { animName: "smileKeep", path: "images/chatPanel/gifMan/daxiaoKeep.gif" },
          ]
        },
      ],
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
    if (this.display) {
      this.LoadAvatar();
    }


    this.currentChatAnimPath = this.loadAnimPath("idle");

    // if (localStorage.getItem("parentMessageId") != undefined) {
    //   this.parentMessageId = localStorage.getItem("parentMessageId");
    // }

    if (this.needSelect) {

    } else {
      setTimeout(() => {
        this.InitStory(() => {
          this.$refs.roomInputtextarea.focus();
        });
      }, 100);
    }


  },
  methods: {
    SelectChat(e) {
      this.chatGPTNAME = e;
      this.currentChatAnimPath = this.loadAnimPath("idle");
      this.needSelect = false;
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
    async InitStory(callback) {

      let option = {
        conversationId: this.id,
        parentMessageId: this.parentMessageId,
      }



      let searchChat = this.GetStroy(this.chatGPTNAME);

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
        if (callback) {
          callback();
        }
        // console.log("初始化 GPT001 号完成！！");
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
    LoadAvatar() {
      // if(this.isLoaded){
      //   return;
      // }
      if (this.$refs.playerSelect3DPanel == undefined) { return; }

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
    async Text2Audio(text) {
      let config = {
        headers: {
          // "Accept": "application/json",
          "Content-Type": "application/json",
          'Accept': '*/*'
        },
      };

      // const getTok = await this.$axios.post(
        
      //   "/baidubce/oauth/2.0/token?client_id=LaMug2AZSWSqdMhXu95SG7wI&client_secret=iQXSBodBoDcAFneDt24d4foFqljpf4SB&grant_type=client_credentials",
      //   // "https://aip.baidubce.com/oauth/2.0/token?client_id=LaMug2AZSWSqdMhXu95SG7wI&client_secret=iQXSBodBoDcAFneDt24d4foFqljpf4SB&grant_type=client_credentials",
      //   "", config
      // );

      const getTok = await request.post(
        
        "/baidubce/oauth/2.0/token?client_id=LaMug2AZSWSqdMhXu95SG7wI&client_secret=iQXSBodBoDcAFneDt24d4foFqljpf4SB&grant_type=client_credentials",
        // "https://aip.baidubce.com/oauth/2.0/token?client_id=LaMug2AZSWSqdMhXu95SG7wI&client_secret=iQXSBodBoDcAFneDt24d4foFqljpf4SB&grant_type=client_credentials",
        "", config
      );

       

      console.log("获取token", getTok);

      let tok = getTok.access_token;
      // let tok = getTok.data.access_token;

      console.log("获取token", tok);

      // fromData.tex = "哈哈";
      // fromData.tok = "24.c7a38f70c74035f569d975f0db308c3b.2592000.1683443105.282335-32103087";
      // fromData.cuid = "sdfsdfs";
      // fromData.ctp = "1";
      // fromData.lan = "zh";


      // let fromData = new FormData();
      // fromData.append("tex", "哈哈");
      // fromData.append("tok", tok);
      // fromData.append("cuid", "sdfsdfsdfs");
      // fromData.append("ctp", 1);
      // fromData.append("lan", "zh");

      config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Accept': '*/*'
        },
      };

      // 百度短文本在线合成API https://cloud.baidu.com/doc/SPEECH/s/Gk38y8lzk
      // per  
      // 度小宇=1，度小美=0，度逍遥（基础）=3，度丫丫=4
      // 度逍遥（精品）=5003，度小鹿=5118 ，度博文=106，度小童=110，度小萌=111，度米朵=103，度小娇=5
      let params = "tex=" + text + "&tok=" + tok + "&cuid=" + "sdfsdfsdfs" +
        "&ctp=1&lan=zh" + "&per=" + (this.chatGPTNAME == '云烟'?4:5118);
      // let headers= {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //     'Accept': '*/*'
      //   }

      // const res = await this.$axios.post(
      //   // "/text2audio", 
      //   // "https://tsn.baidu.com/text2audio?" + params,
      //   "/text2audio?" + params,
      //   // "https://tsn.baidu.com/text2audio", 
      //   '', config
      // );
      // console.log("调用百度文字转语音！！", res);

      // if (res.status == 200) {
      //   let data = res.data.data;
      //   this.id = data.conversationId;
      //   this.parentMessageId = data.id;
      // }

      // {
      //   "binary": "",
      //     "suffix": "mp3",
      //       "name": "text2audio"
      // }



      // 参考贴子  https://blog.csdn.net/qq_22841387/article/details/123102554

      let playMp3 = document.getElementById("playMp3");

      playMp3.src = "https://tsn.baidu.com/text2audio?" + params;
      console.log(playMp3.src);
      playMp3.load();
      playMp3.addEventListener("canplay", () => {
        playMp3.play();
      });
      // setTimeout(() => {
      //   playMp3.play();
      // }, 2000);

      return;

      // let audioBlob = this.base64ToBlob(res.data, "mp3");
      var audio = new Audio();

      // let audio = document.getElementById("audioId");
      // audio.src = window.URL.createObjectURL(audioBlob);
      audio.addEventListener("canplay", () => {
        // window.URL.revokeObjectURL(audio.src);
        audio.play;

      });

      audio.src = "https://tsn.baidu.com/text2audio?" + params;
      // audio.setAttribute('src', "https://tsn.baidu.com/text2audio?" + params);
      // audio.play();
      // let blob = new Blob(res.data.binary, 'audio/mp3');
      // // console.log("调用百度文字转语音1", n);
      // audio.src = URL.createObjectURL(blob);

      audio.load();
      // audio.play;
      console.log("调用百度文字转语音2", audio);

    },
    base64ToBlob(base64, fileType) {
      let typeHeader = 'data:application/' + fileType + ';base64,'; // 定义base64 头部文件类型
      let audioSrc = typeHeader + base64; // 拼接最终的base64
      let arr = audioSrc.split(',');
      let array = arr[0].match(/:(.*?);/);
      let mime = (array && array.length > 1 ? array[1] : type) || type;
      // 去掉url的头，并转化为byte
      let bytes = window.atob(arr[1]);
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      let ia = new Uint8Array(ab);
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], {
        type: mime
      });
    },

    async EnterKey() {
      if (this.currentChatStr == "") { return; }
      // if(!this.compositionEnd){return;}
      // if(!this.enterKeyUp){return;}
      // if(this.enterKeyUp){
      //   this.enterKeyUp = false;
      // }


      this.Text2Audio(this.currentChatStr );


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
        this.Text2Audio(text);

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