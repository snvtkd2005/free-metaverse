



import * as THREE from "three";

import { YJSprite } from "/@/threeJS/YJSprite.js";

class YJPlayerChat {
  constructor(namePosTrans, nameScale) {

    var scope = this;
 
    let _YJSprite = null;
    function createText(message, height, end, offsetY) {

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let metrics = null;
      const textHeight = 50; //决定图片分辨率
      context.font = 'normal ' + textHeight + 'px Arial'; //字体
      metrics = context.measureText(message);
      // let textWidth = metrics.width;
      let textWidth = 750; //限定宽为固定。让文字大小一致
      
      // console.log(" textwidth = ",textWidth);
      canvas.width = textWidth;
      canvas.height = textHeight;
      // context.background = "#ff0000";

      context.font = 'normal ' + textHeight + 'px Arial'; //字体 必须再次设置
      if (end) {
        context.textAlign = 'center';
        context.textBaseline = 'middle'; //居中对齐
      } else {

        context.textAlign = 'center';
        context.textBaseline = 'middle'; //居中对齐
      }
      context.fillStyle = '#000000'; //文字颜色



      context.fillText(message, textWidth / 2, textHeight / 2);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      // const material = new THREE.MeshBasicMaterial({
      //   color: 0xffffff,
      //   side: THREE.DoubleSide,
      //   map: texture,
      //   transparent: true,
      // });

      const material = CreateTextShaderMat(texture);

      // const geometry = new THREE.PlaneGeometry(
      //   (height * textWidth) / textHeight,
      //   height
      // );

      const geometry = resetGeometry(
        (height * textWidth) / textHeight,
        height, offsetY
      );

      const plane = new THREE.Mesh(geometry, material);


      return plane;

    }

    function resetGeometry(x, y, offsetY) {

      // 最小限制到0.07，再小就看不见
      if(x<0.1){
        x = 0.12;
      }

      // console.log("聊天内容 宽 高 ", x, y);

      x *= 2000;
      y *= 2000;

      let widthX = [0, parseInt(x * 0.33333), parseInt(x * 0.66666), x];
      let heightY = [0, parseInt(y * 0.33333), parseInt(y * 0.66666), y];
      let u = [0, 0.33333, 0.66666, 1.0];
      let v = [0, 0.33333, 0.66666, 1.0];

      let scale = 0.1;

      for (let j = 0; j < widthX.length; j++) {
        widthX[j] -= widthX[widthX.length - 1] / 2;  //把顶点向左移动一半的宽度，让其居中
        widthX[j] *= scale;
      }
      for (let j = 0; j < heightY.length; j++) {
        heightY[j] += heightY[heightY.length - 1] / 2;  //把顶点向左移动一半的宽度，让其居中
        heightY[j] += offsetY;
        heightY[j] *= scale;
      }

      let vv = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          vv.push({ x: widthX[i], y: heightY[j], z: 0 });
        }
      }

      let vertices_data = [];
      for (let m = 0; m < 3; m++) {
        for (let n = 0; n < 3; n++) {
          vertices_data.push(vv[4 * m + n].x, vv[4 * m + n].y, vv[4 * m + n].z);
          vertices_data.push(vv[4 * (m + 1) + n + 1].x, vv[4 * (m + 1) + n + 1].y, vv[4 * (m + 1) + n + 1].z);
          vertices_data.push(vv[4 * m + n + 1].x, vv[4 * m + n + 1].y, vv[4 * m + n + 1].z);

          vertices_data.push(vv[4 * m + n].x, vv[4 * m + n].y, vv[4 * m + n].z);
          vertices_data.push(vv[4 * (m + 1) + n].x, vv[4 * (m + 1) + n].y, vv[4 * (m + 1) + n].z);
          vertices_data.push(vv[4 * (m + 1) + n + 1].x, vv[4 * (m + 1) + n + 1].y, vv[4 * (m + 1) + n + 1].z);
        }
      }

      let uv = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          uv.push({ u: u[i], v: v[j] });
        }
      }
      let uvs_data = [];
      for (let m = 0; m < 3; m++) {
        for (let n = 0; n < 3; n++) {
          uvs_data.push(uv[4 * m + n].u, uv[4 * m + n].v);
          uvs_data.push(uv[4 * (m + 1) + n + 1].u, uv[4 * (m + 1) + n + 1].v);
          uvs_data.push(uv[4 * m + n + 1].u, uv[4 * m + n + 1].v);

          uvs_data.push(uv[4 * m + n].u, uv[4 * m + n].v);
          uvs_data.push(uv[4 * (m + 1) + n].u, uv[4 * (m + 1) + n].v);
          uvs_data.push(uv[4 * (m + 1) + n + 1].u, uv[4 * (m + 1) + n + 1].v);
        }
      }

      var geometry = new THREE.BufferGeometry();
      var uvs = new Float32Array(uvs_data);
      var vertices = new Float32Array(vertices_data);

      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      return geometry;

    }


    let textShaderMat = null;
    function CreateTextShaderMat(spriteBG) {
      let w = 600;
      let h = 300;
      h = window.innerHeight/window.innerWidth * w ;
      textShaderMat = new THREE.ShaderMaterial({
        uniforms: {
          uPos: { value: new THREE.Vector3(0, 0, 0) },
          uSize: { value: new THREE.Vector2(w, h) },
          // uSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uSizeAttenuation: { value: 0 },                        //根据距离衰减
          uColor: { value: new THREE.Vector4(1, 1, 1, 1) },
          uMap: { value: spriteBG },
        },
        vertexShader: `    
                                  uniform vec3 uPos;
                                  uniform vec2 uSize;
                                  uniform int  uSizeAttenuation;
                                  varying vec2 vUv;
                                  void main() {
                                      vUv = uv;
                                      vec4 mvPosition = modelViewMatrix * vec4( uPos, 1.0 );
                                      vec4 screenpos = projectionMatrix * mvPosition;
                                      if(uSizeAttenuation == 1){

                                          vec3 v = vec3(position.x,  position.y, 0);
                                          screenpos += vec4(v, 0);
                                      } else {

                                           vec3 v = vec3(position.x / uSize.x,  position.y / uSize.y, 0);
                                          screenpos += vec4(v * screenpos.w, 0);
                                      }
                                      
                                      gl_Position = screenpos;
                                  }`,
        fragmentShader: ` 
                      uniform vec4 uColor;
                      uniform sampler2D uMap;
                      varying vec2 vUv;
                      void main() {
                          vec2 uv = vec2(vUv.x, vUv.y);
                          gl_FragColor = texture2D( uMap, uv) * uColor;
                          //gl_FragColor = vec4(1.0);
                      }`,
        wireframe: false,
        transparent: true,
      })

      return textShaderMat;
    }
    function Init() {
      // console.error(" 显示角色聊天文字内容 ");
      // setting.maxWidth = window.innerWidth;
    }

    //#region 聊天内容框
    this.CreateChatTrans = function (e) {

      if (textParent == null) {
        textParent = new THREE.Group();
        namePosTrans.add(textParent); 
      }
      if(e=="" || e==undefined){
        return;
      }

      // return;
      CreateChatTransFn2(e);
    }
    let lineTextCount = 15;
    let clearDelay = null;
    let setting = {
      maxWidth:800, //九宫格背景图宽度最大值
      // maxWidth:1600, //九宫格背景图宽度最大值
      minWidth:400,  //九宫格背景图宽度最小值
      lineHeight:150, //九宫格背景图 每一行高度。 单位是像素？
    }
    function CreateChatTransFn2(chat) {

      clearGroup(textParent);


      // console.log("显示发送的聊天内容",chat.length);
      let length = chat.length;
      let c = Math.ceil(length / lineTextCount);
      let yu = length % lineTextCount;
      // console.error(" 文字总数 ",length, " 拆分 行: ", c + "  余 ", yu);
      // 沃尔沃二翁二翁绕弯儿为二问问e
      let width = 0;
      let height = 0;
 
      if (c > 1) {
        if (yu == 0) { } else {
          // let s = "";
          // yu = lineTextCount - yu;
          // for (let i = 0; i <= yu; i++) {
          //   s += "";
          // }
          // chat += s;
        }
        width = setting.maxWidth;
        height = setting.lineHeight * c;
      } else {
        height = setting.lineHeight;
        width = length * setting.maxWidth/lineTextCount;
        if(width<setting.minWidth){width=setting.minWidth;}
      }

      // console.log(" 按11个字拆分为字符串 组 " + c );
      for (let i = 0; i < c; i++) {
        const element = chat.substring(i * lineTextCount, i * lineTextCount + lineTextCount);
        CreateChatTransFn(element, i == c - 1, (c - i - 1) * setting.lineHeight );
      }


      if (_YJSprite == null) {
        _YJSprite = new YJSprite("./public/farm/" + "chatBG.png", namePosTrans, new THREE.Vector3(0, 0.1, 0));
      }

      _YJSprite.SetSize(width*.8, height* 0.9);



      // return;
      if (clearDelay != null) {
        clearTimeout(clearDelay);
        clearDelay = null;
      }
      clearDelay = setTimeout(() => {
        clearGroup(textParent);
        _YJSprite.display(false);
      }, c * 3000);

    }
    let chatList = [];
    let lineTextHeight = 0.06;
    let textParent = null;

    function CreateChatTransFn(chat, end, offsetY) {


      const resetButtonText = createText(chat, lineTextHeight, end, offsetY);
      textParent.add(resetButtonText);
      
      resetButtonText.position.copy(new THREE.Vector3(0, 0.1, 0.02));
      resetButtonText.name = "ignoreRaycast";

      chatList.push(resetButtonText);

      // setTimeout(() => {
      //   clearGroup(posTrans);
      //   textParent.remove(posTrans);
      //   chatList.splice(0, 1);
      // }, 3000);

      // for (let i = 0; i < chatList.length; i++) {
      //   const element = chatList[i];
      //   element.position.set(0, ( 0.1 + (chatList.length - 1 - i) * 0.15),0.02);
      // }


    }

    function clearGroup(group) {
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          item.geometry.dispose();
          item.material.dispose();
        }
      };
      const removeObj = (obj) => {
        let arr = obj.children.filter((x) => x);
        arr.forEach((item) => {
          if (item.children.length) {
            removeObj(item);
          } else {
            clearCache(item);
            item.clear();
          }
        });
        obj.clear();
        arr = null;
      };
      removeObj(group);
    }
    //#endregion 

    Init();
  }
}

export { YJPlayerChat };