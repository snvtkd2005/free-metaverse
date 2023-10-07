


// 3d角色展示页面


import * as THREE from "three";


class YJ3dScene_margeTexture {
  constructor(container, callback) {
    let scope = this;
    let scene = null;
    let renderer;
    let camera;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    let group;
    let width = 1024;
    let height = 1024;
    let playerGroup;

    let windowWidth, windowHeight;

    let facePlane, faceAddPlane;
    function Init() {

      console.log("初始化 合并贴图场景 ");
      scene = new THREE.Scene(); // 场景 
      // width = window.innerWidth;
      // height = window.innerHeight;
      // width = 1500;
      // height = 1080;
      camera = new THREE.PerspectiveCamera(
        60,
        width / height,
        0.01,
        10000
      );
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      renderer.setPixelRatio(1); //推荐

      renderer.outputEncoding = THREE.sRGBEncoding;

      // 照片画面父物体
      let parent = new THREE.Group();
      camera.add(parent);
      parent.position.set(0, 0, -3.15);
      // parent.position.set(0, 0, -2.924);


      facePlane = CreatePlane(parent, null, new THREE.Vector3(0, 0, -0.31), 2, 2);
      faceAddPlane = CreatePlane(parent, null, new THREE.Vector3(0, 0, -0.30), 2, 2);
      
      if(container){

        container.append(renderer.domElement);
        
      // let faceTex = await textureLoader.load("./public/farm/models/playerSkin/fbx/UTC_Default/utc001.png");
      // let faceAddTex = await textureLoader.load("./public/farm/models/playerSkin/fbx/face_add_001.png");
        TestPlanePos(camera, "./public/farm/models/playerSkin/fbx/UTC_Default/utc001.png", "./public/farm/models/playerSkin/fbx/face_add_001.png", callback);

      }
      // TestPlanePos(camera);
    }

    this.margeTexture = function (sourceTex, addTex, callback) {
      TestPlanePos(camera, sourceTex, addTex, callback);
    }
    // 创建图片容器
    function CreatePlane(parent, texture, offsetPos, width, height) {
      if(texture){
        texture.encoding = 3001; //3000  3001
        texture.flipY = false;
      }

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
        transparent: true,
      });

      let plane = new THREE.Mesh(geometry, material);
      parent.add(plane);
      plane.position.copy(offsetPos);
      return plane;
    }

    let laterTime = 20;
    async function TestPlanePos(camera, _faceTex, _faceAddTex, callback) {

      const textureLoader = new THREE.TextureLoader();


      // let faceTex = await textureLoader.load("./public/farm/models/playerSkin/fbx/UTC_Default/utc001.png");
      // let faceAddTex = await textureLoader.load("./public/farm/models/playerSkin/fbx/face_add_001.png");
      // console.log("加载原脸部贴图路径 ",_faceTex);

      // let faceTex = await textureLoader.load(_faceTex);
      // let faceAddTex = await textureLoader.load(_faceAddTex);

      const [texture] = await Promise.all([
        textureLoader.loadAsync(_faceTex),
      ]);
      let faceTex = texture;

      const [texture2] = await Promise.all([
        textureLoader.loadAsync(_faceAddTex),
      ]);
      let faceAddTex = texture2;

      // CreatePlane(parent, faceTex, new THREE.Vector3(0, 0, -0.31), 2, 2);
      // CreatePlane(parent, faceAddTex, new THREE.Vector3(0, 0, -0.30), 2, 2);

      facePlane.material.map = faceTex;
      faceTex.encoding = 3001; //3000  3001
      faceTex.flipY = false;

      faceAddPlane.material.map = faceAddTex;
      faceAddTex.encoding = 3001; //3000  3001
      faceAddTex.flipY = false;


      setTimeout(() => {

        let canvas = renderer.domElement;
        // renderer.setPixelRatio(2); //推荐
        renderer.render(scene, camera);
        let dataBase64 = canvas.toDataURL("image/jpeg");	//将canvas转成image类型 

        let image = new Image();
        image.src = dataBase64;	//将canvas转成image类型 

        setTimeout(() => {

          var nowcanvas = document.getElementById("nowcanvas");
          var nowcontext = nowcanvas.getContext("2d");

          let sourceWidth = width;
          let sourceHeight = height;
          // let cutWidth = parseInt(sourceWidth / 2);
          // let cutHeight = parseInt(sourceHeight / 2);
          let cutWidth = 512;
          let cutHeight = 512;
          let offsetX = parseInt(sourceWidth / 2 - cutWidth / 2);
          let offsetY = parseInt(sourceHeight / 2 - cutHeight / 2);

          let src = imgCut(nowcanvas, image, sourceWidth, sourceHeight, offsetX, offsetY, cutWidth, cutHeight);


          // let a = document.createElement("a");
          // a.href = nowcanvas.toDataURL("image/jpeg");
          // a.download = "sdf";
          // a.click();
          // a.remove();

          setTimeout(() => {
            if (callback) {
              callback(nowcanvas);
            }
          }, 20);

        }, 20);

      }, laterTime);



    }
    function imgCut(nowcanvas, image, imgElementW, imgElementH, imageStartX, imageStartY, cutWidth, cutHeight) {
      //清理画布，便于重新绘制
      // context.clearRect(0, 0, imgElementW, imgElementH);
      //计算 ：比例 = 原图像/显示图像
      var ratioW = image.width / imgElementW;
      var ratioH = image.height / imgElementH;

      imageStartX *= ratioW;
      imageStartY *= ratioH;



      cutWidth *= ratioW;
      cutHeight *= ratioH;

      // console.log("屏幕尺寸 : 显示图像：" + ratioW + " " + ratioH);

      let sourceWidth = image.width;
      let sourceHeight = image.height;
      // console.log("原图大小为：" + image.width + " " + image.height);

      //从原图的哪个坐标位置开始截取 
      // console.log("截图起始位置为：" + imageStartX + " " + imageStartY);

      //从原图中截取多大像素的区域 
      // console.log("截图区域大小为：" + cutWidth + " " + cutHeight);




      var canvasWidth = cutWidth;
      var canvasHeight = cutHeight;
      // console.log("画布大小为：" + canvasWidth + " " + canvasHeight);

      nowcanvas.width = cutWidth;
      nowcanvas.height = cutHeight;


      nowcanvas.getContext("2d").drawImage(
        image,
        imageStartX,
        imageStartY,
        cutWidth,
        cutHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      );
      var canvas = document.getElementById("nowcanvas");
      return canvas.toDataURL("image/jpeg");
    }

    function UpdateCheckWindowResize() {
      if (windowWidth == window.innerWidth && windowHeight == window.innerHeight) {

      } else {

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        if (true) {
          if (windowWidth <= windowHeight) {
            // 强制横屏
            _YJController.SetforcedLandscape(true);
          } else {
            _YJController.SetforcedLandscape(false);

          }

        } else {

        }

        width = container.clientWidth;
        height = container.clientHeight;

        onWindowResize(width, height);

      }


    }
    // 浏览器窗口变动触发的方法
    function onWindowResize(w, h) {

      // console.log("改变窗口大小");

      if (camera == null) {
        return;
      }
      // 重新设置相机宽高比例
      camera.aspect = w / h;
      // 更新相机投影矩阵
      camera.updateProjectionMatrix();
      // 重新设置渲染器渲染范围
      renderer.setSize(w, h);

    }



    // var updateId = null;
    // function update() {
    //   updateId = requestAnimationFrame(update);
    //   renderer.render(scene, camera);
    // }
    Init();


  }
}

export { YJ3dScene_margeTexture };