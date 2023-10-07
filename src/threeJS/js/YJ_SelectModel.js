/*
* 选中模型脚本
* 模型外轮廓高亮 同时颜色变色
*
* */
//*

var childiframeWin = null;


function SelectModel(object){
    if(oldObject==object){
        return;
    }
    UnSelectModel();
    return;

    oldObject=object;

    //childiframeWin = document.getElementsByName("modelItem").contentWindow;//通过iframe标签的id获取
    if(childiframeWin == null){
        childiframeWin = document.getElementById("modelItem").contentWindow;//通过iframe标签的id获取
    }
    if(childiframeWin != null){
        //obj格式模型要获取 parent.name才是模型的模型
        //childiframeWin.document.getElementById("log").innerText= object.parent.name;
        //fbx格式直接用object.name
        childiframeWin.document.getElementById("log").innerText= object.name;

        //childiframeWin.callmodeilItem(object.name);

        //var modelContent = document.getElementById("modelContent").contentWindow;//通过iframe标签的id获取
        //modelContent.document.ChangeModel(object.name);

    }


    //YJdebug("悬浮到的模型为 " +  object.name);// +" pos = "+ object.position.x + ","+  object.position.y + ","+  object.position.z );

    //ChangeObjectMat(object,0xa8b5ef); //0xfaf37d 黄 0x666666 灰  0xa8b5ef 蓝

    return;

}
//*/
var oldObject;
function UnSelectModel(){
    if(oldObject == null){
        return;
    }

    //ChangeObjectMat(oldObject,0x949494);
    //ChangeObjectMat(oldObject,0xffffff);
    oldObject = null;

    if(childiframeWin != null){
        childiframeWin.document.getElementById("log").innerText= "";
    }
    return;

}

//mesh的坐标才是真实的坐标
function GetObjectPos(object){
    object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            console.log(" 刷新组中位置 " + item.name +  " pos = "+ item.position.x + ","+ item.position.y + ","+  item.position.z   );
        }
    });

    //console.log(" 刷新组中位置 " + object.name +  " pos = "+ object.position.x + ","+ object.position.y + ","+  object.position.z   );
}

//改变模型的材质为选中颜色
function ChangeObjectMat(object,color){
     object.traverse(function (item) {
     if (item instanceof THREE.Mesh) {
        if( item.material.length >1){
            for(var i=0;i<item.material.length;i++){
                item.material[i].color.setHex(color) ;
            }

        }else{
            //var c = item.material.color;
            //YJdebug(" 模型的原来颜色为  " + c.r +" " + c.g +" " +c.b   );
            item.material.color.setHex(color) ;
        }
         //YJdebug(" in 改变模型材质  " );
         //YJdebug(" in 改变模型材质 材质数量为 " +  item.material.length);
     // item.materials[1].color.setHex(0x666666) ;
     }
     });

    //console.log(" 刷新组中位置 " + object.name +  " pos = "+ object.position.x + ","+ object.position.y + ","+  object.position.z   );
}
