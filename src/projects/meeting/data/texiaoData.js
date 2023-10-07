


// 特效配置
export default {

  // 是否使用本地数据
  useLocal:true,
  // 灯牌
  dengPaiList: [
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_jikejunyi.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_huyanbin.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_liuboxin.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_rongzuer.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_wangheye.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_wanglinkai.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_wangsulong.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_xilin.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_yuwenwen.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_zhangbichen.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_zhangliangying.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_zhouyan.glb"},
    {icon:"",modelPath: "models/playerSkin/dengpai/dengpai_boyuan.glb"}, 
  ],
  // 荧光棒
  lightStickList: [
    {icon:"",modelPath:"models/playerSkin/yyb002_0408a.glb"},
    {icon:"",modelPath:"models/playerSkin/yyb005_0408a.glb"},
    {icon:"",modelPath:"models/playerSkin/yyb006_0408a.glb"}, 
  ],
  // 表情
  expressionPath: [
    {icon:"",title:"",expression: "images/mico.png"},
    {icon:"",expression: "images/胡萝卜.png"},
    {icon:"",expression: "images/南瓜.png"}, 
  ],
  // 聊天预设语句
  DefaultChatList:[

  ],
  // 进场动画 路径
  EnterShowURL:"",
  // 转场动画 路径
  ChangeShowURL:"",
  // 特效 气球雨模型地址
  balloonList:[
    "models/playerSkin/balloon_yellow.glb",
    "models/playerSkin/balloon_purple.glb",
    "models/playerSkin/balloon_pink.glb",
  ],
  // 特效 烟花模型地址
  fireworkList:[
    "hotpoint.png",
    "hotpoint2.png",
  ],
  // npc对话框内容

  // 导播固定视角
  // 导播轨迹
  // npc替换
  npcData: {
    // 是否有npc。是否上线
    hasNpc:true,
    //npc皮肤名。写死。 guxiaoyu+001/002/003 最大到020; 后台传id，前端拼接皮肤名
    avatarName: "guxiaoyu",
    // avatarName: "guxiaoyu001",
    // 模型路径
    modelPath: "models/player/guxiaoyu.glb",
    // 坐标
    pos: {
      "x": -6.059999942779541,
      "y": 1.659999966621399,
      "z": 250.89999389648438
    },
    // 旋转Y轴，决定朝向
    rotaY: 1,
    message: {
      npcName: "",
      defaultAnimName: "hello",
      id: "npc001",
    }
  },

  // 男生换装数据 
  maleSkinData: [
    {
      content: "head",
      selected: 0,
      title: "head",
      // 查找模型名中的关键字
      part: "head",
      mode: "model",
      icon: [
        "models/playerSkin/fbx/UTC_hair.png", 
      ],
      modelPath: [
        "models/skin0510/body_male/body_male.gltf", 
      ], 
    }, 
    {
      content: "发型",
      selected: 0,
      title: "hair",
      // 查找模型名中的关键字
      part: "hair",
      mode: "model",
      icon: [
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",

        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
      ],
      modelPath: [
        "models/skin0510/hair_male/male_hair0.glb",
        "models/skin0510/hair_male/male_hair1.glb",
        "models/skin0510/hair_male/male_hair2.glb",
        "models/skin0510/hair_male/male_hair3.glb",
        "models/skin0510/hair_male/male_hair4.glb",
        
        "models/skin0510/hair_male/male_hair5.glb",
        "models/skin0510/hair_male/male_hair6.glb",
        "models/skin0510/hair_male/male_hair7.glb",
        "models/skin0510/hair_male/male_hair8.glb",
        "models/skin0510/hair_male/male_hair9.glb", 

      ],

    },
    {
      content: "衣服",
      selected: 0,
      title: "coat",
      // 查找模型名中的关键字
      part: "costume",
      mode: "model",
      icon: [
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        
      ],
      modelPath: [
        "models/skin0510/male_up/1680867736999103721_male_boy_004_up.gltf",
        "models/skin0510/male_up/1680958158561197788_male_boy_005_up.gltf",
        "models/skin0510/male_up/1680867791551558315_male_boy_006_up.gltf",
        "models/skin0510/male_up/1680867817597850089_male_boy_007_up.gltf",
        "models/skin0510/male_up/1680867840219745461_male_boy_008_up.gltf",

        "models/skin0510/male_up/1680867686091361269_male_boy_009_up.gltf",
        "models/skin0510/male_up/1680867615547483049_male_boy_010_up.gltf",
        "models/skin0510/male_up/1680867631448682269_male_boy_011_up.gltf",
        "models/skin0510/male_up/1680867643869426794_male_boy_012_up.gltf", 
 
      ]
    },
    
    {
      content: "裤子",
      selected: 0,
      title: "pantsuit",
      // 查找模型名中的关键字
      part: "pantsuit",
      mode: "model",
      icon: [
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
         
      ],
      modelPath: [
      

        "models/skin0510/male_down/1680869164830082454_male_boy_004_down.gltf",
        "models/skin0510/male_down/1680869213817370822_male_boy_005_down.gltf",
        "models/skin0510/male_down/1680869250455915415_male_boy_006_down.gltf",
        "models/skin0510/male_down/1680869289142671696_male_boy_007_down.gltf",
        "models/skin0510/male_down/1680961433677139038_male_boy_009_down.gltf",

        "models/skin0510/male_down/1680961451693130575_male_boy_010_down.gltf",
        "models/skin0510/male_down/1680869396203947564_male_boy_011_down.gltf",
        "models/skin0510/male_down/1680869418348137973_male_boy_012_down.gltf",
      ]
    },
    
    {
      content: "鞋子",
      selected: 0,
      title: "shoes",
      // 查找模型名中的关键字
      part: "shoes",
      mode: "model",
      icon: [
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png", 

        "models/skin0510/fbx/UTC_body.png", 
      ],
      modelPath: [
        "models/skin0510/male_shoes/1680870980459395702_male_boy_001_shoes.gltf",
        "models/skin0510/male_shoes/1680871020336678210_male_boy_002_shoes.gltf",
        "models/skin0510/male_shoes/1680871040527114570_male_boy_003_shoes.gltf",
        "models/skin0510/male_shoes/1680871588179046341_male_boy_004_shoes.gltf",
        "models/skin0510/male_shoes/1680871455937710585_male_boy_007_shoes.gltf",

        "models/skin0510/male_shoes/1680871487563808213_male_boy_008_shoes.gltf",
        "models/skin0510/male_shoes/1680871518272383553_male_boy_009_shoes.gltf",
        "models/skin0510/male_shoes/1680871553467554503_male_boy_012_shoes.gltf",

        "models/skin0510/xf/xifu_sh.gltf",//西服鞋子

      ]
    },

    // 套装
    {
      content: "套装",
      selected: 0,
      title: "suit",
      // 查找模型名中的关键字
      part: "suit",
      mode: "model",
      icon: [

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png", 
        
        "models/skin0510/fbx/UTC_body.png", 
      ],
      modelPath: [

        "models/skin0510/add/male/1680867457984793400_male_boy_001_fullbody.gltf",
        "models/skin0510/add/male/1680867481750724293_male_boy_002_fullbody.gltf",
        "models/skin0510/add/male/1680867496974118428_male_boy_003_fullbody.gltf",

        "models/skin0510/xf/xifu.gltf", //西服

      ]
    },
  ],

  // 女生换装数据
  femaleSkinData: [
    {
      content: "head",
      selected: 0,
      title: "head",
      // 查找模型名中的关键字
      part: "head",
      mode: "model",
      icon: [ 
        "models/playerSkin/fbx/UTC_hair.png",
      ],
      modelPath: [ 
        "models/skin0510/body_female/body_female.gltf", 
      ], 
    }, 
    {
      content: "发型",
      selected: 0,
      title: "hair",
      // 查找模型名中的关键字
      part: "hair",
      mode: "model",
      icon: [ 
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",

        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
        "models/playerSkin/fbx/Misaki_hair.png",
      ],
      modelPath: [ 
        
        "models/skin0510/hair_female/female_hair0.glb",
        "models/skin0510/hair_female/female_hair1.glb",
        "models/skin0510/hair_female/female_hair2.glb",
        "models/skin0510/hair_female/female_hair3.glb",
        "models/skin0510/hair_female/female_hair4.glb",
        
        "models/skin0510/hair_female/female_hair5.glb",
        "models/skin0510/hair_female/female_hair6.glb",
        "models/skin0510/hair_female/female_hair7.glb",
        "models/skin0510/hair_female/female_hair8.glb",
        "models/skin0510/hair_female/female_hair9.glb",

      ],

    },
    {
      content: "衣服",
      selected: 0,
      title: "coat",
      // 查找模型名中的关键字
      part: "costume",
      mode: "model",
      icon: [
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png", 
        "models/skin0510/fbx/UTC_body.png",
 
         
      ],
      modelPath: [
 
        "models/skin0510/female_up/1680868368443158956_female_girl_009_up.gltf",
        "models/skin0510/female_up/1680868399976476217_female_girl_010_up.gltf",
        "models/skin0510/female_up/1680868422046146737_female_girl_011_up.gltf",
        "models/skin0510/female_up/1680961713796726339_female_girl_012_up.gltf",
        "models/skin0510/female_up/1680868485238064136_female_girl_013_up.gltf",
        "models/skin0510/female_up/1680868556702490793_female_girl_014_up.gltf",
        "models/skin0510/female_up/1680868594683539487_female_girl_015_up.gltf",
        "models/skin0510/female_up/1680868621921690890_female_girl_016_up.gltf",
        "models/skin0510/female_up/1680868645045737253_female_girl_017_up.gltf",
        "models/skin0510/female_up/1680868672935028386_female_girl_018_up.gltf",

      ]
    },
    
    {
      content: "裤子",
      selected: 0,
      title: "pantsuit",
      // 查找模型名中的关键字
      part: "pantsuit",
      mode: "model",
      icon: [
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
      ],
      modelPath: [
 

        "models/skin0510/female_down/1680869488708034475_female_girl_009_down.gltf",
        "models/skin0510/female_down/1680869515034811586_female_girl_010_down.gltf", 
        "models/skin0510/female_down/1680869544413908129_female_girl_011_down.gltf",
        "models/skin0510/female_down/1680869568872978735_female_girl_012_down.gltf",
        "models/skin0510/female_down/1680869593169080952_female_girl_013_down.gltf",

        "models/skin0510/female_down/1680869679070996847_female_girl_014_down.gltf",
        "models/skin0510/female_down/1680958821908678898_female_girl_015_down.gltf",
        "models/skin0510/female_down/1680958836308411444_female_girl_016_down.gltf",
        "models/skin0510/female_down/1680958849933465451_female_girl_017_down.gltf",
        "models/skin0510/female_down/1680869785951096208_female_girl_018_down.gltf",
        
      ]
    },
    
    {
      content: "鞋子",
      selected: 0,
      title: "shoes",
      // 查找模型名中的关键字
      part: "shoes",
      mode: "model",
      icon: [
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png", 

        "models/skin0510/fbx/UTC_body.png",
        
        "models/skin0510/fbx/UTC_body.png",
      ],
      modelPath: [
     
        
        "models/skin0510/female_shoes/1680870477715116263_female_girl_001_shoes.gltf",
        "models/skin0510/female_shoes/1680870506134258982_female_girl_002_shoes.gltf",
        "models/skin0510/female_shoes/1680870527070115361_female_girl_003_shoes.gltf",
        "models/skin0510/female_shoes/1680870555065292333_female_girl_004_shoes.gltf",
        "models/skin0510/female_shoes/1680870577985733781_female_girl_005_shoes.gltf",

        "models/skin0510/female_shoes/1680870604378198672_female_girl_007_shoes.gltf",
        "models/skin0510/female_shoes/1680870627273506492_female_girl_008_shoes.gltf",
        "models/skin0510/female_shoes/1680870688921950106_female_girl_009_shoes.gltf",
        "models/skin0510/female_shoes/1680870711786170384_female_girl_010_shoes.gltf",
        "models/skin0510/female_shoes/1680870743411574024_female_girl_011_shoes.gltf",

        "models/skin0510/female_shoes/1680870782879771288_female_girl_012_shoes.gltf",
        "models/skin0510/female_shoes/1680870807228108604_female_girl_013_shoes.gltf",
        "models/skin0510/female_shoes/1680870834793673182_female_girl_014_shoes.gltf",
        "models/skin0510/female_shoes/1680870892146199607_female_girl_015_shoes.gltf",
        "models/skin0510/female_shoes/1680870920301677042_female_girl_016_shoes.gltf",

        "models/skin0510/female_shoes/1680870946837909573_female_girl_017_shoes.gltf", 
        
        
        "models/skin0510/xf/xifu_sh.gltf",//西服鞋子
      ]
    },

    // 套装
    {
      content: "套装",
      selected: 0,
      title: "suit",
      // 查找模型名中的关键字
      part: "suit",
      mode: "model",
      icon: [

        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png",
        "models/skin0510/fbx/UTC_body.png", 
        
        "models/skin0510/fbx/UTC_body.png", 
      ],
      modelPath: [

        "models/skin0510/add/female/1680867341011114707_female_girl_001_fullbody.gltf",
        "models/skin0510/add/female/1680867387265850664_female_girl_002_fullbody.gltf",
        "models/skin0510/add/female/1680867418572848239_female_girl_003_fullbody.gltf",
        
        "models/skin0510/xf/xifu.gltf", //西服

      ]
    },
  ],


}



