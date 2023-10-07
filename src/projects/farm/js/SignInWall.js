



// 签到墙

import * as THREE from "three";

import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

class SignInWall {
  constructor(_this, modelParent, modelPath, wallPos, rotaV3, callback) {
    let scope = this;


    let selfColor = "#ff0000";
    let otherColor = ['#0E79EC', '#3AEC0E'];


    this.Init = function () {
      InitFn();
    }
    function generateRandomInt(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }
    let randomNames = ["aaaa", "bbb", "ccc", "ddd", "ee", "fff", "ggg", "hhh", "iiii", "jjj", "kkk", "lll", "mmm", "nnn", "ooo", "pppp", "qqq", "rrr", "sss", "ttt", "uuu", "vvv", "www", "xxx", "yy", "zzz", "111", "222", "33", "444", "555", "888", "777", "666"];

    let allPlane = [];
    let allAPlane = [];
    let allBPlane = [];
    let selfPlane = null;

    let group = null;
    // let wallPos = new THREE.Vector3(0, 3, 255);
    // let rotaV3 =  new THREE.Vector3(0, 0, 0);
    function InitFn() {


      // let modelPath = "models/Scene2/id_wall.glb";
      let _YJLoadModel = new YJLoadModel(_this, modelParent);

      _YJLoadModel.load("id_wall", _this.GetPublicUrl() + modelPath, wallPos, rotaV3,
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          console.log(model);
          group = model;
          let carNumId = 0;
          model.traverse((obj) => {
            if (obj.isMesh) {

              if (obj.name.includes("BPlane022")) {
                obj.name = "BPlane021";
              }
              allPlane.push(obj);
              // console.log("签到墙内mesh名称 ", obj.name);
              obj.visible = false;
              obj.frustumCulled = false;  //解决物体在某个角度不显示的问题
            }

          });


        });


      setTimeout(() => {
        for (let i = 0; i < allPlane.length; i++) {
          const element = allPlane[i];
          if (element.name.includes("APlane") && !element.name.includes("APlane021")) {
            allAPlane.push(element);
          }
          if (element.name.includes("BPlane")) {
            allBPlane.push(element);
          }
          if (element.name.includes("APlane021")) {
            selfPlane = element;
          }
        }

        // for (let i = 0; i < allPlane.length; i++) {
        //   const element = allPlane[i]; 
        //   CreateChatTransFn(element, element.name + "",selfColor);
        // }

        // for (let i = 0; i < allAPlane.length; i++) {
        //   const element = allAPlane[i];
        //   CreateChatTransFn(element, randomNames[generateRandomInt(0, randomNames.length-1)], otherColor[generateRandomInt(0, 1)]);
        // }



        // let newPlane = [];
        // for (let j = 0; j < allAPlane.length; j++) {
        //   const aplane = allAPlane[j];
        //   for (let i = 0; i < allBPlane.length; i++) {
        //     const bplane = allBPlane[i];
        //     if (aplane.name.replace("APlane", "BPlane") == bplane.name) {
        //       newPlane.push(makeMerged(aplane, bplane));
        //     }
        //   }
        // }
        // for (let i = allAPlane.length -1; i >=0 ; i--) {
        //   _this._YJSceneManager.clearObject(allAPlane[i]);
        // }
        // for (let i = allBPlane.length -1; i >=0 ; i--) {
        //   _this._YJSceneManager.clearObject(allBPlane[i]);
        // }
        // allAPlane = [];
        // allBPlane = [];
        // for (let i = 0; i < newPlane.length; i++) {
        //   allAPlane.push(newPlane[i]);
        // }
        // console.log(allAPlane);



        Display();


      }, 1000);

      // setTimeout(() => {
      //   CreateChatTransFn(selfPlane, "username", selfColor, 18000);
      // }, 5000);

    }


    function makeMerged(aplane, bplane) {
      // console.log(aplane, bplane);
      const geometries = [];
      // console.log(aplane.geometry.scale, bplane);
      geometries.push(aplane.geometry.clone());
      geometries.push(bplane.geometry.clone());

      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
      // aplane.geometry = mergedGeometry;

      // let mesh = new THREE.Mesh(mergedGeometry);
      let mesh = new THREE.Mesh(mergedGeometry, aplane.material);
      mesh.name = aplane.name;
      // mesh.visible = false;
      group.add(mesh);
      return mesh;
    }


    // 预设随机姓名长度
    let randomLength = 32;
    //真实用户数量索引
    let updateRandomIndex = 0;

    let times = 0;

    let selfSignin = false;
    /** 刷新签到墙上名字
  *@param username: 自身签到
  **/
    this.UpdateSelfIdWall = function (username) {
      if (selfSignin) { return; }
      selfSignin = true;
      CreateChatTransFn(selfPlane, username, selfColor, 18000);
    }

    /** 刷新签到墙上名字
  *@param usernames: 只接收数组 ['',''] 
  **/
    this.UpdateIdWall = function (usernames) {
      UpdateRandom(usernames);
    }
    // 有新用户加入，把新用户名覆盖到随机列表中
    function UpdateRandom(usernames) {
      for (let i = 0; i < usernames.length; i++) {
        UpdateRandomSingle(usernames[i]);
      }
    }

    function UpdateRandomSingle(username) {
      if (updateRandomIndex > randomLength) {
        randomNames.push(username);
      } else {
        randomNames[updateRandomIndex] = username;
        updateRandomIndex++;
      }

      times++;
      //立即显示
      DisplaySingleUserName(username);
    }


    let displayArr = [];
    function Display() {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          DisplaySingle();
        }, i * 500);


        // const element = allAPlane[generateRandomInt(0, allAPlane.length - 1)];
        // displayArr.push(element.name);
        // setTimeout(() => {
        //   CreateChatTransFn(element, randomNames[generateRandomInt(0, randomNames.length-1)], otherColor[generateRandomInt(0, 1)]);
        // }, i * 300);
      }
    }

    function DisplaySingle() {
      DisplaySingleUserName(randomNames[generateRandomInt(0, randomNames.length - 1)]);
    }


    let displaytimes = 0;
    function DisplaySingleUserName(userName) {
      displaytimes++;
      let hiddenArr = [];
      for (let i = 0; i < allAPlane.length; i++) {
        const element = allAPlane[i];
        let has = false;
        for (let ii = 0; ii < displayArr.length && !has; ii++) {
          const el2 = displayArr[ii];
          if (element.name == el2) {
            has = true;
          }
        }
        if (!has) {
          hiddenArr.push(element);
        }
      }

      console.log("已隐藏的模型数量 ", hiddenArr.length);
      if (hiddenArr.length == 0) { return; }


      const element = hiddenArr[generateRandomInt(0, hiddenArr.length - 1)];
      displayArr.push(element.name);
      setTimeout(() => {
        CreateChatTransFn(element, userName, otherColor[generateRandomInt(0, 1)]);
        displaytimes--;
      }, displaytimes * 500);
      hiddenArr = [];
    }




    function CreatePlane(width, height) {
      let planeGeometry = new THREE.PlaneBufferGeometry(width, height, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        color: 0xffffff,
        depthWrite: false,
        alphaTest: true,
      }); // 材质
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      return plane;
    }

    // 把指定模型材质改为id牌材质
    function CreateChatTransFn(textPlane, text, color, delay = 10000) {


      clearMat(textPlane);


      let mat = createTextTextrueMat(text, color);
      textPlane.visible = true;

      textPlane.material = mat;
      textPlane.material.opacity = 1;

      for (let i = 0; i < allBPlane.length; i++) {
        const element = allBPlane[i];
        if ("APlane" + element.name.replace("BPlane", "") == textPlane.name) {
          element.visible = true;
          element.material = mat;
        }
      }
      setTimeout(() => {
        // 渐隐
        HiddenPlane(textPlane);
      }, delay);
    }

    function clearMat(textPlane) {
      if(textPlane.material == undefined){return;}
      if (textPlane.material.map) {
        textPlane.material.map.dispose();
        textPlane.material.map = undefined;
      }
      if (textPlane.material.emissiveMap) {
        textPlane.material.emissiveMap.dispose();
        textPlane.material.emissiveMap = undefined;
      }

      textPlane.material.dispose();
      textPlane.material = undefined;
      for (let i = 0; i < allBPlane.length; i++) {
        const element = allBPlane[i];
        if ("APlane" + element.name.replace("BPlane", "") == textPlane.name) {
          element.visible = false;
        }
      }

    }

    
    // 在指定坐标创建id牌
    function CreateTextTransFn(pos, text, color) {

      let group = new THREE.Group();
      modelParent.add(group);
      group.position.copy(pos);
      let plane = CreatePlane(1.7, 1.7);
      let mat = createTextTextrueMat(text, color);
      plane.material = mat;
      group.add(plane);

      // setTimeout(() => {
      //   // 渐隐
      //   HiddenPlane(plane);
      // }, 1000);

    }

    // 渐隐
    function HiddenPlane(plane) {
      let opacity = 1;
      let interval = setInterval(() => {
        opacity -= 0.01;
        plane.material.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(interval);
          plane.visible = false;
          clearMat(plane);
          // 当少于10个真实用户时，保持最多10个姓名
          if (updateRandomIndex < 10) {
            if (times <= 0) {
              times = 0;
              //显示新的
              DisplaySingle();
            } else {
              times--;
            }
          } else {
            // 当大于10个真实用户时，保持最多18个姓名
            if (times < 8) {
              //显示新的
              DisplaySingle();
            } else {
              times--;
            }
          }

          for (let i = 0; i < displayArr.length; i++) {
            const element = displayArr[i];
            if (plane.name == element) {
              displayArr.splice(i, 1);
            }
          }
        }
      }, 20);
    }

    let canvasMat = null;


    let canvasTex = null;
    let canvas = null;
    function createTextTextrueMat(message, color) {

      // const canvas = document.createElement('canvas');
      if (canvas == null) {
        canvas = document.getElementById('id-wall-canvas');
      }
      const context = canvas.getContext('2d');

      let canvasWidth = 512;
      let canvasHeight = 512;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // //绘制并填充一个圆角矩形
      fillRoundRect(context, 0, 128, 512, 256, 30, color);
      fillRoundRect(context, 20, 138, 472, 236, 30, '#000006');
      // fillRoundRect(context, 20, 148, 472, 216, 30, '#000006');

      // 文字
      context.beginPath();
      context.translate(256, 256);
      context.fillStyle = color; //文本填充颜色
      context.font = "bold 100px 黑体"; //字体样式设置
      context.textBaseline = "middle"; //文本与fillText定义的纵坐标
      context.textAlign = "center"; //文本居中(以fillText定义的横坐标)
      context.fillText(message, 0, 0, 462);


      canvasTex = new THREE.Texture(canvas);
      canvasTex.needsUpdate = true;

      // const material = new THREE.MeshPhysicalMaterial
      const material = new THREE.MeshBasicMaterial
        ({
          color: 0xffffff,
          map: canvasTex,
          transparent: true,
          emissive: 0xffffff,// emissive默认黑色，设置为白色
          emissiveMap: canvasTex,
          depthWrite: false, // 透明物体之间不相互遮挡
        });
      return material;
    }


    function createText(message, height, callback) {

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let metrics = null;
      const textHeight = 100;
      // context.font = 'normal ' + textHeight + 'px Arial'; //字体
      // metrics = context.measureText(message);
      // let textWidth = metrics.width;


      // let canvasWidth = 600;
      // let canvasHeight = 400;

      let canvasWidth = 512;
      let canvasHeight = 512;
      // console.log(" textwidth = ", textWidth);
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // 创建线渐变色 - 四个参数为坐标
      // const gradient = context.createLinearGradient(0, 0, window.innerWidth, 0)
      // gradient.addColorStop(0, '#4e22b7')
      // gradient.addColorStop(1, '#3292ff')
      // context.fillStyle = gradient; //文字颜色

      // //绘制并填充一个圆角矩形
      fillRoundRect(context, 0, 128, 512, 256, 30, '#FF0000');
      fillRoundRect(context, 20, 138, 472, 236, 30, '#000006');

      // 文字
      context.beginPath();
      context.translate(256, 256);
      context.fillStyle = '#FF0000'; //文本填充颜色
      context.font = "bold 100px 黑体"; //字体样式设置
      context.textBaseline = "middle"; //文本与fillText定义的纵坐标
      context.textAlign = "center"; //文本居中(以fillText定义的横坐标)
      context.fillText(message, 0, 0, 462);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: texture,
        transparent: true,
        emissive: 0xffffff,// emissive默认黑色，设置为白色
        emissiveMap: texture,
      });


      const geometry = new THREE.PlaneGeometry(
        (height * canvasWidth) / canvasHeight,
        height
      );

      const plane = new THREE.Mesh(geometry, material);

      if (callback) {
        callback(plane, canvasWidth);
      }
    }


    /**该方法用来绘制圆角矩形
   *@param cxt:canvas的上下文环境
   *@param x:左上角x轴坐标
   *@param y:左上角y轴坐标
   *@param width:矩形的宽度
   *@param height:矩形的高度
   *@param radius:圆的半径
   *@param lineWidth:线条粗细
   *@param strokeColor:线条颜色
   **/
    function strokeRoundRect(cxt, x, y, width, height, radius, /*optional*/ lineWidth, /*optional*/ strokeColor) {
      //圆的直径必然要小于矩形的宽高
      if (2 * radius > width || 2 * radius > height) { return false; }

      cxt.save();
      cxt.translate(x, y);
      //绘制圆角矩形的各个边
      drawRoundRectPath(cxt, width, height, radius);
      cxt.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2
      cxt.strokeStyle = strokeColor || "#000";
      cxt.stroke();
      cxt.restore();
    }
    function drawRoundRectPath(cxt, width, height, radius) {
      cxt.beginPath(0);
      //从右下角顺时针绘制，弧度从0到1/2PI
      cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

      //矩形下边线
      cxt.lineTo(radius, height);

      //左下角圆弧，弧度从1/2PI到PI
      cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

      //矩形左边线
      cxt.lineTo(0, radius);

      //左上角圆弧，弧度从PI到3/2PI
      cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

      //上边线
      cxt.lineTo(width - radius, 0);

      //右上角圆弧
      cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

      //右边线
      cxt.lineTo(width, height - radius);
      cxt.closePath();
    }
    /**该方法用来绘制一个有填充色的圆角矩形
   *@param cxt:canvas的上下文环境
   *@param x:左上角x轴坐标
   *@param y:左上角y轴坐标
   *@param width:矩形的宽度
   *@param height:矩形的高度
   *@param radius:圆的半径
   *@param fillColor:填充颜色
   **/
    function fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor) {
      //圆的直径必然要小于矩形的宽高
      if (2 * radius > width || 2 * radius > height) { return false; }

      cxt.save();
      cxt.translate(x, y);
      //绘制圆角矩形的各个边
      drawRoundRectPath(cxt, width, height, radius);
      cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值
      cxt.fill();
      cxt.restore();
    }
    InitFn();
  }
}

export { SignInWall };