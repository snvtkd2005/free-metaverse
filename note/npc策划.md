
NPC制作
npc名称设置、
行为设置（行为树）、
事件类型（类型设置：无事件、
有弹窗：无对话、有对话、有任务、商人）
内容数据、

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