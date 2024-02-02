

// 用来做特效

import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import { MathUtils } from "three";
import { Color } from "three";


// import { range, texture, mix, uv, color, positionLocal, timerLocal, attribute, SpriteNodeMaterial } from 'three/nodes';
class YJParticle {
    constructor(_this, parent, transform) {
        let scope = this;
       let dummy = new THREE.Object3D();
       let state = false;
        
       let reloadTimes = 0;
       let currentCount = 0;
       let time = 0;
       let generateSpeed = 5; //生成间隔
       let areaMesh = null;

       let Shape = {
            Box: "box",
            Sphere: "sphere",
            Cone: "cone",
        };


        let data = {
            shape: {
                type: Shape.Box, // 发射形状
                // 发射范围大小
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
            },

            startSpeed: 0.02,// 发射速度
            startLifetime: 1, // 粒子存活时长
            startSize: 1,// 粒子大小

            maxParticles: 100,// 最大数量

            particleType: "image", // 粒子类型 图片、模型
            particlePath: "", // 粒子引用路径

            renderAlignment: "view", // 渲染对齐模式
            
            sizeOverLifetime:false,
            sizeOverLifetimeValue:[1,0],

            colorOverLifetime:false,
            colorOverLifetimeStart:"#ffffff",
            colorOverLifetimeEnd:"#ffffff",
        };

        let matrix = new THREE.Matrix4();
        let tempPos = new THREE.Vector3(0, 0, 0);

        let instanceMesh = null;
        let playerPos;

        this.SetMessage = function(_data) {
            // console.log(" ========== in yj particle Load ", _data);
            data = _data;
            currentCount = 0;
            reloadTimes++;
            // 获取数据后重新生成粒子特效
            if (instanceMesh != null) {
                // model.remove(instanceMesh);
                _this.scene.remove(instanceMesh);
            }

            this.createMesh();
    
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
                        offsetY = size.y /2;
                        break;
    
                    case Shape.Cone:
                        // let size = data.shapeSize;
    
                        geo = new THREE.CylinderGeometry(size[0], size[1], data.startSpeed * 1, 32); // 圆柱体
                        offsetY = data.startSpeed * 1/2;
                        break;
    
                    default:
                        break;
                }
    
                if (areaMesh != null) { 
                    parent.remove(areaMesh);
                }
                areaMesh = new THREE.Mesh(geo, mat);
                areaMesh.position.y = offsetY;
                parent.add(areaMesh);
            }

            setInterval(() => {
                if (currentCount < data.maxParticles) {
                    this.generate(currentCount);
                    currentCount++;
                } 
            }, 200);
        }
    
        /**
         * 构建坐标
         */
         this.createPosList = function() {
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
        this.Destroy = function() {
            console.log("删除特效");
            _this.scene.remove(instanceMesh);
        }
        this.createMesh = function() {
            // this.model.add(new THREE.AxesHelper(5));
            let map = null;
            if (data.particlePath != "") {
                map = new THREE.TextureLoader().load(_this.$uploadUVAnimUrl + data.particlePath);
            }
            // console.log(map);
            let material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: map,
                side: THREE.DoubleSide,
                transparent: true,
                depthWrite: false, // 透明物体之间不相互遮挡
                // blending: this.data.isBlack ? THREE.AdditiveBlending : THREE.NoBlending,
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
            // model.add(mesh);
            _this.scene.add(mesh);
    
            // mesh.frustumCulled = false;  //解决物体在某个角度不显示的问题
            mesh.instanceMatrix.needsUpdate = true;
        }
    
        this.changeState = function(bool) {
            state = bool;
            this.setVisible(bool);
        }
    
        this.getState = function() {
            return state;
        }
    
        this.restart = function() {
            if (pathTween != undefined) {
                pathTween.stop();
                this.resetPos();
            }
        }
        this.stop = function() {
    
            if (pathTween != undefined) {
                pathTween.stop();
            }
            this.setVisible(false);
        }
        this.resetPos = function() {
            this.createPosList();
        }
    
        this.setVisible = function(bool) {
            instanceMesh.visible = bool;
        }
    
        this.transformToMatrix4 = function(pos) {
    
            const position = new THREE.Vector3(pos.x, pos.y, pos.z);
            const rotation = new THREE.Euler(0, 0, 0);
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3(1, 1, 1);
            quaternion.setFromEuler(rotation);
            matrix.compose(position, quaternion, scale);
        }
    
    
        this.randomPos = function() {
            let size = data.shape.scale;
    
            switch (data.shape.type) {
                case Shape.Box:
                    return [(Math.random() - 0.5) * size[0], Math.random() * size[1], (Math.random() - 0.5) * size[2]];
                    // return [(Math.random() - 0.5) * size.x, Math.random() * size.y, (Math.random() - 0.5) * size.z];
                case Shape.Cone: 
                    return [(Math.random() - 0.5) * size[0],0, (Math.random() - 0.5) * size[2]];
                default:
                    break;
            }
    
            return [Math.random() * 150 - 75, Math.random() * 10 - 3, Math.random() * 150 - 75];
    
    
        }
        this.generate = function(index) {
            // console.log(" 生成特效 00");
            const mesh = instanceMesh;
            const pos = this.randomPos();
    
            // console.log(" generate pos ",pos);
            dummy.position.set(
                pos[0],
                pos[1],
                pos[2]
            );
            dummy.position.add(parent.position);
    
            if (data.renderAlignment == 'view') {
                dummy.lookAt(playerPos);
            }
            dummy.updateMatrix();
    
            mesh.setMatrixAt(index, dummy.matrix);
            this.move(index, dummy.position.clone(), reloadTimes);
    
        }
        this.move = function(index, startPos, _reloadTimes) {
            const mesh = instanceMesh;
            const dummy = new THREE.Object3D();
            let num = 0;
            // let color = new THREE.Color(0xffff00);
            let color = new THREE.Color(data.colorOverLifetimeStart);
            let color2 = new THREE.Color(data.colorOverLifetimeEnd);
            let sizeStart = data.sizeOverLifetimeValue[0];
            let sizeEnd = data.sizeOverLifetimeValue[1];
            new TWEEN.Tween({ y: 0 }).to({ y: 1 }, data.startLifetime * 1000).easing(TWEEN.Easing.Quadratic.In).delay(0).onUpdate((v2) => {
    
                startPos.y += data.startSpeed * 0.01;
    
                let v = v2.y;
                // console.log(index,num); 
                // console.log(" 粒子生命周期 ",v); 
                dummy.position.copy(startPos);
                if (data.renderAlignment == 'view') {
                    dummy.lookAt(playerPos);
                }
    
                // 生命周期内大小
                if(data.sizeOverLifetime){
                    let size =  MathUtils.lerp(sizeStart,sizeEnd,(v/1));
                    dummy.scale.set(size,size,size); 
                } 
                
                dummy.updateMatrix();
                mesh.setMatrixAt(index, dummy.matrix);
                 
                // 生命周期内颜色
                if(data.colorOverLifetime){ 
                    mesh.setColorAt( index, color.lerp( color2,(v/1)) );
                    mesh.instanceColor.needsUpdate = true;
                }
    
                num++;
            }).onStart(function () {
            }).onStop(function () {
            }).onComplete(() => {

                // if (reloadTimes == _reloadTimes) {
                //     this.generate(index);
                // }
                this.generate(index);

            }).start();
    
        }
        this._update = function() {
            // console.log(" in particle update ",playerPos);
            playerPos = _this._YJSceneManager.GetCameraWorldPoss();
            // if (currentCount < data.maxParticles) {
            //     time++;
            //     if (time > generateSpeed) {
            //         this.generate(currentCount);
            //         currentCount++;
            //         time = 0;
            //     }
            // } else {
    
            // }
            instanceMesh.instanceMatrix.needsUpdate = true;
        }
    }

}

export { YJParticle };