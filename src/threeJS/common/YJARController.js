import * as THREE from "three";

import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import TWEEN from '@tweenjs/tween.js';

class YJARController {
	constructor(scene, renderer, camera, document, _this, anchorCallback) {
		// let container;
		// let camera, scene, renderer;
		let controller;

		let reticle;

		let hitTestSource = null;
		let hitTestSourceRequested = false;


		init();
		animate();



		//初始化角色根物体

		var playerParent = null;

		const initPlayerParent=()=>{
			let size = 0.1;
			let cubeGeometry = new THREE.BoxGeometry(size, size, size);
			let cubeMaterial = new THREE.MeshLambertMaterial({
			  color: 0xffffff,
			  opacity: 0,
			  transparent: true
			});
	  
	  
			playerParent = new THREE.Mesh(cubeGeometry, cubeMaterial);
			// playerParent.position.set(camera.position.x, camera.position.y, camera.position.z);
			playerParent.position.set(0, 0, 0);
			scene.add(playerParent);

		}
		initPlayerParent();
		//---------移动碰撞，让物体碰到障碍物停止移动 开始----------

		var canMoveForward = true;
		var canMoveBack = true;
		var canMoveLeft = true;
		var canMoveRight = true;
		var leftObj, rightObj, forwardObj, backObj;
		let raycaster;
		var hit_collider;
		var offsetY = new THREE.Vector3(0, 0.1, 0);
		//创建碰撞检查
		const CreateRaycastBox = () => {

			var size = 0.1;
			var geometry = new THREE.BoxGeometry(size, size, size);//创建一个立方体
			let cubeMaterial = new THREE.MeshLambertMaterial({
				color: 0xffffff,
				opacity: 0,
				transparent: true
			});

			var material_left = new THREE.MeshBasicMaterial({ color: 0xff0000 });//左 红
			var material_right = new THREE.MeshBasicMaterial({ color: 0x00ff00 });//右 绿
			var material_forward = new THREE.MeshBasicMaterial({ color: 0x666666 });//前 黑
			var material_back = new THREE.MeshBasicMaterial({ color: 0xffffff });//后 白

			// leftObj = new THREE.Mesh(geometry, material_left);//网格绘制
			// rightObj = new THREE.Mesh(geometry, material_right);//网格绘制
			// forwardObj = new THREE.Mesh(geometry, material_forward);//网格绘制
			// backObj = new THREE.Mesh(geometry, material_back);//网格绘制

			leftObj = new THREE.Mesh(geometry, cubeMaterial);//网格绘制
			rightObj = new THREE.Mesh(geometry, cubeMaterial);//网格绘制
			forwardObj = new THREE.Mesh(geometry, cubeMaterial);//网格绘制
			backObj = new THREE.Mesh(geometry, cubeMaterial);//网格绘制

			forwardObj = new THREE.Group();

			leftObj.name = "leftObj";
			rightObj.name = "rightObj";
			forwardObj.name = "forwardObj";
			backObj.name = "backObj";


			playerParent.add(leftObj);
			playerParent.add(rightObj);
			playerParent.add(forwardObj);
			playerParent.add(backObj);

			var heightY = 0.2;
			leftObj.position.set(0, heightY, 0);
			rightObj.position.set(0, heightY, 0);
			forwardObj.position.set(0, heightY, 0);
			backObj.position.set(0, heightY, 0);

			var length = 1;
			var rota = 1.55;
			var rota2 = 0.0;
			leftObj.rotateY(rota2);
			rightObj.rotateY(rota2);
			leftObj.translateZ(-length);
			rightObj.translateZ(length);


			forwardObj.rotateY(rota);
			backObj.rotateY(rota);

			forwardObj.translateZ(length);
			backObj.translateZ(-length);

			raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -0.01, 0), 0, 0.1);

		}
		//前后左右射线检测来做碰撞体
		function Raycaster_CreateCube(fromObj, toObj, d) {

			var fromPos = new THREE.Vector3(fromObj.position.x, fromObj.position.y + offsetY.y, fromObj.position.z);
			var toPos = new THREE.Vector3(fromObj.position.x, fromObj.position.y, fromObj.position.z);

			toPos = toObj.getWorldDirection(new THREE.Vector3());
			toPos.x *= d;
			toPos.y *= d;
			toPos.z *= d;


			// var raycaster_collider = new THREE.Raycaster(fromPos, toPos, 0, 8);
			var raycaster_collider = new THREE.Raycaster(fromPos, toPos, 0, 0.4);

			//只检测pointParent物体的子物体
			var intersects_collider = raycaster_collider.intersectObjects(_this.colliderList, true);
			if (intersects_collider.length > 0) {
				hit_collider = intersects_collider[0].object;
				// console.log(toObj.name +" 碰撞 "+ intersects_collider.length +"  "+ hit_collider.name + "  " );
				// console.log(toObj.name +" 碰撞 "+ intersects_collider.length +"  "+ hit_collider.tag + "  " );
				if (toObj.name == "forwardObj" && hit_collider.name.indexOf("door") > -1) {
					//碰到可交互物体
					inJiaohuArea = true;
					_this.ChangeTip(inJiaohuArea);


					return false

				}

				inJiaohuArea = false;
				_this.ChangeTip(inJiaohuArea);

				return false;
			} else {
				//YJdebug( toObj.name + "    未检测到物体 "  );
				if (toObj.name == "forwardObj") {
					inJiaohuArea = false;
					_this.ChangeTip(inJiaohuArea);
				}
			}
			return true;

		}
		CreateRaycastBox();

		//---------移动碰撞，让物体碰到障碍物停止移动 结束----------



		//----页面传入值，控制角色。 如摇杆控制移动，按钮控制跳跃，按钮控制交互碰撞物体  开始-----------
		
		var movingTween = null;
		var isMoving = false;

		var joystickSpeed = 0.05;
		var laterStopJoystick = null;
		var inKeyboardOrJoystick = false;
		var pai = Math.PI;

		//摇杆控制移动
		this.MoveByJoystickAxis = (x, y) => {

			inKeyboardOrJoystick = true;
			isMoving = true;

			if (y > 0) {
				_playerY = 2 * pai + (x - 1) * pai / 2;
			} else {
				_playerY = 2 * pai - (x - 1) * pai / 2;
			}
			_player.rotation.set(0, _playerY, 0);
			if (laterStopJoystick != null) {
				clearTimeout(laterStopJoystick);
			}
			laterStopJoystick = setTimeout(() => {
				isMoving = false;
				inKeyboardOrJoystick = false;

			}, 100);
			StopMovingTween();


			var moveX = -y * joystickSpeed;
			var moveY = x * joystickSpeed;

			if (moveX > 0 && canMoveForward) {
				playerParent.translateX(moveX);
			}
			if (moveX < 0 && canMoveBack) {
				playerParent.translateX(moveX);
			}
			if (moveY < 0 && canMoveLeft) {
				playerParent.translateZ(moveY);
			}
			if (moveY > 0 && canMoveRight) {
				playerParent.translateZ(moveY);
			}



			// playerParent.translateX(-y*joystickSpeed);
			// playerParent.translateZ(x*joystickSpeed);




		}

		//停止点击地面移动的tween
		function StopMovingTween() {
			if (movingTween != null) {
				movingTween.stop();
				isMoving = false;
				movingTween = null;
			}
		}

		//界面跳跃按钮传入
		this.ClickJump = function () {
			if (canJump === true) {
				Jump();
			}
		}
		var inJiaohuArea = false;

		//点击界面按钮 或 按F键交互可交互的物体，比如开关门
		this.ClickInteractive = function () {
			if (inJiaohuArea) {
				if (hit_collider.name.indexOf("door") > -1) {
					var item = hit_collider;
					for (let j = 0; j < 10; j++) {
						// console.log(item);

						if (item.tag != "door") {
							item = item.parent;
						} else {
							// console.log("查到父物体为door的物体 ");

							for (let i = 0; i < _this.sceneModels.length; i++) {
								var sceneModel = _this.sceneModels[i];
								if (sceneModel.id == item.name) {
									sceneModel.model.PlayAnim();
									// console.log("碰到 door,查询其动画 ");
									continue;
								}
							}
							break;

						}

					}
					// console.log(hit_collider);
					// console.log(hit_collider.parent);
					// console.log(hit_collider.parent.parent);
					// console.log(hit_collider.parent.parent.parent);
					// console.log(hit_collider.parent.parent.parent.parent);
					// console.log(hit_collider.parent.parent.parent.parent.parent);
					// console.log(hit_collider.parent.parent.parent.parent.parent.parent);

				}
				inJiaohuArea = false;
				_this.ChangeTip(inJiaohuArea);
			}
		}

		//跳跃
		var canJump = true;
		var jump = false;
		var jumpUpValue = new THREE.Vector3(0, 0.5, 0);  //平滑过渡时使用的变量
		var jumpDownValue = new THREE.Vector3(0, 0.09, 0);  //平滑过渡时使用的变量
		var jumpValueZero = new THREE.Vector3(0, 0, 0);  //平滑过渡时使用的变量
		function Jump() {
			jump = true;
			var currentJump = new THREE.Vector3(0, jumpUpValue.y, 0);

			let tween1 = new TWEEN.Tween(currentJump).to(jumpValueZero, 500).easing(TWEEN.Easing.Linear.None)
			let updateTargetPos = () => {
				playerParent.translateY(currentJump.y);
				StopMovingTween();
			}

			tween1.onUpdate(updateTargetPos);
			tween1.start() // 启动动画

			tween1.onComplete(() => {
				jump = false;
				// console.log("tween 动画完成！");
				let tween2 = new TWEEN.Tween(currentJump).to(jumpDownValue, 500).easing(TWEEN.Easing.Linear.None)
				let updateTargetPosDown = () => {
					if (canJump) { return; }
					playerParent.translateY(-currentJump.y);
					StopMovingTween();
				}
				tween2.onUpdate(updateTargetPosDown);
				tween2.start() // 启动动画
			});
		}
		
		
		//----页面传入值，控制角色。 如摇杆控制移动，按钮控制跳跃，按钮控制交互碰撞物体  结束-----------




		//----角色初始化，让角色与控制器绑定，绑定后，控制器控制角色移动 开始-----------


		//角色引用
		var _player = null;
		var _playerY = 0;
		var _YJPlayer = null;
		this.SetPlayer = (yjplayer) => {
		  _YJPlayer = yjplayer;
		}
		//把第三人称角色，添加到控制器中，让控制器控制角色的朝向
		this.SetPlayerToCamTarget = (player) => {
			// console.log(" 添加角色 ");
			_player = player;
			playerParent.add(player);
			player.position.set(0, -0.0, 0);
		}

		//把角色根组合添加到控制器中，让控制器控制角色移动
		this.SetPlayerGroup = (group) => {
			playerParent.add(group);
			group.position.set(0, 0.0, 0);
		}

		this.RemovePlayer = () => {
			console.log(" 删除本地角色 ");
			playerParent.remove(_player);
		}

		//----角色初始化，让角色与控制器绑定，绑定后，控制器控制角色移动 结束-----------


		//----角色移动 刷新 开始---------

		//键盘控制的移动速度
		var actualMoveSpeed = 1;
		let prevTime = performance.now();
		const velocity = new THREE.Vector3();

		function updatePlayer() {

			const time = performance.now();

			TWEEN.update();

			//同步角色动作
			if (_YJPlayer != null) {
				if (!canJump || jump) {
					animName = "jump";
				} else {
					//变换角色朝向
					if (isMoving) {

						animName = "walk";
					} else {
						animName = "idle";
					}
				}
				_YJPlayer.ChangeAnim(animName);
				userData.animName = animName;
				// _this.SetPlayerAnim(animName);



				if (canMoveForward) {
					playerParent.translateX((actualMoveSpeed));
					StopMovingTween();
				}
				if (canMoveBack) {
					playerParent.translateX(-actualMoveSpeed);
					StopMovingTween();
				}

				if (canMoveLeft) {
					playerParent.translateZ(- actualMoveSpeed);
					StopMovingTween();

				}
				if (canMoveRight) {
					playerParent.translateZ(actualMoveSpeed);
					StopMovingTween();

				}

			}


			//碰撞检测 射线检测是否前后左右碰到物体，碰到即不可移动
			canMoveForward = Raycaster_CreateCube(playerParent, forwardObj, 1);
			canMoveBack = Raycaster_CreateCube(playerParent, backObj, -1);
			canMoveLeft = Raycaster_CreateCube(playerParent, leftObj, -1);
			canMoveRight = Raycaster_CreateCube(playerParent, rightObj, 1);

			// console.log(" moveForward = " + this.moveForward + " canMoveForward = w" + canMoveForward );




			//

			raycaster.ray.origin.copy(playerParent.position);
			raycaster.ray.origin.y -= 0.01;
			// raycaster.ray.origin.y -= 10;
			let intersections = raycaster.intersectObjects(scene.children, true);
			// console.log("角色检测地面",intersections);

			const onObject = intersections.length > 0;
			const delta = (time - prevTime) / 1000;
			velocity.y -= 9.8 * delta; // 100.0 = mass
			// velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

			if (onObject === true) {
				velocity.y = Math.max(0, velocity.y);
				if (!canJump) {
					canJump = true;
					jump = false;
				}
			} else {
				if (canJump) {
					canJump = false;
					jump = true;
				}
			}


			playerParent.position.y += (velocity.y * delta); // new behavior
			if (playerParent.position.y < 0) {
				velocity.y = 0;
				playerParent.position.y = 0;
				if (!canJump) {
					canJump = true;
					jump = false;
				}
			}
			prevTime = time;
		}

		//----角色移动 刷新 结束---------

		function getWorldPosition(object) {
			var worldPosition = new THREE.Vector3();
			object.getWorldPosition(worldPosition);
			return worldPosition;
		}

		//---- 本地控制器 向服务器发送角色 位置、旋转、动画名称等数据  开始-----------
		var userData = {
			rotateY:0,
			animName:'idle',
			pos:{x:0,y:0,z:0},
		};

		var oldPos = new THREE.Vector3();
		var oldrotateY = 1;
		var animName = "idle";
		var oldAnimName = "";
		this.updateSend = function () {
			if (_YJPlayer == null || _player == null) {
				return;
			}
			//检查数据变化
			var newPos = getWorldPosition(_player);
			var newrotateY = playerParent.rotation.y + _playerY;

			if (oldrotateY == newrotateY && oldAnimName == animName
				&& oldPos.x == newPos.x && oldPos.y == newPos.y && oldPos.z == newPos.z) {
				return;
			}

			if (oldPos.x != newPos.x || oldPos.y != newPos.y || oldPos.z != newPos.z) {

				// userData.pos =  newPos;
				userData.pos = { x: newPos.x, y: newPos.y, z: newPos.z };
				// userData.pos = [newPos.x, newPos.y, newPos.z];
			}
			userData.rotateY = newrotateY;
			// console.log(" 发送角色数据 ");

			_this.SetUserData(userData);


			oldrotateY = newrotateY;
			oldAnimName = animName;
			oldPos = newPos;

		}
		//---- 本地控制器 向服务器发送角色 位置、旋转、动画名称等数据  结束-----------



		//------------

		function init() {

			camera.position.set(0, 1.6, 0);

			// scene = new THREE.Scene();

			// camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

			const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
			light.position.set(0.5, 1, 0.25);
			scene.add(light);

			//

			renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.xr.enabled = true;
			document.append(renderer.domElement);


			//

			document.append(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

			//

			const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);

			function onSelect() {

				if (reticle.visible) {

					// const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
					// const mesh = new THREE.Mesh( geometry, material );
					// reticle.matrix.decompose( mesh.position, mesh.quaternion, mesh.scale );
					// mesh.scale.y = Math.random() * 2 + 1;
					// scene.add( mesh );

					// let cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
					// let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
					// var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
					// cube.position.setFromMatrixPosition(reticle.matrix);
					// cube.castShadow = true;
					// cube.name = "角色";
					// scene.add(cube);

					//定位完成，传出回调
					anchorCallback();
					// _this.InitSceneManagerAR();
					reticle.visible = false;
				}

			}

			controller = renderer.xr.getController(1);
			controller.addEventListener('select', onSelect);
			scene.add(controller);

			reticle = new THREE.Mesh(
				new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
				new THREE.MeshBasicMaterial()
			);
			reticle.matrixAutoUpdate = false;
			reticle.visible = false;
			scene.add(reticle);
			console.log(" 场景初始化完成 ");

			//

			window.addEventListener('resize', onWindowResize);

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);

		}

		//

		function animate() {

			renderer.setAnimationLoop(render);

		}

		function render(timestamp, frame) {
			updatePlayer();
			if (frame) {

				const referenceSpace = renderer.xr.getReferenceSpace();
				const session = renderer.xr.getSession();

				if (hitTestSourceRequested === false) {

					session.requestReferenceSpace('viewer').then(function (referenceSpace) {

						session.requestHitTestSource({ space: referenceSpace }).then(function (source) {

							hitTestSource = source;

						});

					});

					session.addEventListener('end', function () {

						hitTestSourceRequested = false;
						hitTestSource = null;

					});

					hitTestSourceRequested = true;

				}

				if (hitTestSource) {

					const hitTestResults = frame.getHitTestResults(hitTestSource);

					if (hitTestResults.length) {

						const hit = hitTestResults[0];

						reticle.visible = true;
						reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);

					} else {

						reticle.visible = false;

					}

				}

			}
			renderer.render(scene, camera);
		}

	}
}

export { YJARController };