import * as THREE from "three";

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

class YJLight {
  constructor(_this, scene, id, pos, rota, size) {
    var scope = this;

    let group = null;
    let light = null;
    function Init() {
      // group = new THREE.Group();
      // scene.add(group);
      // group.position.set(pos.x, pos.y, pos.z);
      // group.add(new THREE.AxesHelper(5)); // 添加坐标轴

      // group.rotation.set(rota.x, rota.y, rota.z);

    }

    // 设置阴影质量 (分辨率)
    this.SetShadowQuality = function (size) {

      if (hasShadow) {
        this.Destroy();

        dataMsg.shadowSize = size;
        CreateByData(dataMsg);
        return;

        light.castShadow = size;
        return;
        size = Math.floor(size);
        console.log(" 获取质量等级 分辨率 ", size);
        // light.castShadow = true;

        light.shadow.mapSize.width = size;
        light.shadow.mapSize.height = size;

        // light.shadow.camera.near = 1;
        // light.shadow.camera.far = 15;
      }
    }

    //#region 
    //#endregion
    let dataMsg = null;
    let hasShadow = false;
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // console.log(msg);
      msg = JSON.parse(msg);

      dataMsg = msg;
      CreateByData(dataMsg);
    }

    function CreateByData(msg){

      let type = msg.type;
      // console.log("msg.type = " + type);
      if (type == "Point") {
        light = new THREE.PointLight(0xffffff, msg.intensity, msg.distance);
        // group.add( light );
        // console.log("创建点光源",light);

        light.color.setHex(msg.color);
        scene.add(light);
        light.position.set(pos.x, pos.y, pos.z);
        light.penumbra = 1;
        light.decay = 1;

        return;
        // light.position.set( 0, 0, 0 );
      }
      if (type == "Spot") {
        // light = new THREE.SpotLight( 0xffffff );
        light = new THREE.SpotLight(0xffffff, msg.intensity, msg.distance);
        // light = new THREE.SpotLight(0xffffff, msg.intensity, msg.distance);
        // light.angle = msg.angle/180;
        light.angle = msg.angle / 180 * Math.PI / 2 * 1;


        light.color.setHex(msg.color);
        // light.decay = 2;
        // light = new THREE.SpotLight(0xffffff, msg.intensity, );
        // group.add( light );
        // console.log("创建 射灯 ", light,msg.angle/180);

        const targetObject = new THREE.Object3D();
        scene.add(targetObject);
        targetObject.position.set(pos.x, pos.y, pos.z);
        targetObject.rotation.set(rota.x, rota.y, rota.z);
        targetObject.translateZ(-0.1);
        // targetObject.add(new THREE.AxesHelper(5)); // 添加坐标轴
        light.target = targetObject;
        // light.add(new THREE.AxesHelper(5)); // 添加坐标轴





        // light.rotation.set(rota.x, rota.y, rota.z);

        scene.add(light);
        // light.position.set(0, 1, 0);
        // light.add(new THREE.AxesHelper(1)); // 添加坐标轴

        light.position.set(pos.x, pos.y, pos.z);

        // const spotLightHelper = new THREE.SpotLightHelper(light);
        // light.add(spotLightHelper); 

        // setTimeout(() => {
        //   spotLightHelper.update();
        // }, 1000);
        // light.rotation.set( 0,0, 0 );
      }
      light.penumbra = 1;
      light.decay = 1;

      // return;
      if (msg.hasShadow) {
        hasShadow = msg.hasShadow;
        light.castShadow = true;

        if (msg.shadowSize != undefined) {
          light.shadow.mapSize.width = msg.shadowSize;
          light.shadow.mapSize.height = msg.shadowSize;
        } else {
          light.shadow.mapSize.width = 1024 * 2;
          light.shadow.mapSize.height = 1024 * 2;
        }


        // light.shadow.camera.near = 10;
        // light.shadow.camera.far = 200;

        // light.shadow.focus = 1;

        light.shadow.camera.near = 1;
        light.shadow.camera.far = 15;
        // light.shadow.camera.fov = 20;
      }

      // light.rotation.set(rota.x, rota.y, rota.z);
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
      if(light){
        scene.remove(light);
        light.dispose();
      }
    }
    Init();
  }
}


export { YJLight };