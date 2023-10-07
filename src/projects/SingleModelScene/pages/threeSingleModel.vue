<template>
  <div id="contain" class="left-0 top-0 w-full md:bg-gray-700 " :style="'height: ' + height + 'px' + ';'"
    ref="container"></div>
</template>


 
<script >
import * as THREE from "three";

import { YJRaycaster } from "/@/threeJS/js/raycaster.js";
//模型外轮廓高亮
import { YJOutlinePass } from "/@/threeJS/js/YJOutlinePass.js";

import { YJSceneModelCtrl } from "/@/threeJS/js/YJSceneModelCtrl.js";

import { YJController } from "/@/threeJS/js/YJController.js";
import { YJDragModel } from "/@/threeJS/js/YJDragModel.js";


var texArray = [];
var texTextArray = [];
var needLoadCount = 0;
//热点数字
var hotPointsArray = [];
var HotPointData = function (modelName, name, pos) {
  this.modelName = modelName;
  this.name = name;
  this.pos = pos;
  this.currentPos = pos;
}

Object.defineProperties(HotPointData.prototype, {
  Pos: {
    get: function () {
      return this.pos;
    },
    set: function (value) {
      this.pos = value;
    }
  }

});
export default {
  data() {
    return {
      content: "点击点击模型点击模型模型",
      selected: false,
    };
  },
  mounted() {
    // this.content = "点击点击模型点击模型模型";
    // this.selected =false;

    this.height = 100;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.rotationSpeed = 0.02;

    this.pointsParent = null;
    this.noHitParent = null;

    this.hotPointsParent = null;
    this.dracoLoader = null;

    this.YJRaycaster = null;
    this.YJSceneModelCtrl = null;
    this.YJOutlinePass = null;
    this.YJDragModel = null;

    this.YJController = null;
    this.clock = null;
    this.firstPersonControls = null;

    this.logtext = "";

    this.pointTexture = null;

    //连续点击隐藏开关
    this.multiHidden = false;

    //默认视角朝向
    this.defaultRotaY = 4.71;


    var that = this;
    window.addEventListener("resize", function (e) {
      // console.log("改变窗口大小");
      that.onWindowResize();
      if (that.camera == null) {
        return;
      }
      // 重新设置相机宽高比例
      that.camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      that.camera.updateProjectionMatrix();
      // 重新设置渲染器渲染范围
      that.renderer.setSize(window.innerWidth, window.innerHeight);
    });


  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.initMesh();
      this.YJSceneModelCtrl = new YJSceneModelCtrl(this);

      var that = this;
      this.YJRaycaster = new YJRaycaster(
        this,
        this.scene,
        this.camera,
        this.renderer.domElement,
        (hitObject, hitPoint) => {
          this.YJOutlinePass.setClickObject(hitObject);
          this.YJSceneModelCtrl.setSelectObj(hitObject);
          this.YJDragModel.SetDragModel(hitObject);

          if (hitObject == null) {
            this.$parent.ClickModel(null);

            return;
          }
          console.log(
            "点击模型 " +
            hitObject.tag +
            " " +
            hitObject.name +
            " 点击坐标 " +
            hitPoint.x +
            " " +
            hitPoint.y +
            " " +
            hitPoint.z +
            " "
          );
          this.logtext = hitObject.name;

          if (hitObject.name == "floor" || hitObject.name == "Plane001") {
            this.YJController.MoveToTarget(hitPoint);
          }

          if (hitObject.tag == "hotPoint") {
            this.selected = true;
            this.content = hitObject.name;
          }
          this.$parent.ClickModel(hitObject.name);
          if (this.multiHidden) {
            this.ChangeTool("隐藏选择");
          }
        },
        (log) => {
          // that.logtext = log;
          this.logtext = log;
          // console.log(" 测试 " + this.logtext );
          // console.log(" 2 " + log);
        },
        (hoverObject) => {
          if (hoverObject == null) {
            this.selected = false;

            return;
          }
          if (hoverObject.tag == "hotPoint") {
            // this.content = hoverObject.name;
          }
          // console.log(" hoverObject = ", hoverObject);
        },
        (hotPointObject) => {
          this.$parent.clickPoint(hotPointObject.name);
          // console.log(  " 点击热点 " + hotPointObject.name + " ", hotPointObject.position  );
        }
      );
    },
    // 浏览器窗口变动触发的方法
    onWindowResize() {
      console.log("改变窗口大小");
      if (this.camera == null) {
        return;
      }
      // 重新设置相机宽高比例
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      this.camera.updateProjectionMatrix();
      // 重新设置渲染器渲染范围
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    getCanvasImg() {
      // console.log(" get threeJS canvas ");
      let canvas = this.renderer.domElement;
      this.renderer.render(this.scene, this.camera);
      return canvas.toDataURL("image/jpeg");
    },
    //------------------初始化 three 场景容器
    initMesh() {
      this.scene = new THREE.Scene(); // 场景
      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.03,
        10000
      );

      this.height = window.innerHeight;
      // 相机.视场，长宽比，近面，远面
      // this.camera.position.x = -20;
      // this.camera.position.y = 130;
      // this.camera.position.z = 0;
      // this.camera.position.x = -2;
      // this.camera.position.y = 1.5;
      // this.camera.position.z = 0;
      // this.camera.lookAt(this.scene.position);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMapEnabled = true; // 开启阴影
      this.renderer.setPixelRatio(2); //推荐2

      //添加组
      this.pointsParent = new THREE.Group();
      this.pointsParent.name = "pointsParent";
      this.scene.add(this.pointsParent);

      this.noHitParent = new THREE.Group();
      this.noHitParent.name = "noHitParent";
      this.scene.add(this.noHitParent);

      //环境光
      var ambient = new THREE.AmbientLight(0xffffff); //添加环境光
      // var ambient = new THREE.AmbientLight(0xdddddd); //添加环境光
      this.scene.add(ambient); //光源添加到场景中

      var light = new THREE.DirectionalLight(0xffffff); //光源颜色
      // var light = new THREE.DirectionalLight(0x666666); //光源颜色
      // var light = new THREE.DirectionalLight(0x333333); //光源颜色
      this.camera.add(light); //光源添加到场景中

      // let spotLight = new THREE.SpotLight(0xffffff);
      // spotLight.position.set(-40, 60, -10);
      // spotLight.castShadow = true;
      // this.scene.add(spotLight);

      this.$refs.container.append(this.renderer.domElement);

      // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.target.set(this.camera.position.x+0.01,this.camera.position.y,this.camera.position.z);
      //高亮模型外轮廓
      this.YJOutlinePass = new YJOutlinePass(
        this.renderer,
        this.scene,
        this.camera,
        this.renderer.domElement
      );

      //   this.controls = new FlyControls(this.camera, this.renderer.domElement);
      this.YJController = new YJController(
        this.scene,
        this.camera,
        this.renderer.domElement
      );
      this.YJController.wheelMin = -40;
      this.YJController.wheelMax = -0.1;

      //
      this.YJDragModel = new YJDragModel(
        this,
        this.scene,
        this.camera,
        this.renderer,
        this.renderer.domElement
      );

      // 初始化 draco加载器
      this.InitDracoLoader();

      //初始化摄像机位置  摄像机目标位置旋转
      this.InitCamPos();
      //创建测试平面模型
      // this.CreateTestPlane();

      //实时刷新
      this.renderScene();
    },

    //设置初始朝向
    SetDefaultRotaY(type) {
      if (type == "数字人") {
        // 数字人 4.71
        this.defaultRotaY = 4.71;
      } else {
        //标本 4.71-3.14
        this.defaultRotaY = 4.71 - 3.14;
        this.defaultRotaY += Math.PI;
        this.defaultRotaY *= -1;
      }
      this.InitCamPos();
    },
    //初始化摄像机位置  摄像机目标位置旋转
    InitCamPos() {
      let camPos = new THREE.Vector3(-2, 0, 0);
      let targetPos = new THREE.Vector3(0, 0, 0);
      this.YJController.SetTarget(targetPos, camPos.x);
      //标本默认视角朝向
      // let targetRota = new THREE.Vector3(0, 4.71-3.14, 0.0);

      //数字人默认视角朝向
      // let targetRota = new THREE.Vector3(0, 4.71, 0.0);

      let targetRota = new THREE.Vector3(0, this.defaultRotaY, 0);
      // let targetRota = new THREE.Vector3(3.10,this.defaultRotaY, 3.140);

      this.YJController.SetTargetRota(targetRota);

    },
    //插值移动到目标位置
    SetTargetPosRotaCamZ(pos, rota, camZ) {
      // console.log("pos ",pos); 
      let targetPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      // console.log("targetPos ",targetPos);

      this.YJController.SetLerpToTarget(targetPos, rota, camZ);
    },

    //设置模型是否可点击
    SetNoOrCanHit(object, canHit) {
      if (canHit) {
        this.pointsParent.add(object);
      } else {
        this.noHitParent.add(object);
      }
    },
    //-------------模型控制
    //从3d网页中传入的模型隐藏显示状态，更新到菜单上
    UpdateMenu(content) {
      // console.log("设置菜单状态 222 " + content);
      this.$parent.UpdateMenu(content);
    },
    GetModelState() {
      return this.YJSceneModelCtrl.GetModelState();
    },
    ChangeTool(e) {
      if (e == "隐藏选择") {
        this.YJSceneModelCtrl.HideFn(1);
        this.YJOutlinePass.setClickObject(null);
        this.$parent.ClickModel(null);

        return;
      }
      if (e == "隐藏未选择") {
        this.YJSceneModelCtrl.HideFn(2);
        return;
      }
      if (e == "全部取消隐藏") {
        this.YJSceneModelCtrl.HideFn(3);
        return;
      }

      if (e == "透明选择") {
        this.YJSceneModelCtrl.TransparentFn(1);
        return;
      }
      if (e == "透明未选择") {
        this.YJSceneModelCtrl.TransparentFn(2);
        return;
      }
      if (e == "全部取消透明") {
        this.YJSceneModelCtrl.TransparentFn(3);
        return;
      }

      if (e == "撤销") {
        this.YJSceneModelCtrl.Prev();
        return;
      }
      if (e == "全部还原") {
        this.YJSceneModelCtrl.ResetAll();
        //高亮模型取消
        this.YJOutlinePass.setClickObject(null);
        //拖拽模型取消
        this.$parent.ClickModel(null);

        // //摄像机位置还原
        this.InitCamPos();

        var that = this;
        setTimeout(() => {
          that.YJRaycaster.DoubleClick_none();
        }, 200);
        return;
      }

      // if (e == "全部还原") {
      //   this.YJSceneModelCtrl.ResetAll();
      //   return;
      // }
      // this.$refs.iframe.contentWindow.postMessage(e, "*");
    },
    //连续点击隐藏的功能开关
    ChangeMultiHidden(visible) {
      this.multiHidden = visible;
    },
    //点击树形菜单上的开关，控制对应模型的显示与隐藏
    ChangeByTree(children, visible) {
      var child = children.split("|");
      let i = 0;
      for (i = 0; i < child.length; i++) {
        this.YJSceneModelCtrl.HideByModelNameFn(child[i], visible);
      }
    },
    //点击菜单，选择三维模型
    SelectModel(e) {
      for (var i = 0; i < this.pointsParent.children.length; i++) {
        if (this.pointsParent.children[i].name == e) {
          var hitObject = this.pointsParent.children[i];
          this.YJSceneModelCtrl.setSelectObj(hitObject);
          this.YJOutlinePass.setClickObject(hitObject);
          this.$parent.ClickModel(e);
          return;
        }
      }
      return;
    },
    CreateTestPlane() {
      // 坐标轴
      let axes = new THREE.AxisHelper(20); // 坐标轴
      this.scene.add(axes); // 场景添加坐标轴

      let planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10); // 生成平面
      let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // 材质
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;
      plane.receiveShadow = true;
      plane.name = "floor";
      // this.scene.add(plane); // 向该场景中添加物体
      this.pointsParent.add(plane);

      let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = 0;
      cube.position.y = 0;
      cube.position.z = 0;
      cube.castShadow = true;
      cube.name = "测试 box";
      // this.scene.add(this.cube);
      this.pointsParent.add(cube);
    },

    MovePlayer(x, y) {
      // this.controls
      // this.firstPersonControls.moveByAxis(x,y);
    },
    //--------------加载 标本热点 开始
    //添加热点组
    InitHotPointParent() {
      //添加热点组
      this.hotPointsParent = new THREE.Group();
      this.hotPointsParent.name = "hotPointsParent";
      this.scene.add(this.hotPointsParent);
      this.hotPointsParent.position.set(0, 0, 0);
      //热点世界坐标转屏幕坐标
      this.updateRotaHotPoint();
    },
    //点击热点，视角插值移动到热点设置的位置和角度
    SelectHotPointFromParent(name, camZ) {
      let select = this.hotPointsParent.getObjectByName(name);

      // console.log(select.name, select.rotation);
      // console.log(select.name,camZ);
      // let pos= select.position;
      let pos = this.GetModelWorldPosition(select);

      let targetRotaV3 = new THREE.Vector3(select.rotation.x, select.rotation.y, select.rotation.z);

      this.YJController.SetLerpToTarget(pos, targetRotaV3, camZ);

    },

    //创建热点
    CreateHotPoint(modelName, name, pos, rota) {
      let size = 0.01;
      //六个面显示不同贴图，方便测试
      // var vertices = new Float32Array([
      //     0, 0.33, 0.5, 0.33, 0, 0, 0.5, 0, //  图片的左下
      //     0.5, 0.33, 1, 0.33, 0.5, 0, 1, 0, // 图片右下
      //     0, 0.66, 0.5, 0.66, 0, 0.33, 0.5, 0.33, // 图片中左
      //     0.5, 0.66, 1, 0.66, 0.5, 0.33, 1, 0.33, // 图片中右
      //     0, 1, 0.5, 1, 0, 0.66, 0.5, 0.66, //图片左上
      //     0.5, 1, 1, 1, 0.5, 0.66, 1, 0.66 // 图片右上
      // ]);

      // var box = new THREE.BoxBufferGeometry(size*2, size, size);
      // box.setAttribute('uv', new THREE.Float32BufferAttribute(vertices, 2));
      // var map = new THREE.TextureLoader().load('boxmap.jpg');
      // var boxMaterial = new THREE.MeshBasicMaterial({ 
      //   color: 0xff0000,
      //   opacity: 0,
      //   transparent: true,
      //   map: map 
      // });
      // var cube = new THREE.Mesh(box, boxMaterial);

      let cubeGeometry = new THREE.BoxGeometry(size, size, size);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        opacity: 0,
        transparent: true,
      });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);


      cube.name = name;
      cube.castShadow = true;

      cube.position.x = -pos.x;
      cube.position.y = pos.y;
      cube.position.z = pos.z;

      // let rotaV3 = this.RotaV3ToRota(rota); 
      // // console.log(cube.name,this.posToString(cube.rotation) );
      // console.log(cube.name,this.posToString(rotaV3) );

      // let pai = Math.PI;
      // if(rotaV3.x == pai){
      //   rotaV3.x = 0;
      //   rotaV3.y = pai - rotaV3.y;
      //   if(rotaV3.z == Math.PI ){
      //     rotaV3.z = 0;
      //   }
      // }
      // if(rotaV3.x == -pai){
      //   rotaV3.x = 0;
      //   rotaV3.y = pai - rotaV3.y;
      //   if(rotaV3.z ==pai ){
      //     rotaV3.z = 0;
      //   }
      // }


      // if(rotaV3.x<0){
      //   rotaV3.x += pai;
      //   rotaV3.y = pai - rotaV3.y;
      //   if(rotaV3.z ==Math.PI ){
      //     rotaV3.z = 0;
      //   }
      // }else if(rotaV3.x>0){


      //   rotaV3.x -= pai;
      //   if(rotaV3.y-pai){
      //     rotaV3.y = rotaV3.y    ;

      //   }else{
      //     rotaV3.y = rotaV3.y+ pai/2   ;
      //   } 
      //     // rotaV3.z = rotaV3.z -3.14;
      // }
      //   if(Math.abs(rotaV3.z)  ==Math.PI ){
      //     rotaV3.z = 0;
      //   }

      // let rotaV3 = this.RotaV3ToRota(rota); 
      let rotaV3 = rota;
      // console.log(cube.name,rotaV3);
      // 
      let pai = Math.PI;

      rotaV3.y += pai;
      rotaV3.y *= -1;
      // if(rotaV3.x == 0){

      // }else{
      // }

      // console.log(cube.name,this.posToString(rota) );
      cube.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);
      // cube.rotation.set(rota.x, rota.y, rota.z);
      // cube.rotation.copy(rotaV3);

      // console.log(cube.name + " pos 11 ",this.posToString(cube.position)); 

      this.hotPointsParent.add(cube);
      //添加热点拖拽同步数据。 记录所属模型名、热点名、热点原始坐标、热点拖拽后当前坐标
      var hotPointData = new HotPointData(modelName, cube.name, new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z));
      hotPointsArray.push(hotPointData);

    },


    posToString(v) {
      return v.x + "  " + v.y + "  " + v.z;
    },
    //右手坐标系转左手坐标系。unity坐标系转threeJS坐标系
    RotaV3ToRota(v3) {
      //右手坐标系转左手坐标系。unity坐标系转threeJS坐标系
      let pq = new THREE.Quaternion(v3.x * -1, v3.y * 1, v3.z * 1, v3.w * -1);
      let pv = new THREE.Euler();
      pv.setFromQuaternion(pq);
      pv.y += Math.PI; // Y is 180 degrees off
      pv.z *= -1; // flip Z
      // pv.x = 0;
      // pv.z = 0; 

      // pv.y -= Math.PI/2 ; // 再旋转90度，保持与unity中Z轴朝向相同

      // console.log("角度转换后的角度为 " ,pv);
      return pv;
    },

    //--------------加载 标本热点 结束

    //--------------加载模型 和贴图相关
    // 初始化 draco加载器
    InitDracoLoader() {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath(this.$publicUrl + "js/draco/");
      // this.dracoLoader.setDecoderPath( "/js/draco/");
      this.dracoLoader.setDecoderConfig({ type: "js" });
      // this.dracoLoader.setCrossOrign('Anonymous');
      this.dracoLoader.preload();
    },

    //人体解剖模块
    LoadHuman(path, data) {
      this.LoadDRC(path, data, 0.01);
      // this.LoadDRC(
      //   this.$localUrl + "models/human",
      //   "data/10000.txt",
      //   0.01
      // );
      // var res = await this.$axios.get(this.$localUrl + "models/data/10000.txt").then((res)=>{ });
    },
    async LoadDRC(path, text, scale) {
      var that = this;
      var res = await this.$axios.get(path + "/" + text);
      var data = res.data;

      // console.log(data);
      data.forEach(function (item, index) {
        let array = Object.values(item);
        let i = 0;
        let count = array.length;
        for (i = 0; i < count; i++) {
          let value = array[i];

          that.loadDrc(
            path,
            value["cnName"],
            value["dTex"],
            that.ColorArrayToColor(value["dColor"]),
            that.ColorArrayToOpacity(value["dColor"]),
            value["nTex"],
            value["aoTex"],
            scale
          );
        }
      });
      //
      // this.$axios.get("https://hyjkg.oss-cn-beijing.aliyuncs.com/models/human/data/10000.txt").then((res)=>{
      //     console.log(res);
      //         //     loadDrc( path, value["cnName"],value["dTex"], ColorArrayToColor( value["dColor"])
      //         // , ColorArrayToOpacity(value["dColor"]),value["nTex"],value["aoTex"]) ;
      // });
    },
    LoadBiaoben(path, data) {
      this.LoadDRCBiaoben(path, data, 0.01);
    },
    //标本模块的模型位置和旋转 由文本中指定
    async LoadDRCBiaoben(path, text, scale) {
      var that = this;
      var res = await this.$axios.get(path + "/" + text);
      var data = res.data;
      // console.log(path + "/" + text);
      // console.log(data);

      data.forEach(function (item, index) {
        let array = Object.values(item);
        let i = 0;
        let count = array.length;
        for (i = 0; i < count; i++) {
          let value = array[i];

          that.loadDrc(
            path,
            value["cnName"],
            value["dTex"],
            that.ColorArrayToColor(value["dColor"]),
            that.ColorArrayToOpacity(value["dColor"]),
            value["nTex"],
            value["aoTex"],
            scale,
            value["pos"],
            value["rota"]
          );
        }
      });
      //
      // this.$axios.get("https://hyjkg.oss-cn-beijing.aliyuncs.com/models/human/data/10000.txt").then((res)=>{
      //     console.log(res);
      //         //     loadDrc( path, value["cnName"],value["dTex"], ColorArrayToColor( value["dColor"])
      //         // , ColorArrayToOpacity(value["dColor"]),value["nTex"],value["aoTex"]) ;
      // });
    },
    loadDrc(path, text, tex, _color, _opacity, normal, ao, scale, pos, rota) {
      needLoadCount++;
      //path 路径
      //text 模型名
      //tex 贴图名
      //color 材质球漫反射颜色
      //normal 材质球 法线贴图
      //ao 材质球 AO贴图
      var manager = new THREE.LoadingManager();
      manager.onProgress = function (item, loaded, total) {
        //console.log( item, loaded, total );
      };
      var onProgress = function (xhr) { };
      var onError = function (xhr) {
        //console.error( xhr );
      };

      if (tex != "") {
        if (texTextArray.indexOf(tex) > -1) {
          texture = texArray[texTextArray.indexOf(tex)];
          // console.log(" 数组中包含 " + tex);
        } else {
          var texture = new THREE.Texture();
          var loaderTex = new THREE.ImageLoader(manager);
          // loaderTex.setCrossOrign('Anonymous');

          loaderTex.load(path + "/Tex/" + tex + ".jpg", function (image) {
            texture.image = image;
            texture.needsUpdate = true;
            // console.log(" 加载图片成功 " + path + "/Tex/" + tex + ".jpg");
          });

          texArray.push(texture);
          texTextArray.push(tex);
        }
      }

      var texture_normal = new THREE.Texture();
      var loaderTex_normal = new THREE.ImageLoader(manager);

      // normal = "";
      if (normal != "") {
        if (texTextArray.indexOf(normal) > -1) {
          texture_normal = texArray[texTextArray.indexOf(normal)];
          //console.log(" 数组中包含 " + normal);
        } else {
          loaderTex_normal.load(
            path + "/Tex/" + normal + ".jpg",
            function (image) {
              texture_normal.image = image;
              texture_normal.needsUpdate = true;
            }
          );

          texArray.push(texture_normal);
          texTextArray.push(normal);
        }
      }

      var texture_ao = new THREE.Texture();
      var loaderTex_ao = new THREE.ImageLoader(manager);

      // if (ao == "") {
      //   ao = "white";
      // }
      if (ao != "") {
        if (texTextArray.indexOf(ao) > -1) {
          texture_ao = texArray[texTextArray.indexOf(ao)];
          //console.log(" 数组中包含 " + ao);
        } else {
          loaderTex_ao.load(path + "/Tex/" + ao + ".jpg", function (image) {
            texture_ao.image = image;
            texture_ao.needsUpdate = true;
          });

          texArray.push(texture_ao);
          texTextArray.push(ao);
        }
      }


      var that = this;
      //*
      this.dracoLoader.load(
        path + "/drc/" + text + ".drc",
        function (object) {
          object.computeVertexNormals();

          var material = new THREE.MeshStandardMaterial({
            //vertexColors: THREE.VertexColors,
            metalness: 0.1, //金属
            roughness: 0.9, //高光
            // color:0xffffff, //颜色
            color: _color, //颜色
            transparent: _opacity < 1,
            opacity: _opacity,
            // opacity:1,
            depthTest: true,
          });

          if (tex != "") {
            // if(texture.image !=null){
            //   material.map = texture;
            // }
            material.map = texture;

          }

          if (normal != "") {
            if (texture_normal.image != null) {
              material.normalMap = texture_normal;
            }
          }

          if (ao != "") {

            if (texture_ao.image != null) {
              material.lightMap = texture_ao;
            }
          }

          var mesh = new THREE.Mesh(object, material);
          mesh.name = text;
          mesh.scale.set(scale, scale, scale);

          //mesh.castShadow = true;
          //mesh.receiveShadow = true;

          that.AddToSceneAndCheckLoadComplete(mesh);
        },
        onProgress,
        onError
      );
    },
    //把加载的模型添加到场景中
    AddToSceneAndCheckLoadComplete(object) {
      // console.log(" 正在添加 " +object.name +"  到场景");
      this.pointsParent.add(object);
      // object.position.set(0.035, -0.002, -0.025);

      if (this.pointsParent.children.length == needLoadCount) {
        //子物体数量 与应加载数量相等，则表示全部加载完成
        this.YJSceneModelCtrl.InitSceneModelData(this.pointsParent);

        //向父页面传递模型全部加载完成的消息
        // this.$parent.loadDrcCompleted();


        var that = this;
        setTimeout(() => {
          that.YJRaycaster.DoubleClick_none();
        }, 200);
        //needLoadCount = 0;
      }
    },
    ColorArrayToOpacity(array) {
      return array[3] / 255.0;
    },
    ColorArrayToColor(array) {
      // var color = ("rgb("+array[0]+","+array[1]+"," + array[2]+")").colorHex();
      var color = this.colorRGBtoHex(
        "rgb(" + array[0] + "," + array[1] + "," + array[2] + ")"
      );
      //console.log(color);
      return color;
    },
    colorRGBtoHex(color) {
      var rgb = color.split(",");
      var r = parseInt(rgb[0].split("(")[1]);
      var g = parseInt(rgb[1]);
      var b = parseInt(rgb[2].split(")")[0]);
      var hex =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      return hex;
    },

    //------------------------实时update
    //实时刷新
    renderScene() {
      //   let {controls, cube, scene, camera, renderer} = this
      //   cube.rotation.x += controls.rotationSpeed
      //   cube.rotation.y += controls.rotationSpeed
      //   cube.rotation.z += controls.rotationSpeed
      // const delta = this.clock.getDelta(); //获取自上次调用的时间差
      // this.firstPersonControls.update(delta); //更新第一人称控件

      this.YJController.update();

      this.renderer.render(this.scene, this.camera);
      this.YJOutlinePass.animate_outline();
      requestAnimationFrame(this.renderScene);
    },

    //热点世界坐标转屏幕坐标。实时刷新热点2dui位置
    updateRotaHotPoint() {
      //热点实时面向摄像机
      for (var i = 0; i < this.hotPointsParent.children.length; i++) {
        let cnName = this.hotPointsParent.children[i].name;
        let pos = this.getScreenPosition(this.GetModelWorldPosition(this.hotPointsParent.children[i]));
        this.$parent.updateRotaHotPoint(cnName, pos);
      }

      if (this.pointsParent.children.length > 0) {
        // console.log( this.hotPointsParent.children.length);
        for (var i = 0; i < this.hotPointsParent.children.length; i++) {
          // console.log(hotPointsArray[i]);
          if (hotPointsArray[i].modelName != null && hotPointsArray[i].modelName != "" && hotPointsArray[i].modelName != undefined) {
            for (let j = 0; j < this.pointsParent.children.length; j++) {
              if (hotPointsArray[i].modelName == this.pointsParent.children[j].name) {
                let refPos = this.pointsParent.children[j].position;
                let hotPos = hotPointsArray[i].Pos;
                hotPointsArray[i].currentPos = new THREE.Vector3(refPos.x + hotPos.x, refPos.y + hotPos.y, refPos.z + hotPos.z);
                this.hotPointsParent.children[i].position.copy(hotPointsArray[i].currentPos);
                // let newPos = hotPointsArray[i].currentPos;
                // console.log("new pos = ",newPos);
                // this.hotPointsParent.children[i].position.copy(newPos);
              }
            }
          }
        }
      }

      // for (var i = 0; i < hotPointsArray.length; i++) {
      //   let cnName = hotPointsArray[i].name;
      //   let pos = this.getScreenPosition(this.GetModelWorldPosition(hotPointsArray[i]));
      //   this.$parent.updateRotaHotPoint(cnName,pos);
      // }

      requestAnimationFrame(this.updateRotaHotPoint);
    },
    //世界坐标转屏幕坐标。 世界坐标要从模型包裹盒中获取
    getScreenPosition(world_vector) {
      // let projector = new THREE.Projector();  
      let vector = world_vector.project(this.camera);
      let halfWidth = window.innerWidth / 2;
      let halfHeight = window.innerHeight / 2;

      return {
        x: Math.round(vector.x * halfWidth + halfWidth),
        y: Math.round(-vector.y * halfHeight + halfHeight)
      };
    },
    //通过模型的包裹盒计算模型的世界坐标
    GetModelWorldPosition(object) {
      var centroid = new THREE.Vector3();
      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          //获取模型的世界坐标
          var geometry = object.geometry;
          geometry.computeBoundingBox();
          centroid.addVectors(geometry.boundingBox.min, geometry.boundingBox.max);
          centroid.multiplyScalar(0.5);
          centroid.applyMatrix4(item.matrixWorld);
          //console.log(" ===== 双击模型 的位置    "  + posToString(centroid) + "  "   );
        }
      });
      return centroid;
    }
  },
};
</script>