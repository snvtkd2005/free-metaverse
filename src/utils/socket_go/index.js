const BASE_URL='43.138.163.92';

const WS_PORT="9090/ping?token="+roundUID(10000,100000);

function roundUID(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
};

export const WS_ADDRESS=`ws://${BASE_URL}:${WS_PORT}`;

//UpstreamMsgType 上行报文类型
// ---------------- 1-1000基础消息类型号段 ----------------
export const UPSTREAM_UNKNOWN = 0;
export const UPSTREAM_HEARTBEAT = 1;
export const UPSTREAM_AVATAR_LOGIN = 'UPSTREAM_AVATAR_LOGIN';
export const UPSTREAM_AVATAR_LOGOUT = 'UPSTREAM_AVATAR_LOGOUT';
export const UPSTREAM_AVATAR_TELEPORT = 'UPSTREAM_AVATAR_TELEPORT'; // 传送
export const UPSTREAM_AVATAR_RECOVER = 'UPSTREAM_AVATAR_RECOVER';

// ---------------- 角色移动与动作消息类型号段 1000-1999 ----------------
export const UPSTREAM_AVATAR_MOVE = 'UPSTREAM_AVATAR_MOVE'; // 位置/方向变化
export const UPSTREAM_AVATAR_ACTION = 'UPSTREAM_AVATAR_ACTION'; // 动作
export const UPSTREAM_AVATAR_DIRECTED_ACTION = 1002; // 定向动作
export const UPSTREAM_AUDITED_AVATAR_INSTANT_MSG = 1003; // 即时消息
export const UPSTREAM_AUDITED_AVATAR_HISTORY_MSG = 1004; // 历史消息记录

// ---------------- 地图物件状态变化消息类型号段 2000-2999 ----------------
export const UPSTREAM_SIMPLE_INTERACTIVE_MAP_ITEM_STATE_CHANGE = 2000;
// 道具事件
export const UPSTREAM_PROP_EVENT = 2001;
// 媒体事件
export const UPSTREAM_MEDIA_EVENT = 2002;


//DownstreamMsgType 下行报文类型

// 1-1000基础消息号段
export const DOWNSTREAM_UNKNOWN = 0;
export const DOWNSTREAM_HEARTBEAT_ACK = 1;
export const DOWNSTREAM_AVATAR_LOGIN_ACK = 2;
export const DOWNSTREAM_AVATAR_LOGOUT_ACK = 3;
export const DOWNSTREAM_AVATAR_TELEPORT_ACK = 4;
export const DOWNSTREAM_AVATAR_RECOVER_ACK = 5;

export const DOWNSTREAM_ERROR_INFO = 6; // 错误信息，参见 ErrorInfo

// 角色移动与动作消息类型号段 1000-2000
export const DOWNSTREAM_AVATAR_MOVE = 1000; // 位置/方向变化
export const DOWNSTREAM_AVATAR_ACTION = 1001; // 动作
export const DOWNSTREAM_AVATAR_DISAPPEAR = 1002; // 角色消失(从范围内消失)
export const DOWNSTREAM_AVATAR_APPEAR = 1003; // 角色出现(从范围内出现)
export const DOWNSTREAM_AVATAR_TELEPORT_AWAY = 1004; // 角色消失(传送)
export const DOWNSTREAM_AVATAR_TELEPORT_To = 1005; // 角色出现(传送)
export const DOWNSTREAM_AVATAR_DIRECTED_ACTION = 1006; // 定向动作同步
export const DOWNSTREAM_AUDITED_AVATAR_INSTANT_MSG = 1007; // 即时消息
export const DOWNSTREAM_AVATAR_HISTORY_MSG = 1008; // 同步历史消息

// 地图物件状态变化消息类型号段 2000-3000
export const DOWNSTREAM_SIMPLE_INTERACTIVE_MAP_ITEM_STATE_CHANGE = 2000;
// 道具事件
export const DOWNSTREAM_PROP_EVENT = 2001;
// 媒体事件
export const DOWNSTREAM_MEDIA_EVENT = 2002;

// 广播类型消息通知 3000-3999
export const DOWNSTREAM_AVATAR_USER_LOGIN = 3000;
export const DOWNSTREAM_AVATAR_USER_LOGOUT = 3001;
export const DOWNSTREAM_VENUE_INSTANT_MSG = 3002; // 房间内公屏消息
export const DOWNSTREAM_ACTIVITY_EFFECT = 3003; // 活动特效，参见 ActivityEffect

// 展位信息相关 4000-4999
export const DOWNSTREAM_DISPLAY_SPACE_CHANGE = 4000;




