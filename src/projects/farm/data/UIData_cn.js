


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

  base:{
    editor:"编辑",
    delete:"删除",
    visite:"访问",
    good:"点赞",
    name:"名",
    create:"创建",
    selectTemple:"选择模板",
    ok:"确定",
  },


  // 创作页
  customPanel: {
    currentTable: "场景",
    title:"创作",
    createNewScene:"创建新场景",
    createNewSingle:"创建新单品",
    createNewHDR:"上传", //创建新HDR
    createNewUVanim:"上传", //创建新UV动画
    tableList: [
      { content: "场景" },
      { content: "单品" },
      { content: "HDR" },
      { content: "通用图片" },
    ],
    // 场景模板
    sceneTemplate: [
      {  templateType:"Scene",name: "第一人称", content: "第一人称漫游" },
      {  templateType:"Scene",name: "第三人称", content: "第三人称漫游" },
      {  templateType:"Scene",name: "单品展示", content: "单品展示" },
      {  templateType:"Scene",name: "360全景", content: "全景图漫游" },
    ],
    // 单品模板
    modelTemplate: [
      { id:1,templateType:"Model",  name: "静态模型",panel:"", content: "无动画的模型" },
      { id:2,templateType:"Model",  name: "动画模型",panel:"", content: "含动画的模型" },
      { id:3, templateType:"Model", name: "uv模型",panel:"uvAnim", content: "轮播序列。如热点动效、特效动画" },
      { id:4, templateType:"Model", name: "汽车模型",panel:"car", content: "使用静态模型组合成汽车" },
      { id:5, templateType:"Model", name: "装备模型",panel:"weapon", content: "装备模型 。如武器" },
      { id:6, templateType:"Model", name: "屏幕模型",panel:"screen", content: "屏幕容器模型 。可以播放图片、视频、直播流" },
      { id:7, templateType:"Model", name: "粒子特效",panel:"particle", content: "粒子特效" },
    ],
    hdrTip:"上传hdr及其缩略图jpg",
    uvAnimTip:"上传图片",
  },

}

