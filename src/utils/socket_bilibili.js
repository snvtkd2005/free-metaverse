


// https://socketio.p2hp.com/docs/v4/server-instance/   socketio文档

import SocketIO from 'socket.io-client';
import { nextTick } from 'vue';
import VueSocketio from 'vue-socket.io';

class socket_bilibili {
	constructor(that) {
		let scope = this;
		var isClosed = true;
		var wsClient = null;
		let socketListener, socketEmitter;
		let heartCount = 0;
		let baseUrl = "https://live-open.biliapi.com";
		let room = "25551747";
		let key = "QNySBxbZeCAD2xdimkZF0lFE";
		let secried = "TCptpOkgfRvYeFE3Eu20Guro9gjjLN";
		this.Init = () => {
			InitFn();
		}
		function InitFn() {
			//创建 wsClient 的一个实例 

			// console.error(" 准备连接 socket io ");
			const socket = new VueSocketio({
				debug: false,

				// connection: SocketIO("ws://127.0.0.1:3333"),
				// connection: SocketIO("ws://www.snvtkd2005.com:3333"),
				connection: SocketIO("wss://www.snvtkd2005.com:3333"),

				options: {
					// path: "/my-app/",
					transports: ["websocket", "polling", 'flashsocket'] //**加上这句即可使用wss**
				},
				reconnection: true,
			});

			const { emitter, io, listener } = socket;

			wsClient = io;
			socketEmitter = emitter;
			socketListener = listener;

			wsClient.on('connect', () => {
				// console.log(" 已连接到 socket io 服务器");
				isClosed = false;
				heartCount = 0;
				sendHeartFn();
			});

			try {
				socketEmitter.addListener('msg', function (data) {//组件初始化挂载后，订阅后端事件
					receiveMsgFn(data);
				}, scope);
			} catch (error) {
				// console.error(" 监听报错 ",error);
			}

		}

		this.receiveMsg = function (msg) {
			receiveMsgFn(msg);
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
			JoinRoomFn(msg);
		}
		//发送加入游戏或加入房间/切换房间
		function JoinRoomFn(msg) {
			wsClient.emit("joinRoom", msg);
		}
		function sendFn(msg) {
			wsClient.emit("msg", msg);
		}
		this.close = () => {
			wsClient.close();
			console.log("主动关闭客户端");
		}
		// InitFn(); 

	}
}
export { socket_bilibili };