/*
* 选中模型脚本
* 模型外轮廓高亮 同时颜色变色
*
* */
//*
import * as THREE from "three";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';


// document.write("<script type='text/javascript' src='js/three/Detector.js'></script>");
// document.write("<script type='text/javascript' src='js/three/shaders/CopyShader.js'></script>");
// document.write("<script type='text/javascript' src='js/three/shaders/FXAAShader.js'></script>");
// document.write("<script type='text/javascript' src='js/three/postprocessing/EffectComposer.js'></script>");
// document.write("<script type='text/javascript' src='js/three/postprocessing/RenderPass.js'></script>");
// document.write("<script type='text/javascript' src='js/three/postprocessing/ShaderPass.js'></script>");
// document.write("<script type='text/javascript' src='js/three/postprocessing/OutlinePass.js'></script>");

class YJOutLineController {
    constructor(scene, camera, renderer, _this) {

        var composer, effectFXAA, outlinePass;
        var selectedObjects = [];
        function init_outline() {
            // postprocessing
            console.log(" in outline ");

            composer = new EffectComposer(renderer);

            var renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);

            outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
            outlinePass.renderToScreen = true;

            outlinePass.selectedObjects = selectedObjects;

            // outlinePass.visibleEdgeColor.set(0xffffff); //外轮廓颜色
            // outlinePass.hiddenEdgeColor.set(0xffffff); //外轮廓颜色

            outlinePass.visibleEdgeColor.set(0x0000ff); //外轮廓颜色
            outlinePass.hiddenEdgeColor.set(0x0000ff); //外轮廓颜色

            outlinePass.edgeStrength = 3.0;        //外轮廓厚度
            outlinePass.edgeThickness = 1.0;        //外轮廓厚度



            composer.addPass(outlinePass);


            effectFXAA = new ShaderPass(FXAAShader);
            
            // console.log(effectFXAA);
            effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
            // effectFXAA.uniforms['resolution'].value.set(0 / window.innerWidth, 0 / window.innerHeight);

            effectFXAA.renderToScreen = true;
            composer.addPass(effectFXAA);

            // animate_outline();

        }
        let currentObj = null;
        this.addSelectedObject = function (object) {
            if (currentObj == object) { return; }
            currentObj = object;
            selectedObjects = [];
            selectedObjects.push(object);
            outlinePass.selectedObjects = selectedObjects;

            console.log("添加高亮物体 " + selectedObjects.length);

        }

        this.addAllMesh = function (object) { 
            // return;
            selectedObjects = [];
            for (let i = 0; i < object.length; i++) {
                selectedObjects.push(object[i]);
            } 
 
            outlinePass.selectedObjects = selectedObjects;
            console.log("添加高亮物体 " + selectedObjects.length);

        }

        this.clear = function () {
            currentObj = null;
            // selectedObjects = [];
            for (let i = selectedObjects.length -1; i >=0; i--) {
                // const element = array[i];
                selectedObjects.splice(i,1);
            }
            // outlinePass.selectedObjects = selectedObjects;
            outlinePass.selectedObjects = [];
        }

        init_outline();

        this.update = function(){
            composer.render();
        }
        function animate_outline() {
            requestAnimationFrame(animate_outline);
            composer.render();
        }
    }
}
export { YJOutLineController };
