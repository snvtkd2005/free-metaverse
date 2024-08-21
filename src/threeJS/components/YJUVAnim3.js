
import * as THREE from "three";

class YJUVAnim3 {
  constructor(_this,model,parent) {
    var scope = this;
    let num = 0;

    let col = 4;
    let row = 4;
    var scaleX = 1 / 4;
    var scaleY = 1 / 4;
    let time = 0;
    let speed = 2;
    let speedY = 0;

    let playing = false;

    let delay = 20;

    let pointObj = []; 
    function InitFn() {
      
      pointObj.splice(0, pointObj.length);
      playing = false;

      row = data.row;
      col = data.col;
      scaleX = 1 / row;
      scaleY = 1 / col;
      speed = data.speed;
      if(data.speedY != undefined){
        speedY = data.speedY;
      }
      delay = data.delay;

      let material = null; 


      let map = null;
      if(data.gifPath){
        material = new THREE.MeshBasicMaterial({
          // alphaTest:0.5,
          transparent: true,
          // depthTest: false, //在所有模型最前端渲染
          depthWrite: false, // 透明物体之间不相互遮挡
          // color: 0xffffff, 
  
        }); // 材质

        map = new THREE.TextureLoader().load(_this.$uploadUVAnimUrl + data.gifPath);
        map.encoding = 3001;
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
      }else{
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            material = item.material;
            map = item.material.map ;
            map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
          }
        });
      }

      map.matrix
        .identity()
        .scale(scaleX, scaleY)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
        .translate(0, 0);   //每次平移量为1/17

      material.map = map;
      if (data.color) {
        material.color.set(data.color);
      }

      // 黑色背景的图片
      if (data.isBlack != undefined && data.isBlack) {
        material.blending = THREE.AdditiveBlending;
      }
      
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.material = material;
          item.castShadow = false;
          item.receiveShadow = false;
          pointObj.push(item);
        }
      });
      model.renderOrder = 1;
      if(speed != 0 || speedY != 0){
        setTimeout(() => {
          playing = true;
        }, 20);
      }
      if(speed == 0 && speedY == 0){
        playing = false;
      }
 
      // if(data.isLookatCam){
      //   _this._YJSceneManager.AddLookatHotPoint(parent,data);
      // }
    }
    let data = null;
    this.SetMessage = function ( msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      // console.log("in uvanim3 msg = ", data);
      
      // _this._YJSceneManager.RemoveLookatHotPoint(parent);
        
      InitFn();
    }

    this.GetData = function () {
      return data;
    }

    //删除模型
    this.Destroy = function () { 
      // _this._YJSceneManager.RemoveLookatHotPoint(parent);
    }

    //#region 
    //#endregion

    let numY = 0;
    let numX = 0;
    let oldNum = 0;

    this._update = () => { 

      if (playing) {
        if (pointObj.length > 0) {

          if (scaleY == 1) {
            time++;
            // console.log(" in yj uv anim ", time);

            if (scaleX == 1) {

              for (let i = 0; i < pointObj.length; i++) {
                let texture = pointObj[i].material.map;
                // console.log(" in yj uv anim ",texture);
                texture.matrix
                  .identity()
                  .scale(1, 1)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
                  .translate(speed==0?0:(time / speed * 0.01),speedY==0? 0:(time / speedY * 0.01));   //每次平移量为1/17 
              }

            } else {

              for (let i = 0; i < pointObj.length; i++) {
                let texture = pointObj[i].material.map;
                // console.log(" in yj uv anim ",texture);
                texture.matrix
                  .identity()
                  .scale(scaleX, 1)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
                  .translate(scaleX * parseInt(time / speed), 0);   //每次平移量为1/17 
              }
              if (time / speed >= 1 / scaleX) {
                playing = false;
                time = 0;
                setTimeout(() => {
                  playing = true;
                }, delay);
              }


            }



          } else {

            time += speed * 0.02 * 4;
            num = Math.floor(time);
            if (num != oldNum) {
              numX++;
              if (numX >= row) {
                numX = 0;
                numY++;
                if (numY >= col) {
                  numY = 0;
                }
              }
              oldNum = num;
            }
            if (num >= col * row - 1) {
              time = 0;
              num = 0;
              playing = false;
              setTimeout(() => {
                playing = true;
              }, delay);
            }

            let x = numX * scaleX;
            let y = (row - numY) * scaleY;

            // console.log(" in yj uv anim ",num,numX,numY, x , y );

            for (let i = 0; i < pointObj.length; i++) {
              let texture = pointObj[i].material.map;
              // console.log(" in yj uv anim ",texture);
              texture.matrix
                .identity()
                .scale(scaleX, scaleY)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
                .translate(x, y);   //每次平移量为1/17 
            }
          }



        }
      }
 
      if(data.isLookatCam){
        
        var lookatPos = new THREE.Vector3();  
        _Global.YJ3D.camera.getWorldPosition(lookatPos);
        if(data.isLockY){
          var nameWorlPos = new THREE.Vector3();
          parent.getWorldPosition(nameWorlPos);
          lookatPos.y = nameWorlPos.y; 
        }
        parent.lookAt(lookatPos);
        
      }


      // let texture =  pointObj.material.map;
      // texture.matrix
      //     .identity()
      //     .scale(defaultOffsetX, defaultOffsetY)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
      //     .translate(defaultOffsetX * parseInt(loadTexDeltaTime / speed), 
      //     defaultOffsetY * parseInt(loadTexDeltaTime / speed));   //每次平移量为1/17
    }
  }
}


export { YJUVAnim3 };