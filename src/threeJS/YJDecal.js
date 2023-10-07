import * as THREE from "three";

import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "three/examples/jsm/animation/MMDAnimationHelper.js";

import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

// 加载MMD 模型和动画
class YJDecal {
  constructor(_this, scene,camera, mesh) {
    
			// let mesh;
			let raycaster;
			let line;
      
			const intersection = {
				intersects: false,
				point: new THREE.Vector3(),
				normal: new THREE.Vector3()
			};
			const mouse = new THREE.Vector2();
			const intersects = [];

			const textureLoader = new THREE.TextureLoader();
			// const decalDiffuse = textureLoader.load(_this.$publicUrl + 'textures/decal/decal-diffuse.png' );
			// const decalNormal = textureLoader.load(_this.$publicUrl + 'textures/decal/decal-normal.jpg' );
			const decalDiffuse = textureLoader.load(_this.$publicUrl + 'images/player/uv.jpg' );
			const decalNormal = textureLoader.load(_this.$publicUrl + 'images/player/uv.jpg' );
      // "images/player/uv.jpg"
			const decalMaterial = new THREE.MeshPhongMaterial( {
				specular: 0x444444,
				map: decalDiffuse,
				normalMap: decalNormal,
				normalScale: new THREE.Vector2( 1, 1 ),
				shininess: 30,
				transparent: true,
				depthTest: true,
				depthWrite: false,
				polygonOffset: true,
				polygonOffsetFactor: - 4,
				wireframe: false
			} );

			const decals = [];
			let mouseHelper;
			const position = new THREE.Vector3();
			const orientation = new THREE.Euler();
			const size = new THREE.Vector3( 10, 10, 10 );
      
			const params = {
				minScale: 0.05,
				maxScale: 0.1,
				rotate: true,
				clear: function () {
					removeDecals();
				}
			};
      function init(){
        const geometry = new THREE.BufferGeometry();
				geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

				line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
				scene.add( line );

        raycaster = new THREE.Raycaster();

				mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
				mouseHelper.visible = false;
				scene.add( mouseHelper );

        
				let moved = false;
        window.addEventListener( 'pointerdown', function () {

					moved = false;

				} );

				window.addEventListener( 'pointerup', function ( event ) {

					if ( moved === false ) {

						checkIntersection( event.clientX, event.clientY );

						if ( intersection.intersects ) shoot();

					}

				} );

				window.addEventListener( 'pointermove', onPointerMove );

				function onPointerMove( event ) {

					if ( event.isPrimary ) {

						checkIntersection( event.clientX, event.clientY );

					}

				}

				function checkIntersection( x, y ) {

					if ( mesh === undefined ) return;

					mouse.x = ( x / window.innerWidth ) * 2 - 1;
					mouse.y = - ( y / window.innerHeight ) * 2 + 1;

					raycaster.setFromCamera( mouse, camera );
					raycaster.intersectObject( mesh, false, intersects );

					if ( intersects.length > 0 ) {

						const p = intersects[ 0 ].point;
						mouseHelper.position.copy( p );
						intersection.point.copy( p );

						const n = intersects[ 0 ].face.normal.clone();
						n.transformDirection( mesh.matrixWorld );
						n.multiplyScalar( 10 );
						n.add( intersects[ 0 ].point );

						intersection.normal.copy( intersects[ 0 ].face.normal );
						mouseHelper.lookAt( n );

						const positions = line.geometry.attributes.position;
						positions.setXYZ( 0, p.x, p.y, p.z );
						positions.setXYZ( 1, n.x, n.y, n.z );
						positions.needsUpdate = true;

						intersection.intersects = true;

						intersects.length = 0;

					} else {

						intersection.intersects = false;

					}

				}
      }
      
			function shoot() {
        console.log("创建贴花");
				position.copy( intersection.point );
        // position.y += 1;
				orientation.copy( mouseHelper.rotation );

				if ( params.rotate ) orientation.z = Math.random() * 2 * Math.PI;

				const scale = params.minScale + Math.random() * ( params.maxScale - params.minScale );
				size.set( scale, scale, scale );

				const material = decalMaterial.clone();
				material.color.setHex( Math.random() * 0xffffff );

				const m = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );

				decals.push( m );
				// mesh.parent.add( m );
				scene.add( m );

			}

			function removeDecals() {

				decals.forEach( function ( d ) {

					scene.remove( d );

				} );

				decals.length = 0;

			}
      init();
  }
}

export { YJDecal };