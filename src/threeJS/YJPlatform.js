

import * as THREE from 'three';

//可移动平台

class YJPlatform {
	constructor(_this, scene, startPos, endPos,id,type) {

		let scope = this;

		// let id = "platform001";
		// let type = "offsetTime"; // 同步类型为 offsetTime ，表示接收服务器统一的偏移时间来自行同步。
		// let type = "platform"; 

		this.GetModel = () => {
			return group;
		}
		function CreateTigger(parent) {

			const go = new THREE.BoxGeometry(1, 1, 1);
			const mat = new THREE.MeshBasicMaterial(
				{
					transparent: true,
					alphaTest: true,
					opacity: 0.3,
				}
			);
			let plane = new THREE.Mesh(go, mat);
			// plane.add(new THREE.AxesHelper(1));

			// group.add(plane);
			parent.add(plane);
			plane.position.set(0,0.5,0); 


			// scene.add(plane);
			// let pos2 = startPos.clone();
			// pos2.y += 0.5;
			// plane.position.copy(pos2);


			_this._YJSceneManager.GetAmmo().CreateTriangeMeshTrigger(plane, plane.scale, id, "platform", scope);

			return plane;
		}
		let plane;
		let trigger;

		let delay = 0;
		let navpath = [];
		let doonce = 0;
		let playerPosition = new THREE.Vector3(0, 0, 0);
		let pos = new THREE.Vector3(0, 0, 0);
		let SPEED = 0.3;

		let direction = "inStart";

		let group = null;
		
		let movingTime = 3000;
		let stayingTime = 3000; 
		let timecount = 0;

		let timeLength  = 0;


		function Init() {

			group = new THREE.Group();
			scene.add(group);

			// console.log(endPos);
			// console.log(startPos);


			const go = new THREE.BoxGeometry(1, 0.1, 1);
			const mat = new THREE.MeshBasicMaterial();
			plane = new THREE.Mesh(go, mat);
			group.add(plane);
			plane.position.copy(startPos);

			// group.add(plane);

			// group.add(new THREE.AxesHelper(1));
			// _this._YJSceneManager.GetAmmo().CreateTriangeMeshCollider(plane);

			trigger = CreateTigger(plane);

			let offset = new THREE.Vector3(endPos.x-startPos.x,endPos.y-startPos.y,endPos.z-startPos.z) ;
			startPos =  new THREE.Vector3(0, 0, 0);
			endPos = offset.clone();

			
			// 1米/3秒 的 速度为 0.3
			SPEED = startPos.distanceTo(endPos)/(movingTime/1000);
			timecount = parseInt(stayingTime/30); 
			// console.log(" 移动速度 和 停留时间  ",SPEED,timecount);

			playerPosition = startPos.clone();

			// navpath.push(endPos.clone());
// 
			GetTimeOffset(new Date().getTime() - 1675586194683);

			render();

		}
		let times = 0;
		// 用服务器统一的偏移时间来计算同步
		function GetTimeOffset(offsetTime) {
			

			// var g = new Date().getTime(); //1675586194683
			// let offsetTime = g - 1675586194683;
			// console.log(offsetTime);

			let yu = offsetTime % (movingTime*2+stayingTime*2);
			// console.log(yu);
			// let 

			let _startPos = startPos.clone();
			let _endPos = endPos.clone();

			let targetPos = endPos.clone();
			let state = "";
			if (yu < stayingTime) {
				delay = yu;
				pos = _startPos;
				direction = "inStart";
				state = "起始位置等待";
			}
			if (yu >= stayingTime && yu < (stayingTime+movingTime)) {
				delay = 0;
				pos = _startPos.lerp(_endPos, (yu - stayingTime) / movingTime);
				state = "从起始位置 正在移动 ";
				// direction = "inStartToEnd";
			}
			if (yu >= (stayingTime+movingTime) && yu < (stayingTime*2+movingTime )) {
				delay = yu - (stayingTime+movingTime);
				pos = _endPos;
				state = "在结束位置等待";
				direction = "inEnd";
			}
			if (yu >= (stayingTime*2+movingTime )) {
				delay = 0;
				pos = _endPos.lerp(_startPos, (yu - (stayingTime*2+movingTime )) / movingTime);
				state = "从结束位置 正在移动";
				// direction = "inEndToStart";
			}


			// if(times==10){
			// 	playerPosition = pos.clone();
			// 	group.position.copy(pos);
			// 	console.log(" 同步 ",direction);
			// }
			
			// if(times<3){
			// 	playerPosition = pos.clone();
			// 	group.position.copy(pos);
			// 	times++;
			// }else{
			// 	// return;
			// }
			// timeNum = parseInt(delay);
			// if (timeNum == 0) {

			// }else{

			// }



			if (navpath.length >= 1) {
				for (let i = 0; i < navpath.length; i++) {
					navpath.shift();
				}
			}

			if (direction == "inStart") {
				navpath.push(endPos.clone());
			}
			if (direction == "inEnd") {
				navpath.push(startPos.clone());
			}

			// playerPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
			// plane.position.copy(playerPosition);

			// console.log(delay, timeLength, direction, state);

			// setTimeout(() => {
			// 	navpath.push(targetPos);
			// }, delay);
		}
		function GetTimeOffset2(offsetTime) {
			// return;

			// var g = new Date().getTime(); //1675586194683
			// let offsetTime = g - 1675586194683;
			// console.log(offsetTime);

			let yu = offsetTime % (3000 * 4);
			// console.log(yu);
			// let 

			let _startPos = startPos.clone();
			let _endPos = endPos.clone();

			let targetPos = endPos.clone();
			let state = "";
			if (yu < 3000) {
				delay = yu;
				timeLength = 3000;
				pos = _startPos;
				direction = "inStart";
				state = "起始位置等待";
			}
			if (yu >= 3000 && yu < 6000) {
				delay = 0;
				timeLength = yu - 3000;
				pos = _startPos.lerp(_endPos, (yu - 3000) / 3000);
				state = "从起始位置 正在移动 ";
			}
			if (yu >= 6000 && yu < 9000) {
				delay = yu - 6000;
				targetPos = _startPos;
				timeLength = 3000;
				pos = _endPos;
				state = "在结束位置等待";
				direction = "inEnd";
			}
			if (yu >= 9000) {
				delay = 0;
				targetPos = _startPos;
				timeLength = yu - 9000;
				pos = _endPos.lerp(_startPos, (yu - 9000) / 3000);
				state = "从结束位置 正在移动";
			}

			delay /= 300;
			// timeNum = parseInt(delay);
			// if (timeNum == 0) {

			// }else{

			// }


			if (navpath.length >= 1) {
				navpath.shift();
			}

			if (direction == "inStart") {
				navpath.push(endPos.clone());
			}
			if (direction == "inEnd") {
				navpath.push(startPos.clone());
			}

			// playerPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
			// plane.position.copy(playerPosition);

			// console.log(delay, timeLength, direction, state);

			// setTimeout(() => {
			// 	navpath.push(targetPos);
			// }, delay);
		}
		this.initState = function () {
			return;
			direction = "inStart";
			plane.position.copy(pos);
			playerPosition = pos.clone();
			navpath.push(endPos.clone());
		}


		let inStartCount, inStartToEndCount, inEndCount, inEndToStartCount;
		let timeNum = 0;

		let dyncTimes = 0;
		//#region 同步
		this.SetState = function (state) {
			// return;
			GetTimeOffset(state.offsetTime,state.times); return;

			console.log("接收到同步 platform ", state);
			inStartCount = state.inStartCount;
			inStartToEndCount = state.inStartToEndCount;
			inEndCount = state.inEndCount;
			inEndToStartCount = state.inEndToStartCount;
			timecount = state.timecount;
			timeNum = state.timeNum;

			direction = state.direction;


			if (navpath.length >= 1) {
				navpath.shift();
			}

			if (direction == "inStartToEnd") {
				navpath.push(endPos.clone());
			}
			if (direction == "inEndToStart") {
				navpath.push(startPos.clone());
			}

			return;

			if (direction != state.direction) {
				if (direction == "inStartToEnd" || direction == "inEndToStart") {
					if (navpath.length >= 1) {
						navpath.shift();
					}

					let _startPos = startPos.clone();
					let _endPos = endPos.clone();

					let pos = startPos.clone();

					if (direction == "inStartToEnd") {
						pos = _startPos.lerp(_endPos, timeNum / timecount);
						navpath.push(endPos.clone());
					}
					if (direction == "inEndToStart") {
						pos = _endPos.lerp(_startPos, timeNum / timecount);
						navpath.push(startPos.clone());
					}

					playerPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
					plane.position.copy(playerPosition);

				}

				direction = state.direction;

			}

			if (dyncTimes > 5) { return; } dyncTimes++;

			return;
			// console.log("=====接收到 升降台状态", state);
		}

		// 主控玩家发送同步激活
		this.SendActive = function () {
			SendDync();
		}
		function SendDync() {
			return;
			let state = {};
			state.direction = direction;
			state.pos = playerPosition;
			state.timecount = timecount;

			// console.log(" === 发送 升降台状态 ", state);
			_this.$parent.$parent.$refs.YJDync._YJDyncManager.SendSceneState(id, type, state);

		}
		//#endregion


		function render() {
			requestAnimationFrame(render);
			tick();

		}

		let startTime;
		let endTime;


		function tick() {

			// console.log("dt ",dt);

			// console.log(timeNum, direction,navpath.length);
 

			if (!(navpath || []).length) {
				timeNum++;
				if (timeNum >= timecount) {
					if (direction == "inStart") {
						navpath.push(endPos.clone());
					} 
					if (direction == "inEnd") {
						navpath.push(startPos.clone());
					}
					// timeNum = 0;
				} 
				// console.log("停留时间 ",timeNum);
				return;
			}

			if (doonce < 1) {
				startTime = new Date().getTime();
				doonce++;
				timeNum=0;
			}
			let targetPosition = navpath[0];

			const velocity = targetPosition.clone().sub(playerPosition);


			if (velocity.lengthSq() > 0.05 * 0.05) {
				velocity.normalize();
				// Move player to target
				playerPosition.add(velocity.multiplyScalar(0.015 * SPEED));

				let pos = playerPosition.clone();
				group.position.copy(pos);
				// plane.position.copy(pos);

				// _this._YJSceneManager.GetAmmo().SetColliderPos(plane,pos);


				// let pos2 = pos.clone();
				// pos2.y += 0.5;
				// _this._YJSceneManager.GetAmmo().SetColliderPos(trigger, pos2);

			} else {
				// Remove node from the path we calculated
				endTime = new Date().getTime();

				// console.log((endTime - startTime));
				navpath.shift();
				doonce = 0;
				if (navpath.length == 0) {
					if (direction == "inStart") {
						direction = "inEnd";
					} else if (direction == "inEnd") {
						direction = "inStart";
					}
				}
			}
		}
		//#region 
		//#endregion

		Init();
	}
}


export { YJPlatform };