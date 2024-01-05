

// 拖尾特效
// line renderer splines
// 渲染线模型、给线模型赋予材质、实时改变线模型长度
import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import * as Curves from 'three/examples/jsm/curves/CurveExtras.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
class YJTrailRenderer {
    constructor(_this, scene, parent) {
        let scope = this;
        this.used = false;

        let map = new THREE.TextureLoader().load(_this.$publicUrl + "images/smoke001.png");
        // let map = new THREE.TextureLoader().load(_this.$publicUrl + "images/box.jpg");
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        let material = new THREE.MeshBasicMaterial(
            {
                // color: 0xff0000,
                depthWrite: false, // 透明物体之间不相互遮挡
                transparent: true,
                side: THREE.DoubleSide,
                // blending: THREE.AdditiveBlending,
                map: map,
            }
        );
        // 片元着色器
        let fragmentShaderDef = /* glsl */ ` 
    #include <map_pars_fragment> 
     
    uniform float u_time;
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
    `;
        let color = new THREE.Color(0xff0000);
        let color2 = new THREE.Color(0x0000ff);
        let uniforms = {
            'color': { value: color },
            'color2': { value: color2 },
            'mainTex': { value: map },
            'u_time': { value: 1.0 },
        };
        let _ShaderMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            transparent: true,
        });
        _ShaderMaterial.onBeforeCompile = (shader) => {
            // console.log("shader ", shader);

            Object.assign(shader.uniforms, uniforms)
            if (_ShaderMaterial.map == null) {
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <common>',
                    `
                #include <common>  
                varying vec2 vUv;
                `
                );
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <uv_vertex>',
                    `
                #include <uv_vertex>  
                vUv = uv;
                `
                );

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <common>',
                    `
                        #include <common>  
                        varying vec2 vUv;
                        `
                );
            }

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_pars_fragment>',
                fragmentShaderDef
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <output_fragment>',
                `   
                vec2 uv0=vUv ;
                vec2 uv1=vUv ;
                uv1.x += -u_time*1.5; 
                uv0.x += -u_time*0.5;

                float noiseValue = (noise(uv0*10.));
                noiseValue=0.;
                uv0*=5.;
                mat2 m=mat2(1.6,1.2,-1.2,1.6);
                noiseValue=.5000*noise(uv0);uv0=m*uv0;
                noiseValue+=.2500*noise(uv0);uv0=m*uv0;
                noiseValue+=.1250*noise(uv0);uv0=m*uv0;
                noiseValue+=.0625*noise(uv0);uv0=m*uv0;
                noiseValue=.5+.5*noiseValue;

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
        const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3, wireframe: true, transparent: true });
        let splinePath = [
            // new THREE.Vector3(0, 0, 0), 
            // new THREE.Vector3(0, 0, 1),
            // new THREE.Vector3(0, 0, 2),
            // new THREE.Vector3(0, 0, 3),
            // new THREE.Vector3(0, 0, 4),
        ];
        let tubeGeometry, mesh;
        const params = {
            width: 0.5, //宽度
            radiusSegments: 2,//边数
            closed: false,
        };
        let oldPos = new THREE.Vector3();
        let group = new THREE.Group();
        // group.add(new THREE.AxesHelper(1));
        scene.add(group);
        // parent.add(group);
        group.position.set(0, 1, 0);
        oldPos = parent.position.clone();
        function Init() {
            // const gui = new GUI({ width: 285 });
            // const folderGeometry = gui.addFolder('Geometry');
            // folderGeometry.add(params, 'width', 0.01, 1).step(0.01).onChange(function () {
            //     setScale();
            // }); 


            // let planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10); // 生成平面
            // let plane = new THREE.Mesh(planeGeometry, _ShaderMaterial);
            // plane.position.x = 0;
            // plane.position.y = 1;
            // plane.position.z = 0;  
            // scene.add(plane); // 向该场景中添加物体


            addTube();
            animate();
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
            tubeGeometry = new THREE.TubeGeometry(extrudePath, splinePath.length - 1, params.width / 2, params.radiusSegments, params.closed);
            for (let i = 0; i < tubeGeometry.attributes.uv.count; i++) {
                tubeGeometry.attributes.uv.setY(i, tubeGeometry.attributes.uv.getY(i) * 2);
                // tubeGeometry.attributes.uv.setY(i,tubeGeometry.attributes.uv.getY(i)*data.scaleUVy+data.offsetUVy);
            }
            addGeometry(tubeGeometry);
            // setScale();
        }
        function setScale() {
            mesh.scale.set(1, 1, 1);
        }
        function addGeometry(geometry) {
            mesh = new THREE.Mesh(geometry, _ShaderMaterial);
            // const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
            // mesh.add(wireframe);
            group.add(mesh);
        }
        let count = 0;
        let time = 0;
        let lifeTime = 0.02;
        let maxLength = 20;
        let startPos = null;
        let updateId = null;
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

            // map = new THREE.TextureLoader().load(_this.$uploadUVAnimUrl +data.imgPath);
            // map.wrapS = map.wrapT = THREE.RepeatWrapping;
            // uniforms["mainTex"].value = map;
            material.color.set(data.color);
            console.log("in 拖尾 msg = ", scope.id, data);
        }
        let interval_splice = null;
        this.start = function () {
            // console.log("复用 trail ");

            count = 0;
            animate();
            
            interval_splice = setInterval(() => {
                if (splinePath.length > 0) {
                    splinePath.splice(0, 1);
                    addTube();
                }
            }, lifeTime * 1000);
        }
        this.stop = function () {
            clearInterval(interval_splice);
            scope.used = false;
            cancelAnimationFrame(updateId);
            splinePath = [];
            addTube();
        }
        let deltaTime = 1;
        let last = performance.now();
        function animate() {
            updateId = requestAnimationFrame(animate);
            const now = performance.now();
            let delta = (now - last) / 1000;
            // console.log("delta ",delta);
            deltaTime -= delta * 1;
            if (deltaTime <= -2) {
                deltaTime = 1;
            }
            last = now;
            if (_ShaderMaterial) uniforms['u_time'].value = deltaTime;

            let newPos = parent.position.clone();
            // let newPos = _Global.YJ3D.YJController.GetPlayerWorldPos();

            scope.used = true;
            if (newPos.distanceTo(oldPos) > 0.021) {
                // if (splinePath.length == 0) {
                //     startPos = newPos.clone();
                //     splinePath.unshift(new THREE.Vector3(0, 0, 0));
                // } else {
                //     let _newPos = newPos.clone().add(startPos);
                //     splinePath.unshift(_newPos);
                //     console.log(startPos, _newPos);
                // } 
                splinePath.push(newPos);
                if (splinePath.length > maxLength) {
                    splinePath.splice(0, 1);
                }
                addTube();
                oldPos = newPos;

            } else {
            }
            if (splinePath.length > 0) {
                // time += 0.01;
                // if (time >= lifeTime) {
                //     splinePath.splice(0, 1);
                //     addTube();
                //     time = 0;
                // }
            } else {
                count += 1;
                if (count >= 30) {
                    scope.stop(); 
                }
            }
            


        }
        Init();
    }
}

export { YJTrailRenderer };