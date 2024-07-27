
export default {


  // 目标类型
  targetType: [
    { value: "kill", label: "消灭" },
    { value: "collect", label: "收集" }, 
  ],

  // 武器类型
  rewardItemType: [
    { value: "equip", label: "装备" },
    { value: "prop", label: "道具" },  
  ],

  taskData: {
    id:"",
    from: "神秘人",
    taskTitle: "净化",
    describe:
      "危机四伏，小心点，${name}。天灾军团的爪牙无穷无尽，请增援我们",
    targetDescribe: "消灭2个食尸鬼和1个憎恶",
    allCompleted: false,
    targetList: [
      { type: "kill", name: "食尸鬼",  need: 2, },
      { type: "kill", name: "憎恶",  need: 1 },
    ],
    rewardItems: [
      {
        type: "equip",
        id: "1709558796473",
        skill: null,
      },
      {
        type: "equip",
        id: "1709594878614",
        skill: null,
      },
      {
        type: "prop",
        id: "1720702607945",
        count: 5,
        skill:null,
      },
    ],
    rewardGold: 10,
    rewardExp: 100,
  },
}



