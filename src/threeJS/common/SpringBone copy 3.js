


import * as THREE from "three"; 

class SpringBone {
    constructor(transform, child,scene) {
        //次のボーン
        // this.child = null;

        //ボーンの向き 
        const boneAxis = new THREE.Vector3(-1, 0, 0); 
        let radius = 0.05;

        //各SpringBoneに設定されているstiffnessForceとdragForceを使用するか？
        //是否使用为每个SpringBone设置的stiffnessForce和dragForce？
        let isUseEachBoneForceSettings = false;

        //バネが戻る力
        let stiffnessForce = 0.01;
        //力の減衰力
        let dragForce = 0.4;
        const springForce = new THREE.Vector3(0.0, -0.0001, 0.0);
        let colliders = [];
        let debug = true;
        //Kobayashi:Thredshold Starting to activate activeRatio
        let threshold = 0.01;
        let springLength;
        let localRotation;
        let trs;
        let currTipPos = new THREE.Vector3(0,0,0);
        let prevTipPos = new THREE.Vector3(0,0,0);
        //Kobayashi
        let org;
        //Kobayashi:Reference for "SpringManager" component with unitychan 
        let managerRef;

        const clock = new THREE.Clock();

        function getWorldPosition(object) {
            return object.getWorldPosition(new THREE.Vector3());
        }
        function getWorldQuaternion(object) {
            return object.getWorldQuaternion(new THREE.Quaternion());
        }
        function CreateSphereFn(ballRadius) {

            let pos = new THREE.Vector3();
            const quat = new THREE.Quaternion(); 
      
           let castBall = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 5,5),
              new THREE.MeshBasicMaterial(
                {
                  color: 0xffff00,
                  transparent: true,
                  opacity: 1,
                  wireframe: true,
                }));
            castBall.castShadow = false;
            castBall.receiveShadow = false; 
            child.add(castBall);
            refObj.add(new THREE.AxesHelper(0.3));
          }
          let refObj = null;
          let parent = null;
        function Awake() {
            trs = transform;
            // localRotation = transform.localRotation;
            localRotation = transform.quaternion.clone(); 
            console.log(" localRotation = ",localRotation.clone());

            springLength = getWorldPosition(trs).distanceTo(getWorldPosition(child));
            currTipPos = getWorldPosition(child).clone();
            console.log(" currTipPos  = ",currTipPos.clone());

            prevTipPos = getWorldPosition(child).clone();

            refObj = new THREE.Group();
            scene.add(refObj);
            // CreateSphereFn(0.05); 

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
        function getWorldDirection(object,v){
           return object.getWorldDirection(v);
        }
 
        let time = 0;
        const identityQuat = new THREE.Quaternion(0,0,0,1.0);
        this.UpdateSpring = function () {
            // return;
            // if(time>0){
            //     return;
            // }
            // time++;
            if(_Global.dirc){
                stiffnessForce = _Global.dirc.stiffnessForce;
                dragForce = _Global.dirc.dragForce;
            }
            //Kobayashi
            org = trs;
            //重置旋转 
            trs.quaternion.copy( identityQuat.clone().multiply(localRotation));
 
            // let sqrDt =   Time.deltaTime * Time.deltaTime;
            let sqrDt = 0.0002890136; 
            //stiffness
            // let force = trs.rotation * (boneAxis * stiffnessForce) / sqrDt;
            const force = boneAxis.clone().multiplyScalar(stiffnessForce).applyQuaternion( getWorldQuaternion(trs)).multiplyScalar(1/sqrDt);  
            //drag
            // force += (prevTipPos - currTipPos) * dragForce / sqrDt;
            force.add((prevTipPos.clone().sub(currTipPos.clone()).multiplyScalar(dragForce).multiplyScalar(1/sqrDt)));
            // force += springForce / sqrDt;
            force.add(springForce.clone().multiplyScalar(1/sqrDt)); 
			//前フレームと値が同じにならないように
			let temp = currTipPos.clone();

            //verlet
            // currTipPos = (currTipPos - prevTipPos) + currTipPos + (force * sqrDt);
            currTipPos = (currTipPos.clone().sub(prevTipPos.clone())).add(currTipPos.clone()).add(force.multiplyScalar(sqrDt));

            //長さを元に戻す
            // currTipPos = ((currTipPos - trs.position).normalized * springLength) + trs.position;
            currTipPos = (currTipPos.clone().sub(getWorldPosition(trs))).normalize().multiplyScalar(springLength).add(getWorldPosition(trs));

            //衝突判定
            // for (int i = 0; i < colliders.Length; i++)
            // {
            //     if (Vector3.Distance(currTipPos, colliders[i].transform.position) <= (radius + colliders[i].radius)) {
            //         Vector3 normal = (currTipPos - colliders[i].transform.position).normalized;
            //         currTipPos = colliders[i].transform.position + (normal * (radius + colliders[i].radius));
            //         currTipPos = ((currTipPos - trs.position).normalized * springLength) + trs.position;
            //     }
            // }

            prevTipPos = temp.clone();
  
            let aimVector = trs.getWorldDirection(new THREE.Vector3()); 

            var worldMatrix = trs.matrixWorld; 
            const xAxis = new THREE.Vector3();   
            xAxis.setFromMatrixColumn(worldMatrix, 0); // 0 是列索引，对应X轴  
            aimVector = xAxis.clone(); 
             
            // worldMatrix.extractBasis(aimVector, new THREE.Vector3() , new THREE.Vector3());

            
            // 现在 xAxis 包含了物体局部坐标系中X轴方向的世界坐标向量

            let aimRotation = new THREE.Quaternion();
			aimRotation.setFromUnitVectors(aimVector.clone(), currTipPos.clone().sub(getWorldPosition(trs)));
            scene.attach(refObj);
            refObj.quaternion.copy(getWorldQuaternion(org).multiply(aimRotation)) ; 
            trs.parent.attach(refObj);
            trs.quaternion.copy(refObj.quaternion.clone()) ; 

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
			let secondaryRotation = aimRotation.multiply(getWorldQuaternion(org)) ;
            
            //trs.rotation = Quaternion.Lerp (org.rotation, secondaryRotation, managerRef.dynamicRatio);
            // trs.rotation = Quaternion.Lerp(org.rotation, secondaryRotation, 1);
            // trs.quaternion.rotateTowards(secondaryRotation, 1);

        } 
        Awake();
    }
}

export { SpringBone };