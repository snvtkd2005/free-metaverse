



import * as THREE from "three";


// 技能特效管理器
class YJAudioManager {
  constructor(_this, scene, npcPath, npcStoryData, sceneManager) {

    let audioList = [];
    this.playAudio = async function (fireAudio,id) {
      if(!fireAudio){
        return;
      }

      let audioUrl = _this.$uploadAudioUrl + fireAudio + "?time=" + new Date().getTime()

      let audio = document.createElement("audio");
      audio.src = audioUrl;
      audio.volume = 0.5;
      // audio.loop = true;
      audio.autoplay = true;
      audio.addEventListener("ended", ()=>{
        // console.log(" 移除元素 ");
        audio.remove();
        if(id){
          // this.stopAudio(id);
        }else{
          audio.pause();
          audio.remove();
        }
      }); 
      // console.log(" 播放音效 ", fireAudio,id);
      // if(id){
      //   audioList.push({id:id,audio:audio});
      // }
    }
    this.stopAudio = function (id) {
      // console.log(" 中断音效 ",id,audioList);

      for (let i = audioList.length-1; i >=0; i--) {
        const element = audioList[i];
        if(element.id == id){
          element.audio.pause();
          element.audio.remove();
          audioList.splice(i,1);
          return;
        }
      } 
    }
    function init() {

    }

    init();
  }
}

export { YJAudioManager };