

export default {
 

  // 模型库/皮肤列表数据
  modelsList: [
    {
      id:"",
      param:{
        chassisWidth:2.2, //车身宽
        chassisHeight:1.24,//车身高
        chassisLength:4.5, //车身长
        wheelAxisPositionBack:-1.42,//后轮距中心偏移
        wheelHalfTrackBack:0.9,//两个后轮之间的距离

        wheelAxisFrontPosition:1.1,// 前轮距中心偏移
        wheelHalfTrackFront:0.9,//两个前轮之间的距离
        wheelRadiusBack : 0.5, // 后轮半径
        wheelRadiusFront : 0.5, // 前轮半径
        wheelWidthFront:0.2,// 前轮宽度
        wheelWidthBack:0.3,// 后轮宽度
        massVehicle:1800, //质量
        maxEngineForce:2000, //引擎最大马力
      },
      name: "car001",
      bodyOffset:{x:0,y:-0.61,z:-0.3},
      icon:"images/models/tree003.png",
      carBodyPath: "models/car/carBody002.gltf",
      wheelPath: "models/car/wheel002.gltf",
    },    
    {
      id:"",
      param:{
        chassisWidth:2.2, //车身宽
        chassisHeight:1.24,//车身高
        chassisLength:4.5, //车身长
        wheelAxisPositionBack:-1.42,//后轮距中心偏移
        wheelHalfTrackBack:0.9,//两个后轮之间的距离

        wheelAxisFrontPosition:1.1,// 前轮距中心偏移
        wheelHalfTrackFront:0.9,//两个前轮之间的距离
        wheelRadiusBack : 0.5, // 后轮半径
        wheelRadiusFront : 0.5, // 前轮半径
        wheelWidthFront:0.2,// 前轮宽度
        wheelWidthBack:0.3,// 后轮宽度
        massVehicle:1800, //质量
        maxEngineForce:2000, //引擎最大马力
      },
      name: "car002",
      bodyOffset:{x:0,y:-0.61,z:-0.3},
      icon:"images/models/tree003.png",
      carBodyPath: "models/car/carBody001.gltf",
      wheelPath: "models/car/wheel001.gltf",
    },    
    {
      id:"",
      param:{
        chassisWidth:1.5962, //车身宽
        chassisHeight:1.44,//车身高
        chassisLength:3.5, //车身长
        wheelAxisPositionBack:-1.3,//后轮距中心偏移
        // wheelHalfTrackBack:1.1,//两个后轮之间的距离 后轮距离远可以变三轮
        wheelHalfTrackBack:0.011,//两个后轮之间的距离

        wheelAxisFrontPosition:1.2,// 前轮距中心偏移
        wheelHalfTrackFront:0.01,//两个前轮之间的距离
        // wheelHalfTrackFront:1.11,//两个前轮之间的距离

        wheelRadiusBack : 0.56, // 后轮半径
        wheelRadiusFront : 0.56, // 前轮半径
        wheelWidthFront:0.1,// 前轮宽度
        wheelWidthBack:0.3,// 后轮宽度

        massVehicle:200, //质量
        maxEngineForce:1000, //引擎最大马力
      },
      name: "Motorcycle",
      bodyOffset:{x:0,y:-0.761,z:-0.3},
      icon:"images/models/tree003.png",
      carBodyPath: "models/car/Motorcycle.gltf",
      wheelPath: "models/car/wheel003.gltf",
    },     
    {
      id:"",
      param:{
        chassisWidth:2.2962, //车身宽
        chassisHeight:3.6074,//车身高
        chassisLength:8.05, //车身长
        wheelAxisFrontPosition:2.98,// 前轮距中心偏移
        wheelAxisPositionBack:-2.08,//后轮距中心偏移

        wheelHalfTrackFront:0.9,//两个前轮之间的距离
        wheelHalfTrackBack:0.9,//两个后轮之间的距离


        wheelRadiusBack : 0.54, // 后轮半径
        wheelRadiusFront : 0.54, // 前轮半径

        wheelWidthFront:0.1,// 前轮宽度
        wheelWidthBack:0.3,// 后轮宽度

        massVehicle:6800, //质量

        maxEngineForce:15000, //引擎最大马力
        maxBreakingForce:300, //回退或停止马力

       suspensionRestLength: 1.96,//轮胎悬架长度 越大越容易翻车

      },
      name: "Truck",
      bodyOffset:{x:0,y:-1.9080361,z:-0.1},
      // bodyOffset:{x:0,y:-0.80361,z:-0.1},
      icon:"images/models/tree003.png",
      carBodyPath: "models/car/carBody003.gltf",
      wheelPath: "models/car/wheel006.gltf",
    },    
  ],

}


