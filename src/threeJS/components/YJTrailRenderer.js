

// 拖尾特效
// line renderer splines
// 渲染线模型、给线模型赋予材质、实时改变线模型长度
import * as THREE from "three";
class YJTrailRenderer {
    constructor(_this,scene, parent) {
        let scope = this;
        this.used = false;

        let map = new THREE.TextureLoader().load(_this.$publicUrl + "images/smoke001.png");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.matrixAutoUpdate = false;
        let material = new THREE.MeshBasicMaterial(
            {
                color: 0xffffff,
                // depthWrite: false, // 透明物体之间不相互遮挡
                transparent: true,
                side: THREE.DoubleSide,
                // blending: THREE.AdditiveBlending,
                // map: map,
                wireframe: true,
            }
        );
        let vertexShaderDef =  /* glsl */ `

        `;
        let vertexShaderMain =  /* glsl */ ``;
        // 片元着色器
        let fragmentShaderDef = /* glsl */ ` 
    #include <map_pars_fragment> 
     
    uniform float u_time;
    uniform float u_direction;
    
    uniform sampler2D mainTex;
    uniform vec3 color;
    uniform vec3 color2;
    vec2 hash( vec2 p ) // replace this by something better
    {
        p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }
    float noise( in vec2 p )
    {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;

        vec2  i = floor( p + (p.x+p.y)*K1 );
        vec2  a = p - i + (i.x+i.y)*K2;
        float m = step(a.y,a.x); 
        vec2  o = vec2(m,1.0-m);
        vec2  b = a - o + K2;
        vec2  c = a - 1.0 + 2.0*K2;
        vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
        vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        return dot( n, vec3(70.0) );
    } 
    float noise3(vec2 uv0 ){
        float noiseValue=0.;
                uv0*=5.;
                mat2 m=mat2(1.6,1.2,-1.2,1.6);
                noiseValue=.5000*noise(uv0);uv0=m*uv0;
                noiseValue+=.2500*noise(uv0);uv0=m*uv0;
                noiseValue+=.1250*noise(uv0);uv0=m*uv0;
                noiseValue+=.0625*noise(uv0);uv0=m*uv0;
                noiseValue=.5+.5*noiseValue;
                return noiseValue;
    }  

        `;
        let color = new THREE.Color(0xffffff);
        let color2 = new THREE.Color(0xffffff);
        let uniforms = {
            'color': { value: color },
            'color2': { value: color2 },
            'mainTex': { value: map },
            'u_time': { value: 1.0 },
            'u_direction': { value: 1.0 },
            'alignment': { value: 0 }, //0 view, 1 transformZ
        };
        let _ShaderMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            depthWrite: false, // 透明物体之间不相互遮挡
            side: THREE.DoubleSide, //双面材质占2个drawcall
            transparent: true,
            // wireframe:_Global.setting.inEditor,

        });
        _ShaderMaterial.onBeforeCompile = (shader) => {
            // console.log("shader ", shader);

            Object.assign(shader.uniforms, uniforms)
            if (_ShaderMaterial.map == null) {
                // 没有贴图的情况下，需要声明vUv
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <common>',
                    `
                    #include <common>  
                    varying vec2 vUv;
                    // varying vec3 vNormal;  
                    `
                );
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <uv_vertex>',
                    `
                    #include <uv_vertex>  
                    vUv = uv;
                    `
                );

                // 片元
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <common>',
                    `
                    #include <common>  
                    varying vec2 vUv;
                    // varying vec3 vNormal;  
                    `
                );
            }

            shader.vertexShader = shader.vertexShader.replace(
                '#include <worldpos_vertex>',
                `
                #include <worldpos_vertex>  
                // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                // gl_Position = modelViewMatrix * vec4(vViewPosition, 1.0); 

                // vNormal = normalize(modelViewMatrix * vec4(normal, 0.0)).xyz;  
  
                // // 将顶点位置设置为与相机位置相同的Z值，但保留X和Y值  
                // vec3 position = position.xyz;  
                // vec3 cameraPosition = (inverse(viewMatrix) * vec4(0.0, 0.0, 0.0, 1.0)).xyz;  
                // vec3 direction = cameraPosition - position;  
                // float distance = length(direction);  
                // direction = normalize(direction);  
              
                // // 假设camera的up向量是(0, 1, 0)  
                // vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), direction));  
                // vec3 up = cross(direction, right);  
              
                // // 假设网格在XZ平面上，这里使用顶点的X和Z坐标  
                // vec2 offset = position.xy;  
                // vec3 newPosition = cameraPosition - distance * direction + offset.x * right + offset.y * up;  
              
                // gl_Position = projectionMatrix * vec4(newPosition, 1.0);

                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_pars_fragment>',
                fragmentShaderDef
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <output_fragment>',
                `   
                vec2 uv0=vUv ;
                vec2 uv1=vUv ;
                // uv1.x += -u_time*1.5 ;
                // uv0.x += -u_time*0.5 ;
                uv1.x += -u_time*1.0 ;
                uv0.x += -u_time*1.0 ;
 
                uv1.x *= u_direction;
                uv0.x *= u_direction;

                // float noiseValue = (noise(uv0*10.)); 
                
                float noiseValue = noise3(uv0);

                float onemlnus = (1.-(vUv.r));
                float add = noiseValue + onemlnus;
                float subtract = add - vUv.r;
                float finalValue = 1.- subtract  ; 

                vec3 multi = (texture2D(mainTex, uv1).rgb )  * finalValue;
                vec3 finalColor =  mix( color,color2,0.5)*multi ;
                gl_FragColor = vec4(finalColor,multi.r );
 
              `
            );

        }
        let splinePath = [
            // new THREE.Vector3(3, 0, 0),
            // new THREE.Vector3(0, 0, 0),
            // new THREE.Vector3(6,0, 0), 
        ];
        let tubeGeometry = new THREE.BufferGeometry();;

        let mesh;
        const params = {
            width: 0.5, //宽度
            radiusSegments: 2,//边数
            closed: false,
        };
        let oldPos = new THREE.Vector3();
        let group = new THREE.Group();
        // group.add(new THREE.AxesHelper(1));
        if(scene){
            scene.add(group);
        }else{
            parent.add(group);
        }
        group.position.set(0, 0, 0);
        // oldPos = parent.position.clone();
        oldPos = parent.getWorldPosition(new THREE.Vector3());
        oldPos.y -= params.width / 2;
        let sprite = null;
        function Init() {

            if(_Global.setting.inEditor){
                let planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10); // 生成平面
                let plane = new THREE.Mesh(planeGeometry, _ShaderMaterial);
                plane.position.x = 0;
                plane.position.y = 1;
                plane.position.z = 0;
                _Global.YJ3D.scene.add(plane); // 向该场景中添加物体
            }

            // // 起始位置光球
            // let map = new THREE.TextureLoader().load(_this.$publicUrl + "images/cirle001.png");
            // map.wrapS = map.wrapT = THREE.RepeatWrapping;
            // map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
            // const material = new THREE.SpriteMaterial({ 
            //     map: map,
            //     depthWrite: false,
            //     // blending: THREE.AdditiveBlending,    
            //     color: 0xffff00 ,
            // });
            // sprite = new THREE.Sprite(material);
            // sprite.center.set(0.5, 0.5); 
            // sprite.scale.set(1, 1, 1);
            // sprite.position.y = params.width/2;
            // parent.add(sprite);  

            // addTube();
            // animate();
            // scope.start();

        }
        // 3 6 5 3 2 5
        let colorList = [
            0xff0000,//1
            0x00ff00,//2
            0x0000ff,//3
            0x666666,//4
            0xaaaaaa,//5
            0x000000,//6
        ];

        // 创建模型顶点参考点
        function CreateVerticesHandler(parent, vertices) {

            let num = 0;
            for (let i = 0, l = vertices.length; i < l; i += 3) {
                let size = 0.1;
                let planeGeometry = new THREE.BoxGeometry(size, size, size); // 生成平面
                let plane = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({
                    // color:0xff0000,
                    // color: Math.random() * 0xffffff ,
                    color: colorList[num],
                }));
                parent.add(plane); // 向该场景中添加物体

                plane.position.x = vertices[i];
                plane.position.y = vertices[i + 1];
                plane.position.z = vertices[i + 2];
                num++;
            }
            console.log(" 生成顶点数量 ", num);
        }
        function addTube() {
            if (mesh !== undefined) {
                group.remove(mesh);
                mesh.geometry.dispose();
            }
            if (splinePath.length < 2) {
                return;
            }

            const extrudePath = new THREE.CatmullRomCurve3(splinePath);
            tubeGeometry = new THREE.TubeGeometry(extrudePath, splinePath.length - 1, 0.01, params.radiusSegments, params.closed);


            let vertices = tubeGeometry.attributes.position.array;

            for (let i = 0, l = vertices.length; i < l; i += 9) {
                vertices[i] += 0;
                vertices[i + 1] += 0;
                vertices[i + 2] += 0;

                vertices[i + 3] = vertices[i];
                vertices[i + 4] = vertices[i + 1];
                vertices[i + 5] = vertices[i + 2];

                vertices[i + 6] += 0;
                vertices[i + 7] += params.width;
                vertices[i + 8] += 0;

            }

            for (let i = 0; i < tubeGeometry.attributes.uv.count; i++) {
                tubeGeometry.attributes.uv.setY(i, tubeGeometry.attributes.uv.getY(i) * 2);
                // tubeGeometry.attributes.uv.setY(i,tubeGeometry.attributes.uv.getY(i)*data.scaleUVy+data.offsetUVy);
            }
            //刷新法线
            tubeGeometry.computeVertexNormals();

            addGeometry(tubeGeometry);
        }
        function addGeometry(geometry) {
            mesh = new THREE.Mesh(geometry, _ShaderMaterial);
            // mesh = new THREE.Mesh(geometry, material);

            group.add(mesh);

            // CreateVerticesHandler(mesh, geometry.attributes.position.array);

        }
        let lifeTime = 0.1;
        let maxLength = 20; 
        let anchorType = "center"; 
        let isLoop =  true;  
        let directionX = 1;
        let data = null;
        this.SetMessage = function (msg) {

            if (msg == null || msg == undefined || msg == "") { return; }
            // data = JSON.parse(msg);
            data = (msg);
            scope.id = scope.transform.id;
            params.width = data.width;
            lifeTime = data.lifeTime;
            maxLength = data.maxLength;
            color.set(data.color);
            color2.set(data.color2);

            directionX = data.isMirrorX?-1:1;
            if(data.anchorType != undefined){
                anchorType = data.anchorType;
            }
            if(data.isLoop != undefined){
                isLoop = data.isLoop;
            } 
            oldPos = anthorPos();
            
            map = new THREE.TextureLoader().load(_this.$uploadUVAnimUrl + data.imgPath);
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

            
            
            uniforms["mainTex"].value = map;
            // material.color.set(data.color);
            console.error("in 拖尾 msg = ", scope.id, data);
            if (_Global.setting.inEditor && !scope.used) {
                splinePath = [];
                let pos = oldPos.clone();
                pos.x = 3;
                splinePath.push(pos.clone());
                pos.x = 0;
                splinePath.push(pos.clone());
                addTube(); 
            }
        }
        let interval_splice = null;
        function anthorPos(){
            let pos = parent.getWorldPosition(new THREE.Vector3());
            if(anchorType == "bottom"){
            }else{
                pos.y -= params.width / 2;
            }
 
            return pos;
        } 
        this.start = function () {
            console.log(" 开始 trail ");

            splinePath = [];
            addTube();
            oldPos = anthorPos(); 
            scope.used = true; 

            interval_splice = setInterval(() => {
                if (splinePath.length > 0) {
                    splinePath.splice(0, 1);
                    addTube();
                } else {
                    // this.stop();
                    
                }
            }, lifeTime * 1000);
        }
        this.stop = function () {
            // console.log(" 停止拖尾 ======="); 
            splinePath = [];
            addTube();
            clearInterval(interval_splice);
            scope.used = false;
        }
        let deltaTime = 1;
        let last = performance.now(); 
        this._update = function () {
            animate();
        }
        function animate() {
            if(!scope.used){
                return;
            } 
            const now = performance.now();
            let delta = (now - last) / 1000; 

            deltaTime -= delta ;
            if(isLoop){
                if (deltaTime <= -1) {
                    deltaTime = 1;
                }
            }else{
                if (deltaTime <= 0) {
                    deltaTime = 0;
                } 
            }
            last = now;
            if (_ShaderMaterial){
                uniforms['u_time'].value = deltaTime;
                uniforms['u_direction'].value = directionX;
            } 
            // return;
 
            let newPos = anthorPos();

            // console.log("newPos ",newPos.distanceTo(oldPos),splinePath.length); 

            if (newPos.distanceTo(oldPos) > 0.021) { 
                splinePath.push(newPos); 

                if(scene){

                }else{
                    group.position.copy(newPos.clone().multiplyScalar(-1)); 
                }

                if (splinePath.length > maxLength) {
                    splinePath.splice(0, 1);
                }
                addTube();
                oldPos = newPos; 

            } else {
            }

        }
        Init();
    }
}

export { YJTrailRenderer };