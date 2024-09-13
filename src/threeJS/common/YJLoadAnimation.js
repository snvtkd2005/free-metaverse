

import { AnimationDataToAnimationClip } from "/@/utils/utils_threejs.js";

// 使用worker其他线程加载。只加载骨骼动画
class YJLoadAnimation {
  constructor(_this ) {
    let scope = this;  
    let allWorkerTask = [];
    let worker = new Worker("./public/threeJS/YJLoadWorker.js");
    worker.onmessage = (e)=>{
      // console.log("in worker onmessage ",e.data);
      for (let i = allWorkerTask.length-1; i >=0; i--) {
        const element = allWorkerTask[i];
        if(element.type == e.data.type){
          if(element.type == "animFile"){
            if(element.path == e.data.path){
              element.callback(AnimationDataToAnimationClip("", JSON.parse(e.data.data) ));
              allWorkerTask.splice(i,1);
            }
          }

          if(element.type == "txtFile"){
            if(element.path == e.data.path){
              element.callback(e.data.data);
              allWorkerTask.splice(i,1);
            }
          }
          
          if(element.type == "meshFile"){
            if(element.path == e.data.path){
              element.callback((e.data.data));
              allWorkerTask.splice(i,1);
            }
          }

          
        }
      } 

    } 
    worker.onerror = (e)=>{
      console.error("in worker error ",e);
    } 
    this.load = function (modelPath, callback, errorback) {
      if(modelPath == undefined){
        if (callback) {
          callback(null);
        }
        return;
      } 
      allWorkerTask.push({type:"animFile",path:modelPath,callback});
      worker.postMessage({type:"animFile", url:modelPath});
    } 
    this.load_mesh = function (modelPath, callback, errorback) {
      if(modelPath == undefined){
        if (callback) {
          callback(null);
        }
        return;
      } 
      allWorkerTask.push({type:"meshFile",path:modelPath,callback});
      worker.postMessage({type:"meshFile", url:modelPath});
    } 

    this.loadAssset = function (url, callback, errorback) {
      if(url == undefined){
        console.error("未指定文本路径");
        return;
      } 
      allWorkerTask.push({type:"txtFile",path:url,callback});
      worker.postMessage({type:"txtFile", url:url});
    } 

  }
}

export { YJLoadAnimation };