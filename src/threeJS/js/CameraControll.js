/**
 * Created by yangjun on 2017/4/27.
 */
//import './Vector3.js';
//import  'js/YJ_DragModel.js';

//引入其他js脚本
document.write("<script type='text/javascript' src='js/YJ_DragModel.js'></script>");
//document.write("<script type='text/javascript' src='js/YJ_SelectModel.js'></script>");
document.write("<script type='text/javascript' src='js/YJ_OutLineModel.js'></script>");

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseover', onDocumentMouseOver, false);
//监听鼠标按下事件
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
//监听触摸开始事件
document.addEventListener('touchstart', YJ_onDocumentTouchStart, false);
document.addEventListener('touchmove', YJ_onDocumentTouchMove, false);
document.addEventListener('touchend', YJ_onDocumentTouchEnd, false);



var mouse = new THREE.Vector2();
//射线检测
// /*
var hit;
var click_hit;
var raycaster;
var intersects = [];
var intersect ;
raycaster = new THREE.Raycaster();
var loadingNum = 0;

var canMove = false;
var canMovePos = new THREE.Vector3(0,0,0);
function raycasterUpdate(pos){

    if(scene == null || scene.getObjectByName('pointsParent') == null){
        return;
    }
   // if(!b_humanView){return;}
    //return;
    raycaster.setFromCamera(pos, camera);
    //var intersects = raycaster.intersectObjects(pointsParent.children,true);
    //只检测pointsParent物体的子物体
    var intersects = raycaster.intersectObjects( scene.getObjectByName('pointsParent').children,true);
    // var intersects = raycaster.intersectObject( scene.children,true);
    if (intersects.length > 0) {
        // if (hit != intersects[0].object) {
        hit = intersects[0].object;

        SelectModel(hit);
        // YJdebug( " 鼠标 hover 模型 "+hit.name +"  pos = "+ V3ToString(GetModelWorldPosition(hit))  );

         if(hit.tag == "floor"){
            //document.getElementById("log").innerText =" in click floor ";
         }
        if(hit.name.indexOf("floor")>-1)
        {
            canMove = true;
            canMovePos = intersects[0].point;

            pointPlane.position.x = canMovePos.x;
            pointPlane.position.z = canMovePos.z;
            pointPlane.position.y = canMovePos.y+0.1;

            pointPlane.visible = true ;

            //YJdebug(intersects.length +"  "+hit.name + " 2222 "+ hit.tag + PrintVector3(canMovePos));

            // pointPlane.position.set( 0, 0, 0 );
            // pointPlane.lookAt( intersects[ 0 ].face.normal );
            // pointPlane.position.copy( intersects[ 0 ].point );

        }else{
            canMove = false;
            pointPlane.visible = false ;

        }
        //YJdebug(intersects.length +"  "+hit.name + " 2222 "+ hit.tag);
        //  }
    } else {
        hit = null;
        canMove = false;
        pointPlane.visible = false ;
       // YJdebug( "in raycaster  null"  );
        UnSelectModel();

    }
}

function onDocumentMouseOver(event) {
    if(event.target.localName=='button' || event.target.localName=='input'){
        return;
    }
    event.preventDefault();
}

var onClickPosition = new THREE.Vector2();

function onDocumentMouseMove(event) {



    event.preventDefault(); 
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
 

    raycasterUpdate(mouse);
    //initRay(renderer.domElement,event);
    //raycaster2(event);

    inMoving = true;
    //document.getElementById("log").innerText =" in click floor ";

}
function raycaster2(event){

    var array = getMousePosition( renderer.domElement, event.clientX, event.clientY );
    onClickPosition.fromArray( array );

    //var intersects = raycaster.intersectObjects( scene.getObjectByName('pointsParent').children,true);

    var intersects = getIntersects( onClickPosition, scene.getObjectByName('pointsParent').children);
    if (intersects.length > 0) {
        hit = intersects[0].object;

        if(hit.tag == "floor"){
            document.getElementById("log").innerText =" in click floor ";
        }
        if(hit.name.indexOf("floor")>-1)
        {
            canMove = true;
            canMovePos = intersects[0].point;

            pointPlane.position.x = canMovePos.x;
            pointPlane.position.z = canMovePos.z;
            pointPlane.position.y = canMovePos.y+0.1;

            pointPlane.visible = true ;

        }else{
            canMove = false;
            pointPlane.visible = false ;

        }



        YJdebug(intersects.length +"  "+hit.name + " 2222 "+ hit.tag);
        //  }
    } else {
        hit = null;
        //canMove = false;
        //pointPlane.visible = false ;
    }
}
function initRay(dom,event){
// 屏幕坐标转标准设备坐标
  var x = ((event.clientX - dom.getBoundingClientRect().left) / dom.offsetWidth) *2-1;
// 标准设备横坐标
// 这里的mainCanvas是个dom元素,getBoundingClientRectangle会返回当前元素的视口大小.
    var y = -((event.clientY - dom.getBoundingClientRect().top) / dom.offsetHeight) *2+1;
// 标准设备纵坐标
    var standardVector =new THREE.Vector3(x, y,1);
// 标准设备坐标
// 标准设备坐标转世界坐标
    var worldVector = standardVector.unproject(camera);
// 射线投射方向单位向量(worldVector坐标减相机位置坐标)
    var ray = worldVector.sub(camera.position).normalize();
// 创建射线投射器对象
    var rayCaster =new THREE.Raycaster(camera.position, ray);
// 返回射线选中的对象 第二个参数如果不填 默认是false
    var intersects = rayCaster.intersectObjects(scene.getObjectByName('pointsParent').children,true);

    if (intersects.length > 0) {
        hit = intersects[0].object;

        if(hit.tag == "floor"){
            document.getElementById("log").innerText =" in click floor ";
        }
        if(hit.name.indexOf("floor")>-1)
        {
            canMove = true;
            canMovePos = intersects[0].point;

            pointPlane.position.x = canMovePos.x;
            pointPlane.position.z = canMovePos.z;
            pointPlane.position.y = canMovePos.y+0.1;

            pointPlane.visible = true ;

        }else{
            canMove = false;
            pointPlane.visible = false ;

        }



        // YJdebug(intersects.length +"  "+hit.name + " 3333 "+ hit.tag);
        //  }
    } else {
        hit = null;
        //canMove = false;
        //pointPlane.visible = false ;
    }
}


var getMousePosition = function ( dom, x, y ) {

    var rect = dom.getBoundingClientRect();
    return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

};
var getIntersects = function ( point, objects ) {

    mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

    raycaster.setFromCamera( mouse, camera );

    return raycaster.intersectObjects( objects );

};

var doOnce = 0;
var moving =false;
var inMoving = false;


var clickMousePosX = 0;
var clickMousePosY = 0;

var targetPageX = 0;
var targetPageY = 0;
function  onDocumentMouseDown (event) {


    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    clickMousePosX = mouse.x;
    clickMousePosY = mouse.y;

    targetPageX = event.clientX;
    targetPageY = event.clientY;
    //DrawLineFromScreenToModel();
    //console.log(  " targetPageX " + targetPageX + "   targetPageY " + targetPageY);

    moving = true;


}

//移动端点击添加到高亮 拖拽数组
function addSelectedObject( object ) {

    if(drag_objects.length == 0 ){

        selectedObjects = [];
        selectedObjects.push( object );
        return;
    }
    //当拖拽的模型高亮时，在不删除拖拽模型的高亮的情况下添加新的。所以是把数组里索引1的删除
    //点击时，删掉已存在的，再把点击到的物体添加为点击物体 和 拖拽物体
    selectedObjects.splice(0,selectedObjects.length);//清空数组
    selectedObjects.push( object );

}

function onDocumentMouseUp (event) {
    if(event.target.localName=='button'){
        return;
    }
    //   if (event.button != 0) return;
    //return;

    event.preventDefault();

    moving = false;
    doOnce = 0;
    /*
    if(inMoving){
        inMoving= false;
        return;
    }*/

    //鼠标点是否有位移，判断是否为滑动
    if(clickMousePosX != mouse.x || clickMousePosY != mouse.y){
        return;
    }

    raycaster_Click(mouse);
    DrawLineFromScreenToModel();
    //点击在地板上开始移动 camera
    if(canMove){

        ChangeToHumanView2(canMovePos.x,canMovePos.z);
        pointPlane.visible = false ;

    }



}


var touchPos_start = new THREE.Vector2();
function YJ_onDocumentTouchStart(event) {
    var eventName = event.target.localName;
    if(eventName=='button'){
        return;
    }
    //return;

    //event.preventDefault();

    // YJdebug(event.targetTouches.length);

    touchPosNow.x =  (Number(event.touches[0].pageX) / window.innerWidth) * 2 - 1;
    touchPosNow.y = -(Number(event.touches[0].pageY)  / window.innerHeight) * 2 + 1;

    touchPos_old=touchPosNow;
    touchPos_new = touchPos_old;


    touchPos_start.x =  (Number(event.touches[0].pageX) / window.innerWidth) * 2 - 1;
    touchPos_start.y = -(Number(event.touches[0].pageY)  / window.innerHeight) * 2 + 1;

    // console.log("开始点为 " + v2ToString(touchPos_start) );

    //raycasterUpdate(touchPosNow);
    moving = true;

   // raycaster_Click(touchPosNow);

}
var touchPos_old = new THREE.Vector2();
var touchPos_new = new THREE.Vector2();

function YJ_onDocumentTouchEnd(event) {
    if(event.target.localName=='button'){
        return;
    }
    //点击在地板上开始移动 camera
    if(canMove && ((touchPos_old.x == touchPos_new.x) && (touchPos_old.y ==touchPos_new.y))  ){
        ChangeToHumanView2(canMovePos.x,canMovePos.z);

    }
    pointPlane.visible = false ;

    // console.log(v2ToString(touchPos_start) + " " + v2ToString(touchPosNow));

    //return;

    //鼠标点是否有位移，判断是否为滑动
    if(touchPos_start.x != touchPosNow.x || touchPos_start.y != touchPosNow.y){
        return;
    }
    if((touchPos_old.x == touchPos_new.x) && (touchPos_old.y ==touchPos_new.y)){
        raycaster_Click(touchPosNow);
    }

}
function v2ToString(v2){
    return v2.x + " " + v2.y;
}
var touch ;
var touchX = 0;
var touchY = 0;

var spots = {} , touches , timer;
//获取触摸点信息
function renderTouches2(touches){
    return;

    if(!touches){
        return;
    };

    if(touches.length > 1){
        finger1NewPosX = touches[0].pageX;
        finger2NewPosX = touches[1].pageX;
        if(fingerDoOnce < 1){
            finger1OldPosX = finger1NewPosX;
            finger2OldPosX = finger2NewPosX;
            fingerDoOnce ++;
        }
        //计算两个手指当前帧与前一帧的实时位移量，大于0为放大，小于0为缩小
        var juli = Math.abs(finger2NewPosX-finger1NewPosX) -  Math.abs(finger2OldPosX-finger1OldPosX);
        cameraFovControll(juli * 0.1);
        finger1OldPosX = finger1NewPosX;
        finger2OldPosX = finger2NewPosX;

    }
}
var finger1NewPosX  = 0 ;
var finger2NewPosX  = 0 ;
var finger1OldPosX  = 0 ;
var finger2OldPosX  = 0 ;
var fingerDoOnce = 0;

var touchPosNow = new THREE.Vector2();
function YJ_onDocumentTouchMove(event) {
    //document.getElementById("log").innerText= "正在移动点";
    // console.log("正在移动点 " );

    //*
    if(event.target.localName=='button' || event.target.localName=='input'){
        return;
    }//*/


    touchPosNow.x =  (Number(event.touches[0].pageX) / window.innerWidth) * 2 - 1;
    touchPosNow.y = -(Number( event.touches[0].pageY)  / window.innerHeight) * 2 + 1;
    //touchPosNow.x =  (Number(touch.pageX) / window.innerWidth) * 2 - 1;
    //touchPosNow.y = -(Number(touch.pageY)  / window.innerHeight) * 2 + 1;

    // console.log("正在移动开始点为 " + v2ToString(touchPosNow) );

    touchPos_new=touchPosNow;
    if(((touchPos_old.x == touchPos_new.x) && (touchPos_old.y ==touchPos_new.y))  ){
    }else{
        pointPlane.visible = false ;
    }
    //YJdebug_screen(" in touch ");

   // raycasterUpdate(touchPosNow);


}

//点击生成射线点击模型
function raycaster_Click(pos){
    // if(!b_humanView){return;}
    //return;

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pos, camera);
    //var intersects = raycaster.intersectObjects(pointsParent.children,true);
    //只检测pointsParent物体的子物体
    var intersects = raycaster.intersectObjects( scene.getObjectByName('pointsParent').children,true);
    //var intersects = raycaster.intersectObject( scene.getObjectByName('pointsParent'));
    if (intersects.length > 0) {
        // if (hit != intersects[0].object) {
        click_hit = intersects[0].object;
        SelectObjFromMesh(click_hit);
        window.parent.postMessage("点击模型|"+click_hit.name,"*");

    } else {
        SetDragModelToNone();
        UnSelectModel();
        window.parent.postMessage("清空点击","*");

        //拖拽模型高亮。
        // 点击空白区域，没有拖拽模型时，全部取消高亮
        if(drag_objects.length == 0 ){
            selectedObjects=[];
            outlinePass.selectedObjects = selectedObjects;
            inOutLine = false;

        }
        //点击空白区域，有拖拽模型时，取消不是拖拽模型的高亮
        if(selectedObjects.length > 1 ){
            //selectedObjects.splice(1,selectedObjects.length);//清空数组
            selectedObjects=[];
            outlinePass.selectedObjects = selectedObjects;
        }

        if(selectedObjects.length == 0){
            inOutLine = false;
        }
        //console.log(" 点击 到空白区域 "   );
        oldHitObjName = "";
        //判断是否双击
        if( doubleClickTime<0.5){
            DoubleClick_none();
        }else{
            doubleClickTime=0;
        }
        click_hit = null;
    }

}

var multiHidden = false;
function SetMuiltHidden(e){
    multiHidden = e;
    console.log("接收到连续点击222"+multiHidden);
}
function SelectObjFromMesh(click_hit){

    SetDragModel(click_hit);
    SelectModel(click_hit);
    addSelectedObject(click_hit);
    outlinePass.selectedObjects = selectedObjects;
    inOutLine = true;

    //判断是否双击
    if(oldHitObjName == click_hit.name && doubleClickTime<0.5){
        DoubleClickModel(click_hit);
    }else{
        doubleClickTime=0;
    }
    oldHitObjName = click_hit.name;

    if(multiHidden=="true"){
        HideFn(1);
    }

}
var doubleClickTime = 0;
var oldHitObjName;

//双击模型居中
function DoubleClickModel(object){

    console.log(" in 双击模型 ！！！！！！！！ "  );
    SetContrlsAndCameraPos(GetModelWorldPosition(object));
    GetBoundsSize(object);
}


//双击空白区域居中到所有模型中心
function DoubleClick_none(){
    GetCenterFromAllModel();
}
var clock = new THREE.Clock();//时间跟踪

CameraControllUpdate();
//计时
function CameraControllUpdate(){

    doubleClickTime += clock.getDelta();

    //console.log("doubleClickTime = " + doubleClickTime);
    requestAnimationFrame( CameraControllUpdate );


}

function V3ToString(v3){

    return v3.x +" "+ v3.y +" "+ v3.z +" "
}

//获取所有模型在一起的中心坐标.包裹盒的中心
function GetCenterFromAllModel(){
    
    // console.log(" in 双击空白 111 ！！！！！！！！ " +V3ToString(allmin)  + " " +V3ToString(allmax)   );
    SetContrlsAndCameraPos(GetBoundsCenterPos());
    // console.log(" in 双击空白 222 ！！！！！！！！ " +V3ToString(allmin)  + " " +V3ToString(allmax)   );
    SetCameraOffset(allmin,allmax); 

}

//排除隐藏的物体，计算包裹盒的中心坐标
function GetBoundsCenterPos(){

    var minX,maxX,minY,maxY,minZ,maxZ;
    minX=maxX=minY=maxY=minZ=maxZ=0;

    var num=0;
    for(var i = 0;i < paramList.length;i++){

        var params = paramList[i];
        if(!params.display){
            continue;
        }
        var geometry = params.mesh.geometry;
        geometry.computeBoundingBox();

        //包裹盒的中心
        // var minPos= geometry.boundingBox.min ;
        // var maxPos= geometry.boundingBox.max ;

        var minPos=  GetModelWorldPosition(params.mesh) ;
        var maxPos= minPos ;



        if(num==0){
            minX=maxX = minPos.x;
            minY=maxY=minPos.y;
            minZ=maxZ=minPos.z;
        }


        if(minPos.x <=minX){
            minX = minPos.x;
        }
        if(maxPos.x>=maxX){
            maxX = maxPos.x;
        }

        if(minPos.y <=minY){
            minY = minPos.y;
        }
        if(maxPos.y>=maxY){
            maxY = maxPos.y;
        }

        if(minPos.z <=minZ){
            minZ = minPos.z;
        }
        if(maxPos.z>=maxZ){
            maxZ = maxPos.z;
        }
        num++;
    }

    var centroid2 = new THREE.Vector3();

    centroid2.x = (maxX+minX)/2;
    centroid2.y = (maxY+minY)/2;
    centroid2.z = (maxZ+minZ)/2;

    allmin=new THREE.Vector3(minX,minY,minZ);
    allmax =new THREE.Vector3(maxX,maxY,maxZ);
    return centroid2;
}
var allmin = new THREE.Vector3();
var allmax = new THREE.Vector3();


//获取模型的大小，根据大小设置摄像机相对模型的位置。设置摄像机的远近
function GetBoundsSize(object){
    var geometry = object.geometry;
    geometry.computeBoundingBox();

    //包裹盒的中心
    var minPos= geometry.boundingBox.min;
    var maxPos= geometry.boundingBox.max;

    SetCameraOffset(minPos,maxPos);
}
function SetCameraOffset(minPos,maxPos){
    var boxRound =  ToDistance(minPos,maxPos);
    var camera2ctrlDistance = ToDistance(camera.position,controls.target);
    if(boxRound == 0 || camera2ctrlDistance == 0){
        console.log(" 没有模型，双击模型居中无效 " );
        return;
    }
    console.log(" 选中模型包裹盒的大小为 " +boxRound );
    console.log(" 摄像机到控制器的距离 " + camera2ctrlDistance );
    //scale越大，摄像机离的越远
    var scale = camera2ctrlDistance/100;
    //var scale = 1.5;
    scale=THREE.Math.clamp(scale,1,1.5);
    controls.SetCameraOffset(boxRound/camera2ctrlDistance* scale  );
    //controls.SetCameraOffset(ToDistance(minPos,maxPos)/ToDistance(camera.position,controls.target) * (1/ToDistance(minPos,maxPos)*80));


    if(times<1){
        // window.parent.document.getElementById("loadprocess").style.display = "none"; //隐藏
        times++;
    }
}
var times =0;



function ToDistance(v1,v2){

    var x1, y1,z1,x2,y2,z2 ;
    x1 = v1.x ;
    y1 = v1.y ;
    z1 = v1.z ;

    x2 = v2.x ;
    y2 = v2.y ;
    z2 = v2.z ;

    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)+ (z1-z2)*(z1-z2)) ;
}
//通过模型的包裹盒计算模型的世界坐标
function GetModelWorldPosition(object){
    var centroid = new THREE.Vector3();

    object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {

            //获取模型的世界坐标
            var geometry = object.geometry;
            geometry.computeBoundingBox();
            centroid.addVectors( geometry.boundingBox.min, geometry.boundingBox.max );
            centroid.multiplyScalar( 0.5 );
            centroid.applyMatrix4( item.matrixWorld );
            //console.log(" ===== 双击模型 的位置    "  + posToString(centroid) + "  "   );
        }
    });

    //获取模型的世界坐标
    //var geometry = object.geometry;
    //geometry.computeBoundingBox();
    //var centroid = new THREE.Vector3();
    //centroid.addVectors( geometry.boundingBox.min, geometry.boundingBox.max );
    //centroid.multiplyScalar( 0.5 );
    //centroid.applyMatrix4( object.matrixWorld );
    return centroid;
}

//从屏幕位置到模型位置绘制线段
var line;
var material_line;
var geometry_line;
function DrawLineFromScreenToModel(){
    return;

    if(click_hit == null){
        if(line != null){
            scene.remove(line);
        }
        return;
    }
    /*
    //获取点击的屏幕坐标，并转为世界坐标
    var _mouse = new THREE.Vector2();
    var rect = renderer.domElement.getBoundingClientRect();
    _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
     console.log(  " _mouse.x " + _mouse.x + "   _mouse.y " + _mouse.y);

     */
/*

 */
    /*
    //鼠标点坐标的世界坐标转为视点坐标系
    console.log(  " mouse.x " + mouse.x + "   mouse.y " + mouse.y);
    var p = new THREE.Vector3(mouse.x, mouse.y, -1).unproject(camera);
    var clickPos =  new THREE.Vector2(p.x,p.y);
    console.log(  " clickPos.x " + clickPos.x + "   clickPos.y " + clickPos.y);
    */


/*
    //世界坐标转屏幕坐标
   // var projector = new THREE.Projector();
    var world_vector = GetModelWorldPosition(pointsParent.children[0].children[0]);
    //var world_vector = new THREE.Vector3(0,0,1);
    var vector = world_vector.project(camera);
    var halfWidth = window.innerWidth / 2;
    var halfHeight = window.innerHeight / 2;
    var x= Math.round(vector.x * halfWidth + halfWidth);
    var y= Math.round(-vector.y * halfHeight + halfHeight);
    console.log(  " 世界坐标转屏幕坐标 " + x + " " + y);
*/

    //获取摄像机世界坐标
    cubeBox.position.set(camera.position.x,camera.position.y,camera.position.z) ;
    cubeBox.rotation.set(camera.rotation.x,camera.rotation.y,camera.rotation.z) ;

    //在局部坐标轴移动. 决定屏幕上的固定位置
    cubeBox.translateX(-3);
    cubeBox.translateY(3);



    /*
    //鼠标位置。线段在屏幕上的点在鼠标位置
    var scale = 5.7;
    cubeBox.translateX(mouse.x  * scale );
    cubeBox.translateY(mouse.y  * scale);
    */
    cubeBox.translateZ(-10);
    //console.log(  " targetPageX " + targetPageX + "   targetPageY " + targetPageY);
    //console.log(  " mouse.x " + mouse.x + "   mouse.y " + mouse.y);


    //绘制线段
    //线构造
    //定义材质THREE.LineBasicMaterial . MeshBasicMaterial...都可以
    if(material_line == null){
        material_line = new THREE.LineBasicMaterial({color:0x0000ff});
    }
    // 空几何体，里面没有点的信息,不想BoxGeometry已经有一系列点，组成方形了。
    if(geometry_line == null){
    }else{
        geometry_line.dispose(); // 删除几何体
    }
    geometry_line = new THREE.Geometry();

    // 给空白几何体添加点信息，这里写3个点，geometry会把这些点自动组合成线，面。
    //添加两个坐标，两坐标间绘制线段
    geometry_line.vertices.push(GetModelWorldPosition(click_hit));
    geometry_line.vertices.push(new THREE.Vector3(cubeBox.position.x ,cubeBox.position.y ,cubeBox.position.z ));
    if(line != null){
        scene.remove(line);
    }
    line=new THREE.Line(geometry_line,material_line);
    // 加入到场景中
    scene.add(line);


    return;

    var v = []; //用来存储要绘制曲线的点
    //v.push(GetModelWorldPosition(click_hit));
    //v.push(new THREE.Vector3(cubeBox.position.x ,cubeBox.position.y ,cubeBox.position.z ));
    drawLine(v);
}

function drawLine(v) {

    //geometry_line.vertices = v ;

    if(line != null){
        scene.remove(line);
    }
    line=new THREE.Line(geometry_line,material_line);
    // 加入到场景中
    scene.add(line);


    return;
    // 用`v`中的点生成一条曲线
    var curve = new THREE.SplineCurve(v);

    var Linematerial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF
    });

    var path = new THREE.Path(curve.getPoints(1000));

    var Linegeometry = path.createPointsGeometry(1000);

    //使用曲线在场景中绘制出曲线
    line = new THREE.Line(Linegeometry, Linematerial);


    scene.add(line);
}
