
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
    { value: 1002, label: "阵营1002" },
    { value: 1003, label: "阵营1003" },
    { value: 1004, label: "阵营1004" },
    { value: 1005, label: "阵营1005" },
    { value: 1006, label: "阵营1006" },
    { value: 1007, label: "阵营1007" },
    { value: 1008, label: "阵营1008" },
    { value: 1009, label: "阵营1009" },
    { value: 1010, label: "阵营1010" },
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



