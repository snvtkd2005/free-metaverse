import * as THREE from "three";

export class ID_Wall_Manager {
    constructor(app) {
        this.app = app;
        this.color_arr=['#0E79EC','#3AEC0E'];

        //this.username=username;
        this.randomNames=["aaaa", "bbb", "ccc", "ddd", "ee", "fff", "ggg", "hhh", "iiii", "jjj", "kkk", "lll", "mmm", "nnn", "ooo", "pppp", "qqq", "rrr", "sss", "ttt", "uuu", "vvv", "www", "xxx", "yy", "zzz", "111", "222", "33", "444", "555", "888", "777", "666"];
        this.intervalID = null;
        this.mem_wait=[];//等待队列
    }
    /**该方法用来绘制一个有填充色的圆角矩形
     *@param cxt:canvas的上下文环境
        *@param x:左上角x轴坐标
        *@param y:左上角y轴坐标
        *@param width:矩形的宽度
        *@param height:矩形的高度
        *@param radius:圆的半径
        *@param fillColor:填充颜色
        **/
    fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor){
        //圆的直径必然要小于矩形的宽高
        if (2 * radius > width || 2 * radius > height) { return false; }
        cxt.save();
        cxt.translate(x, y);
        //绘制圆角矩形的各个边
        this.drawRoundRectPath(cxt, width, height, radius);
        cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值
        cxt.fill();
        cxt.restore();
    }

    /**该方法用来绘制圆角矩形
     *@param cxt:canvas的上下文环境
        *@param x:左上角x轴坐标
        *@param y:左上角y轴坐标
        *@param width:矩形的宽度
        *@param height:矩形的高度
        *@param radius:圆的半径
        *@param lineWidth:线条粗细
        *@param strokeColor:线条颜色
        **/
    strokeRoundRect(cxt, x, y, width, height, radius, /*optional*/ lineWidth, /*optional*/ strokeColor){
        //圆的直径必然要小于矩形的宽高
        if (2 * radius > width || 2 * radius > height) { return false; }

        cxt.save();
        cxt.translate(x, y);
        //绘制圆角矩形的各个边
        this.drawRoundRectPath(cxt, width, height, radius);
        cxt.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2
        cxt.strokeStyle = strokeColor || "#000";
        cxt.stroke();
        cxt.restore();
    }

    drawRoundRectPath(cxt, width, height, radius){
        cxt.beginPath(0);
        //从右下角顺时针绘制，弧度从0到1/2PI
        cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
        //矩形下边线
        cxt.lineTo(radius, height);
        //左下角圆弧，弧度从1/2PI到PI
        cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
        //矩形左边线
        cxt.lineTo(0, radius);
        //左上角圆弧，弧度从PI到3/2PI
        cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
        //上边线
        cxt.lineTo(width - radius, 0);
        //右上角圆弧
        cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
        //右边线
        cxt.lineTo(width, height - radius);
        cxt.closePath();
    }

    /**该方法用来生成material
     *@param ussername:用户名字
    **/
    makeTexture(ussername,flag){
        /**
            * 创建一个canvas对象，并绘制一些轮廓
            */
        var randNum = this.randonPlaneName(0,1,0);
        var canvas = document.createElement("canvas");
        // 上面canvas代码省略
        canvas.width = 512;
        canvas.height = 512;
        var c = canvas.getContext('2d');//color_arr[randNum];
        // 矩形区域填充背景    
        this.fillRoundRect(c, 0, 128, 512, 256, 30, (flag==1)?'#FF0000':this.color_arr[randNum]);
        this.fillRoundRect(c, 20, 138, 472, 236, 30, '#000006');
        
        
        // 文字
        c.beginPath();
        c.translate(256,256);    
        c.fillStyle = (flag==1)?'#FF0000':this.color_arr[randNum]; //文本填充颜色
        c.font = "bold 100px 黑体"; //字体样式设置
        c.textBaseline = "middle"; //文本与fillText定义的纵坐标
        c.textAlign = "center"; //文本居中(以fillText定义的横坐标)
        c.fillText(ussername, 0, 0,462);    
        
        // canvas画布对象作为CanvasTexture的参数重建一个纹理对象
        // canvas画布可以理解为一张图片
        var texture = new THREE.CanvasTexture(canvas);
        // 设置纹理旋转角度
        // texture.rotation = 1.56;    
        // 设置纹理的旋转中心，默认(0,0)
        // texture.center.set(0.5,0.5);
        // console.log(texture)    
        var material = new THREE.MeshPhysicalMaterial({
            map: texture, // 设置纹理贴图
            emissive:0xffffff,// emissive默认黑色，设置为白色
            emissiveMap: texture,
        });
        return material;
    }
    /**该方法用来把material赋值给名牌
     *@param planeName:名牌mesh的名字
     *@param textInfo:用户名字和显示时长
    **/
    setMaterial(planeName,textInfo){
        //console.log(planeName,textInfo);
        let Aplane=this.app.scene.getObjectByName('APlane'+planeName);
        let Bplane=this.app.scene.getObjectByName('BPlane'+planeName);
        if (Aplane !=undefined && Bplane !=undefined){
            Aplane.visible=true;
            Bplane.visible=true;
            let temp_m=this.makeTexture(textInfo.name,textInfo.flag);
            //let temp_m=this.makeTexture(planeName,textInfo.flag);
            //let str_name=child.name;
            Aplane.material=temp_m;
            Bplane.material=temp_m;
            Aplane.m_flag=true;
            Bplane.m_flag=true;
            Aplane.mem_time=textInfo.time;
            Bplane.mem_time=textInfo.time;
            
            Aplane.material.side = THREE.DoubleSide;
            Bplane.material.side = THREE.DoubleSide;
            Aplane.material.transparent = true;
            Bplane.material.transparent = true;
            Aplane.material.opacity = 1;
            Bplane.material.opacity = 1;
            let temp_t=new Date().getTime();
            Aplane.time_num = temp_t;
            Bplane.time_num = temp_t;
        }
    }
    /**该方法用来随机取得名牌名字
     *@param lowerValue:最小值
     *@param upperValue:最大值 
     *@param fix:是否补全 
    **/
    randonPlaneName(lowerValue, upperValue,fix){
        let a =  Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
        if (fix==1){
            if(a < 10){
                a = "00"+a;
            }else if(a < 100){
                a = "0"+a;
            }
        }        
        return a;
    }
    /**外部调用的方法 该方法用来根据传入的名字数组生成名牌 
     *@param usernames:所有名字和显示时间[{name:'abc',time:10,flag:1}]flag:1->自己，用指定颜色
    **/
    update_ID_Wall(usernames){
        for(var i=0;i<usernames.length;i++){
            let plane_name=this.getEmpty(usernames[i]);
            if (plane_name!=null){
                this.setMaterial(plane_name,usernames[i]);
            }
        }
        //测试
        /*let intervalID22 = setInterval(function(){
            this.update_ID_Wall([{name:'元宇宙用户2938',time:10,flag:1}]);
        }.bind(this),3000);*/
    }
    //获取空闲的名牌，没有空闲的则把当前用户信息存入等待队列
    getEmpty(item){
        let obj=this.app.scene.getObjectByName('id_wall');
        let the_empty=null;
        if (obj!=undefined){
            
            let obj_c=obj.children;
            //console.log(obj_c)
            if (item.flag==1){
                for(var j=0;j<obj_c.length;j++){
                    if(obj_c[j].isDefault){
                        let temp0=obj_c[j].name;
                        the_empty=temp0.substring(temp0.indexOf('Plane')+5);
                        return the_empty; 
                    }
                }
            }else{
                for(var i=0;i<obj_c.length;i++){
                    if(!obj_c[i].m_flag && obj_c[i].isMesh){
                        //找到空闲的牌子，返回
                        let temp1=obj_c[i].name;
                        the_empty=temp1.substring(temp1.indexOf('Plane')+5);
                        return the_empty;
                    }
                }
            }
            
        }
        this.mem_wait.push(item);
        return the_empty;
    }
    refresh_ID_Wall(){
        var that=this;
        let obj=that.app.scene.getObjectByName('id_wall');
        if (obj!=undefined){
            that.update_ID_Wall([{name:that.randomNames[that.randonPlaneName(0,that.randomNames.length-1,0)],time:10,flag:0}]);
            obj.traverseVisible(function(child) {
                let getTime = new Date().getTime();
                if(child.time_num != 'undefined'){
                    if (Number(getTime) - Number(child.time_num) >= Number(child.mem_time)*1000) {
                        if (child.material.opacity>0){
                            child.material.opacity -= 0.2;
                        }
                        
                        if (child.material.opacity <= 0) {
                            child.visible=false;
                            child.m_flag=false;
                            //有空闲位置，把等待列表内的信息拿出来展示
                            if (that.mem_wait.length>0){
                                that.update_ID_Wall(that.mem_wait.shift());
                            }
                        }
                    }
                }
            })
        }
        
    }
    init(){
        if (this.intervalID==null){
            this.intervalID = setInterval(this.refresh_ID_Wall.bind(this),1000);
        }
    }
    exit(){
        clearInterval(this.intervalID);
    }
}