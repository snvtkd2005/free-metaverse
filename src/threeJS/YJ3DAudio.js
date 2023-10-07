import * as THREE from "three";

import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';

// 加载 3d 音效
class YJ3DAudio {
  constructor(_this, scene, listener, audioPath, pos) {

    

    let play = false;
    let audio = null;
    this.play = function(b){
      play = b;
      if(audio == null){return;}
      if(b){
        audio.play();
      }else{
        audio.pause();
      }
    }

    this.load = function(_audioPath){
      audioPath = _audioPath;
      console.log("加载3d 音频 " +audioPath );
      loadMMD();

    }
    function loadMMD() {

      const audioParams = { delayTime: 160 * 1 / 30 };

      new THREE.AudioLoader().load(audioPath, function (buffer) {

        audio = new THREE.PositionalAudio(listener);
        //音频有效区域
        // positionalAudio.setDirectionalCone(180, 230, 0.1);
        audio.setBuffer(buffer); 
        audio.setRefDistance(12); 
        audio.setLoop(true);
        if(play){
        audio.play();
        }

        let group = new THREE.Group();
        // const AudioHelper = new PositionalAudioHelper( positionalAudio, 0.1 );
        // positionalAudio.add( AudioHelper );

        // const audio = new THREE.Audio(listener).setBuffer(buffer);

        group.position.set(pos.x, pos.y, pos.z); // 
        scene.add(group);
        group.add(audio);
        audio.position.set(0,0,0); // 
 
      });

    }
  
    function Init() {
      console.log("加载3d 音频 00000000 " );
    }

    Init();
 
    //删除模型
    this.Destroy = function () {
       
    } 
  }
}

export { YJ3DAudio };