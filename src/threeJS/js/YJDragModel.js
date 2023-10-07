import * as THREE from "three";

//模型拖拽控制器
import { DragControls } from "three/examples/jsm/controls/DragControls.js"; 


class YJDragModel {
  constructor(parent,scene,camera, renderer,domElement) {
    if (domElement === undefined) {
      console.warn('THREE.YJOutlinePass: The second parameter "domElement" is now mandatory.');
      domElement = document;
    }
    this.domElement = domElement;

    var dragControls ;
    var drag_objects = [];
    function init_DragModel() {
      console.log(" init_DragModel  " );

      dragControls = new DragControls( drag_objects, camera, renderer.domElement );
      dragControls.addEventListener( 'dragstart', function ( event ) {
          console.log(" 开始  拖拽模型  " + drag_objects[0].name );
          StartDrag();
          parent.YJController.enabled = false;
  
      } );
      dragControls.addEventListener( 'dragend', function ( event ) {
          console.log(" 结束  拖拽模型  " );
          EndDrag();
          parent.YJController.enabled = true;
      });
    }
    


    var dragStartPos ;
    var dragStartPosX ;
    var dragStartPosY ;
    var dragStartPosZ ;
    var dragEndPos ;
    //设置拖拽的模型
    this.SetDragModel = function(object){
    
        drag_objects.splice(0,drag_objects.length);//清空数组
        if(object==null){return;}
        object.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
                //console.log("点击的模型设为拖拽模型 " + object.name  );
                drag_objects.push(item);
                dragStartPos = item.position;
                dragStartPosX = item.position.x;
                dragStartPosY = item.position.y;
                dragStartPosZ = item.position.z;
                //console.log(" 拖拽前的坐标为 11111   " + item.name +  " pos = "+ dragStartPos.x + ","+ dragStartPos.y + ","+  dragStartPos.z   );
                //console.log(" ===== 点击到的模型坐标为     "    + posToString(object.parent.localToWorld)  );
                //console.log(" ===== 点击到的模型坐标为 1    "  + posToString(object.position) + "  " + posToString(item.position)  );
    
                //var geometry = object.geometry;
                //geometry.computeBoundingBox();
                //var centroid = new THREE.Vector3();
                //centroid.addVectors( geometry.boundingBox.min, geometry.boundingBox.max );
                //centroid.multiplyScalar( 0.5 );
                //centroid.applyMatrix4( item.matrixWorld );
                //console.log(" ===== 点击到的模型坐标为 2    "  + posToString(centroid) + "  "   );
    
    
            }
        });
    
        //console.log(" ===== 点击到的模型坐标为     "  + posToString(object.position) + "  " + posToString(object.localToWorld())  );
    
        /*
         当同时模型有两个时，表示一个为正在拖拽的模型，一个为当前悬浮的模型。 是两个不同模型
         当点击时，把当前悬浮的模型变为拖拽模型，并只高亮此模型
        * */
 
    } 
    function StartDrag(){
       
       parent.YJSceneModelCtrl.pushStep();

      return;
        stepList.push(CoyeParamLsit(paramList) );
    
    }
    function EndDrag(){
        var dragEndPos = drag_objects[0].position;
        //console.log( " 拖拽后的坐标为  " +  " pos = "+ dragEndPos.x + ","+ dragEndPos.y + ","+  dragEndPos.z  );
        //console.log(" 拖拽前的坐标为 22222  " +  " pos = "+ dragStartPosX + ","+ dragStartPosY + ","+  dragStartPosZ  );
    
        var newstartPos = new THREE.Vector3(0,0,0) ;
    
        newstartPos.x = dragStartPosX;
        newstartPos.y = dragStartPosY;
        newstartPos.z = dragStartPosZ;
    
        var dis = ToDistance(newstartPos,dragEndPos);
        console.log( " 拖拽距离为 " + dis );

        if(dis<0.01){
            parent.YJSceneModelCtrl.popStep();
            drag_objects[0].position.set(dragStartPosX,dragStartPosY,dragStartPosZ);
            return;
        }else{
          parent.YJSceneModelCtrl.updateObjPos( drag_objects[0],dragEndPos);
        }
        
        drag_objects.splice(0,drag_objects.length);//清空数组

      }
    function ToDistance(v1,v2){
    
        var x1, y1,z1,x2,y2,z2 ;
        x1 = v1.x ;
        y1 = v1.y ;
        z1 = v1.z ;
    
        x2 = v2.x ;
        y2 = v2.y ;
        z2 = v2.z ;
    
        //console.log( " 拖拽前后两点坐标为 " + " pos1 = "+ v1.x + ","+ v1.y + ","+  v1.z + " pos2 = "+ v2.x + ","+ v2.y + ","+  v2.z );
        //console.log((x1-x2)*(x1-x2) + "   " + (y1-y2)*(y1-y2)+ "   " +(z1-z2)*(z1-z2) );
    
    
        return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)+ (z1-z2)*(z1-z2)) ;
    }

    init_DragModel();
    this.dispose = function () {

      // this.domElement.removeEventListener('mousemove', _onMouseMove);

    };
    
    // const _onMouseMove = this.onMouseMove.bind(this);
    // this.domElement.addEventListener('mousemove', _onMouseMove);

  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJDragModel };