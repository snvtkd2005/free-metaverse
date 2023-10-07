/*
* 拖拽模型
*
*
* */
//*
//var meshNameData = ["11","ww"];// [];
//var meshTransData = ["11","ww"];
//import { * } from './YJ_ModelItemParams.js';
document.write("<script type='text/javascript' src='js/YJ_ModelItemParams.js'></script>");



var meshNameData = [];// [];
var meshTransData = [];

//初始化场景中的模型数据
function InitSceneModelData (){

    if(stepList.length>0){
        stepList.splice(0,stepList.length);//清空数组，只保留第一个
    }

    for(var i = 0;i < pointsParent.children.length;i++){
        //meshNameData.push(pointsParent.children[i].name);
        //meshNameData.push(pointsParent.children[i]);
        meshNameData.push(GetObjectMesh(pointsParent.children[i]));

        GetObjectPos(pointsParent.children[i]);
        //console.log(" 添加模型到数据中 " + pointsParent.children[i].name   );
        var item = pointsParent.children[i];
        GetObjectParam(item);

        //GetObjectParam(pointsParent.children[i]);
    }

    //初始化完成后记录状态
    stepList.push(CoyeParamLsit(paramList) );

    console.log(" 添加模型到数据中 的总数为 " + pointsParent.children.length   );
    //初始化视角
    SetDefaultPos();

    //for(var i = 0;i < paramList.length;i++){
    //    var params = paramList[i];
    //    params.Visible = false;
    //
    //    console.log(i + paramList[i].mesh.name);
    //}
    // document.getElementById("waitScreen").style.display = "none";
    // document.getElementById("UI_Load_layer").style.display = "none";
    // document.getElementById("UI_layer").style.display = "";


    return;
    console.log(" meshNameData.length " + meshNameData.length );
    for(var ii = 0;ii < meshNameData.length;ii++){
        console.log(meshNameData[ii] + " pos = " + meshTransData[ii*3] +"," + meshTransData[ii*3+1]+"," +meshTransData[ii*3+2] );
    }
}
//获取模型的真实位置
function GetObjectPos(object){
    object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
           // console.log(" 刷新组中位置 " + item.name +  " pos = "+ item.position.x + ","+ item.position.y + ","+  item.position.z   );
           // meshTransData.push(item.position);
           // return;
            meshTransData.push(item.position.x);
            meshTransData.push(item.position.y);
            meshTransData.push(item.position.z);

        }
    });
}
function GetObjectPos2(object){
    var result = null;
    object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            result = item.position;
        }
    });
    return result;
}
//设置模型的真实位置
function SetObjectPos(object,x,y,z){

    object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.position.set(x,y,z);
        }
    });
}
function SetObjectPos2(object,pos){
    object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.position.set(pos);
        }
    });
}
function SetObjectPos3(object,x,y,z){
    object.position.set(x,y,z);
}
//获取模型的mesh
function GetObjectMesh(object){
    var result = null; //要使用返回值，必须用个中间变量 result
    object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            //console.log(" 添加模型 mesh " + object.name +"  " + item.name  );
            result = item;
        }
    });

    return result;
}
//获取模型的初始化数据
var paramList = [];
function GetObjectParam(object){
    //name,mesh,opacity,position,positionX,positionY,positionZ,display,transparent
    var params = new ModelItemParams("",null,1,new THREE.Vector3(0,0,0),0,0,0,true,false);
    
    params.name = object.name;
    params.mesh = GetObjectMesh(object);
    params.position = GetObjectPos2(object);  //这个值永远会显示当前位置

    params.positionX = params.position.x;  //这里永远是初始化位置
    params.positionY = params.position.y;
    params.positionZ = params.position.z;
    paramList.push(params);
     
    //console.log(params.mesh.name + " 坐标为 " +params.position.x +" " +params.position.y +" " +params.position.z );

}

//全部还原
function ResetAll(){
    console.log(" 全部还原 "  );
    console.log(" stepList.length " + stepList.length );
    console.log(" paramList.length " + paramList.length );
    console.log(" drag_objects.length " + drag_objects.length);
    
    //还原为初始记录的
    for(var i = 0;i < stepList[0].length;i++){

        var params = stepList[0][i];

        params.ToDefaultPosition = 0;
        params.Visible = params._Visible;
        params.Transparent = params._Transparent;

        console.log(" 全部还原 ing   "  );
    }
    //paramList = stepList[0];
    paramList = CoyeParamLsit(stepList[0]) ;

    stepList.splice(1,stepList.length);//清空数组，只保留第一个

    //*/
    //拖拽模型取消
    SetDragModelToNone();
    //高亮模型取消
    selectedObjects = [];
    outlinePass.selectedObjects = [];
    //模型悬浮状态取消
    UnSelectModel();

    //摄像机位置还原
    ChangeToNiaokanViewDefault();

    
    //把模型状态保存下，传到父页面
    PostModelState();
}
//隐藏功能  隐藏选择 隐藏其他 全部取消隐藏
function HideFn(e){


    stepList.push(CoyeParamLsit(paramList) );
    //PringSetpList();

    switch ( e ) {
        case 1: //  隐藏选择
            console.log(" 隐藏选择   "  );
            if ( drag_objects.length<1 ) return;
            console.log(" 隐藏选择 111  "  );
            //drag_objects[0].visible = false;
            for(var i = 0;i < paramList.length;i++){
                var params = paramList[i];
                if(drag_objects[0].name == params.mesh.name){
                    params.Visible = false;
                }
            }

            //拖拽模型取消
            SetDragModelToNone();
            //高亮模型取消
            selectedObjects = [];
            outlinePass.selectedObjects = [];
            break;
        case 2: //  隐藏其他
            if ( drag_objects.length<1 ) return;

            for(var i = 0;i < paramList.length;i++){

                var params = paramList[i];
                if(drag_objects[0].name != params.mesh.name){
                    params.Visible = false;
                }
            }
            break;
        case 3: // 全部取消隐藏

            for(var i = 0;i < paramList.length;i++){

                var params = paramList[i];
                params.Visible = true;
            }
            break;
        default:
    }

    //把模型状态保存下，传到父页面
    PostModelState();
}

var canPost= true;
//把模型状态保存下，传到父页面
function PostModelState(){
    if(!canPost){return;}
    var list = [];
    var content = "";
    for(var i = 0;i < paramList.length;i++){
        var params = paramList[i];
        // list.push({title:params.mesh.name,visible:params.Visible});
        content += params.mesh.name + "1" + params.Visible + "0";
    }
    //向父界面传出消息
    // window.parent.postMessage("模型显示隐藏状态|"+list,"*");
    window.parent.postMessage("模型显示隐藏状态|"+content,"*");

}

function HideByModelNameFnBefore() {
    stepList.push(CoyeParamLsit(paramList) );
}
//隐藏指定名字的模型
function HideByModelNameFn(e,visible){
    //console.log( " in HideByModelNameFn "  + e);
    //return;
    //
    //PringSetpList();
    //drag_objects[0].visible = false;
    for(var i = 0;i < paramList.length;i++){
        var params = paramList[i];
        if(e.indexOf(params.mesh.name) >-1 ){
            params.Visible = visible;
        }
        //console.log( " in HideByModelNameFn "  +i + paramList[i].mesh.name);
    }
    return;
    switch ( e ) {
        case 1: //  隐藏选择
            if ( drag_objects.length<1 ) return;
            //drag_objects[0].visible = false;
            for(var i = 0;i < paramList.length;i++){
                var params = paramList[i];
                if(drag_objects[0].name == params.mesh.name){
                    params.Visible = false;
                }
            }

            //拖拽模型取消
            SetDragModelToNone();
            //高亮模型取消
            selectedObjects = [];
            outlinePass.selectedObjects = [];
            break;
        case 2: //  隐藏其他
            if ( drag_objects.length<1 ) return;

            for(var i = 0;i < paramList.length;i++){

                var params = paramList[i];
                if(drag_objects[0].name != params.mesh.name){
                    params.Visible = false;
                }
            }
            break;
        case 3: // 全部取消隐藏

            for(var i = 0;i < paramList.length;i++){

                var params = paramList[i];
                params.Visible = true;
            }
            break;
        default:
    }

}

//透明功能  透明选择 透明其他 全部取消透明
function TransparentFn(e){
    //stepList.push(paramList);
    stepList.push(CoyeParamLsit(paramList) );

    switch ( e ) {
        case 1: //  透明选择
            if ( drag_objects.length<1 ) return;

            //if(drag_objects[0].material.transparent){
            //    drag_objects[0].material.opacity = 1;
            //    drag_objects[0].material.transparent = false;
            //    return;
            //}
            //drag_objects[0].material.opacity = 0.2;
            //drag_objects[0].material.transparent = true;


            for(var i = 0;i < paramList.length;i++){
                var params = paramList[i];
                if(drag_objects[0].name == params.mesh.name){

                    params.Transparent = !params._Transparent;
                }
            }
            //drag_objects[0].material.premultipliedAlpha = true;
            break;
        case 2: //  透明其他
            if ( drag_objects.length<1 ) return;
            //for(var i = 0;i < meshNameData.length;i++){
            //
            //    if(drag_objects[0].name != meshNameData[i].name){
            //        meshNameData[i].material.opacity = 0.2;
            //        meshNameData[i].material.transparent = true;
            //    }
            //}

            for(var i = 0;i < paramList.length;i++){
                var params = paramList[i];
                if(drag_objects[0].name != params.mesh.name){
                    params.Transparent = true;
                }
            }
            break;
        case 3: // 全部取消透明
            //for(var i = 0;i < meshNameData.length;i++){
            //    meshNameData[i].material.opacity = 1;
            //    meshNameData[i].material.transparent = false;
            //}
            for(var i = 0;i < paramList.length;i++){
                var params = paramList[i];
                params.Transparent = false;
            }
            break;
        default:
    }


}


var menuctrl=null;

//撤销
var stepList = [];
function Prev(){
    if(stepList.length === "unfind" || stepList.length < 2){
        ResetAll();
        return;
    }
    //控制树形菜单
    if(menuctrl==null){
       // menuctrl = document.getElementById("MenuCtrl").contentWindow;
    }
    //还原为最后记录的
    for(var i = 0;i < stepList[stepList.length-1].length;i++){

        var params = stepList[stepList.length-1][i];

        params.ToDefaultPosition = 0;
        params.Visible = params._Visible;
        params.Transparent = params._Transparent;

        //控制树形菜单
        if(menuctrl!=null){
            if(params._Visible){
                menuctrl.AddToCustomArray(params.name);
            }
        }
        //console.log(" 全部撤销 ing   "  );
    }
    //paramList =  stepList[stepList.length-2];
    paramList = CoyeParamLsit(stepList[stepList.length-2]) ;

    //stepList.splice(stepList.length-1,1);//删除数组最后一个元素
    stepList.pop();//删除数组最后一个元素
    console.log(" 还剩返回长度为  " +stepList.length );

    //控制树形菜单
    if(menuctrl!=null){
        menuctrl.setCheckedNodesCustomArray();
    }

    //把模型状态保存下，传到父页面
    PostModelState();
}

//打印查看数组
function PringSetpList(){

    for(var j = 0;j < stepList.length;j++){
        var paramList = stepList[j];
        //还原为最后记录的
        for(var i = 0;i < paramList.length;i++){

            var params = paramList[i];

            params.ToDefaultPosition = 0;
            //params.Visible = params.display;
            //params.Transparent = params.transparent;
            params.Visible = params._Visible;
            params.Transparent = params._Transparent;

            console.log(j + " 打印 PringSetpList   " +params.mesh.name + "    " + params._Visible + "  " + params._Transparent );
        }


    }

}
//收藏功能
//数组为引用类型。直接复制修改，原来的数组也会修改。所以要创建新的数组并复制，再添加
function CoyeParamLsit(paramList){
    var res = [];
    for(var i = 0;i < paramList.length;i++){
        var oldParams = paramList[i];
        //name,mesh,opacity,position,positionX,positionY,positionZ,display,transparent
        var params = new ModelItemParams("",null,1,new THREE.Vector3(0,0,0),0,0,0,true,false);
        params.name = oldParams.name;
        params.mesh = oldParams.mesh;
        params.position = oldParams.position;  //这个值永远会显示当前位置

        params.positionX = oldParams.positionX;  //这里永远是初始化位置
        params.positionY =  oldParams.positionY;
        params.positionZ = oldParams.positionZ;
        params.opacity = oldParams.opacity;
        params.display = oldParams.display;
        params.transparent = oldParams.transparent;

        res.push(params);
    }
    return res;
}

///通过模型名称选择模型
function SelectModelByName(objName){
    var selectObj = null;
    //查找模型
    for(var i = 0;i < paramList.length;i++){
        var params = paramList[i];
        if(params.mesh.name == objName ){
            selectObj = params.mesh;
        }
        //console.log( " in HideByModelNameFn "  +i + paramList[i].mesh.name);
    }
    //高亮模型
    if(selectObj ==null){return;}
    SelectObjFromMesh(selectObj); 

    //视角居中到模型
    DoubleClickModel(selectObj);

}