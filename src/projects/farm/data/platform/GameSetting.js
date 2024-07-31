
export default {


  // 按键值对应显示的文字，如字母键盘数字1，键值为Digit1，在界面中显示1
  key2keytext: [
    { key: "Minus", keytext: "-" },
    { key: "Equal", keytext: "=" },
  ],
  // 控制
  control:{
    menuList:[
      {field:'playerCtrl',title:"控制方式",}, 
    ],
    playerCtrl:[
      {field:'ctrlType',title:"视角控制方式",type:'drop',value:"魔兽世界"},
    ],
  },
  // 直播
  live:{
    children:[
      {field:'liveAnchorCodeId',title:"主播身份码",type:'password',value:""},
      {field:'connectDM',title:"连接弹幕服务器",type:'button',value:""},
      {field:'campType',title:"主播阵营",type:'drop',value:1000},
    ], 
  },
  
  // 快捷键
  keyData: {
    menuList:[
      {field:'move',title:"移动按键",},
      {field:'panel',title:"界面面板",},
      {field:'actionBar1',title:"动作条",},
    ],
    // 移动按键
    move: [
      {field:'moveForward',title:"前进",key:"KeyW"},
      {field:'moveBackward',title:"后退",key:"KeyS"},
      {field:'moveLeft',title:"向左平移",key:"KeyQ"},
      {field:'moveRight',title:"向右平移",key:"KeyE"},
      {field:'jump',title:"跳跃",key:"Space"},
    ],
    // 界面面板
    panel:[
      {field:'player',title:"打开/关闭角色界面",key:"KeyC"},
      {field:'skill',title:"打开/关闭法术书界面",key:"KeyN"},
      {field:'taskList',title:"打开/关闭任务日志",key:"KeyL"},
      {field:'bagBase',title:"打开/关闭行囊",key:"KeyB"},
      {field:'mainmenu',title:"打开/关闭游戏菜单",key:"Escape"},
    ],
    // 动作条1 的索引位置对应的键值
    actionBar1: [
      { index: 0, title:"快捷键1", key: "Digit1" },
      { index: 1, title:"快捷键2", key: "Digit2" },
      { index: 2, title:"快捷键3", key: "Digit3" },
      { index: 3, title:"快捷键4", key: "Digit4" },
      { index: 4, title:"快捷键5", key: "Digit5" },
      { index: 5, title:"快捷键6", key: "Digit6" },
      { index: 6, title:"快捷键7", key: "Digit7" },
      { index: 7, title:"快捷键8", key: "Digit8" },
      { index: 8, title:"快捷键9", key: "Digit9" },
      { index: 9, title:"快捷键10", key: "Digit0" },
      { index: 10,title:"快捷键11", key: "Minus" },
      { index: 11,title:"快捷键12", key: "Equal" },
    ],
  },
}



