


export default {
  // 顶部导航栏
  tableList: [
    { id: 10000, content: "Metaverse", routerPath: "/selectScene", },
    { id: 10000, content: "Avatar", routerPath: "/selectPlayer", },
    { id: 10000, content: "Store", routerPath: "/store", },
    { id: 10000, content: "Need", routerPath: "/witkey", },
    { id: 10000, content: "CustomCreate", routerPath: "/selfPanel", },
    { id: 10000, content: "DevelopPlan", routerPath: "/developPlan", },
  ],

  // 通用
  base:{
    editor:"Editor",
    delete:"Del",
    visite:"visite",
    good:"good",
    name:" Name",
    create:" Create ",
    selectTemple:" selectTemple ",
    ok:"OK",
  },

  // 创作页
  customPanel: {
    title:" User Custom Create",
    currentTable: "Scene",
    createNewScene:"Create New",
    createNewSingle:"Create New",
    createNewHDR:"Create New",
    createNewUVanim:"Create New",
    tableList: [
      { content: "Scene" },
      { content: "Single" },
      { content: "HDR" },
      { content: "UV Animation" },
    ],
    // 场景模板
    sceneTemplate: [
      { templateType:"Scene", name: "First Person", content: "第一人称漫游" },
      { templateType:"Scene", name: "Third Person", content: "第三人称漫游" },
      { templateType:"Scene", name: "SingleModel", content: "单品展示" },
      { templateType:"Scene", name: "Pano", content: "全景图漫游" },
      // {title:"开车",content:"含动画的模型"},
    ],
    // 单品模板
    modelTemplate: [
      { id:1, templateType:"Model", name: "Static Model", content: "无动画的模型" },
      { id:2, templateType:"Model", name: "Animation Model", content: "含动画的模型" },
      { id:3,  templateType:"Model", name: "UV Animition Model", content: "轮播序列。如热点动效、特效动画" },
    ],
    hdrTip:"upload hdr and jpg",
    uvAnimTip:" upload uv animation texture",
  },
}



