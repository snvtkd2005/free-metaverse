



import * as THREE from "three";

import { YJSprite } from "/@/threeJS/YJSprite.js";

class YJPlayerChat {
  constructor(namePosTrans, nameScale) {

    var scope = this;

    let _textWidth = 0;
    let _textHeight = 100;
    let _YJSprite = null;
    function createText(message, height, end) {

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let metrics = null;
      const textHeight = 100;
      context.font = 'normal ' + textHeight + 'px Arial'; //字体
      metrics = context.measureText(message);
      let textWidth = metrics.width;

      if (_textWidth < textWidth) {
        _textWidth = textWidth;
      }
      textWidth = _textWidth;

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
      context.fillStyle = '#0000ff'; //文字颜色



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
        height
      );

      const plane = new THREE.Mesh(geometry, material);


      return plane;

    }
    function resetGeometry(x,y) {

      console.log("聊天内容 宽 高 ",x,y);
      x*=2000;
      y*=2000;

      //九宫格的顶点坐标 
      // let widthX = [0, 300, 300+x ,  300+x+380];
      // let heightY = [0, 40, 40+y,40+y + 421];

      // //九宫格的uv坐标
      // let u = [0, 0.25, 0.75, 1.0];
      // let v = [0, 0.10, 0.2, 1.0]; 

      let widthX = [0,parseInt(x*0.33333) ,parseInt(x*0.66666), x];
      let heightY = [0,parseInt(y*0.33333) ,parseInt(y*0.66666),y];
      let u = [0, 0.33333, 0.66666, 1.0];
      let v = [0, 0.33333, 0.66666, 1.0]; 

      let scale = 0.1; 

      for (let j = 0; j < widthX.length; j++) {        
        widthX[j] -= widthX[widthX.length-1]/2 ;  //把顶点向左移动一半的宽度，让其居中
        widthX[j]*=scale  ;
      }
      for (let j = 0; j < heightY.length; j++) {
        heightY[j] -= heightY[heightY.length-1]/2 ;  //把顶点向左移动一半的宽度，让其居中
        heightY[j]*=scale;
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
    function CreateTextShaderMat(spriteBG){
      textShaderMat = new THREE.ShaderMaterial({
        uniforms: {
          uPos: { value: new THREE.Vector3(0,0,0) },
          uSize: { value: new THREE.Vector2(300, 300) },
          // uSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uSizeAttenuation: { value: 0 },                        //根据距离衰减
          uColor: { value: new THREE.Vector4(1, 1,1, 1) },
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
        wireframe:false,
        transparent:true,
      })

      return textShaderMat;
    }


    function createText2(message, cow, height) {




      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let metrics = null;
      let textHeight = 100 * cow;
      context.font = 'normal ' + textHeight + 'px Arial'; //字体
      metrics = context.measureText(message);
      let textWidth = metrics.width / cow;


      canvas.width = textWidth;
      canvas.height = textHeight;
      context.backgroundColor = "#ff0000";

      context.font = 'normal ' + textHeight + 'px Arial'; //字体 必须再次设置
      context.textAlign = 'center';
      context.textBaseline = 'middle'; //居中对齐
      context.fillStyle = '#ff0000'; //文字颜色



      context.fillText(message, textWidth / 2, textHeight / 2);
      // context.fillText(message, textWidth / 2, textHeight / 2);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
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


    // 创建文字背景框
    function createTextBackground(width, height) {

      // const texture = new THREE.Texture(canvas);
      // texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        // side: THREE.DoubleSide,
        // map: texture,
        // transparent: true,
      });
      const geometry = new THREE.PlaneGeometry(
        width,
        height
      );
      const plane = new THREE.Mesh(geometry, material);
      return plane;

    }

    function Init() {
      // console.error(" 显示角色聊天文字内容 ");
    }

    //#region 聊天内容框
    this.CreateChatTrans = function (e) {

      if (textParent == null) {
        textParent = new THREE.Group();
        namePosTrans.add(textParent);
      }

      // return;
      CreateChatTransFn2(e);
    }
    let lineTextCount = 15;
    function CreateChatTransFn2(chat) {

      clearGroup(textParent);

      
      // console.log("显示发送的聊天内容",chat.length);
      let length = chat.length;
      let c = Math.ceil(length / lineTextCount);

      // console.log(" 余数为 " + yu);
      if (c > 1) {
        let yu = length % lineTextCount;
        if (yu == 0) { } else {
          // let s = "";
          // yu = lineTextCount - yu;
          // for (let i = 0; i <= yu; i++) {
          //   s += "";
          // }
          // chat += s;
        }
      }

      let allHeight = 0;
      _textWidth = 0;

      // console.log(" 按11个字拆分为字符串 组 " + c );
      for (let i = 0; i < c; i++) {
        allHeight += lineTextHeight;
        const element = chat.substring(i * lineTextCount, i * lineTextCount + lineTextCount);
        CreateChatTransFn(element, i == c - 1);
        if (i != c - 1) {
          allHeight += 0.03;
        }
      }



      // const textPlane = createText2(chat, c, lineTextHeight);
      // textParent.add(textPlane);
      // textPlane.position.set(0, allHeight * 0.7 + 0.2, 0.001);
      // textPlane.scale.set(1, 1, 1);



      if (_YJSprite == null) {
        _YJSprite = new YJSprite("./public/farm/" + "chatBG.png", namePosTrans, new THREE.Vector3(0, 0.1, 0));
      }
      _YJSprite.SetSize(400, 30);


      // 消息背景框
      // const textBackground = createTextBackground(_textWidth * 0.0013, allHeight + 0.2);
      // textParent.add(textBackground);
      // textBackground.position.set(0, allHeight * 0.7 + 0.2, 0.001);
      // textBackground.scale.set(1, 1, 1);

      return;
      setTimeout(() => {
        clearGroup(textParent);
        _YJSprite.display(false);
      }, 3000);

    }
    let chatList = [];
    let lineTextHeight = 0.06;
    let textParent = null;

    function CreateChatTransFn(chat, end) {



      let posTrans = new THREE.Group();
      posTrans.name = "chat";
      textParent.add(posTrans);
      posTrans.position.set(0, (0.3), 0); //原点位置


      // const resetButton = makeButtonMesh( 1, lineTextHeight + 0.02, 0.01, 0xffffff );
      const resetButton = new THREE.Group();

      const resetButtonText = createText(chat, lineTextHeight, end);

      resetButton.add(resetButtonText);
      resetButtonText.position.set(0, 0, 0.0051);
      resetButtonText.scale.set(1, 1, 1);
      posTrans.add(resetButton);
      resetButton.name = "ignoreRaycast";
      resetButton.position.set(0, 0, 0);
      var size = 2;
      resetButton.scale.set(size, size, size);

      posTrans.scale.set(nameScale, nameScale, nameScale);

      chatList.push(posTrans);

      // setTimeout(() => {
      //   clearGroup(posTrans);
      //   textParent.remove(posTrans);
      //   chatList.splice(0, 1);
      // }, 3000);

      for (let i = 0; i < chatList.length; i++) {
        const element = chatList[i];
        element.position.set(0, (0.2 + (chatList.length - 1 - i) * 0.15), 0);
      }
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