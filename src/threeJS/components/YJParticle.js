

// 用来做特效

import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import { MathUtils } from "three";
import { Color } from "three";


// import { range, texture, mix, uv, color, positionLocal, timerLocal, attribute, SpriteNodeMaterial } from 'three/nodes';
class YJParticle {
    constructor( parent, transform) {
        let scope = this;
        let dummy = new THREE.Object3D(); 
        let state = false;

        let reloadTimes = 0;
        let currentCount = 0;
        let time = 0;
        let playbackSpeed = 1/30; //生成间隔
        let areaMesh = null;

        let Shape = {
            Box: "box",
            Sphere: "sphere",
            Cone: "cone",
        };


        let data = {
        looping:true,
        hasShape:false,
            shape: {
                type: Shape.Box, // 发射形状
                // 发射范围大小
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
            },

            startSpeed: 10,// 发射速度
            startLifetime: 1, // 粒子存活时长
            startSize: 1,// 粒子大小

            maxParticles: 100,// 最大数量

            particleType: "image", // 粒子类型 图片、模型
            particlePath: "", // 粒子引用路径

            renderAlignment: "view", // 渲染对齐模式

            sizeOverLifetime: false,
            sizeOverLifetimeValue: [1, 0],

            rotationOverLifetime: false,
            rotationOverLifetimeValue: [0,0,0],

            colorOverLifetime: false,
            colorOverLifetimeStart: "#ffffff",
            colorOverLifetimeEnd: "#ffffff",
        };

        let matrix = new THREE.Matrix4();
        let tempPos = new THREE.Vector3(0, 0, 0);

        let instanceMesh = null;
        let playerPos;


        /**
         * 构建坐标
         */
        this.createPosList = function () {
            let step = 30; // 范围半径
            let item = {
                longitude: 0,
                latitude: 0
            };
            let mean = 2 / data.maxParticles; // 点在圆环上间隔
            let radin = -1;
            for (let i = 0; i < data.maxParticles; i++) {
                let num = i % 2 ? Math.random() * 120 : -Math.random() * 120;
                let l = radin * Math.PI;
                let x = step * Math.cos(l);
                let z = step * Math.sin(l);
                radin = radin + mean;
            }
        }

        //销毁组件
        this.Destroy = function () {
            console.log("删除特效");
            instanceMesh.parent.remove(instanceMesh);
            // _Global.YJ3D.scene
        }
        this.createMesh = function () {
            
            let map = null;
            if (data.particlePath != "") {
                map = new THREE.TextureLoader().load(_Global.url.uploadUVAnimUrl + data.particlePath);
            }else{
                map = new THREE.TextureLoader().load("./public/images/cirle001.png");
            }
            // console.log(map); MeshBasicMaterial  SpriteMaterial
            let material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: map,
                side: THREE.DoubleSide,
                transparent: true,
                depthWrite: false, // 透明物体之间不相互遮挡
                blending: data.isBlack ? THREE.AdditiveBlending : THREE.NormalBlending,
                // blending: this.data.isBlack ? THREE.MultiplyBlending : THREE.NoBlending,
                // alphaTest: 0.01,
            })

            if (data.color) {
                material.color.set(data.color);
            }

            const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(data.startSize, data.startSize), material, data.maxParticles);
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
            mesh.visible = true;
            mesh.renderOrder = 1;
            mesh.tag = "particle";
            instanceMesh = mesh;
            instanceMesh.owner = scope.transform;
             
            _Global.YJ3D.scene.add(mesh);
            // mesh.frustumCulled = false;  //解决物体在某个角度不显示的问题
            mesh.instanceMatrix.needsUpdate = true;
        }

        this.changeState = function (bool) {
            state = bool;
            this.setVisible(bool);
        }

        this.getState = function () {
            return state;
        }

        this.restart = function () {
            if (pathTween != undefined) {
                pathTween.stop();
                this.resetPos();
            }
        }
        this.stop = function () {

            if (pathTween != undefined) {
                pathTween.stop();
            }
            this.setVisible(false);
        }
        this.resetPos = function () {
            this.createPosList();
        }

        this.setVisible = function (bool) {
            instanceMesh.visible = bool;
        }

        this.transformToMatrix4 = function (pos) {

            const position = new THREE.Vector3(pos.x, pos.y, pos.z);
            const rotation = new THREE.Euler(0, 0, 0);
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3(1, 1, 1);
            quaternion.setFromEuler(rotation);
            matrix.compose(position, quaternion, scale);
        }


        this.randomPos = function () {
            if(!data.hasShape){
                return [0,0,0];
            }
            let size = data.shape.scale;

            switch (data.shape.type) {
                case Shape.Box:
                    return [(Math.random() - 0.5) * size[0], Math.random() * size[1], (Math.random() - 0.5) * size[2]];
                // return [(Math.random() - 0.5) * size.x, Math.random() * size.y, (Math.random() - 0.5) * size.z];
                case Shape.Cone:
                    return [(Math.random() - 0.5) * size[0], 0, (Math.random() - 0.5) * size[2]];
                default:
                    break;
            }

            return [Math.random() * 150 - 75, Math.random() * 10 - 3, Math.random() * 150 - 75];


        }
        this.generate = function (index, cP) {
            // console.log(" 生成特效 00"); 
            const pos = this.randomPos();
            // console.log(" generate pos ",pos);
            dummy.position.set(
                pos[0],
                pos[1],
                pos[2]
            );
            dummy.position.add(parent.position);
            dummy.scale.set(1, 1, 1);

            if (data.renderAlignment == 'view') {
                dummy.lookAt(playerPos);
            }
            dummy.updateMatrix();
            // 生命周期内颜色
            if (data.colorOverLifetime) {
                instanceMesh.setColorAt(index, color.clone()); 
                instanceMesh.instanceColor.needsUpdate = true;
            }

            instanceMesh.setMatrixAt(index, dummy.matrix);
            instanceMesh.instanceMatrix.needsUpdate = true;

            this.move(index, dummy.position.clone(), reloadTimes, cP);

        }

        let color, color2, sizeStart, sizeEnd;
        let rotaStart = [0,0,0];
        let rotaEnd = [0,0,0];
        let de2reg = 57.29578;

        this.move = function (index, startPos, _reloadTimes, cP) {
            let tween = new TWEEN.Tween({ y: 0 }).to({ y: 1 }, data.startLifetime * 1000);//.easing(TWEEN.Easing.Quadratic.In);
            tween.onUpdate((v2) => {

                let v = v2.y;
                startPos.y += data.startSpeed * 0.01;


                // console.log(" 粒子生命周期 ", index, v);
                dummy.position.copy(startPos);

                // console.log(" renderAlignment ", data.renderAlignment);

                if (data.renderAlignment == 'view') {
                    dummy.lookAt(playerPos);
                    
                }else{
                    dummy.rotation.copy(parent.rotation); 
                }

                // 生命周期内大小
                if (data.sizeOverLifetime) {
                    let size = MathUtils.lerp(sizeStart, sizeEnd, (v / 1));
                    dummy.scale.set(size, size, size);
                }

                // 生命周期内旋转
                if (data.rotationOverLifetime) {
                    let x = MathUtils.lerp(0, rotaEnd[0] / de2reg, (v / 1));
                    let y = MathUtils.lerp(0, rotaEnd[1] / de2reg, (v / 1));
                    let z = MathUtils.lerp(0, rotaEnd[2] / de2reg, (v / 1));
                    dummy.rotation.x += x; 
                    dummy.rotation.y += y; 
                    dummy.rotation.z += z; 
                }
                // console.log(" dummy.rotation ",dummy.rotation);
                

                dummy.updateMatrix();
                instanceMesh.setMatrixAt(index, dummy.matrix);

                // 生命周期内颜色
                if (data.colorOverLifetime) {
                    instanceMesh.setColorAt(index, color.clone().lerp(color2.clone(), (v / 1))); 
                    instanceMesh.instanceColor.needsUpdate = true;
                }


                instanceMesh.instanceMatrix.needsUpdate = true;

            });
            tween.onComplete(() => { 
                cP.has = false;
                if (index == 0) {
                    inLoop = true;
                }  
                if(data.looping){

                }else{
                    dummy.scale.set(0, 0, 0);
                    dummy.updateMatrix();
                    instanceMesh.setMatrixAt(index, dummy.matrix);
                    instanceMesh.instanceMatrix.needsUpdate = true;
                }
            });
            // tween.repeat(Infinity);
            tween.start();

        }
        let list = [];
        let inLoop = false;
        this.Reset = function(){
            this.SetMessage(data);
        }
        this.SetMessage = function (_data) {
            console.log(" ========== in yj particle Load ", _data);
            if(_data){
                data = _data;
            }
            list = [];
            currentCount = 0;
            inLoop = false;
            reloadTimes++;
            // 获取数据后重新生成粒子特效
            if (instanceMesh != null) { 
                instanceMesh.parent.remove(instanceMesh);
            }

            color = new THREE.Color(data.colorOverLifetimeStart);
            color2 = new THREE.Color(data.colorOverLifetimeEnd);
            sizeStart = data.sizeOverLifetimeValue[0];
            sizeEnd = data.sizeOverLifetimeValue[1];
            rotaEnd = data.rotationOverLifetimeValue;
            if(data.hasShape == undefined){
                data.hasShape = true;
            }
            if(data.looping == undefined){
                data.looping = true;
            }
            
            this.createMesh();
            return;
            if (_Global.setting.inEditor) {

                let mat = new THREE.MeshStandardMaterial({
                    color: 0x0000ff,
                    wireframe: true,
                }); // 材质
                let geo = null;
                let size = data.shape.scale;
                let offsetY = 0;
                switch (data.shape.type) {
                    case Shape.Box:
                        geo = new THREE.BoxGeometry(size[0], size[1], size[2], 1); // 生成平面
                        offsetY = size.y / 2;
                        break;

                    case Shape.Cone:
                        // let size = data.shapeSize;

                        geo = new THREE.CylinderGeometry(size[0], size[1], data.startSpeed * 1, 8); // 圆柱体
                        offsetY = data.startSpeed * 1 / 2;
                        break;

                    default:
                        break;
                }

                if (areaMesh != null) {
                    instanceMesh.parent.remove(areaMesh);
                }
                areaMesh = new THREE.Mesh(geo, mat);
                areaMesh.position.y = offsetY;
                parent.add(areaMesh);
            }

        }
        const clock = new THREE.Clock();

        this._update = function () {
            if(instanceMesh==null){
                return;
            }
            let delta = clock.getDelta();
            if(delta>0.05){
                return;
            }
            playerPos = _Global.YJ3D._YJSceneManager.GetCameraWorldPoss(); 

            // console.log(" in particle update ",playerPos); 
            if (currentCount < data.maxParticles && !inLoop ) {
                time += delta;
                if (time > playbackSpeed) {
                    list.push({ index: currentCount, has: true });
                    this.generate(currentCount, list[list.length - 1]);
                    currentCount++;
                    time = 0;
                }
            } else {  
                if(!data.looping){
                    return;
                }
                time += delta; 
                if (time > playbackSpeed) {
                    for (let i = 0; i < list.length; i++) {
                        const element = list[i];
                        if (!element.has) {
                            element.has = true;
                            this.generate(element.index, element);
                            time = 0;
                            return;
                        }
                    }
                }
            }
        }
    }

}

export { YJParticle };