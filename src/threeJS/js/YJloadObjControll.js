/**
 * Created by yangjun on 2017/5/8.
 */

document.write("<script type='text/javascript' src='js/YJ_SceneModelCtrl.js'></script>");

var ball360;
var console;
function loadAllObj(text,count){
    for(i=1;i<=count;i++)
        loadObj(text+'-'+i);
}

var loadprogress = 0;
function FixedLoadProgress(){
    var percentComplete =(loadprogress/needLoadCount)*100;
return;
    window.parent.document.getElementById("loadprocess").contentWindow.SetProgress(percentComplete);
    // if(percentComplete>=100){
    //     window.parent.document.getElementById("loadprocess").style.display = "none"; //隐藏
    // }

    // document.getElementById("loadprocess").contentWindow.SetProgress(percentComplete);
    // if(percentComplete>=100){
    //     document.getElementById("loadprocess").style.display = "none"; //隐藏
    // }

}

var texArray = [];
var texTextArray = [];
function loadObj(path, text,tex,_color,normal,ao){ //teapot2
    needLoadCount++;

    //path 路径
    //text 模型名
    //tex 贴图名
    //color 材质球漫反射颜色
    //normal 材质球 法线贴图
    //ao 材质球 AO贴图
    var manager = new THREE.LoadingManager();
    manager.onProgress = function( item, loaded, total ) {
        //console.log( item, loaded, total );
    };
    var onProgress = function( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
        var loadProgress =  Math.round( percentComplete, 2);
        //document.getElementById("log").innerText = '加载中。。。'+loadProgress + '% downloaded' ;
        if(loadProgress == 100){
              //document.getElementById("log").innerText= "downloaded complete";
            // document.getElementById("loading").style.display = "none"; //隐藏

        }else{
            //document.getElementById("loading").style.display = "";  //显示
        }

        if(percentComplete >=100){
            //console.log( " 加载完成 " + text );
            loadprogress++;
            FixedLoadProgress();
        }
    };
    var onError = function( xhr ) {
        //console.error( xhr );
    };

    //var loadMehs = new THREE.Object3D();
    //loadMehs.name = text;

    var texture = new THREE.Texture();
    var loaderTex = new THREE.ImageLoader(manager);
    /*
    loaderTex.load('objs/'+ path+'/Body_bone_D.jpg',function (image){
        texture.image = image;
        texture.needsUpdate = true;
    });*/
    if(tex!=""){


        if(texTextArray.indexOf(tex)>-1){
            texture = texArray[texTextArray.indexOf(tex)];
            //console.log(" 数组中包含 " + tex);
        }else{

            loaderTex.load('objs/'+ path+'/Tex/'+tex+'.jpg',function (image){
                texture.image = image;
                texture.needsUpdate = true;
            });

            texArray.push(texture);
            texTextArray.push(tex);
        }

    }


    var texture_normal = new THREE.Texture();
    var loaderTex_normal = new THREE.ImageLoader(manager);
    if(normal!=""){



        if(texTextArray.indexOf(normal)>-1){
            texture_normal = texArray[texTextArray.indexOf(normal)];
            //console.log(" 数组中包含 " + normal);
        }else{

            loaderTex_normal.load('objs/'+ path+'/Tex/'+normal+'.jpg',function (image){
                texture_normal.image = image;
                texture_normal.needsUpdate = true;
            });

            texArray.push(texture_normal);
            texTextArray.push(normal);
        }

    }

    var texture_ao = new THREE.Texture();
    var loaderTex_ao = new THREE.ImageLoader(manager);

    if(ao==""){ao = "white";}
    if(ao!=""){

        if(texTextArray.indexOf(ao)>-1){
            texture_ao = texArray[texTextArray.indexOf(ao)];
            //console.log(" 数组中包含 " + ao);
        }else{
            loaderTex_ao.load('objs/'+ path+'/Tex/'+ao+'.jpg',function (image){
                texture_ao.image = image;
                texture_ao.needsUpdate = true;
            });

            texArray.push(texture_ao);
            texTextArray.push(ao);
        }


    } 
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('objs/' + path+"/");
    objLoader.load(text+'.obj',function(object){
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                //标准材质球
                child.material= new THREE.MeshStandardMaterial({
                    metalness:0.1,  //金属
                    roughness:0.5, //高光
                   // color:0xffffff, //颜色
                    color:_color, //颜色
                    depthTest: true
                });
                if(tex!=""){
                    child.material.map = texture;
                }

                if(normal!=""){
                    child.material.normalMap = texture_normal;
                }
                if(ao!=""){
                    child.material.lightMap = texture_ao;
                }

            }
            //obj格式需要设置child 的名称
            child.name = text;


        } );

        object.name = text;
        AddToSceneAndCheckLoadComplete(object);



    }, onProgress, onError );

}
function loadDrc(path, text,tex,_color,_opacity,normal,ao){
    needLoadCount++;

        // console.log( text + " "  + _opacity);

    //path 路径
    //text 模型名
    //tex 贴图名
    //color 材质球漫反射颜色
    //normal 材质球 法线贴图
    //ao 材质球 AO贴图
    var manager = new THREE.LoadingManager();
    manager.onProgress = function( item, loaded, total ) {
        //console.log( item, loaded, total );
    };
    var onProgress = function( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
        var loadProgress =  Math.round( percentComplete, 2);
        //document.getElementById("log").innerText = '加载中。。。'+loadProgress + '% downloaded' ;
        if(loadProgress == 100){
              //document.getElementById("log").innerText= "downloaded complete";
            // document.getElementById("loading").style.display = "none"; //隐藏

        }else{
            //document.getElementById("loading").style.display = "";  //显示
        }

        if(percentComplete >=100){
            //console.log( " 加载完成 " + text );
            loadprogress++;
            FixedLoadProgress();
        }
    };
    var onError = function( xhr ) {
        console.error( xhr +" " +text );
    };

    //var loadMehs = new THREE.Object3D();
    //loadMehs.name = text;

    var texture = new THREE.Texture();
    var loaderTex = new THREE.ImageLoader(manager);

    if(tex!=""){

        if(texTextArray.indexOf(tex)>-1){
            texture = texArray[texTextArray.indexOf(tex)];
            //console.log(" 数组中包含 " + tex);
        }else{
            loaderTex.load( path+'/Tex/'+tex+'.jpg',function (image){
                texture.image = image;
                texture.needsUpdate = true;
                console.log(" 加载图片成功 " + path+'/Tex/'+ tex +'.jpg');

            });

            texArray.push(texture);
            texTextArray.push(tex);
        }

    }
    /*
    loaderTex.load('objs/uparm2/Body_bone_D.jpg',function (image){
        texture.image = image;
        texture.needsUpdate = true;
    });//*/

    var texture_normal = new THREE.Texture();
    var loaderTex_normal = new THREE.ImageLoader(manager);

    normal = "";
    if(normal!=""){
 

        if(texTextArray.indexOf(normal)>-1){
            texture_normal = texArray[texTextArray.indexOf(normal)];
            //console.log(" 数组中包含 " + normal);
        }else{

            loaderTex_normal.load( path+'/Tex/'+normal+'.jpg',function (image){
                texture_normal.image = image;
                texture_normal.needsUpdate = true;
            });

            texArray.push(texture_normal);
            texTextArray.push(normal);
        }

    }

    var texture_ao = new THREE.Texture();
    var loaderTex_ao = new THREE.ImageLoader(manager);
 

    if(ao==""){ao = "white";}
    if(ao!=""){
        

        if(texTextArray.indexOf(ao)>-1){
            texture_ao = texArray[texTextArray.indexOf(ao)];
            //console.log(" 数组中包含 " + ao);
        }else{
            loaderTex_ao.load( path+'/Tex/'+ao+'.jpg',function (image){
                texture_ao.image = image;
                texture_ao.needsUpdate = true;
            });

            texArray.push(texture_ao);
            texTextArray.push(ao);
        }


    }
    //*
    dracoLoader.load( path+'/drc/'+text+ '.drc', function ( object )
    {

        object.computeVertexNormals();

        var material = new THREE.MeshStandardMaterial( {
            //vertexColors: THREE.VertexColors,
            metalness:0.1,  //金属
            roughness:0.9, //高光
            // color:0xffffff, //颜色
            color:_color, //颜色
            transparent:_opacity<1,
            opacity:_opacity,
            // opacity:1,
            depthTest: true

        } );

        if(tex!=""){
            material.map = texture;
        }

        if(normal!=""){
            material.normalMap = texture_normal;
        }
        if(ao!=""){
            material.lightMap = texture_ao;
        }


        var mesh = new THREE.Mesh( object, material );
        //mesh.castShadow = true;
        //mesh.receiveShadow = true;
        mesh.name = text;


        object.name = text;

        //scene.add( mesh );

        AddToSceneAndCheckLoadComplete(mesh);



    }, onProgress, onError );

return;


}




function loadFbx(text){

    needLoadCount++;
    var manager = new THREE.LoadingManager();


    manager.onProgress = function( item, loaded, total ) {
        //console.log( item, loaded, total );
        //console.log( "开始加载 " + text );

    };
    var onProgress = function( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;

            if(percentComplete >=100){
            //console.log( " 加载完成 " + text );
                loadprogress++;
                FixedLoadProgress();
            }
            //console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };
    var onError = function( xhr ) {
        console.error( xhr );

    };

    var mixers = [];
    var loader = new THREE.FBXLoader(manager);
    loader.load( 'fbx/'+text+'.fbx', function( object ) {
//                    object.mixer = new THREE.AnimationMixer( object );
//                    mixers.push( object.mixer );
//                    var action = object.mixer.clipAction( object.animations[ 0 ] );
//                    action.play();
       //*
        var texture = new THREE.Texture();
        var loaderTex = new THREE.ImageLoader(manager);
        loaderTex.load('fbx/uparm/Body_bone_D'+ '.jpg',function (image){
            texture.image = image;
            texture.needsUpdate = true;
        });
        //*/

        //*
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                //给name为A开头的模型贴图
                /*
                var materialColor = new THREE.MeshStandardMaterial({
                    metalness:0,
                    roughness:0.5,
                    color:0xffffff,
                    depthTest: true
                });

                child.material= materialColor;
                //*/
                child.material.color.setHex(0xffffff) ;
                child.material.map =texture ;
        } });
         //*/
         /*
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                //给name为A开头的模型贴图
                child.material= new THREE.MeshBasicMaterial({color: 0xFFFFFF});
                child.material.map = texture;
            } });

        //*/
        object.name = text;
        //pointsParent.add( object );
        AddToSceneAndCheckLoadComplete(object);
        if(text == "export/B04_floor010"){
            object.tag = "floor";
            YJdebug(" 添加标签 ");
            //pointsParent.add( object );
            //object.position.y = -10;

        }else{
            //scene.add( object );
        }

        //scene.add( object );

    }, onProgress,onError);
    //*/
}

var needLoadCount = 0;
function AddToSceneAndCheckLoadComplete(object){

    // console.log(" 正在添加 " +object.name +"  到场景");
    pointsParent.add( object ); 

    if(pointsParent.children.length == needLoadCount){
        //子物体数量 与应加载数量相等，则表示全部加载完成
        InitSceneModelData();
        needLoadCount = 0;

        //测试删除模型
        //RemoveAllModelFromScene();
    }
}


function loadFbx2(text){
    var manager = new THREE.LoadingManager();

    manager.onProgress = function( item, loaded, total ) {
        //console.log( item, loaded, total );
    };
    var onProgress = function( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };
    var onError = function( xhr ) {
        console.error( xhr );
    };

    var mixers = [];
    var loader = new THREE.FBXLoader(manager);
    loader.load( 'fbx/'+text+'.fbx', function( object ) {
//                    object.mixer = new THREE.AnimationMixer( object );
//                    mixers.push( object.mixer );
//                    var action = object.mixer.clipAction( object.animations[ 0 ] );
//                    action.play();


        /*
         var texture = new THREE.Texture();
         var loaderTex = new THREE.ImageLoader(manager);
         loaderTex.load('fbx/export/B04_door100_d'+ '.jpg',function (image){
         texture.image = image;
         texture.needsUpdate = true;
         });
         //*/

        /*
         object.traverse( function ( child ) {
         if ( child instanceof THREE.Mesh ) {
             //给name为A开头的模型贴图
             child.material= new THREE.MeshBasicMaterial({color: 0xFFFFFF});
             child.material.map = texture;
         } });

         //*/
        object.name = text;
        pointsParent.add( object );


    }, onProgress,onError);
    //*/
}
//从父物体中删除模型
function RemoveFromScene(p,object){

    if(scene == p){
        p.remove( object );
        return;
    }
    //*
    // 删除掉所有的模型组内的mesh
    object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.geometry.dispose(); // 删除几何体
            item.material.dispose(); // 删除材质
        }
    });//*/
    //新建组，把要删除的物体添加进组里。再从场景中删除该组
    var item = new THREE.Group();
    item.name  = 'delParent' ;
    scene.add(item);
    item.add( object );


    scene.remove(item);
    THREE.Cache.clear();
    renderer.dispose();
}
//从父物体中删除模型
function RemoveAllModelFromScene(){

    //*
    for(var i = 0;i < pointsParent.children.length;i++){
        // 删除掉所有的模型组内的mesh
        pointsParent.children[i].traverse(function (item) {
            if (item instanceof THREE.Mesh) {

                item.geometry.dispose(); // 删除几何体
                if( item.material.length >1){
                    for(var i=0;i<item.material.length;i++){
                        item.material[i].dispose(); // 删除材质
                    }
                }else{
                    item.material.dispose(); // 删除材质
                }
            }
        });

    }
    //*/
    for(var i = pointsParent.children.length-1;i >= 0;i--){

        pointsParent.remove(pointsParent.children[0]);

    }

    //scene.remove(pointsParent);

    renderer.dispose();

    THREE.Cache.clear();
}
function ReloadAllModelFromScene(){

    getPoints_OBJ(1);

    //loadFbx('export/B04_Cylinder019');
    //loadFbx('export/B04_floor010');
    //loadFbx('export/B04_tuxing001');
    //loadFbx('export/B04_wall01');

}

/**
 * 清空渲染器缓存，该demo中无需使用
 */
function clearRenderer(){
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.context = null;
    renderer.domElement = null;
    renderer = null;
}
/**
 * 清除模型，模型中有 group 和 scene,需要进行判断
 * @param scene
 * @returns
 */
function clearScene(){
    // 从scene中删除模型并释放内存
    if(myObjects.length > 0){
        for(var i = 0; i< myObjects.length; i++){
            var currObj = myObjects[i];

            // 判断类型
            if(currObj instanceof THREE.Scene){
                var children = currObj.children;
                for(var i = 0; i< children.length; i++){
                    deleteGroup(children[i]);
                }
            }else{
                deleteGroup(currObj);
            }
            scene.remove(currObj);
        }
    }
}

// 删除group，释放内存
function deleteGroup(group) {
    //console.log(group);
    if (!group) return;
    // 删除掉所有的模型组内的mesh
    group.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.geometry.dispose(); // 删除几何体
            item.material.dispose(); // 删除材质
        }
    });
}

function YJupdate(){
    if(ball360 != null){
        ball360.rotation.y += 0.001;//添加动画
        if (ball360.rotation.y > Math.PI * 2) {
            ball360.rotation.y -= Math.PI * 2;
        }
    }

}


function loadImage(url, callback,num) {
    loadingDisplay(true);
    var img = new Image(); //创建一个Image对象，实现图片的预下载
    img.onload =
        function(){
            img.onload = null;
            callback(img,num);
        };
    img.src = url;
}
var nums = [];
var numsSetLength = 0;
function clearArray(length){
    nums.splice(0,nums.length);
    numsSetLength = length;
}
function call(img,num){

    nums.push(num);
    //YJdebug(img.src +" is download ");
    YJdebug( parseFloat((nums.length*1.0)/(numsSetLength)).toFixed(2)  * 100  +" % is download ");
    checkDownload();
    //$(img).appendTo('.box');
}
function checkDownload(){
    if(nums.length>24){
        loadingDisplay(false);
    }
}


//通过点击到的热点名，去json数据中获取信息
function getPoints (text)
{

    var pointsLength, pointName,pointTag,pointPos,defaultTargetPos;
    $.getJSON ("fbx/uparm/names.txt", function (data)
    {
        $.each (data, function (i, item)
        {
            // 根据我的json格式看，data内只有一个元素，即item
            // 需要获取的是item内的元素，所以遍历item
            //ii = 键名   value = 键值
            $.each (item, function (ii, value){

                //console.log( " load " + ii + " "  +value["name"]);
                 loadFbx( "uparm/" + value["name"]) ;

            });
            //不能在each里返回，因为会有延迟
        });
    });
}

//通过点击到的热点名，去json数据中获取信息
function getPoints_OBJ (text)
{
    //GetData();
    var pointsLength, pointName,pointTag,pointPos,defaultTargetPos;
    var path = "OBJ";
    //$.getJSON ("objs/uparm2/names.txt", function (data)
    $.getJSON ("objs/"+path+"/names.txt", function (data)
    {
        $.each (data, function (i, item)
        {
            // 根据我的json格式看，data内只有一个元素，即item
            // 需要获取的是item内的元素，所以遍历item
            //ii = 键名   value = 键值
            $.each (item, function (ii, value){

                //console.log( " load " + ii + " "  +value["name"]);
                //loadObj( "uparm2/" + value["name"]) ;
                loadObj( path, value["cnName"],value["dTex"], ColorArrayToColor( value["dColor"])
                ,value["nTex"],value["aoTex"]) ;
            });
            //不能在each里返回，因为会有延迟
        });
    });
}

function LoadModel_Drc(path,textname)
{
    $.getJSON (path+"/data/"+textname+".txt", function (data)
    {
        $.each (data, function (i, item)
        {
            // 根据我的json格式看，data内只有一个元素，即item
            // 需要获取的是item内的元素，所以遍历item
            //ii = 键名   value = 键值
            $.each (item, function (ii, value){
 
                loadDrc( path, value["cnName"],value["dTex"], ColorArrayToColor( value["dColor"])
               , ColorArrayToOpacity(value["dColor"]),value["nTex"],value["aoTex"]) ;
            });
            //不能在each里返回，因为会有延迟
        });
    });
}

function ColorArrayToOpacity(array){
     return array[3]/255.0;
 }

function ColorArrayToColor(array){
   // var color = ("rgb("+array[0]+","+array[1]+"," + array[2]+")").colorHex();
    var color =colorRGBtoHex ("rgb("+array[0]+","+array[1]+"," + array[2]+")");
    //console.log(color);
    return color;
}

String.prototype.colorHex = function () {
    // RGB颜色值的正则
    var reg = /^(rgb|RGB)/;
    var color = this;
    if (reg.test(color)) {
        var strHex = "#";
        // 把RGB的3个数值变成数组
        var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        // 转成16进制
        for (var i = 0; i < colorArr.length; i++) {
            var hex = Number(colorArr[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        return strHex;
    } else {
        return String(color);
    }
};
function colorRGBtoHex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}



function GetData(){
    $.getJSON ("objs/OBJ/names.txt", function (data)
    {
        console.log("in GetData " + data);
        return data;
    });

}

function Test(e){

    console.log(" 测试子 " + e);

}