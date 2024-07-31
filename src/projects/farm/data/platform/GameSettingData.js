
export default {


  // 按键值对应显示的文字，如字母键盘数字1，键值为Digit1，在界面中显示1
  key2keytext: [
    { key: "Minus", keytext: "-" },
    { key: "Equal", keytext: "=" },
  ],
  // 控制
  ctrlType: [ 
    { value: "wow", label: "魔兽世界" },
    { value: "overlook", label: "俯视" },
  ],
  campType: [ 
    { value: 1000, label: "阵营1000" },
    { value: 1001, label: "阵营1001" },
  ],
  lefMenuList:[
    {
      title: "游戏功能",
      children: [
        { field: "control", title: "控制" },
        { field: "live", title: "直播设置" },
        // { field: "panel", title: "界面" },
        // { field: "actionBar", title: "动作条" },
        // { field: "comba", title: "战斗" },
        // { field: "", title: "社交" },
        { field: "keyData", title: "快捷键" },
      ],
    },
    // {
    //   title: "易用性",
    //   children: [
    //     { field: "control", title: "综合" },
    //     { field: "panel", title: "色盲模式" },
    //     { field: "actionBar", title: "文本转语音" },
    //   ],
    // },
    // {
    //   title: "系统",
    //   children: [
    //     { field: "control", title: "图形" },
    //     { field: "panel", title: "音频" },
    //     { field: "actionBar", title: "语言" },
    //     { field: "actionBar", title: "网络" },
    //   ],
    // },
  ],
}



