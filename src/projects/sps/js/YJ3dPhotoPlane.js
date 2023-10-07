

// 3D拍照/合照的平面。 有logo、水印、日期文字、地址位置文字

// 把3d场景画面保存到模型上
import * as THREE from "three";


// 拍照功能步骤
// 1，把当前threejs画面canvas放到plane模型上,放在中间；
// 2，在屏幕后面再放一个平面当做背景图
// 3，再放logo、水印图模型放在最前面

class YJ3dPhotoPlane {
  constructor(_this, scene, renderer, camera) {


    // 创建文字
    function createText(message, height) {

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let metrics = null;
      const textHeight = 100;
      context.font = 'normal ' + textHeight + 'px Arial';
      metrics = context.measureText(message);
      const textWidth = metrics.width;
      canvas.width = textWidth;
      canvas.height = textHeight;
      context.font = 'normal ' + textHeight + 'px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#ffffff';
      context.fillText(message, textWidth / 2, textHeight / 2);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: texture,
        transparent: true,
      });
      const geometry = new THREE.PlaneGeometry(
        (height * textWidth) / textHeight,
        height
      );
      const plane = new THREE.Mesh(geometry, material);
      return plane;

    }
    //创建背景框
    //水印图片
    //logo图片


    function CreateChatTransFn(parent, offset, chat, size) {
      let posTrans = new THREE.Group();
      parent.add(posTrans);
      posTrans.position.copy(offset);

      let lineTextHeight = 0.06;

      const resetButton = new THREE.Group();

      const resetButtonText = createText(chat, lineTextHeight);

      resetButton.add(resetButtonText);
      resetButtonText.position.set(0, 0, 0.0051);
      resetButtonText.scale.set(1, 1, 1);
      posTrans.add(resetButton);
      resetButton.name = "ignoreRaycast";
      resetButton.position.set(0, 0, 0);
      resetButton.scale.set(size, size, size);

    }
    this.Photo = function (callback) {
      // TestPlanePos(camera);return;
      // InitLocal();return;

      let canvas = renderer.domElement;
      renderer.setPixelRatio(2); //推荐
      renderer.render(scene, camera);
      let dataBase64 = canvas.toDataURL("image/jpeg");	//将canvas转成image类型 

      let image = new Image();
      image.src = dataBase64;	//将canvas转成image类型 

      setTimeout(() => {

        var nowcanvas = document.getElementById("nowcanvas");
        var nowcontext = nowcanvas.getContext("2d");
        let sourceWidth = window.innerWidth;
        let sourceHeight = window.innerHeight;
        let cutWidth = parseInt(sourceWidth / 2);
        let cutHeight = parseInt(sourceHeight / 2);
        let offsetX = parseInt(sourceWidth / 2 - cutWidth / 2);
        let offsetY = parseInt(sourceHeight / 2 - cutHeight / 2);


        imgCut(nowcanvas, image, sourceWidth, sourceHeight, offsetX, offsetY, cutWidth, cutHeight);

        Init(nowcanvas, callback);
      }, 200);
    }

    async function TestPlanePos(camera) {



      const textureLoader = new THREE.TextureLoader();

      // 画框背景
      CreatePlane(camera, await textureLoader.load("./farm/photoBG.png"), new THREE.Vector3(0.0, 0, -0), 2, 1.5);

      // logo
      CreatePlane(camera, await textureLoader.load("./farm/logo.png"), new THREE.Vector3(-0.7, 0.3, 0.02), 0.2, 0.2);
      //水印
      CreatePlane(camera, await textureLoader.load("./farm/watermask.png"), new THREE.Vector3(0, 0, 0.01), 2, 1);

      // 创建文字
      CreateChatTransFn(camera, new THREE.Vector3(0.46, -0.4, 0.02), "哈啊哈哈", 1);
      CreateChatTransFn(camera, new THREE.Vector3(0.46, -0.47, 0.02), "2023:02-11", 1);


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

      console.log("屏幕尺寸 : 显示图像：" + ratioW + " " + ratioH);

      let sourceWidth = image.width;
      let sourceHeight = image.height;
      console.log("原图大小为：" + image.width + " " + image.height);

      //从原图的哪个坐标位置开始截取 
      console.log("截图起始位置为：" + imageStartX + " " + imageStartY);

      //从原图中截取多大像素的区域 
      console.log("截图区域大小为：" + cutWidth + " " + cutHeight);




      var canvasWidth = cutWidth;
      var canvasHeight = cutHeight;
      console.log("画布大小为：" + canvasWidth + " " + canvasHeight);

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
    let photoPlane = null;
    function InitLocal() {

      let sourceWidth = window.innerWidth;
      let sourceHeight = window.innerHeight;

      let scale = sourceWidth / sourceHeight;
      // photoPlane.scale.set(scale,1,1);


      let canvas = renderer.domElement;
      renderer.setPixelRatio(2); //推荐
      renderer.render(scene, camera);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      texture.encoding = THREE.sRGBEncoding;
      // material.map = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.PlaneGeometry(scale, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
        // transparent: true,
        // opacity: 0,
        // alphaTest:true,
        // map: new THREE.CanvasTexture(canvas)
      });


      photoPlane = new THREE.Mesh(geometry, material);
      camera.add(photoPlane);
      photoPlane.position.set(0, 0, -2);


      CreateChatTransFn(photoPlane, new THREE.Vector3(0.2, -0.3, 0.2), "哈啊哈哈", 1);
      CreateChatTransFn(photoPlane, new THREE.Vector3(0.2, -0.4, 0.2), "2023:02-11", 1);

    }


    // 创建图片容器
    function CreatePlane(parent, texture, offsetPos, width, height) {
      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
        transparent: true,
        // opacity: 0,
        // alphaTest:true,
        // map: new THREE.CanvasTexture(canvas)
      });

      let plane = new THREE.Mesh(geometry, material);
      parent.add(plane);
      plane.position.copy(offsetPos);
      return plane;
    }


    let photo_scene = null;
    let photo_camera = null;
    let photo_renderer = null;
    function Init(canvas, callback) {


      let sourceWidth = window.innerWidth;
      let sourceHeight = window.innerHeight;
      if (photo_scene == null) {
      }
      photo_scene = new THREE.Scene();

      if (photo_camera == null) {
        photo_camera = new THREE.PerspectiveCamera(
          60,
          sourceWidth / sourceHeight,
          0.1,
          1000
        );
      }
      if (photo_renderer == null) {

        photo_renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
        photo_renderer.setSize(sourceWidth, sourceHeight);
        photo_scene.add(photo_camera);

        photo_renderer.outputEncoding = THREE.sRGBEncoding;

      }



      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      texture.encoding = THREE.sRGBEncoding;

      // 照片画面父物体
      let parent = new THREE.Group();
      photo_camera.add(parent);
      parent.position.set(0, 0, -2);

      CreatePlane(parent, texture, new THREE.Vector3(0, 0, -0.01), 1.5, 1.2);
      TestPlanePos(parent);



      setTimeout(() => {

        let canvas2 = photo_renderer.domElement;
        photo_renderer.setPixelRatio(4); //推荐
        photo_renderer.render(photo_scene, photo_camera);
        // canvas2.toDataURL("image/png"); 
        if (callback) {
          callback(canvas2.toDataURL("image/png"));
        }
        clearGroupFn(photo_camera);
      }, 1000);


    }
  
    function clearGroupFn(group) {
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          //移除碰撞体
          item.geometry.dispose();
          item.material.dispose();

        }
      };
      const removeObj = (obj) => {
        let arr = obj.children.filter((x) => x);
        arr.forEach((item) => {
          if (item.children.length) {
            removeObj(item);
          } else {
            clearCache(item);
            item.clear();
          }
        });
        obj.clear();
        arr = null;
      };
      removeObj(group);
    }

  }
}

export { YJ3dPhotoPlane };