



import * as THREE from "three";
import { RandomInt } from "../../../utils/utils";
import { YJNPCManager } from "./YJNPCManager.js";
import { YJPlayerManager } from "./YJPlayerManager.js";
// 战斗管理
class YJFireManager {
  constructor() {
    let scope = this;
    let playerList = [];

    let _YJNPCManager = null;
    let _YJPlayerManager = null;
    function Init() {
      _Global._YJFireManager = scope;
      _YJNPCManager = new YJNPCManager();
      _YJPlayerManager = new YJPlayerManager();
    }
    this.GetNPCs = function () {
      return playerList;
    }
    this.GetOtherNoSameCampInArea = function (camp, vaildDistance, max, centerPos, ingoreNpcId) {
      let npcs = _YJNPCManager.GetOtherNoSameCampInArea(camp, vaildDistance, max, centerPos, ingoreNpcId);
      let players = _YJPlayerManager.GetOtherNoSameCampInArea(camp, vaildDistance, max, centerPos, ingoreNpcId);
      for (let j = 0; j < players.length; j++) {
        npcs.push(players[j]);
      }
      return npcs;
    }

    // 获取生命值最小的友方角色，包含自身
    this.GetSameCampMinHealth = function (camp) {
      let npcs = _YJNPCManager.GetSameCamp(camp);
      let players = _YJPlayerManager.GetSameCamp(camp);
 
      let max = 100;
      let _player = null;
      for (let i = 0; i < npcs.length; i++) {
        const player = npcs[i]; 
        if (player.GetHealthPerc() < max) {
          max = player.GetHealthPerc();
          _player = player;
        }
      }
      for (let i = 0; i < players.length; i++) {
        const player = players[i]; 
        if (player.GetHealthPerc() < max) {
          max = player.GetHealthPerc();
          _player = player;
        }
      }
      if (_player == null) { 
        return null;
      }
      return _player;
    }

    this.GetSameCampByRandom = function (camp) {
      let npcs = _YJNPCManager.GetSameCamp(camp);
      let players = _YJPlayerManager.GetSameCamp(camp);
      for (let j = 0; j < players.length; j++) {
        npcs.push(players[j]);
      }
      if(npcs.length==0){
        return null;
      }
      return npcs[RandomInt(0,npcs.length-1)] ;
    }

    this.GetNoSameCampByRandom = function (camp) {
      let npcs = _YJNPCManager.GetNoSameCamp(camp);
      let players = _YJPlayerManager.GetNoSameCamp(camp);
      for (let j = 0; j < players.length; j++) {
        npcs.push(players[j]);
      }
      if(npcs.length==0){
        return null;
      }
      return npcs[RandomInt(0,npcs.length-1)] ;
    }
  
    this.GetNpcOrPlayerById = function(id){
      let npc = _YJNPCManager.GetNpcComponentById(id);
      if(npc != null){
        return npc;
      }
      return _YJPlayerManager.GetPlayerById(id)
    }

    Init();

  }
}

export { YJFireManager };