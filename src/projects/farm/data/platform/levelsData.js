


export default {

 
  // 每个等级需要的exp
  /**
    level:1, //当前等级
    exp:200,//当前等级升级所需经验值
    rewardType:"",//升级时奖励类型。 道具items、技能skill
    rewardIds:[],//奖励id
    //当前等级需要击杀多少个敌人才能升级 
   */
  needExpByLevels:[
    {level:1,exp:30,rewardType:"skill",},
    {level:2,exp:70,rewardType:"skill",},
    {level:3,exp:100,rewardType:"skill",},

    // {level:1,exp:100,rewardType:"skill",},
    // {level:2,exp:130,rewardType:"skill",},
    // {level:3,exp:140,rewardType:"skill",},

    // {level:1,exp:100,rewardType:"items",},
    // {level:2,exp:150,rewardType:"items",},
    // {level:3,exp:200,rewardType:"skill",},
    {level:4,exp:380,rewardType:"skill", },
    {level:5,exp:380,rewardType:"skill",},
    {level:6,exp:460,rewardType:"items",},
    {level:7,exp:460,rewardType:"items",},
    {level:8,exp:1000,rewardType:"items",},
    {level:9,exp:1000,rewardType:"items",},
    {level:10,exp:2000,rewardType:"items",},
    {level:11,exp:6000000,rewardType:"items",},
  ], 
  
}



