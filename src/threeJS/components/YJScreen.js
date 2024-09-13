
import * as THREE from "three";


import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// YJScreen 组件 。 图片、视频、直播流容器

// 
class YJScreen {
  constructor( model, screenId) {
    let scope = this;

    const blackMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    function Element( id, x, y, z, ry ) {

      const div = document.createElement( 'div' );
      div.style.width = '2000px';
      div.style.height = '1000px';
      div.style.backgroundColor = '#000';
      // div.style.transform = 'scale(0.2)'; 

      const iframe = document.createElement( 'iframe' );
      iframe.style.width = '2000px';
      iframe.style.height = '1000px';
      iframe.style.border = '0px';
      iframe.style.transform = 'scale(1)'; 

      iframe.src = [ 'https://space.bilibili.com/', id, '' ].join( '' );
      div.appendChild( iframe );

      const object = new CSS3DObject( div );
      object.position.set( x, y, z );
      object.rotation.y = ry;

      return object;

    }
    
    var controls, cssScene, cssRenderer;
    function createCssRenderer(w,h) {
      var cssRenderer = new CSS3DRenderer();
      cssRenderer.setSize(w,h);
      // cssRenderer.setSize(300, 200);

      cssRenderer.domElement.style.position = 'absolute';
      cssRenderer.domElement.style.top = 0;
      cssRenderer.domElement.style.zIndex = 0;
      // _Global.YJ3D.renderer.domElement.style.zIndex = 0;
      return cssRenderer;
  }  
  function Init() {
    return;
    console.log("屏幕模型 ", model);
    model.visible = false;
    let {w,h} = _Global.YJ3D.GetWidthHeight();
    cssRenderer = createCssRenderer(w,h);
    
    _Global.YJ3D.GetContainer().appendChild(cssRenderer.domElement);
    // cssRenderer.domElement.appendChild(_Global.YJ3D.renderer.domElement);

    // controls = new TrackballControls(_Global.YJ3D.camera);

    // _Global.YJ3D.renderer.domElement.appendChild(cssRenderer.domElement);

    cssScene = new THREE.Scene();
    let screen = new Element("512384170", -19, 0, 0, 0);
    console.log(screen);
    cssScene.add(screen)  ;
  }
    this.Reset = function () {
      
    }
    let material = null;

    this.Load = function (path,screenType) {

      let type = "image";
      if (path.includes(".mp4") || path.includes(".MP4")) {
        type = "mp4";
      }
      if (path.includes(".m3u8") || screenType == "m3u8") {
        type = "m3u8";
      }
      if (type == "image") {
        let map = _Global.YJ3D._YJSceneManager.checkLoadTexture(path);


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

        _Global.applyEvent("AddVideo",screenId, type, (yjmedia) => {
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
    this.SetMessage = function (_data) {
      this.Load(_data.url);
    }
    this.GetData = function () {

    }
    // this._update = function(){
      
    //   // controls.update();
    //   // cssRenderer.render(cssScene,_Global.YJ3D.camera);
    // }
    Init();
  }
}

export { YJScreen };