

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
        if(element.path == e.data.path){
          element.callback(AnimationDataToAnimationClip("", JSON.parse(e.data.data) ));
          allWorkerTask.splice(i,1);
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
      allWorkerTask.push({path:modelPath,callback});
      worker.postMessage({url:modelPath});
    } 
  
  }
}

export { YJLoadAnimation };