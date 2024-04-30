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
export const LIVE_OPEN_PLATFORM_SEND_GIFT = "LIVE_OPEN_PLATFORM_SEND_GIFT"; //礼物

export const UPSTREAM_AUDITED_AVATAR_HISTORY_MSG = 1004; // 历史消息记录
 

export const dmplayer = [
    {
        "level": 12,
        "uname": "阳光万里hao",
        "uface": "https://i1.hdslb.com/bfs/face/d5c63d43ac8d77ba400ba392ff1d396c85897b0c.jpg",
        "assetId": "战士1",
        "camp": "血色十字军",
        "npcId": "阳光万里hao",
        "isDead": false,
        "health": 351,
        "maxHealth": 2221,
        "currentExp": 81580,
        "needExp": 409600,
        "strength": 134,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 2,
                "cCD": 1.3,
                "CD": 6,
                "perCD": "4.7"
            }
        ],
        "state": "run",
        "posId": "21"
    },
    {
        "level": 14,
        "uname": "我回来哩",
        "uface": "https://i1.hdslb.com/bfs/face/f996c61e293403254794077025a2549ef8bc863b.jpg",
        "assetId": "战士3",
        "camp": "红方",
        "npcId": "我回来哩",
        "isDead": false,
        "currentExp": 66260,
        "health": 3198,
        "maxHealth": 3198,
        "needExp": 1638400,
        "strength": 192,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 3.5000000000000018,
                "CD": 6,
                "perCD": "2.5"
            }
        ],
        "state": "run",
        "posId": "23"
    },
    {
        "level": 13,
        "uname": "Ah---Choo",
        "uface": "https://i1.hdslb.com/bfs/face/adabdaea7bf1b3e5561d829a8652e74ef710dce5.jpg",
        "assetId": "战士2",
        "camp": "红方",
        "npcId": "Ah---Choo",
        "isDead": false,
        "health": 2415,
        "maxHealth": 2665,
        "currentExp": 544440,
        "needExp": 819200,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 1.2,
                "CD": 6,
                "perCD": "4.8"
            }
        ],
        "strength": 160,
        "state": "run",
        "posId": "22"
    },
    {
        "level": 13,
        "uname": "一叶青煈",
        "uface": "https://i2.hdslb.com/bfs/face/98df25c1ebf757fecb66a970ff9ce40a2a10ef3a.jpg",
        "assetId": "战士2",
        "camp": "红方",
        "npcId": "一叶青煈",
        "isDead": false,
        "health": 2665,
        "maxHealth": 2665,
        "currentExp": 519660,
        "needExp": 819200,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 6,
                "CD": 6,
                "perCD": "0.0"
            }
        ],
        "strength": 160,
        "state": "waite",
        "posId": "22"
    },
    {
        "uname": "枫树林噢",
        "uface": "https://i0.hdslb.com/bfs/face/27f22698a30985e9d0a3b0bda43e6618854831b7.jpg",
        "assetId": "战士1",
        "camp": "红方",
        "npcId": "枫树林噢",
        "isDead": false,
        "level": 13,
        "health": 2665,
        "maxHealth": 2665,
        "currentExp": 436840,
        "needExp": 819200,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 6,
                "CD": 6,
                "perCD": "0.0"
            }
        ],
        "strength": 160,
        "state": "waite",
        "posId": "21"
    },
    {
        "level": 8,
        "uname": "梦回天棠",
        "uface": "http://i0.hdslb.com/bfs/face/d770d2c6aadbcae1b2544fc9f75042c4614a3c82.jpg",
        "assetId": "战士4",
        "camp": "血色十字军",
        "npcId": "梦回天棠",
        "isDead": false,
        "health": 1072,
        "maxHealth": 1072,
        "currentExp": 13120,
        "needExp": 25600,
        "strength": 66,
        "skill": [
            {
                "name": "火球术",
                "unLockLevel": 1,
                "level": 22,
                "icon": "https://snvtkd2005.com/socketIoServer/socketIoServer/uploadsUVAnim/1706443602816/spell_fire_flamebolt.png",
                "CD": 2,
                "cCD": 0.2,
                "perCD": "1.8"
            },
            {
                "name": "冰霜新星",
                "unLockLevel": 1,
                "level": 1,
                "icon": "https://snvtkd2005.com/socketIoServer/socketIoServer/uploadsUVAnim/1711447058124/spell_frost_freezingbreath.png",
                "CD": 10,
                "cCD": 7.099999999999991,
                "perCD": "2.9"
            },
            {
                "name": "寒冰护体",
                "unLockLevel": 1,
                "level": 1,
                "icon": "https://snvtkd2005.com/socketIoServer/socketIoServer/uploadsUVAnim/1711459565884/spell_ice_lament.png",
                "CD": 30,
                "cCD": 16.89999999999997,
                "perCD": "13"
            }
        ],
        "state": "run",
        "posId": "24"
    },
    {
        "level": 8,
        "uname": "未知用户在此",
        "uface": "https://i0.hdslb.com/bfs/face/member/noface.jpg",
        "assetId": "弓箭手1",
        "camp": "血色十字军",
        "npcId": "未知用户在此",
        "isDead": true,
        "health": 0,
        "maxHealth": 1072,
        "currentExp": 8260,
        "needExp": 25600,
        "strength": 66,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 5.4999999999999964,
                "CD": 6,
                "perCD": "0.5"
            }
        ],
        "state": "run",
        "posId": "11"
    },
    {
        "level": 5,
        "uname": "我换了三次昵称都被注册了",
        "uface": "https://i0.hdslb.com/bfs/face/member/noface.jpg",
        "assetId": "弓箭手3",
        "camp": "血色十字军",
        "npcId": "我换了三次昵称都被注册了",
        "isDead": true,
        "health": 0,
        "maxHealth": 621,
        "currentExp": 620,
        "needExp": 3200,
        "strength": 39,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 0.9999999999999999,
                "CD": 6,
                "perCD": "5.0"
            }
        ],
        "state": "run",
        "posId": "13"
    },

    {
        "level": 8,
        "uname": "ZH画渣-痛苦",
        "uface": "https://i2.hdslb.com/bfs/face/477d40100dcf28b219c6b3bcd105b9438d932a18.jpg",
        "assetId": "弓箭手1",
        "camp": "血色十字军",
        "npcId": "ZH画渣-痛苦",
        "isDead": false,
        "health": 12,
        "maxHealth": 1072,
        "currentExp": 5800,
        "needExp": 25600,
        "strength": 66,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 1.2,
                "CD": 6,
                "perCD": "4.8"
            }
        ],
        "state": "run",
        "posId": "11"
    },
    {
        "level": 11,
        "uname": "hx君",
        "uface": "https://i1.hdslb.com/bfs/face/13de7626bcab01dd5a61515d4133992463fdecd1.jpg",
        "assetId": "弓箭手2",
        "camp": "血色十字军",
        "npcId": "hx君",
        "isDead": false,
        "health": 461,
        "maxHealth": 1851,
        "currentExp": 10760,
        "needExp": 204800,
        "strength": 112,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 4.799999999999999,
                "CD": 6,
                "perCD": "1.2"
            }
        ],
        "state": "run",
        "posId": "12"
    },
    {
        "level": 12,
        "uname": "Mazycurl",
        "uface": "https://i0.hdslb.com/bfs/face/member/noface.jpg",
        "assetId": "弓箭手4",
        "camp": "红方",
        "npcId": "Mazycurl",
        "isDead": false,
        "health": 1071,
        "maxHealth": 2221,
        "currentExp": 121480,
        "needExp": 409600,
        "strength": 134,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 3.900000000000002,
                "CD": 6,
                "perCD": "2.1"
            }
        ],
        "state": "run",
        "posId": "14"
    },
    {
        "level": 12,
        "uname": "王元一局",
        "uface": "https://i1.hdslb.com/bfs/face/7622fe500d64cac1ba2b7311a25ef904d2311551.jpg",
        "assetId": "弓箭手3",
        "camp": "红方",
        "npcId": "王元一局",
        "isDead": false,
        "health": 2101,
        "maxHealth": 2221,
        "currentExp": 81980,
        "needExp": 409600,
        "strength": 134,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 2,
                "cCD": 0.2,
                "CD": 6,
                "perCD": "5.8"
            }
        ],
        "state": "run",
        "posId": "13"
    },
    {
        "level": 12,
        "uname": "被萝莉控的萝莉控",
        "uface": "http://i1.hdslb.com/bfs/face/a3b1dcdd01c3f2f7d02417a8cebec532e193ecf6.jpg",
        "assetId": "战士4",
        "camp": "红方",
        "npcId": "被萝莉控的萝莉控",
        "isDead": false,
        "health": 1951,
        "maxHealth": 2221,
        "currentExp": 5780,
        "needExp": 409600,
        "strength": 134,
        "skill": [
            {
                "op": "",
                "name": "多重射击",
                "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
                "unLockLevel": 3,
                "level": 1,
                "cCD": 2.800000000000001,
                "CD": 6,
                "perCD": "3.2"
            }
        ],
        "state": "run",
        "posId": "24"
    },
      {
        "level": 3,
        "uname": "l老a",
        "uface": "https://i1.hdslb.com/bfs/face/cc65f3515da9b9331559abe19c04c9f8bf101116.jpg",
        "assetId": "战士4",
        "camp": "血色十字军",
        "npcId": "l老a",
        "isDead": false,
        "health": 432,
        "maxHealth": 432,
        "currentExp": 120,
        "needExp": 800,
        "strength": 28,
        "skill": [
          {
            "name": "火球术",
            "unLockLevel": 1,
            "level": 6,
            "icon": "https://snvtkd2005.com/socketIoServer/socketIoServer/uploadsUVAnim/1706443602816/spell_fire_flamebolt.png",
            "CD": 2,
            "cCD": 1.3,
            "perCD": "0.7"
          },
          {
            "name": "冰霜新星",
            "unLockLevel": 1,
            "level": 1,
            "icon": "https://snvtkd2005.com/socketIoServer/socketIoServer/uploadsUVAnim/1711447058124/spell_frost_freezingbreath.png",
            "CD": 15,
            "cCD": 15,
            "perCD": "0"
          },
          {
            "name": "寒冰护体",
            "unLockLevel": 1,
            "level": 1,
            "icon": "https://snvtkd2005.com/socketIoServer/socketIoServer/uploadsUVAnim/1711459565884/spell_ice_lament.png",
            "CD": 30,
            "cCD": 20.100000000000016,
            "perCD": "10"
          }
        ],
        "state": "run",
        "posId": "24"
      },
      {
        "level": 11,
        "uname": "_落地水",
        "uface": "https://i1.hdslb.com/bfs/face/c6600394c896d1d05f562c3f11f86ebf28b5d54c.jpg",
        "assetId": "弓箭手3",
        "camp": "血色十字军",
        "npcId": "_落地水",
        "isDead": false,
        "health": 1571,
        "maxHealth": 1851,
        "currentExp": 19420,
        "needExp": 204800,
        "strength": 112,
        "skill": [
          {
            "op": "",
            "name": "多重射击",
            "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
            "unLockLevel": 3,
            "level": 2,
            "cCD": 2.0000000000000004,
            "CD": 6,
            "perCD": "4.0"
          }
        ],
        "state": "run",
        "posId": "13"
      },
      {
          "level": 13,
          "uname": "你好莎莎",
          "uface": "https://i1.hdslb.com/bfs/face/f341170fe1f85f1695b76af8791c783afe6570f1.jpg",
          "assetId": "弓箭手3",
          "camp": "血色十字军",
          "npcId": "你好莎莎",
          "isDead": false,
          "health": 1072,
          "maxHealth": 1072,
          "currentExp": 15380,
          "needExp": 25600,
          "strength": 66,
          "skill": [
            {
              "op": "",
              "name": "多重射击",
              "icon": "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
              "unLockLevel": 3,
              "level": 130,
              "cCD": 1.6000000000000003,
              "CD": 6,
              "perCD": "4.4"
            }
          ],
          "state": "run",
          "posId": "13"
        }

]

// { name: "嘴线大",
// value: 0, // 口轮匝肌 0为正常，1为最大
// duration: 0,
// },
// {name: "嘴线小",
// value: 0, // 口轮匝肌 0为正常，1为最小
// duration: 0,
// },

export const  faceData = [
    {
        name: "眉毛位置上",
        value: 0, // 为0时居中，为1时最上
        duration: 0,//表示value从上一个值变为目标值的持续时间，单位秒
    },{ name: "眉毛位置下",
        value: 0,  // 为0时居中，为1时最下 
        duration: 0,},
    {name: "眉毛生气",
        value: 0,  // 为0时正常，为1时生气
        duration: 0,
    },
    { name: "眉毛委屈",
        value: 0,  // 为0时正常，为1时委屈
        duration: 0,
    },
    { name: "闭眼",
        value: 0, // 0为睁眼，1为闭眼
        duration: 0,
    },
    {name: "闭眼笑",
        value: 0, // 0为睁眼，1为微笑状态的闭眼
        duration: 0,
    },
    {name: "睁眼生气",
        value: 0, // 0为正常，1为睁眼状态生气
        duration: 0,
    },
    {name: "眼惊吓",
        value: 0, // 0为正常，1为眼惊吓
        duration: 0,
    },
    {name: "睁眼委屈", 
        value: 0, // 0为正常，1为睁眼状态委屈
        duration: 0,
    },
    { name: "瞳孔小",
        value: 0, // 0为最大，1为最小
        duration: 0,
    },
    { name: "嘴惊吓",
        value: 0, // 0为正常，1为张嘴惊吓状
        duration: 0,
    },
    {name: "嘴生气", 
        value: 0, // 0为正常，1为张嘴生气状
        duration: 0,
    },
    {name: "嘴发呆", 
        value: 0, // 0为正常，1为张嘴发呆无语状
        duration: 0,
    },
    { name: "嘴吧张开",
        value: 0, // 0为正常，1为嘴吧张开最大
        duration: 0,
    },
    {name: "嘴角下",
        value: 0, // 0为正常，1为闭嘴委屈状
        duration: 0,
    },
    { name: "嘴角上",
        value: 0, // 0为正常，1为闭嘴微笑状
        duration: 0,
    },
    {name: "嘴型a", 
        value: 0, // 0为正常，1为发音a
        duration: 0,
    },
    {name: "嘴型i", 
        value: 0, // 0为正常，1为发音i
        duration: 0,
    },
    {name: "嘴型u",
        value: 0, // 0为正常，1为发音u
        duration: 0,
    },
    {name: "嘴型e", 
        value: 0, // 0为正常，1为发音e
        duration: 0,
    },
    {name: "嘴型o", 
        value: 0, // 0为正常，1为发音o
        duration: 0,
    },
];