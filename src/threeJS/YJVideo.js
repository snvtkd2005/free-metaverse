

import * as THREE from "three";

import { YJLoadModel } from "./YJLoadModel";


// 3d模型上播放透明视频

class YJVideo {
  constructor(_this, id, pointObj,videoType) {
    var scope = this;

    let color = new THREE.Color(0x0000ff);

    function Init() {

      // CreateTransparentTexture();
      if(videoType=="普通视频"){
        CreateVideo();
      }
      if(videoType=="左右视频"){
        CreateTransparentVideo();
      }
      if(videoType=="蓝底视频"){      
        CreateTransparentVideo2();
      }
      
      if(videoType=="绿底视频"){     
        color = new THREE.Color(0x00ff00);
        CreateTransparentVideo2();
      }
      // 
    }
    // 设置热点隐藏
    this.SetPointObjDisplay = function (b) {
      if (pointObj) { 
        pointObj.visible = b;
      }
    }
    let videoId = "id";

    this.SetVideoLoop=function(b){
      console.log("设置视频循环 " +videoId + " " + b );
      const video = document.getElementById(videoId); 
      video.loop = b; 
    }
    function GetVideoPropty(){
      let videoSrc = _this.GetPublicUrl() + "videos/" + videoId + ".mp4";
      const base = `<video id="${videoId
        }"  playsinline="true"
				webkit-playsinline="true" x5-video-player-type="h5-page" x5-video-player-fullscreen="true" muted src="${videoSrc}" ></video>`;
        // const base = `<video id="${videoId
        // }" preload playsinline="true"
				// webkit-playsinline="true" x5-video-player-type="h5-page" x5-video-player-fullscreen="true"  autoplay muted loop="loop"  src="${videoSrc}" ></video>`;
      
        return base;
    }

    
    this.PlayVideo = function (url) {
      const video = document.getElementById(videoId);
      video.src = url;
      video.muted = false;
      video.load();
      video.play();
      console.log(video);

      setTimeout(() => {

        const videoTexture = new THREE.VideoTexture(video);

        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;

        pointObj.material = GetLRmat(videoTexture);
      }, 200);
    }


    
    // 播放正常视频
    function CreateVideo() {

      videoId = id;
      _this.AddVideo(videoId,GetVideoPropty());

 
      setTimeout(() => {
        const video = document.getElementById(videoId); 

        setTimeout(() => {
          video.play();
        }, 200);

        const texture = new THREE.VideoTexture(video);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        pointObj.material = material;
      }, 200);
    }


    // 左右合成透明视频。 左黑白，右彩色
    
    // 左右合成透明图片。 左黑白，右彩色
    function CreateTransparentTexture(texPath) {
      //_this.GetPublicUrl() +"lrIcon.png"

      const map = new THREE.TextureLoader().load(texPath);
      map.minFilter = THREE.LinearFilter;
      map.magFilter = THREE.LinearFilter;
      map.format = THREE.RGBAFormat;

      pointObj.material =  GetLRmat(map);
    }

    // 左右合成透明图片或视频的材质球。 左黑白，右彩色
    function GetLRmat(pointTexture) {
      // shader stuff
      let uniforms = {
        time: { type: "f", value: 1.0 },
        pointTexture: { type: "sampler2D", value: pointTexture }
      };
      var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }`,
        fragmentShader: `#ifdef GL_ES
            precision highp float;
              #endif

            uniform float time;
              uniform sampler2D pointTexture;
              varying vec2 vUv;

            void main() {
            gl_FragColor = vec4(
            texture2D(pointTexture, vec2(0.5+vUv.x/2., vUv.y)).rgb,
            texture2D(pointTexture, vec2(vUv.x/2., vUv.y)).r
              );
              }`,
        transparent: true
      });
      return material; 
    }

    //扣绿幕视频或图片
    function GetChromaMat(video){
      

      uniforms = { 
        pointTexture: { type: "sampler2D", value: video },
        // backColor: { type: "vec3", value:new THREE.Color(0x00ff00) },
        backColor: { type: "vec3", value:color},
        u_threshold: { type: "f", value: 1 },
      };
      var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }`,
        fragmentShader: `
        

              uniform sampler2D pointTexture;
              uniform vec3 backColor;
              varying vec2 vUv;
              uniform float u_threshold;
              float u_clipBlack=0.01;
              float u_clipWhite=10.;
  
              float rgb2cb(float r, float g, float b){ return 0.5 + -0.168736*r - 0.331264*g + 0.5*b; } 
              float rgb2cr(float r, float g, float b){ return 0.5 + 0.5*r - 0.418688*g - 0.081312*b; } 
              float smoothclip(float low, float high, float x){ if (x <= low){ return 0.0; } if(x >= high){ return 1.0; } return (x-low)/(high-low); }
              vec4 greenscreen(vec4 colora, float Cb_key,float Cr_key, float tola,float tolb, float clipBlack, float clipWhite)
              { 
                float cb = rgb2cb(colora.r,colora.g,colora.b); 
                float cr = rgb2cr(colora.r,colora.g,colora.b); 
                float alpha = distance(vec2(cb, cr), vec2(Cb_key, Cr_key)); 
                  alpha = smoothclip(tola, tolb, alpha); 
                  float r = max(gl_FragColor.r - (1.0-alpha)*backColor.r, 0.0); 
                  float g = max(gl_FragColor.g - (1.0-alpha)*backColor.g, 0.0); 
                  float b = max(gl_FragColor.b - (1.0-alpha)*backColor.b, 0.0); 
                  if(alpha < clipBlack){ alpha = r = g = b = 0.0; } 
                  if(alpha > clipWhite){ alpha = 1.0; } 
                  if(clipWhite < 1.0){ alpha = alpha/max(clipWhite, 0.9); } 
                  return vec4(r,g,b, alpha); 
              }
              void main( void ) {
  
                  gl_FragColor = vec4(texture2D(pointTexture, vUv).rgb, 1);
  
                  float tola = 0.0; 
                  float tolb = u_threshold/2.0; 
                  float cb_key = rgb2cb(backColor.r, backColor.g, backColor.b); 
                  float cr_key = rgb2cr(backColor.r, backColor.g, backColor.b); 
                  gl_FragColor = greenscreen(gl_FragColor, cb_key, cr_key, tola, tolb, u_clipBlack, u_clipWhite);
                  
              }`,
        transparent: true
      });

      return material;
    }



    var uniforms;
    // 创建透明视频，左右视频。
    function CreateTransparentVideo() {

      videoId = id;  
      _this.AddVideo(videoId,GetVideoPropty());
      

      // _this.$nextTick(function () {

      // });
      setTimeout(() => {
        const video = document.getElementById(videoId);
        video.setAttribute('crossorigin', 'anonymous');
        console.log("从 video UI 中加载 3d video ");
        // video.oncanplay = function(){
        //   console.log("视频准备就绪");   //到循环点? 
        // };

        // video.onended = () => {
        //   video.play();
        // }
        // setTimeout(() => {
        //   video.play();
        // }, 200);
        video.load();
        const videoTexture = new THREE.VideoTexture(video);

        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;
       
        pointObj.material =  GetLRmat(videoTexture); 
        // animate();

      }, 200);


    }


    function CreateTransparentVideo2() {

      // let videoId = "music2";
       videoId = id;
      console.log("加载视频"+videoId);  

      _this.AddVideo(videoId,GetVideoPropty());
 
      setTimeout(() => {
        const video = document.getElementById(videoId);
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;

        video.play();

        video.onended = () => {
          video.play();
        }
        setTimeout(() => {
          video.play();
        }, 200);

       

       var material = GetChromaMat(videoTexture);
         
        pointObj.material = material;

        // animate();

      }, 200);


    }



    Init();
    var lastUpdate;
    // update();
    function animate() {
      var currentTime = new Date().getTime()
      var timeSinceLastUpdate = currentTime - lastUpdate;
      lastUpdate = currentTime;
      requestAnimationFrame(animate);
      render(timeSinceLastUpdate);

    }
    var updateId = null;

    function render(timeDelta) {
      uniforms.time.value += (timeDelta ? timeDelta / 1000 : 0.05);
    }

    // function update() {
    //   // updateId = requestAnimationFrame(update);
    //   uniforms.time.value += (timeDelta ? timeDelta / 1000 : 0.05);
    // }
  }
}


export { YJVideo };