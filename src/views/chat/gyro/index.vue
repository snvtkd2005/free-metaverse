<template>

    <div ref="cameraPanel" id="cameraPanel" style="position: absolute;z-index:-10;" class="cameraPanel  ">
        <video ref="videoCamera" id="videoCamera" playsinline="true" webkit-playsinline="true"
            x5-video-player-type="h5-page" x5-video-player-fullscreen=”true” autoplay></video>
    </div>

    <div :class="this.avatarData.setting.onlyLandscape ? 'main' : ''">

    </div>
    <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />
    <!-- 加载loading -->
    <loadingPanel class="absolute z-50 left-0 top-0 pointer-events-none" ref="loadingPanel" />

    <div class=" text-white ">
        <div>加速度X:{{ acceleration.x }}</div>
        <div>加速度Y:{{ acceleration.y }}</div>
        <div>加速度Z:{{ acceleration.z }}</div>
    </div>

</template>


<script>

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";
import AvatarData from "/@/data/playerSelectGyro.js";

import { YJGyro } from "/@/threeJS/YJGyro.js";

// 加载进度页
import loadingPanel from "./loadingPanel.vue";

var SHAKE_THRESHOLD = 120;
var last_update = 0;
var x, y, z, last_x, last_y, last_z = 0;

export default {
    name: "index",
    components: {
        YJmetaBase,
        loadingPanel,
    },
    data() {
        return {
            acceleration: {},
        };
    },

    created() {
        this.avatarData = AvatarData;
        this.$publicUrl += this.avatarData.setting.localPath;

    },
    mounted() {
        this._YJGyro = null;
        this.$refs.YJmetaBase.ClickeSelectOK();
        // 进度条发送到三维页
        this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);


        console.log(" in gyro ");
        this.getCompetence();
 
    },
    methods: {

        GetPublicUrl() {
            return this.$publicUrl;
        },
        OpenThreejs() {
            this.$refs.YJmetaBase.OpenThreejs();
        },
        
        load3dComplete() {
            this._YJGyro = new YJGyro(this.$refs.YJmetaBase.ThreejsHumanChat.scene,this.$refs.YJmetaBase.ThreejsHumanChat.camera, this);
            // this.Update();
            this.addListen();

        },
        OpenCamera() {

        },
        // 调用权限（打开摄像头功能）
        getCompetence() {

            let cameraPanel = document.getElementById("cameraPanel");
            let camVideo = document.getElementById("videoCamera");


            let videoWidth = window.innerWidth;
            let videoHeight = window.innerHeight;


            var _this = this;
            camVideo.width = videoWidth;
            camVideo.height = videoHeight;

            camVideo.style.display = "block";
            document.body.style = "background-color:#00000000";
            // 兼容代码
            window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL);



            // 获取媒体属性，旧版本浏览器可能不支持mediaDevices，我们首先设置一个空对象
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }

            var constraints = {
                // audio: false,

                // video: true,
                // video: { facingMode: "environment" } // 或者 "user"
                video: {
                    facingMode: "environment",
                    // width: videoWidth,
                    // height: videoHeight,

                    width: 1280, height: 720,

                    // width: this.videoWidth,
                    // height: this.videoHeight,
                    // transform: "scaleX(-1)",
                },
            };
            // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
            // 使用getUserMedia，因为它会覆盖现有的属性。
            // 这里，如果缺少getUserMedia属性，就添加它。
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function (constraints) {
                    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
                    // 首先获取现存的getUserMedia(如果存在)
                    // var getUserMedia = navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia ||  navigator.getUserMedia;
                    // 有些浏览器不支持，会返回错误信息
                    // 保持接口一致
                    if (!getUserMedia) {
                        //不存在则报错
                        return Promise.reject(
                            new Error("getUserMedia is not implemented in this browser")
                        );
                    }
                    // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                    return new Promise(function (resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                };
            }

            if (window.stream) {
                window.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }

            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function (stream) {
                    // console.log(stream);
                    // 旧的浏览器可能没有srcObject
                    if ("srcObject" in camVideo) {
                        camVideo.srcObject = stream;
                    } else {
                        // 避免在新的浏览器中使用它，因为它正在被弃用。
                        camVideo.src = window.URL && window.URL.createObjectURL(stream) || stream
                    }

                    camVideo.play();

                    // camVideo.onloadedmetadata = function (e) {
                    //   camVideo.play();
                    // };
                })
                .catch((err) => {
                    console.log(err);
                });


            document.addEventListener(
                'WeixinJSBridgeReady',
                function () {
                    console.log(" 微信准备完成 camVideo ");
                    videoTutorialSlash.play();
                    camVideo.play();
                },
                false
            );

        },
        // 监听陀螺仪 加速度
        addListen() {
            let hasRequestDevice = false;
            // 陀螺仪
            let that = this;
            window.addEventListener('click', () => {
                if (!hasRequestDevice) {
                    if (typeof window.DeviceMotionEvent !== 'undefined' && typeof window.DeviceMotionEvent.requestPermission === 'function') {
                        window.DeviceMotionEvent.requestPermission().then(state => {
                            switch (state) {
                                case "granted":
                                    window.addEventListener('devicemotion', that.onDeviceMotion, false);
                                    window.addEventListener('deviceorientation', that.onDeviceOrientationChangeEvent, false);
                                    window.addEventListener('orientationchange', that.onScreenOrientationChangeEvent, false);
                                    break;
                                case "denied":
                                    break;
                            }
                        });
                    }

                    if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {

                        window.DeviceOrientationEvent.requestPermission().then(state => {
                            switch (state) {
                                case "granted":
                                    window.addEventListener('devicemotion', that.onDeviceMotion, false);
                                    window.addEventListener('deviceorientation', that.onDeviceOrientationChangeEvent, false);
                                    window.addEventListener('orientationchange', that.onScreenOrientationChangeEvent, false);
                                    break;
                                case "denied":
                                    break;
                            }
                        });
                    }

                }


                // window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
                // window.addEventListener( 'orientationchange',  onScreenOrientationChangeEvent, false );
            });

            if (typeof window.DeviceMotionEvent !== 'undefined' && typeof window.DeviceMotionEvent.requestPermission === 'function') {
                window.DeviceMotionEvent.requestPermission().then(state => {
                    switch (state) {
                        case "granted":
                            hasRequestDevice = true;
                            window.addEventListener('devicemotion', that.onDeviceMotion, false);
                            window.addEventListener('deviceorientation', that.onDeviceOrientationChangeEvent, false);
                            window.addEventListener('orientationchange', that.onScreenOrientationChangeEvent, false);
                            break;
                        case "denied":
                            hasRequestDevice = true;
                            break;
                    }
                });
            }

            if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
                window.DeviceOrientationEvent.requestPermission().then(state => {
                    switch (state) {
                        case "granted":
                            hasRequestDevice = true;
                            window.addEventListener('devicemotion', that.onDeviceMotion, false);
                            window.addEventListener('deviceorientation', that.onDeviceOrientationChangeEvent, false);
                            window.addEventListener('orientationchange', that.onScreenOrientationChangeEvent, false);
                            break;
                        case "denied":
                            hasRequestDevice = true;
                            break;
                    }
                });
            }


            let agent = navigator.userAgent.toLowerCase();
            let android = agent.indexOf("android");
            if (android != -1) {

                //加速度和重力加速度
                window.addEventListener("devicemotion", that.onAndroidMotion);
                window.addEventListener('deviceorientation', that.onAndroidDeviceOrientationChangeEvent, false);
                window.addEventListener('orientationchange', that.onScreenOrientationChangeEvent, false);
            }
            
        // window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
        // window.addEventListener( 'orientationchange',  onScreenOrientationChangeEvent, false );
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
                    this.acceleration.z = speed>0?" 前进 ":" 后退 "; 
                    this._YJGyro.MoveCameraForward();
                }else{
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


            let orient = {};
            orient.beta = e.beta;
            orient.gamma = e.gamma;
            orient.alpha = e.alpha;

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
        onAndroidMotion(e) {

        },
        Update(){
            requestAnimationFrame(this.Update);
            this._YJGyro.MoveCameraForward();
        },


    },
};
</script>

<style>
.cameraPanel {
    position: absolute;
    z-index: -10;
    /* z-index: 0; */
    left: 0%;
    top: 0%;
    width: 100%;
    height: 100%;
    background-color: black;
}

#videoCamera {

    position: absolute;
    z-index: -10;
    left: 0%;
    top: 0%;
    /* width: 100%;
            height: 100%; */
    object-fit: fill;
}
</style>