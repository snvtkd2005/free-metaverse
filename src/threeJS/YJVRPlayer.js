import * as THREE from "three";
import { Camera, Uniform } from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { createText } from 'three/examples/jsm/webxr/Text2D.js';

class YJVRPlayer {
  constructor(_this, scene, local,nickName) {


    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var playerGroup = null;
    var playerObj = null;

    var head = null;
    var body = null;
    var lefthand = null;
    var righthand = null;

    var headGroup = null;
    var lefthandGroup = null;
    var righthandGroup = null;
    var bodyGroup = null;

    var hasPlayer = false;
    var inSetDefaltPos = false;

    var namePosTrans = null;


    //初始化摄像机父物体，移动时，移动父物体， 旋转时，横向旋转父物体，竖向旋转摄像机
    const Init = () => {
      // LoadPlayer( "小孩");
    }
    Init();

    //角色高度，以此来决定姓名条高度
    var playerHeight = 170;
    this.LoadPlayer = function(playerName){
      var path = "";
      var texturePath = [];
      if(playerName == "小孩vr"){
        playerHeight = 90;
        path = "models/player/Model/vrchild" + ".fbx"
        texturePath =[ _this.$publicUrl +"models/player/Model/free_male_1_body_diffuse.jpg",
        _this.$publicUrl +"models/player/Model/free_male_1_head_diffuse.jpg"
        ];
      }
      if(playerName == "机器人"){
        playerHeight = 170;
        path = "models/player/Model/Robot KyleNew" + ".fbx"
        texturePath[0] = _this.$publicUrl + "models/player/Model/Robot_Color.png" ;
      }

      //添加组
      playerGroup = new THREE.Group(); 
      scene.add(playerGroup);

      loadFbx(path,playerName,texturePath);
    }

    //加载热点的obj 模型
    const loadFbx = (path,name,texturePath) => {

      var fbxLoader = new FBXLoader();
      fbxLoader.load(_this.$publicUrl +path, 
        function (object) {

          playerObj = object;

          playerObj.name = name;
          playerObj.position.set(0, 0, 0); //原点位置
          playerObj.rotation.set(0, 3.14 / 2, 0); // 
          // let size = 1;
          let size = 0.01;
          playerObj.scale.set(size, size, size);

          head = playerObj.children[0];
          body = playerObj.children[1];
          lefthand = playerObj.children[2];
          righthand = playerObj.children[3];
          playerGroup.add(playerObj);


          playerGroup.add(body);
          playerGroup.add(head);
          playerGroup.add(lefthand);
          playerGroup.add(righthand);
          body.scale.set(size, size, size);
          head.scale.set(size, size, size);
          lefthand.scale.set(size, size, size);
          righthand.scale.set(size, size, size);



          // console.log(" 加载模型完成 " + playerObj.name);
          if (local) {
            _this.YJVRController.SetPlayerBody(head,lefthand,righthand,body);
            _this.YJVRController.SetPlayerGroup(playerGroup);

          } else {
            // scene.add(playerObj);
            // playerGroup.add(playerObj);
            console.log("创建VR角色镜像");

            headGroup = new THREE.Group(); 
            lefthandGroup = new THREE.Group(); 
            righthandGroup = new THREE.Group(); 
            bodyGroup = new THREE.Group(); 
            
            playerGroup.add(headGroup);
            playerGroup.add(lefthandGroup);
            playerGroup.add(righthandGroup);
            playerGroup.add(bodyGroup);

            SetVRPlayerRefModel(headGroup,head,new THREE.Vector3(0,0.5,-0.1),new THREE.Vector3(3.14 / 2,3.14 / 1,0));
            // SetVRPlayerRefModel(lefthandGroup, lefthand, new THREE.Vector3(0, 0, -0.05), new THREE.Vector3(3.14, 3.14 / 1, 0));
            // SetVRPlayerRefModel(righthandGroup, righthand, new THREE.Vector3(0, 0, -0.05), new THREE.Vector3(3.14, 3.14 / 1, 0));
            SetVRPlayerRefModel(lefthandGroup, lefthand, new THREE.Vector3(0, 0, -0.00), new THREE.Vector3(3.14, 3.14 / 1, 0));
            SetVRPlayerRefModel(righthandGroup, righthand, new THREE.Vector3(0, 0, -0.00), new THREE.Vector3(3.14, 3.14 / 1, 0));
            SetVRPlayerRefModel(bodyGroup, body, new THREE.Vector3(0, 0, -0.00), new THREE.Vector3(3.14/2,3.14 / 1, 0));
            

          }
          // if (inSetDefaltPos) {
          //   // playerGroup.position.set(defultPos.x, defultPos.y, defultPos.z);
          //   playerGroup.position.set(0,0,0);
          // }

          // oldPos = getWorldPosition(playerGroup); 
          CreateNameTrans();
          return;
 
        } 
      );

    }

    function SetVRPlayerRefModel(target, child, offset, rota) {
      target.add(child);
            // 坐标轴
      // let axes = new THREE.AxesHelper(20); // 坐标轴
      // target.add(axes); // 场景添加坐标轴
      // axes.rotation.set(rota.x, rota.y, rota.z);
      // axes.position.set(offset.x, offset.y, offset.z);


      child.rotation.set(rota.x, rota.y, rota.z);
      child.position.set(offset.x, offset.y, offset.z);
      let size = 0.01;
      child.scale.set(size, size, size);
    }


    var lerpLength = 0;
    var currentTargetPos = new THREE.Vector3();  //平滑过渡时使用的变量
    var headpos = new THREE.Vector3();  //摄像机切换的目标坐标

    //刷新身体所在位置。身体在头的下方，在头部转到一定角度时，身体跟随旋转
    function updateBodyPos() {
      if (body == null) {
        return;
      }
      headpos = getWorldPosition(head);
      // if( isNaN(headpos.x) ||isNaN(headpos.y) ||isNaN(headpos.z) ){return;}

      // console.log(headpos);
      // lerpLength += 0.002;
      // currentTargetPos.lerp(headpos, lerpLength);
      // body.position.set(currentTargetPos.x, currentTargetPos.y-0.1, currentTargetPos.z);
      body.position.set(headpos.x, headpos.y-0.1, headpos.z);
      // console.log("body", body.position);
      // console.log("body 世界坐标",getWorldPosition(body));

    }

    //----------姓名条 开始-----------------
    //创建姓名条参考物体
    function CreateNameTrans() {
      // var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      // var material = new THREE.MeshBasicMaterial({
      //   color: 0xff0000,
      //   opacity: 1,
      //   transparent: true,
      // });
      // namePosTrans = new THREE.Mesh(geometry, material);

      namePosTrans = new THREE.Group(); 

      playerGroup.add(namePosTrans);
      // namePosTrans.position.set(0, playerHeight + 30, 0); //原点位置
      namePosTrans.position.set(0,  (playerHeight + 30)/100, 0); //原点位置
      hasPlayer = true;

      // const resetButton = makeButtonMesh( 0.2, 0.1, 0.01, 0x355c7d );
      const resetButton = new THREE.Group(); 

			const resetButtonText = createText( nickName, 0.06 );
			resetButton.add( resetButtonText );
			resetButtonText.position.set( 0, 0, 0.0051 );
			resetButtonText.scale.set( 1, 1, 1 );
			namePosTrans.add( resetButton );
			resetButton.position.set( 0, 0, 0 );
      var size = 2;
			resetButton.scale.set(size,size, size );

    }
    
    let videoPlane = null;
    //创建用户视频
    this.CreateVideo = function(video){
      if(video==null ){
        if( videoPlane!=null){
          clearObj(videoPlane);
          namePosTrans.remove(videoPlane); // 向该场景中添加物体
          videoPlane = null;
        }
        return;
      }
      // const video = document.getElementById("video");
      // video.play();
      console.log("用户视频",video);
      if(videoPlane == null){
        const _video = document.getElementById("video_" + video);
        let w = 0.5;
        let h = 0.5;
        // let w = 5;
        // let h = 5;
        let radius = 0.25;
        let planeGeometry = new THREE.CylinderGeometry(radius, radius, 0.01, 40, 1)
        // let planeGeometry = new THREE.PlaneGeometry(w, h, 1, 1); // 生成平面
        const texture = new THREE.VideoTexture(_video);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        videoPlane = new THREE.Mesh(planeGeometry, material);
        videoPlane.rotation.y =  Math.PI/2;
        videoPlane.rotation.x =  Math.PI/2;

  
        videoPlane.position.set(0,0.5,0); 
        videoPlane.name = "video";
        namePosTrans.add(videoPlane); // 向该场景中添加物体
      }else{
        const _video = document.getElementById("video_" + video);
        videoPlane.material.map = new THREE.VideoTexture(_video);
      }

    }
    let audioPlane = null;
    this.CreateAudio = function(audio){
      if(audio==null  ){
        if(audioPlane!=null){
          clearObj(audioPlane);
          namePosTrans.remove(audioPlane); // 向该场景中添加物体
          audioPlane = null;
        }
        return;
      }
      // const video = document.getElementById("video");
      // video.play();
      console.log("用户音频",audio);
      if(audioPlane == null){
        let size = 0.2;
        
        // let planeGeometry = new THREE.CylinderGeometry(w, h, 1, 1); // 生成平面
        const map = new THREE.TextureLoader().load(
          _this.$publicUrl +"images/mico.png"
        );
        let planeGeometry = new THREE.PlaneGeometry(size, size, 1, 1); // 生成平面
        const material = new THREE.MeshBasicMaterial({map:map,transparent:true });
        audioPlane = new THREE.Mesh(planeGeometry, material);
        audioPlane.rotation.y =  Math.PI+Math.PI;
  
        audioPlane.position.set(0,0.15,0); 
        audioPlane.name = "audio";
        namePosTrans.add(audioPlane); // 向该场景中添加物体
      } 
    }

    function clearObj(object){
      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.geometry.dispose();
          item.material.dispose();
        }
      }); 
    }

    //获取姓名条世界坐标，发送给界面，让界面转为屏幕坐标
    this.GetPlayerNamePos = function () {
      return getWorldPosition(namePosTrans);
    }


	  function makeButtonMesh( x, y, z, color ) {
			const geometry = new THREE.BoxGeometry( x, y, z );
			const material = new THREE.MeshPhongMaterial( { color: color } );
			const buttonMesh = new THREE.Mesh( geometry, material );
			// buttonMesh.castShadow = true;
			// buttonMesh.receiveShadow = true;
			return buttonMesh;
		}
    //----------姓名条 结束-----------------





    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }

    //----------PC 端 同步角色动作 开始-----------------


    //----------PC 端 同步角色动作 结束-----------------


    //----------生成和移除角色 开始-----------------

    //移除角色
    this.DelPlayer = function () {
      if(namePosTrans==null){return;}
      console.log("移除角色111",playerGroup);
      
      clearGroup(playerGroup);
      // RemoveMesh(playerGroup);
      // RemoveGroup(playerGroup);
      
      scene.remove(playerGroup);
      // setTimeout(() => { 
      //   // playerGroup.add(body);
      //   console.log("移除角色222",body);
      // }, 100);

      cancelAnimationFrame(updateId); 
    }
    function clearGroup(group) {
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          item.geometry.dispose();
          item.material.dispose();
        }
      };
      const removeObj = (obj) => {
        let arr = obj.children.filter((x) => x);
        arr.forEach((item) => {
          if (item.children.length) {
            removeObj(item);
          } else {
            clearCache(item);
            item.clear();
          }
        });
        obj.clear();
        arr = null;
      };
      removeObj(group);
    } 


    function RemoveMesh(object){
      if(object == undefined){return;}
      object.traverse(function(obj) {
        if (obj.type === 'Mesh') {
          obj.geometry.dispose();
          obj.material.dispose();
          // console.log("卸载mesh -- "+obj.name);
          object.remove(obj);
          return;
        }
        if (obj.type === 'Group') {
          // console.log("继续遍历查找组 -- "+obj.name);
          for (let i = 0; i < object.children.length; i++) {
            RemoveMesh( object.children[i]);  
          } 
          return;
        }
      })
    }
    function RemoveGroup(object){
      for (let i = object.children.length-1; i >=0; i--) {
        object.remove(object.children[0]);
      } 
          //       for (let i = 0; i < object.children.length; i++) {
          //   object.remove(object.children[i]);
          // } 

          return;
      if(object == undefined){return;}
      object.traverse(function(obj) {
        if (obj.type === 'Group') {
          console.log("遍历删除组 -- "+obj.name);
          // for (let i = 0; i < object.children.length; i++) {
          //   object.remove(object.children[i]);
          // } 
          // object.remove(obj);
          return;
        }
      })
    }
    //----------生成和移除角色 结束-----------------

    var defultPos = new THREE.Vector3(0, 0, 0);

    //获取角色是否加载完成。加载完成返回true
    this.GetHasPlayer = function () {
      return hasPlayer;
    }

    var time;

    function SetPos(obj,pos){
      obj.position.set(pos.x,pos.y,pos.z); 
    }
    function SetRota(obj,pos){
      obj.rotation.set(pos.x,pos.y,pos.z); 
    }
    //接收-由服务器同步角色位置
    this.SetUserData = function (userData) {
      // return;
      // console.log(" 从服务器中同步其他角色位置",userData);
      // console.log(" 从服务器中同步其他角色位置",hasPlayer);
      if (!hasPlayer) {
        // defultPos = pos;
        inSetDefaltPos = true;
        return;
      }
      if(userData.headPos == undefined){return;}
      // console.log(" 从服务器中同步其他角色位置222",userData);

      
      SetPos(headGroup,userData.headPos);

      // SetPos(body,userData.bodyPos);
      // SetPos(playerGroup,userData.headPos);
      SetPos(lefthandGroup,userData.lefthandPos);
      SetPos(righthandGroup,userData.righthandPos);

      SetRota(headGroup,userData.headRota);
      // SetRota(body,userData.bodyRota);
      SetRota(lefthandGroup,userData.lefthandRota);
      SetRota(righthandGroup,userData.righthandRota);

      // console.log(" 从服务器中同步其他角色位置");
    }


    var userData = {};
    var oldheadPos = new THREE.Vector3();
    var oldlefthandPos = new THREE.Vector3();
    var oldrighthandPos = new THREE.Vector3();

    function v3Equle(v1,v2){
      return v1.x==v2.x && v1.y==v2.y && v1.z==v2.z 
    }
    //发送-本地向服务器发送角色坐标
    this.updateSend = function () {
      if (!hasPlayer) { return; }
      if (local) {
        var headPos = getWorldPosition(head);
        var lefthandPos = getWorldPosition(lefthand);
        var righthandPos = getWorldPosition(righthand);

        if(v3Equle(oldheadPos, headPos) && 
        v3Equle(oldlefthandPos, lefthandPos)  
          &&  v3Equle(oldrighthandPos, righthandPos)){
            return;
          }

          userData.headPos =  {x:headPos.x,y:headPos.y,z:headPos.z};
          userData.lefthandPos =  {x:lefthandPos.x,y:lefthandPos.y,z:lefthandPos.z};
          userData.righthandPos =  {x:righthandPos.x,y:righthandPos.y,z:righthandPos.z};

        var headRota = head.rotation;
        var lefthandRota = lefthand.rotation;
        var righthandRota = righthand.rotation;
          userData.headRota =  {x:headRota.x,y:headRota.y,z:headRota.z};
          userData.lefthandRota =  {x:lefthandRota.x,y:lefthandRota.y,z:lefthandRota.z};
          userData.righthandRota =  {x:righthandRota.x,y:righthandRota.y,z:righthandRota.z};


        // console.log(" 角色当前世界坐标为 ",newPos);
        _this.SetUserData(userData);

        oldheadPos = headPos;
        oldlefthandPos = lefthandPos;
        oldrighthandPos = righthandPos;
      }
    }

    update();
    var updateId = null;
    function update() {

      updateId = requestAnimationFrame(update);

      if (!hasPlayer) { return; }
      
      //实时刷新姓名条，让姓名条面向摄像机
      if(namePosTrans != null){
        var lookatPos = new THREE.Vector3();
        var camWorlPos = new THREE.Vector3();
        _this.camera.getWorldPosition(camWorlPos);
        lookatPos.x = camWorlPos.x;
        lookatPos.z = camWorlPos.z;
        var nameWorlPos = new THREE.Vector3();
        head.getWorldPosition(nameWorlPos);
        lookatPos.y = nameWorlPos.y;
        namePosTrans.lookAt(lookatPos);
        nameWorlPos.y += 0.7;
        namePosTrans.position.copy(nameWorlPos);

      }
      updateBodyPos();

    }
  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJVRPlayer };