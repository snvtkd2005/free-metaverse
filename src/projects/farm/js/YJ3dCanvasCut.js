

// 3D拍照/合照的平面。 有logo、水印、日期文字、地址位置文字

// 把3d场景画面保存到模型上
import * as THREE from "three";


// 拍照功能步骤
// 1，把当前threejs画面canvas放到plane模型上,放在中间；
// 2，在屏幕后面再放一个平面当做背景图
// 3，再放logo、水印图模型放在最前面

class YJ3dCanvasCut {
  constructor(_this,cutWidth,cutHeight, scene, renderer, camera) {


    this.Photo = function (callback) {
      if (scene == undefined) {
        scene = _this.scene;
        renderer = _this.renderer;
        camera = _this.camera;
      }

      let canvas = renderer.domElement;
      renderer.setPixelRatio(2); //推荐
      renderer.render(scene, camera);
      let dataBase64 = canvas.toDataURL("image/png");	//将canvas转成image类型 

      let image = new Image();
      image.src = dataBase64;	//将canvas转成image类型 

      setTimeout(() => {

        var nowcanvas = document.getElementById("cutcanvas");
        var nowcontext = nowcanvas.getContext("2d");
        let sourceWidth = window.innerWidth;
        let sourceHeight = window.innerHeight;
        // let cutWidth = parseInt(sourceWidth / 2);
        // let cutHeight = parseInt(sourceHeight / 2);

        let offsetX = parseInt(sourceWidth / 2 - cutWidth / 2);
        let offsetY = parseInt(sourceHeight / 2 - cutHeight / 2);


        let dataUrl = imgCut(nowcanvas, image, sourceWidth, sourceHeight, offsetX, offsetY, cutWidth, cutHeight);

        
        // let a = document.createElement("a");
        // // a.href = nowcanvas.toDataURL("image/jpeg");
        // // a.href =  image.src ;
        // a.href =  dataUrl ;
        // a.download = "sdf";
        // a.click();
        // a.remove();
        if (callback) {
          callback(dataUrl);
        }
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
      var canvas = document.getElementById("cutcanvas");
      return canvas.toDataURL("image/png");
    }
  }
}

export { YJ3dCanvasCut };