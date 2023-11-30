

// 拖尾特效
// line renderer splines
// 渲染线模型、给线模型赋予材质、实时改变线模型长度
import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import * as Curves from 'three/examples/jsm/curves/CurveExtras.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
class YJTrailRenderer {
    constructor(_this, scene, parent) {
        let scope = this;
        this.used = false;

        // const map = new THREE.TextureLoader().load(_this.$publicUrl + "images/smoke001.png");
        const map = new THREE.TextureLoader().load(_this.$publicUrl + "images/box.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshBasicMaterial(
            {
                color: 0xffffff,
                depthWrite: false, // 透明物体之间不相互遮挡
                transparent: true,
                blending: THREE.AdditiveBlending,
                map: map,
            }
        );
        const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3, wireframe: true, transparent: true });
        let splinePath = [
            // new THREE.Vector3(0, 0, 0), 
            // new THREE.Vector3(0, 0, 1),
            // new THREE.Vector3(0, 0, 2),
            // new THREE.Vector3(0, 0, 3),
            // new THREE.Vector3(0, 0, 4),
        ];
        let tubeGeometry, mesh;
        const params = {
            width: 0.1, //宽度
            radiusSegments: 2,//边数
            closed: false,
        };
        let oldPos = new THREE.Vector3();
        let group = new THREE.Group();
        // group.add(new THREE.AxesHelper(1));
        scene.add(group);
        // parent.add(group);
        group.position.set(0, 1, 0);
        oldPos = parent.position.clone();
        function Init() {
            // const gui = new GUI({ width: 285 });
            // const folderGeometry = gui.addFolder('Geometry');
            // folderGeometry.add(params, 'width', 0.01, 1).step(0.01).onChange(function () {
            //     setScale();
            // }); 

            addTube();
            animate();
        }
        function addTube() {
            if (mesh !== undefined) {
                group.remove(mesh);
                mesh.geometry.dispose();
            }
            if (splinePath.length < 2) {
                return;
            }
            const extrudePath = new THREE.CatmullRomCurve3(splinePath);
            tubeGeometry = new THREE.TubeGeometry(extrudePath, splinePath.length - 1, params.width / 2, params.radiusSegments, params.closed);
            addGeometry(tubeGeometry);
            // setScale();
        }
        function setScale() {
            mesh.scale.set(1, 1, 1);
        }
        function addGeometry(geometry) {
            mesh = new THREE.Mesh(geometry, material);
            // const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
            // mesh.add(wireframe);
            group.add(mesh);
        }
        let count = 0;
        let time = 0;
        let lifeTime = 0.02;
        let maxLength = 20;
        let startPos = null;
        let updateId = null;
        this.start = function () {
            // console.log("复用 trail ");
            count = 0;
            animate();
        }
        function animate() {
            updateId = requestAnimationFrame(animate);
            let newPos = parent.position.clone();
            scope.used = true;
            if (newPos.distanceTo(oldPos) > 0.021) {
                // if (splinePath.length == 0) {
                //     startPos = newPos.clone();
                //     splinePath.unshift(new THREE.Vector3(0, 0, 0));
                // } else {
                //     let _newPos = newPos.clone().add(startPos);
                //     splinePath.unshift(_newPos);
                //     console.log(startPos, _newPos);
                // } 
                splinePath.push(newPos);
                if (splinePath.length > maxLength) {
                    splinePath.splice(0, 1);
                }
                addTube();
                oldPos = newPos;

            } else {
            }
            if (splinePath.length > 0) {
                time += 0.01;
                if (time >= lifeTime) {
                    splinePath.splice(0, 1);
                    addTube();
                    time = 0;
                }
            } else {
                count += 1;
                if (count >= 30) {
                    scope.used = false;
                    cancelAnimationFrame(updateId);
                }
            }
            // 
            // group.position.z = Math.sin(count);


        }
        Init();
    }
}

export { YJTrailRenderer };