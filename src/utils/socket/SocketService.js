import {WS_ADDRESS} from '@/configs';

export default class SocketService {
    static instance = null
    static get Instance () {
        if (!this.instance) {
        this.instance = new SocketService();
        }
        return this.instance;
    }

    ws = null
    //存储回调函数
    callBackMapping = {}
    //标识是否连接成功
    connected = false
    //记录重试的次数
    sendRetryCount = 0
    //记录重新连接的次数
    reconnectCount = 0

    connect () {
        if (!window.WebSocket) {
            return console.log("您的浏览器不支持websocket!")
        }
        console.log('链接服务器：',WS_ADDRESS);
        this.ws = new WebSocket(WS_ADDRESS);
        //连接服务端成功事件
        this.ws.onopen = ()=> {
            console.log("连接服务端成功");
            console.log(this.callBackMapping);
            this.connected = true;
            this.reconnectCount = 0;
            this.callBackMapping['logintivity'].call(this,this.connected);
            
        }
        //连接服务端失败事件
        this.ws.onclose = ()=> {
            console.log("连接服务端失败")
            this.connected = false
            this.reconnectCount++
            setTimeout(()=>{
                this.connect()
            },this.reconnectCount*500);
        }
        //从服务端获取数据
        this.ws.onmessage = (msg)=> {
            console.log(msg);
            console.log("从服务端获取到的数据" + msg.data);
            const recvData = JSON.parse(msg.data);
            /*const socketType = recvData.socketType;
            if (this.callBackMapping[socketType]) {
                const action = recvData.action
                if (action === 'getData') {
                    const realData = JSON.parse(recvData.data);
                    this.callBackMapping[socketType].call(this, realData);
                }
            }*/
            this.callBackMapping['productivity'].call(this, recvData);
        }
    }
    //回调函数的注册
    registerCallBack (socketType, callBack) {
        this.callBackMapping[socketType] = callBack;
    }
    //取消回调函数
    unRegisterCallBack (socketType) {
        this.callBackMapping[socketType] = null;
    }
    send(data) {
        //console.log(data);
        var strValue=JSON.stringify(data);
        console.log('发送数据：',strValue);
        if (this.connected) {
            this.sendRetryCount = 0;
            this.ws.send(strValue);
        } else {
            this.sendRetryCount++;
            setTimeout(()=>{
                this.ws.send(strValue);
            },this.sendRetryCount*500);
        }
    }
}