



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

class SceneManager_ddp {
  constructor(container, modelParent, indexVue, callback) {
    let scope = this;


    this.Init = function () {
      InitFn();
    }

    let camera, scene, renderer;
    let cameraOrtho, sceneOrtho;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const newpointer = new THREE.Vector2();
    let spriteTL, spriteTR, spriteBL, spriteBR, spriteC;

    let mapC;

    let group;

    let innerWidth, innerHeight;
    function InitFn() {
      // const width = window.innerWidth;
      // const height = window.innerHeight;
      // innerWidth = container.offsetLeft;
      // innerHeight =  container.offsetTop;

      innerWidth = window.innerWidth / 2;
      innerHeight = window.innerHeight / 2;

      const width = innerWidth;
      const height = innerHeight;

      // camera = new THREE.PerspectiveCamera(60, width / height, 1, 2100);
      // camera.position.z = 1500;

      cameraOrtho = new THREE.OrthographicCamera(- width / 2, width / 2, height / 2, - height / 2, 1, 10);
      cameraOrtho.position.z = 10;

      // scene = new THREE.Scene();
      // scene.fog = new THREE.Fog(0x000000, 1500, 2100);

      sceneOrtho = new THREE.Scene();

      // create sprites


      const textureLoader = new THREE.TextureLoader();

      textureLoader.load('textures/sprite0.png', createHUDSprites);



      // renderer

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(innerWidth, innerHeight);
      renderer.autoClear = false; // To allow render overlay on top of sprited sphere

      container.appendChild(renderer.domElement);

      container.addEventListener('pointerdown', onPointerDown);
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerup', onPointerUp);
      //

      window.addEventListener('resize', onWindowResize);
    }

    function createHUDSprites(texture) {

      texture.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.SpriteMaterial({ map: texture });

      const width = material.map.image.width / 2;
      const height = material.map.image.height / 2;

      group = new THREE.Group();
      sceneOrtho.add(group);
      for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
          let sprite = new THREE.Sprite(material);
          sprite.center.set(0.0, 0.0);
          sprite.scale.set(width, height, 1);
          sprite.position.set(- width + (x * width), - height + (y * height), 1); // bottom left
          group.add(sprite);
        }
      }

      group.position.set(- width - 100, - height - 100, 1); // bottom left

      updateHUDSprites();

    }

    function updateHUDSprites() {

      // const width = innerWidth / 2;
      // const height = innerHeight / 2;

      // // spriteTL.position.set( - width, height, 1 ); // top left
      // // spriteTR.position.set( width, height, 1 ); // top right
      // spriteBL.position.set(- width, - height, 1); // bottom left
      // // spriteBR.position.set( width, - height, 1 ); // bottom right
      // // spriteC.position.set( 0, 0, 1 ); // center

    }

    let selectObj = null;
    let selectObjPos = new THREE.Vector2();
    function onPointerDown(event) {

      // if ( selectedObject ) {

      // 	selectedObject.material.color.set( '#69f' );
      // 	selectedObject = null;

      // }

      pointer.x = (event.clientX / innerWidth) * 2 - 1;
      pointer.y = - (event.clientY / innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, cameraOrtho);

      const intersects = raycaster.intersectObject(group);

      if (intersects.length > 0) {

        const res = intersects.filter(function (res) {

          return res && res.object;

        })[0];

        if (res && res.object) {
          selectObj = res.object;
          selectObjPos.x = selectObj.position.x;
          selectObjPos.y = selectObj.position.y;
          console.log(res.object, selectObjPos);
          // selectedObject = res.object;
          // selectedObject.material.color.set( '#f00' );

        }

      }

    }

    function onPointerUp(event) {
      directionDoonce = 0;
      if (selectObj == null) {
        return;
      }
      selectObj.position.set(selectObjPos.x, selectObjPos.y, 1); // bottom left

      selectObj = null;
    }

    let directionDoonce = 0;
    let isMoveX = false;
    function onPointerMove(event) {
      if (selectObj == null) {
        return;
      }
      // if ( selectedObject ) {
      // 	selectedObject.material.color.set( '#69f' );
      // 	selectedObject = null;
      // }

      newpointer.x = (event.clientX / innerWidth) * 2 - 1;
      newpointer.y = - (event.clientY / innerHeight) * 2 + 1;


      let offsetX = (newpointer.x - pointer.x) * innerWidth / 2;
      let offsetY = (newpointer.y - pointer.y) * innerHeight / 2;
      if (directionDoonce < 1) {
        if (Math.abs(offsetX) > Math.abs(offsetY)) {
          isMoveX = true;
        } else {
          isMoveX = false;
        }
        directionDoonce++;
      }
      console.log("isMoveX " + isMoveX + " offsetX = " + offsetX + "  offsetY = " + offsetY);

      if (selectObj != null) {
        if (isMoveX) {
          selectObj.position.set(selectObjPos.x + offsetX, selectObjPos.y, 1);
        } else {
          selectObj.position.set(selectObjPos.x, selectObjPos.y + offsetY, 1);
        }
      }
    }

    function onWindowResize() {

      const width = innerWidth;
      const height = innerHeight;

      // camera.aspect = width / height;
      // camera.updateProjectionMatrix();

      cameraOrtho.left = - width / 2;
      cameraOrtho.right = width / 2;
      cameraOrtho.top = height / 2;
      cameraOrtho.bottom = - height / 2;
      cameraOrtho.updateProjectionMatrix();

      updateHUDSprites();

      renderer.setSize(innerWidth, innerHeight);

    }

    function animate() {

      requestAnimationFrame(animate);
      render();

    }

    function render() {

      const time = Date.now() / 1000;



      // renderer.clear();
      // renderer.render(scene, camera);
      renderer.clearDepth();
      renderer.render(sceneOrtho, cameraOrtho);

    }

    InitFn();
    animate();
  }
}

export { SceneManager_ddp };