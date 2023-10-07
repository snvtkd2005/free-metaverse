import * as THREE from 'three';

export default class Animation {
    constructor(animationData, model) {
        this.model = model;
        // 解析 header 和 frame_descriptor 部分
        this.header = animationData.header || {};
        this.frameDescriptors = this.header.frame_descriptor || [];

        // 将 frame_descriptor 部分解析为一个便于查询的字典
        this.descriptorDict = this.frameDescriptors.reduce((dict, descriptor) => {
            dict[`${descriptor.node}-${descriptor.ch}`] = descriptor;
            return dict;
        }, {});
        // 解析 frame 部分
        this.frames = animationData.frames || [];
    }

    createAnimationClip(model) {
        this.model = model || this.model;
        if (!this.model) return;
        const tracks = [];
        const sizeToObj = {
            rot: 4,
            pos: 3,
        }
        const nodeNameToBoneOffset = {};
        // 遍历所有节点
        for (let nodeName in this.descriptorDict) {
            const descriptor = this.descriptorDict[nodeName];
            const offset = descriptor.offset;
            const node = descriptor.node;
            const ch = descriptor.ch;
            nodeNameToBoneOffset[node] = nodeNameToBoneOffset[node] || {};
            nodeNameToBoneOffset[node][ch] = offset;
        }

        this.model.traverse((bone) => {

        })

        // 遍历所有节点
        for (let nodeName in this.descriptorDict) {
            const descriptor = this.descriptorDict[nodeName];
            const offset = descriptor.offset;
            const node = descriptor.node;
            const ch = descriptor.ch;
            const bone = this.model.getObjectByName(node);
            const parent = bone.parent;
            const parentOffset = nodeNameToBoneOffset[parent.name] ? nodeNameToBoneOffset[parent.name][ch] : undefined;

            bone.add(new THREE.AxesHelper(0.25));
            if (!bone) {
                break;
            }
            // 遍历所有帧
            const times = []
            // const isRootStatus = !!['Armature', '_end', '_End'].filter(v => node.includes(v)).length;

            let values = [];
            for (let i = 0; i < this.frames.length; i++) {
                const frame = this.frames[i];
                if (ch === 'rot') {

                    // let quaternion = new THREE.Quaternion(-frame.data[offset+2], frame.data[offset + 1], frame.data[offset], frame.data[offset + 3]);
                    let quaternion = new THREE.Quaternion(
                        frame.data[offset],
                        frame.data[offset + 1],
                        frame.data[offset + 2],
                        frame.data[offset + 3]);

                    let v = new THREE.Euler();
                    v.setFromQuaternion(quaternion);
                    // v.y += Math.PI;
                    // v.z *= -1; 
                    v.x += Math.PI/2;
                    quaternion.setFromEuler(v);


                    if (offset != 0) {
                        quaternion = quaternion.multiply(parent.quaternion);
                        // quaternion.copy(quaternion.multiply(parent.quaternion));
                    }


                    quaternion = quaternion.multiply(bone.quaternion);

                    values = [...values, quaternion.x, quaternion.y, quaternion.z, quaternion.w];

                } else if (descriptor.ch === 'pos') {
                    const data = frame.data.slice(offset, offset + sizeToObj[ch]);
                    values = [...values, ...data];

                    // let pos = new THREE.Vector3( 
                    //     frame.data[offset],
                    //     frame.data[offset + 1],
                    //     frame.data[offset + 2]);
                    // values = [...values,pos.x,pos.y,pos.z];
                }
                // values = [...values, ...data];
                times.push(frame.time);
            }

            if (descriptor.ch === 'rot') {
                // 四元数轨道
                const trackName = `${node}.quaternion`;
                const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
                tracks.push(track);
            } else if (descriptor.ch === 'pos') {
                // 位置轨道
                const trackName = `${node}.position`;
                const track = new THREE.VectorKeyframeTrack(trackName, times, values);
                tracks.push(track);
            }

        }

        // 创建 AnimationClip
        const animationClip = new THREE.AnimationClip('Animation', -1, tracks);
        animationClip.optimize();
        return animationClip;
    }

    getAnimationClip() {
        // 将解析后的数据转换为 AnimationClip
        this.animationClip = this.createAnimationClip();
        return this.animationClip;
    }
}

