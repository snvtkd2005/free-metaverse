


import * as THREE from "three";
import { SpringBone } from "./SpringBone.js";

class SpringManager {
    constructor() {
        let scope = this;
        function init() {

            let bones = _Global.YJ3D._YJSceneManager
                .GetSingleTransformComponent("MeshRenderer").GetAllBoneModel();

            let model = _Global.YJ3D._YJSceneManager
                .GetSingleTransformComponent("MeshRenderer").GetModel();

            for (let i = 0; i < bones.length; i++) {
                const item = bones[i];
                if (
                    item.name.includes("J_L_HeadRibbon_00")
                    || item.name.includes("J_L_HeadRibbon_01")

                    || item.name.includes("J_R_HeadRibbon_00")
                    || item.name.includes("J_R_HeadRibbon_01")

                    || item.name.includes("J_L_HairTail_00")
                    || item.name.includes("J_L_HairTail_01")
                    || item.name.includes("J_L_HairTail_02")
                    || item.name.includes("J_L_HairTail_03")
                    || item.name.includes("J_L_HairTail_04")
                    || item.name.includes("J_L_HairTail_05")

                    || item.name.includes("J_R_HairTail_00")
                    || item.name.includes("J_R_HairTail_01")
                    || item.name.includes("J_R_HairTail_02")
                    || item.name.includes("J_R_HairTail_03")
                    || item.name.includes("J_R_HairTail_04")
                    || item.name.includes("J_R_HairTail_05")

                    || item.name.includes("J_L_HairFront_00")
                    || item.name.includes("J_R_HairFront_00")

                    || item.name.includes("J_L_HairSide_00")
                    || item.name.includes("J_L_HairSide_01")
                    || item.name.includes("J_R_HairSide_00")
                    || item.name.includes("J_R_HairSide_01")

                    || item.name.includes("J_L_Skirt_00")
                    || item.name.includes("J_L_Skirt_01")
                    || item.name.includes("J_L_SusoFront_00")

                    || item.name.includes("J_L_SkirtBack_00")
                    || item.name.includes("J_L_SkirtBack_01")
                    || item.name.includes("J_L_SusoBack_00")

                    || item.name.includes("J_R_Skirt_00")
                    || item.name.includes("J_R_Skirt_01")
                    || item.name.includes("J_R_SusoFront_00")

                    || item.name.includes("J_R_SkirtBack_00")
                    || item.name.includes("J_R_SkirtBack_01")
                    || item.name.includes("J_R_SusoBack_00")

                    || item.name.includes("J_L_Mune_00")
                    || item.name.includes("J_L_Mune_01")
                    || item.name.includes("J_R_Mune_00")
                    || item.name.includes("J_R_Mune_01")



                    || item.name.includes("renti65")
                    || item.name.includes("renti66")
                    // || item.name.includes("renti67")

                ) {
                    let _SpringBone = new SpringBone(item, item.children[0], _Global.YJ3D.scene, model);
                    scope.Add(_SpringBone);
                }
                // console.log(item.name);
                // scene.attach(ball);
            }


            model.traverse(function (item) {
                if (
                    item.name.includes("renti65")
                    || item.name.includes("renti66")
                    // || item.name.includes("renti67")

                ) {
                    let _SpringBone = new SpringBone(item, item.children[0], _Global.YJ3D.scene, model);
                    scope.Add(_SpringBone);
                }
                // console.log(item.name);
            }); 
            let transform = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
            _Global.YJ3D._YJSceneManager._YJTransformManager.attach(
                transform.GetGroup()
            );
        }
        let springBone = [];
        this.Add = function (s) {
            springBone.push(s);
        }

        this._update = function () {
            for (let i = 0; i < springBone.length; i++) {
                const element = springBone[i];
                springBone[i].UpdateSpring();
            }
        }
        init();
    }
}

export { SpringManager };