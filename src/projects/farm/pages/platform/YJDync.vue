<template>
  <!-- <div class=" absolute z-50 left-0 top-0 pointer-events-auto "> -->

  <!-- 在线列表 -->
  <div id="userListPanel"
    class=" xl:block w-32 h-48 absolute right-0 top-10 xl:top-60  origin-top-right transform scale-50 xl:scale-100 ">

    <!-- 透明度背景 -->
    <div class="absolute left-0 top-0 z-0 w-full h-full ">
      <!-- <img :src="publicUrl + 'images/gameUI/zaixianrensu.png'" alt=""> -->
    </div>

    <div class=" text-center w-20  text-white  ">
      {{ language.content.onlineList }} {{ otherUser.length }}
    </div>

    <div class=" mt-1 text-left h-auto max-h-96 overflow-y-auto overscroll-auto text-white">
      <div v-for="(item, i) in otherUser" :key="i" :index="item.userName" class=" relative w-11/12  pl-2   "
        :id="item.id">
        <div class=" flex ">

          <div class=" w-auto  whitespace-nowrap  truncate "
            :class="[item.id == id ? ' pointer-events-none ' : 'cursor-pointer', (isMainUser && item.id == id) ? ' text-green-400 ' : '']"
            @click="ClickOtherUser('select', item)">
            <div>
              {{ item.userName + (item.id == id ? ' (自己)' : '') }}
            </div>
          </div>

          <div class=" hidden absolute right-0 z-auto " 
          :class="[(isMainUser && item.id != id) ? 'pointer-events-auto cursor-pointer ' : 'pointer-events-none',
            item.audio ? ' opacity-1 ' : ' opacity-0 ']
            " @click.stop="ToggleAudio(item)">
            <div class=" w-6 h-6 p-px ">
              <!-- <img class=" w-full h-full " :src="publicUrl + 'images/' + (item.mute ? 'mute' : '') + 'mico.png'" alt=""> -->
            </div>
          </div>

          <!-- <div v-if="item.video">{{ (item.video ? ' 有视频 ' : '') }}</div> -->
          <!-- 新消息 -->
          <div v-if="item.hasNew" class="absolute top-0 -left-2 w-2 h-2 rounded-full  bg-purple-700"></div>
        </div>

        <!-- 生命条 -->
        <div v-if="item.user.userData.baseData" class=" mb-1 w-full h-auto   relative ">
          <div class=" w-full border relative h-3  ">
            <div class="  bg-green-500  h-full "
              :style="'width: ' + (item.user.userData.baseData.health / item.user.userData.baseData.maxHealth) * 100 + '%'">
            </div>
            <!-- 生命条文字 -->
            <div class=" absolute left-0 top-0 w-full flex h-full  ">
              <div class=" self-center mx-auto text-xs truncate ">
                {{ item.user.userData.baseData.health }}/{{ item.user.userData.baseData.maxHealth }}</div>
            </div>
          </div>

          <div class=" flex ">
            <div v-if="item.user.userData.baseData.armor > 0" class="  ">护甲+{{ item.user.userData.baseData.armor }}</div>
            <div v-if="item.user.userData.baseData.energy > 0" class="  ">能量+{{ item.user.userData.baseData.energy }}
            </div>
          </div>

          <div v-if="item.user.userData.baseData.debuffList && item.user.userData.baseData.debuffList.length"
            class=" flex ">
            <div v-for="(debuff, i) in item.user.userData.baseData.debuffList " :key="i" class=" flex mr-1 ">
              <div class=" w-5 h-5 bg-gray-500"
                @mouseenter="HoverDebuff(item); debuffHover = true; debuffDescribe = debuff.describe;"
                @mouseleave="debuffHover = false">
                <img class=" w-full h-full" :src="debuff.icon" alt="">
              </div>
            </div>
          </div>

        </div>



      </div>
    </div>

  </div>

  <!-- 鼠标悬浮debuff上 -->
  <div v-if="debuffHover" class="absolute left-0 top-0 w-32 h-auto text-sm bg-gray-100" :style="otherUserPanelStyle">
    <div class="cursor-pointer border pl-2 ">
      {{ debuffDescribe }}
    </div>
  </div>


  <!-- 点击用户名：显示悄悄话 和 传送 -->
  <div v-if="otherUserItem != null" class="absolute left-0 top-0 w-32 h-auto text-sm bg-gray-100"
    :style="otherUserPanelStyle">
    <div class="cursor-pointer border pl-2 " @click="ClickOtherUser('悄悄话')">
      {{ language.content.secretSpeak }}
    </div>
    <div class="cursor-pointer border pl-2 " @click="ClickOtherUser('传送')">
      {{ language.content.jump }}
    </div>
    <!-- <div class="cursor-pointer border pl-2 " @click="ClickOtherUser('发送会议邀请')">
      {{ language.content.meeting }}
    </div> -->
  </div>

  <!-- 聊天记录 -->
  <div class="
                        xl:flex
                        xl:w-96
                        w-72
                        h-auto
                        absolute
                        left-5
                        bottom-20
                        flex-col
                        justify-between
                        text-white
                        bg-gray-400 bg-opacity-60
                        rounded-lg
                        text-sm
                       origin-bottom-left transform scale-75 xl:scale-100 
                      ">

    <div class="w-full h-auto max-h-80 flex flex-col justify-between relative">
      <div ref="roomChateRecode" class=" w-72  xl:w-full h-auto max-h-72 overflow-y-auto  ">
        <div v-for="(item, i) in currentChatRecode" :key="i" :index="item.fromId"
          class="h-auto chatContent px-1 text-left break-all " :class="id == item.fromId
            ? ' '
            : ' cursor-pointer '
            " @click="ShowChat(item)">
          <!-- 在大厅中说话 -->
          <div v-if="item.targetUser == ''" class="flex leading-5">
            <div class=" whitespace-nowrap truncate w-32  h-5 ">[{{ item.fromUser + (item.fromId == id ? '(自己)' : '') }}
            </div>
            <div class=" pr-1 flex-grow ">
              ]：{{ item.message }}
            </div>
          </div>

          <!-- 悄悄话 你对其他人说 -->
          <div v-if="item.targetUser != '' && item.fromId == id" class="text-purple-700 flex">
            <div>
              {{ language.content.speakTo }} [{{ item.targetUser }}]
              {{ language.content.speak }}: {{ item.message }}
            </div>
          </div>
          <!-- 悄悄话 其他人对你说 -->
          <div v-if="item.targetUser != '' &&
            item.fromUser != '' &&
            item.targetId == id
            " class="text-purple-700 flex">
            <div>
              [{{ item.fromUser }}] {{ language.content.toSpeak }}:
              {{ item.message }}
            </div>
          </div>

          <!-- {{ item.fromUser }}: {{ item.message }} -->
        </div>
      </div>
      <!-- 悄悄话 私聊提示 -->
      <div v-if="chatTargetUser != ''" class="text-left pl-2 text-purple-700 flex justify-between">
        <div>
          {{ language.content.speakTo }} [{{ chatTargetUser }}]
          {{ language.content.speak }}:
        </div>
        <div @click="chatTargetUser = ''" class="pr-5 cursor-pointer">X</div>
      </div>

    </div>
  </div>

  <!-- 输入框激活按钮 -->
  <div class=" absolute z-50 left-4 bottom-10 xl:bottom-4 origin-bottom-left transform scale-50 xl:scale-75 ">
    <div class=" absolute left-0 top-0 w-20 h-20 " @click="canInputChar = !canInputChar">
    </div>
    <div class=" origin-left ">
      <img :src="$publicUrl + 'images/gameUI/' + (canInputChar ? 'xx_laing' : 'xx_an') + '.png'" alt="">
    </div>

      <!-- 输入区域 -->
      <div v-if="canInputChar" class=" absolute left-24 top-6 w-auto h-10 flex">
      <!-- 输入框 -->
      <div class="w-full h-10 ">
        <input ref="roomInput" class="
                          w-72 xl:w-64
                                text-left
                                align-top
                                outline-none
                                bg-transparent 
                                placeholder-gray-400
                                h-full 
                                resize-none
                              " type="text" placeholder="请输入聊天内容" v-model="currentChatStr" @focus="removeThreeJSfocus"
          @blur="addThreeJSfocus" />
      </div>

      <div class=" opacity-0
                              ml-8
                              w-16
                              h-full
                              bg-gray-400
                              cursor-pointer
                              flex
                              rounded-full
                              text-white text-sm
                            " @click="SendChat()">
        <p class="self-center mx-auto">{{ language.content.sendMsg }}</p>
      </div>

      <div class=" opacity-0
                              ml-2
                              w-16
                              h-full
                              bg-gray-400
                              cursor-pointer
                              flex
                              rounded-full
                              text-white text-sm
                            " @click="ClearChat()">
        <p class="self-center mx-auto">{{ language.content.clearMsg }}</p>
      </div>
    </div>
  </div>

  <!-- 输入区域 -->
  <div class=" hidden absolute left-2 bottom-2 bg-gray-300 bg-opacity-70 rounded-lg text-white w-auto h-10 flex">
    <!-- 输入框 -->
    <div class="w-full h-10 ">
      <input ref="roomInput" class="
                          w-72 xl:w-64
                                text-left
                                align-top
                                outline-none
                                bg-transparent 
                                placeholder-gray-400
                                h-full 
                                resize-none
                              " type="text" placeholder="请输入聊天内容" v-model="currentChatStr" @focus="removeThreeJSfocus"
        @blur="addThreeJSfocus" @keyup.enter="SendChat" />
    </div>

    <div class="
                              ml-8
                              w-16
                              h-full
                              bg-gray-400
                              cursor-pointer
                              flex
                              rounded-sm
                              text-white text-sm
                            " @click="SendChat()">
      <p class="self-center mx-auto">{{ language.content.sendMsg }}</p>
    </div>

    <div class=" 
                              ml-2
                              w-16
                              h-full
                              bg-gray-400
                              cursor-pointer
                              flex
                              rounded-sm
                              text-white text-sm
                            " @click="ClearChat()">
      <p class="self-center mx-auto">{{ language.content.clearMsg }}</p>
    </div>
  </div>



  <!-- 连接websocket 提示文字 -->
  <div v-if="!connected" class="absolute z-60 w-full h-full top-0 left-0 flex pointer-events-none">
    <div class=" w-full flex">

      <div class="
                    mx-auto
                    h-8
                    leading-8
                    text-xl
                    bg-blue-300
                    rounded-md
                    shadow-md
                    cursor-pointer
                    w-auto
                  inline-block
                  ">
        <div class="  px-3  self-center mx-auto   ">
          正在连接服务器，请稍候。。。
        </div>
      </div>
    </div>
  </div>


  <!-- 音视频 -->
  <!-- <div v-if="hasTRTC">
    <txTRTC :mainUser="isMainUser" class="absolute z-50 left-0 top-0" ref="txTRTC" />
  </div> -->


  <!-- </div> -->
</template>


 
<script >

import { YJClient } from "/@/threejs/YJClient.js";

// 音视频
// import txTRTC from "/@/views/chat/txTRTC.vue";
export default {
  // 是否开启音视频 
  props: [],
  components: {
    // txTRTC,
  },
  data() {
    return {

      hasTRTC:false,
      debuffHover: false,
      debuffDescribe: "",
      // 会议邀请对话框
      meetingInvitation: false, meetingData: { fromUser: 'haha' },
      language: {
        content: {
          sendMsg: "发送",
          clearMsg: "清空",
          secretSpeak: "悄悄话",
          jump: "传送",
          toSpeak: "对你说",
          speak: "说",
          speakTo: "你对",
          skin: "皮肤",
          onlineList: "在线用户",
          meeting: "发送会议邀请",
        }
      },

      //是否正在聊天
      inChat: false,
      canInputChar: false,
      chatTargetUser: "",
      chatTargetId: "",
      // 其他用户
      otherUser: [
        {
          user: {
            userData: {
              baseData: {
                health: 0,
                maxHealth: 0,
                debuffList: [],
              }
            }
          }
        }
      ],
      //系统消息
      systemMsg: [],

      // 在用户列表中点击其他用户
      otherUserItem: null,
      // 在用户列表中点击其他用户后的弹窗的style,设置其坐标
      otherUserPanelStyle: "",
      otherUserItemTimeOut: null, //弹窗延迟关闭

      // 聊天记录
      currentChatRecode: [],
      //当前输入框的内容
      currentChatStr: "",
      connected: false,
      inputing: false,
      publicUrl: '',
      isMainUser: false,
      //session id
      id: "", 
    };
  },
  created() {

    // this.language = this.$parent.language;
    // this.language.content.meeting = "发送会议邀请";

    this.isMainUser = _Global.mainUser;
    this.publicUrl = this.$parent.GetPublicUrl();
  },
  mounted() {
    this.inSend = false;
    this.connected = false; 
    this.stopDync = false;

    document.addEventListener("visibilitychange", () => {
      // console.log(document.hidden);
      if (document.hidden && this.isMainUser && this.otherUser.length > 1) {
        //当前用户是主控时，窗口失去焦点时，交出主控权
        this.isMainUser = false;
        if (this._YJClient) {
          this._YJClient.cancelMainUser();
        }
      } else {
        if (this._YJClient) {
          this._YJClient.needMainUser();
        }
      }

    });
    // window.onfocus = () => {
    // };
    // window.onblur = () => {
    // };
  },

  methods: {
    SetMainUser(b) {
      this.isMainUser = b;
      // console.log("指定当前用户为主控 22", this.isMainUser);
    },
    // 初始化同步
    InitDync(userData) {
      this._YJClient = new YJClient(
        this,
        userData
      );
      _Global.YJClient = this._YJClient;
      window.addEventListener('keyup', (event) => {
        // console.log(event);
        switch (event.code) {
          case 'Enter':
            this.EnterKey();
            break;
        }
      });
    },
    //#region  聊天

    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      _Global.YJ3D.removeEventListener();
      this.inputing = true;
    },
    addThreeJSfocus() {
      _Global.YJ3D.threeJSfocus();
      this.inputing = false;
    },

    //从房间数据中提取指定房间的聊天记录
    GetRoomChatRecode(roomName) {
      for (let i = 0; i < this.roomList.length; i++) {
        let item = this.roomList[i];
        if (item.roomName == roomName) {
          return item.roomChatRecode;
        }
      }
    },
    // 清空聊天区域
    ClearChat() {
      this.currentChatRecode = [];
    },
    EnterKey() {
      if (!this.canInputChar) { return; }

      if (this.inputing) {
        if (this.currentChatStr == "") {
          if (this.chatTargetUser != "") {
            this.chatTargetUser = "";
          }
          this.addThreeJSfocus();
          return;
        }
        this.SendChat();
      } else {
        this.$refs.roomInput.focus();
        return;
      }
    },
    HoverDebuff(item) {
      let panelX = document.getElementById("userListPanel").offsetLeft;
      let panelY = document.getElementById("userListPanel").offsetTop;
      let left_x = document.getElementById(item.id).offsetLeft;
      let left_y = document.getElementById(item.id).offsetTop;
      // console.log("点击的用户名ui坐标为 " , left_x,left_y);
      this.otherUserPanelStyle =
        "left:" +
        (panelX + left_x - 80) +
        "px;top:" +
        (panelY + left_y) +
        "px;";
    },
    //点击其他用户名，显示与其的聊天窗口
    ClickOtherUser(type, item) {
      if (type == "select") {
        this.otherUserItem = item;
        // 显示点击用户名后的弹框界面

        let panelX = document.getElementById("userListPanel").offsetLeft;
        let panelY = document.getElementById("userListPanel").offsetTop;
        // console.log(" 用户列表 ui坐标为 " , panelX,panelY);

        let left_x = document.getElementById(item.id).offsetLeft;
        let left_y = document.getElementById(item.id).offsetTop;
        // console.log("点击的用户名ui坐标为 " , left_x,left_y);
        this.otherUserPanelStyle =
          "left:" +
          (panelX + left_x - 80) +
          "px;top:" +
          (panelY + left_y) +
          "px;";

        if (this.otherUserItemTimeOut != null) {
          clearTimeout(this.otherUserItemTimeOut);
        }
        let that = this;
        this.otherUserItemTimeOut = setTimeout(() => {
          that.otherUserItem = null;
          that.otherUserItemTimeOut = null;
        }, 3000);
        return;
      }
      if (type == "悄悄话") {
        if (this.otherUserItem != null) {
          this.ShowChatUser(this.otherUserItem);
        }
        this.otherUserItem = null;

        this.$refs.roomInput.focus();
        return;
      }
      if (type == "传送") {
        this._YJClient.SetLocalPlayerToOtherUserPos(
          this.otherUserItem.id
        );
        this.otherUserItem = null;
        return;
      }

      if (type == "发送会议邀请") {
        //发送聊天内容

        let fromData = {};
        fromData.type = "会议邀请";
        let chatrecode = {};
        chatrecode.roomName = this.roomName;
        chatrecode.fromId = this.id;
        chatrecode.fromUser = this.userName;
        chatrecode.targetId = this.otherUserItem.id;
        chatrecode.targetUser = this.otherUserItem.userName;
        chatrecode.message = "邀请";
        fromData.message = chatrecode;
        //向单个用户发送邀请
        this._YJClient.BoardMsg(
          "receiveMsg",
          "all",
          JSON.stringify(fromData)
        );

        this.otherUserItem = null;
        return;
      }
    },

    meetingHandler(e) {
      this.meetingInvitation = false;

      //发送邀请回调 -- 接受 / 拒绝

      let fromData = {};
      fromData.type = "会议邀请";
      let chatrecode = {};
      chatrecode.roomName = this.meetingData.roomName;
      chatrecode.fromId = this.meetingData.fromId;
      chatrecode.fromUser = this.meetingData.fromUser;
      chatrecode.targetId = this.meetingData.targetId;
      chatrecode.targetUser = this.meetingData.targetUser;
      chatrecode.message = e;
      fromData.message = chatrecode;
      //向单个用户发送邀请
      this._YJClient.BoardMsg(
        "receiveMsg",
        "all",
        JSON.stringify(fromData)
      );
      console.log("this.meetingData.fromUser  111 = " + this.meetingData.fromUser);

      setTimeout(() => {

        if (e == "接受") {
          //切换到会议场景 跳转到会议房间
          //跳到以发送者id命名的房间中
          console.log("this.meetingData.fromUser  222 = " + this.meetingData.fromUser);
          this.$parent.ChangeToMeetingRoom(this.meetingData.fromId, this.meetingData.fromUser);
        }
        if (e == "拒绝") {

        }
      }, 1000);

    },

    //封装聊天数据
    SendChat() {
      if (this.currentChatStr == "") {
        return;
      } 
      if(this.currentChatStr[0] == '/'){
        _Global.SetPlayerEmote(this.currentChatStr);
        this.currentChatStr = "";
        
        return;
      }

      //发送聊天内容

      let fromData = {};
      fromData.type = "聊天";
      let chatrecode = {};
      chatrecode.fromId = this.id;
      let {roomName,userName} = this._YJClient.GetUserData();
      chatrecode.fromUser = userName;
      chatrecode.roomName = roomName;
      chatrecode.targetId = this.chatTargetId;
      chatrecode.targetUser = this.chatTargetUser;
      chatrecode.message = this.currentChatStr;

      fromData.message = chatrecode;

      // this.callRPCFn("receiveMsg", "all", JSON.stringify(fromData));
      this._YJClient.BoardMsg(
        "receiveMsg",
        "all",
        JSON.stringify(fromData)
      );

      let ss = this.currentChatStr;

      // 聊天内容显示到姓名条上方
      // 本地发送直接更新到本地角色姓名条上方
      _Global.YJ3D.CreateChatTrans(ss);

      //发送后清空输入区
      this.currentChatStr = "";
      //输入框重新获取焦点
      this.$refs.roomInput.focus();

      //如果正在私聊，把私聊对象清空。表示每次需要重新点击私聊对象才能开启私聊
      // if (this.chatTargetUser != "") {
      //   this.chatTargetUser = "";
      // }

      // console.log("发送聊天");


    },
    //接收信息
    receiveMsg(_this, msg) {
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      // console.log(" 聊天 data ",data);

      //更新聊天记录
      if (data.type == "聊天") {
        var chatrecode = data.message;
        //不同房间的记录不同
        // if (chatrecode.roomName != _this.roomName) {
        //   return;
        // }

        // console.log("正在 相同房间聊天");
        if (chatrecode.fromId == _this.id) {
          //自身发送后接收
          //房间聊天
          if (chatrecode.targetUser == null || chatrecode.targetUser == "") {
            _this.currentChatRecode.push(chatrecode);
          } else {
            //悄悄话/私聊
            _this.currentChatRecode.push(chatrecode);
          }

          //显示在2d形象上
          for (let i = 0; i < _this.otherUser.length; i++) {
            let item = _this.otherUser[i];
            if (item.id == chatrecode.fromId) {
              item.chatRecode = [];
              item.chatRecode.push(chatrecode);
              clearTimeout(time);
              var time = setTimeout(() => {
                item.chatRecode.splice(0, 1);
                // console.log(" 清除聊天语句");
              }, 3000);
              // console.log("加载到个人记录上");
              continue;
            }
          }



        } else {
          //其他人发送后接收
          //房间聊天
          if (chatrecode.targetUser == null || chatrecode.targetUser == "") {
            _this.currentChatRecode.push(chatrecode);

            for (let i = 0; i < _this.otherUser.length; i++) {
              let item = _this.otherUser[i];
              if (item.id == chatrecode.fromId) {
                item.chatRecode = [];
                item.chatRecode.push(chatrecode);
                clearTimeout(time);
                var time = setTimeout(() => {
                  item.chatRecode.splice(0, 1);
                  // console.log(" 清除其他人聊天语句");
                }, 3000);
                // console.log("加载到个人记录上");
                continue;
              }
            }

            //显示在3d形象上 姓名条上方
            for (let i = 0; i < _this.otherUser.length; i++) {
              let item = _this.otherUser[i];
              if (item.id == chatrecode.fromId) {
                this._YJClient.CreateChatTransToId(item.id,chatrecode.message);
                continue;
              }
            }


          } else {
            //悄悄话/私聊
            _this.currentChatRecode.push(chatrecode);

            //显示在2d
            for (let i = 0; i < _this.otherUser.length; i++) {
              let item = _this.otherUser[i];
              if (
                _this.id == chatrecode.targetId &&
                item.id == chatrecode.fromId
              ) {
                item.chatRecode = [];
                item.chatRecode.push(chatrecode);
                clearTimeout(time);
                var time = setTimeout(() => {
                  item.chatRecode.splice(0, 1);
                  // console.log(" 清除其他人聊天语句");
                }, 3000);
                // console.log("加载到个人记录上");
                continue;
              }
            }

            // 显示在3d
            for (let i = 0; i < _this.otherUser.length; i++) {
              let item = _this.otherUser[i];
              if (
                _this.id == chatrecode.targetId &&
                item.id == chatrecode.fromId
              ) {
                for (let i = 0; i < this.allPlayer.length; i++) {
                  if (this.allPlayer[i].id == item.id) {
                    this.allPlayer[i].player.CreateChatTrans(chatrecode.message);
                  }
                }
                continue;
              }
            }
          }

        }

        // 聊天区滑块滑到最低端
        this.ScrollArea();
        // console.log(_this.otherUser);
      }
      if (data.type == "会议邀请") {
        var chatrecode = data.message;
        //不同房间的记录不同
        if (chatrecode.roomName != _this.roomName) {
          return;
        }


        // console.log("正在 相同房间聊天");
        if (chatrecode.fromId == _this.id) {
          //自身发送后接收
          if (chatrecode.message == "邀请") {
            console.log("发送会议邀请成功");
          }
          if (chatrecode.message == "接受") {
            console.log(chatrecode.targetUser + " 接受了你的邀请");
            //跳转到会议房间  跳到以发送者id命名的房间中
            console.log("this.meetingData.fromUser  333 = " + chatrecode.fromUser);
            if (this.roomName != this.id) {
              setTimeout(() => {
                console.log("this.meetingData.fromUser  444 = " + chatrecode.fromUser);
                this.$parent.ChangeToMeetingRoom(this.id, this.userName);
              }, 1000);
            }

          }
          if (chatrecode.message == "拒绝") {
            console.log(chatrecode.targetUser + " 拒绝了你的邀请");
          }
        } else {

          //接收其他人发送的信息
          if (_this.id == chatrecode.targetId) {
            if (chatrecode.message == "邀请") {
              console.log("接收到会议邀请");
              this.meetingInvitation = true;
              this.meetingData = chatrecode;
            }
          }
        }
      }
    },
    //聊天记录窗口滑块，滑到底部
    ScrollArea() {
      var that = this;
      //先判断聊天区滑块是否在最低端。
      //在最低端时，才在接收新消息时，再次设为最低端
      // console.log("scrollTop", this.$refs.roomChateRecode.scrollTop);
      // console.log("scrollHeight", this.$refs.roomChateRecode.scrollHeight);
      // 288
      if (this.$refs.roomChateRecode.scrollHeight >= 244) {
        if (
          this.$refs.roomChateRecode.scrollTop <
          this.$refs.roomChateRecode.scrollHeight - 244
        ) {
          setTimeout(() => {
            that.$refs.roomChateRecode.scrollTop =
              that.$refs.roomChateRecode.scrollHeight;
          }, 100);
        }
        return;
      } else {
        // return;
        setTimeout(() => {
          that.$refs.roomChateRecode.scrollTop =
            that.$refs.roomChateRecode.scrollHeight;
        }, 20);
      }
    },
    ShowChatUser(other) {
      if (this.id == other.id) {
        return;
      }
      this.chatTargetUser = other.userName;
      this.chatTargetId = other.id;
    },
    //点击其他用户名，显示与其的聊天窗口
    ShowChat(other) {
      if (this.id == other.fromId) {
        return;
      }
      this.chatTargetId = other.fromId;
      this.chatTargetUser = other.fromUser;
      this.$refs.roomInput.focus();

      return;

      //点开新的聊天对象时，保存旧的聊天编辑内容
      for (let i = 0; i < this.otherUser.length; i++) {
        let item = this.otherUser[i];
        if (item.userName == this.chatTargetUser) {
          item.currentInput = this.currentChatStr;
          continue;
        }
      }

      for (let i = 0; i < this.otherUser.length; i++) {
        let item = this.otherUser[i];
        if (item.userName == other) {
          this.currentChatStr = item.currentInput;
          this.currentChatRecode = item.chatRecode;
          item.hasNew = false;

          return;
        }
      }
    },
    //#endregion



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