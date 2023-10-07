


// import Stomp  from 'stompjs';

class YJwebsocketStomp {
	constructor(that, id, callback) {
		var isClosed = false;
		var wsClient = null;
		function Init(id) {
			//创建 wsClient 的一个实例 

			// wsClient = new WebSocket("ws://127.0.0.1:15674/ws");


			// wsClient = new WebSocket("ws://47.104.151.177:15674/ws");  //ip 只能通过ws访问
			wsClient = new WebSocket("ws://www.snvtkd2005.com:15674/ws");
			// wsClient = new WebSocket("wss://www.snvtkd2005.com:15674/ws");



			// wsClient = new SockJS('https://www.snvtkd2005.com:15674/ws'); //无效
			// 获得Stomp client对象
			var client = Stomp.over(wsClient);

			var headers = {
				login: 'guest',
				passcode: 'guest',
				//虚拟主机，默认“/”
				host: "/",
				// 'accept-version': '1.1,1.0',
				// 'heart-beat': '100000,10000',
				// 'client-id': 'my-client-id'
			};
			// 定义连接成功回调函数
			var on_connect = function (x) {
				console.log(" 已连接 到 rabbit mq 服务器 ,", client);

				isClosed = false;
				//data.body是接收到的数据
				client.subscribe("/queue/boot_queue_" + id, function (data) {
					var msg = data.body;

					// console.log("接收数据===》" + msg);
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
						console.log("接收数据===》" + "用户加入");
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
				});
			};

			// 定义错误时回调函数
			var on_error = function (e) {
				console.log("到 rabbit mq 服务器的连接已经断开,", e);
				isClosed = true;

				client = null;
				wsClient = null;

				//删除角色
				setTimeout(() => {
					if (that.connected) {
						Init();
					}
				}, 2000);

			};

			// 连接RabbitMQ
			client.connect("admin", "123456", on_connect, on_error, "/");
			// client.connect("guest","guest", on_connect, on_error,"/");
			// client.connect(headers, on_connect, on_error);


		}
		Init(id);
		this.Connect = function (id) {
			Init(id);
		}
	}
}
function contextmenu(event) {
	event.preventDefault();
}
export { YJwebsocketStomp };