

import * as THREE from "three";


// 模型基类： transform 组件

/**
 模型信息：
 占用地面大小、
 坐标、旋转、缩放、模型路径、id、
 */
class YJTransform {
  constructor(_this, scene, id, pos, rota, name, callback) {
    let scope = this;
    this.isYJTransform = true;
    this.modelData = null;
    this.id = -1;
    var model = null;
    let data = {
      id: id, //资源id
      name: name, // 资源名字
      volume: { x: 1, y: 1, z: 1 }, //占用空间体积
      pos: { x: 0, y: 0, z: 0 }, //坐标
      rotaV3: { x: 0, y: 0, z: 0 }, //旋转
      scale: { x: 1, y: 1, z: 1 }, //缩放
      modelPath: "", //模型加载路径
      modelType: "", // 模型类型：静态模型、动画模型、热点、特效
      folderBase: "", // 文件夹名
      mapId: "", //地图id
      message: null, //模型热点信息
      uuid: "",//在场景中的唯一标识
    }
    this.SetData = function (folderBase, modelType, id,mapId) {
      data.folderBase = folderBase;
      data.modelType = modelType;
      data.id = id;
      data.mapId = mapId;
      if(mapId == undefined){
        data.mapId = "npcLevel1";
      }
      this.id = id;
    }

    this.GetData = function () {
      return data;
    }
    this.GetMessage = function () {
      return data.message;
    }
    this.SetMessage = function (message) {
      data.message = message;

      if (message.pointType == "npc") {
        let com = this.GetComponent("NPC");
        com.SetMessage(message.data);
        this.GetComponent("MeshRenderer").SetSize(message.data.avatarData.modelScale);
      }
      if (message.pointType == "player" || message.pointType == "avatar") {
        let com = this.GetComponent("Avatar");
        com.SetMessage(message.data);
        this.GetComponent("MeshRenderer").SetSize(message.data.modelScale);
      }
      if (message.pointType == "UV动画") {
        let com = this.GetComponent("UVAnim");
        com.SetMessage(message.data);
      }
      if (message.pointType == "screen") {
        let com = this.GetComponent("Screen");
        com.SetMessage(message.data);
      }
      if (message.pointType == "weapon") {
        let com = this.GetComponent("Weapon");
        com.SetMessage(message.data);
      }
      if (message.pointType == "interactive") {
        let com = this.GetComponent("Interactive");
        com.SetMessage(message.data);
      }
      if (message.pointType == "particle") {
        let com = this.GetComponent("Particle");
        com.SetMessage(message.data);
      }
    }
    let handlerList = [];
    this.AddHandle = function (handler) {
      handlerList.push(handler);
    }
    this.RemoveHandle = function () {
      handlerList = [];
    }
    // 数据有更新时的回调
    this.UpdateData = function () {
      // console.log(data.name + " 数据更新", data.message.data);
      for (let i = 0; i < handlerList.length; i++) {
        const element = handlerList[i];
        element(data.message.data);
      }

      if (data.message.pointType == "npc") {
        // 死亡时清空回调
        if (data.message.data.baseData.health == 0) {
          handlerList = [];
        }
      }
    }
    this.SetActive = function (b) {
      group.visible = b;

      if (b) {
        _this._YJSceneManager.AddNeedUpdateJS(scope);
      } else {
        _this._YJSceneManager.RemoveNeedUpdateJS(scope);
      }
      let modelData = JSON.parse(JSON.stringify(scope.modelData));
      scope.SetPosRota(modelData.pos, modelData.rotaV3, modelData.scale);


      let message = data.message;

      if (b) {
        if (message.pointType == "interactive") {
          let com = this.GetComponent("Interactive");
          com.Reset();
        }
      } else {
        if (message.pointType == "interactive") {
          let com = this.GetComponent("Interactive");
          com.DestroyTrigger();
        }
      }
      // let _Animator = this.GetComponent("Animator");
      // if (_Animator != null) {
      //   if (b) {
      //     _Animator.ResetPlay();
      //   } else {
      //     _Animator.Stop();
      //   }
      // }
    }

    this.GetModel = function () {
      return model;
    }
    this.GetGroup = function () {
      return group;
    }
    this.components = [];
    let components = [];
    this.AddComponent = function (type, js) {
      js.transform = scope;
      components.push({ type: type, js: js });

      this.components = components;
    }
    this.GetComponent = function (type) {
      for (let i = 0; i < components.length; i++) {
        const element = components[i];
        if (element.type == type) {
          return element.js;
        }
      }
      return null;
    }
    this.RemoveComponent = function (type) {
      for (let i = 0; i < components.length; i++) {
        const element = components[i];
        if (element.type == type) {
          element.js.Destroy();
          element.js = undefined;
          components.splice(i, 1);
          return;
        }
      }
    }


    let group = null;
    this.GetUUID = function () { 
      return group.uuid;
    }
    function Init() { 
      group = new THREE.Group(); 
      scene.add(group);
      group.owner = scope;
      data.uuid = group.uuid;
      // scene.add(new THREE.AxesHelper(100));
      // group.add(new THREE.AxesHelper(100));
    }




    // 坐标、旋转 也算在同步状态中
    this.SetState = function (modelData) {
      console.log("改变模型状态");
      let _pos = modelData.pos;
      let _rotaV3 = modelData.rotaV3;
      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);
      this.ResetSetPosRota(pos, rotaV3);
    }

    this.ResetSetPosRota = function (pos, rota) {
      if (model == null) { return; }
      this.SetPosRota(pos, rota);
      this.DestroyCollider();
      CreateColliderFn();
    }



    this.ResetPosRota = function () {
      let pos = data.pos;
      let rota = data.rotaV3;
      group.position.set(pos.x, pos.y, pos.z); // 
      group.rotation.set(rota.x, rota.y, rota.z); // 


    }
    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota, size) {
      group.position.set(pos.x, pos.y, pos.z); // 
      if (rota == undefined) {
        rota = { x: 0, y: 0, z: 0 };
      }
      group.rotation.set(rota.x, rota.y, rota.z); // 
      if (size == undefined) {
        size = { x: 1, y: 1, z: 1 };
      }
      group.scale.set(size.x, size.y, size.z);
      data.pos = pos;
      data.rotaV3 = rota;
    }
    this.SetPos = function (pos, rotaV3) {
      // console.log(" 接收npc坐标", pos, rotaV3);
      group.position.set(pos.x, pos.y, pos.z); //  
      group.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z); //  
      data.pos = { x: pos.x, y: pos.y, z: pos.z };
      data.rotaV3 = { x: rotaV3.x, y: rotaV3.y, z: rotaV3.z };
    }

    let oldTransData = {
      pos: { x: 0, y: 0, z: 0 },
      rotaV3: { x: 0, y: 0, z: 0 },
    }
    // 有新玩家加入时，清空旧数据，让transform同步
    this.ClearOldTransData = function () {
      oldTransData = {
        pos: { x: 0, y: 0, z: 0 },
        rotaV3: { x: 0, y: 0, z: 0 },
      }
    }
    this.CheckSamePos = function () {
      let rotaV3 = { x: 0, y: 0, z: 0 };
      rotaV3.x = group.rotation.x;
      rotaV3.y = group.rotation.y;
      rotaV3.z = group.rotation.z;
      let pos = group.position.clone();
      if (oldTransData.pos.x == pos.x &&
        oldTransData.pos.y == pos.y &&
        oldTransData.pos.z == pos.z) {
        return null;
      }
      oldTransData.pos = pos;
      oldTransData.rotaV3 = rotaV3;
      return oldTransData;
    }
    this.SetSize = function (size) {
      group.scale.set(size.x, size.y, size.z);
      data.scale = { x: size.x, y: size.y, z: size.z };
    }
    this.SetModelPath = function (modelPath) {
      data.modelPath = modelPath;
    }

    this.GetWorldPos = function () {
      let pos = getWorldPosition(group).clone();
      return pos;
    }
    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(model.position, model.rotation);
    }

    // 拖拽开始
    this.DragStart = function () {
      if (this.GetComponent("NPC")) {
        this.GetComponent("NPC").UpdateNavPos('停止巡逻');
      }
    }
    // 拖拽结束
    this.DragEnd = function () {
      let pos = group.position;
      data.pos = { x: pos.x, y: pos.y, z: pos.z };
      data.rotaV3.x = group.rotation.x;
      data.rotaV3.y = group.rotation.y;
      data.rotaV3.z = group.rotation.z;
      data.scale.x = group.scale.x;
      data.scale.y = group.scale.y;
      data.scale.z = group.scale.z;
    }
    // 编辑完成，更新数据、生成碰撞体
    this.EditorEnd = function () {
      this.DragEnd();
      CreateColliderFn();
    }
    this.EditorStart = function () {
      this.DestroyCollider();
    }
    //删除模型
    this.Destroy = function () {
      _this._YJSceneManager.RemoveNeedUpdateJS(scope);
      for (let i = 0; i < components.length; i++) {
        const element = components[i];
        if (element.js.Destroy) {
          element.js.Destroy();
        }
      }
      this.DestroyCollider();
      _this._YJSceneManager.clearGroup(group);
      scene.remove(group);
    }


    //创建碰撞体
    function CreateColliderFn(colliderVisible) {

      for (let i = 0; i < components.length; i++) {
        const element = components[i];
        if (element.type == "MeshRenderer") {
          element.js.CreateCollider(colliderVisible);
        }
        if (element.type == "Trigger") {
          element.js.Reset();
        }
      }
    }
    this.CreateCollider = function (colliderVisible) {
      CreateColliderFn(colliderVisible);
    }
    this.DestroyCollider = function () {
      for (let i = 0; i < components.length; i++) {
        const element = components[i];
        if (element.type == "MeshRenderer") {
          element.js.DestroyCollider();
        }
      }
    }

    this.Start = function () {
      for (let i = 0; i < components.length; i++) {
        const element = components[i];
        if (element.js.Start) {
          element.js.Start();
        }
      }
    }

    // 寻路网格完成后执行
    this.PathfindingCompleted = function () {
      for (let i = 0; i < components.length; i++) {
        const element = components[i];
        if (element.js.PathfindingCompleted) {
          element.js.PathfindingCompleted();
        }
      }
    }

    this._update = function () {
      for (let i = 0; i < components.length; i++) {
        const element = components[i];
        if (element.js._update) {
          element.js._update();
        }
      }
    }

    //同步
    this.Dync = function (_model) {
      let state = _model.state;
      if (_model.modelType == "装备模型") {
        if (state.display == undefined) {
          return;
        }
        if (!state.display) {
          group.visible = false;
          if (this.GetComponent("Weapon") != null) {
            this.GetComponent("Weapon").DestroyTrigger();
          }
        } else {
          group.position.copy(state.pos);
          group.scale.set(1, 1, 1);
          group.rotation.set(0, 0, 0);
          group.visible = true;
          if (this.GetComponent("Weapon") != null) {
            this.GetComponent("Weapon").Reset();
          }
        }
      }
      // -----------
      if (_model.modelType == "NPC模型") {
        if (this.GetComponent("NPC") != null) {
          this.GetComponent("NPC").Dync(state);
        }
      }
      if (_model.modelType == "交互模型") {
        if (this.GetComponent("Interactive") != null) {
          this.GetComponent("Interactive").Dync(state);
        }
      }

    }
    Init();

  }
}

export { YJTransform };