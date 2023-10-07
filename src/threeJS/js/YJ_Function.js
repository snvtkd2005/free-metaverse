
//打印出vector3
function PrintVector3(v3){
//                return "\n"+ "x:"+ v3.x.toString("F2") +"  y:"+ v3.y +"  z:" + v3.z;
    return "\n"+ "x:"+ v3.x +"  y:"+ v3.y +"  z:" + v3.z;
//                return  "x:"+ parseInt(v3.x) +"  y:"+ parseInt(v3.y) +"  z:" + parseInt(v3.z);
}
//坐标点（0,0.01）绕原点指定角度后的坐标
function JiaoduPos(text){
    var temp  = new THREE.Vector2();
    temp.x = -0.01*Math.sin(text);
    temp.y = 0.01*Math.cos(text);
    return temp;
}
//打印到控制台
function YJdebug(text){
    console.log(text);
}
//打印到屏幕
function YJdebug_screen(text){
    document.getElementById("log").innerText=text;
}