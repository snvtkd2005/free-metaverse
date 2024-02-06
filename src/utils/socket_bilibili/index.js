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

export const LIVE_OPEN_PLATFORM_DM = "LIVE_OPEN_PLATFORM_DM"; //弹幕
export const LIVE_OPEN_PLATFORM_LIKE = "LIVE_OPEN_PLATFORM_LIKE"; //点赞

export const UPSTREAM_AUDITED_AVATAR_HISTORY_MSG = 1004; // 历史消息记录
 



