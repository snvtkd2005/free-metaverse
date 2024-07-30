




import {
	getAuth
	, heartBeatThis
	, gameStart
	, gameEnd
} from './api_bilibili';

// import * as Danmaku from "./assets/danmaku-websocket.min.js"
// import { require_stdin }  from "./assets/danmaku-websocket.min.js"
// import DanmakuWebSocket from "./assets/danmaku-websocket.min.js"

// import SocketIO from 'socket.io-client';
// import { nextTick } from 'vue';
// import VueSocketio from 'vue-socket.io';
import * as world_configs from './socket_bilibili/index';

class socket_bilibili {
	constructor(that) {
		let scope = this;

		// 替换你的主播身份码
		let codeId = "BS5GG5AXPBLS0";
		// 替换你的app应用 [这里测试为互动游戏]
		let appId = 1708553545004;
		// let appId = "1708553545004";
		// 替换你的秘钥
		let appKey = "QNySBxbZeCAD2xdimkZF0lFE";
		let appSecret = "TCptpOkgfRvYeFE3Eu20Guro9gjjLN";
		let authBody = ("");
		let wssLinks = ([]);
		let gameId = ("")
		let anchorInfo = {};
		let heartBeatTimer = null;

		let ws = null;
		let wsClient = null;
		// let ws: DanmakuWebSocket

		const textEncoder = new TextEncoder('utf-8');
		const textDecoder = new TextDecoder('utf-8');

		// heartBeat Timer
		// const heartBeatTimer = ref<NodeJS.Timer>()
		// // be ready
		// clearInterval(heartBeatTimer.value!)

		function InitFn() {
			gameId = localStorage.getItem("gameId");

			// console.log(Danmaku.require_stdin);
			// let list = Object.getOwnPropertySymbols(Danmaku);
			// console.log(list);

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
				console.log("-----心跳成功-----")
				console.log("返回：", data)
			})
				.catch((err) => {
					console.log("-----心跳失败-----")
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

		function readInt(buffer, start, len) {
			let result = 0;
			for (let i = len - 1; i >= 0; i--) {
				result += Math.pow(256, len - i - 1) * buffer[start + i];
			}
			return result;
		}

		function writeInt(buffer, start, len, value) {
			let i = 0;
			while (i < len) {
				buffer[start + i] = value / Math.pow(256, len - i - 1);
				i++;
			}
		}

		function encode(str, op) {
			let data = textEncoder.encode(str);
			let packetLen = 16 + data.byteLength;
			let header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1];
			writeInt(header, 0, 4, packetLen);
			return new Uint8Array(header.concat(...data)).buffer;
		}

		function decode(blob) {
			let buffer = new Uint8Array(blob);
			console.log(" buffer ", buffer, buffer.length);
			let result = {};
			result.packetLen = readInt(buffer, 0, 4);
			result.headerLen = readInt(buffer, 4, 2);
			result.ver = readInt(buffer, 6, 2);
			result.op = readInt(buffer, 8, 4);
			result.seq = readInt(buffer, 12, 4);
			if (result.op === 5) {
				result.body = [];
				let offset = 0;
				while (offset < buffer.length) {
					let packetLen = readInt(buffer, offset + 0, 4);
					let headerLen = 16; // readInt(buffer,offset + 4,4)
					if (result.ver === 2) {
						let data = buffer.slice(offset + headerLen, offset + packetLen);
						let newBuffer = zlib.inflateSync(new Uint8Array(data));
						const obj = decode(newBuffer);
						const body = obj.body;
						result.body = result.body.concat(body);
					} else if (result.ver === 3) {
						let data = buffer.slice(offset + headerLen, offset + packetLen);
						let newBuffer = zlib.brotliDecompressSync(new Uint8Array(data));
						const obj = decode(newBuffer);
						const body = obj.body;
						result.body = result.body.concat(body);
					} else {
						let data = buffer.slice(offset + headerLen, offset + packetLen);
						let body = textDecoder.decode(data);
						if (body) {
							result.body.push(JSON.parse(body));
						}
					}
					offset += packetLen;
				}
			} else if (result.op === 3) {
				result.body = {
					count: readInt(buffer, 16, 4),
				};
			}
			return result;
		}
		function decode2(blob) {
			return new Promise(function (resolve, reject) {
				let reader = new FileReader();
				reader.onload = function (e) {
					let buffer = new Uint8Array(e.target.result)
					let result = {}
					result.packetLen = readInt(buffer, 0, 4)
					result.headerLen = readInt(buffer, 4, 2)
					result.ver = readInt(buffer, 6, 2)
					result.op = readInt(buffer, 8, 4)
					result.seq = readInt(buffer, 12, 4)
					if (result.op === 5) {
						result.body = []
						let offset = 0;
						while (offset < buffer.length) {
							let packetLen = readInt(buffer, offset + 0, 4)
							let headerLen = 16// readInt(buffer,offset + 4,4)
							let data = buffer.slice(offset + headerLen, offset + packetLen);

							/**
							 * 仅有两处更改
							 * 1. 引入pako做message解压处理，具体代码链接如下
							 *    https://github.com/nodeca/pako/blob/master/dist/pako.js
							 * 2. message文本中截断掉不需要的部分，避免JSON.parse时出现问题
							 */
							/** let body = textDecoder.decode(pako.inflate(data));
							if (body) {
								// 同一条 message 中可能存在多条信息，用正则筛出来
								const group = body.split(/[\x00-\x1f]+/);
								group.forEach(item => {
								  try {
									result.body.push(JSON.parse(item));
								  }
								  catch(e) {
									// 忽略非 JSON 字符串，通常情况下为分隔符
								  }
								});
							}**/

							let body = '';
							try {
								// pako可能无法解压
								body = textDecoder.decode(pako.inflate(data));
							}
							catch (e) {
								body = textDecoder.decode(data)
							}

							if (body) {
								// 同一条 message 中可能存在多条信息，用正则筛出来
								const group = body.split(/[\x00-\x1f]+/);
								group.forEach(item => {
									try {
										const parsedItem = JSON.parse(item);
										if (typeof parsedItem === 'object') {
											result.body.push(parsedItem);
										} else {
											// 这里item可能会解析出number
											// 此时可以尝试重新用pako解压data（携带转换参数）
											// const newBody = textDecoder.decode(pako.inflate(data, {to: 'String'}))
											// 重复上面的逻辑，筛选可能存在的多条信息
											// 初步验证，这里可以解析到INTERACT_WORD、DANMU_MSG、ONLINE_RANK_COUNT
											// SEND_GIFT、SUPER_CHAT_MESSAGE
										}
									}
									catch (e) {
										// 忽略非 JSON 字符串，通常情况下为分隔符
									}
								});
							}

							offset += packetLen;
						}
					} else if (result.op === 3) {
						result.body = {
							count: readInt(buffer, 16, 4)
						};
					}
					resolve(result)
				}
				reader.readAsArrayBuffer(blob);
			});
		}


		function baseSocket() {
			// https://stackblitz.com/edit/node-6kbmsw?file=index.mjs
			wsClient = new WebSocket(wssLinks[2]);
			wsClient.onopen = function (evt) {
				wsClient.send(encode(JSON.stringify({
					roomid: anchorInfo.room_id,
					uid: anchorInfo.uid,
					protover: 3,
					platform: 'web',
					type: 2,
				}), 7));

				setInterval(function () {
					wsClient.send(encode('', 2));
				}, 30000);
				console.log("Connection opened ...", evt);
				// isClosed = false;
				// isChangeRoom = false;
				// login();
			};
			wsClient.onmessage = async function (evt) {
				// const packet = decode(evt.data);
				const packet = await decode2(evt.data);

				console.log("Received Message: ", packet);

				switch (packet.op) {
					case 8:
						console.log('加入房间');
						break;
					case 3:
						const count = packet.body.count;
						console.log(`人气：${count}`);
						break;
					case 5:
						packet.body.forEach((body) => {
							switch (body.cmd) {
								case 'DANMU_MSG':
									console.log(`${body.info[2][1]}: ${body.info[1]}`);
									break;
								case 'SEND_GIFT':
									console.log(
										`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`
									);
									break;
								case 'WELCOME':
									console.log(`欢迎 ${body.data.uname}`);
									break;
								case 'WATCHED_CHANGE':
									console.log(`看过：${body.data.num}`);
								default:
								// console.log(body);
							}
						});
						break;
					default:
					// console.log(packet);
				}
				// receiveMsgGO(evt.data);
			};

			wsClient.onclose = function (evt) {
				console.log("Connection closed.", evt);
				// isClosed = true;
				// if (!isChangeRoom) {
				// 	that.CloseWebsocket();

				// 	setTimeout(() => {
				// 		InitFn();
				// 	}, 3000);
				// }
			};

		}

		/**
		 * 创建socket长连接
		 * @param authBody
		 * @param wssLinks
		 */
		this.createSocket = function (authBody, wssLinks) {
			// baseSocket(); return;

			let config = this.getWebSocketConfig(authBody, wssLinks)
			const opt = {
				...this.getWebSocketConfig(authBody, wssLinks),
				// 收到消息,
				onReceivedMessage: (res) => {
					console.log(res)
				},
				// 收到心跳处理回调
				onHeartBeatReply: (data) => console.log("收到心跳处理回调:", data),
				onError: (data) => console.log("error", data),
				onListConnectError: () => {
					console.log("list connect error")
					destroySocket()
				},
			}

			if (!ws) {
				console.log(" opt ",opt); 
				ws = new DanmakuWebSocket(opt); 
			}

			return ws
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