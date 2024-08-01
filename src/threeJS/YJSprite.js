import * as THREE from "three";


class YJSprite {
  constructor(spritePath, parent,offset, objectToCurve) {
 
    var mesh;
    // let spritePath = "";
    let spriteBG = null; 
    function Init() {

      // console.error(" 添加 sprite ");
      // spritePath = _this.GetPublicUrl() + "chatBG.png" ;

      var textureLoader = new THREE.TextureLoader();
      spriteBG = textureLoader.load(spritePath);
      createSprite();
      if(parent){
        parent.add(mesh);
        mesh.position.copy(offset);
      }
    }

    this.display = function(b){
      mesh.visible = b;
    }
    this.SetSize = function(width,height){
      mesh.geometry = resetGeometry(width,height);
      mesh.visible = true;
    }

    function resetGeometry(x,y) {
      //九宫格的顶点坐标 
      let widthX = [0, 300, 300+x ,  300+x+380];
      let heightY = [0, 40, 40+y,40+y + 421];

      //九宫格的uv坐标
      let u = [0, 0.25, 0.75, 1.0];
      let v = [0, 0.10, 0.2, 1.0]; 

      let scale = 0.1; 

      for (let j = 0; j < widthX.length; j++) {        
        widthX[j] -= widthX[widthX.length-1]/2 ;  //把顶点向左移动一半的宽度，让其居中
        widthX[j]*=scale  ;
      }
      for (let j = 0; j < heightY.length; j++) {
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


    function createSprite() {


      /**
      使用笔记
      1，widthX数组表示九宫格横向分割像素，
      widthX = [0, 300, 720 , 1100] 
      从左往右计算，0-300像素固定 720-1100像素固定
      300-720之间为九宫格拉伸范围。
      2，heightY数组表示九宫格竖向分割像素，
      heightY = [0, 40, 100, 421]
      从下往上计算，0-40像素固定 100-521像素固定
      40-100 之间为九宫格拉伸范围。
      3，设置后通过设置索引1和索引2的差值，控制九宫格大小
      4，uv按分割比例同步调整
       */


      let scale = 0.1;
      //九宫格的顶点坐标 
      let widthX = [0, 300, 720 , 1100];
      let heightY = [0, 40, 100, 521];

      for (let j = 0; j < widthX.length; j++) {
        widthX[j] -= widthX[widthX.length-1]/2 ;  //把顶点向左移动一半的宽度，让其居中

        widthX[j]*=scale;
      }
      for (let j = 0; j < heightY.length; j++) {
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

      //九宫格的uv坐标. U横，V竖
      let u = [0, 0.25, 0.75, 1.0];
      let v = [0, 0.10, 0.2, 1.0];
      // let u = [0, 0.25, 0.75, 1.0];
      // let v = [0, 0.25, 0.75, 1.0];
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

      let mesh2 = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
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
      }));
      mesh = mesh2;

      // mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({
      //   transparent:true,
      //   map:textureLoader.load(spritePath) ,
      // }));

      // mesh2.onBeforeRender = function (renderer) {
      //   var size = renderer.getDrawingBufferSize(new THREE.Vector2());
      //   this.material.uniforms.uSize.value = size;
      // };

      mesh.receiveShadow = false;
      mesh.castShadow = false;
    }
    Init();
    var updateId = null;

    function update() {
      requestAnimationFrame(update);
 
    }

  }
}

export { YJSprite };