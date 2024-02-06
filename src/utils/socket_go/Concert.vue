<template>
  <div id="three-dom"></div>
</template>

<script>
import { App } from '@/js/base/app';
import { reactive, toRefs } from "vue";
import { useCounterStore } from '@/stores/counter';
import { mapState, mapWritableState, mapStores } from 'pinia';
import * as world_configs from '@/configs';

export default {
  // 状态
  data() {
    return {
      mem_userInfo:{'UID':"0"}
    }
  },
  // 动作
  methods: {
    login(ret){
      console.log(this.mem_userInfo);
      //return;
      //登录socket
      //console.log(world_configs.DOWNSTREAM_AVATAR_LOGIN_ACK);
      this.$socket.send({
        "avatarId": this.userinfo.UID,
        "msgType": "UPSTREAM_AVATAR_LOGIN",
        "avatarLogin": { "venueId": this.venueId, "worldId": this.worldId }
      });
    },
    //socket返回的数据
    getWsData (ret) {
        console.log('websocket接收到的值', ret);        
        //console.log(this.userinfo);
        //console.log(this.mem_userInfo);
        switch(ret.Msg.msg_type){
          case world_configs.DOWNSTREAM_AVATAR_LOGIN_ACK:
            //登录返回数据包
            this.mem_userInfo.UID=String(ret.Msg.MsgOneof.AvatarLoginAck.init_location.avatar_id);
            console.log(this.mem_userInfo);
            //附近的人
            const surrounding_avatar_locations=ret.Msg.MsgOneof.AvatarLoginAck.surrounding_avatar_locations;
            if (surrounding_avatar_locations && surrounding_avatar_locations.length>0){
              surrounding_avatar_locations.forEach(item => {
                APPX.createPlayer(item);
              })
            }
            //测试发送位移
            this.postPosition(ret.Msg.MsgOneof.AvatarLoginAck.init_location.map_position);
          break;
          case world_configs.DOWNSTREAM_AVATAR_MOVE:
            //位置变化
            console.log('位置变化');
          break;
          case world_configs.DOWNSTREAM_AVATAR_USER_LOGIN:
            //有其他人登录
            console.log(ret.Msg.MsgOneof.AvatarLoginNotify.location.avatar_id,'登录系统');
            //加载人物
            APPX.createPlayer(ret.Msg.MsgOneof.AvatarLoginNotify.location);
          break;
          default: 
              //return 0; 
          break; 
        }
        //测试发送位置数据
        
        //console.log(ret);
        /*this.cdata.category.forEach(item => {
          if (dataRec.materialClassifyName === item.materialClassifyName) {
            item.rate = dataRec.rate
          }
        })*/
    },
    roundUID(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*minNum+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    },
    postPosition(mapinfo){
      console.log('-------------postPosition-----');
      this.$socket.send({
        "avatarId": this.mem_userInfo.UID,
        "msgType": "UPSTREAM_AVATAR_MOVE",
        "AvatarMove": { "location": {
          "avatar_id":this.mem_userInfo.UID,
          "map_position":{
            /*"x":this.roundUID(1,3),
            "y":this.roundUID(1,3),
            "z":this.roundUID(1,3),*/
            "x":mapinfo.x+0.001,
            "y":mapinfo.y+0.001,
            "z":this.roundUID(1,3),
            "venueId": this.venueId,
            "worldId": this.worldId
          },
          "direction":0,
          "timestamp_msec":new Date().getTime(),
          "avatar_render_data":'12345',
          "avatar_additional_data":{"Props":{
            // PropID 道具ID
            "PropID" : 1,
            // PartID 部件ID，用于索引渲染信息
            "PartID" : 2,
            // Position 地图位置
            "Position" : {
              "x":this.roundUID(1,3),
              "y":this.roundUID(1,3),
              "z":this.roundUID(1,3),
              "venueId": this.venueId,
              "worldId": this.worldId
            },
            // Direction 方向 x轴正方向为0度 顺时针 0-359 之间
            "Direction" : 4
          }}
        }, "speed": 2 }
      });
    },

  },
  computed:{
    ...mapWritableState(useCounterStore, ['userinfo', 'venueId', 'worldId'])
  },
  // 函数
  mounted(){
    // 初始化核心
    this.$nextTick(()=>{
      const dom = document.getElementById('three-dom');
      dom.style.width = document.body.clientWidth + 'px';
      dom.style.height = document.body.clientHeight+ 'px'
      APPX.init();
    })
    
    //setInterval(postPosition,3000);
    
  },
  created() {
      this.$socket.registerCallBack('productivity',this.getWsData);
      this.$socket.registerCallBack('logintivity',this.login);
  },
  destroyed() {
    this.$socket.unRegisterCallBack('logintivity');
    this.$socket.unRegisterCallBack('productivity');
  },
}
</script>