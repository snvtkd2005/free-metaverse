

import * as THREE from "three";
import { YJTween } from "./YJTween";


// 模型基类： transform 组件

/**
 模型信息：
 占用地面大小、
 坐标、旋转、缩放、模型路径、id、
 基础几何体的data
 modelType=
 */

class YJTransform {
  constructor(_this, scene, id, pos, rota, name, callback) {
    let scope = this;
    this.transform = scope;
    this.isYJTransform = true;
    this.isYJNPC = false;
    this.modelData = null;
    this.id = -1; 
    let data = {
      id: id, //资源生成唯一id，用过加载记录
      modelId:"", //模型id，可通过此id查找模型
      name: name, // 物体名
      active:true,//是否显示
      volume: { x: 1, y: 1, z: 1 }, //占用空间体积
      pos: { x: 0, y: 0, z: 0 }, //坐标
      rotaV3: { x: 0, y: 0, z: 0 }, //旋转
      scale: { x: 1, y: 1, z: 1 }, //缩放
      modelPath: "", //模型加载路径
      modelType: "", // 模型类型：静态模型、动画模型、热点、特效
      folderBase: "", // 文件夹名，通过此属性加载资源
      mapId: "", //地图id
      message: null, //物体携带的信息，用于区分不同物理
      uuid: "",//在场景中的唯一标识
      children : [], //子transform的folderBase
      parent:"", //父transform的id
      siblingIndex:0, //相对父物体的排序
    }
    let children = [];
    this.AddChildren = function (transform) {
      children.push(transform);
    }
    this.GetChildren = function(){
      return children;
    }
    
    this.SetParentDirect = function(p){
      p.attach(group); 
      this.DragEnd();
    }
    this.SetParent = function(p){
      p.add(group);
      this.ResetPosRota();
    }
    this.SetData = function (modelData, id, mapId) {
      data.folderBase = modelData.folderBase;
      data.modelType = modelData.modelType;
      data.children = modelData.children??[];
      data.parent = modelData.parent??"";
      data.id = id;
      data.modelId = modelData.modelId;
      data.mapId = mapId;
      data.components = modelData.components??[];
      if (mapId == undefined) {
        data.mapId = "npcLevel1";
      }
      if (modelData.active == undefined) {
        data.active = true;
      }else{
        data.active = modelData.active;
      } 

      this.id = id;
      group.name = data.modelType + name;
      // console.log(" group.name =  ",group.name ,data.active);

      // setTimeout(() => {
      //   for (let i = 0; i < data.components.length; i++) {
      //     this.UpdateComponents(i,data.components[i]);
      //   }
      // }, 1000);
 
    }
    let de2reg = 57.29578;
    this.GetTransform = function () {
      return {
        modelId:data.modelId,
        active:data.active,
        position: [data.pos.x, data.pos.y, data.pos.z],
        rotation: [data.rotaV3.x * de2reg, data.rotaV3.y * de2reg, data.rotaV3.z * de2reg],
        scale: [data.scale.x, data.scale.y, data.scale.z]
      };
    }
    this.GetData = function () {
      // console.error( data.modelId,"" ,data);
      return data;
    }
    
    this.GetModelScale = function(){
        return data.scale.x;
    }
    this.GetMessage = function () {
      return data.message;
    }
    this.SetMessage = function (message) {
      data.message = message;

      // 静态模型message为空
      if(message == null){ 
        this.UpdateAllComponents(); 
        this.SetActive(data.active);
        return;
      }
      if (message.pointType == "npc") {
        data.name = message.data.name;

        let com = this.GetComponent("NPC");
        com.SetMessage(message.data);
        this.GetComponent("MeshRenderer").SetSize(message.data.avatarData.modelScale);
        this.GetComponent("MeshRenderer").SetRotaArray(message.data.avatarData.rotation);
        this.GetComponent("MeshRenderer").SetPosArray(message.data.avatarData.offsetPos);
        this.isYJNPC = true;
      }
      
      if (message.pointType == "modelAnim") {
        data.name = message.data.name;
        let com = this.GetComponent("Animator");
        message.data.pointType = message.pointType;
        com.SetMessage(message.data);
        // com.SetMessage(message.data);
        this.GetComponent("MeshRenderer").SetSize(message.data.localOffset.modelScale);
        this.GetComponent("MeshRenderer").SetRotaArray(message.data.localOffset.rotation);
        this.GetComponent("MeshRenderer").SetPosArray(message.data.localOffset.offsetPos);
      }
      if (message.pointType == "player" || message.pointType == "avatar") {
        let com = this.GetComponent("Avatar");
        if(com){
          com.SetMessage(message.data);
          this.GetComponent("MeshRenderer").SetSize(message.data.modelScale);
          this.GetComponent("MeshRenderer").SetRotaArray(message.data.rotation);
          this.GetComponent("MeshRenderer").SetPosArray(message.data.offsetPos);
        }
      }
      if (message.pointType == "UV动画") {
        let com = this.GetComponent("UVAnim");
        com.SetMessage(message.data);
      }
      if (message.pointType == "shader") {
        let com = this.GetComponent("Shader");
        com.SetMessage(message.data);
      }
      if (message.pointType == "screen") {
        let com = this.GetComponent("Screen");
        com.SetMessage(message.data);
      }
      if (message.pointType == "weapon") {
        let com = this.GetComponent("Weapon");
        if(com){
          com.SetMessage(message.data);
        }
      }
      if (message.pointType == "interactive") {
        let com = this.GetComponent("Interactive");
        com.SetMessage(message.data,data.active);
      }
      if (message.pointType == "particle") {
        let com = this.GetComponent("Particle");
        com.SetMessage(message.data);
      }
      if (message.pointType == "trail") {
        let com = this.GetComponent("Trail");
        com.SetMessage(message.data);
      }
      if (message.pointType == "geometry") {
        let com = this.GetComponent("Geometry");
        com.SetMessage(message.data);
      }
 
      this.UpdateAllComponents(); 
      
      this.SetActive(data.active);

    //   setTimeout(() => {
    //   this.SetActive(data.active);
    // }, 200);
    }
    let handlerList = [];
    this.AddHandle = function (handler) {
      handlerList.push(handler);
    }
    this.RemoveHandle = function () {
      handlerList = [];
    }
    let transformChangeHandler = null;
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
    this.SetModelId = function(modelId){
      data.modelId = modelId;
    }
    this.AddComponents = function(msg){
      if(data.components == undefined){
        data.components = [];
      }
      data.components.push(msg);
    } 
    this.UpdateComponents = function(index,msg){
        data.components[index] = (msg);
      if(msg.type == "tween"){
        let tween = new YJTween(group);
        tween.SetMessage(msg.data);
      }
    }
    this.UpdateComponentsData = function(index,msg){
      data.components[index] = (msg); 
    }
    this.UpdateAllComponents = function(){
      for (let i = 0; i < data.components.length; i++) {
        this.UpdateComponents(i,data.components[i]);
      } 
    }

    this.SetDisplay = function(b){
      group.visible = b;
      let message = data.message;
      if(message == null){ 
        return;
      }
      if (message.pointType == "interactive") {
        let com = this.GetComponent("Interactive");
        com.DestroyTrigger();
      }
      if (message.pointType == "geometry") {
        let com = this.GetComponent("Geometry");
        com.DestroyTrigger();
      }
      if (this.GetComponent("Trail")) {
        this.GetComponent("Trail").start();
      }
    }
    this.GetActive  = function(){
      return data.active;
    }
    this.DirectStopComponent = function(){
      let message = data.message;
      if(message == null){ 
        return;
      }
      if (message.pointType == "interactive") {
        let com = this.GetComponent("Interactive");
        com.DestroyTrigger();
      }
      if (message.pointType == "geometry") {
        let com = this.GetComponent("Geometry");
        com.DestroyTrigger();
      }
      if (this.GetComponent("Trail")) {
        this.GetComponent("Trail").stop();
      }
    }
    let doonce = 0;
    this.SetActive = function (b) {
      // console.error( " in SetActive ",b);
      if(group.visible == b && doonce > 0){
        return;
      }
      doonce++;
      group.visible = b;
      data.active = b;

      if (b) {
        _this._YJSceneManager.AddNeedUpdateJS(scope);
        this.CreateCollider();
      } else {
        _this._YJSceneManager.RemoveNeedUpdateJS(scope);
        this.DestroyCollider();
      }

      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          child.SetActive(b);
        } 
      }

      // let modelData = JSON.parse(JSON.stringify(scope.modelData));
      // scope.SetPosRota(modelData.pos, modelData.rotaV3, modelData.scale);
 


      let message = data.message;
      if(message == null){ 
        return;
      }
      if (b) {
        if (message.pointType == "interactive") {
          let com = this.GetComponent("Interactive");
          com.Reset();
        }
        if (message.pointType == "geometry") {
          let com = this.GetComponent("Geometry");
          com.Reset();
        }
        if (this.GetComponent("Trail")) {
          this.GetComponent("Trail").start();
        }
      } else {
        if (message.pointType == "interactive") {
          let com = this.GetComponent("Interactive");
          com.DestroyTrigger();
        }
        if (message.pointType == "geometry") {
          let com = this.GetComponent("Geometry");
          com.Destroy();
        }
        if (this.GetComponent("Trail")) {
          this.GetComponent("Trail").stop();
        }
        this.DestroyCollider(); 

      }

      // if (message.pointType == "NPC模型") {
      //   let com = this.GetComponent("NPC");
      //   com.SetActive(b);
      // }

      // let _Animator = this.GetComponent("Animator");
      // if (_Animator != null) {
      //   if (b) {
      //     _Animator.ResetPlay();
      //   } else {
      //     _Animator.Stop();
      //   }
      // }
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
      if (group == null) { return; }
      this.SetPosRota(pos, rota);
      this.DestroyCollider();
      CreateColliderFn();
    }



    this.ResetPosRota = function () {
      let pos = data.pos;
      let rota = data.rotaV3;
      let size = data.scale;
      group.position.set(pos.x, pos.y, pos.z); // 
      group.rotation.set(rota.x, rota.y, rota.z); // 
      group.scale.set(size.x, size.y, size.z);

    }
    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota, size) {
      group.position.set(pos.x, pos.y, pos.z); // 
      if (rota == undefined) {
        rota = { x: 0, y: 0, z: 0 };
      }
      if (size == undefined) {
        size = { x: 1, y: 1, z: 1 };
      }
      group.scale.set(size.x, size.y, size.z);
      group.rotation.set(rota.x, rota.y, rota.z); // 
      data.pos = pos;
      data.rotaV3 = rota;
      data.scale = group.scale;
    }
    this.SetPos = function (pos, rotaV3) {
      // console.log(" 接收npc坐标", pos, rotaV3);
      group.position.set(pos.x, pos.y, pos.z); //  
      data.pos = { x: pos.x, y: pos.y, z: pos.z };
      if (rotaV3) {
        this.SetRota(rotaV3);
      }
    }
    
    this.SetPosArray = function (e) {
      this.SetPos({ x: e[0], y: e[1], z: e[2] }); 
    }
    this.SetRota = function (rotaV3) {
      group.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z); //  
      data.rotaV3 = { x: rotaV3.x, y: rotaV3.y, z: rotaV3.z };
    }
    this.SetRotaArray = function (e) {
      this.SetRota({ x: e[0] / de2reg, y: e[1] / de2reg, z: e[2] / de2reg });
    }
    this.SetScale = function (size) {
      group.scale.set(size.x, size.y, size.z);
      data.scale = { x: size.x, y: size.y, z: size.z };
    }
    this.GetScale = function(){
      return data.scale.x; 
    }
    this.AddScale = function (size) {
      data.scale.x += size.x;
      data.scale.y += size.y;
      data.scale.z += size.z;
      group.scale.set(data.scale.x,data.scale.y, data.scale.z );
    }
    this.SetScaleArray = function (e) { 
      this.SetScale({ x: e[0], y: e[1], z: e[2] });
    }
    let oldTransData = {
      pos: { x: 0, y: 0, z: 0 },
      rotaV3: { x: 0, y: 0, z: 0 },
      actionScale:1,
    }
    this.UpdateDataByType = function(type,value){
      if(type=="actionScale"){
        oldTransData.actionScale = value;
      }
    }
    // 有新玩家加入时，清空旧数据，让transform同步
    this.ClearOldTransData = function () {
      oldTransData = {
        pos: { x: 0, y: 0, z: 0 },
        rotaV3: { x: 0, y: 0, z: 0 },
        actionScale:1,
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
        oldTransData.pos.z == pos.z &&
        oldTransData.rotaV3.y == rotaV3.y
        ) {
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
    this.GetPlayerWorldPos = function () {
      let com = this.GetComponent("NPC");
      return com.GetPlayerWorldPos();
    }
    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(group.position, group.rotation);
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

      // console.log(" 编辑结束 ",data.rotaV3);
      if (transformChangeHandler) {
        transformChangeHandler(this.GetTransform());
      }
    }
    this.AddListener = function (e, callback) {
      if (!e || !callback) { console.error("添加事件格式为 事件名,回调函数"); return; }
      if (e == "变换") {
        transformChangeHandler = callback;
      }
    }
    this.RemoveListener = function (e) {
      if (!e) { console.error("添加事件格式为 事件名"); return; }
      if (e == "变换") {
        transformChangeHandler = null;
      }
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
        if (element.type == "Geometry") {
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
      if (_model.modelType == "武器模型") {
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