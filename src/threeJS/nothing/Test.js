


import * as THREE from 'three';

import ThreeJsAnimParser from './ThreeJsAnimParser';

export default class Test {
    constructor(root, filename, frameRate = 30) {
        this.root = root;
        this.filename = filename;
        this.frameRate = frameRate;
        this.frameIdx = 0;
        this.t = new ThreeJsAnimParser();
        this.mapping = new Map();
    }

    async start() {
        await this.t.readJson(this.filename);

    }
    load(jsonData) {
        this.t.load(jsonData);
        this.t.getBones(this.root);
        this.mapping = this.mapThreeJsSkeleton(this.t.boneList, this.t.getSkeleton());
        setInterval(() => {
            this.update();
        }, 1000 / this.frameRate);

    }

    mapThreeJsSkeleton(boneList, skeleton) {
        let mapping = new Map();
        for (let boneName of skeleton) {
            let foundBone = boneList.find(bone => bone.name === boneName);
            if (foundBone) {
                mapping.set(boneName, foundBone);
            }
        }
        return mapping;
    }

    update() {
        const { frameData, currRoot } = this.t.getFrame(this.frameIdx);
        if (this.frameIdx < this.t.frames - 1) {
            this.frameIdx++;
        } else {
            this.frameIdx = 0;
        }

        this.t.boneList[0].position.copy(currRoot.multiplyScalar(0.01));

        for (let bone of this.t.boneList) {
            if (!frameData.has(bone.name)) {
                continue;
            }
            const currFrameQuat = frameData.get(bone.name);

            const unityQuat = this.t.unityT.get(bone.name);
            if (bone.name == "Hips") {
                console.log(bone.name + "quat euler 11 ",  unityQuat.clone());
            }
            // bone.quaternion.copy(currFrameQuat.multiply(unityQuat));

            // let quat = currFrameQuat.multiply(unityQuat);
            let quat = unityQuat;
            // let quat = currFrameQuat;
            let v = new THREE.Euler();
            v.setFromQuaternion(quat);
            v.y += Math.PI;
            v.z *= -1; 
            // v.x += Math.PI/4;
            quat.setFromEuler(v);
            bone.quaternion.copy(quat);
            if (bone.name == "Hips") {
                console.log(bone.name + "quat euler 22 ",   bone.quaternion);
            }
        }
    }
}
