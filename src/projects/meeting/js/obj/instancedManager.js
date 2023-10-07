import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
export default class InstancedManager {
    constructor(app, balloonName) {
        this.app = app;
        this.balloonName = balloonName;
        this.meshMap = [];
        this.dummy = new THREE.Object3D();
        this.state = false;
        // F3CC3F     A156F3    F5D1FD
        // this.modelList = [{
        //     id: 10010,
        //     radius: 0.3,
        //     color: "#F3CC3F"
        // }, {
        //     id: 10011,
        //     radius: 0.1,
        //     color: "#A156F3"
        // }, {
        //     id: 10012,
        //     radius: 0.2,
        //     color: "#F5D1FD"
        // }] 

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

        // 模型队列，先用球代替
        this.gltfLoader = null;
        // 动画变量
        this.balloonPosList = [];//气球位置数组
        this.count = 100;//气球个数
        this.index = 0;
        this.time = 15000; // 播放时间
        this.lastTime = 0; // 已经运行的时间
        this.createGltfLoad();
        this.createPosList();
    }

    /**
     * 创建加载器
     */
    createGltfLoad() {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("./public/threeJS/draco/gltf/"); // 设置public下的解码路径，注意最后面的/
        dracoLoader.setDecoderConfig({ type: 'js' });
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);
        this.gltfLoader = gltfLoader;
    }

    /**
     * 构建坐标
     */
    createPosList() {
        for (let x = 0; x < this.count; x++) {
            this.balloonPosList.push({
                index: 0,
                // index: (Math.random() * 2).toFixed(0),
                pos: [Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25]
            });
        }
    }
    loadMesh(path, callback) {
        const slef = this;

        this.gltfLoader.load(path, function (gltf) {
            // console.log("创建气球", gltf);

            const gltfMesh = gltf.scene.children[0];
            const material = gltfMesh.material;
            // material.color.setStyle(cur.color);
            // material.color.setHex(0xffffff);

            // check overdraw
            // let material = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.1, transparent: true } );
            const geometry = gltfMesh.geometry;

            const mesh = new THREE.InstancedMesh(geometry, material, slef.count);
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
            mesh.visible = true;
            slef.meshMap.push(mesh)
            slef.app.scene.add(mesh);

            if (callback) {
                callback();
            }
        })
    }
    createMesh() {
        const slef = this;
        let num = 0;
        console.log("加载气球雨路径 ",this.balloonName);
        //texiaoData
        //this.publicUrl + "models/playerSkin/" + "balloon_" + this.balloonName + ".glb"
        this.loadMesh( this.balloonName , () => {
            // this.createBalloon();
            this.tweenUpdate();
        });


        this.modelList.forEach(async (cur) => {
            num++;



            if (num == 1) {
                // this.gltfLoader.load('./public/meeting/models/playerSkin/balloon_yellow.glb', function (gltf) {
                //     console.log("创建气球", num, gltf);

                //     const gltfMesh = gltf.scene.children[0];
                //     const material = gltfMesh.material;
                //     // material.color.setStyle(cur.color);
                //     // material.color.setHex(0xffffff);

                //     // check overdraw
                //     // let material = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.1, transparent: true } );
                //     const geometry = gltfMesh.geometry;

                //     const mesh = new THREE.InstancedMesh(geometry, material, slef.count / 2);
                //     mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
                //     mesh.visible = true;
                //     slef.meshMap.push(mesh)
                //     slef.app.scene.add(mesh);
                // })
            }

            // if (num == 2) {

            //     this.gltfLoader.load('./public/meeting/models/playerSkin/balloon_purple.glb', function (gltf) {
            //         const gltfMesh = gltf.scene.children[0];
            //         const material = gltfMesh.material;
            //         // material.color.setStyle(cur.color);
            //         // material.color.setHex(0xffffff);

            //         // check overdraw
            //         // let material = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.1, transparent: true } );
            //         const geometry = gltfMesh.geometry;

            //         const mesh = new THREE.InstancedMesh(geometry, material, slef.count / 2);
            //         mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
            //         mesh.visible = true;
            //         slef.meshMap.push(mesh)
            //         slef.app.scene.add(mesh);
            //     })
            // }

        })



        // this.createBalloon();
    }

    changeState(bool) {
        this.state = bool;
        this.setVisible(bool);
    }

    getState() {
        return this.state;
    }



    createBalloon() {

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

    restart() {
        if (this.pathTween != undefined) {
            this.pathTween.stop();
        }
        this.resetPos();
        this.tweenUpdate();
    }
    stop() {
        if (this.pathTween != undefined) {
            this.pathTween.stop();
        }
        this.setVisible(false);
    }
    resetPos() {
        this.balloonPosList = [];
        this.createPosList();
    }
    updateMatrix() {
        this.meshMap.forEach((mesh) => {
            mesh.instanceMatrix.needsUpdate = true;
        })
    }

    setVisible(bool) {
        this.meshMap.forEach((mesh) => {
            mesh.visible = bool;
        })
    }

    tweenUpdate() {
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

    update(time) {
        // if(this.getState()){
        //     this.lastTime+=time;
        //     if (this.lastTime < this.time) {
        //         this.createBalloon();
        //     } 
        //     this.index = 0;
        // }
    }
}