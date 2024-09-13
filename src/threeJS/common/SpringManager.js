


import * as THREE from "three";
import { SpringBone } from "./SpringBone.js";

import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js';

import TWEEN from '@tweenjs/tween.js';
import { FaceBone } from "./FaceBone.js";
import { Tonemapping } from "./tonemapping.js";
import { YJLoadAnimation } from "/@/threeJS/common/YJLoadAnimation.js";
import { createAnimationClip, createAnimationClip_mmd2mixamo2, createAnimationClip2, createAnimationClipScale } from "/@/utils/utils_threejs.js";

class SpringManager {
    constructor() {
        let scope = this;

        let helper, ikHelper, physicsHelper;
        let mesh;
        let mainMesh = null;
        let scene;
        let group = new THREE.Group();

        const clock = new THREE.Clock();

        let sameBone = false;

        let currentAnimName = "idle2";
        let nextAnim = "";
        // let currentpmx_hair = "八重神子";
        let currentpmx_hair = "刻晴";
        let currentpmx_body = "刻晴";
        let currentActionIndex = 0;


        // const modelFile = './public/models/mmd/miku/12.pmx';
        // const modelFile = './public/models/mmd/miku/刻晴.pmx';
        // const modelFile_all = './public/models/mmd/miku/miku_v2.pmd';
        const modelFile_base = './public/models/mmd/miku/基础骨骼和刚体.pmx';
        // const modelFile_base = './public/models/mmd/miku/基础骨骼和刚体2.pmx';
        let hairList = [
            {
                part: "hair",
                name: "八重神子",
                url: "./public/models/mmd/miku/八重神子头发.pmx",
                offset: [0, -2, -0.3],
            },
            {
                part: "hair",
                name: "刻晴",
                url: "./public/models/mmd/miku/刻晴头发2.pmx",
                offset: [],
            },
            {
                part: "body",
                name: "刻晴",
                // url: "./public/models/mmd/miku/刻晴身体.pmx",
                url: "./public/models/mmd/miku/01 刻晴-霓裾翩跹/刻晴.pmx",

                offset: [],
            },
            {
                part: "body",
                name: "八重神子",
                url: "./public/models/mmd/miku/54 八重神子/八重神子.pmx",
                offset: [],
            },
        ];

        function GetHairByName(part, name) {
            for (let i = 0; i < hairList.length; i++) {
                const element = hairList[i];
                if (element.name == name && element.part == part) {
                    return element;
                }
            }
        }

        let vmdList = [
            {
                name: "idle",
                next: "idle2",
                url: "./public/models/mmd/vmds/idle.vmd",
                loop: true,
            },
            {
                name: "idle2",
                next: "idle",
                url: "./public/models/mmd/vmds/idle2.vmd",
                loop: true,
            },
            // {
            //     name:"idle3", 
            //     url:"./public/models/mmd/vmds/idle3.vmd", 
            //     loop:true,
            // },
            // {
            //     name:"idle4", 
            //     url:"./public/models/mmd/vmds/idle4.vmd", 
            //     loop:true,
            // },
            {
                name: "Running",
                // url: "./public/models/mmd/vmds/Standing Draw Arrow.json", //快速
                // url: "./public/models/mmd/vmds/T-Pose.fbx", //快速
                // url: "./public/models/mmd/vmds/Y Bot@Kiss.fbx", //快速
                url: "./public/models/mmd/vmds/Running.fbx", //快速
                // url: "./public/models/mmd/vmds/X Bot@Rifle Walk.fbx", //快速

                // url: "./public/models/mmd/vmds/walk001.vmd", //快速
                // url:"./public/models/mmd/vmds/walk002.vmd", //慢速
                loop: true,
            },
            {
                name: "TPose",
                url: "./public/models/mmd/vmds/T-Pose.fbx", //快速 
                loop: true,
            },
            {
                name: "run",
                url: "./public/models/mmd/vmds/15_RunwayModel.vmd",
                loop: true,
            },
            {
                name: "dance",
                url: "./public/models/mmd/vmds/wavefile_v2.vmd",
                loop: false,
            },
        ];

        function GetVmdByName(name) {
            for (let i = 0; i < vmdList.length; i++) {
                const element = vmdList[i];
                if (element.name == name) {
                    if (element.next) {
                        nextAnim = element.next;
                    } else {
                        nextAnim = "";
                    }
                    return element;
                }
            }
        }

        //#region  表情

        function initMorphs() {

            for (const key in dictionary) {

                morphs.add(controls, key, 0.0, 1.0, 0.01).onChange(onChangeMorph);

            }

        }

        function onChangeMorph() {

            for (let i = 0; i < keys.length; i++) {

                const key = keys[i];
                const value = controls[key];
                mesh.morphTargetInfluences[i] = value;

            }

        }
        //#endregion
        let modelList = [];
        let boneResetData = [];

        // 只加载动作
        function LoadAnimation(vmddata, mesh, callback) {
            let vmdFile = vmddata.url;
            for (let i = 0; i < modelList.length; i++) {
                const element = modelList[i];
                if (element.mesh == mesh) {
                    for (let j = 0; j < element.vmdFiles.length; j++) {
                        const _vmdFile = element.vmdFiles[j];
                        if (_vmdFile.vmdFile == vmdFile) {
                            if (element.currentActionIndex == _vmdFile.vmdIndex) {
                                return;
                            }

                            if (mainMesh == mesh) {
                                currentActionIndex = _vmdFile.vmdIndex;
                            }
                            //切换动作 
                            ChangeAnim(element.currentActionIndex, helper.objects.get(element.mesh).mixer, _vmdFile.vmdIndex, vmddata.loop);
                            element.currentActionIndex = _vmdFile.vmdIndex;
                            return;
                        }
                    }
                }
            }


            loader.loadAnimation(vmdFile, mesh, function (animation) {
                // console.log(animation);




                let mixer = helper.objects.get(mesh).mixer;
                // console.log(mixer);

                let vmdIndex = mixer._actions.length;
                for (let j = 0; j < mixer._actions.length; j++) {
                    if (mixer._actions[j]._clip == animation) {
                        vmdIndex = j;
                    }
                }


                // console.log(mixer._actions.length);

                for (let i = 0; i < modelList.length; i++) {
                    const element = modelList[i];
                    if (element.mesh == mesh) {
                        element.vmdFiles.push({ vmdFile: vmdFile, vmdIndex: vmdIndex });
                        // console.log("modelList vmdFiles 11 ",JSON.stringify(element.vmdFiles) );

                        // ChangeAnim(element, helper.objects.get(element.mesh).mixer, vmdIndex, vmddata.loop);
                        ChangeAnim2(element.currentActionIndex, helper.objects.get(element.mesh).mixer, mixer.clipAction(animation), vmddata.loop);
                        element.currentActionIndex = vmdIndex;

                    }
                }

                // console.log("modelList ",(modelList) );
                if (mainMesh == mesh) {
                    currentActionIndex = vmdIndex;
                }
                if (callback) {
                    callback();
                }

            });
        }
        function LoadMMD(loader, mmddata, vmddata, callback) {
            let { part, name, url, offset } = mmddata;
            let modelFile = url;

            let vmdFile = vmddata.url;
            let pos = new THREE.Vector3(0, 0, 0);
            if (offset.length == 3) {
                pos.x = offset[0];
                pos.y = offset[1];
                pos.z = offset[2];
            }
            for (let i = 0; i < modelList.length; i++) {
                const element = modelList[i];
                if (element.part.part == part && element.part.modelFile == modelFile) {
                    for (let j = 0; j < element.vmdFiles.length; j++) {
                        const _vmdFile = element.vmdFiles[j];
                        if (_vmdFile.vmdFile == vmdFile) {
                            if (element.currentActionIndex == _vmdFile.vmdIndex) {
                                return;
                            }
                            let tt = undefined;
                            if (mainMesh) {
                                tt = helper.objects.get(mainMesh).mixer._actions[currentActionIndex].time;
                            }
                            //切换动作 模型存在且动作也存在时，直接切换其动作
                            ChangeAnim(element.currentActionIndex, helper.objects.get(element.mesh).mixer, _vmdFile.vmdIndex, vmddata.loop, tt);
                            element.currentActionIndex = _vmdFile.vmdIndex;
                            return;
                        }
                    }
                }
            }

            loader.loadWithAnimation(modelFile, vmdFile, function (mmd) {

                let mesh = mmd.mesh;
                mesh.position.copy(pos);
                let scale = 0.999;
                // let scale = 0.1;
                mesh.scale.set(scale, scale, scale);
                group.add(mesh);
                if (part == "body") {
                    mmdBoneList = [];
                    baseMMDBoneList = [];
                    mesh.traverse((item) => {
                        if (item.type == "Bone") {
                            mmdBoneList.push({ mesh: item, boneName: item.name, rota: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } });
                            baseMMDBoneList.push({ boneName: item.name, mesh: item });

                            // for (let j = 0; j < boneRefList.length; j++) {
                            //     const mmdBone = boneRefList[j];
                            //     if ((item.name == mmdBone.mmd)) {
                            //         item.add(new THREE.AxesHelper(1));
                            //     }
                            // }
                            // _Global.YJ3D._YJSceneManager._YJTransformManager.attach(
                            //     item
                            // );
                        }
                        if (item instanceof THREE.Mesh) {
                            item.frustumCulled = false;  //解决物体在某个角度不显示的问题
                        }
                    });
                    new FaceBone(mesh);

                    // let skeleton = new THREE.SkeletonHelper(mesh);
                    // skeleton.visible = true;
                    // scene.add(skeleton);
                }
                if (part == "body" || !sameBone) {

                    // 如果动作文件中的骨骼名不同，则需要记录初始骨骼坐标和旋转
                    // 如果所有动作文件中的骨骼名与当前模型骨骼名相同，则不需要此记录
                    let has = false;
                    for (let i = 0; i < boneResetData.length; i++) {
                        const element = boneResetData[i];
                        if (element.part == part && element.modelFile == modelFile) {
                            has = true;
                        }
                    }
                    if (!has) {
                        for (let i = boneResetData.length - 1; i >= 0; i--) {
                            const element = boneResetData[i];
                            if (element.part == part) {
                                boneResetData.splice(i, 1);
                            }
                        }
                        let boneData = [];
                        mesh.traverse((item) => {
                            if (item.type == "Bone") {
                                boneData.push({ bone: item, boneName: item.name, pos: item.position.clone(), quat: item.quaternion.clone() });
                            }
                        });
                        // console.log("首次加载，保存骨骼初始数据 ",part);
                        boneResetData.push({ modelFile, part, boneData });
                    }

                    // console.log(mesh);
                }

                let world = undefined;
                for (let i = 0; i < modelList.length; i++) {
                    const element = modelList[i];
                    if (element.part.part == part) {
                        if (element.part.modelFile == modelFile) {

                        } else {



                            // if (part == "hair") {
                            //     let oldPos ;
                            //     element.mesh.traverse((item) => {
                            //         console.log(item.name);
                            //         if (item.name == "首") {
                            //             oldPos = item.getWorldPosition(new THREE.Vector3());
                            //         }
                            //     });
                            //     let ah = new THREE.AxesHelper(100);
                            //     ah.position.copy(oldPos);
                            //     group.add(ah);

                            //     let newPos ;
                            //     mesh.traverse((item) => {
                            //         console.log(item.name);
                            //         if (item.name == "首") {
                            //             newPos = item.getWorldPosition(new THREE.Vector3());
                            //         }
                            //     });

                            //     let ah2 = new THREE.AxesHelper(100);
                            //     ah2.position.copy(newPos);
                            //     group.add(ah2);

                            //     let offset = newPos.clone().sub(oldPos);
                            //     mesh.position.copy(offset.multiplyScalar(-1));
                            //     console.log(oldPos,newPos,offset);
                            // }

                            group.remove(element.mesh);
                            _Global.YJ3D._YJSceneManager.clearObject(element.mesh);
                            if (helper.objects.get(element.mesh)) {
                                let { physics, grantSolver, ikSolver } = helper.objects.get(element.mesh);
                                if (physics) {
                                    world = physics.world;
                                    physics.destroy();
                                    physics = undefined;
                                }

                                helper.remove(element.mesh);
                            }
                        }
                    }
                }

                helper.add(mesh, {
                    animation: mmd.animation,
                    world: world,
                    // physics: true
                });


                console.log(helper);


                let mixer = helper.objects.get(mesh).mixer;

                let vmdIndex = mixer ? (mixer._actions.length) : 0;
                let has = false;
                for (let i = 0; i < modelList.length && !has; i++) {
                    const element = modelList[i];
                    if (element.part.part == part) {

                        if (element.part.modelFile == modelFile) {
                            element.vmdFiles.push({ vmdFile: vmdFile, vmdIndex: vmdIndex });
                        } else {

                            element.mesh = mesh;
                            element.part.modelFile = modelFile;
                            element.vmdFiles = [];
                            vmdIndex = 0;
                            element.vmdFiles.push({ vmdFile: vmdFile, vmdIndex: vmdIndex });
                        }
                        has = true;
                        element.currentActionIndex = vmdIndex;
                    }
                }
                if (!has) {
                    vmdIndex = 0;
                    modelList.push({ mesh, part: { part: part, modelFile }, vmdFiles: [{ vmdFile: vmdFile, vmdIndex: vmdIndex }], currentActionIndex: vmdIndex });
                }

                if (mainMesh && mixer) {
                    let tt = helper.objects.get(mainMesh).mixer._actions[currentActionIndex].time;
                    // console.log(currentActionIndex, tt);
                    helper.objects.get(mesh).mixer._actions[vmdIndex].time = tt;


                    let action = mixer.clipAction(mmd.animation);
                    if (vmddata.loop) {
                        action.loop = THREE.LoopRepeat;
                        // action.loop = THREE.LoopPingPong;
                    } else {
                        action.loop = THREE.LoopOnce;
                        action.clampWhenFinished = true;
                    }

                    if (part == "body") {
                        console.log("part == body action ", action);
                    }

                    // 
                    action.setEffectiveWeight(1);
                    action.setEffectiveTimeScale(1);
                    action.reset();
                    action.play();

                }
                if (true) {
                    // console.log(" boby ", mesh);
                    let materials = mesh.material;
                    let matIndex = -1;
                    let newMat = null;
                    for (let i = 0; i < materials.length; i++) {
                        let mat = materials[i];
                        if (mat.map) {
                            mat.map.encoding = 3001;
                        }
                        matIndex = i;
                        mesh.material[matIndex] = ChangeMat(mat);
                        // console.log(" 换材质 ", mat);
                    }
                    // if (matIndex != -1) {
                    //     mesh.material[matIndex] = newMat;
                    // } 
                    mesh.castShadow = true;
                    // mesh.receiveShadow = true;


                }
                if (callback) {
                    callback()
                }
                // setTimeout(() => {

                //     if (helper.objects.get(mesh)) {
                //         let { physics, grantSolver, ikSolver } = helper.objects.get(mesh);
                //         if (physics) {
                //             physics.Pause();
                //             // for (let i = 0; i < 100; i++) {

                //             //     physics._updateRigidBodies(); 
                //             //     physics._stepSimulation(0.0333);
                //             //     physics._updateBones();
                //             // }
                //             // setInterval(() => {
                //             //     physics._stepSimulation(0.0333);
                //             // }, 20);

                //             // physics.reset(); 
                //             setTimeout(() => {
                //                 physics.Play();
                //             }, 1000);
                //         }
                //     }

                // }, 100);




                // console.log(helper.objects.get(mesh));

                // if(ikHelper){
                //     scene.remove(ikHelper);
                // }
                // ikHelper = helper.objects.get(mesh).ikSolver.createHelper();
                // ikHelper.visible = true;
                // // ikHelper.scale.set(scale, scale, scale);
                // scene.add(ikHelper);

                // if (physicsHelper) {
                //     scene.remove(physicsHelper);
                // }
                // physicsHelper = helper.objects.get(mesh).physics.createHelper();
                // physicsHelper.visible = true;
                // // physicsHelper.scale.set(scale, scale, scale);
                // scene.add(physicsHelper);

                // _Global.YJ3D._YJSceneManager._YJTransformManager.attach(
                //    mesh
                // );

            }, null, null);
        }
        function LoadPMD(loader, modelFile) {
            loader.load(modelFile, function (object) {
                let mesh = object;
                mesh.position.x = - 1;
                let scale = 0.1;
                mesh.scale.set(scale, scale, scale);
                group.add(mesh);
            });

        }
        function ChangeAnim(currentActionIndex, mixer, animIndex, loop, time) {
            for (let j = 0; j < mixer._actions.length; j++) {
                if (j != currentActionIndex) {
                    let action = mixer.clipAction(mixer._actions[j]._clip);
                    action.setEffectiveWeight(0);
                    action.setEffectiveTimeScale(0);
                }
            }

            // console.log(" loop  = ",loop);
            let action = mixer.clipAction(mixer._actions[animIndex]._clip);
            if (loop) {
                action.loop = THREE.LoopRepeat;
                // action.loop = THREE.LoopPingPong;

            } else {
                action.loop = THREE.LoopOnce;
                action.clampWhenFinished = true;
            }
            // 
            action.setEffectiveWeight(0);
            action.setEffectiveTimeScale(0);
            action.reset();
            action.play();

            let action_old = mixer.clipAction(mixer._actions[currentActionIndex]._clip);
            ClampAnim(action_old, action);
            if (time != undefined) {
                mixer._actions[animIndex].time = time;
            }

        }
        function ChangeAnim2(currentActionIndex, mixer, action, loop) {
            for (let j = 0; j < mixer._actions.length; j++) {
                if (j != currentActionIndex) {
                    let action = mixer.clipAction(mixer._actions[j]._clip);
                    action.setEffectiveWeight(0);
                    action.setEffectiveTimeScale(0);
                }
            }

            if (loop) {
                action.loop = THREE.LoopRepeat;
                // action.loop = THREE.LoopPingPong;
            } else {
                action.loop = THREE.LoopOnce;
                action.clampWhenFinished = true;
            }
            // 
            action.setEffectiveWeight(0);
            action.setEffectiveTimeScale(0);
            action.reset();
            action.play();


            let action_old = mixer.clipAction(mixer._actions[currentActionIndex]._clip);
            ClampAnim(action_old, action);
        }

        function ClampAnim(oldAction, newAction) {

            let _from = new THREE.Vector3(1, 1, 1);
            let _to = new THREE.Vector3(0, 0, 0);
            TweenAlpha(_from, _to, 0.21 * 1000, (f) => {

                oldAction.setEffectiveWeight(f);
                oldAction.setEffectiveTimeScale(f);
                newAction.setEffectiveWeight(1 - f);
                newAction.setEffectiveTimeScale(1 - f);

                // console.log(f);
            });
            // console.log(newAction);

            if (!sameBone) {
                // 如果动作文件中的骨骼名不同，则需要记录初始骨骼坐标和旋转
                // 如果所有动作文件中的骨骼名与当前模型骨骼名相同，则不需要此记录
                for (let i = 0; i < boneResetData.length; i++) {
                    const boneData = boneResetData[i].boneData;
                    for (let j = 0; j < boneData.length; j++) {
                        const element = boneData[j];
                        element.bone.position.copy(element.pos);
                        element.bone.quaternion.copy(element.quat);
                    }
                }
            }
        }


        function TweenAlpha(from, _to, duration, update, onComplete) {
            let current = from.clone();
            let to = _to.clone();
            let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
            let updateTargetPos = () => {
                if (update) {
                    update(current.x);
                }
            }
            movingTween.onUpdate(updateTargetPos);
            movingTween.start() // 启动动画
            movingTween.onComplete(() => {
                if (onComplete) {
                    onComplete();
                }
            });
        }

        let myanimation;
        const loader = new MMDLoader();
        function anycToMain() {

            if (mainMesh == null) {
                return;
            }
            let tt = helper.objects.get(mainMesh).mixer._actions[currentActionIndex].time;
            for (let i = 0; i < modelList.length; i++) {
                const element = modelList[i];
                if (element.mesh != mainMesh) {
                    helper.objects.get(element.mesh).mixer._actions[element.currentActionIndex].time = tt;
                }
            }
        }
        // let boneRefList = [
        //     // {mmd:"全ての親",mixamo:"mixamorigHips"},
        //     { mmd: "首", mixamo: "mixamorigNeck",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1}},
        //     { mmd: "頭", mixamo: "mixamorigHead",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1} },

        //     { mmd: "上半身", mixamo: "mixamorigSpine",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1} },
        //     { mmd: "上半身3", mixamo: "mixamorigSpine1",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1}},
        //     { mmd: "上半身2", mixamo: "mixamorigSpine2",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1} },

        //     { mmd: "左肩", mixamo: "mixamorigLeftShoulder" ,rota: {x:-Math.PI/2,y:0,z:Math.PI/2}, scale: {x:1,y:1,z:1}},
        //     { mmd: "左腕", mixamo: "mixamorigLeftArm",rota: {x:-0.3831655715591927,y:
        //         -0.03767673450460207,z:0.024267254730080234}, scale: {x:1,y:1,z:1} },
        //     { mmd: "左ひじ", mixamo: "mixamorigLeftForeArm",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1} },
        //     { mmd: "左手首", mixamo: "mixamorigLeftHand",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1} },

        //     { mmd: "右肩", mixamo: "mixamorigRightShoulder" ,rota: {x:-Math.PI/2,y:0,z:-Math.PI/2}, scale: {x:1,y:1,z:1}},
        //     { mmd: "右腕", mixamo: "mixamorigRightArm",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1} },
        //     { mmd: "右ひじ", mixamo: "mixamorigRightForeArm",rota: {x:0,y:Math.PI/2,z:0}, scale: {x:1,y:1,z:1} },
        //     { mmd: "右手首", mixamo: "mixamorigRightHand",rota: {x:0,y:0,z:0}, scale: {x:1,y:1,z:1} },
        // ];

        // センター   腰
        let boneRefList = [
            {
                "mmd": "右人指１",
                "mixamo": "mixamorigRightHandIndex1",
                "baseRota2": {
                    "x": 0.6398695777091628,
                    "y": -0.3009436075205255,
                    "z": 0.6398691432893095,
                    "w": -0.30094409560662355
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右人指２",
                "mixamo": "mixamorigRightHandIndex2",
                "baseRota2": {
                    "x": 0.6398695423998698,
                    "y": -0.30094370735278114,
                    "z": 0.6398691247856726,
                    "w": -0.30094411019193823
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右人指３",
                "mixamo": "mixamorigRightHandIndex3",
                "baseRota2": {
                    "x": 0.6398695609033812,
                    "y": -0.3009436927675989,
                    "z": 0.6398690524691406,
                    "w": -0.3009442391945992
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右中指１",
                "mixamo": "mixamorigRightHandMiddle1",
                "baseRota2": {
                    "x": 0.6398695782750681,
                    "y": -0.3009436310744968,
                    "z": 0.6398690889104464,
                    "w": -0.30094418647010657
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右中指２",
                "mixamo": "mixamorigRightHandMiddle2",
                "baseRota2": {
                    "x": 0.6398695221983411,
                    "y": -0.3009436512759858,
                    "z": 0.6398691808625564,
                    "w": -0.3009440899902832
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右中指３",
                "mixamo": "mixamorigRightHandMiddle3",
                "baseRota2": {
                    "x": 0.6398695984766859,
                    "y": -0.30094368715131636,
                    "z": 0.6398691045841627,
                    "w": -0.30094405411499986
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右小指１",
                "mixamo": "mixamorigRightHandPinky1",
                "baseRota2": {
                    "x": 0.6398695626013575,
                    "y": -0.3009437634296494,
                    "z": 0.6398690687088827,
                    "w": -0.300944130393384
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右小指２",
                "mixamo": "mixamorigRightHandPinky2",
                "baseRota2": {
                    "x": 0.6398696539874117,
                    "y": -0.30094364339605245,
                    "z": 0.6398690670110347,
                    "w": -0.30094405973107696
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右小指３",
                "mixamo": "mixamorigRightHandPinky3",
                "baseRota2": {
                    "x": 0.6398695513686757,
                    "y": -0.3009436882832485,
                    "z": 0.6398691337545529,
                    "w": -0.3009440911222174
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右薬指１",
                "mixamo": "mixamorigRightHandRing1",
                "baseRota2": {
                    "x": 0.6398695984766619,
                    "y": -0.3009436871513674,
                    "z": 0.6398691045841935,
                    "w": -0.30094405411493447
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右薬指２",
                "mixamo": "mixamorigRightHandRing2",
                "baseRota2": {
                    "x": 0.6398695788410876,
                    "y": -0.3009436546284183,
                    "z": 0.6398690704067549,
                    "w": -0.3009442010553974
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右薬指３",
                "mixamo": "mixamorigRightHandRing3",
                "baseRota2": {
                    "x": 0.6398695984766983,
                    "y": -0.30094368715129,
                    "z": 0.6398691045841612,
                    "w": -0.30094405411500263
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右親指０",
                "mixamo": "mixamorigRightHandThumb1",
                "baseRota2": {
                    "x": 0.7060760522083138,
                    "y": 0.03816497543510487,
                    "z": 0.6486015206883594,
                    "w": -0.2816311583320863
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右親指１",
                "mixamo": "mixamorigRightHandThumb2",
                "baseRota2": {
                    "x": 0.7060760721385191,
                    "y": 0.03816497305757039,
                    "z": 0.6486015216874591,
                    "w": -0.2816311063864096
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右親指２",
                "mixamo": "mixamorigRightHandThumb3",
                "baseRota2": {
                    "x": 0.7060760721385191,
                    "y": 0.03816497305757039,
                    "z": 0.6486015216874591,
                    "w": -0.2816311063864097
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左人指１",
                "mixamo": "mixamorigLeftHandIndex1",
                "baseRota2": {
                    "x": 0.6405256600435492,
                    "y": 0.2995447778449397,
                    "z": -0.6405251827817192,
                    "w": -0.2995451453767368
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左人指２",
                "mixamo": "mixamorigLeftHandIndex2",
                "baseRota2": {
                    "x": 0.6405255683024921,
                    "y": 0.2995448745253934,
                    "z": -0.6405252031057413,
                    "w": -0.2995452014094131
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左人指３",
                "mixamo": "mixamorigLeftHandIndex3",
                "baseRota2": {
                    "x": 0.6405255867740982,
                    "y": 0.2995448598998151,
                    "z": -0.6405251310712635,
                    "w": -0.29954533056977717
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左中指１",
                "mixamo": "mixamorigLeftHandMiddle1",
                "baseRota2": {
                    "x": 0.640525604010914,
                    "y": 0.2995447981689563,
                    "z": -0.6405251673973015,
                    "w": -0.2995452777657383
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左中指２",
                "mixamo": "mixamorigLeftHandMiddle2",
                "baseRota2": {
                    "x": 0.640525547978454,
                    "y": 0.2995448184929293,
                    "z": -0.6405252591383731,
                    "w": -0.2995451810852286
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左中指３",
                "mixamo": "mixamorigLeftHandMiddle3",
                "baseRota2": {
                    "x": 0.6405256243350094,
                    "y": 0.29954485420149896,
                    "z": -0.6405251827817731,
                    "w": -0.29954514537669935
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左小指１",
                "mixamo": "mixamorigLeftHandPinky1",
                "baseRota2": {
                    "x": 0.6405255886254879,
                    "y": 0.29954493056008646,
                    "z": -0.6405251470742026,
                    "w": -0.2995452217312371
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左小指２",
                "mixamo": "mixamorigLeftHandPinky2",
                "baseRota2": {
                    "x": 0.6405256612802449,
                    "y": 0.29954482494641943,
                    "z": -0.6405251458366086,
                    "w": -0.2995451746315359
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左小指３",
                "mixamo": "mixamorigLeftHandPinky3",
                "baseRota2": {
                    "x": 0.640525625571314,
                    "y": 0.29954490130381495,
                    "z": -0.6405251458370702,
                    "w": -0.2995451746306144
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左薬指１",
                "mixamo": "mixamorigLeftHandRing1",
                "baseRota2": {
                    "x": 0.6405256243349979,
                    "y": 0.2995448542015233,
                    "z": -0.6405251827817913,
                    "w": -0.29954514537666044
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左薬指２",
                "mixamo": "mixamorigLeftHandRing2",
                "baseRota2": {
                    "x": 0.6405256046283212,
                    "y": 0.29954482172175423,
                    "z": -0.640525148925585,
                    "w": -0.2995452923912903
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左薬指３",
                "mixamo": "mixamorigLeftHandRing3",
                "baseRota2": {
                    "x": 0.6405256338795083,
                    "y": 0.2995448586652132,
                    "z": -0.6405251732372602,
                    "w": -0.29954514091300455
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左親指０",
                "mixamo": "mixamorigLeftHandThumb1",
                "baseRota2": {
                    "x": 0.7059912465505856,
                    "y": -0.03970758872206579,
                    "z": -0.6492150543190642,
                    "w": -0.28021328428653897
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左親指１",
                "mixamo": "mixamorigLeftHandThumb2",
                "baseRota2": {
                    "x": 0.7059912691363935,
                    "y": -0.039707600696334305,
                    "z": -0.6492150705768392,
                    "w": -0.28021318801826167
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左親指２",
                "mixamo": "mixamorigLeftHandThumb3",
                "baseRota2": {
                    "x": 0.7059912699873983,
                    "y": -0.03970757432348821,
                    "z": -0.649215064437621,
                    "w": -0.28021320383505094
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "腰",
                "mixamo": "mixamorigHips",
                "baseRota2": {
                    "x": -7.537290937550871e-11,
                    "y": 0.0000017531267547919892,
                    "z": -0.00004388351230457701,
                    "w": 0.9999999990355819
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左足D",
                "mixamo": "mixamorigLeftUpLeg",
                "baseRota2": {
                    "x": -0.0002059237306917315,
                    "y": -0.006336686023263728,
                    "z": 0.9994519800370774,
                    "w": -0.03248913057659972
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0.03550170593637907,
                    "w": 0.9993696157456494
                }
            },
            {
                "mmd": "左ひざD",
                "mixamo": "mixamorigLeftLeg",
                "baseRota2": {
                    "x": -0.0009397985752613493,
                    "y": -0.024454564754772336,
                    "z": 0.9989628119395462,
                    "w": -0.03839780466536864
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "左足首D",
                "mixamo": "mixamorigLeftFoot",
                "baseRota2": {
                    "x": 0.005004539108058452,
                    "y": 0.5200100560830387,
                    "z": 0.8541059265977562,
                    "w": -0.00821962965066157
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右足D",
                "mixamo": "mixamorigRightUpLeg",
                "baseRota2": {
                    "x": 0.0001874165040391904,
                    "y": -0.0063305393968355475,
                    "z": 0.9995419974694327,
                    "w": 0.029591965815344914
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": -0.03260478332563544,
                    "w": 0.9994683227117748
                }
            },
            {
                "mmd": "右ひざD",
                "mixamo": "mixamorigRightLeg",
                "baseRota2": {
                    "x": 0.0008693437380275451,
                    "y": -0.024463823250154598,
                    "z": 0.9990697533995708,
                    "w": 0.03550202016185358
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "右足首D",
                "mixamo": "mixamorigRightFoot",
                "baseRota2": {
                    "x": -0.0034965017800907155,
                    "y": 0.5200224871155897,
                    "z": 0.8541261045901731,
                    "w": 0.005743242097658293
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "首",
                "mixamo": "mixamorigNeck",
                "baseRota2": {
                    "x": -4.387349891210141e-10,
                    "y": 7.547468011819443e-7,
                    "z": -0.00004346753821293609,
                    "w": 0.9999999990550017
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                }
            },
            {
                "mmd": "頭",
                "mixamo": "mixamorigHead",
                "rota": {
                    "x": -9.430839561164061e-10,
                    "y": 0.000001509493547986177,
                    "z": -0.00008693507708925526
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": -4.387349891210141e-10,
                    "y": 7.547468011819442e-7,
                    "z": -0.00004346753821293609,
                    "w": 0.9999999990550017
                }
            },
            {
                "mmd": "上半身",
                "mixamo": "mixamorigSpine",
                "rota": {
                    "x": 0.12153598011702768,
                    "y": 0.000015526021109313357,
                    "z": -0.00009832673005521606
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": 0.060730600491275294,
                    "y": 0.00000476296111507003,
                    "z": -0.00004954407220672151,
                    "w": 0.998154192340376
                }
            },
            {
                "mmd": "上半身3",
                "mixamo": "mixamorigSpine1",
                "rota": {
                    "x": 0.12114327703136533,
                    "y": 0.000015494947389615235,
                    "z": -0.00007913419913241419
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": 0.06053460915434582,
                    "y": 0.000005338086644670356,
                    "z": -0.00003996352740569041,
                    "w": 0.9981660981364533
                }
            },
            {
                "mmd": "上半身2",
                "mixamo": "mixamorigSpine2",
                "rota": {
                    "x": 0.005654865904274327,
                    "y": 0.000002001072937296167,
                    "z": -0.00008692515401489475
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": 0.0028274292472795903,
                    "y": 8.776450785911693e-7,
                    "z": -0.000043465230471805673,
                    "w": 0.999996001868935
                }
            },
            {
                "mmd": "左肩",
                "mixamo": "mixamorigLeftShoulder",
                "rota": {
                    "x": -1.5707966972181924,
                    "y": 0.0210504028528058,
                    "z": 1.7734526738182472
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": -0.4526010982395606,
                    "y": -0.5432793929360109,
                    "z": 0.552685484748375,
                    "w": 0.44106521218845274
                }
            },
            {
                "mmd": "左腕",
                "mixamo": "mixamorigLeftArm",
                "rota": {
                    "x": -1.5707963863996461,
                    "y": 2.3841858623474543e-7,
                    "z": 2.2379804954911537
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0.34098027237119455,
                    "w": 0.9400704515373656
                },
                "baseRota2": {
                    "x": 0.6405254556199221,
                    "y": 0.299544891620819,
                    "z": -0.6405253336426795,
                    "w": -0.2995451461356368
                }
            },
            {
                "mmd": "左ひじ",
                "mixamo": "mixamorigLeftForeArm",
                "rota": {
                    "x": -1.3772769403323826,
                    "y": -0.6950196375865532,
                    "z": 1.6011545876533033
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": 0.6405253989699176,
                    "y": 0.29954488839210647,
                    "z": -0.6405253724384152,
                    "w": -0.29954518754261517
                }
            },
            {
                "mmd": "左手首",
                "mixamo": "mixamorigLeftHand",
                "rota": {
                    "x": -1.7371896661949573,
                    "y": -0.6980817784402606,
                    "z": 1.8838942140844501
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": 0.6405255670675948,
                    "y": 0.29954482742008165,
                    "z": -0.6405252400492164,
                    "w": -0.2995451721581008
                }
            },
            {
                "mmd": "右肩",
                "mixamo": "mixamorigRightShoulder",
                "rota": {
                    "x": -1.5707967844910835,
                    "y": -0.020978937426153865,
                    "z": -1.7734537617124915
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": 0.4525813685880195,
                    "y": -0.5432958098632026,
                    "z": 0.5526699732146706,
                    "w": -0.4410846366953407
                }
            },
            {
                "mmd": "右腕",
                "mixamo": "mixamorigRightArm",
                "rota": {
                    "x": -1.570796326794954,
                    "y": 2.980232938210037e-8,
                    "z": -2.188053725992508
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": -0.3389254771358517,
                    "w": 0.9408132232001394
                },
                "baseRota2": {
                    "x": 0.6398694296802463,
                    "y": -0.30094372420188836,
                    "z": 0.6398692554430604,
                    "w": -0.30094405520357426
                }
            },
            {
                "mmd": "右ひじ",
                "mixamo": "mixamorigRightForeArm",
                "rota": {
                    "x": -1.3769076294556781,
                    "y": 0.6951426125849871,
                    "z": -1.6022639708281343
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": 0.6398693730374327,
                    "y": -0.3009437208493975,
                    "z": 0.6398692941482286,
                    "w": -0.30094409669522454
                }
            },
            {
                "mmd": "右手首",
                "mixamo": "mixamorigRightHand",
                "rota": {
                    "x": -1.7365050911975028,
                    "y": 0.6981299602739854,
                    "z": -1.8861428272802916
                },
                "scale": {
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "baseRota": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "baseRota2": {
                    "x": 0.6398695412679293,
                    "y": -0.30094366024482844,
                    "z": 0.6398691617929513,
                    "w": -0.3009440810214669
                }
            }
        ]
        function mmdboneToMixamobone(mmd) {
            for (let i = 0; i < boneRefList.length; i++) {
                const element = boneRefList[i];
                if (element.mmd == mmd) {
                    return element;
                }
            }
        }
        let mmdBoneList = [
            // {mesh:null, boneName:"",rota:[]},
        ];
        function mixamoBoneToMMD(mixamoBone, mmdBone) {
            mixamoBone.parent.attach(mmdBone);

            // mixamoBone.position.copy(mmdBone.position.clone());
            // mmdBone.quaternion.copy(mixamoBone.quaternion.clone());
            return mmdBone.quaternion.clone();
        }

        function getMixamoBone(boneName) {
            for (let k = 0; k < mixamoBoneList.length; k++) {
                const mixamoBone = mixamoBoneList[k];
                if (mixamoBone.boneName == boneName) {
                    return mixamoBone.mesh;
                }
            }
        }

        function getMMDBone(boneName) {
            // for (let k = 0; k < mmdBoneList.length; k++) {
            //     const mmdBone = mmdBoneList[k];
            //     if (mmdBone.boneName == boneName) {
            //         return mmdBone.mesh;
            //     }
            // }
            for (let k = 0; k < baseMMDBoneList.length; k++) {
                const mmdBone = baseMMDBoneList[k];
                if (mmdBone.boneName == boneName) {
                    return mmdBone.mesh;
                }
            }
        }

        let _YJLoadAnimation = null; 
        let animwalk_mixamo;
        let animwalk_mmd;
        let mmdtemp = new THREE.Group();
        let mmdParemttemp = new THREE.Group();
        function loadByAnimFile(callback) {
            //fbx动作直接加载模型，提前里面的动画
            if (_YJLoadAnimation == null) {
                _YJLoadAnimation = new YJLoadAnimation();
            }
            let animData = GetVmdByName(currentAnimName);

            _YJLoadAnimation.load(animData.url, (anim) => {


                let action = tposeModel_mixer.clipAction(anim);
                for (let j = 0; j < tposeModel_mixer._actions.length; j++) {
                    let action = tposeModel_mixer.clipAction(tposeModel_mixer._actions[j]._clip);
                    action.setEffectiveWeight(0);
                    action.setEffectiveTimeScale(0);
                }
                action.setEffectiveTimeScale(1);
                action.setEffectiveWeight(1);
                action.reset();
                action.play();
                action.loop = THREE.LoopRepeat;
                // console.log(anim.tracks);
                animwalk_mixamo = anim.tracks;
                // return;

                // setTimeout(() => {


                let tracks = [];
                let offset = new THREE.Vector3();
                for (let i = 0; i < anim.tracks.length; i++) {
                    const mixamoBone = anim.tracks[i];
                    for (let j = 0; j < boneRefList.length; j++) {
                        const mmdBone = boneRefList[j];
                        if ((mixamoBone.name) == (mmdBone.mixamo + ".position")) {
                            const trackName = mixamoBone.name.replace(mmdBone.mixamo, mmdBone.mmd);
                            // const trackName = mixamoBone.name;
                            const times = mixamoBone.times;
                            const values = [mixamoBone.values.length];
                            let mmdbone = getMMDBone(mmdBone.mmd);
                            let mixamobone = getMixamoBone(mmdBone.mixamo);
                            let mmdY = mmdbone.getWorldPosition(new THREE.Vector3()).y;
                            let mixiamoY = mixamobone.getWorldPosition(new THREE.Vector3()).y;
                            offset.y = (mmdY - mixiamoY) - mixiamoY + 0.4;
                            // offset.y = (mmdY - 10)-10 + 0.4; 
                            // console.log(mmdY, mixiamoY);
                            let posScale = 0.1;
                            for (let i = 0; i < mixamoBone.values.length; i = i + 3) {
                                values[i] = mixamoBone.values[i] * posScale;
                                values[i + 1] = (mixamoBone.values[i + 1]) * posScale + offset.y;
                                values[i + 2] = mixamoBone.values[i + 2] * posScale;
                            }

                            const track = new THREE.VectorKeyframeTrack(trackName, times, values);
                            tracks.push(track);
                            // console.log("替换", mmdBone.mixamo, mmdBone.mmd);
                        }
                        if ((mixamoBone.name) == (mmdBone.mixamo + ".quaternion")) {
                            const trackName = mixamoBone.name.replace(mmdBone.mixamo, mmdBone.mmd);

                            let mmdbone = getMMDBone(mmdBone.mmd);
                            let mmdboneParent = mmdbone.parent;

                            let mixamobone = getMixamoBone(mmdBone.mixamo);
                            let basePos = mmdbone.position.clone();
                            // console.log(mmdbone,mixamobone,mixamoboneparent);

                            // continue;
                            // console.log(mmdbone.quaternion.clone());

                            // const trackName = mixamoBone.name;
                            const times = mixamoBone.times;
                            const values = [mixamoBone.values.length];


                            for (let i = 0; i < mixamoBone.values.length; i = i + 4) {

                                mixamobone.attach(mmdbone);
                                mmdbone.position.set(0, 0, 0);
                                mmdbone.quaternion.x = mmdBone.baseRota2.x;
                                mmdbone.quaternion.y = mmdBone.baseRota2.y;
                                mmdbone.quaternion.z = mmdBone.baseRota2.z;
                                mmdbone.quaternion.w = mmdBone.baseRota2.w;

                                mixamobone.quaternion.x = mixamoBone.values[i];
                                mixamobone.quaternion.y = mixamoBone.values[i + 1];
                                mixamobone.quaternion.z = mixamoBone.values[i + 2];
                                mixamobone.quaternion.w = mixamoBone.values[i + 3];


                                // console.log(" 00 ",mixamobone, mmdbone.quaternion.clone());
                                mmdboneParent.attach(mmdbone);
                                mmdbone.position.copy(basePos);

                                // console.log(" 11 ",mmdbone, mmdbone.quaternion.clone());
                                let quat = mmdbone.quaternion.clone();
                                values[i] = quat.x;
                                values[i + 1] = quat.y;
                                values[i + 2] = quat.z;
                                values[i + 3] = quat.w;
                                // console.log(mmdbone.quaternion.clone());
                            }



                            const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
                            tracks.push(track);
                            // console.log("替换", mmdBone.mixamo, mmdBone.mmd);
                        }
                    }

                }

                anim = new THREE.AnimationClip(currentAnimName, -1, tracks); anim.optimize();
                // console.log(anim.tracks);
                animwalk_mmd = anim.tracks;
                // return;

                directChangeAllAnim(anim, animData.loop, offset);
                return;


                // }, 20);

            });
        }
        function directChangeAllAnim(anim, loop, offset) {

            for (let i = 0; i < modelList.length; i++) {
                const element = modelList[i];
                if (element.mesh) {
                    let mixer = helper.objects.get(element.mesh).mixer;
                    ChangeAnim2(element.currentActionIndex, mixer, mixer.clipAction(anim), loop);
                    element.currentActionIndex = element.vmdFiles.length;
                    // element.mesh.position.add(offset);
                }
            }

        }
        this.ChangeState = function (e, msg) {
            if (e == "切换动作") {
                let vmdFile = msg;
                currentAnimName = msg;

                let animData = GetVmdByName(currentAnimName);

                if (animData.url.toLocaleLowerCase().includes("fbx")) {
                    helper.enable("ik", false);
                    loadByAnimFile(currentAnimName);
                    return;
                }

                helper.enable("ik", true);

                let count = 0;
                let num = 0;
                for (let i = 0; i < modelList.length; i++) {
                    const element = modelList[i];
                    if (element.mesh) {
                        count++;
                    }
                }
                for (let i = 0; i < modelList.length; i++) {
                    const element = modelList[i];
                    if (element.mesh) {
                        LoadAnimation(GetVmdByName(vmdFile), element.mesh, () => {
                            num++;
                            if (num == count) {
                                setTimeout(() => {
                                    anycToMain();
                                }, 200);
                            }
                        });
                    }
                }
            }
            if (e == "切换服装") {
                let { part, name } = msg;
                console.log(msg);
                let animData = GetVmdByName(currentAnimName);

                if (animData.url.toLocaleLowerCase().includes("fbx")) {
                    helper.enable("ik", false);

                    LoadMMD(loader, GetHairByName(part, name), GetVmdByName("idle"), () => {
                        loadByAnimFile(currentAnimName);
                    });
                    return;
                }

                LoadMMD(loader, GetHairByName(part, name), animData, () => {
                    anycToMain();
                });

            }


            if (e == "读取基础骨骼数据") {
                for (let j = 0; j < baseMMDBoneList.length; j++) {
                    const refBone = baseMMDBoneList[j];
                    let boneData = mmdboneToMixamobone(refBone.boneName);
                    if (refBone.boneName == boneData.mmd) {
                        let mmdbone = refBone.mesh;
                        mmdbone.quaternion.x = boneData.baseRota.x;
                        mmdbone.quaternion.y = boneData.baseRota.y;
                        mmdbone.quaternion.z = boneData.baseRota.z;
                        mmdbone.quaternion.w = boneData.baseRota.w;
                    }
                }
            }
            if (e == "记录基础骨骼数据") {

                for (let j = 0; j < baseMMDBoneList.length; j++) {
                    const refBone = baseMMDBoneList[j];
                    let boneData = mmdboneToMixamobone(refBone.boneName);
                    for (let k = 0; k < mixamoBoneList.length; k++) {
                        const mixamoBone = mixamoBoneList[k];
                        if (mixamoBone.boneName == boneData.mixamo) {
                            let mmdbone = refBone.mesh;
                            let axes = new THREE.AxesHelper(1);
                            refBone.mesh.parent.add(axes);
                            axes.position.copy(refBone.mesh.position.clone());
                            axes.quaternion.copy(refBone.mesh.quaternion.clone());

                            let quat = mmdbone.quaternion.clone();
                            boneData.baseRota = { x: quat.x, y: quat.y, z: quat.z, w: quat.w };


                            let mixamobone = mixamoBone.mesh;

                            // console.log(mmdbone,mixamobone,mixamoboneparent);
                            if (mixamobone.mmd) {
                                mixamobone.remove(mixamobone.mmd);
                                mixamobone.mmd = undefined;
                            }
                            mixamobone.attach(axes);
                            mixamobone.mmd = axes;
                            axes.position.set(0, 0, 0);
                            let quat2 = axes.quaternion.clone();
                            boneData.baseRota2 = { x: quat2.x, y: quat2.y, z: quat2.z, w: quat2.w };
                        }
                    }
                }
                console.log(boneRefList);

                // for (let i = 0; i < baseMMDBoneList.length; i++) {
                //     const mmdBone = baseMMDBoneList[i];
                //     for (let j = 0; j < boneRefList.length; j++) {
                //         const refBone = boneRefList[j];
                //         if ((mmdBone.boneName == refBone.mmd)) {
                //             let quat2 = mmdBone.mesh.quaternion.clone();
                //             let v = new THREE.Euler();
                //             v.setFromQuaternion(quat2);
                //             let xyz = v.clone();
                //             refBone.baseRota = { x: xyz.x, y: xyz.y, z: xyz.z };
                //         }
                //     }
                // }
            }
            if (e == "选择骨骼") {
                // for (let i = 0; i < mmdBoneList.length; i++) {
                //     const element = mmdBoneList[i];
                //     if ((element.boneName == msg)) {
                //         element.mesh.add(new THREE.AxesHelper(2));

                //         _Global.YJ3D._YJSceneManager._YJTransformManager.attach(
                //             element.mesh
                //         );
                //     }
                // }
                for (let i = 0; i < baseMMDBoneList.length; i++) {
                    const element = baseMMDBoneList[i];
                    if ((element.boneName == msg)) {
                        element.mesh.add(new THREE.AxesHelper(2));
                        console.log(element.mesh);
                        _Global.YJ3D._YJSceneManager._YJTransformManager.attach(
                            element.mesh
                        );
                    }
                }
            }
            if (e == "获取骨骼") {
                let b = [];
                for (let i = 0; i < mmdBoneList.length; i++) {
                    const element = mmdBoneList[i];
                    for (let j = 0; j < boneRefList.length; j++) {
                        const mmdBone = boneRefList[j];
                        if ((element.boneName == mmdBone.mmd)) {
                            b.push({ mmd: element.boneName, rota: mmdBone.rota, scale: mmdBone.scale });
                        }
                    }
                }
                return b;
            }

            if (e == "切换角度") {
                // let { axis, add,radius,value} = msg;
                let quat = msg;
                if (msg < 0) {
                    return;
                }
                if (currentAnimName == "Kiss" || currentAnimName == "TPose") {
                    console.log(animwalk_mixamo);
                    console.log(animwalk_mmd);

                    for (let k = 0; k < animwalk_mmd.length; k++) {
                        const mixamoBone = animwalk_mmd[k];
                        for (let j = 0; j < boneRefList.length; j++) {
                            const mmdBone = boneRefList[j];
                            let mmdbone = getMMDBone(mmdBone.mmd);
                            if ((mixamoBone.name) == (mmdBone.mmd + ".position")) {
                                let i = msg * 3; // keyframe

                                let x = mixamoBone.values[i];
                                let y = mixamoBone.values[i + 1];
                                let z = mixamoBone.values[i + 2];
                                mmdbone.position.set(x, y, z);
                                console.log(x, y, z);
                            }
                            if ((mixamoBone.name) == (mmdBone.mmd + ".quaternion")) {
                                let i = msg * 4; // keyframe

                                mmdbone.quaternion.x = mixamoBone.values[i];
                                mmdbone.quaternion.y = mixamoBone.values[i + 1];
                                mmdbone.quaternion.z = mixamoBone.values[i + 2];
                                mmdbone.quaternion.w = mixamoBone.values[i + 3];
                            }
                        }

                    }
                    // return;
                    for (let k = 0; k < animwalk_mixamo.length; k++) {
                        const mixamoBone = animwalk_mixamo[k];


                        for (let j = 0; j < boneRefList.length; j++) {
                            const mmdBone = boneRefList[j];

                            let mixamobone = getMixamoBone(mmdBone.mixamo);

                            if ((mixamoBone.name) == (mmdBone.mixamo + ".position")) {
                                let i = msg * 3; // keyframe

                                let x = mixamoBone.values[i];
                                let y = mixamoBone.values[i + 1];
                                let z = mixamoBone.values[i + 2];
                                mixamobone.position.set(x, y, z);
                            }
                            if ((mixamoBone.name) == (mmdBone.mixamo + ".quaternion")) {
                                let i = msg * 4; // keyframe

                                let mixamobone = getMixamoBone(mmdBone.mixamo);

                                mixamobone.quaternion.x = mixamoBone.values[i];
                                mixamobone.quaternion.y = mixamoBone.values[i + 1];
                                mixamobone.quaternion.z = mixamoBone.values[i + 2];
                                mixamobone.quaternion.w = mixamoBone.values[i + 3];
                            }
                        }

                    }
                    return;
                }

            }
            if (e == "终止") {
                // for (let i = 0; i < modelList.length; i++) {
                //     const element = modelList[i];
                //     if (element.mesh) {
                //         let mixer = helper.objects.get(element.mesh).mixer;
                //         for (let j = 0; j < mixer._actions.length; j++) {
                //             let action = mixer.clipAction(mixer._actions[j]._clip);
                //             action.setEffectiveWeight(0);
                //             action.setEffectiveTimeScale(0);
                //             action.reset();  
                //         }
                //     }
                // }
                // return;
                for (let i = 0; i < modelList.length; i++) {
                    const element = modelList[i];
                    if (element.mesh) {

                        if (helper.objects.get(element.mesh)) {
                            let { physics } = helper.objects.get(element.mesh);
                            if (physics) {
                                physics.destroy();
                            }
                            physics = undefined;
                            helper.remove(element.mesh);
                        }
                    }
                    // group.remove(element.mesh);
                }
            }
        }

        function CreateSphereFn(parent, ballRadius, color, pos, name) {
            const quat = new THREE.Quaternion();

            let castBall = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 5, 5),
                new THREE.MeshBasicMaterial(
                    {
                        color: color,
                        transparent: true,
                        opacity: 1,
                        // wireframe: true,
                    }));
            castBall.castShadow = false;
            castBall.receiveShadow = false;
            castBall.tag = "ignoreRaycast";
            parent.add(castBall);
            if (pos) {
                castBall.position.copy(pos);
            }
            if (name) {
                castBall.name = name;
            }
            // castBall.add(new THREE.AxesHelper(0.3));
        }
        function CreateBoxFn(parent, color, pos, name) {
            const quat = new THREE.Quaternion();
            let quat2 = parent.quaternion.clone();

            // let v = new THREE.Euler();
            // v.setFromQuaternion(quat2);
            // v.x += 1;
            // v.y += 1;
            // v.z += 1;
            // quat2.setFromEuler(v);


            let castBall = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10),
                new THREE.MeshBasicMaterial(
                    {
                        color: 0xff0000,
                        transparent: true,
                        opacity: 1,
                        // wireframe: true,
                    }));
            castBall.castShadow = false;
            castBall.receiveShadow = false;
            castBall.tag = "ignoreRaycast";
            parent.add(castBall);
            if (pos) {
                castBall.position.copy(pos);
            }
            if (name) {
                castBall.name = name;
            }
            // castBall.quaternion.copy(quat2);
            castBall.add(new THREE.AxesHelper(20));
            return castBall;
        }
        function ChangeMat(oldMat) {
            let map = oldMat.map;
            map.encoding = 3001; //3000  3001

            // MeshStandardMaterial  MeshBasicMaterial
            let mat = new THREE.MeshBasicMaterial(
                {
                    color: oldMat.color,
                    map: map,
                    transparent: oldMat.transparent,
                    opacity: oldMat.opacity,
                    alphaTest: 206 / 256,
                    needsUpdate: true,
                    // blending: THREE.AdditiveBlending,
                    // wireframe: true,
                });
            return mat;
        }
        function OnAnimLoop() {
            if (nextAnim == "") {
                return;
            }
            scope.ChangeState("切换动作", nextAnim);
            console.log("动作循环点");
        }

        let mixamoBoneList = [];
        let tposeModel = null;
        let tposeModel_mixer = null;
        let baseMMDBoneList = [];

        function LoadCopyToMake(pmx, vmd) {

            _Global.YJ3D._YJSceneManager.DirectLoadMesh("./public/models/mmd/miku/T-Pose.fbx", (meshAndMats) => {
                let model = (meshAndMats.mesh).scene;
                tposeModel = model;
                tposeModel_mixer = new THREE.AnimationMixer(model);
                group.add(model);
                model.rotation.set(0, 0, 0);
                model.position.set(10, 0, 0);
                model.scale.set(0.1, 0.10, 0.10);
                model.traverse((item) => {
                    if (item.type == "Bone") {
                        // item.add(new THREE.AxesHelper(10));
                        mixamoBoneList.push({ boneName: item.name, mesh: item });
                        // if(item.name == "mixamorigLeftArm"){
                        //     CreateBoxFn(item,0xffffff,new THREE.Vector3(0,0,0));
                        // } 
                    }
                    if (item.type == "SkinnedMesh") {
                        item.material = new THREE.MeshBasicMaterial({
                            transparent: true,
                            opacity: 0.5,
                        });
                    }
                });
                model.visible = false;
            });

            loader.loadWithAnimation(pmx, vmd, function (mmd) {

                let mesh = mmd.mesh;
                mesh.position.set(10, 0, 0);
                let scale = 1;
                mesh.scale.set(scale, scale, scale);
                group.add(mesh);
                mesh.visible = false;

                mesh.traverse((item) => {
                    if (item.type == "Bone") {
                        for (let j = 0; j < boneRefList.length; j++) {
                            const mmdBone = boneRefList[j];
                            if ((item.name == mmdBone.mmd)) {
                                // item.add(new THREE.AxesHelper(1));
                                baseMMDBoneList.push({ boneName: item.name, mesh: item });
                            }
                        }
                    }
                });
                // console.log("刻晴改 ", mesh, baseMMDBoneList);

                // let skeleton = new THREE.SkeletonHelper(mesh);
                // skeleton.visible = true;
                // scene.add(skeleton);

                if (true) {
                    let materials = mesh.material;
                    let matIndex = -1;
                    for (let i = 0; i < materials.length; i++) {
                        let mat = materials[i];
                        if (mat.map) {
                            mat.map.encoding = 3001;
                        }
                        matIndex = i;
                        mesh.material[matIndex] = ChangeMat(mat);
                    }
                    mesh.castShadow = true;

                }

            }, null, null);
        }

        function loadBase(vmddata) {

            loader.loadWithAnimation(modelFile_base, vmddata.url, function (mmd) {

                console.log(mmd);
                mesh = mmd.mesh;
                mesh.position.y = 0;
                // let scale = 0.1;
                let scale = 1;
                mesh.userData = {};
                mesh.scale.set(scale, scale, scale);
                console.log(mesh);
                group.add(mesh);
                mainMesh = mesh;

                helper.add(mesh, {
                    animation: mmd.animation,
                    physics: true
                });


                let mixer = helper.objects.get(mesh).mixer;
                let action = mixer.clipAction(mmd.animation);
                if (vmddata.loop) {
                    action.loop = THREE.LoopRepeat;
                    // action.loop = THREE.LoopPingPong;
                } else {
                    action.loop = THREE.LoopOnce;
                    action.clampWhenFinished = true;
                }
                // 
                // mixer.addEventListener('finished', function (e) {
                //     OnAnimLoop();
                // });
                // mixer.addEventListener('loop', function (e) {
                //     OnAnimLoop();
                // });

                modelList.push({
                    mesh, part: { part: "base", modelFile: modelFile_base },
                    vmdFiles: [{ vmdFile: vmddata.url, vmdIndex: 0 }], currentActionIndex: 0
                });


            }, null, null);

        }
        function init() {
            scene = _Global.YJ3D.scene;

            scene.add(group);

            // CreateSphereFn(scene, 0.5, 0xffffff, new THREE.Vector3(1, 1, 0), "bloom");

            let vmddata = GetVmdByName(currentAnimName);

            LoadCopyToMake("./public/models/mmd/miku/刻晴身体 - 副本.pmx", vmddata.url);
            // let scale = 0.1;
            // group.scale.set(scale, scale, scale);

            _Global.MMDManager = scope;
            // new Tonemapping(_Global.YJ3D.renderer, scene);

            helper = new MMDAnimationHelper({
                afterglow: 2.0
            });

            loadBase(vmddata);



            helper.enable('animation', false);
            helper.enable('physics', false);

            setTimeout(() => {
                helper.enable('animation', true);
                helper.enable('physics', true);
            }, 2000);

            // LoadMMD(loader, GetHairByName("hair", currentpmx_hair), vmddata);
            LoadMMD(loader, GetHairByName("body", currentpmx_body), vmddata);

            return;
            // _Global.YJ3D._YJSceneManager._YJTransformManager.attach(
            //     group
            // );

            // LoadMMD(loader, modelFile_all, vmdFiles, new THREE.Vector3(2, 0, 0));

            let bones = _Global.YJ3D._YJSceneManager
                .GetSingleTransformComponent("MeshRenderer").GetAllBoneModel();

            let model = _Global.YJ3D._YJSceneManager
                .GetSingleTransformComponent("MeshRenderer").GetModel();

            model.traverse(function (item) {
                if (
                    item.type === "SkinnedMesh"
                ) {
                    console.log((item));
                }
            });


            for (let i = 0; i < bones.length; i++) {
                const item = bones[i];
                if (
                    item.name.includes("J_L_HeadRibbon_00")
                    || item.name.includes("J_L_HeadRibbon_01")

                    || item.name.includes("J_R_HeadRibbon_00")
                    || item.name.includes("J_R_HeadRibbon_01")

                    || item.name.includes("J_L_HairTail_00")
                    || item.name.includes("J_L_HairTail_01")
                    || item.name.includes("J_L_HairTail_02")
                    || item.name.includes("J_L_HairTail_03")
                    || item.name.includes("J_L_HairTail_04")
                    || item.name.includes("J_L_HairTail_05")

                    || item.name.includes("J_R_HairTail_00")
                    || item.name.includes("J_R_HairTail_01")
                    || item.name.includes("J_R_HairTail_02")
                    || item.name.includes("J_R_HairTail_03")
                    || item.name.includes("J_R_HairTail_04")
                    || item.name.includes("J_R_HairTail_05")

                    || item.name.includes("J_L_HairFront_00")
                    || item.name.includes("J_R_HairFront_00")

                    || item.name.includes("J_L_HairSide_00")
                    || item.name.includes("J_L_HairSide_01")
                    || item.name.includes("J_R_HairSide_00")
                    || item.name.includes("J_R_HairSide_01")

                    || item.name.includes("J_L_Skirt_00")
                    || item.name.includes("J_L_Skirt_01")
                    || item.name.includes("J_L_SusoFront_00")

                    || item.name.includes("J_L_SkirtBack_00")
                    || item.name.includes("J_L_SkirtBack_01")
                    || item.name.includes("J_L_SusoBack_00")

                    || item.name.includes("J_R_Skirt_00")
                    || item.name.includes("J_R_Skirt_01")
                    || item.name.includes("J_R_SusoFront_00")

                    || item.name.includes("J_R_SkirtBack_00")
                    || item.name.includes("J_R_SkirtBack_01")
                    || item.name.includes("J_R_SusoBack_00")

                    || item.name.includes("J_L_Mune_00")
                    || item.name.includes("J_L_Mune_01")
                    || item.name.includes("J_R_Mune_00")
                    || item.name.includes("J_R_Mune_01")



                    || item.name.includes("renti65")
                    || item.name.includes("renti66")
                    // || item.name.includes("renti67")

                ) {
                    let _SpringBone = new SpringBone(item, item.children[0], _Global.YJ3D.scene, model);
                    scope.Add(_SpringBone);
                }
                // console.log(item.name);
                // scene.attach(ball);
            }


            model.traverse(function (item) {
                if (
                    item.name.includes("renti65")
                    || item.name.includes("renti66")
                    // || item.name.includes("renti67")

                ) {
                    let _SpringBone = new SpringBone(item, item.children[0], _Global.YJ3D.scene, model);
                    scope.Add(_SpringBone);
                }
                // console.log(item.name);
            });

            // let transform = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
            // _Global.YJ3D._YJSceneManager._YJTransformManager.attach(
            //     transform.GetGroup()
            // );
        }
        let springBone = [];
        this.Add = function (s) {
            springBone.push(s);
        }

        this._update = function () {

            tick(clock.getDelta());
            for (let i = 0; i < springBone.length; i++) {
                springBone[i].UpdateSpring();
            }
            TWEEN.update();
        }
        function tick(dt) {

            if (tposeModel_mixer !== null) {
                // 更新混合器相关的时间
                tposeModel_mixer.update(dt);
            }
            helper.update(dt);
        }
        init();
    }
}

export { SpringManager };