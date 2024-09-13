 

<template >
  <div>
  <!-- //自身视频窗口 -->
  <div v-show="1 == 0" class="w-40 h-40 absolute z-10 left-0 top-20">
    <div
      id="local_stream"
      class="local-stream flex w-40 h-40 p-5 rounded-full"
    ></div>
    <div>{{ localId }}</div>
  </div>

  <!-- //屏幕共享窗口 -->
  <div v-show="1 == 11" class="absolute z-10">
    <div
      v-for="(item, i) in screenStream"
      :key="i"
      class="video-box w-40 h-40 p-5 rounded-full"
    >
      <div
        :class="
          item
            ? 'distant-stream w-full h-full  rounded-full'
            : '  w-full h-full  rounded-full'
        "
        v-html="item.html"
      ></div>
      <div>{{ item.id }}</div>
    </div>
  </div>

  <!-- //小视频（这块考虑的是多人视频） -->
  <div v-show="1 == 0" class="absolute z-10">
    <div
      v-for="(item, i) in remoteStream"
      :key="i"
      class="video-box w-40 h-40 p-5 rounded-full"
    >
      <div
        :class="
          item
            ? 'distant-stream w-full h-full  rounded-full'
            : '  w-full h-full  rounded-full'
        "
        v-html="item.html"
      ></div>
      <div>{{ item.id }}</div>
    </div>
  </div>

  <!-- <div class=" w-32 h-32 bg-gray-400 rounded-full">
      <img src="/@/assets/images/player/bg.jpg" class=" w-full h-full rounded-full " alt="">
    </div> -->
  <div
    class="
      absolute
      right-2
      origin-bottom-right
      bottom-10
      transform
      scale-50
      xl:scale-100 xl:bottom-40
    "
  >
    <div class="flex flex-col w-20 gap-y-4">
      <div
        class="rounded-full flex bg-gray-300 w-16 h-16 cursor-pointer"
        @click="clickToggleAudio()"
      >
        <!-- <div class=" flex  ">
          <img :src="publicUrl + 'images/gameUI/' + (openAudio ? 'a_yy_liang' : 'a_yy_an') + '.png'" alt="">
      </div> -->
        <div class="self-center mx-auto text-xs">
          {{ openAudio ? "关闭语音" : "打开语音" }}
        </div>
      </div>
      <div
        class="rounded-full flex bg-gray-300 w-16 h-16 cursor-pointer"
        @click="clickToggleVideo()"
      >
        <!-- <div class="flex">
          <img
            :src="
              publicUrl +
              'images/gameUI/' +
              (openVideo ? 'a_sx_liang' : 'a_sx_an') +
              '.png'
            "
            alt=""
          />
        </div> -->
        <div class="self-center mx-auto text-xs">
          {{ openVideo ? "关闭视频" : "打开视频" }}
        </div>
      </div>

      <div
        v-if="mainUser"
        class=" hidden rounded-full flex bg-gray-300 w-16 h-16 cursor-pointer"
        @click="ShareScreen()"
      >
        <!-- <div class="flex">
          <img
            :src="
              publicUrl +
              'images/gameUI/' +
              (openScreen ? 'pmgx' : 'pmgx_002') +
              '.png'
            "
            alt=""
          />
        </div> -->
        <div class="self-center mx-auto text-xs">
          {{ "屏幕共享" }}
        </div>
      </div>
      <!-- <div v-if="mainUser" class="rounded-full flex bg-gray-300 w-16 h-16 cursor-pointer" @click="CloseShareScreen()">
        <div class="self-center mx-auto text-xs">
          {{ "关闭屏幕共享" }}
          </div>
        </div> -->
    </div>
  </div>
</div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";

import LibGenerateTestUserSig from "/@/js/generateUserSig.js";
import TRTC from "trtc-js-sdk";

const sdkAppId = 1400704032;
const _userSig =
  "258ac2d7fea64c6e1bc524682a3437140c11bc841f3aff411e20a5dc5b12568f";

const videoStyle =
  " width:100%;height:100%;	object-fit: cover;--tw-scale-x: 1.5; border-radius:9999px";
// // 互动直播模式下创建客户端对象
// const client = TRTC.createClient({
//   mode: 'live',
//   sdkAppId,
//   userId,
//   userSig
// });

// 接入记录：
//1 在已开启屏幕共享的情况下，视频的开启和关闭不会被同步。因为屏幕共享和视频使用的是同一id
// 2，所以需要先开视频，再开屏幕共享。 或者在开屏幕共享时，弹出是否同时打开视频的对话框
// 3，bad 在已开启屏幕共享的情况下，开视频时，先去掉屏幕共享，再同时开视频和屏幕共享
export default {
  props: ["mainUser"],
  components: {},
  data() {
    return {
      userId: "", //用户id --可更改
      remoteStream: [], //远方视频流
      screenStream: [], // 屏幕共享流
      localStream: null, //本地流
      // sdkAppId: '', //sdkID
      // userSig: '', //签名

      roomId: "11111", //房间号--加入相同房间才能聊
      client: null,
      user: "",
      openAudio: false, //是否开启语音通话
      openVideo: false, //是否开启视频
      openScreen: false, //是否开启屏幕共享
      localId: "",
      publicUrl: "farm/",
    };
  },

  //初始化函数
  mounted() {
    this.publicUrl = this.$parent.publicUrl;
    // this.Init(this.userId);
  },
  methods: {
    ChangeRoom(roomName) {
      this.roomId = roomName;
      // console.log(" 更改音视频房间号 , " ,this.roomId);
    },
    SetAudioVideo(_openAudio, _openVideo) {
      this.openAudio = _openAudio;
      this.openVideo = _openVideo;
    },
    clickToggleAudio() {
      this.openAudio = !this.openAudio;
      this.closeStream();

      if (this.openAudio) {
      } else {
        this.$parent.SetUserAudio(false);
      }
    },
    clickToggleVideo() {
      this.openVideo = !this.openVideo;
      this.closeStream();
      if (this.openVideo) {
      } else {
        //关闭用户头上的video
        this.$parent.SetUserVideo(false);
      }
    },
    async closeStream() {
      if (this.client == null) {
        this.Init(this.userId);
        return;
      }
      if (this.localStream != null) {
        // if (this.openVideo) {
        //   let userId = this.userId;
        //   // 打开摄像头
        //   const videoStream = TRTC.createStream({ userId, audio: false, video: true });
        //   await videoStream.initialize();
        //   await this.localStream.replaceTrack(videoStream.getVideoTrack());
        // } else {
        //   // 关闭摄像头
        //   const videoTrack = this.localStream.getVideoTrack();
        //   if (videoTrack) {
        //     await this.localStream.replaceTrack(videoTrack)
        //     // 停止采集，关闭摄像头
        //     videoTrack.stop();
        //   }
        // }
        // return;

        await this.client.unpublish(this.localStream);
        // 停止本地流，关闭本地流内部的音视频播放器
        this.localStream.stop();
        // 关闭本地流，释放摄像头和麦克风访问权限
        this.localStream.close();
        this.localStream = null;
      }

      //创建本地流
      this.createStream(this.userId);
    },

    async Init(userId) {
      userId = this.$parent.GetUseId();
      console.log(" ============= 开启音视频，使用id = > end " + userId);
      // return; //账号已过期
      // if (!this.openAudio && !this.openVideo) {
      //   return;
      // }

      const data = this.genTestUserSig(userId);
      const { userSig } = data;
      // 实时通话模式下创建客户端对象
      this.client = TRTC.createClient({
        mode: "rtc",
        sdkAppId,
        userId,
        userSig,
        useStringRoomId: true,
      });
      // 输出 DEBUG 以上日志等级
      TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.NONE);
      // TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.ERROR);

      // 建议使用 async/await 的语法，实现同样的效果
      // try {
      //   await client.join({ roomId });
      //   console.log("进房成功");
      // } catch (error) {
      //   console.error("进房失败，请稍后再试" + error);
      // }
      // this.client = client;

      //注册远程监听，要放在加入房间前--这里用了发布订阅模式
      this.subscribeStream(this.client);
      //初始化后才能加入房间
      this.joinRoom(this.client, this.roomId);
      // 公共监听方法----主要是推流方摄像头关闭，音频关闭开启等；下方有说！！
      // this.publicMonitor(this.client)

      // // 以主播角色进入房间
      // try {
      //   await client.join({
      //     roomId,
      //     role: "anchor",
      //   });
      //   console.log("进房成功");
      // } catch (error) {
      //   console.error("进房失败，请稍后再试" + error);
      // }
    },
    //加入房间
    joinRoom(client, roomId) {
      // console.error(" 加入音视频房间 =  ",roomId );

      client
        .join({ roomId })
        .catch((error) => {
          // console.error("进房失败 " + error);
        })
        .then(() => {
          // console.log("进房成功");
          //创建本地流
          // this.createStream(this.userId);

          // this.createShareSteam(this.userId);

          //播放远端流
          this.playStream(this.client);
        });
    },

    //创建本地音视频流
    createStream(userId) {
      if (!this.openAudio && !this.openVideo) {
        this.$parent.CloseLocalTRTC();
        return;
      }

      var that = this;

      const localStream = TRTC.createStream({
        userId,
        audio: this.openAudio, //是否开启语音通话
        video: this.openVideo, //是否开启视频
      });
      this.localStream = localStream;
      localStream.setVideoProfile("480p");
      localStream
        .initialize()
        .catch((error) => {
          console.error("初始化音视频失败 或 音视频权限被禁用  " + error);
        })
        .then(() => {
          let localId = localStream.getId();
          that.localId = localId;
          // console.log("初始化本地流成功", localId);
          localStream.play("local_stream");

          if (that.openVideo) {
            document.getElementById("player_" + localId).style = videoStyle;
            document.getElementById("video_" + localId).style = videoStyle;
          } else {
            document.getElementById("player_" + localId).style =
              " display:none";
          }

          if (that.openVideo) {
            that.$parent.SetUserVideo(localId);
            // that.$parent.SetUserVideo(document.getElementById("video_" + localId));
          }
          if (that.openAudio) {
            that.$parent.SetUserAudio(
              document.getElementById("audio_" + localId)
            );
          }

          // console.log("本地");
          // console.log(document.getElementsByTagName("video")[0].style = " border-radius:9999px");

          //创建好后才能发布
          this.publishStream(localStream, this.client);
        });
    },
    //发布本地音视频流
    publishStream(localStream, client) {
      client
        .publish(localStream)
        .catch((error) => {
          // console.error("本地流发布失败 " + error);
        })
        .then(() => {
          // console.log("本地流发布成功", this.client);
        });
    },

    //订阅远端流--加入房间之前
    subscribeStream(client) {
      client.on("stream-added", (event) => {
        const remoteStream = event.stream;

        //订阅远端流
        client.subscribe(remoteStream);
      });
    },
    //播放远端流
    playStream(client) {
      var that = this;
      client.on("stream-subscribed", (event) => {
        console.log("接收到的流数据", event);

        const remoteStream = event.stream;
        let localId = remoteStream.getId();
        // let userId = remoteStream.getUserId();
        let streamId = localId;

        let isScreen = false;
        // 主路视频流，一般是推麦克风、摄像头的那路流
        if (remoteStream.type_ === "main") {
          streamId += "";
        } else if (remoteStream.type_ === "auxiliary") {
          streamId += "_screen";
          isScreen = true;
        }

        // console.log("远端流订阅成功：", streamId);

        // 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
        const base = `<div id="${
          "remote_stream-" + streamId
        }" style="${videoStyle} " ></div>`;

        if (isScreen) {
          this.screenStream.push({ id: streamId, html: base });

          this.$nextTick(() => {
            //播放
            remoteStream.play("remote_stream-" + streamId);

            this.$nextTick(() => {
              this.$parent.OpenShareStream3D(localId);
            });
          });
        } else {
          this.remoteStream.push({ id: streamId, html: base });

          //做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
          this.$nextTick(() => {
            //播放
            remoteStream.play("remote_stream-" + streamId);
            let userId = remoteStream.userId_;
            // console.log("userId = "+userId);
            that.$parent.SetRemoteTRTCid(
              userId,
              streamId,
              remoteStream.videoPlayer_ != null,
              remoteStream.audioPlayer_ != null
            );
          });
        }

        // const remoteStream = event.stream;
        // const streamId = remoteStream.getId();
        // // console.log("远端流订阅成功：" + streamId);
        // // 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
        // const base = `<div id="${"remote_stream-" + streamId
        //   }" style="${videoStyle} " ></div>`;
        // this.remoteStream.push({ id: streamId, html: base });
        // //做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
        // this.$nextTick(() => {
        //   //播放
        //   remoteStream.play("remote_stream-" + streamId);

        //   let userId = remoteStream.userId_;
        //   // console.log("userId = "+userId);
        //   that.$parent.SetRemoteTRTCid(userId, streamId, remoteStream.videoPlayer_ != null, remoteStream.audioPlayer_ != null);
        // });
      });
    },

    ShareScreen() {
      if (this.shareStream != null) {
        return;
      }
      this.createShareSteam(this.userId);
    },
    CloseShareScreen() {
      this.CloseShareStream();
    },
    createShareSteam(userId) {
      var that = this;

      const shareStream = TRTC.createStream({
        userId,
        screen: true, // 采集屏幕分享
        screenAudio: true, // 采集系统音频
        // audio: false 是否采集麦克风，不支持同时采集系统音频和麦克风，请勿同时设置 audio 和 screen 属性为 true
      });
      this.shareStream = shareStream;
      shareStream
        .initialize()
        .catch((error) => {
          console.error("初始化 屏幕共享流 失败或取消屏幕共享 " + error);
        })
        .then(() => {
          // console.log("发布屏幕共享", shareStream);

          let localId = shareStream.getId();

          let streamId = localId;
          // console.log("初始化本地  屏幕共享流 成功", localId);
          streamId += "_screen";
          // 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
          const base = `<div id="${
            "remote_stream-" + streamId
          }" style="${videoStyle} " ></div>`;

          this.screenStream.push({ id: streamId, html: base });

          this.$nextTick(() => {
            //播放
            shareStream.play("remote_stream-" + streamId);

            this.$nextTick(() => {
              // 取消屏幕共享
              if (shareStream.videoPlayer_ == null) {
                shareStream.close();
                this.shareStream = null;
                return;
              }

              this.$parent.OpenShareStream3D(localId);

              //创建好后才能发布
              this.publishShareStream(this.shareStream, this.client);

              this.openScreen = true;
            });
          });
        });
    },
    CloseShareStream() {
      this.openScreen = false;

      if (this.client.localAuxStream_ != null) {
        this.client.unpublish(this.client.localAuxStream_).then(() => {
          // console.log("取消发布本地推流 屏幕共享 成功==== ");
          // 停止采集屏幕分享
          this.shareStream.close();
          this.shareStream = null;
        });

        // console.log("屏幕共享已关闭");
        this.$parent.CloseShareStream();
        return;
      }

      // if (this.shareStream != null) {
      //   // 取消发布本地推流 屏幕共享
      //   // await this.client.unpublish(this.shareStream,{ isAuxiliary: true});
      //   //       // 停止采集屏幕分享
      //   // this.shareStream.close();
      //   // this.shareStream = null;
      //   this.client.unpublish(this.shareStream)
      //     .catch((error) => {
      //       console.error(" 取消发布本地推流 屏幕共享 失败 " + error);
      //     })
      //     .then(() => {
      //       console.log("取消发布本地推流 屏幕共享 成功==== ");

      //       // 停止采集屏幕分享
      //       this.shareStream.close();
      //       this.shareStream = null;
      //     });
      //   console.log("屏幕共享已关闭");
      //   this.$parent.CloseShareStream();
      // }
    },
    // 关闭屏幕共享的UI
    CloseShareStreamUI() {
      this.screenStream = [];
    },
    publishShareStream(shareStream, client) {
      this.client
        .publish(this.shareStream, { isAuxiliary: true })
        .catch((error) => {
          // console.error("本地 屏幕共享流发布失败 " + error);
        })
        .then(() => {
          // console.log("本地 屏幕共享流  发布成功", this.client);
        });

      // 屏幕分享流监听屏幕分享停止事件
      this.shareStream.on("screen-sharing-stopped", async (event) => {
        this.CloseShareStream();
      });
      return;

      // 将 isAuxiliary 设为 true，将以辅流的形式进行推流。
      client
        .publish(shareStream, { isAuxiliary: true })
        .catch((error) => {
          console.error("本地 屏幕共享流发布失败 " + error);
        })
        .then(() => {
          console.log("本地 屏幕共享流  发布成功");
        });
    },

    //退出房间，关闭音视频
    leaveRoom() {
      if (this.client == null) {
        return;
      }
      var client = this.client;
      client
        .leave()
        .then(() => {
          // 停止本地流，关闭本地流内部的音视频播放器
          this.localStream.stop();
          // 关闭本地流，释放摄像头和麦克风访问权限
          this.localStream.close();
          this.localStream = null;
          this.client = null;

          this.openAudio = false;
          this.openVideo = false;
          // 退房成功，可再次调用client.join重新进房开启新的通话。
        })
        .catch((error) => {
          console.error("退房失败 " + error);
          // 错误不可恢复，需要刷新页面。
        });
    },
    closeTRTC() {
      if (this.client == null) {
        return;
      }
      var client = this.client;
      client.destroy();
      client = null;

      // 停止本地流，关闭本地流内部的音视频播放器
      this.localStream.stop();
      // 关闭本地流，释放摄像头和麦克风访问权限
      this.localStream.close();
      this.localStream = null;

      this.openAudio = false;
      this.openVideo = false;
    },

    /* eslint-disable require-jsdoc */
    /*
     * Module:   GenerateTestUserSig
     *
     * Function: 用于生成测试用的 UserSig，UserSig 是腾讯云为其云服务设计的一种安全保护签名。
     *           其计算方法是对 SDKAppID、UserID 和 EXPIRETIME 进行加密，加密算法为 HMAC-SHA256。
     *
     * Attention: 请不要将如下代码发布到您的线上正式版本的 App 中，原因如下：
     *
     *            本文件中的代码虽然能够正确计算出 UserSig，但仅适合快速调通 SDK 的基本功能，不适合线上产品，
     *            这是因为客户端代码中的 SECRETKEY 很容易被反编译逆向破解，尤其是 Web 端的代码被破解的难度几乎为零。
     *            一旦您的密钥泄露，攻击者就可以计算出正确的 UserSig 来盗用您的腾讯云流量。
     *
     *            正确的做法是将 UserSig 的计算代码和加密密钥放在您的业务服务器上，然后由 App 按需向您的服务器获取实时算出的 UserSig。
     *            由于破解服务器的成本要高于破解客户端 App，所以服务器计算的方案能够更好地保护您的加密密钥。
     *
     * Reference：https://cloud.tencent.com/document/product/647/17275#Server
     */
    genTestUserSig(userID) {
      /**
       * 腾讯云 SDKAppId，需要替换为您自己账号下的 SDKAppId。
       *
       * 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav ) 创建应用，即可看到 SDKAppId，
       * 它是腾讯云用于区分客户的唯一标识。
       */
      const SDKAPPID = sdkAppId;

      /**
       * 签名过期时间，建议不要设置的过短
       * <p>
       * 时间单位：秒
       * 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
       */
      const EXPIRETIME = 604800;

      /**
       * 计算签名用的加密密钥，获取步骤如下：
       *
       * step1. 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav )，如果还没有应用就创建一个，
       * step2. 单击“应用配置”进入基础配置页面，并进一步找到“帐号体系集成”部分。
       * step3. 点击“查看密钥”按钮，就可以看到计算 UserSig 使用的加密的密钥了，请将其拷贝并复制到如下的变量中
       *
       * 注意：该方案仅适用于调试Demo，正式上线前请将 UserSig 计算代码和密钥迁移到您的后台服务器上，以避免加密密钥泄露导致的流量盗用。
       * 文档：https://cloud.tencent.com/document/product/647/17275#Server
       */
      const SECRETKEY = _userSig;

      // a soft reminder to guide developer to configure sdkAppId/secretKey
      if (SDKAPPID === "" || SECRETKEY === "") {
        alert(
          "请先配置好您的账号信息： SDKAPPID 及 SECRETKEY " +
            "\r\n\r\nPlease configure your SDKAPPID/SECRETKEY in js/debug/GenerateTestUserSig.js"
        );
      }
      const generator = new LibGenerateTestUserSig(
        SDKAPPID,
        SECRETKEY,
        EXPIRETIME
      );
      const userSig = generator.genTestUserSig(userID);
      return {
        sdkAppId: SDKAPPID,
        userSig: userSig,
      };
    },

    // 禁用音频
    muteAudio() {
      this.localStream.muteAudio();
    },
    // 启用音频
    unmuteAudio() {
      this.localStream.unmuteAudio();
    },
    // 禁用视频
    muteVideo() {
      this.localStream.muteVideo();
    },
    // 启用视频
    unmuteVideo() {
      this.localStream.unmuteVideo();
    },
  },
};
</script>

<style scoped></style> 