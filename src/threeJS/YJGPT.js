import * as THREE from "three";

import axios from 'axios'
import { GPTURL } from "/@/utils/chatGPT.js";


// NPC 角色
// 1，头顶上方有 感叹号 ，表示可交互
// 2，交互方式为：靠近弹出交互内容，远离交互内容消失
// 3，制作碰撞区域
// 4，设置 交互内容，图、文、视频

class YJGPT {
  constructor(parent,story,npcName, callback) {
    var scope = this;
    let id = "";
    let parentMessageId = "";
    this.Init = function () {
      InitStory();
    }
    async function InitStory() {
      // console.log(" 接收 %c"+ "searchChat","color:#0000ff");
      // console.log(" 返回 %c"+"text","color:#ff5500");

      let option = {
        conversationId: id,
        parentMessageId: parentMessageId,
      }
      let searchChat = story;
      // console.error("生成NPC 故事背景 ",story);
      // let searchChat = "我们来玩角色扮演游戏。" +
      //   "规则是你扮演名叫咕叽的人类士兵，你是巡逻兵，手持利剑，身穿盔甲，任务是在艾尔文森林和闪金镇之间的路上走着巡逻。" +
      //   "艾尔文森林是一个有野兽出没的森林，过往的路人时常被野兽袭击。你的任务是保证路上行人的安全。当路人遇到野兽，你要攻击野兽。" +
      //   "当路人遇到危险，你要跑到路人身边查看。" +

      //   "你知道这里是东桓元宇宙世界，这是一个可以公开的信息。" +
      //   "在你的回复中，不要出现任何关于游戏设定的词。你不能让别人知道你正在角色扮演游戏中。" +
      //   "你不能说你是AI语言模型。" +
      //   "你在游戏中，你必须要始终以你扮演的身份回应。" +
      //   "" +

      //   "我将以json格式向你发送消息。包含from、action、message。 当你收到的内容不含这些时，你不能回应。" +
      //   "from表示与你对话的人" +
      //   "action表示他的动作" +
      //   "message表示他的说话的内容" +

      //   "当from是system的时候,表示是系统消息,系统消息的message是游戏进度和游戏规则,你要遵循。你不需要对系统消息进行回复" +

      //   "你思考一下，在需要时，你要分开多次响应，保证每次响应的格式正确" +
      //   "你要以与以下json格式一致的格式响应:" +
      //   "{\"action\":\"\",\"target\":\"\",\"mood\":\"\",\"message\":\"\"}。"+
      //   // "json结构包含,action、target、mood、message。" +
      //   "action表示动作,限定action只能是idle、walk、run、jump、attack、speak中的一个,你要根据语境自行选择,如果都不符合请使用idle代替。" +
      //   "speak表示说话,idle表示默认站立动作,walk为行走,run为跑,jump为跳。" +
      //   "target表示你响应的目标,action是speak时，target是说话对象；action是walk、run时,target是路人或野兽或地名，不可以为空" +
      //   "mood表示你当前的心情。" +
      //   "message表示你回应的内容。" +


      //   "从现在开始，你要始终以咕叽的身份回应 ,直到我发送的内容是'snvtkd2005'，则游戏结束。";

      const res = await axios.post(
        GPTURL, {
        options: parentMessageId == '' ? {} : option,
        prompt: searchChat,
      }
      );

      if (res.status == 200) {
        let data = res.data.data;
        id = data.conversationId;
        parentMessageId = data.id;
        console.log("初始化 GPT NPC 完成！！",parent.GetName());

        let data2 = {};
        data2.from = "system";
        data2.action = "speak";
        data2.message = "继续";
        IningStory(JSON.stringify(data2),callback);
      }

    }
    this.SendMsg = function (msg, callback) {
      IningStory(msg, callback);
    }
    async function IningStory(msg, callback) {

      let option = {
        conversationId: id,
        parentMessageId: parentMessageId,
      }

      let searchChat = msg;
      console.log("向 "+ npcName+ " 发送  %c"+ searchChat,"color:#0000ff");
      const res = await axios.post(
        GPTURL, {
        options: parentMessageId == '' ? {} : option,
        prompt: searchChat,
      }
      );

      if (res.status == 200) {
        let data = res.data.data;
        let text = data.text;
        let dataJson = "";
        try {
          dataJson = JSON.parse(text);
        } catch (error) {
          // console.log("解析错误 111 ", error, text);
          
          let sp = text.split("(");
          let sp2 = sp[0].split("（");
          let text22 = sp2[0];
          try {
            dataJson = JSON.parse(text22);
            // let sp3 = sp2[1].split("）");
            // let sp4 = sp3[0].split(")");
            // dataJson.message += sp4[0];

          } catch (error) {
            // console.log("再次解析错误 222 ", error, text22);
            scope.Init();
          }
        }
        if (callback) {
          callback(dataJson);
        }
        console.log( npcName  + " 返回 %c"+text,"color:#ff1100");
        id = data.conversationId;
        parentMessageId = data.id;
      }

    }

    // Init();


  }
}

export { YJGPT };