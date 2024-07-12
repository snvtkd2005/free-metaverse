
export default {


  // 按键值对应显示的文字，如字母键盘数字1，键值为Digit1，在界面中显示1
  key2keytext: [
    { key: "Minus", keytext: "-" },
    { key: "Equal", keytext: "=" },
  ],
  // 快捷键
  keyData: {
    children:[
      {field:'move',title:"移动按键",},
      {field:'panel',title:"界面面板",},
      {field:'actionBar1',title:"动作条1",},
    ],
    // 移动按键
    move: [],
    // 界面面板
    panel:[
      {field:'player',title:"角色信息",key:"KeyC"},
      {field:'skill',title:"法术书",key:"KeyN"},
      {field:'bag',title:"行囊",key:"KeyB"},
      {field:'mainmenu',title:"游戏菜单",key:"Escape"},
    ],
    // 动作条1 的索引位置对应的键值
    actionBar1: [
      { index: 0,  key: "Digit1" },
      { index: 1,  key: "Digit2" },
      { index: 2,  key: "Digit3" },
      { index: 3,  key: "Digit4" },
      { index: 4,  key: "Digit5" },
      { index: 5,  key: "Digit6" },
      { index: 6,  key: "Digit7" },
      { index: 7,  key: "Digit8" },
      { index: 8,  key: "Digit9" },
      { index: 9,  key: "Digit0" },
      { index: 10, key: "Minus" },
      { index: 11, key: "Equal" },
    ],
  },
}



