


export default {
  // 顶部导航栏
  tableList: [
    { id: 10000, content: "元宇宙", routerPath: "/selectScene", },
    { id: 10000, content: "虚拟形象", routerPath: "/selectPlayer", },
    { id: 10000, content: "素材库", routerPath: "/store", },
    { id: 10000, content: "模型需求", routerPath: "/witkey", },
    { id: 10000, content: "创作", routerPath: "/selfPanel", },
    { id: 10000, content: "开发计划", routerPath: "/developPlan", },
  ],

  base: {
    editor: "编辑",
    delete: "删除",
    visite: "访问",
    good: "点赞",
    name: "名",
    create: "创建",
    selectTemple: "选择模板",
    ok: "确定",
  },


  // 创作页
  customPanel: {
    currentTable: "场景",
    title: "创作",
    createNewScene: "创建新场景",
    createNewSingle: "创建新单品",
    createNewHDR: "上传", //创建新HDR
    createNewUVanim: "上传", //创建新UV动画
    tableList: [
      { content: "场景" },
      { content: "单品" },
      { content: "HDR" },
      { content: "通用图片" },
      { content: "技能" },
    ],
    // 场景模板
    sceneTemplate: [
      // {  templateType:"Scene",name: "第一人称", content: "第一人称漫游" },
      { templateType: "Scene", name: "第三人称", content: "第三人称漫游场景" },
      // {  templateType:"Scene",name: "单品展示", content: "单品展示" },
      // {  templateType:"Scene",name: "360全景", content: "全景图漫游" },
    ],
    // 单品模板
    modelTemplate: [
      { id: 1, templateType: "Model", name: "静态模型", panel: "", content: "无动画的模型" },
      { id: 2, templateType: "Model", name: "动画模型", panel: "", content: "含动画的模型" },
      { id: 3, templateType: "Model", name: "uv模型", panel: "uvAnim", content: "轮播序列。如热点动效、特效动画" },
      { id: 4, templateType: "Model", name: "汽车模型", panel: "car", content: "使用静态模型组合成汽车" },
      { id: 5, templateType: "Model", name: "装备模型", panel: "weapon", content: "可拾取模型 。如武器" },
      { id: 6, templateType: "Model", name: "屏幕模型", panel: "screen", content: "屏幕容器模型 。可以播放图片、视频、直播流" },
      { id: 7, templateType: "Model", name: "粒子特效", panel: "particle", content: "粒子特效" },
      { id: 8, templateType: "Model", name: "角色模型", panel: "player", content: "角色模型。玩家可控角色，必须包含待机idle、行走walk动作" },
      { id: 9, templateType: "Model", name: "NPC模型", panel: "npc", content: "场景npc。形象从角色模型中选择，执行一系列事件" },
      { id: 10, templateType: "Model", name: "交互模型", panel: "interactive", content: "碰到模型或点击模型触发交互事件" },
      { id: 11, templateType: "Model", name: "拖尾模型", panel: "trail", content: "拖尾模型" },
      { id: 12, templateType: "Model", name: "组合模型", panel: "", content: "模型组合" },
    ],
    selectModel: [
      { name: "静态模型" },
      { name: "动画模型" },
      { name: "uv模型" },
      { name: "汽车模型" },
      { name: "装备模型" },
      { name: "屏幕模型" },
      { name: "粒子特效" },
      { name: "NPC模型" },
      { name: "交互模型" },
      { name: "组合模型" },
    ],
    hdrTip: "上传hdr及其缩略图jpg",
    uvAnimTip: "上传图片",
  },

}

