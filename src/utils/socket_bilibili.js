




import {
	getAuth
	, heartBeatThis
	, gameStart
	, gameEnd
} from './api_bilibili';

import * as world_configs from './socket_bilibili/index';

class socket_bilibili {
	constructor(that) {
		let scope = this;

		// 替换你的主播身份码
		let codeId = "BS5GG5AXPBLS0";
		// 替换你的app应用 [这里测试为互动游戏]
		let appId = 1708553545004;
		// 替换你的秘钥
		let appKey = "QNySBxbZeCAD2xdimkZF0lFE";
		let appSecret = "TCptpOkgfRvYeFE3Eu20Guro9gjjLN";
		let authBody = ("");
		let wssLinks = ([]);
		let gameId = ("")
		let anchorInfo = {};
		let heartBeatTimer = null;

		let ws = null;


		// heartBeat Timer
		// const heartBeatTimer = ref<NodeJS.Timer>()
		// // be ready
		// clearInterval(heartBeatTimer.value!)

		function InitFn() {
			gameId = localStorage.getItem("gameId");

			setTimeout(() => {
				gameStartFn();
			}, 2000);
			return;
			let fromData = new FormData();
			fromData.appKey = appKey,
				fromData.appSecret = appSecret,
				fromData.app_id = appId,
				fromData.code = codeId,
				// {
				// 	appKey: appKey,
				// 	appSecret: appSecret,

				// 	app_id : 1708553545004,
				// 	code : "BS5GG5AXPBLS0",
				// }
				getAuth(JSON.stringify(fromData)).then((res) => {
					console.log("-----鉴权成功-----")
					console.log("返回：", res)

					setTimeout(() => {
						gameStartFn();
					}, 2000);
				})
					.catch((err) => {
						console.log("-----鉴权失败-----")
					});

		}
		function heartBeatThisFn(game_id) {
			// 心跳 是否成功
			heartBeatThis({
				game_id: game_id,
			}).then(({ data }) => {
				// console.log("-----心跳成功-----")
				// console.log("返回：", data)
			}).catch((err) => {
					// console.log("-----心跳失败-----")
			})
		}
		this.gameStart = () => {
		}
		function gameStartFn() {

			let fromData = new FormData();
			// fromData.appKey = appKey,
			// fromData.appSecret = appSecret,
			fromData.app_id = appId,
				fromData.code = codeId,

				gameStart(JSON.stringify(fromData)).then((data) => {
					console.log(data);
					if (data.code === 0) {
						const res = data.data
						const { anchor_info, game_info, websocket_info } = res
						const { auth_body, wss_link } = websocket_info
						authBody = auth_body
						wssLinks = wss_link
						anchorInfo = anchor_info;
						console.log("-----游戏开始成功-----")
						console.log("返回GameId：", game_info)
						gameId = game_info.game_id
						localStorage.setItem("gameId", gameId);
						// v2改为20s请求心跳一次，不然60s会自动关闭
						heartBeatTimer = setInterval(() => {
							heartBeatThisFn(game_info.game_id)
						}, 20000);
						scope.handleCreateSocket();
					} else {
						console.log("-----游戏开始失败-----")
						console.log("原因：", data)
						if (data.code == 7002 || 7001) {
							scope.gameEnd();
							setTimeout(() => {
								gameStartFn();
							}, 5000);
						}
					}
				})
					.catch((err) => {
						console.log("-----游戏开始失败 或长连接失败 11-----")
						console.log(err)
					})
		}
		this.gameEnd = () => {
			let fromData = new FormData();
			fromData.game_id = gameId,
				fromData.app_id = appId,
				gameEnd(JSON.stringify(fromData)).then((data) => {
					if (data.code === 0) {
						console.log("-----游戏关闭成功-----")
						console.log("返回：", data)
						// 清空长链
						authBody = ""
						wssLinks = []
						clearInterval(heartBeatTimer)
						scope.handleDestroySocket()
						console.log("-----心跳关闭成功-----")
					} else {
						console.log("-----游戏关闭失败-----")
						console.log("原因：", data)
					}
				})
					.catch((err) => {
						console.log("-----游戏关闭失败-----")
						console.log(err)
					})
		}

		this.handleCreateSocket = () => {
			if (authBody && wssLinks) {
				this.createSocket(authBody, wssLinks)
			}
		}
		this.handleDestroySocket = () => {
			if (ws == null) {
				return;
			}
			this.destroySocket()
			console.log("-----长连接销毁成功-----")
		}
		/**
		 * 创建socket长连接
		 * @param authBody
		 * @param wssLinks
		 */
		this.createSocket = function (authBody, wssLinks) {
			const opt = {
				...this.getWebSocketConfig(authBody, wssLinks),
				// 收到消息,
				onReceivedMessage: (res) => {
					this.receiveMsg(res);
				},
				// 收到心跳处理回调
				onHeartBeatReply: (data) =>{
					console.log("收到心跳处理回调:", data);
				},
				onError: (data) => console.log("error", data),
				onListConnectError: () => {
					console.log("list connect error")
					this.destroySocket()
				},
			}

			if (!ws) {
				// console.log(" opt ",opt); 
				ws = new DanmakuWebSocket(opt);
			}

			return ws
		}
		this.receiveMsg = function (msg) {
			receiveMsgFn(msg);
		}
		function receiveMsgFn(msg) {
			console.log(msg);
			let data = msg.data;
			let cmd = msg.cmd;
			let { msg, uname, uid } = data;

			// console.log(cmd);
			switch (cmd) {
				case world_configs.LIVE_OPEN_PLATFORM_DM:
					console.log(uname, " 发送弹幕 ", msg);
					break;
				case world_configs.LIVE_OPEN_PLATFORM_LIKE:
					console.log(uname, " 点赞 ");
					break;

				default:
					break;
			}
		}


		/**
		 * 获取websocket配置信息
		 * @param authBody
		 * @param wssLinks
		 */
		this.getWebSocketConfig = function (authBody, wssLinks) {
			const url = wssLinks[1]
			const urlList = wssLinks
			const auth_body = JSON.parse(authBody)
			return {
				url,
				urlList,
				customAuthParam: [
					{
						key: "key",
						value: auth_body.key,
						type: "string",
					},
					{
						key: "group",
						value: auth_body.group,
						type: "string",
					},
				],
				rid: auth_body.roomid,
				protover: auth_body.protover,
				uid: auth_body.uid,
			}
		}

		/**
		 * 销毁websocket
		 */
		this.destroySocket = function () {
			console.log("destroy1")
			ws && ws.destroy()
			ws = undefined
			console.log("destroy2")
		}

		/**
		 * 获取websocket实例
		 */
		this.getWsClient = function () {
			return ws
		}

		InitFn();



	}
}
export { socket_bilibili };