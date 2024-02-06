


// https://socketio.p2hp.com/docs/v4/server-instance/   socketio文档

// import SocketIO from 'socket.io-client';
// import { nextTick } from 'vue';
// import VueSocketio from 'vue-socket.io';
import * as world_configs from './socket_bilibili/index';

class YJsocketIO {
	constructor(that) {
		let scope = this;
		var isClosed = true;
		var wsClient = null;
		let socketListener, socketEmitter;
		let heartCount = 0;

		let venueId = 1;
		let worldId = "11";
		let mem_userInfo = { 'UID': "元宇宙用户265_1111" };
		let isChangeRoom = false;
		let phoneNo = "18616285155";
		let sessionId = "S1000af2be65d14ae5a8a8febfe31b6bc5733x";
		this.Init = () => {
			InitFn();
		}
		function InitFn() {
 
			//创建 wsClient 的一个实例  
			let userInfo2 = localStorage.getItem('userInfo');
			if (userInfo2 != undefined) {
				let userInfo = JSON.parse(userInfo2);
				mem_userInfo.UID = userInfo.userId;
				that.userName = userInfo.nickName;
				phoneNo = userInfo.phoneNumber;

				// sessionId = userInfo.sessionId;

				console.log("获取 userInfo ", userInfo);
			}

			if (_Global.userInfo != undefined) {
				let userInfo = _Global.userInfo;
				mem_userInfo.UID = userInfo.userId;
				that.userName = userInfo.nickName;
				phoneNo = userInfo.phoneNumber;
				sessionId = userInfo.sessionId;
				// console.log("获取 userInfo ",userInfo);
			}


			// mem_userInfo.UID = "元宇宙用户265_1111";
			// mem_userInfo.UID =  that.userName;
			// that.userName = "元宇宙用户265_1111";
			// let paramMap = getURLParams(window.location.search);
			// console.log(" paramMap = ",paramMap);
			// console.log(" that.userName = ", that.userName);
			// wsClient =  new WebSocket("ws://" + document.domain +":9090/ping?token=" + paramMap['token']);
			// wsClient =  new WebSocket("ws://" + document.domain +":9090/ping?token=" + paramMap['token']);

			wsClient = new WebSocket("ws://43.138.163.92:9090/ping?uid=" + mem_userInfo.UID
				+ "&session_id=" + sessionId
			);

			wsClient.onopen = function (evt) {
				console.log("Connection opened ...");
				isClosed = false;
				isChangeRoom = false;
				login();
			};

			wsClient.onmessage = function (evt) {
				// console.log("Received Message: " + evt.data);
				receiveMsgGO(evt.data);
			};

			wsClient.onclose = function (evt) {
				console.log("Connection closed.");
				isClosed = true;
				if (!isChangeRoom) {
					that.CloseWebsocket();

					setTimeout(() => {
						InitFn();
					}, 3000);
				}
			};

			// wsClient.registerCallBack('productivity',receiveMsgFn);

		}
		function login(ret) {
			// console.log("登录");
			// console.log(mem_userInfo);
			//return;
			//登录socket
			//console.log(world_configs.DOWNSTREAM_AVATAR_LOGIN_ACK);
			let renderData = JSON.stringify(that.user);
			// 用户登录
			// console.error("用户登录数据", renderData);
			// let hallType = that.user.roomName == "login" ? 0 : that.user.roomName == "meeting" ? 1 : 2;
			
			let hallType = 0;

			console.error("加载房间", that.user.roomName, hallType, _Global.arcId);

			sendTo({
				"avatarId": mem_userInfo.UID,
				"msgType": "UPSTREAM_AVATAR_LOGIN",
				"avatarLogin": {
					"venueId": venueId,
					"avatarRenderData": renderData,
					"worldId": worldId,
					"hallType": hallType,
					"phoneNo": phoneNo,
					"actId":  _Global.arcId
				}
			});
		}
		function sendTo(data) {
			if (isClosed) { return; }

			// let content = $("#inp_send").val();
			var strValue = JSON.stringify(data);
			// console.log("send:" + strValue);
			wsClient.send(strValue);
		}

		function getURLParams(url) {
			let urlStr = url.split('?')[1];
			let paramMap = {};
			let paramArray = urlStr.split('&');
			for (let i = 0; i < paramArray.length; i++) {
				let pair = paramArray[i].split('=');
				paramMap[pair[0]] = pair[1];
			}
			return paramMap
		}
		function receiveMsgGO(message) {

			console.log("Received Message: " + message);
			let data = JSON.parse(message);
			let msg = {};
			let surrounding_avatar_locations;
			switch (data.Msg.msg_type) {
				case world_configs.DOWNSTREAM_AVATAR_LOGIN_ACK:
					//登录返回数据包
					// mem_userInfo.UID = String(data.Msg.MsgOneof.AvatarLoginAck.init_location.avatar_id);
					console.log(mem_userInfo);
					worldId = data.Msg.MsgOneof.AvatarLoginAck.init_location.map_position.world_id;
					that.addSelf(mem_userInfo.UID);

					//附近的人
					surrounding_avatar_locations = data.Msg.MsgOneof.AvatarLoginAck.surrounding_avatar_locations;
					msg = {};
					msg.type = "刷新用户";
					msg.roomName = worldId;
					msg.message = [];
					if (surrounding_avatar_locations && surrounding_avatar_locations.length > 0) {
						surrounding_avatar_locations.forEach(item => {
							if (item.avatar_render_data != undefined) {
								let user = {};
								user.id = item.avatar_id;
								user.platform = "pcweb";
								let rs = JSON.parse(item.avatar_render_data);
								user.userName = rs.userName;
								user.userData = rs.userData;
								user.playerData = rs.playerData;
								user.roomName = rs.roomName;
								// user.roomName = item.map_position.world_id;

								if (user.userData != undefined) {
									msg.message.push(user);
								}
							}
						})
					}
					that.addPlayer((msg));

					//心跳
					heartBeat();
					break;
				case world_configs.DOWNSTREAM_AVATAR_MOVE:
					let location = data.Msg.MsgOneof.AvatarMove.location;
					msg = {};
					msg.type = "更新位置";
					// msg.roomName = location.map_position.world_id;
					msg.id = location.avatar_id;
					let rs = JSON.parse(location.avatar_render_data);
					msg.user = rs;
					that.UpdatePlayerState(msg);
					//位置变化
					// console.log('位置变化', msg);
					break;
				case world_configs.DOWNSTREAM_AVATAR_USER_LOGIN:
					//有其他人登录
					console.log(data.Msg.MsgOneof.AvatarLoginNotify.location.avatar_id, '登录系统');
					let item = data.Msg.MsgOneof.AvatarLoginNotify.location;
					msg = {};
					msg.type = "用户加入";
					msg.roomName = worldId;
					msg.id = item.avatar_id;
					msg.platform = "pcweb";
					msg.userName = item.avatar_id;
					msg.roomName = item.map_position.world_id;
					let user = {};
					user.id = item.avatar_id;
					user.platform = "pcweb";

					let rs2 = JSON.parse(item.avatar_render_data);
					msg.userName = rs2.userName;
					user.userName = rs2.userName;
					user.userData = rs2.userData;
					user.playerData = rs2.playerData;
					user.roomName = rs2.roomName;
					// user.roomName = item.map_position.world_id;
					msg.user = user;
					that.addPlayer((msg));

					break;
				case world_configs.DOWNSTREAM_AVATAR_DISAPPEAR:
					//有其他人 角色消失(从范围内消失)
					console.log(data.Msg.MsgOneof.AvatarDisappear.avatar_ids.length, '角色消失');
					let avatar_ids = data.Msg.MsgOneof.AvatarDisappear.avatar_ids;

					if (avatar_ids && avatar_ids.length > 0) {
						avatar_ids.forEach(item => {
							msg = {};
							msg.type = "用户离开";
							msg.roomName = worldId;
							msg.id = item;
							that.addPlayer((msg));

						})
					}
					break;
				case world_configs.DOWNSTREAM_AVATAR_APPEAR:
					//有其他人 角色出现(从范围内出现)
					console.log(data.Msg.MsgOneof.AvatarAppear.locations[0].avatar_id, '角色出现');
					//附近的人
					surrounding_avatar_locations = data.Msg.MsgOneof.AvatarAppear.locations;

					if (surrounding_avatar_locations && surrounding_avatar_locations.length > 0) {
						surrounding_avatar_locations.forEach(item => {

							msg = {};
							msg.type = "用户加入";
							msg.roomName = worldId;
							msg.id = item.avatar_id;
							msg.platform = "pcweb";
							msg.userName = item.avatar_id;
							msg.roomName = item.map_position.world_id;
							let user = {};
							user.id = item.avatar_id;
							user.platform = "pcweb";
							// user.userName = item.avatar_id;

							let rs2 = JSON.parse(item.avatar_render_data);
							msg.userName = rs2.userName;
							user.userName = rs2.userName;
							user.userData = rs2.userData;
							user.playerData = rs2.playerData;
							user.roomName = rs2.roomName;
							// user.roomName = item.map_position.world_id;
							msg.user = user;
							that.addPlayer((msg));
						})
					}




					break;
				case world_configs.DOWNSTREAM_AVATAR_LOGOUT_ACK:
					//其他玩家下线
					console.log(data.Msg.MsgOneof.AvatarLoginNotify.location.avatar_id, '角色下线');

					break;
				case world_configs.DOWNSTREAM_ACTIVITY_EFFECT:

					//活动特效 ，参见 ActivityEffect
					console.log(data.Msg.MsgOneof.ActivityEffect, '活动特效');
					let ActivityEffect = data.Msg.MsgOneof.ActivityEffect;
					let EffectType = ActivityEffect.EffectType;
					//UNKNOWN = 0;
					// BALLOON_RAIN = 1; // 气球雨
					// HAND_CLAP = 2; // 全体鼓掌
					// LIGHT_STICK = 3; // 荧光棒
					// SIT_DOWN = 4; // 就座
					let EffectStatus = ActivityEffect.EffectStatus;
					// UNKNOWN = 0;
					// PAUSE = 1; // 暂停（解除）
					// START = 2; // 开始
					let RenderData = ActivityEffect.RenderData;

					if (EffectType == 1) {
						//(b,colorGroup) b打开或关闭气球雨、 colorGroup 颜色组  1黄紫  2粉紫
						_Global.BalloonRain(EffectStatus == 2, 1 );
						// _Global.BalloonRain(EffectStatus == 2, RenderData == "1" ? 1 : 2);
						return;
					}
					if (EffectType == 6) {
						//(b,colorGroup) b打开或关闭气球雨、 colorGroup 颜色组  1黄紫  2粉紫
						_Global.BalloonRain(EffectStatus == 2,  2);
						return;
					}
					if (EffectType == 2) {
						_Global.AllHandClap(EffectStatus == 2);
						return;
					}
					if (EffectType == 3) {
						_Global.AllPickLightStick(EffectStatus == 2);
						return;
					}

					if (EffectType == 4) {
						_Global.AllSitting(EffectStatus == 2);
						return;
					}

					if (EffectType == 5) {
						_Global.PlayFireWorks(EffectStatus == 2);
					}
					break;

					
				case world_configs.DOWNSTREAM_ERROR_INFO:
					//其他玩家下线
					console.error(data.Msg.MsgOneof.errorInfo, ' 错误 ');

					break;
				default:
					//return 0; 
					break;
			}
			// receiveMsgFn(msg);
		}

		// 强制不同步 
		this.postPosition = function (mapinfo) {
			// console.log('-------------postPosition-----', mapinfo);
			if (_Global.dontDync) { return; }
			let renderData = JSON.stringify(mapinfo);
			sendTo({
				"avatarId": mem_userInfo.UID,
				"msgType": "UPSTREAM_AVATAR_MOVE",
				"avatarMove": {
					"location": {
						"avatarId": mem_userInfo.UID,
						"mapPosition": {
							"x": mapinfo.userData.pos.x,
							"y": mapinfo.userData.pos.y,
							"z": mapinfo.userData.pos.z,
							"venueId": venueId,
							"worldId": worldId
						},
						"direction": 0,
						"timestampMsec": new Date().getTime(),
						"avatarRenderData": renderData,
						"avatarAdditionalData": {
							"Props": [{
								// PropID 道具ID
								"PropID": 1,
								// PartID 部件ID，用于索引渲染信息
								"PartID": 2,
								// Position 地图位置
								"Position": {
									"x": 0,
									"y": 0,
									"z": 0,
									"venueId": venueId,
									"worldId": worldId
								},
								// Direction 方向 x轴正方向为0度 顺时针 0-359 之间
								"Direction": 4.0
							}]
						}
					}, "speed": 2.0
				}
			});
		}

		let delayHearBeat = null;
		function heartBeat() {
			if (isClosed) { return; }
			sendTo({
				"avatarId": mem_userInfo.UID,
				"msgType": "UPSTREAM_HEARTBEAT",
				"heartbeat": {}
			});
			if (delayHearBeat != null) {
				clearTimeout(delayHearBeat);
			}
			delayHearBeat = setTimeout(() => {
				heartBeat();
			}, 10000);
		}

		// 接收WS服务器返回的消息
		function receiveMsgFn(msg) {
			// var msg = e.data;
			if (msg.indexOf("心跳检测") > -1) {
				heartCount = 0;
				return;
			}
			// console.log("WS客户端接收到一个服务器的消息：" + msg);
			//加入新用户的封装，不可更改
			if (msg.indexOf("id=") > -1) {

				let id = msg.replace("id=", "");
				// console.log("WS客户端接收到服务器消息==》 id = " + id);

				that.addSelf(id);

				//加入新用户的封装，不可更改
				let fromData = {};
				fromData.type = "加入游戏";
				fromData.id = "id";
				fromData.userId = that.userId;
				fromData.platform = that.platform;
				fromData.userName = that.userName;
				fromData.roomName = that.roomName;
				fromData.message = "";

				JoinRoomFn(JSON.stringify(fromData));

				// console.log("发送 --》 加入游戏 ---", JSON.stringify(fromData));
				return;
			}
			//加入新用户 的封装，不可更改
			if (msg.indexOf("加入房间") > -1) {
				that.addPlayer(JSON.parse(msg));
				return;
			}
			//获取所有在线用户 的封装，不可更改
			if (msg.indexOf("刷新用户") > -1) {
				// console.log("WS客户端接收到服务器消息==》 刷新用户 = ", msg);

				that.addPlayer(JSON.parse(msg));
				return;
			}
			//加入新用户 的封装，不可更改
			if (msg.indexOf("用户加入") > -1) {
				that.addPlayer(JSON.parse(msg));
				return;
			}
			//加入新用户，为新用户刷新场景状态 的封装，不可更改
			if (msg.indexOf("刷新场景") > -1) {
				that.addPlayer(JSON.parse(msg));
				return;
			}
			if (msg.indexOf("刷新地图") > -1) {
				that.addPlayer(JSON.parse(msg));
				return;
			}
			if (msg.indexOf("获取模型") > -1) {
				that.addPlayer(JSON.parse(msg));
				return;
			}
			//用户离开 的封装，不可更改
			if (msg.indexOf("用户离开") > -1) {
				that.addPlayer(JSON.parse(msg));
				return;
			}
			if (that.id == "") { return; }
			//同步方法
			that.receiveRPCFn(msg);

			return;
		}

		this.send = (msg) => {
			return;
			if (isClosed) { return; }
			sendFn(msg);
		}

		// 发送心跳检测、心跳检测判断连接断开

		function sendHeartFn() {
			// console.log(" 发送心跳包 " + heartCount);
			wsClient.emit("heart", "msg");
			heartCount++;
			if (heartCount > 3) {
				//服务器断开
				console.log("到服务器的连接已经断开");
				isClosed = true;
				that.CloseWebsocket();
				return;
			}
			setTimeout(() => {
				sendHeartFn();
			}, 2000);
		}


		//发送加入游戏或加入房间/切换房间
		this.joinRoom = (msg) => {
			if (isClosed) { return; }
			this.close();
			setTimeout(() => {
				InitFn();;
			}, 1000);
		}
		//发送加入游戏或加入房间/切换房间
		function JoinRoomFn(msg) {
			return;
			wsClient.emit("joinRoom", msg);
		}
		function sendFn(msg) {
			return;
			wsClient.emit("msg", msg);
		}
		this.close = () => {
			isClosed = true;
			isChangeRoom = true;
			wsClient.close();
			console.log("主动关闭客户端");
		}
		// InitFn(); 

	}
}
export { YJsocketIO };