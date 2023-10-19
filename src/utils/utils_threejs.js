
import * as THREE from "three";
// import Fetch from "./Fetch";

/**
 * 判断两个vector3是否相等
 * @param {} v1 
 * @param {*} v2 
 * @returns 
 */
export const checkV3Equel = (v1, v2) => {
  return Math.abs(v1.z - v2.z) < 0.001
  || Math.abs(v1.x - v2.x) < 0.001
  || Math.abs(v1.y - v2.y) < 0.001;
}
 

// export const loadAssset = function (path, callback) {
//   // if(callback){
//   //   callback(Fetch({
//   //     method: "get",
//   //     url: path, 
//   //   }));
//   // }
//   return Fetch({
//     method: "get",
//     url: path, 
//   });
// }


// unity导出的动画txt转成 AnimationClip
/**
 * 
 * @param {动画名} animName 
 * @param {unity导出的动画数据json} data 
 * @returns 
 */
export const createAnimationClip = (animName, data)=> {
  // console.log("获取动画data", data);
  const tracks = [];

  let vectorKeyframeTrackList = data.vectorKeyframeTrackList;
  for (let i = 0; i < vectorKeyframeTrackList.length; i++) {
    const element = vectorKeyframeTrackList[i];
    const trackName = element.name;
    const times = element.times;
    const values = element.values;
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    tracks.push(track);
  }

  let quaternionKeyframeTrackList = data.quaternionKeyframeTrackList;
  for (let i = 0; i < quaternionKeyframeTrackList.length; i++) {
    const element = quaternionKeyframeTrackList[i];
    const trackName = element.name;
    const times = element.times;
    const values = element.values;
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
    tracks.push(track);
  }

  // 创建 AnimationClip
  const animationClip = new THREE.AnimationClip(animName, -1, tracks);
  animationClip.optimize();
  return animationClip;
}


export const createAnimationClip2 = (animName,boneList, data)=> {
  // console.log("获取动画data", data);
  const tracks = [];

  let vectorKeyframeTrackList = data.vectorKeyframeTrackList;

  for (let i = vectorKeyframeTrackList.length-1; i >=0 ; i--) {
    const element = vectorKeyframeTrackList[i];
    const trackName = element.name;
    let has = false;
    for (let j = 0; j < boneList.length; j++) {
      const bone = boneList[j];
      if(bone.refBone+'.position' == trackName ){
        element.name = bone.boneName+'.position';
        has = true;
      }
      if(bone.refBone+'.scale' == trackName ){
        element.name = bone.boneName+'.scale';
        has = true;
      }
      if(!has){
        vectorKeyframeTrackList.splice(i,1); 
      }
    }
  }



  for (let i = 0; i < vectorKeyframeTrackList.length; i++) {
    const element = vectorKeyframeTrackList[i];
    const trackName = element.name;
    const times = element.times;
    const values = element.values;
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    tracks.push(track);
  }

  let quaternionKeyframeTrackList = data.quaternionKeyframeTrackList;


  for (let i = 0; i < quaternionKeyframeTrackList.length; i++) {
    const element = quaternionKeyframeTrackList[i];
    const trackName = element.name;
    let has = false;
    for (let j = 0; j < boneList.length; j++) {
      const bone = boneList[j];
      if(bone.refBone+'.quaternion' == trackName ){
        element.name = bone.boneName+'.quaternion';
        has = true;
      } 
      if(!has){
        quaternionKeyframeTrackList.splice(i,1); 
      }
    }
  }


  for (let i = 0; i < quaternionKeyframeTrackList.length; i++) {
    const element = quaternionKeyframeTrackList[i];
    const trackName = element.name;
    const times = element.times;
    const values = element.values;
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
    tracks.push(track);
  }

  // 创建 AnimationClip
  const animationClip = new THREE.AnimationClip(animName, -1, tracks);
  animationClip.optimize();
  return animationClip;
}