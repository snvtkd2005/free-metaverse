

// 获取摄像头画面的像素

// 把3d场景画面保存到模型上
import * as THREE from "three";

class YJCameraImage {
  constructor(_this, scene, renderer, camera) {


    let photo_camera = null;
    let sourceWidth = 0;
    let sourceHeight = 0;
    this.GetCameraImagePixel = function (pos, rota, callback) {


      if (photo_camera == null) {
        photo_camera = new THREE.PerspectiveCamera(
          60,
          sourceWidth / sourceHeight,
          0.1,
          20
        );
        scene.add(photo_camera);

        sourceWidth = window.innerWidth;
        sourceHeight = window.innerHeight;
      }
      if (pos == undefined) {
        photo_camera.position.set(0, 1, 0);
        photo_camera.lookAt(0, 1.2, 1);
      } else {
        photo_camera.position.set(pos.x, pos.y, pos.z);
        photo_camera.rotation.set(rota.x, rota.y, rota.z);
      }


      let canvas = renderer.domElement;
      renderer.setPixelRatio(1); //推荐
      renderer.render(scene, photo_camera);
      let dataBase64 = canvas.toDataURL("image/jpeg");	//将canvas转成image类型 

      let image = new Image();
      image.src = dataBase64;	//将canvas转成image类型 

      setTimeout(() => {

        var nowcanvas = document.getElementById("nowcanvas");
        var nowcontext = nowcanvas.getContext("2d");
        let cutWidth = 100;
        let cutHeight = 100;
        // let cutWidth = parseInt(sourceWidth / 2);
        // let cutHeight = parseInt(sourceHeight / 2);
        let offsetX = parseInt(sourceWidth / 2 - cutWidth / 2);
        let offsetY = parseInt(sourceHeight / 2 - cutHeight / 2);


        imgCut(nowcanvas, image, sourceWidth, sourceHeight, offsetX, offsetY, cutWidth, cutHeight);
        let imageData = nowcontext.getImageData(0, 0, cutWidth, cutHeight);
        // console.log(imageData);

        let isNotBlack = false;
        let data = imageData.data;

        // console.log(data.length);

        for (let i = 0; i < data.length - 4 && !isNotBlack; i = i + 4) {
          // console.log(data[i],i);
          if (data[i] > 100 && data[i + 1] > 100 && data[i + 2] > 100) {
            isNotBlack = true;
          }
        }

        console.log("是否有画面 ", isNotBlack);

        if (callback) {
          callback(isNotBlack);
        }
        // let a = document.createElement("a");
        // a.href = nowcanvas.toDataURL("image/jpeg");
        // // a.href =  image.src ;
        // a.download = "sdf";
        // a.click();
        // a.remove();

      }, 200);



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







  }
}

export { YJCameraImage };