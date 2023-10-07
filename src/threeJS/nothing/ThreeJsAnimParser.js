import * as THREE from 'three';
export default class ThreeJsAnimParser {
    constructor() {
        this.frames = 0;
        this.frameTime = 1000 / 60;
        this.boneList = [];
        this.boneParents = new Map();
        this.anim = null;
        this.unityT = new Map();
    }

    async readJson(filename) {
        const response = await fetch(filename);
        const jsonData = await response.json();
        this.anim = jsonData;
        this.frames = this.anim.frames.length;
    }
    load(jsonData) {

        this.anim = jsonData;
        this.frames = this.anim.frames.length;
    }

    getBones(root) {
        root.traverse((bone => {
            if (!this.boneList.filter(v => v.name == bone.name).length) {
                this.boneList.push(bone);
            }
        }));
        for (let bone of this.boneList) {
            this.boneParents.set(bone.name, bone.parent.name);
            this.unityT.set(bone.name, bone.quaternion.clone());
        }
    }

    getFrame(frameIndex) {
        const frame = this.anim.frames[frameIndex];
        const frameData = new Map();
        const currRoot = new THREE.Vector3();

        let index = 0;
        for (let i = 0; i < this.anim.header.frame_descriptor.length; i++) {
            const descriptor = this.anim.header.frame_descriptor[i];
            if (descriptor.ch !== 'pos') {
                const quat = new THREE.Quaternion(
                    frame.data[index],
                    frame.data[index + 1],
                    frame.data[index + 2],
                    frame.data[index + 3]
                );


                // let v = new THREE.Euler();
                // v.setFromQuaternion(quat);
                // // v.y += Math.PI;
                // // v.z *= -1; 
                // // v.y *= -1; 
                // v.x -= Math.PI/2;
                // quat.setFromEuler(v);
                if (descriptor.node == "Hips") {
                    console.log(descriptor.node + "quat euler ", quat);
                }

                frameData.set(descriptor.node, quat);
                index += 4;
            } else {
                currRoot.set(-frame.data[index], frame.data[index + 1], frame.data[index + 2]);
                index += 3;
            }
        }

        // for (let i = 0; i < this.anim.header.frame_descriptor.length; i++) {
        //     const descriptor = this.anim.header.frame_descriptor[i];
        //     if (descriptor.ch !== 'pos' && descriptor.node !== this.anim.header.frame_descriptor[0].node) {
        //         const parentQuat = frameData.get(this.boneParents.get(descriptor.node));
        //         const nodeQuat = frameData.get(descriptor.node);
        //         const resultQuat = new THREE.Quaternion();
        //         resultQuat.multiplyQuaternions(parentQuat, nodeQuat);
        //         frameData.set(descriptor.node, resultQuat);
        //     }
        // }
        return { frameData, currRoot };
    }

    getSkeleton() {
        let bones = [];
        for (let descriptor of this.anim.header.frame_descriptor) {
            if (descriptor.ch !== 'pos') {
                bones.push(descriptor.node);
            }
        }
        return bones;
    }
}
