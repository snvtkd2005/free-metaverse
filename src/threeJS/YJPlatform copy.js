

import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import TWEEN from '@tweenjs/tween.js';

//可移动平台

class YJPlatform {
	constructor(_this, scene, pos, startPos, endPos, mirrormesh) {


		let scope = this;

		this.GetModel = () => {
			return plane;
		}
		function CreateTigger(parent) {

			const go = new THREE.BoxGeometry(1, 1, 1);
			const mat = new THREE.MeshBasicMaterial(
				{
					transparent: true,
					opacity: 0.3,
				}
			);
			let plane = new THREE.Mesh(go, mat);
			let pos2 = pos.clone();
			pos2.y += 0.5;
			plane.position.copy(pos2);
			// parent.add(plane);

			_Global.YJ3D._YJSceneManager.GetAmmo().createBoxTrigger2(plane, null, "", "platform", scope);

			return plane;
		}
		let plane;
		let trigger;

		let navpath = [];
		let doonce = 0;
		const clock = new THREE.Clock();
		let playerPosition = new THREE.Vector3(0, 0, 0);
		const SPEED = 0.3;

		let direction = "inEnd";
		let delay = 0;

		function Init() {


			const go = new THREE.BoxGeometry(1, 0.1, 1);
			const mat = new THREE.MeshBasicMaterial();
			plane = new THREE.Mesh(go, mat);
			plane.position.copy(pos);
			scene.add(plane);

			_Global.YJ3D._YJSceneManager.GetAmmo().CreateTriangeMeshCollider(plane);

			trigger = CreateTigger(plane);


			// var g = new Date().getTime(); //1675586194683
			// let offsetTime = g - 1675586194683;
			// console.log(g, offsetTime);

			// let yu = offsetTime % (3000 * 4);
			// console.log(yu);
			// // let 
			// let timeLength = 0;

			// let _startPos = startPos.clone();
			// let _endPos = endPos.clone();


			// let targetPos = endPos.clone();
			// let state = "";
			// if (yu < 3000) {
			// 	delay = yu;
			// 	timeLength = 3000;
			// 	pos = _startPos;

			// 	state = "起始位置等待";
			// }
			// if (yu >= 3000 && yu < 6000) {
			// 	delay = 0;
			// 	timeLength = yu - 3000;
			// 	pos = _startPos.lerp(_endPos, (yu - 3000) / 3000);
			// 	state = "从起始位置 正在移动 ";
			// }
			// if (yu >= 6000 && yu < 9000) {
			// 	delay = yu - 6000;
			// 	targetPos = _startPos;
			// 	timeLength = 3000;
			// 	pos = _endPos;
			// 	direction = "inStart";
			// 	state = "在结束位置等待";
			// }
			// if (yu >= 9000) {
			// 	delay = 0;
			// 	targetPos = _startPos;
			// 	timeLength = yu - 9000;
			// 	pos = _endPos.lerp(_startPos, (yu - 9000) / 3000);
			// 	direction = "inStart";
			// 	state = "从结束位置 正在移动";
			// }

			// console.log(delay, timeLength, direction, state);

			// setTimeout(() => {
			// 	navpath.push(targetPos);
			// }, delay);



			_this.$parent.$parent._YJGameManager_DyncScene.addDyncSceneModel("platform001", "升降台", scope);


			render();

		}
		this.initState = function(){
			direction = "inStart";
			plane.position.copy(pos);
			playerPosition = pos.clone();
			navpath.push(endPos.clone());
		}
		this.SetState = function (state) {

			for (let i = 0; i < navpath.length; i++) {
				navpath.shift();
			}

			let pos = state.pos;
			playerPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
			direction = state.direction;
			timecount = state.timecount;

			plane.position.copy(playerPosition);

			if (timecount == 0) {

				if (direction == "inStart") {
					navpath.push(endPos.clone());
				} else {
					navpath.push(startPos.clone());
				}
			}
			console.log("=====接收到 升降台状态", state);
		}
		this.SendActive = function () {
			SendDync();
		}
		function SendDync() {
			let state = {};
			state.direction = direction;
			state.delay = delay;
			state.pos = playerPosition;
			state.timecount = timecount;

			console.log(" === 发送 升降台状态 ", state);
			_this.$parent.$parent.$refs.YJDync._YJDyncManager.SendSceneState("platform001", "升降台", state);

		}
		function baseTween() {
			if (timecount > 100) {
				if (direction == "inStart") {
					navpath.push(endPos.clone());
				} else {
					navpath.push(startPos.clone());
				}
				return;
			}
			setTimeout(() => {
				if (direction == "inStart") {
					navpath.push(endPos.clone());
				} else {
					navpath.push(startPos.clone());
				}
			}, 3000);

		}
		function render() {
			requestAnimationFrame(render);
			tick(clock.getDelta());

		}

		let startTime;
		let endTime;

		let timecount = 0;
		function tick(dt) {
			if (!(navpath || []).length) {
				timecount++;

				if (timecount > 100) {
					if (direction == "inStart") {
						navpath.push(endPos.clone());
					} else {
						navpath.push(startPos.clone());
					}
					return;
				}
				return;
			}
			if (doonce < 1) {
				startTime = new Date().getTime();
				doonce++;
				timecount = 0;
			}
			let targetPosition = navpath[0];
			const velocity = targetPosition.clone().sub(playerPosition);


			if (velocity.lengthSq() > 0.05 * 0.05) {
				velocity.normalize();
				// Move player to target
				playerPosition.add(velocity.multiplyScalar(dt * SPEED));

				let pos = playerPosition.clone();
				plane.position.copy(pos);

				// _Global.YJ3D._YJSceneManager.GetAmmo().SetColliderPos(plane,pos);

				 
				let pos2 = pos.clone();
				pos2.y += 0.5;
				_Global.YJ3D._YJSceneManager.GetAmmo().SetColliderPos(trigger, pos2);

			} else {
				// Remove node from the path we calculated
				endTime = new Date().getTime();

				// console.log((endTime-startTime));
				navpath.shift();
				doonce = 0;
				if (navpath.length == 0) {

					if (direction == "inStart") {
						direction = "inEnd";
					} else {
						direction = "inStart";
					}
					// baseTween();
				}
			}
		}
		//#region 
		//#endregion

		Init();
	}
}


export { YJPlatform };