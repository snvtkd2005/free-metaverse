
// 在线聊天室 聊天界面 3d形象 聊天
<template>

  <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

  <!-- 加载loading -->
  <loadingPanel class="absolute z-40 left-0 top-0 pointer-events-none opacity-0" ref="loadingPanel" />
  <!-- <loadingWX class="absolute z-50 left-0 top-0 pointer-events-none" ref="loadingWX" /> -->
  <loadingWX v-if="inLoading" class="absolute z-50 left-0 top-0 pointer-events-none" ref="loadingWX" />

  <dialogPanel ref="dialogPanel" v-if="isInsertPanel" />

  <audio :src="GetPublicUrl() + 'bgmusic.mp3'" autoplay='autoplay' loop ref="bgMusic"></audio>
  <audio :src="GetPublicUrl() + 'tuzi.mp3'" ref="tuziMusic"></audio>
  <audio :src="GetPublicUrl() + 'bird.mp3'" autoplay='autoplay' muted loop ref="birdMusic"></audio>

  <!-- 遮罩，点击弹出授权 -->
  <div v-if="mask" class=" absolute z-50 left-0 top-0 w-full h-full flex   " @click="addListenFn">
    <!-- <div class=" self-center mx-auto  w-32 h-32 flex ">
      <img class=" handAnimFn  w-10 h-8  " :src="$publicUrl + 'hand.png'" alt="">
    </div> -->
  </div>


  <!-- 屏幕底部滑动提示 -->
  <div v-if="!inLoading && !mask" class=" absolute z-50 left-0 bottom-6 w-full flex pointer-events-none  ">
    <div class=" self-center mx-auto  w-full h-32 flex transform scale-75 ">
      <img class="  mx-auto" :src="$publicUrl + 'gyro.png'" alt="">
    </div>
  </div>

  <!-- 视频  hidden-->
  <div id="videoParent" class=" hidden  w-1/2 h-1/2 absolute top-0 left-0 pointer-events-none">
    <div v-for="(item, i) in videoList" :key="i" class="video-box w-40 h-40 p-5 rounded-full">
      <video :id=item.id playsinline="true" webkit-playsinline="true" x5-video-player-type="h5-page"
        x5-video-player-fullscreen="true" muted :src="$publicUrl + 'videos/' + item.id + '.mp4'"></video>
    </div>
  </div>



  <div v-show="inJumpVideo" class=" absolute left-0 top-0 w-full h-full z-60">
    <video class="videoCamera" ref="videoSrc" playsinline="true" webkit-playsinline="true"
      x5-video-player-type="h5-page" preload="auto" muted loop :src="$publicUrl + 'videos/coffee.mp4'"></video>
  </div>

  <div class=" absolute left-0 top-0 w-full h-full z-60 pointer-events-none "
    :class="(inJumpVideo && inCoffeeGif) ? ' opacity-100' : ' opacity-0 '">
    <div class=" w-full h-full flex ">
      <!-- <img class=" w-full h-full mx-auto" :src="$publicUrl + 'coffee.gif'" alt=""> -->
      <img class=" w-full h-full mx-auto" :src="$publicUrl + coffeeGifUrl" alt="">
    </div>
  </div>

  <div v-show="inJumpVideo_liuxing" class=" absolute left-0 top-0 w-full h-full z-60">
    <video class="videoCamera" ref="videoSrc_liuxing" playsinline="true" webkit-playsinline="true"
      x5-video-player-type="h5-page" preload="auto" muted loop :src="$publicUrl + 'videos/liuxing.mp4'"></video>
  </div>

  <div class=" absolute left-0 top-0 w-full h-full z-60 pointer-events-none "
    :class="(inJumpVideo_liuxing && inLiuxingGif) ? ' opacity-100' : ' opacity-0 '">
    <div class=" w-full h-full flex ">
      <img class=" w-full h-full mx-auto" :src="$publicUrl + liuxingGifUrl" alt="">
    </div>
  </div>

  <div v-show="(inJumpVideo || inJumpVideo_liuxing) && displayBtn" class=" absolute z-60 w-full left-0 bottom-12  "
    @click="JumpToWXminFn">
    <div class=" self-center mx-auto transform scale-50 flex ">
      <img class=" object-contain btnInAnimFn  " :src="$publicUrl + 'btn.png'" alt="">
    </div>
  </div>

</template>

<script>
// 三维页
// import ThreejsHumanChat from "/@/threeJS/threeSHJKGChat.vue";

import dialogPanel from "./dialogPanel.vue";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

// 加载进度页
import loadingPanel from "./loadingPanel.vue";
import loadingWX from "./loadingWX.vue";

// 配置文件
import AvatarData from "../data/sceneSetting.js";

import { YJGyro } from "/@/threeJS/YJGyro.js";
import { YJControllerRota } from "/@/threeJS/YJControllerRota.js";

export default {
  name: "index",
  components: {
    loadingPanel,
    YJmetaBase,
    dialogPanel,
    loadingWX,
  },
  data() {
    return {
      inJumpVideo: false,
      inJumpVideo_liuxing: false,
      displayBtn: false,

      mask: false,
      hasRequestDevice: false,
      inLoading: true,
      isInsertPanel: false,
      // 是否显示姓名条
      displayUserNameUI: false,

      // 是否显示摇杆。 右摇杆跟随左摇杆显示隐藏
      displayJoystick: true,
      //是否可交互的提示
      jiaohuTip: false,

      clickHotpointDoonce: 0,
      music: false,
      videoList: [
        { id: "video_tuzi_lr" },
        { id: "video_yinfu_lr" },
        { id: "video_liuxing_lr" },
        { id: "video_yan_lr" },
        { id: "video_huo_lr" },
      ],


      // 广告视频
      videoSrc: "coffee",
      jumpId: '',
      sending: false,
      inMusic: false,
      cameraRotaY: 0,

      inGyro: false,

      inBgMusic: true,
      inLiuxingGif: false,
      inCoffeeGif: false,

      coffeeGifUrlNum: 0,
      coffeeGifUrl: "coffee.gif?test",
      liuxingGifUrl: "liuxing.gif?test",

      playNum: 0,
    };
  },

  created() {
    this.avatarData = AvatarData;

    this.$publicUrl += this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);

    document.title = "Columbia一步穿行到自然";
    document.addEventListener(
      'WeixinJSBridgeReady',
      () => {
        console.log("微信准备完成000");
        this.PlayVideo();
      },
      false
    );

    // _Global.OnWeixinJSBridgeReady = this.OnWeixinJSBridgeReady;

    console.log("页面加载完成 created() ");
  },
  mounted() {
    this._YJGyro = null;
    this._YJControllerRota = null;

    // 进度条发送到三维页
    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    this.$refs.YJmetaBase.ClickeSelectOK();

    let that = this;

    // 视频渲染监听视频播放结束 
    this.ListenerVideo(this.$refs.videoSrc);
    this.ListenerVideo(this.$refs.videoSrc_liuxing);


    // window.onfocus = function () {
    //   // console.log("激活焦点");
    //   that.$refs.YJmetaBase.ThreejsHumanChat.PlayVideoFn("video_tuzi_lr");
    //   that.sending = false;
    //   that.PauseVideo();

    //   if (that.inMusic) {
    //     that.$refs.birdMusic.play();
    //   }
    // };

    document.addEventListener("visibilitychange", function () {
      console.log(document.hidden);

      that.$refs.YJmetaBase.ThreejsHumanChat.PlayVideoFn("video_tuzi_lr");
      if (document.hidden) {
        if (that.inMusic) {
          that.$refs.birdMusic.pause();
        }

        if (that.inBgMusic) {
          that.$refs.bgMusic.pause();
        }

        that.inCoffeeGif = false;
        that.inLiuxingGif = false;
      } else {
        if (that.inMusic) {
          that.$refs.birdMusic.play();
        }

        if (that.inJumpVideo_liuxing) {
          that.$refs.videoSrc_liuxing.play();
        }
        if (that.inJumpVideo) {
          that.$refs.videoSrc.play();
        }

        if (that.inBgMusic) {
          that.$refs.bgMusic.play();
        }

        that.inCoffeeGif = false;
        that.inLiuxingGif = false;
      }

      if (that.inGyro) {
        that.TurnCameraRota(that.jumpId);
      }

    });

    window.addEventListener("touchstart", function (e) {
      that.PlayVideo();
    });

  },
  methods: {
    OnWeixinJSBridgeReady() {
      console.log(" 延迟监听 ==== 微信准备完成000 ");
      this.PlayVideo();
    },
    TurnCameraRota(jumpId) {
      this.cameraRotaY = 0;

      if (jumpId == "1") {
        this.cameraRotaY = 5.3;
      }
      if (jumpId == "2") {
        this.cameraRotaY = 1.0;
      }
      if (jumpId == "3") {
        this.cameraRotaY = 3.5;
      }
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.rotaModelParent(this.cameraRotaY);
    },
    ListenerVideo(video) {
      let that = this;

      let videoWidth = window.innerWidth;
      let videoHeight = window.innerHeight;
      // console.log("w= " + videoWidth + " h= " + videoHeight);
      video.width = videoWidth;
      video.height = videoHeight;

      video.setAttribute('crossorigin', 'anonymous');

      video.addEventListener('play', function () {
        setTimeout(() => {
          that.displayBtn = true;
        }, 4000);

        that.coffeeGifUrlNum++;
        if (that.inJumpVideo) {
          that.coffeeGifUrl = "coffee.gif?" + that.coffeeGifUrlNum + "sdfsdf";
          console.log(that.coffeeGifUrl);

          setTimeout(() => {
            that.inCoffeeGif = true;
          }, 2500);
        }
        if (that.inJumpVideo_liuxing) {
          that.liuxingGifUrl = "liuxing.gif?" + that.coffeeGifUrlNum + "1111";

          setTimeout(() => {
            that.inLiuxingGif = true;
          }, 2500);
        }

        console.log("视频开始播放");

        // var i = window.setInterval(function () {
        //   if (video.ended) {
        //     clearInterval(i);
        //     that.JumpToWXmin(that.jumpId);
        //   }
        // }, 20)
      }, false);

    },
    PlayBGAudio() {
      if (this.inBgMusic) {
        this.$refs.bgMusic.play();
      }
    },
    PlayVideo() {
      this.playNum++;
      if (this.playNum > 3) { return; }
      if (this.inBgMusic) {
        this.$refs.bgMusic.play();
      }

      for (let i = 0; i < this.videoList.length; i++) {
        const element = this.videoList[i];
        const video = document.getElementById(element.id);
        video.setAttribute('crossorigin', 'anonymous');

        video.loop = true;
        video.play();
      }

      if (this.inBgMusic) {
        setTimeout(() => {
          this.$refs.bgMusic.play();
        }, 1000);
      }
    },

    PlayBgMusic() {
    },
    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) {
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(
        id
      );
    },
    LoadingProcess(f) {
    },
    GetPublicUrl() {
      return this.$publicUrl;
    },
    OpenThreejs() {
      this.$refs.YJmetaBase.OpenThreejs();
    },
    // 如果3d加载好了能点击跳转时候 执行一下
    load3dComplete() {
      this.OpenThreejs();

      // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.setModelParentOffset(-2 );

      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetVideoLoop(
        'video_tuzi_lr',
        false
      );

      console.log("3d加载好了的回调");

      // if (sessionStorage.getItem("jumpId")) {
      //   let jumpId = sessionStorage.getItem("jumpId");
      //   this.cameraRotaY = 0;
      //   if (jumpId == "1") {
      //     this.cameraRotaY = 5.3;
      //   }
      //   if (jumpId == "2") {
      //     this.cameraRotaY = 1.0;
      //   }
      //   if (jumpId == "3") {
      //     this.cameraRotaY = 3.5;
      //   }
      //   // console.log("陀螺仪摄像机Y轴旋转" , this.cameraRotaY);
      //   this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.rotaModelParent(this.cameraRotaY);
      // }

      setTimeout(() => {
        this.$refs.YJmetaBase.ThreejsHumanChat.PlayVideo();

        this.$refs.YJmetaBase.ThreejsHumanChat.AddVideoListener();
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
          'video_tuzi_lr',
          false
        );
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
          'hotpoint_tuzi',
          false
        );

        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
          'hit_tuzi',
          false
        );
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
          'hit_tuzi2',
          false
        );

        this.$refs.YJmetaBase.ThreejsHumanChat.StopVideoById('video_tuzi_lr');
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
          'tip_yinfu',
          true
        );

        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
          'tip_mask',
          true
        );

      }, 1000);

      setTimeout(() => {
        this.inLoading = false;
        // this.mask = true; return;

        this.mask = true;
        this.addListen();
      }, 1000);



      // this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(false);
      // this.$refs.YJmetaBase.removeThreeJSfocus();
      // this._YJControllerRota = new YJControllerRota(this.$refs.YJmetaBase.ThreejsHumanChat.GetThreeDocument(), this);


    },
    RotaBase(x, y) {
      // console.log(" rotaBase ",x,y);
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.addRotaModelParent(0, -x);
    },
    CloseDialogPanel() {
      //关闭 弹窗时，开启threejs控制
      this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(true);
      this.$refs.YJmetaBase.addThreeJSfocus();

      this.isInsertPanel = false;
    },
    PauseVideo() {
      if (this.inJumpVideo) {
        this.$refs.videoSrc.currentTime = 0;
        this.$refs.videoSrc.pause();
        this.inJumpVideo = false;
      }
      if (this.inJumpVideo_liuxing) {
        this.$refs.videoSrc_liuxing.currentTime = 0;
        this.$refs.videoSrc_liuxing.pause();
        this.inJumpVideo_liuxing = false;
      }
      this.displayBtn = false;
      this.inCoffeeGif = false;
      this.inLiuxingGif = false;
      if (this.inBgMusic) {
        this.$refs.bgMusic.pause();
      }
      if (this.inMusic) {
        this.$refs.birdMusic.pause();
      }
    },
    JumpToWXminFn() {
      this.JumpToWXmin(this.jumpId);
    },
    JumpToWXmin(id) {
      this.sending = true;

      console.log("跳转 " + id + "  " + this.music);
      let that = this;
      //跳转第三方小程序
      // 带参跳转到本地小程序，由本地小程序页面获取参数，跳转到第三方小程序
      wx.miniProgram.navigateTo({
        url: '/pages/prize/index?id=' + id + '&music=' + this.music,
        success: function () {
          that.sending = false;
          that.PauseVideo();

          console.log('success');
        },
        fail: function () {
          console.log('fail');
        },
        complete: function () {
          console.log('complete');
        }
      });


      // sessionStorage.setItem("jumpId", id);

      this.music = false;

      setTimeout(() => {
        this.sending = false;

      }, 2000);
    },
    PostToWXmin(id) {
      wx.miniProgram.postMessage({
        data: { id: id },
      });
    },
    CreateHotContent(modelData) {

      // console.log(" modelData = ", modelData);
      this.clickHotpointDoonce++;

      if (modelData.id == "hit_yinfu" || modelData.id == "hit_yinfu2") {

        this.$refs.tuziMusic.play();

        this.$refs.YJmetaBase.ThreejsHumanChat.StopVideoById('video_tuzi_lr');


        let idAndb = [];
        idAndb.push({ id: 'hotpoint_tuzi', display: true });
        idAndb.push({ id: 'hit_tuzi', display: true });
        idAndb.push({ id: 'hit_tuzi2', display: true });
        idAndb.push({ id: 'tip_tuzi', display: true });

        idAndb.push({ id: 'tip_yinfu', display: false });
        idAndb.push({ id: 'hotpoint_yinfu', display: false });
        idAndb.push({ id: 'hit_yinfu', display: false });
        idAndb.push({ id: 'hit_yinfu2', display: false });

        idAndb.push({ id: 'video_tuzi_lr', display: true });
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplayArray(idAndb);
        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'hotpoint_tuzi',
        //   true
        // );
        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'hit_tuzi',
        //   true
        // );
        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'hit_tuzi2',
        //   true
        // );

        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'tip_tuzi',
        //   true
        // );


        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'tip_yinfu',
        //   false
        // );
        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'hotpoint_yinfu',
        //   false
        // );
        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'hit_yinfu',
        //   false
        // );

        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'hit_yinfu2',
        //   false
        // );


        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        //   'video_tuzi_lr',
        //   true
        // );




        this.$refs.YJmetaBase.ThreejsHumanChat.PlayVideoById(
          'video_tuzi_lr',
          false
        );


        // this.$refs.birdMusic.loop = true;
        // this.$refs.birdMusic.play();

        this.$refs.birdMusic.muted = !this.$refs.birdMusic.muted;
        this.$refs.birdMusic.play();
        this.$refs.bgMusic.pause();

        this.inMusic = true;
        this.music = true;
        this.inBgMusic = false;
        return;
      }

      if (this.sending) { return; }

      if (modelData.id == "hit_tuzi" || modelData.id == "hit_tuzi2") {
        this.jumpId = "1";
        this.JumpToWXmin("1");
        return;
      }
      if (modelData.id == "hit_coffee" || modelData.id == "hit_coffee2") {
        this.videoSrc = "coffee";
        this.inJumpVideo = true;

        this.jumpId = "3";

        // if (this.inMusic) {
        //   this.$refs.birdMusic.pause();
        // }

        this.$nextTick(() => {

          let videoWidth = window.innerWidth;
          let videoHeight = window.innerHeight;
          this.$refs.videoSrc.width = videoWidth;
          this.$refs.videoSrc.height = videoHeight;
          this.$refs.videoSrc.currentTime = 0;
          this.$refs.videoSrc.play();
        });
        // this.JumpToWXmin("3");
        return;
      }
      if (modelData.id == "hit_huo") {
        this.videoSrc = "liuxing";
        // this.inJumpVideo = true;
        this.inJumpVideo_liuxing = true;
        this.jumpId = "2";

        // if (this.inMusic) {
        //   this.$refs.birdMusic.pause();
        // }

        this.$nextTick(() => {

          let videoWidth = window.innerWidth;
          let videoHeight = window.innerHeight;
          this.$refs.videoSrc_liuxing.width = videoWidth;
          this.$refs.videoSrc_liuxing.height = videoHeight;
          this.$refs.videoSrc_liuxing.currentTime = 0;
          this.$refs.videoSrc_liuxing.play();
        });

        // this.JumpToWXmin("2");
        return;
      }
      return;

    },
    GetCameraRotaY(y) {
      // console.log("陀螺仪摄像机Y轴旋转" , y);
      // this.cameraRotaY = y;
      // sessionStorage.setItem("cameraRotaY", y);
    },
    denied() {
      // return;
      this.hasRequestDevice = true;
      this.mask = false;

      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        'hotpoint_mask',
        false
      );
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        'tip_mask',
        false
      );
    },
    granted() {
      this.hasRequestDevice = true;
      this.mask = false;

      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        'hotpoint_mask',
        false
      );

      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        'tip_mask',
        false
      );
      //禁止摄像机控制上下旋转
      this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(false);
      this.$refs.YJmetaBase.removeThreeJSfocus();

      this._YJGyro = new YJGyro(this.$refs.YJmetaBase.ThreejsHumanChat.scene, this.$refs.YJmetaBase.ThreejsHumanChat.camera, this);
      this.inGyro = true;

      this._YJControllerRota = new YJControllerRota(this.$refs.YJmetaBase.ThreejsHumanChat.GetThreeDocument(), this);



      // window.addEventListener('devicemotion', this.onDeviceMotion, false);
      window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
      window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);

      setTimeout(() => {
        this.TurnCameraRota("3");
      }, 100);
    },
    // 监听陀螺仪 加速度
    addListen() {
      // 陀螺仪
      let that = this;
      // window
      this.$refs.YJmetaBase.ThreejsHumanChat.AddThreeDocumentListener(() => {
        console.log("点击 threejs");
        if (!that.hasRequestDevice) {
          // if (typeof window.DeviceMotionEvent !== 'undefined' && typeof window.DeviceMotionEvent.requestPermission === 'function') {
          //   window.DeviceMotionEvent.requestPermission().then(state => {
          //     switch (state) {
          //       case "granted":
          //         that.granted();  
          //  that.hasRequestDevice  =true;
          //         break;
          //       case "denied": 
          //  that.hasRequestDevice  =true;
          //         break;
          //     }
          //   });
          // }

          if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
            window.DeviceOrientationEvent.requestPermission().then(state => {
              switch (state) {
                case "granted":
                  that.granted();
                  break;
                case "denied":
                  that.denied();
                  break;
              }
            });
          }

        }
      });

      // this.$refs.YJmetaBase.ThreejsHumanChat.GetThreeDocument().addEventListener('touchstart', () => {
      //   if (!hasRequestDevice) {
      //     if (typeof window.DeviceMotionEvent !== 'undefined' && typeof window.DeviceMotionEvent.requestPermission === 'function') {
      //       window.DeviceMotionEvent.requestPermission().then(state => {
      //         switch (state) {
      //           case "granted":
      //             that.granted();  
      //  that.hasRequestDevice  =true;
      //             break;
      //           case "denied": 
      //  that.hasRequestDevice  =true;
      //             break;
      //         }
      //       });
      //     }

      //     if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      //       window.DeviceOrientationEvent.requestPermission().then(state => {
      //         switch (state) {
      //           case "granted":
      //             that.granted();  
      //  that.hasRequestDevice  =true;
      //             break;
      //           case "denied": 
      //  that.hasRequestDevice  =true;
      //             break;
      //         }
      //       });
      //     }

      //   }
      // });

      // 加速度计
      // if (typeof window.DeviceMotionEvent !== 'undefined' && typeof window.DeviceMotionEvent.requestPermission === 'function') {
      //   window.DeviceMotionEvent.requestPermission().then(state => {
      //     switch (state) {
      //       case "granted": 
      //  that.hasRequestDevice  =true;
      //         that.granted(); 
      //         break;
      //       case "denied": 
      //  that.hasRequestDevice  =true;
      //         break;
      //     }
      //   });
      // }

      if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        window.DeviceOrientationEvent.requestPermission().then(state => {
          switch (state) {
            case "granted":
              that.granted();
              break;
            case "denied":
              that.denied();
              break;
          }
        });
      }


      let agent = navigator.userAgent.toLowerCase();
      console.log("agent ", agent);
      let android = agent.indexOf("android");
      if (android != -1) {

        this.granted();
        //加速度和重力加速度
        // window.addEventListener("devicemotion", that.onAndroidMotion);
        // window.addEventListener('deviceorientation', this.onAndroidDeviceOrientationChangeEvent, false);
        // window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);

      }

      // window.addEventListener('deviceorientation', this.onAndroidDeviceOrientationChangeEvent, false);
      //   window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
    },
    addListenFn() {
      // this.$refs.bgMusic.muted = !this.$refs.bgMusic.muted;
      this.$refs.bgMusic.play();

      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        'hotpoint_mask',
        false
      );

      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        'tip_mask',
        false
      );

      if (this.hasRequestDevice) {
        this.mask = false;
        return;
      }
      let that = this;
      console.log("click ");
      if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        window.DeviceOrientationEvent.requestPermission().then(state => {
          switch (state) {
            case "granted":
              that.granted();
              break;
            case "denied":
              that.denied();
              break;
          }
        });
      } else {
        this.mask = false;
      }

    },
    addListenFn2() {

      let that = this;
      console.log("click ");
      if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        window.DeviceOrientationEvent.requestPermission().then(state => {
          switch (state) {
            case "granted":
              that.granted();
              break;
            case "denied":
              that.denied();
              break;
          }
        });
      }
    },


    onScreenOrientationChangeEvent() {
      this._YJGyro.SetScreenOrientationChangeEvent();
    },
    onDeviceMotion(e) {
      // 有 4 个只读属性：
      // （1）accelerationIncludingGravity：重力加速度（包括重心引力9.8）
      // （2）acceleration：加速度（需要设备陀螺仪支持）
      // （3）rotationRate（alpha，beat，gamma）；旋转速度
      // （4）interval：获取的时间间隔 

      let { acceleration, accelerationIncludingGravity } = e;
      let { x, y, z } = acceleration;
      // let { x, y, z } = accelerationIncludingGravity;
      // let { beta, gamma,alpha } = acceleration;
      // let ss = acceleration.x + " " + acceleration.y + " " + acceleration.z

      var curTime = new Date().getTime();
      if (curTime - last_update > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        // var speed =
        //     (Math.abs(x + y + z - last_x - last_y - last_z) / diffTime) * 10000;

        var speed =
          ((x + y + z - last_x - last_y - last_z) / diffTime) * 10000;

        // var speedX = ((x - last_x) / diffTime) * 10000;
        // var speedY = ((y - last_y) / diffTime) * 10000;
        // var speedZ = ((z - last_z) / diffTime) * 10000;
        // this.acceleration.x = speedX.toFixed(1);
        // this.acceleration.y = speedY.toFixed(1);
        // this.acceleration.z = speedZ.toFixed(1);

        if (Math.abs(speed) > SHAKE_THRESHOLD) {
          this.acceleration.x = " 有效 移动";
          this.acceleration.z = speed > 0 ? " 前进 " : " 后退 ";
          this._YJGyro.MoveCameraForward();
        } else {
          this.acceleration.x = " 停止 移动";
          this.acceleration.z = " ";
        }
        this.acceleration.y = speed;



        last_x = x;
        last_y = y;
        last_z = z;
      }


      // console.log("获取ios设备 加速度 ", acceleration);
    },
    onDeviceOrientationChangeEvent(e) {
      // if(e.beta==undefined || e.beta==null ){return;}

      let orient = {};


      orient.beta = e.beta;
      orient.gamma = e.gamma;
      orient.alpha = e.alpha;

      if (orient.beta >= 100) { orient.beta = 100; }
      // if (orient.beta <= 60) { orient.beta = 60; }
      if (orient.beta <= 80) { orient.beta = 80; }


      // orient.beta = 90;
      // orient.gamma = 0;
      // orient.alpha = e.alpha.toFixed(2);


      let orient2 = {};
      orient2.beta = e.beta.toFixed(2);
      orient2.gamma = e.gamma.toFixed(2);
      orient2.alpha = e.alpha.toFixed(2);
      // console.log("获取ios设备陀螺仪 ", orient2);



      this._YJGyro.SetDeviceOrientationChangeEvent(orient);
    },

    onAndroidDeviceOrientationChangeEvent(e) {
      // console.log("获取安卓设备陀螺仪 ",e);

      let orient = {};
      orient.beta = e.beta;
      orient.gamma = e.gamma;
      orient.alpha = e.alpha;

      if (orient.beta >= 100) { orient.beta = 100; }
      if (orient.beta <= 60) { orient.beta = 60; }

      let orient2 = {};
      orient2.beta = e.beta.toFixed(2);
      orient2.gamma = e.gamma.toFixed(2);
      orient2.alpha = e.alpha.toFixed(2);

      // orient.beta =  (x) ;
      // orient.gamma = (y);
      // orient.alpha = (z);
      // orient.beta =  Math.round(x) ;
      // orient.gamma = -Math.round(y);
      // orient.alpha = -Math.round(z);

      console.log("获取安卓设备陀螺仪 ", orient2);

      this._YJGyro.SetDeviceOrientationChangeEvent(orient);
    },
  },
};
</script>

<style scoped>
.handAnimFn {
  animation: handAnim 1s infinite alternate linear;
}

.btnInAnimFn {
  animation: btnInAnim 0.5s alternate linear;
}

@keyframes handAnim {
  from {
    margin-top: 20px;
    margin-left: 90px;
  }

  to {
    margin-top: 8px;
    margin-left: 78px;
  }
}

@keyframes btnInAnim {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;

  }
}


.scale-70 {
  --tw-scale-x: .50;
  --tw-scale-y: .50;
}

/* video { 
  height: 100% !important;
  width: 100% !important;
  object-fit: fill;
} */
.videoCamera {

  position: absolute;
  z-index: -10;
  left: 0%;
  top: 0%;
  object-fit: fill;
  vertical-align: middle;
}

.z-60 {
  z-index: 60;
}

/* 阻止长按复制 */
.stop-long-hover {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.max-w-1200 {
  max-width: 1200px;
}
</style>
