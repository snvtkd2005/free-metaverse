


import * as THREE from "three";

class SpringBone {
    constructor(transform, child, scene, model) {
        let scope = this;
        //次のボーン

        //ボーンの向き 
        // const boneAxis = new THREE.Vector3(-1, 0, 0);
        // const axisIndex = 0; //通用也使用物体的Y轴方向，通过世界矩阵索引1列为Y轴，   0为X轴

        const boneAxis = new THREE.Vector3(0, 1, 0); // threejs 中使用Y轴 
        const axisIndex = 1; //通用也使用物体的Y轴方向，通过世界矩阵索引1列为Y轴，   0为X轴
        let radius = 0.05;

        //各SpringBoneに設定されているstiffnessForceとdragForceを使用するか？
        //是否使用为每个SpringBone设置的stiffnessForce和dragForce？
        let isUseEachBoneForceSettings = false;

        //バネが戻る力
        let stiffnessForce = 0.01;
        //力の減衰力
        let dragForce = 0.4; 
        // const springForce = new THREE.Vector3(0.0, -0.0001, 0.0);
        const springForce = new THREE.Vector3(0.0, 0, 0.0);
        let colliders = [];
        this.SetCollider = function (mesh, radius) {
            colliders.push({ mesh, radius });
        }
        function addCollider(otherBoneName, radius) {
            // for (let i = 0; i < model.length; i++) {
            //     const item = model[i];
            //     if (item.name.includes(otherBoneName)) {
            //         scope.SetCollider(item, redius);
            //     }
            // }
            model.traverse(function (item) {
                if (item.name.includes(otherBoneName)) {
                    scope.SetCollider(item, radius);
                    CreateSphereFn(item, radius, 0x00ff00);
                }
                // console.log(item.name);
            });
        }
        let debug = true;
        //Kobayashi:Thredshold Starting to activate activeRatio
        let threshold = 0.01;
        let springLength;
        let localRotation;
        let trs;
        let currTipPos = new THREE.Vector3(0, 0, 0);
        let prevTipPos = new THREE.Vector3(0, 0, 0);
        //Kobayashi
        let org;
        //Kobayashi:Reference for "SpringManager" component with unitychan 
        let managerRef;

        let time = 0;
        const identityQuat = new THREE.Quaternion(0, 0, 0, 1.0);
        const clock = new THREE.Clock();

        function getWorldDirection(object, v) {
            return object.getWorldDirection(v);
        }
        function getWorldPosition(object) {
            return object.getWorldPosition(new THREE.Vector3());
        }
        function getWorldQuaternion(object) {
            return object.getWorldQuaternion(new THREE.Quaternion());
        }
        function CreateSphereFn(parent, ballRadius, color) {
            // return;
            let pos = new THREE.Vector3();
            const quat = new THREE.Quaternion();

            let castBall = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 5, 5),
                new THREE.MeshBasicMaterial(
                    {
                        color: color,
                        transparent: true,
                        opacity: 1,
                        wireframe: true,
                    }));
            castBall.castShadow = false;
            castBall.receiveShadow = false;
            castBall.tag = "ignoreRaycast";
            parent.add(castBall);
            // castBall.add(new THREE.AxesHelper(0.3));
        }
        let refObj = null;
        let parent = null;
        let boneName = "";
        function Awake() {
            trs = transform;
            // localRotation = transform.localRotation;
            localRotation = transform.quaternion.clone();
            // console.log(" localRotation = ", localRotation.clone());

            springLength = getWorldPosition(trs).distanceTo(getWorldPosition(child)) ;
            // console.log("springLength ", springLength);
            currTipPos = getWorldPosition(child).clone();
            prevTipPos = getWorldPosition(child).clone();

            refObj = new THREE.Group();
            scene.add(refObj);
             


            boneName = transform.name;
            if (boneName.includes("J_R_Skirt_00") || boneName.includes("J_R_Skirt_01")) {
                addCollider("Character1_RightUpLeg", 0.07);
                addCollider("Character1_RightLeg", 0.15);
                addCollider("Locator_RightUpLeg_Middle", 0.17);
                // addCollider("Locator_RightUpLeg_Middle", 0.08);

                console.log(colliders);
            }
            // CreateSphereFn(child, 0.05, 0xffff00);
            CreateSphereFn(refObj, 0.05, 0xffff00);

            // if (boneName.includes("J_L_HeadRibbon_00")) {
            //     console.log("transform.quaternion ", getWorldQuaternion(transform).clone());
            // }

            //Kobayashi:Reference for "SpringManager" component with unitychan
            // GameObject.Find("unitychan_dynamic").GetComponent<SpringManager>();
            // managerRef = GetParentSpringManager (transform);
        }

        function GetParentSpringManager(t) {
            // var springManager = t.GetComponent<SpringManager> ();

            // if (springManager != null)
            // 	return springManager;

            // if (t.parent != null) {
            // 	return GetParentSpringManager (t.parent);
            // }

            // return null;
        }

        this.UpdateSpring = function () {
            // return;
            // if(time>0){
            //     return;
            // }
            // time++;
            if (_Global.dirc) {
                stiffnessForce = _Global.dirc.stiffnessForce;
                dragForce = _Global.dirc.dragForce;
                boneAxis.x = _Global.dirc.x;
                boneAxis.y = _Global.dirc.y;
                boneAxis.z = _Global.dirc.z;
            }
            //Kobayashi
            org = trs;
            //重置旋转 
            trs.quaternion.copy(identityQuat.clone().multiply(localRotation));
            // trs.quaternion.copy(identityQuat.identity().clone().multiply(localRotation));

            // let sqrDt =   Time.deltaTime * Time.deltaTime;
            // let sqrDt = 0.00110889; //30帧
            let sqrDt = 0.0002890136; //60帧


            //stiffness
            // let force = trs.rotation * (boneAxis * stiffnessForce) / sqrDt;
            const force = boneAxis.clone().multiplyScalar(stiffnessForce).applyQuaternion(getWorldQuaternion(trs)).multiplyScalar(1 / sqrDt);
            //drag
            // force += (prevTipPos - currTipPos) * dragForce / sqrDt;
            force.add((prevTipPos.clone().sub(currTipPos).multiplyScalar(dragForce).multiplyScalar(1 / sqrDt)));
            // force += springForce / sqrDt;
            force.add(springForce.clone().multiplyScalar(1 / sqrDt));
            //前フレームと値が同じにならないように
            let temp = currTipPos.clone();

            //verlet
            // currTipPos = (currTipPos - prevTipPos) + currTipPos + (force * sqrDt);
            currTipPos = (currTipPos.clone().sub(prevTipPos)).add(currTipPos).add(force.multiplyScalar(sqrDt));

            //長さを元に戻す
            // currTipPos = ((currTipPos - trs.position).normalized * springLength) + trs.position;
            currTipPos = (currTipPos.clone().sub(getWorldPosition(trs))).normalize().multiplyScalar(springLength).add(getWorldPosition(trs));


            //衝突判定
            // for (let i = 0; i < colliders.length; i++) {
            // //     if (Vector3.Distance(currTipPos, colliders[i].transform.position) <= (radius + colliders[i].radius)) {
            // //         Vector3 normal = (currTipPos - colliders[i].transform.position).normalized;
            // //         currTipPos = colliders[i].transform.position + (normal * (radius + colliders[i].radius));
            // //         currTipPos = ((currTipPos - trs.position).normalized * springLength) + trs.position;
            // //     }
            //     let dis = currTipPos.clone().distanceTo(getWorldPosition(colliders[i].mesh));
            //     if (dis <= (radius + colliders[i].radius)) {
            //         console.log(" 重新计算 前 currTipPos ",currTipPos.clone() );
            //         let normal = currTipPos.clone().sub(getWorldPosition(colliders[i].mesh)).normalize();
            //         currTipPos = getWorldPosition(colliders[i].mesh).add(normal.multiplyScalar((radius + colliders[i].radius)));
            //         currTipPos = (currTipPos.clone().sub(getWorldPosition(trs)).normalize().multiplyScalar(springLength)).add(getWorldPosition(trs));
            //         console.log(" 重新计算 后 currTipPos ",currTipPos.clone() );
            //     }
            // }
 
            prevTipPos = temp.clone();

            let aimVector = trs.getWorldDirection(new THREE.Vector3());
            var worldMatrix = trs.matrixWorld;
            const xAxis = new THREE.Vector3();
            if (_Global.dirc) { 
                xAxis.setFromMatrixColumn(worldMatrix,  _Global.dirc.w); // 0 是列索引，对应X轴  
            }else{
                xAxis.setFromMatrixColumn(worldMatrix, axisIndex); // 0 是列索引，对应X轴  
            } 

            let mm = 1;
            if(axisIndex == 0){
                mm = boneAxis.x;
            }
            if(axisIndex == 1){                
                mm = boneAxis.y;
            } 
            if(axisIndex == 2){                
                mm = boneAxis.z;
            }

            aimVector = xAxis.clone().multiplyScalar(mm);


            // worldMatrix.extractBasis(new THREE.Vector3(), aimVector , new THREE.Vector3()); // 与上面代码同价
            // worldMatrix.extractBasis(aimVector, new THREE.Vector3() , new THREE.Vector3()); // 与上面代码同价
            trs.matrixWorldAutoUpdate = true;
            trs.matrixWorldNeedsUpdate = true;

            // 现在 xAxis 包含了物体局部坐标系中X轴方向的世界坐标向量
            // if (boneName.includes("J_L_HeadRibbon_00") ) {
            //     // console.log("aimVector ",aimVector.clone());
            //     console.log("getWorldPosition(trs) ",getWorldPosition(trs).clone());
            //     console.log("currTipPos ",currTipPos.clone());
            // }



            let aimRotation = new THREE.Quaternion();
            let offset = currTipPos.clone().sub(getWorldPosition(trs));
            // offset.z *= -1;
            // aimRotation.setFromUnitVectors(aimVector.clone(), currTipPos.clone().sub(getWorldPosition(trs)));
            // aimRotation.setFromUnitVectors(offset,aimVector.clone());
            aimRotation.setFromUnitVectors(aimVector, offset);
 
            // if (boneName.includes("J_L_HeadRibbon_00")) {
            //     console.log("aimRotation ", aimRotation.clone());
            // }

            // let v = new THREE.Euler();
            // v.setFromQuaternion(aimRotation);
            // v.y += Math.PI;
            // v.z *= -1;  
            // aimRotation.setFromEuler(v);


            scene.attach(refObj);

            refObj.quaternion.copy( getWorldQuaternion(org).multiply(aimRotation));
            // refObj.quaternion.multiplyQuaternions(getWorldQuaternion(trs),aimRotation);
            trs.parent.attach(refObj);


            trs.quaternion.copy(refObj.quaternion.clone());

 
            // if (boneName.includes("J_L_HeadRibbon_00")) {
            //     console.log("transform.quaternion ", getWorldQuaternion(transform).clone());
            // }
            // refObj.position.copy(getWorldPosition(trs));
            refObj.position.copy(trs.position.clone());

            //应用旋转
            // Vector3 aimVector = trs.TransformDirection (boneAxis);
            // Quaternion aimRotation = Quaternion.FromToRotation (aimVector, currTipPos - trs.position);

            return;
            // return;

            //original
            //trs.rotation = aimRotation * trs.rotation;
            //Kobayahsi:Lerp with mixWeight
            // Quaternion secondaryRotation = aimRotation * trs.rotation;
            let secondaryRotation = aimRotation.multiply(getWorldQuaternion(org));

            //trs.rotation = Quaternion.Lerp (org.rotation, secondaryRotation, managerRef.dynamicRatio);
            // trs.rotation = Quaternion.Lerp(org.rotation, secondaryRotation, 1);
            // trs.quaternion.rotateTowards(secondaryRotation, 1);

        }
        Awake();
    }
}

export { SpringBone };