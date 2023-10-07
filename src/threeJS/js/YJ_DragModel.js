/*
* 拖拽模型
*
*
* */
//*
document.write("<script type='text/javascript' src='js/three/three.js'></script>");
document.write("<script type='text/javascript' src='js/three/DragControls.js'></script>");



//拖拽模型脚本，官方脚本
var drag_objects = [];  //把mesh添加进可拖拽模型数组
function initDragControls(){

    var dragControls = new THREE.DragControls( drag_objects, camera, renderer.domElement );
    dragControls.addEventListener( 'dragstart', function ( event ) {
        console.log(" 开始  拖拽模型  " + drag_objects[0].name );
        StartDrag();
        controls.enabled = false;

    } );
    dragControls.addEventListener( 'dragend', function ( event ) {
        console.log(" 结束  拖拽模型  " );
        EndDrag();
        controls.enabled = true;
    });

}


var dragStartPos ;
var dragStartPosX ;
var dragStartPosY ;
var dragStartPosZ ;
var dragEndPos ;
//设置拖拽的模型
function SetDragModel(object){

    drag_objects.splice(0,drag_objects.length);//清空数组

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

    if(outlinePass.selectedObjects.length == 2){
        selectedObjects = [];
        selectedObjects.push( object );
        outlinePass.selectedObjects = selectedObjects;
    }

}
//拖拽的模型置空
function SetDragModelToNone(){

    drag_objects.splice(0,drag_objects.length);//清空数组
    //console.log( " 拖拽模型置空 " );
    outlinePass.selectedObjects = [];
}

function StartDrag(){
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
    //console.log( " 拖拽距离为 " + dis );

    if(dis<0.5){
        stepList.pop();
        drag_objects[0].position.set(dragStartPosX,dragStartPosY,dragStartPosZ);
        return;
    }
    for(var i = 0;i < paramList.length;i++){
        var params = paramList[i];
        if(drag_objects[0].name == params.mesh.name){

            params.positionX = dragEndPos.x;
            params.positionY = dragEndPos.y;
            params.positionZ = dragEndPos.z;
        }
    }

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
