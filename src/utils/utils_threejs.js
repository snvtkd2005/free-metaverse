
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

export const CreateFloorCollider = (scene,name)=> {
  // 坐标轴
  // let axes = new THREE.AxesHelper(20); // 坐标轴
  // scene.add(axes); // 场景添加坐标轴

  let planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10); // 生成平面
  let planeMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA }); // 材质
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;
  plane.receiveShadow = true;
  plane.name = name;
  scene.add(plane); // 向该场景中添加物体
  plane.renderOrder = -100;

  return plane;
}

/**
 * 创建GridHelper
 * @param {*} scene 
 * @param {*} size 
 * @param {*} divisions 
 */
export const CreateGrid = (scene,size,divisions)=> { 
  let gridHelper = null;
  gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper); 
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


// 骨骼高度相差太多时，缩小映射动作的骨骼Y轴偏移
export const createAnimationClipScale = (animName,scale, anim)=> {
  // console.log("获取动画 tracks ", anim.tracks);
  const tracks = anim.tracks;
  for (let i = 0; i < anim.tracks.length; i++) {
    let element = anim.tracks[i]; 
    const trackName = element.name;
    let values = element.values;
    if(trackName.includes("Hips.position")){
      for (let j = 0; j < element.values.length; j=j+3) {
        element.values[j+1] -= scale*100;  
      }
    }  
  } 

  // for (let i = anim.tracks.length-1; i >=0; i--) {
  //   let element = anim.tracks[i]; 
  //   const trackName = element.name;
  //   let values = element.values;
  //   if(trackName.includes("Hips.position")){
  //     anim.tracks.splice(i,1);
  //   }   
  // } 

  // console.log("获取动画 222  tracks ", tracks);

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