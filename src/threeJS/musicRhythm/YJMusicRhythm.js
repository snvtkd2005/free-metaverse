

import * as THREE from "three";



// 音乐律动、节奏物体

class YJMusicRhythm {
  constructor(_this, scene) {
    var scope = this;

    let group = null;

    var model = null;


    // let col = 8;
    // let row = 8;

    let col = 4;
    let row = 4;
    let size = 0.2;
    let space = 0.002;

    let musicData = [
      {
        color: [
          0xff0000, 0xff0000,0xff0000, 0xff0000,
          0xff0000, 0xff0000,0xff0000, 0xff0000,
          0xff0000, 0xff0000,0xff0000, 0xff0000,
          0xff0000, 0xff0000,0xff0000, 0xff0000,
        ],
        later: 2
      },
      {
        color: [
          0xffff00, 0xffff00,0xffff00,0xffff00,
          0xffff00, 0xffff00,0xffff00,0xffff00,
          0xffff00, 0xffff00,0xffff00,0xffff00,
          0xffff00, 0xffff00,0xffff00,0xffff00,
        ],
        later: 2
      },

    ];

    let musicBoard = [];
    function Init() {
      group = new THREE.Group();
      scene.add(group);
      group.position.set(0, size * 2, 0);
      let offset = new THREE.Vector3(0, 0, 0);


      for (let i = 0; i < col; i++) {
        for (let ii = 0; ii < row; ii++) {
          offset.x = (i) * (size + space);
          offset.z = (ii) * (size + space);
          musicBoard.push(CreateHotPoint(group, offset));
        }
      }


      BeginMusic();

    }
    let index = 0;
    function BeginMusic(){
      console.log(" 音乐节奏 ");
      let cData = musicData[index];
      for (let i = 0; i < musicBoard.length; i++) {
        // musicBoard[i].material.color.setRGB(255,255,255); 
        musicBoard[i].material.color.setHex(cData.color[i]);
        // musicBoard[i].material.color.setHex(0xffffff);
      }
      setTimeout(() => {
        index++;
        if(index>=musicData.length){return;}
        BeginMusic();
      }, cData.later*1000);
      
    }
    this.SetBoardColor = function(cData){
      for (let i = 0; i < musicBoard.length; i++) {
        musicBoard[i].material.color.setHex(cData.color[i]);
      }
    }



    function ColorArrayToColor(array){
      // var color = ("rgb("+array[0]+","+array[1]+"," + array[2]+")").colorHex();
       var color =colorRGBtoHex ("rgb("+array[0]+","+array[1]+"," + array[2]+")");
       //console.log(color);
       return color;
   }
    function colorRGBtoHex(color) {
      var rgb = color.split(',');
      var r = parseInt(rgb[0].split('(')[1]);
      var g = parseInt(rgb[1]);
      var b = parseInt(rgb[2].split(')')[0]);
      var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      return hex;
  }



    function CreateHotPoint(parent, offset) {

      let planeGeometry = new THREE.BoxGeometry(size, size, size); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        // alphaTest:true,
        transparent: true,
        color: 0xffff00,
      }); // 材质
      const map = new THREE.TextureLoader().load(
        "public/images/box.jpg"
        // _this.GetPublicUrl() + "box.jpg"
      );

      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

      planeMaterial.map = map;
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      parent.add(plane);
      plane.position.set(offset.x, offset.y, offset.z);
      console.log(plane);
      return plane;
    }


    //#region 
    //#endregion


    Init();
    update();
    var updateId = null;
    function update() {
      updateId = requestAnimationFrame(update);

    }
  }
}


export { YJMusicRhythm };