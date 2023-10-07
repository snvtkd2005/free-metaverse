
import * as THREE from "three";

// YJScreen 组件 。 图片、视频、直播流容器

// 
class YJScreen {
  constructor(_this, model, screenId) {
    let scope = this;

    const blackMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });

    function Init() {
      // console.log("屏幕模型 ", model);
    }
    this.Reset = function () {
      
    }
    let material = null;

    this.Load = function (path) {

      let type = "image";
      if (path.includes(".mp4") || path.includes(".MP4")) {
        type = "mp4";
      }
      if (path.includes(".m3u8")) {
        type = "m3u8";
      }
      if (type == "image") {
        let map = _this._YJSceneManager.checkLoadTexture(path);


        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.material.dispose();
            item.material = blackMat;
          }
        });

        material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: map,
        });

        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.material = material;
          }
        });
        // setTimeout(() => {
        //   checkMatVaild();
        // }, 200);
      }
      if (type == "mp4" || type == "m3u8") {

        _this.AddVideo(screenId, type, (yjmedia) => {
          console.log(" yjmedia ", yjmedia);
          yjmedia.PlayVideoStream(path, true);
          const _video = document.getElementById(screenId);

          _video.setAttribute("crossorigin", "anonymous");
          _video.play();

          model.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.material.dispose();
              item.material = blackMat;
            }
          });

          const map = new THREE.VideoTexture(_video);
          material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: map,
          });

          console.log(" map ", map);

          model.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.material = material;
            }
          });
          console.log("视频准备就绪");

        });

      }


      // CheckBlackScreen(PosType);



    }
    function checkMatVaild() {
      if (material.map.source.data == null) {
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.material.dispose();
            item.material = blackMat;
          }
        });
      }

    }

    //删除模型
    this.Destroy = function () {

    }
    this.Init = function (_data) {
      this.Load(_data.url);
    }
    this.GetData = function () {

    }
    Init();
  }
}

export { YJScreen };