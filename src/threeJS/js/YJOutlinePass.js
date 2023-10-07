import * as THREE from "three";

//模型外轮廓高亮
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";


class YJOutlinePass {
  constructor(renderer,scene,camera,domElement) {
    if (domElement === undefined) {
      console.warn('THREE.YJOutlinePass: The second parameter "domElement" is now mandatory.');
      domElement = document;
    }

    // this.object = object;
    this.domElement = domElement;
    var mouse = new THREE.Vector2();

    //外轮廓高亮
    var composer, effectFXAA, outlinePass, renderPass;
    var saoPass;
    var selectedObjects = [];
    function init_outline_local() {
      // postprocessing

      //*
      // composer = new THREE.EffectComposer(renderer);
      // renderPass = new THREE.RenderPass(scene, camera);
      composer = new EffectComposer(renderer);
      renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      // outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
      outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
      outlinePass.renderToScreen = true;
      outlinePass.selectedObjects = selectedObjects;

      outlinePass.visibleEdgeColor.set(0xffffff); //外轮廓颜色
      outlinePass.hiddenEdgeColor.set(0xffffff); //外轮廓颜色 
      outlinePass.edgeStrength = 10.0;        //外轮廓厚度

      composer.addPass(outlinePass);
      //*/


      //*
      // effectFXAA = new THREE.ShaderPass(THREE.FXAAShader); //SMAAShader FXAAShader
      // effectFXAA = new ShaderPass(); //SMAAShader FXAAShader
      // effectFXAA = new ShaderPass(THREE.FXAAShader); //SMAAShader FXAAShader
      effectFXAA = new ShaderPass(FXAAShader); //SMAAShader FXAAShader
      effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
      // effectFXAA.uniforms['resolution'].value.set(0 / window.innerWidth, 0 / window.innerHeight);
      effectFXAA.renderToScreen = true;
      composer.addPass(effectFXAA);
      //*/

      console.log(" in local outline ");

      //                composer.render(scene, camera);

      // this.animate_outline();
      //*/
    }
    

    this.onMouseMove = function(event) {
      //                    document.getElementById("log").innerText= "正在222移动点";

      var x, y;

      if (event.changedTouches) {

        x = event.changedTouches[0].pageX;
        y = event.changedTouches[0].pageY;

      } else {

        x = event.clientX;
        y = event.clientY;

      }

      mouse.x = (x / window.innerWidth) * 2 - 1;
      mouse.y = - (y / window.innerHeight) * 2 + 1;

      checkIntersection();

    }
    
    this.onTouchEnd = function (event) {
      
      var x, y;

      if (event.changedTouches) {

        x = event.changedTouches[0].pageX;
        y = event.changedTouches[0].pageY;

      } else {

        x = event.clientX;
        y = event.clientY;

      }

      mouse.x = (x / window.innerWidth) * 2 - 1;
      mouse.y = - (y / window.innerHeight) * 2 + 1;

      checkIntersection();
      return;
      var touch = event.touches[0];

      mouse.x = (Number(touch.pageX) / window.innerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / window.innerHeight) * 2 + 1;
      checkIntersection();
    };
    var clickObject=null;
    var hoverObject=null;
    var inSelect = false;
    this.setClickObject = function(object){
      clickObject = object;
      selectedObjects = [];
      inSelect = clickObject!= null;

      if(clickObject== null){
      }else{
        selectedObjects.push(clickObject);
      }
      outlinePass.selectedObjects = selectedObjects;

      // selectedObjects.splice(0, selectedObjects.length);//清空数组
    }
    function addSelectedObject(object) {
      //                    document.getElementById("log").innerText= " 加入高亮模型数组 ";

      if (!inSelect) {

        selectedObjects = [];
        selectedObjects.push(object);
        return;
      }
      //当拖拽的模型高亮时，要不删除拖拽模型的高亮添加行的。所以是把数组里索引1的删除
      selectedObjects.splice(1, selectedObjects.length);//清空数组
      selectedObjects.push(object);

    }
    var raycaster = new THREE.Raycaster();

    function checkIntersection() {

      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(scene.getObjectByName('pointsParent').children, true);

      if (intersects.length > 0) {

        hoverObject = intersects[0].object;
        
        if(selectedObjects.length==2){
          if(hoverObject.name != clickObject.name){
            selectedObjects.splice(1, selectedObjects.length);//清空数组
            selectedObjects.push(hoverObject);
          }
        }else if(selectedObjects.length==1){
          if(inSelect){
            if(hoverObject.name != clickObject.name){
              selectedObjects.push(hoverObject);
            }
          }else{
            selectedObjects.splice(0, selectedObjects.length);//清空数组
            selectedObjects.push(hoverObject);

          }
        }else{
          selectedObjects.push(hoverObject);
        }

        // addSelectedObject(selectedObject);
        outlinePass.selectedObjects = selectedObjects;
        // console.log("使模型 高亮 " +hoverObject.name );
        inOutLine = true;

      } else {
        //拖拽模型高亮。
        // 点击空白区域，没有拖拽模型时，全部取消高亮


        if (inSelect) {
          if(selectedObjects.length==2){
            selectedObjects.splice(1, selectedObjects.length);//清空数组

          }else if(selectedObjects.length==1){
            
          }else{
            
          } 
          inOutLine = true;

          outlinePass.selectedObjects =selectedObjects;
        }else{
 
          // selectedObjects.splice(0, selectedObjects.length);//清空数组
          selectedObjects = [];
          outlinePass.selectedObjects =selectedObjects;
          inOutLine = false;
        }

        // if (drag_objects.length == 0) {
        //   outlinePass.selectedObjects = [];
        //   inOutLine = false;

        // }

        //点击空白区域，有拖拽模型时，取消不是拖拽模型的高亮
        // if (selectedObjects.length > 1) {
        //   selectedObjects.splice(1, selectedObjects.length);//清空数组
        //   outlinePass.selectedObjects = selectedObjects;
        // }
        // if (selectedObjects.length == 0) {
        //   inOutLine = false;
        // }
      }

    }
    var inOutLine = false;
    this.animate_outline =function() {
      if (!inOutLine) {
        return;
      }
      // console.log(" in outline count  " + outlinePass.selectedObjects.length );
     
      composer.render();
    }

    init_outline_local();
    this.dispose = function () {

      this.domElement.removeEventListener('mousemove', _onMouseMove);
      this.domElement.removeEventListener('touchend', _onTouchEnd, false);

    };
    
    const _onMouseMove = this.onMouseMove.bind(this);
    const _onTouchEnd = this.onTouchEnd.bind(this);

    this.domElement.addEventListener('mousemove', _onMouseMove);
    this.domElement.addEventListener('touchend', _onTouchEnd, false);

  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJOutlinePass };