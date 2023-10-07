import * as THREE from "three";

import { YJAnimModel } from "./YJAnimModel";
import { YJLoadModel } from "./YJLoadModel";

import TWEEN from '@tweenjs/tween.js';
import { Vector3 } from "three";
import { YJVideo } from "./YJVideo";

// 热点模型  通过id来判断弹出的内容
// 1，模型直接可点击
// 2，进入有效区域才可交互  
// 3，进入有效区域 显示
// 4，进入有效区域 自转
// 5，
//trigger 检测区域。进入区域内、离开区域后执行事件 
// trigger 从模型中提取
// hit 点击区域、从模型中提取
// 玩家进入区域，logo 自动旋转

class YJHotPoint {
  constructor(_this, scene, id, modelName, modelPath, pos, rota, size, callback) {
    var scope = this;

    let group = null;

    // 获取模型准备移动
    this.GetModel = function () {
      this.DestroyCollider();
      return group;
    }

    // 作为3转2,世界坐标转屏幕坐标的热点被调用
    this.GetPointWorldPos = function () {
      if (pointObj) {
        return pointObj.getWorldPosition(new THREE.Vector3());
      }
      return (new THREE.Vector3(-500, -500, -500));
    }

    // 作为设置相机观察位的热点被调用
    this.GetCamPosAndRota = function () {

      let p = pointObj.parent;
      scene.attach(pointObj);
      let rota = pointObj.getWorldQuaternion(new THREE.Quaternion());
      let pos = pointObj.getWorldPosition(new THREE.Vector3());
      p.attach(pointObj);
      return {
        pos: pos,
        rota: rota,
        rotaV3: pointObj.rotation,
        // rotaV3: hotPointData.rotaV3,
      }

    }

    this.GetId = function () {
      return hotPointId;
    }
    this.GetType = function () {
      if (hotPointData) {
        return hotPointData.pointType;
      }
      return null;
    }

    // 设置hitobj显示或隐藏,让其不可显示和不可被点击
    this.SetHitObjDisplay = function (b) {
      // console.log("设置 hit 显示或隐藏 111 ");
      if (hotPointData.pointType.indexOf("直接显示a点击a使用id") > -1) {
        if (hitArea) {

          // console.log("设置 hit 显示或隐藏 222 " , b?"显示":"隐藏");

          if (b) {
            _this._YJSceneManager.AddCanHitModel(hitArea);
          } else {
            _this._YJSceneManager.RemoveCanHitModel(hitArea);
          }
        }
      }
    }
    this.SetVideoLoop = function (b) {
      if (_YJVideo != null) {
        _YJVideo.SetVideoLoop(b);
        return;
      }
    }
    // 设置热点隐藏，让其不可显示和不可被点击
    this.SetPointObjDisplay = function (b) {
      // console.log("设置热点隐藏/显示" , hotPointData.pointType,this.GetId(),b);

      if (_YJVideo != null) {
        _YJVideo.SetPointObjDisplay(b);
        return;
      }

      if (hotPointData.pointType.indexOf("代码控制显示a使用id") > -1) {
        // console.log("代码控制热点显示" , hotPointData);
        group.visible = b;
        return;
      }

      if (hotPointData.pointType.indexOf("代码控制显示a点击a使用id") > -1 || hotPointData.pointType.indexOf("点击a使用id") > -1) {
        // console.log("代码控制热点显示" , hotPointData);

        if (hitArea) {
          if (b) {
            // hitArea.visible = b ;
            group.visible = b;
            _this._YJSceneManager.AddCanHitModel(hitArea);

          } else {
            group.visible = b;
            // hitArea.visible = b;
            _this._YJSceneManager.RemoveCanHitModel(hitArea);
          }
        }
        return;
      }
      if (hotPointData.pointType.indexOf("代码控制显示a热点lookat相机a使用id") > -1) {
        if (pointObj) {
          if (b) {
            pointObj.visible = b;
            group.visible = b;
            _this._YJSceneManager.AddCanHitModel(pointObj);


          } else {
            group.visible = b;
            pointObj.visible = b;
            _this._YJSceneManager.RemoveCanHitModel(pointObj);
          }
        }
        return;
      }
      if (hotPointData.pointType.indexOf("热点") > -1) {
        if (pointObj) {
          if (b) {
            pointObj.visible = b && inArea;

            if (inArea) {
              _this._YJSceneManager.AddCanHitModel(pointObj);
            }

          } else {
            pointObj.visible = b;
            _this._YJSceneManager.RemoveCanHitModel(pointObj);
          }
        }
      }

    }

    this.SetAllTextHotPoint = function (b) {
      if (b) {

        if (pointObj) {
          if ((pointObj.children[0].name.indexOf("Quad") > -1)) {
            pointObj.children[0].visible = true;
          }
          if ((pointObj.children[1].name.indexOf("Quad") > -1)) {
            pointObj.children[1].visible = true;
          }
        }
        _this._YJSceneManager.AddCanHitModel(hitArea);

      } else {
        //隐藏
        if (pointObj) {
          if ((pointObj.children[0].name.indexOf("Quad") > -1)) {
            pointObj.children[0].visible = false;
          }
          if ((pointObj.children[1].name.indexOf("Quad") > -1)) {
            pointObj.children[1].visible = false;
          }
        }

        _this._YJSceneManager.RemoveCanHitModel(hitArea);
        _this._YJSceneManager.RemoveLookatHotPoint(hitArea);
        console.log(" 移除文字text icon 上的点击区域 ");
      }


    }
    this.SetHotPointCtrl = function (msg) {

      if (hotPointData.pointType == "代码控制显示a点击a使用id") {
        if (msg == "显示点击") {
          hitArea.visible = true;
          _this._YJSceneManager.AddCanHitModel(hitArea);
        }
        if (msg == "隐藏点击") {
          hitArea.visible = false;
          _this._YJSceneManager.RemoveCanHitModel(hitArea);

        }
      }

      if (hotPointData.pointType == "代码控制显示a点击a使用ida显示point") {
        if (msg == "显示点击") {
          group.visible = true;
          // hitArea.visible = true;
          if (pointObj) {
            pointObj.visible = true;
            _this._YJSceneManager.AddLookatHotPoint(pointObj);
            console.log(" 显示3d文字 ", pointObj);


            if (!(pointObj.children[0].name.indexOf("Quad") > -1)) {
              pointObj.children[0].layers.enable(1);
            }
            if (!(pointObj.children[1].name.indexOf("Quad") > -1)) {
              pointObj.children[1].layers.enable(1);
            }



          }
          _this._YJSceneManager.AddCanHitModel(hitArea);

          _this._YJSceneManager.AddLookatHotPoint(hitArea);
          //point下的物体加入自发光
        }
        if (msg == "隐藏点击") {
          group.visible = false;
          // hitArea.visible = false;
          if (pointObj) {
            pointObj.visible = false;
            _this._YJSceneManager.RemoveLookatHotPoint(pointObj);
          }
          _this._YJSceneManager.RemoveCanHitModel(hitArea);
          _this._YJSceneManager.RemoveLookatHotPoint(hitArea);
        }
      }
      console.log(msg + " " + modelName);
    }

    let triggerObj = null;
    let colliderObj = null;
    //设置trigger模型显示与隐藏
    this.SetTriggerVisible = function (e) {
      console.log(" 监听 shift +T ");
      group.visible = e;
      if (triggerObj) {
        triggerObj.visible = e;
        if (e) {
          let mat = new THREE.MeshBasicMaterial({
            transparent: true,
            color: 0x0000ff,
            opacity: 0.5,
          });
          triggerObj.material = mat;
        }
      }
      if (pointObj) {
        pointObj.visible = e;

        if (hotPointData.pointType.indexOf("热点lookat相机") > -1) {
          if (e) {
            let map = pointObj.material.map;
            let mat = new THREE.MeshBasicMaterial({
              transparent: true,
              color: 0xff0000,
              opacity: 0.5,
              map: map,
            });
            pointObj.material = mat;
          }
        } else {
          if (e) {

            let mat = new THREE.MeshBasicMaterial({
              transparent: true,
              color: 0xff0000,
              opacity: 0.5,
            });
            pointObj.material = mat;
          }
        }
      }

      if (colliderObj) {
        colliderObj.visible = e;
        if (e) {

          let mat = new THREE.MeshBasicMaterial({
            transparent: true,
            color: 0x00ff00,
            opacity: 0.5,
          });
          colliderObj.material = mat;
        }
      }
      if (hitArea) {
        hitArea.visible = e;
        if (e) {

          let mat = new THREE.MeshBasicMaterial({
            transparent: true,
            color: 0xffff00,
            opacity: 0.5,
          });
          hitArea.material = mat;
        }
      }
      //trigger 蓝色
      //point 红色
      //collider 绿色
      //hit  黄色

    }
    // 监听视角改变，鸟瞰或人视，由YJController调用
    this.SetViewState = function (e) {
      // if(e=="人视"){}
      // if(e=="鸟瞰"){

      // }
      if (hotPointData.pointType == "鸟瞰时才显示a点击a设置角色位置") {
        if (e == "鸟瞰") {
          _this._YJSceneManager.AddCanHitModel(hitArea);
        } else {
          _this._YJSceneManager.RemoveCanHitModel(hitArea);
        }
      }
    }
    this.GetHotPointData = function () {
      if (!hotPointData) { return null; }
      // if (pointObj.parent == null) { return null; }
      let modelData = {};
      if (hotPointData.pointType.indexOf('设置角色位置') > -1) {
        modelData.type = '设置角色位置';
        modelData.pos = pointObj.getWorldPosition(new THREE.Vector3());
        let p = pointObj.parent;

        scene.attach(pointObj);
        let rota = pointObj.getWorldQuaternion(new THREE.Quaternion()).clone();
        modelData.rota = rota;
        modelData.rotaV3 = hotPointData.rotaV3;
        p.attach(pointObj);
      }
      return modelData;
    }

    function Init() {
      group = new THREE.Group();
      scene.add(group);
      group.position.set(pos.x, pos.y, pos.z);
      group.rotation.set(rota.x, rota.y, rota.z);

      pos = new THREE.Vector3(0, 0, 0);
      let rotaV3 = new THREE.Vector3(0, 0, 0);
      // let size = new THREE.Vector3(1, 1, 1);
      // console.log(" modelpath = " + modelPath);


      let _YJLoadModel = new YJLoadModel(_this, group, id, modelPath, pos, rotaV3, size, modelName,
        true, () => {
          setTimeout(() => {
            rotaObj = _YJLoadModel.GetModel();
            rotaObj.traverse(function (item) {
              setTimeout(() => {
                updateState();
              }, 1000);
              if (item instanceof THREE.Mesh) {

                if (item.name.indexOf("trigger") > -1) {

                  let cSize = new THREE.Vector3(0, 0, 0);
                  cSize.x = item.scale.x * size.x;
                  cSize.y = item.scale.y * size.y;
                  cSize.z = item.scale.z * size.z;
                  _this._YJSceneManager.CreateTriangeMeshTrigger(item, cSize,
                    id, "triggerArea", scope);
                  item.visible = false;
                  triggerObj = item;
                } else {
                  if (item.name.indexOf("hit") > -1) {
                    hitArea = item;
                    hitArea.visible = false;
                  }
                  if (item.name.indexOf("collider") > -1) {
                    colliderObj = item;
                    colliderObj.visible = false;
                  }


                  if (hotPointData) {

                    if (hotPointData.pointType.indexOf("代码控制显示") > -1) {
                      if (hotPointData.pointType.indexOf("热点lookat相机") > -1) {
                        if (item.name.indexOf("point") > -1) {
                          let pos = hotPointData.pos;
                          item.position.set(pos.x, pos.y, -pos.z);
                          item.visible = false;
                          CreateHotPoint(item, new Vector3(0, 0, 0), item.scale);
                          console.log(" 进入 热点lookat相机 ");
                          return;
                        }
                      }
                      if (item.name.indexOf("point") > -1) {
                        pointObj = item;
                        pointObj.visible = false;
                        return;
                      }

                      if (item.name.indexOf("hit") > -1) {
                        hitArea = item;
                        hitArea.visible = false;
                        hitArea.tag = "hotPoint";
                        let modelData = { id: hotPointData.id, type: hotPointData.pointType };
                        hitArea.modelData = modelData;
                        return;
                      }
                    }

                    if (hotPointData.pointType.indexOf("显示point") > -1) {
                      return;
                    }

                    if (hotPointData.pointType.indexOf("直接显示") > -1) {
                      if (item.name.indexOf("hit") > -1) {
                        hitArea = item;
                        hitArea.visible = false;
                        hitArea.tag = "hotPoint";
                        let modelData = { id: hotPointData.id, type: hotPointData.pointType };
                        hitArea.modelData = modelData;
                        _this._YJSceneManager.AddCanHitModel(hitArea);
                        return;
                      }
                    }

                    if (hotPointData.pointType == "播放视频a使用id") {
                      if (item.name.indexOf("point") > -1) {
                        pointObj = item;
                        CreateVideo();

                        return;
                      }
                    }
                    // console.log(" hotPointData = ", hotPointData);
                    if (hotPointData.pointType == "进入区域才显示热点lookat相机") {
                      if (item.name.indexOf("point") > -1) {
                        let pos = hotPointData.pos;
                        item.position.set(pos.x, pos.y, -pos.z);
                        item.visible = false;
                        CreateHotPoint(item, new Vector3(0, 0, 0), item.scale);

                        return;
                      }
                    }

                    if (hotPointData.pointType == "热点lookat相机") {
                      if (item.name.indexOf("point") > -1) {
                        let pos = hotPointData.pos;
                        item.position.set(pos.x, pos.y, -pos.z);
                        item.visible = false;
                        CreateHotPoint(item, new Vector3(0, 0, 0), item.scale);
                        console.log(" 进入 热点lookat相机 ");
                        return;
                      }
                    }

                    if (hotPointData.pointType == "进入区域才显示") {
                      if (item.name.indexOf("point") > -1) {
                        pointObj = item;
                        pointObj.visible = false;
                        return;
                      }
                    }

                    if (hotPointData.pointType == "进入区域才显示a点击") {
                      if (item.name.indexOf("point") > -1) {
                        pointObj = item;
                        pointObj.visible = false;
                        return;
                      }
                      if (item.name.indexOf("hit") > -1) {
                        hitArea = item;
                        hitArea.visible = false;
                      }
                    }
                    if (hotPointData.pointType == "鸟瞰时才显示a点击a设置角色位置") {
                      if (item.name.indexOf("point") > -1) {
                        pointObj = item;
                        pointObj.visible = false;


                        // 设置角色的朝向为 unity场景的Z轴朝向物体
                        // unity场景的物体 Y轴+180进行反向
                        let rotaV3 = pointObj.rotation.clone();
                        rotaV3.y += Math.PI;
                        pointObj.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);

                        // let axes = new THREE.AxesHelper(5); // 坐标轴
                        // pointObj.add(axes); // 场景添加坐标轴
                        return;
                      }

                      if (item.name.indexOf("hit") > -1) {
                        hitArea = item;
                        hitArea.visible = false;

                        // let modelData = { id: id,type:'设置角色位置',owner:scope };
                        // hitArea.modelData = modelData;
                        // console.log("you hit ");
                      }
                    }

                    if (hotPointData.pointType == "鸟瞰时才显示a投影UIa使用id") {
                      if (item.name.indexOf("point") > -1) {
                        pointObj = item;
                        pointObj.visible = true;
                        // console.log(" 加载 鸟瞰时才显示a投影UIa使用id ");
                        // group.visible = true;
                        return;
                      }
                    }


                    if (hotPointData.pointType == "相机观察位") {
                      if (item.name.indexOf("point") > -1) {
                        pointObj = item;
                        pointObj.visible = false;
                        return;
                      }
                    }

                  }

                  // hotPoint模型是新创建的热点，则跳过
                  if (item.name == "hotPoint") { return; }
                  // console.log("进入此循环的模型是 ",item.name);
                  item.name = modelName;
                  item.tag = "链接logo";
                  item.owner = scope;
                }

              }

            });

          }, 20);
          if (callback) {
            callback();
          }
        });


    }

    function CreatePlane() {

      // let planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1); // 生成平面
      let planeGeometry = new THREE.PlaneBufferGeometry(1.2, 1.2, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        // alphaTest:false,
        transparent: true,
        color: 0xffffff,
      }); // 材质

      let hotPointData = _this.$parent.avatarData.hotPointData;
      let hotpointImgUrl = hotPointData.hotpointImgUrl;
      if (hotpointImgUrl) { } else { hotpointImgUrl = "hotpoint.png" }

      if (_this.$parent.isMobile) {
        if (hotpointImgUrl == "hotpoint2.png") {
          hotpointImgUrl = "hotpoint2Big.png";
        }
      }

      const map = new THREE.TextureLoader().load(
        // _this.GetPublicUrl() + "hotpoint.png"
        _this.GetPublicUrl() + hotpointImgUrl
        // _this.GetPublicUrl() + "new_spotd07_gif.png"
        // _this.GetPublicUrl() + "giftest.gif" //不支持gif
        // _this.GetPublicUrl() + "cokeAnim.webp" //不支持webp
        // "./public/images/new_spotd07_gif.png"
      );

      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

      planeMaterial.map = map;
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      //
      if (hotPointData.lookatZero) {
        plane.lookAt(new THREE.Vector3(0, 0, 0));
      } else {
        _this._YJSceneManager.AddLookatHotPoint(plane);
      }


      if (hotPointData.type && hotPointData.type == "anim") {
        _this._YJSceneManager.AddAnimHotPoint(plane);
        if (hotPointData.imgCount) {
          _this._YJSceneManager.SetHotPointImgCount(hotPointData.imgCount, hotPointData.speed);
        }

      }
      return plane;
    }
    // 创建始终面向摄像机的热点
    function CreateHotPoint(parent, pos, size) {

      let xx = 1.5;
      let planeGeometry = new THREE.PlaneBufferGeometry(xx, xx, xx, 1); // 生成平面
      // let planeGeometry = new THREE.BoxBufferGeometry(2, 2, 2); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        alphaTest: true,
        transparent: true,
        opacity: 0,
        color: 0x00000000,
      }); // 材质

      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      parent.add(plane);

      let pointImg = CreatePlane();
      plane.add(pointImg);
      pointImg.position.set(0, 0, -0.01);

      let hotPointSetting = _this.$parent.avatarData.hotPointData;
      if (hotPointSetting.lookatZero) {
        pointImg.rotation.set(0, 0, hotPointSetting.rotaY);
      } else {
      }

      plane.position.set(pos.x, pos.y, pos.z);
      plane.scale.set(size.x, size.y, size.z);
      plane.tag = "hotPoint";
      plane.name = "hotPoint";

      let id = 10000;
      if (hotPointData) {
        id = hotPointData.id;
      }
      let modelData = { id: id, type: 3 };
      plane.modelData = modelData;
      pointObj = plane;

      if (hotPointData.pointType.indexOf("进入区域才显示") > -1 || hotPointData.pointType.indexOf("鸟瞰时才显示") > -1) {
        plane.visible = false;
      } else {
        _this._YJSceneManager.AddCanHitModel(pointObj);
      }

      _this._YJSceneManager.AddLookatHotPoint(pointObj);

      scene.attach(pointObj);
      // _this.pointsParent.attach(pointObj);


    }



    let _YJVideo = null;
    function CreateVideo() {
      let blue = hotPointData.id.indexOf("blue") > -1;
      let green = hotPointData.id.indexOf("green") > -1;
      let lr = hotPointData.id.indexOf("lr") > -1;
      let type = blue ? "蓝底视频" : green ? "绿底视频" : lr ? "左右视频" : "普通视频";

      _YJVideo = new YJVideo(_this, hotPointData.id, pointObj, type);
    }


    //#region 
    //#endregion


    let rotaObj = null;
    let inArea = false;
    var oldRota = new THREE.Vector3(0, 0, 0);
    var cRota = new THREE.Vector3(0, 0, 0);

    // 鼠标点击区域模型
    let hitArea = null;
    let pointObj = null;

    // 是否有角色进入
    this.SetOverlapPlayer = function (player) {
      inArea = player != null;
      // console.log("进入 区域",type);

      if (type == "旋转放大" || type == "旋转变色") {
        // console.log("进入 旋转放大 区域");
        if (!inArea) {
          if (hitArea != null) {
            _this._YJSceneManager.RemoveCanHitModel(hitArea);
          }
          b_lerp = true;

        } else {
          if (hitArea != null) {
            _this._YJSceneManager.AddCanHitModel(hitArea);
          }
          cRota = group.rotation.clone();
          oldRota = group.getWorldQuaternion(new THREE.Quaternion()).clone();
          update();
        }
      }
      if (type == "变色") {
        if (inArea) {
          if (hitArea != null) {
            _this._YJSceneManager.AddCanHitModel(hitArea);
          }
          // console.log("进入变色");
          rotaObj.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.material.color = new THREE.Color(0xFF8004);
            }
          });

        } else {
          if (hitArea != null) {
            _this._YJSceneManager.RemoveCanHitModel(hitArea);
          }
          // console.log("离开变色");

          rotaObj.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.material.color = new THREE.Color(0x00F1FF);
            }
          });

        }
      }


      if (type == "从id获取") {

        if (inArea) {
          console.log(" 进入 " + hotPointId + " " + type);
        } else {
          console.log(" 退出 " + hotPointId + " " + type);

        }
      }

      if (hotPointData) {
        if (hotPointData.pointType == "进入区域才显示热点lookat相机") {
          pointObj.visible = inArea;

          if (inArea) {
            _this._YJSceneManager.AddCanHitModel(pointObj);
          } else {
            _this._YJSceneManager.RemoveCanHitModel(pointObj);
          }
        }
        if (hotPointData.pointType == "进入区域才显示") {
          pointObj.visible = inArea;
        }

        if (hotPointData.pointType == "进入区域才显示a点击") {
          pointObj.visible = inArea;
          if (inArea) {
            _this._YJSceneManager.AddCanHitModel(hitArea);
          } else {
            _this._YJSceneManager.RemoveCanHitModel(hitArea);
          }
        }
      }
    }

    var movingTween = null;
    let scale = new THREE.Vector3(1, 1, 1);
    let targetScale = new THREE.Vector3(1.3, 1.3, 1.3);
    // 是否被鼠标悬浮
    this.SetMouseHover = function (b) {
      if (type == "旋转放大") {

        b_canRota = !b;
        // console.log("in SetMouseHover " + b);
        if (b) {
          if (movingTween != null) {
            movingTween.stop();
          }
          let currentSize = group.scale.clone();
          movingTween = new TWEEN.Tween(currentSize).to(targetScale, 300).easing(TWEEN.Easing.Linear.None)
          let updateTargetPos = () => {
            group.scale.set(currentSize.x, currentSize.y, currentSize.z);
          }
          movingTween.onUpdate(updateTargetPos);
          movingTween.start() // 启动动画

          movingTween.onComplete(() => {

          });
        } else {
          if (movingTween != null) {
            movingTween.stop();
          }
          let currentSize = group.scale.clone();
          movingTween = new TWEEN.Tween(currentSize).to(scale, 300).easing(TWEEN.Easing.Linear.None)
          let updateTargetPos = () => {
            group.scale.set(currentSize.x, currentSize.y, currentSize.z);
          }
          movingTween.onUpdate(updateTargetPos);
          movingTween.start() // 启动动画

          movingTween.onComplete(() => {

          });
        }
      } else {
        b_canRota = false;
      }
    }


    let b_canRota = true;
    let b_lerp = false;
    var lerpLength = 0;  //平滑过渡值，取值范围 0 - 1
    // 插值旋转到初始角度
    function lerpRota() {
      if (type != "旋转放大") {
        cancelAnimationFrame(updateId);
        return;
      }

      if (b_lerp) {
        lerpLength = 0.02;
        // lerpLength += 0.001;
        // console.log("in triggera area b_lerp ", lerpLength);
        group.quaternion.rotateTowards(oldRota, lerpLength);
        let currentQuat = group.quaternion;
        if (Math.abs(oldRota.z - currentQuat.z) < 0.01
          && Math.abs(oldRota.x - currentQuat.x) < 0.01
          && Math.abs(oldRota.y - currentQuat.y) < 0.01
          && Math.abs(oldRota.w - currentQuat.w) < 0.01
        ) {
          b_lerp = false;
          lerpLength = 0;
          group.rotation.set(cRota.x, cRota.y, cRota.z);
          cancelAnimationFrame(updateId);
        }

      }
    }
    let rotaSpeed = 0.01;
    // 从setting中获取旋转速度
    this.SetData = function (e) {
      rotaSpeed = e;
    }


    let hotPointData = null;
    let hotPointId = "10000";
    let type = "旋转放大";

    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }

      // console.log("msg = " ,msg);
      //新的热点数据含 pointType 字段
      if (msg.indexOf("pointType") > -1) {
        hotPointData = JSON.parse(msg);
        type = hotPointData.pointType;
        hotPointId = hotPointData.id;

        // console.log("hotPointData = " ,hotPointData);

      } else {
        // 不可删除，兼容旧版本
        type = msg; return;
      }

      if (hotPointData.pointType.indexOf("鸟瞰时才显示") > -1) {
        // 把此脚本添加到管理器中，该脚本在视角（鸟瞰、人视）切换成功后，会执行对应事件；
        _this._YJSceneManager.AddViewStateListener(scope);
        group.visible = false;
        if (hotPointData.pointType.indexOf("投影UI") > -1) {
          _this._YJSceneManager.AddProjectionUI(scope);
        }
      }

      if (hotPointData.pointType.indexOf("设置角色位置") > -1) {
        _this._YJSceneManager.AddPlayerPosPointList(scope);
      }

      if (hotPointData.pointType.indexOf("相机观察位") > -1) {
        _this._YJSceneManager.AddCamPosLookatPos(scope);
        group.visible = false;
      }
      if (hotPointData.pointType.indexOf("代码控制显示") > -1) {
        group.visible = false;

      }



      // msg = JSON.parse(msg); 
    }
    function updateState() {
      // if (pointObj) {
      //   pointObj.visible = true;
      //   // let rotaV3 = hotPointData.rotaV3;
      //   // pointObj.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);
      //   let axes = new THREE.AxesHelper(1); // 坐标轴
      //   pointObj.add(axes); // 场景添加坐标轴
      //   group.visible = true;
      //   return;
      // }



      if (hotPointData == null) { return; }
      if (hotPointData.pointType.indexOf("代码控制显示") > -1) {
        group.visible = false;

        if (hotPointData.id.indexOf("text_") > -1) {
          group.visible = true;
          if (pointObj) {
            pointObj.visible = true;


            let ppoint = null;
            let i = 0;
            if ((pointObj.children[0].name.indexOf("Quad") > -1)) {
              pointObj.children[0].visible = false;
              ppoint = pointObj.children[0];
            }
            if ((pointObj.children[1].name.indexOf("Quad") > -1)) {
              pointObj.children[1].visible = false;
              ppoint = pointObj.children[1];
              i = 1;
            }


            let hotpointImgUrl2 = _this.$parent.avatarData.hotPointData.hotpointImgUrl2;
            if (hotpointImgUrl2) {

            } else { hotpointImgUrl2 = "menuicon2325.png" }

            const map = new THREE.TextureLoader().load(
              _this.GetPublicUrl() + hotpointImgUrl2
            );
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
            ppoint.material.map = map;
            let type2 = _this.$parent.avatarData.hotPointData.type2;
            if (type2 && type2 == "anim") {
              _this._YJSceneManager.AddAnimHotPoint2(ppoint);
            }


            pointObj.children[0].layers.enable(0);
            pointObj.children[1].layers.enable(0);
            _this._YJSceneManager.AddLookatHotPoint(pointObj);

          }
        }
      }
    }
    //-------添加删除 开始------------
    //同步服务器上的其他客户端创建的模型的状态
    function _SetState(_state) {
    }

    this.ResetSetPosRota = function (pos, rota) {

    }
    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota) {

    }

    //可由用户创建的模型，放下是创建碰撞体
    this.SetDown = function (pos, rota) {

    }
    function LoadCompleted() {
    }
    //删除模型
    this.Destroy = function () {
    }
    this.DestroyCollider = function () {

    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {

    }


    Init();
    update();
    var updateId = null;
    function update() {
      updateId = requestAnimationFrame(update);
      // console.log(inArea , rotaObj);
      if (inArea && rotaObj != null && b_canRota) {
        // rotaObj.rotation.y += 0.01;
        group.rotation.y += rotaSpeed;
      } else {
        lerpRota();
      }
    }
  }
}


export { YJHotPoint };