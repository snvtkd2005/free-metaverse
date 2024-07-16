

import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 实例物品
 */
class InstancedManager {
    constructor(mesh, balloonName) {
        this.balloonName = balloonName;
        this.meshMap = [];
        this.dummy = new THREE.Object3D();
        this.state = false;
        this.modelList = [
            {
                id: 10010,
                radius: 0.3,
                color: "#F3CC3F"
            },
            {
                id: 10011,
                radius: 0.1,
                color: "#A156F3"
            },
            {
                id: 10012,
                radius: 0.2,
                color: "#F5D1FD"
            }
        ];
        // 动画变量
        this.balloonPosList = [];//气球位置数组
        this.count = 100;//气球个数
        this.index = 0;
        this.time = 15000; // 播放时间
        this.lastTime = 0; // 已经运行的时间 


        /**
         * 构建坐标
         */
        this.createPosList = function() {
            for (let x = 0; x < this.count; x++) {
                this.balloonPosList.push({
                    index: 0,
                    // index: (Math.random() * 2).toFixed(0),
                    pos: [Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25]
                });
            }
        }
        loadMesh = function(path, callback) {
            const self = this;
 
            const material = mesh.material; 
            // check overdraw
            // let material = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.1, transparent: true } );
            const geometry = mesh.geometry;

            const mesh = new THREE.InstancedMesh(geometry, material, self.count);
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
            mesh.visible = true;
            self.meshMap.push(mesh)
            self.app.scene.add(mesh);

            if (callback) {
                callback();
            }
        }
        createMesh = function() {
            const self = this;
            let num = 0;
            //texiaoData
            this.loadMesh(this.balloonName, () => {
                // this.createBalloon();
                this.tweenUpdate();
            });


            this.modelList.forEach(async (cur) => {
                num++;
            })
        }

        changeState = function(bool) {
            this.state = bool;
            this.setVisible(bool);
        }

        getState = function() {
            return this.state;
        }



        createBalloon = function() {

            // console.log("this.meshMap.length = ",this.meshMap.length,this.meshMap);
            for (let x = 0; x < this.balloonPosList.length; x++) {
                let { pos, index } = this.balloonPosList[x];
                const mesh = this.meshMap[index]
                this.dummy.position.set(
                    pos[0],
                    pos[1] += 0.03,
                    pos[2]
                );
                this.dummy.updateMatrix();
                mesh.setMatrixAt(this.index++, this.dummy.matrix);
            }
            this.index = 0;
            this.updateMatrix();
        }

        restart = function() {
            if (this.pathTween != undefined) {
                this.pathTween.stop();
            }
            this.resetPos();
            this.tweenUpdate();
        }
        stop = function() {
            if (this.pathTween != undefined) {
                this.pathTween.stop();
            }
            this.setVisible(false);
        }
        resetPos = function() {
            this.balloonPosList = [];
            this.createPosList();
        }
        updateMatrix = function() {
            this.meshMap.forEach((mesh) => {
                mesh.instanceMatrix.needsUpdate = true;
            })
        }

        setVisible = function(bool) {
            this.meshMap.forEach((mesh) => {
                mesh.visible = bool;
            })
        }

        tweenUpdate = function() {
            const that = this;
            that.setVisible(true)
            this.pathTween = new TWEEN.Tween({ y: 0 }).to({ y: 2000 }, that.time).easing(TWEEN.Easing.Quadratic.In).delay(0).onUpdate(function () {
                //
                for (let x = 0; x < that.balloonPosList.length; x++) {
                    let { pos, index } = that.balloonPosList[x];
                    const mesh = that.meshMap[index]
                    that.dummy.position.set(
                        pos[0],
                        pos[1] += 0.03,
                        pos[2]
                    );
                    that.dummy.updateMatrix();
                    mesh.setMatrixAt(that.index++, that.dummy.matrix);
                }
                that.index = 0;
                that.updateMatrix();

            }).onStart(function () {

            }).onStop(function () {
                // 停止移动

            }).onComplete(function () {
                // console.log("气球动画播放结束");
                // 完成移动
                // that.setVisible(false)
                that.resetPos();
                that.tweenUpdate();
            }).start();
            // this.pathTween.repeat(Infinity);
        }

        update = function(time) {
            // if(this.getState()){
            //     this.lastTime+=time;
            //     if (this.lastTime < this.time) {
            //         this.createBalloon();
            //     } 
            //     this.index = 0;
            // }
        }
    }
}
export { InstancedManager };
