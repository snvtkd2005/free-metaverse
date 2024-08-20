
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
export const CreateBoxMesh = (scene, w, h, d, color, pos, rota) => {
  // cube
  const cubeGeometry = new THREE.BoxGeometry(w, h, d);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: color })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = cube.receiveShadow = true
  cube.position.copy(pos);
  cube.rotation.copy(rota);
  // cube.position.set(1.2, 0.2, -0.2)
  // cube.rotation.set(-Math.PI / 2, 0, 0)
  scene.add(cube)
  return cube;
}

export const CreateCapsuleCollider = (scene, height) => {
  // 坐标轴
  // let axes = new THREE.AxesHelper(20); // 坐标轴
  // scene.add(axes); // 场景添加坐标轴

  const geometry = new THREE.CapsuleGeometry(height / 2, 1, 4, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
  let capsule = new THREE.Mesh(geometry, material);
  capsule.name = "hoverCollider";
  scene.add(capsule);
  capsule.visible = false;
  capsule.position.set(0, height / 2, 0);
  return capsule;
}

export const CreateFloorCollider = (scene, name) => {
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
export const CreateGrid = (scene, size, divisions) => {
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



export const AnimationDataToAnimationClip = (animName, data) => {
  // console.log("获取动画data", data);
  const tracks = [];
  for (let i = 0; i < data.tracks.length; i++) {
    const element = data.tracks[i];
    const trackName = element.name;
    if(trackName.includes(".position")){
      const times = element.times;
      const values = element.values;
      const track = new THREE.VectorKeyframeTrack(trackName, times, values);
      tracks.push(track);
      continue;
    }
    if(trackName.includes(".quaternion")){
      const times = element.times;
      const values = element.values;
      const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
      tracks.push(track);
      continue;
    } 
  } 

  // 创建 AnimationClip
  const animationClip = new THREE.AnimationClip(animName, -1, tracks);
  animationClip.optimize();
  return animationClip;
}



// unity导出的动画txt转成 AnimationClip
/**
 * 
 * @param {动画名} animName 
 * @param {unity导出的动画数据json} data 
 * @returns 
 */
export const createAnimationClip = (animName, data) => {
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

export const createAnimationClip_mmd2mixamo = (animName, data) => {
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
    // const values = element.values;
    const values = [element.values.length];
    for (let i = 0; i < element.values.length; i = i + 4) {
      values[i] = element.values[i];
      values[i + 1] = element.values[i + 1] * -1;
      values[i + 2] = element.values[i + 2] * -1;
      values[i + 3] = element.values[i + 3];

    }
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
    tracks.push(track);
  }

  // 创建 AnimationClip
  const animationClip = new THREE.AnimationClip(animName, -1, tracks);
  animationClip.optimize();
  return animationClip;
}

export const createAnimationClip_mmd2mixamo2 = (animName, _tracks, quat) => {
  console.log(" 转换 前 ", _tracks);
  const tracks = [];
  for (let i = 0; i < _tracks.length; i++) {
    const element = _tracks[i];
    if ((element.name).includes("quaternion")) {
      const values = [element.values.length];
      for (let i = 0; i < element.values.length; i = i + 4) {
        // values[i] = element.values[i] - Math.PI/2  ;
        // // values[i] *=  -1 ;
        // values[i + 1] = element.values[i + 1] ;
        // values[i + 2] = element.values[i + 2] + Math.PI/2;
        // values[i + 3] = element.values[i + 3];
        // if((element.name).includes("左肩")){

        //   values[i] = element.values[i] +quat.x  ;
        //   // values[i] *=  -1 ;
        //   values[i + 1] = element.values[i + 1] + quat.y;
        //   values[i + 2] = element.values[i + 2] + quat.z;
        //   values[i + 3] = element.values[i + 3]+quat.w ;
        // }

        // values[i] = element.values[i] * -1;
        // values[i + 3] = element.values[i + 3] * -1;

        let quat2 = new THREE.Quaternion(element.values[i], element.values[i + 1],
          element.values[i + 2], element.values[i + 3]);

        // let quat2 = new THREE.Quaternion(-element.values[i], element.values[i + 1],
        // element.values[i + 2], -element.values[i + 3]);

        // let quat2 = new THREE.Quaternion(element.values[i], -element.values[i + 1],
        //   -element.values[i + 2], element.values[i + 3]);


        let v = new THREE.Euler();
        v.setFromQuaternion(quat2);
        // v.y -= Math.PI/2;
        // v.z *= -1;


        for (let i = 0; i < quat.length; i++) {
          const q = quat[i];
          if (element.name == (q.mmd + ".quaternion")) {
            v.x += q.rota.x;
            v.y += q.rota.y;
            v.z += q.rota.z;

            v.x *= q.scale.x;
            v.y *= q.scale.y;
            v.z *= q.scale.z;
          }
        }
        quat2.setFromEuler(v);

        values[i] = quat2.x;
        values[i + 1] = quat2.y;
        values[i + 2] = quat2.z;
        values[i + 3] = quat2.w;
        // let rotaV3 = new THREE.Vector3(v.x, v.y, v.z);

      }
      element.values = values;
    } else {
    }
    tracks.push(element);

  }
  console.log(" 转换 后 ", tracks);
  // 创建 AnimationClip
  const animationClip = new THREE.AnimationClip(animName + new Date().getTime(), -1, tracks);
  animationClip.optimize();
  return animationClip;
}

// 骨骼高度相差太多时，缩小映射动作的骨骼Y轴偏移
export const createAnimationClipScale = (animName, scale, anim) => {
  // console.log("获取动画 tracks ", anim.tracks);
  const tracks = anim.tracks;
  for (let i = 0; i < anim.tracks.length; i++) {
    let element = anim.tracks[i];
    const trackName = element.name;
    let values = element.values;
    if (trackName.includes("Hips.position")) {
      for (let j = 0; j < element.values.length; j = j + 3) {
        element.values[j + 1] -= scale * 100;
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


export const createAnimationClip2 = (animName, boneList, data) => {
  // console.log("获取动画data", data);
  const tracks = [];

  let vectorKeyframeTrackList = data.vectorKeyframeTrackList;

  for (let i = vectorKeyframeTrackList.length - 1; i >= 0; i--) {
    const element = vectorKeyframeTrackList[i];
    const trackName = element.name;
    let has = false;
    for (let j = 0; j < boneList.length; j++) {
      const bone = boneList[j];
      if (bone.refBone + '.position' == trackName) {
        element.name = bone.boneName + '.position';
        has = true;
      }
      if (bone.refBone + '.scale' == trackName) {
        element.name = bone.boneName + '.scale';
        has = true;
      }
      if (!has) {
        vectorKeyframeTrackList.splice(i, 1);
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
      if (bone.refBone + '.quaternion' == trackName) {
        element.name = bone.boneName + '.quaternion';
        has = true;
      }
      if (!has) {
        quaternionKeyframeTrackList.splice(i, 1);
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