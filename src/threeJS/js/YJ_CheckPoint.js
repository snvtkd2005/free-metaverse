
var pointPlane = null;
//创建地面射线检测点
function CreateCheckPoint(){
    var geometry = new THREE.BoxBufferGeometry( 10, 10,10 );
// var geometry = new THREE.PlaneBufferGeometry( 10, 10 );

    var loaderTex = new THREE.ImageLoader();
    var loader = new THREE.TextureLoader();

    var texture;

    /*
     texture  = new THREE.Texture();
     //在循环里不可写为 回调函数,否则加载不了多种图片
     texture.image = loader.load( 'images/checkPoint.png');
     texture.needsUpdate = true;
     */


    texture = loader.load( 'images/checkPoint.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
    var material1 = new THREE.MeshBasicMaterial( {  color: 0xffffff, map: texture } );
    material1.transparent = true;
    pointPlane = new THREE.Mesh( geometry, material1 );
    //设置热点名字和标签 坐标
    pointPlane.position.x = 0;
    pointPlane.position.y =0;
    pointPlane.position.z = 0;
    pointPlane.scale.set(1,0.001,1);
    scene.add(pointPlane);
    pointPlane.visible = false ;

}

/*
var mouse = new THREE.Vector2();
//射线检测
var hit;
var raycaster;
var intersects = [];
var intersect ;
raycaster = new THREE.Raycaster();
var loadingNum = 0;
function raycasterUpdate(pos){
    //return;
    raycaster.setFromCamera(pos, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    //只检测pointParent物体的子物体
    //var intersects = raycaster.intersectObjects( scene.getObjectByName('pointParent').children,true);
    // var intersects = raycaster.intersectObjects( scene.getObjectByName('pointParent'));
    //document.getElementById("log").innerText += scene.getObjectByName('pointParent').children.length;
    if (intersects.length > 0) {
        // if (hit != intersects[0].object) {
        hit = intersects[0].object;
         if(hit.tag == "floor"){
            document.getElementById("log").innerText +=" in click floor ";
         }

        if(hit.name.indexOf("floor")>-1)
        {
            canMove = true;
            canMovePos = intersects[0].point;

            pointPlane.position.x = canMovePos.x;
            pointPlane.position.z = canMovePos.z;
            pointPlane.position.y = 0.1;

            pointPlane.visible = true ;

            // pointPlane.position.set( 0, 0, 0 );
            // pointPlane.lookAt( intersects[ 0 ].face.normal );
            // pointPlane.position.copy( intersects[ 0 ].point );
            // helper.position.copy( intersects[ 0 ].point );
            //  document.getElementById("log").innerText +=" in raycaster " + canMovePos.x+"  "+canMovePos.y+"  "+canMovePos.z;
        }else{
            canMove = false;
            pointPlane.visible = false ;

        }
        //YJdebug(hit.name + "  "+ hit.tag);
        //  }
    } else {
        hit = null;
        pointPlane.visible = false ;

        // document.getElementById("log").innerText +=" in raycaster  null ";
    }
}

*/