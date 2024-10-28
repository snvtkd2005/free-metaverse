


import * as THREE from "three"; 
import { YJNameTransMerged } from "./YJNameTransMerged";

// 所有玩家、npc的姓名条、血条、头像统一显示
class YJPlayerNameManager {
  constructor() {

    var scope = this;

    //创建用户头像
    this.CreateHeader = function (namePosTrans, faceUrl) {
      // return;

      if (faceUrl == false || faceUrl == null) {
        return;
      }
      let radius = 0.525;
      let planeGeometry = new THREE.CylinderGeometry(radius, radius, 0.01, 40, 1);
      const texture = new THREE.TextureLoader().load(faceUrl);
      texture.encoding = 3001; //3000  3001
      const material = new THREE.MeshBasicMaterial({ map: texture });
      let headerPlane = new THREE.Mesh(planeGeometry, material);
      headerPlane.rotation.y = Math.PI / 2;
      headerPlane.rotation.x = Math.PI / 2;
      headerPlane.position.set(0, 0.8, 0);
      headerPlane.name = "header";
      namePosTrans.add(headerPlane); // 向该场景中添加物体
      namePosTrans.header = headerPlane

      // if (headerPlane == null) {

      // } else {
      //   headerPlane.material.map = new THREE.TextureLoader().load(video);
      // }
    }

    let healthMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    this.CreateHealth = function (player, namePosTrans, color) {
      // return;

      let w = 1;
      let h = 0.1;
      let planeGeometry = new THREE.PlaneGeometry(w, h, 1, 1); // 生成平面

      // const texture = new THREE.TextureLoader().load( video); 
      // texture.encoding = 3001; //3000  3001
      // const material = new THREE.MeshBasicMaterial({
      //   color: color,
      // });
      const material = healthMat.clone();
      material.color.set(color);

      let healthPlaneAnchor = new THREE.Group();
      let healthPlane = new THREE.Mesh(planeGeometry, material);
      healthPlane.rotation.y = 0;
      healthPlane.position.set(0, 0.2, 0);
      healthPlane.name = "health";
      namePosTrans.add(healthPlane); // 向该场景中添加物体
      namePosTrans.add(healthPlaneAnchor); // 向该场景中添加物体
      healthPlaneAnchor.position.set(-0.5, 0.2, 0);
      healthPlaneAnchor.attach(healthPlane);
      player.healthPlaneAnchor = healthPlaneAnchor;
    }
    this.UpdateHealth = function (health, maxHealth) {
      if (healthPlaneAnchor) {
        healthPlaneAnchor.scale.set(health / maxHealth, 1, 1);
      }
    }
    this.resetLifeByPlayerId = function (id) {
      for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id == id) {
          const player = playerList[i].player;
          if (player.healthPlaneAnchor) {
            player.healthPlaneAnchor.scale.set(1, 1, 1);
            player.namePosTrans.add(player.healthPlaneAnchor); // 向该场景中添加物体
            player.healthPlaneAnchor.position.set(-0.5, 0.2, 0);
          }
          return;
        }
      }
    }

    let playerList = [];
    this.addPlayer = function (id, data) {
      playerList.push({ id, data });

    }

    let debuffList = [];
    let debuffGroup = null;

    this.addDebuffByPlayerId = function (id, buffId, icon) {
      for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id == id) {
          const player = playerList[i].player;
          this.addDebuff(player, player.namePosTrans, buffId, icon);
          return;
        }
      }
    }
    this.addDebuff = function (player, namePosTrans, id, icon) {
      let w = 0.2;
      let h = 0.2;
      let planeGeometry = new THREE.PlaneGeometry(w, h, 1, 1); // 生成平面
      if (player.debuffGroup == null) {
        let debuffGroup = new THREE.Group();
        namePosTrans.add(debuffGroup); // 向该场景中添加物体
        debuffGroup.position.set(-0.61, 0.2, 0);
        player.debuffGroup = debuffGroup;
      }
      if (player.debuffList == undefined) {
        player.debuffList = [];
      }

      const texture = new THREE.TextureLoader().load(icon);
      texture.encoding = 3001; //3000  3001
      const material = new THREE.MeshBasicMaterial({
        transparent: true, map: texture
      });
      let plane = new THREE.Mesh(planeGeometry, material);
      plane.rotation.y = 0;
      plane.position.set(player.debuffList.length * -0.2, 0, 0);
      plane.name = "debuff";
      player.debuffGroup.add(plane); // 向该场景中添加物体

      player.debuffList.push({ id, plane });
      // console.log("添加 debuff ",id,icon);
    }
    this.removeDebuffByPlayerId = function (id, buffId) {
      for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id == id) {
          const player = playerList[i].player;
          this.removeDebuffById(player, buffId);
          return;
        }
      }
    }

    this.removeDebuffById = function (player, id) {
      // console.log("移除 debuff ",id,debuffList);

      if (player.debuffList) {
        for (let i = player.debuffList.length - 1; i >= 0; i--) {
          const item = player.debuffList[i];
          if (item.id == id) {
            player.debuffGroup.remove(item.plane);
            player.debuffList.splice(i, 1);
          }
        }
        for (let i = 0; i < player.debuffList.length; i++) {
          const item = player.debuffList[i];
          item.plane.position.set(i * -0.2, 0, 0);
        }
      }

    }


    this.CreateHealthById = function (id, color) {
      for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id == id) {
          const player = playerList[i].player;
          player.color = color;
          this.CreateHealth(player, player.namePosTrans, color);
          return;
        }
      }
    }
    this.CreateHeaderById = function (id, faceUrl) {
      for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id == id) {
          const player = playerList[i].player;
          player.faceUrl = faceUrl;
          this.CreateHeader(player.namePosTrans, faceUrl);
          return;
        }
      }
    }
    function createText(message, height) {

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let metrics = null;
      const textHeight = 100;
      context.font = 'bold ' + textHeight + 'px Arial';
      metrics = context.measureText(message);
      const textWidth = metrics.width;
      canvas.width = textWidth;
      canvas.height = textHeight;
      context.font = 'bold ' + textHeight + 'px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#ffffff';
      context.fillText(message, textWidth / 2, textHeight / 2);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        // side: THREE.DoubleSide,//双面增加1个drawcall
        map: texture,
        transparent: true,
      });
      const geometry = new THREE.PlaneGeometry(
        (height * textWidth) / textHeight,
        height
      );
      const plane = new THREE.Mesh(geometry, material);
      return plane;

    }

    //#region  字体合并

    //#endregion
    let inMergeName = true;
    let nickNameMerged = [];
    let loadQueue = [];


    let nameTransBase = null;

    function addNewNameMerged(id,pos,scale,nickName,group,player,color,nameScale ){
      // console.log(" 出现新的名字："+ nickName);
        // 每次出现新的名字，为其第一个创建字体网格
        let namePosTrans = new THREE.Group();
        namePosTrans.name = "npcname";
        group.add(namePosTrans);
        namePosTrans.position.set(0, 0, 0); //原点位置
        // namePosTrans.position.set(0, (playerHeight + 0.3), 0); //原点位置

        const resetButton = new THREE.Group();
        const resetButtonText = createText(nickName, 0.06);
        resetButton.add(resetButtonText);
        resetButtonText.position.set(0, 0, 0.0051);
        resetButtonText.scale.set(1, 1, 1);
        resetButtonText.name = "nameBar";
        // resetButtonText.material.color.set(color);

        namePosTrans.add(resetButton);
        resetButton.name = "ignoreRaycast";
        resetButton.position.set(0, 0, 0);
        var size = 4;
        resetButton.scale.set(size, size, size);
        namePosTrans.scale.set(nameScale, nameScale, nameScale);
        player.namePosTrans = namePosTrans; 

        let _YJMeshMerged = new YJNameTransMerged(resetButton);
        nickNameMerged.push({ id, nickName, mergedJS: _YJMeshMerged });

        resetButtonText.visible = false;

        let groupList = [];
        let idList = [];
        let posList = [];
        let scaleList = [];
        let colorList = [];
        
        if (player.active) {
          groupList.push(group);
          idList.push(id);
          posList.push(pos);
          scaleList.push(new THREE.Vector3(scale, scale, scale));
          colorList.push(color);
        }

        for (let i = loadQueue.length - 1; i >= 0; i--) {
          const element = loadQueue[i];
          if (element.nickName == nickName) {
            for (let j = 0; j < element.callback.length; j++) {
              const msg = element.callback[j];
              groupList.push(msg.group);
              idList.push(msg.id);
              posList.push(msg.pos);
              scaleList.push(msg.scale);
              colorList.push(msg.color);
            }
          }
          loadQueue.splice(i, 1);
        }
        _YJMeshMerged.ReMerged(idList, groupList, posList, scaleList,colorList);
        // console.log("nickNameMerged ",nickNameMerged);

    }
    this.RemoveNameTransById = function(id){
      for (let i = playerList.length - 1; i >= 0; i--) {
        if (playerList[i].id == id) {
          let nickName = playerList[i].nickName;
          for (let ii = nickNameMerged.length - 1; ii >= 0; ii--) {
            if (nickNameMerged[ii].nickName == nickName) {
              nickNameMerged[ii].mergedJS.removePoint(id);
              break;
            }
          }
          nameTransBase.remove(playerList[i].group);
          playerList.splice(i, 1);
          return;
        }
      }
    }

    this.CreateNameTrans = function (npc, id, nickName, playerHeight, modelScale, nameScale, color, callback) {
      // return;
      for (let i = 0; i < playerList.length; i++) {
        if(playerList[i].id == id){
          // playerList[i].height = modelScale * (playerHeight + 0.3);
          // console.log(" id 重复 ",id,nickName,playerList[i].nickName);
          return;
        }  
      }
      let player = {};

      let group = new THREE.Group();
      // group.add(new THREE.AxesHelper(10));
      nameTransBase.add(group);
      player.group = group;

      // if (npc.transform) {
      //   group.visible = npc.transform.GetActive();
      //   player.active = npc.transform.GetActive();
      // }
      // if (npc.isPlayer) {
      //   group.visible = true;
      //   player.active = true;
      // }
      
      group.visible = true;
      player.active = true;

      // console.log(nickName + "player.active ",player.active);

      let scale = nameScale * modelScale * 2 * playerHeight;
      let pos = npc.GetWorldPos();
      let height = modelScale * (playerHeight + 0.3);
      pos.y += height;
      group.position.copy(pos);
      let item = { id, nickName, player,height,group };
      playerList.push(item);

      npc.addEventListener("pos", (pos) => {
        pos = npc.GetWorldPos();
        pos.y +=  item.height;
        group.position.set(pos.x, pos.y, pos.z);
      });

      npc.addEventListener("npc尸体消失", () => {
        group.visible = false;
        player.active = false;
        for (let i = 0; i < nickNameMerged.length; i++) {
          const element = nickNameMerged[i];
          if (element.nickName == nickName) {
            element.mergedJS.removePoint(id);
          }
        }
      });

      // 是否已存在同名
      let hasCurrentMerged = false;
      if (inMergeName) {
 
        // npc.addEventListener("重生", () => {
        //   if (npc.transform) {
        //     setTimeout(() => {
        //       for (let i = 0; i < nickNameMerged.length; i++) {
        //         const element = nickNameMerged[i];
        //         if (element.nickName == nickName) {
        //           element.mergedJS.addPoint(id, group, pos, new THREE.Vector3(scale, scale, scale));
        //         }
        //       }
        //     }, 100);
        //     setTimeout(() => {
        //       group.visible = true;
        //       player.active = true;
        //     }, 200);
        //   }
        // });


        for (let i = 0; i < nickNameMerged.length; i++) {
          const element = nickNameMerged[i];
          if (element.nickName == nickName) {
            element.mergedJS.addPoint(id, group, pos,
              new THREE.Vector3(scale, scale, scale),color);

            hasCurrentMerged = true;
          }
        }

        for (let i = 0; i < loadQueue.length; i++) {
          const element = loadQueue[i];
          if (element.nickName == nickName) {
            element.callback.push({
              id: id, group: group, pos: pos,
              scale: new THREE.Vector3(scale, scale, scale),
              color:color
            });
            hasCurrentMerged = true;
          }
        }
        loadQueue.push({ id, nickName, callback: [] });

      } 


      if (inMergeName && player.active && !hasCurrentMerged) {

        addNewNameMerged(id,pos,scale,nickName,group,player,color,nameScale);
      }


      npc.addEventListener("重置昵称", (_nickName,_color) => {
        // console.log(" 重置昵称 ",nickName,_nickName);
        // if (resetButton) {
        //   resetButton.remove(resetButton.children[0]);
        //   const resetButtonText = createText(nickName, 0.06);
        //   resetButton.add(resetButtonText);
        //   resetButtonText.position.set(0, 0, 0.0051);
        //   resetButtonText.scale.set(1, 1, 1);
        //   resetButtonText.name = "nameBar";
        //   resetButtonText.material.color.set(color);
        // }
        color = _color;
        let has = false;
        // 移除旧的姓名条
        for (let i = nickNameMerged.length - 1; i >= 0 && !has; i--) {
          if (nickNameMerged[i].nickName == nickName) {
            has = true;
            nickNameMerged[i].mergedJS.removePoint(id);
          }
        } 

        nickName = _nickName;
        has = false;
        // 判断新的名称是否已存在
        for (let i = nickNameMerged.length - 1; i >= 0 && !has; i--) {
          if (nickNameMerged[i].nickName == nickName) {
            has = true; 
            continue;
          }
        } 

        if(!has){    
          // 不存在，则创建新的姓名条合并js    
          addNewNameMerged(id,pos,scale,nickName,group,player,color,nameScale);
          return;
        }

        for (let i = nickNameMerged.length - 1; i >= 0; i--) {
          if (nickNameMerged[i].nickName == nickName) {
            nickNameMerged[i].mergedJS.addPoint(id, group, pos, new THREE.Vector3(scale, scale, scale),color);
            continue;
          }
        } 

      });
      npc.addEventListener("显示隐藏姓名条", (b) => {
        // if (resetButton) {
        //   resetButton.visible = b;
        // }
        for (let i = nickNameMerged.length - 1; i >= 0; i--) {
          if (nickNameMerged[i].nickName == nickName) {
            if(b){
              nickNameMerged[i].mergedJS.addPoint(id, group, pos, new THREE.Vector3(scale, scale, scale),color);
            }else{
              nickNameMerged[i].mergedJS.removePoint(id);
            }
            continue;
          }
        } 

      });

      npc.addEventListener("创建血条", (color) => {
        // this.CreateHealth(player,namePosTrans, color);
      });
      npc.addEventListener("创建头像", (faceUrl) => {
        // this.CreateHeader(namePosTrans, faceUrl);
      });
      npc.addEventListener("隐藏头像", () => {
        // if (namePosTrans.header) {
        //   namePosTrans.remove(namePosTrans.header);
        //   namePosTrans.header = undefined;
        // }

      });
      npc.addEventListener("移除debuff", (buffId) => {
        this.removeDebuffById(player, buffId);
      });

      npc.addEventListener("添加debuff", (buff) => {
        // this.addDebuff(player, namePosTrans, buff.id, _Global.url.uploadUVAnimUrl + buff.icon);
      });
      npc.addEventListener("Destroy", () => {

        for (let i = nickNameMerged.length - 1; i >= 0; i--) {
          if (nickNameMerged[i].nickName == nickName) {
            nickNameMerged[i].mergedJS.removePoint(id);
            continue;
          }
        }

        for (let i = playerList.length - 1; i >= 0; i--) {
          if (playerList[i].id == id) {
            nameTransBase.remove(group);
            playerList.splice(i, 1);
            return;
          }
        }
      });
      npc.addEventListener("死亡", () => {
        // resetButtonText.material.color.set('#666666'); //姓名条变灰
        for (let i = nickNameMerged.length - 1; i >= 0; i--) {
          if (nickNameMerged[i].nickName == nickName) {
            nickNameMerged[i].mergedJS.removePoint(id);
            continue;
          }
        }

        // if (resetButtonText) {
        //   resetButtonText.visible = false;
        // }
      });
      npc.addEventListener("重生", () => {
        if (npc.transform) {
          setTimeout(() => {
            group.visible = true;
            player.active = true;
          }, 200);
        }
        for (let i = nickNameMerged.length - 1; i >= 0; i--) {
          if (nickNameMerged[i].nickName == nickName) {
            nickNameMerged[i].mergedJS.addPoint(id, group, pos, new THREE.Vector3(scale, scale, scale),color);
            continue;
          }
        }
        // if (resetButtonText) {
        //   resetButtonText.visible = true;
        // }
        // resetButtonText.material.color.set('#ffffff');

        if (player.healthPlaneAnchor) {
          player.healthPlaneAnchor.scale.set(1, 1, 1);
          player.namePosTrans.add(player.healthPlaneAnchor); // 向该场景中添加物体
          player.healthPlaneAnchor.position.set(-0.5, 0.2, 0);
        }
      });

      npc.addEventListener("healthChange", (health, maxHealth) => {
        if (player.healthPlaneAnchor) {
          player.healthPlaneAnchor.scale.set(health / maxHealth, 1, 1);
        }
      });
      // namePosTrans.remove(namePosTrans.children[0]);


    }


    this._update = function () {

      var lookatPos = new THREE.Vector3();
      // var camWorlPos = _Global.camWorlPos;
      var camWorlPos = new THREE.Vector3();
      _Global.YJ3D.camera.getWorldPosition(camWorlPos);

      lookatPos.x = camWorlPos.x;
      lookatPos.z = camWorlPos.z;

      for (let i = 0; i < playerList.length; i++) {
        const player = playerList[i].player;


        var nameWorlPos = new THREE.Vector3();
        player.group.getWorldPosition(nameWorlPos);
        let dis = camWorlPos.distanceTo(nameWorlPos);
        // console.log(player.active,dis);
        if (player.active) {
          if (dis > 55) {
            if (player.group.visible) {
              player.group.visible = false;
            }
          } else {
            if (!player.group.visible) {
              player.group.visible = true;
            }
          }
        }
        // lookatPos.y = nameWorlPos.y ;
        lookatPos.y = Math.max(nameWorlPos.y, camWorlPos.y);
        player.group.lookAt(lookatPos);
      }
      for (let i = 0; i < nickNameMerged.length; i++) {
        const element = nickNameMerged[i].mergedJS;
        element._update();
      }
    }
    function init() {
      if (nameTransBase == null) {
        nameTransBase = new THREE.Group();
        _Global.YJ3D.scene.add(nameTransBase);
        nameTransBase.position.set(0, 0, 0);
      }
      _Global._YJPlayerNameManager = scope;
    }

    init();


  }
}

export { YJPlayerNameManager };