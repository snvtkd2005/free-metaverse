



class YJwebsocket {
	constructor(that) {
		var isClosed = false;
		var wsClient = null;
		function Init() {
			//创建 wsClient 的一个实例 
			wsClient = new WebSocket("ws://127.0.0.1:8083/ws");
			// wsClient = new WebSocket("ws://192.168.0.50:8083/ws");


			// wsClient = new WebSocket("ws://47.104.151.177:8082/ws");
			// wsClient = new WebSocket("wss://www.snvtkd2005.com:8083/ws");
 

			wsClient.onopen = function () {
				console.log("WS客户端已经成功连接到服务器上");
				isClosed = false;
			};

			// var that = this;
			//接收WS服务器返回的消息
			wsClient.onmessage = function (e) {
				var msg = e.data;

				// console.log("WS客户端接收到一个服务器的消息：" + msg);
				//加入新用户的封装，不可更改
				if (msg.indexOf("id=") > -1) {
					let id = msg.replace("id=", "");
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
					wsClient.send(JSON.stringify(fromData));
					return;
				}
				//加入新用户 的封装，不可更改
				if (msg.indexOf("加入房间") > -1) {
					that.addPlayer(JSON.parse(msg));
					return;
				}
				//获取所有在线用户 的封装，不可更改
				if (msg.indexOf("刷新用户") > -1) {
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
			};
			wsClient.onclose = function (e) {
				//经过客户端和服务器的四次挥手后，二者的连接断开了
				console.log("到服务器的连接已经断开", e);
				isClosed = true;
				that.CloseWebsocket();
				//删除角色
				setTimeout(() => {
					Init();
				}, 2000);
			};
		}
		Init();

		this.send = (msg) => {
			if (isClosed) { return; }
			wsClient.send(msg);
		}
		this.close = () => {
			wsClient.close();
			console.log("主动关闭客户端");
		}
	}
}
function contextmenu(event) {
	event.preventDefault();
}
export { YJwebsocket };