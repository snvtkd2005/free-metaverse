

// 用来做特效

import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

// import { range, texture, mix, uv, color, positionLocal, timerLocal, attribute, SpriteNodeMaterial } from 'three/nodes';
export default class YJParticle {
    constructor(_this, parent, transform) {
        this._this = _this;
        this.dummy = new THREE.Object3D();
        this.state = false;
        this.parent = parent;
        this.transform = transform;
        this.reloadTimes = 0;
        this.currentCount = 0;
        this.time = 0;
        this.generateSpeed = 5;
        this.areaMesh = null;
        this.settingData = {
            shapeType: "box", // 发射形状
            shapeSize: 10, // 发射范围大小
            startSpeed: 0.02,// 发射速度
            startLifetime: 1, // 粒子存活时长
            startSize: 1,// 粒子大小

            maxParticles: 100,// 最大数量

            particleType: "image", // 粒子类型 图片、模型
            particlePath: "", // 粒子引用路径

            renderAlignment: "view", // 渲染对齐模式
        };

        this.matrix = new THREE.Matrix4();
        this.tempPos = new THREE.Vector3(0, 0, 0);

        this.instanceMesh = null;
        this.playerPos;
 
    }
 
    SetMessage(_data) {
        console.log(" ========== in yj particle Load ", _data);
        this.settingData = _data;
        this.currentCount = 0;
        this.reloadTimes++;
        // 获取数据后重新生成粒子特效
        if (this.instanceMesh != null) {
            // this.model.remove(this.instanceMesh);
            this._this.scene.remove(this.instanceMesh);
        }
        this.createMesh();
        if (this.settingData.shapeType == "box" && _Global.setting.inEditor) {
            let size = this.settingData.shapeSize;
            let geo = new THREE.BoxGeometry(size, size, size, 1); // 生成平面
            let mat = new THREE.MeshStandardMaterial({ 
                color: 0x0000ff,
                wireframe: true,
             }); // 材质
            this.areaMesh = new THREE.Mesh(geo, mat);
            this.parent.add(this.areaMesh);  
        }
    }

    /**
     * 构建坐标
     */
    createPosList() {
        let step = 30; // 范围半径
        let item = {
            longitude: 0,
            latitude: 0
        };
        let mean = 2 / this.settingData.maxParticles; // 点在圆环上间隔
        let radin = -1;
        for (let i = 0; i < this.settingData.maxParticles; i++) {
            let num = i % 2 ? Math.random() * 120 : -Math.random() * 120;
            let l = radin * Math.PI;
            let x = step * Math.cos(l);
            let z = step * Math.sin(l);
            radin = radin + mean;
        }
    }

    createMesh() {
        // this.model.add(new THREE.AxesHelper(5));
        let map = null;
        if (this.settingData.particlePath != "") {
            map = new THREE.TextureLoader().load(this.settingData.particlePath);
        }
        console.log(map);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: map,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false, // 透明物体之间不相互遮挡
            // blending: THREE.AdditiveBlending,
            alphaTest: 0.1
        })
        const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(this.settingData.startSize, this.settingData.startSize), material, this.settingData.maxParticles);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
        mesh.visible = true;
        mesh.renderOrder = 1;
        mesh.tag = "particle";
        this.instanceMesh = mesh;
        this.instanceMesh.owner = this.owner;
        // this.model.add(mesh);
        this._this.scene.add(mesh);

        // mesh.frustumCulled = false;  //解决物体在某个角度不显示的问题
        mesh.instanceMatrix.needsUpdate = true;
    }

    changeState(bool) {
        this.state = bool;
        this.setVisible(bool);
    }

    getState() {
        return this.state;
    }

    restart() {
        if (this.pathTween != undefined) {
            this.pathTween.stop();
            this.resetPos();
        }
    }
    stop() {

        if (this.pathTween != undefined) {
            this.pathTween.stop();
        }
        this.setVisible(false);
    }
    resetPos() {
        this.createPosList();
    }

    setVisible(bool) {
        this.instanceMesh.visible = bool;
    }

    transformToMatrix4(pos) {

        const position = new THREE.Vector3(pos.x, pos.y, pos.z);
        const rotation = new THREE.Euler(0, 0, 0);
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3(1, 1, 1);
        quaternion.setFromEuler(rotation);
        this.matrix.compose(position, quaternion, scale);
    }


    randomPos() {

        if (this.settingData.shapeType == "box") {
            let size = this.settingData.shapeSize;
            return [(Math.random() - 0.5) * size, Math.random() * size, (Math.random() - 0.5) * size];
        }
        return [Math.random() * 150 - 75, Math.random() * 10 - 3, Math.random() * 150 - 75];


    }
    generate(index) {

        const mesh = this.instanceMesh;
        const pos = this.randomPos();
        this.dummy.position.set(
            pos[0],
            pos[1],
            pos[2]
        );
        this.dummy.position.add(this.parent.position);

        if (this.settingData.renderAlignment == 'view') {
            this.dummy.lookAt(this.playerPos);
        }
        this.dummy.updateMatrix();

        mesh.setMatrixAt(index, this.dummy.matrix);
        this.move(index, this.dummy.position.clone(),this.reloadTimes);

        // setTimeout(() => {
        //     this.generate(index);
        // }, this.settingData.startLifetime * 1000);

    }
    move(index, startPos,reloadTimes) {
        const mesh = this.instanceMesh;
        const dummy = new THREE.Object3D();
        let num = 0;

        new TWEEN.Tween({ y: 0 }).to({ y: 2000 }, this.settingData.startLifetime * 1000).easing(TWEEN.Easing.Quadratic.In).delay(0).onUpdate(() => {

            startPos.y += this.settingData.startSpeed;

            // console.log(index,num); 
            dummy.position.copy(startPos);
            if (this.settingData.renderAlignment == 'view') {
                dummy.lookAt(this.playerPos);
            }
            dummy.updateMatrix();
            mesh.setMatrixAt(index, dummy.matrix);
            num++;
        }).onStart(function () {
        }).onStop(function () {
        }).onComplete(() => {
            if(this.reloadTimes == reloadTimes){
                this.generate(index);
            }
        }).start();

    }
    _update(time) {
        // console.log(" in particle update ",this.playerPos);
        this.playerPos = this._this._YJSceneManager.GetCameraWorldPoss();
        if (this.currentCount < this.settingData.maxParticles) {
            this.time++;
            if (this.time > this.generateSpeed) {
                this.generate(this.currentCount);
                this.currentCount++;
                this.time = 0;
            }
        } else {

        }
        this.instanceMesh.instanceMatrix.needsUpdate = true;
    }
}