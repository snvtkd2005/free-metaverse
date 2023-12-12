
NPC制作
npc名称设置、
行为设置（行为树）、
事件类型（类型设置：无事件、
有弹窗：无对话、有对话、有任务、商人）
内容数据、

npcData{
    生命值
}

战斗策略：{

如何进入战斗状态
    进入监视范围主动发起攻击
    被攻击

进入战斗状态后的行为
    if 在攻击范围内
        攻击
    else 
        跑向敌人
        再次检测是否在攻击范围内
    血量<=0时，死亡

如何脱离战斗状态
    战斗目标消失
    离初始位置太远

脱离战斗状态后
    回血
    快速回到战斗前位置
    回到战斗前位置后执行战斗前行为
    
}




const eventType = {
    No:'no',//无事件
    OnlyContent:'onlyContent',//只有文字内容
    Talk:"talk",//有用户选择，选择后显示新的文字内容。用来讲故事
    Task:"task",//任务
    Business:"business",//商人
}
内容数据
只显示文本
contentData:{
    //OnlyContent
    title:"",
    content:""
}

对话
contentData:{
    //Talk
    title:"",
    content:"",
    children:[
        {title:"",content:""},
        {title:"",content:""}
    ], 
}

任务
contentData:{
    //Talk
    title:"",
    content:"",
    children:[taskId], 
}

任务数据
taskData:{
    id:"",

}

商人
contentData:{
    //Business
    title:"",
    content:"",
    children:[merchandiseId], //MerchandiseId 商品id
}

商品数据
merchandiseData:{
    id:"",
    
}

npc的同步数据
playerId //目标id
health //当前生命值
maxHealth //最大生命值
pos //当前坐标点
targetPos //目标坐标点
animName //动作
camp // 阵营：1001联盟npc、1002部落npc、10000怪物、9000中立、8000友善（由玩家相对npc友好度决定）

技能策划
技能触发时机{
    perSecond每隔n秒触发,
    health血量到达n%触发,
}
技能效果{
    damage 造成n点伤害,
    冻结,
    眩晕,
    震退,
    perDamage 每m秒造成n点伤害,
}
技能目标{
    随机一人,
    目标一人,
    最多n人,
    所有人,
}
技能效果增强{
    none,
    infect传染,
}
技能效果持续时间{ 
    n秒,
}

整个战斗技能
skillList = [
    {
        //技能名
        skillName:"精准打击",
        //触发时机
        trigger:{type:"perSecond",value:10},
        //目标
        target:{ type: "target", value: 1 },// random  target all
        //效果
        effect:{type:"damage",value:10}, //
        //效果增强
        effectEnhance:"none",
        //持续时间。perDamage、冻结、眩晕等状态效果才需要持续时间
        duration:0,
    },
];