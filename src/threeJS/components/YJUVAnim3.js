
import * as THREE from "three";

class YJUVAnim3 {
  constructor(_this,model) {
    var scope = this;
    let num = 0;

    let col = 4;
    let row = 4;
    var scaleX = 1 / 4;
    var scaleY = 1 / 4;
    let time = 0;
    let speed = 2;

    let playing = false;

    let delay = 20;

    let pointObj = [];
    let gifData = null;
    function InitFn( _gifData) {
      if (_gifData == undefined) { return; }
      gifData = _gifData;
      pointObj.splice(0, pointObj.length);

      row = gifData.row;
      col = gifData.col;
      scaleX = 1 / row;
      scaleY = 1 / col;
      speed = gifData.speed;
      delay = gifData.delay;


      let material = new THREE.MeshBasicMaterial({
        // alphaTest:0.5,
        transparent: true,
        // depthTest: false, //在所有模型最前端渲染
        depthWrite: false, // 透明物体之间不相互遮挡
        // color: 0xffffff, 

      }); // 材质

      if (gifData.color) {
        material.color.set(gifData.color);
      }

      // 黑色背景的图片
      if (gifData.isBlack != undefined && gifData.isBlack) {
        material.blending = THREE.AdditiveBlending;
      }

      const map = new THREE.TextureLoader().load(_this.$uploadUVAnimUrl + gifData.gifPath);
      map.encoding = 3001;
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

      map.matrix
        .identity()
        .scale(scaleX, scaleY)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
        .translate(0, 0);   //每次平移量为1/17

      material.map = map;

      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.material = material;
          item.castShadow = false;
          item.receiveShadow = false;
          pointObj.push(item);
        }
      });


      setTimeout(() => {
        playing = true;
      }, 20);


      // _this._YJSceneManager.AddNeedUpdateJS(scope);
      _this._YJSceneManager.AddLookatHotPoint(model);
    }
    let data = null;
    this.SetMessage = function ( msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      // console.log("in uvanim3 msg = ", data);
      InitFn( data);
    }

    this.GetData = function () {
      return gifData;
    }

    //删除模型
    this.Destroy = function () {
      // _this._YJSceneManager.RemoveNeedUpdateJS(scope);
      _this._YJSceneManager.RemoveLookatHotPoint(model);
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
                  .translate((time / speed * 0.01), 0);   //每次平移量为1/17 
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