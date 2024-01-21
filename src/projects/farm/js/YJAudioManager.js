



import * as THREE from "three";


// 技能特效管理器
class YJAudioManager {
  constructor(_this, scene, npcPath, npcStoryData, sceneManager) {

    this.playAudio = async function (fireAudio) {
      if(!fireAudio){
        return;
      }

      let audioUrl = _this.$uploadAudioUrl + fireAudio + "?time=" + new Date().getTime()

      let audio = document.createElement("audio");
      audio.src = audioUrl;
      // audio.loop = true;
      audio.autoplay = true;
      audio.addEventListener("ended", ()=>{
        console.log(" 移除元素 ");
        audio.remove();
      }); 
      console.log(" 播放音效 ", audioUrl);

    }
    function init() {

    }

    init();
  }
}

export { YJAudioManager };