




import * as THREE from "three";

import TWEEN from '@tweenjs/tween.js';
import { YJController } from "./YJController";

/**
 * roguelike角色控制方式：
 * 1，鼠标位置控制角色朝向
 * 2，鼠标点击时攻击
 * 3,禁用左右鼠标旋转视角
 * 4，左键长按连续发射
 */
class YJController_roguelike {
  constructor() {
    var scope = this;
    // super();
    //#region 
    //#endregion 

    let bulletList = [];
    function bullet() {
      let castBall = new THREE.Mesh(new THREE.SphereGeometry(1, 5, 5),
        new THREE.MeshBasicMaterial(
          {
            color: 0xff0000,
            transparent: true,
            opacity: 1,
          }));
      castBall.castShadow = false;
      castBall.receiveShadow = false;
      castBall.tag = "ignoreRaycast";
      parent.add(castBall);
    }
    let killCount = 0;
    this.addEventListener = function () {
      if (_Global.YJ3D.YJRaycaster) {

        if (_Global.setting.inEditor) {
          return;
        }
        if (!_Global.setting.inEditor) {
          _Global.YJ3D.YJController.enableRotate = false;
          _Global.YJ3D.YJController.enablePan = false;
        }

        let h = _Global.YJ3D._YJSceneManager.GetWindowSize().h;
        let tagetPos = new THREE.Vector3();
        _Global.YJ3D.YJRaycaster.addEventListener('mousePos', (x, y) => {
          let _pos = _Global.YJ3D._YJSceneManager.WorldPosToScreenPos(_Global.YJ3D.YJController.GetPlayerWorldPos().clone());
          y += _pos.y / h / 2;
          tagetPos = _Global.YJ3D.YJController.SetPlayerRota4(x, -y, 30);
        });


        let inLongPress = false;
        function fire(npcTransform) {
          if (npcTransform) {
            _Global.YJ3D.YJController.GetPlayerFireCtrl().SetInteractiveNPC(npcTransform);
          } else {
            _Global.YJ3D.YJController.GetPlayerFireCtrl().shootTargetPos(tagetPos.clone(), "time");
          }
          return; 
        }
        // 左键点击
        _Global.YJ3D.YJRaycaster.addEventListener('leftmouseclick', (x, y) => {
          // console.log('leftMouse', x, y);
        });
        _Global._SceneManager.addEventListener('点击NPC', (transform) => {
          console.log("点击NPC2 ", transform);
          fire(transform);
        });

        _Global._SceneManager.addEventListener('点击空', () => {
          //朝这个方向施放攻击，法术攻击、武器攻击、自身攻击等
          console.log("点击空 ");
          fire();
        });

        _Global.YJ3D.YJRaycaster.addEventListener('onmouseup', () => {
          inLongPress = false;
          _Global.YJ3D.YJController.GetPlayerFireCtrl().SetPlayerState("normal");

        });
        _Global.YJ3D.YJRaycaster.addEventListener('onmousedown', () => {
          inLongPress = true;
        });
        setInterval(() => {
          if (inLongPress) {
            fire();
          } 
        }, 500);

        //
        let npcs = _Global._YJNPCManager.GetNPCs();
        for (let i = 0; i < npcs.length; i++) {
          const npc = npcs[i].transform.GetComponent("NPC");
          npc.addEventListener("死亡", () => {
            killCount++;
            checkKillCount();
            console.log("已杀",killCount);
          }); 
          npc.SetNpcTarget(_Global.YJ3D.YJPlayer);
        }

      }
    };
    function checkKillCount(){
      if(killCount>=1){
        // pauseGame();
      }
    }
    function pauseGame(){
      _Global.YJ3D.pauseRender = true; 
    }
    function playGame(){
      _Global.YJ3D.pauseRender = false; 
    }

    this.addEventListener();
  }
}
export { YJController_roguelike };