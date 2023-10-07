<template>
    <div class=" absolute bottom-0 h-20 w-full self-center mx-auto  text-gray-800" @click="addListenFn">
        <div class=" inline-block bg-white rounded-lg shadow-md p-2 ">点击授权陀螺仪</div>
    </div>
</template>


<script>


import { YJGyroRequest } from "../js/YJGyroRequest.js";
// import { YJGyro } from "/@/threeJS/YJGyro.js";

var SHAKE_THRESHOLD = 120;
var last_update = 0;
var x, y, z, last_x, last_y, last_z = 0;

export default {
    name: "gyroindex",
    components: {
    },
    data() {
        return {
            acceleration: {},
            publicUrl: "",
            hasRequestDevice: false,
        };
    },

    created() {

    },
    mounted() {
        this._YJGyro = null;
        this.YJGyroRequest =  new YJGyroRequest();
        console.log(" in gyro ");

    },
    methods: {

        load3dComplete() {
            console.log("in load3dComplete 22222");

            //自动请求授权
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


            var that = this;
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
                })
                .catch((err) => {
                    console.log(err);
                });


            document.addEventListener(
                'WeixinJSBridgeReady',
                function () {
                    console.log(" 微信准备完成 camVideo ");
                    // videoTutorialSlash.play();
                    camVideo.play();
                },
                false
            );

        },

        denied() {
            // return;
            this.hasRequestDevice = true;
        },



        granted() {
            this.hasRequestDevice = true;

            //禁止摄像机控制上下旋转
            this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(false);
            this.$refs.YJmetaBase.removeThreeJSfocus();

            this._YJGyro = new YJGyro(this.$refs.YJmetaBase.ThreejsHumanChat.scene, this.$refs.YJmetaBase.ThreejsHumanChat.camera, this);
            this.inGyro = true;

            // this._YJControllerRota = new YJControllerRota(this.$refs.YJmetaBase.ThreejsHumanChat.GetThreeDocument(), this);

            // window.addEventListener('devicemotion', this.onDeviceMotion, false); //加速度
            window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
            window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);

        },
        // 监听陀螺仪 加速度
        addListen() {
            // 陀螺仪
            // 陀螺仪
            let that = this;
            // window
            this.$refs.YJmetaBase.ThreejsHumanChat.AddThreeDocumentListener(() => {
                console.log("点击 threejs");
                if (!that.hasRequestDevice) {
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
            }


            // window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
            // window.addEventListener( 'orientationchange',  onScreenOrientationChangeEvent, false );
        },


        addListenFn() {




            if (this.hasRequestDevice) {
                return;
            }


            let that = this;
            console.log(" 请求授权陀螺仪 ");
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


            let orient = {};
            orient.beta = e.beta;
            orient.gamma = e.gamma;
            orient.alpha = e.alpha;


            //   if (orient.beta >= 100) { orient.beta = 100; } //仰角限制
            // if (orient.beta <= 50) { orient.beta = 50; } //俯角限制


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

            //   if (orient.beta >= 100) { orient.beta = 100; } //仰角限制
            // if (orient.beta <= 50) { orient.beta = 50; } //俯角限制


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