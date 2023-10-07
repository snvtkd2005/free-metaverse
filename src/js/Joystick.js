


class Joystick {

    constructor(joystick, x, y, direction, domElement, jiPath, joPath) {

        this.axisX = 0;
        this.axisY = 0;

        this.domElement = (domElement !== undefined) ? domElement : document;

        var inJoystickArea = false;

        var ji = new Image(); //内摇杆图片
        var jo = new Image(); //外摇杆图片
        //var joystick = document.getElementById('joystick'); //画板
        var josize = joystick.height; //外摇杆大小
        var jisize = josize * 0.6; //内摇杆大小
        var centerX = josize / 2; //摇杆中心x坐标
        var centerY = josize / 2; //摇杆中心y坐标

        var offsetX = 100;
        var offsetY = 100;


        var centerPosX = 0; //摇杆中心x坐标
        var centerPosY = 0; //摇杆中心y坐标


        var jc = joystick.getContext('2d'); //画布

        //摇杆头应当移动到的位置
        var jx = 0, jy = 0;

        ji.src = jiPath;//加载 摇杆头
        jo.src = joPath;//加载 画底座

        //图片加载完成时执行这俩函数
        ji.onload = function () {
            // console.log("摇杆头图片加载成功",jiPath);
            jc.drawImage(ji, centerX - jisize / 2, centerY - jisize / 2, jisize, jisize); //首次绘制内摇杆
            // console.log("摇杆头图片 绘制 成功");
        };
        jo.onload = function () {
            // console.log("摇杆头图片加载成功",joPath);

            jc.drawImage(jo, centerX - josize / 2, centerY - josize / 2, josize, josize);
        };


        // ji.src = '@/assets/images/ui/joystick/RadialJoy_Area.png';//加载 摇杆头
        // jo.src = '@/assets/images/ui/joystick/RadialJoy_Area.png';//加载 画底座




        var effectiveFinger = 0; //当前有效手指

        //摇杆位移转成轴，限定到-1 1 之间的缩放值
        var axisScale = 23;
        //是否触摸到遥感范围
        //页面加载时执行该函数
        function load() {

            //外部设置偏移
            offsetX = x;
            offsetY = y;

            centerPosX = josize / 2 + offsetX; //摇杆中心x坐标
            centerPosY = josize / 2 + offsetY; //摇杆中心y坐标
            console.log(" offsetX load = " + offsetX + " offsetY = " + offsetY);

        }
        // 强制横屏
        var forcedLandscape = false;
        this.SetforcedLandscape = function (b) {
            // 是否强制横屏 forcedLandscape
            forcedLandscape = b;
        }
        this.Reload = function (x, y) {
            jx = 0;
            jy = 0;
            this.axisX = 0;
            this.axisY = 0;
            ji.src = jiPath;//加载 摇杆头
            jo.src = joPath;//加载 画底座
            // jo.src = "https://snvtkd2005.com/vue/dt/public/images/joystick2/RadialJoy_Area.png";//加载 画底座
            setTimeout(() => {
                ji.onload = function () {
                    // console.log("摇杆头图片加载成功",jiPath);
                    jc.drawImage(ji, centerX - jisize / 2, centerY - jisize / 2, jisize, jisize); //首次绘制内摇杆
                    // console.log("摇杆头图片 绘制 成功");
                };
                jo.onload = function () {
                    // console.log("摇杆头图片加载成功",joPath);

                    jc.drawImage(jo, centerX - josize / 2, centerY - josize / 2, josize, josize);
                };
            }, 1000);

            // console.log(" 是否处在强制横屏状态下 " , forcedLandscape?'是':'否' );

            //外部设置偏移
            offsetX = x;
            offsetY = y;
            if (forcedLandscape) {
                centerPosY = josize / 2 + offsetX; //摇杆中心x坐标
                centerPosX = -(josize / 2 - (window.innerWidth - offsetY)); //摇杆中心y坐标
            } else {
                centerPosX = josize / 2 + offsetX; //摇杆中心x坐标
                centerPosY = josize / 2 + offsetY; //摇杆中心y坐标
            }

            // console.log(" window.inner innerWidth = " + window.innerWidth + " innerHeight = "+ window.innerHeight);
            // console.log(" offsetX reload = " +offsetX + " offsetY = "+offsetY);
            // console.log(" 摇杆中心坐标 : x = " +centerPosX + " y = "+centerPosY);

        };




        //计算圆于直线的交点（这一块好难啊）
        function GetPoint(cx, cy, r, stx, sty, edx, edy) {
            //(x-cx)^2+(y-cy)^2=r^2
            //y=k*x+b
            var k = (edy - sty) / (edx - stx);
            var b = edy - k * edx;
            //(1 + k^2)*x^2 - x*(2*cx -2*k*(b -cy) ) + cx*cx + ( b - cy)*(b - cy) - r*r = 0
            var x1, y1, x2, y2;
            var c = cx * cx + (b - cy) * (b - cy) - r * r;
            var a = (1 + k * k);
            var b1 = (2 * cx - 2 * k * (b - cy));

            var tmp = Math.sqrt(b1 * b1 - 4 * a * c);

            x1 = (b1 + tmp) / (2 * a);
            y1 = k * x1 + b;

            x2 = (b1 - tmp) / (2 * a);
            y2 = k * x2 + b;
            return [x1, y1, x2, y2];
        }

        this.onMouseDown = function (event) {
            console.log(" onMouseDown ");

            var eventID = event.target.id;
            inJoystickArea = eventID.indexOf(direction) > -1;
            return;

        };
        this.onMouseUp = function (event) {

            // event.preventDefault();
            // event.stopPropagation();


            //若手指离开,那就把内摇杆放中间
            jx = 0;
            jy = 0;
            inJoystickArea = false;

            this.axisX = jx / axisScale;
            this.axisY = jy / axisScale;


        };


        this.onMouseMove = function (event) {


            // console.log(" event.clientX = " +event.clientX + " event.clientY = "+event.clientY);

            if (!inJoystickArea) { return; }
            //是否触摸点在摇杆上
            if (Math.sqrt(Math.pow(event.clientX - centerPosX, 2) +
                Math.pow(event.clientY - centerPosY, 2)) <=
                josize / 2 - jisize / 2) {
                jx = (event.clientX - centerPosX);
                jy = (event.clientY - centerPosY);

            } else
            //否则计算摇杆最接近的位置
            {
                var x = event.clientX,
                    y = event.clientY,
                    r = josize / 2 - jisize / 2;

                var ans = GetPoint(centerPosX, centerPosY, r, centerPosX, centerPosY, x, y);
                //圆与直线有两个交点，计算出离手指最近的交点
                if (Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) < Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))) {
                    jx = (ans[0] - centerPosX);
                    jy = (ans[1] - centerPosY);
                }
                else {
                    jx = (ans[2] - centerPosX);
                    jy = (ans[3] - centerPosY);
                }

            }


            // jx = Math.clamp(jx,-axisScale,axisScale);
            // jy = Math.clamp(jy,-axisScale,axisScale);

            if (jx > axisScale) { jx = axisScale; }
            if (jx < -axisScale) { jx = -axisScale; }
            if (jy > axisScale) { jy = axisScale; }
            if (jy < -axisScale) { jy = -axisScale; }
            //console.log("jx 水平轴 = " + jx/axisScale);
            //console.log("jy 垂直轴 = " + jy/axisScale);


            this.axisX = jx / axisScale;
            this.axisY = jy / axisScale;

            // event.preventDefault();//防止页面滑动，取消掉默认的事件
        };

        this.onTouchStart = function (event) {
            event.preventDefault();
            event.stopPropagation();

            // console.log(" onTouchStart " );

            var eventID = event.target.id;
            if (eventID.indexOf(direction) > -1) {
                inJoystickArea = true;

                var touches = event.touches;
                if (touches.length > 1) {
                    effectiveFinger = 1;
                } else {
                    effectiveFinger = 0;
                }
            } else {

                return;
            }
            return;



        };

        // 230728
        this.Stop = function () {
            jx = 0;
            jy = 0;
            inJoystickArea = false;
            this.axisX = jx / axisScale;
            this.axisY = jy / axisScale;
        }
        this.onTouchEnd = function (event) {
            //return;

            // event.preventDefault();
            // event.stopPropagation();

            var eventID = event.target.id;
            if (eventID.indexOf(direction) > -1) {



                //若手指离开,那就把内摇杆放中间
                jx = 0;
                jy = 0;
                inJoystickArea = false;

                this.axisX = jx / axisScale;
                this.axisY = jy / axisScale;

                return;
            } else {

                var touches = event.touches;
                if (touches.length > 1) {
                    effectiveFinger = 1;
                } else {
                    effectiveFinger = 0;
                }

            }

            return;

        };

        let touchX, touchY;
        this.onTouchMove = function (event) {


            //手指移动的时候：
            if (!inJoystickArea) { return; }

            var touches = event.touches;
            var touch = event.touches[touches.length > 1 ? effectiveFinger : 0];
            // console.log('effectiveFinger', effectiveFinger);
            // console.log(touch);

            if (touch) {

                // console.log("  touch.clientX = " +touch.clientX + " touch.clientY = "+touch.clientY);
                touchX = touch.clientX;
                touchY = touch.clientY;

                if (direction == "left") {
                    if (forcedLandscape) {
                        if (touchY > window.innerHeight / 2) {
                            effectiveFinger = effectiveFinger == 1 ? 0 : 1;
                            return;
                        }
                    } else {
                        if (touchX > window.innerWidth / 2) {
                            effectiveFinger = effectiveFinger == 1 ? 0 : 1;
                            return;
                        }
                    }
                }

                //是否触摸点在摇杆上
                if (Math.sqrt(Math.pow(touchX - centerPosX, 2) +
                    Math.pow(touchY - centerPosY, 2)) <=
                    josize / 2 - jisize / 2) {
                    jx = (touchX - centerPosX);
                    jy = (touchY - centerPosY);
                    // console.log(" 触摸在摇杆上 ");

                    // console.log(" 摇杆 ", jx, jy);

                } else
                //否则计算摇杆最接近的位置
                {
                    // console.log(" 触摸在摇杆 外 " );
                    var x = touchX,
                        y = touchY,
                        r = josize / 2 - jisize / 2;

                    var ans = GetPoint(centerPosX, centerPosY, r, centerPosX, centerPosY, x, y);
                    //圆与直线有两个交点，计算出离手指最近的交点
                    if (Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) < Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))) {
                        jx = ans[0] - centerPosX;
                        jy = ans[1] - centerPosY;
                        // console.log(" 摇杆 22 ", jx, jy);
                    }
                    else {
                        if (isNaN(ans[2]) || isNaN(ans[3])) {

                        } else {
                            jx = ans[2] - centerPosX;
                            jy = ans[3] - centerPosY;
                        }
                        // console.log(" 摇杆 33 ", jx, jy);
                    }



                }

                // 强制横屏情况下
                if (forcedLandscape) {
                    let xx = jx;
                    jx = jy;
                    jy = -xx;
                }
                // console.log(" 是否处在强制横屏状态下 ", forcedLandscape?'是':'否' );


                this.axisX = jx / axisScale;
                this.axisY = jy / axisScale;
            }

            // event.preventDefault();//防止页面滑动，取消掉默认的事件
        };

        function move() {
            
            // console.log("摇杆头图片加载成功",jiPath);
            // console.log("摇杆头图片加载成功",joPath);
            jc.clearRect(centerX - josize / 2, centerY - josize / 2, josize, josize);//清空画板
            jc.drawImage(jo, centerX - josize / 2, centerY - josize / 2, josize, josize);//画底座
            jc.drawImage(ji, centerX - jisize / 2 + jx, centerY - jisize / 2 + jy, jisize, jisize);//画摇杆头
            //console.log(" axisX = " +leftJoystick.axisX );
            requestAnimationFrame(move); //下一次绘图
        }
        move();

        this.update = function (delta) {
            //开始绘图
            //绘图函数（绘制图形的时候就是用户观察到摇杆动了，所以取名是move）

            //if ( this.enabled === false ) return;
            jc.clearRect(centerX - josize / 2, centerY - josize / 2, josize, josize);//清空画板
            jc.drawImage(jo, centerX - josize / 2, centerY - josize / 2, josize, josize);//画底座
            jc.drawImage(ji, centerX - jisize / 2 + jx, centerY - jisize / 2 + jy, jisize, jisize);//画摇杆头
        };


        this.dispose = function () {

            this.domElement.removeEventListener('mousedown', _onMouseDown, false);
            this.domElement.removeEventListener('mousemove', _onMouseMove, false);
            this.domElement.removeEventListener('mouseup', _onMouseUp, false);

            this.domElement.removeEventListener('touchstart', _onTouchStart, false);
            this.domElement.removeEventListener('touchend', _onTouchEnd, false);
            this.domElement.removeEventListener('touchmove', _onTouchMove, false);


        };

        this.addEventListener = function () {

            this.domElement.addEventListener('mousemove', _onMouseMove, false);
            this.domElement.addEventListener('mousedown', _onMouseDown, false);
            this.domElement.addEventListener('mouseup', _onMouseUp, false);

            this.domElement.addEventListener('touchstart', _onTouchStart, false);
            this.domElement.addEventListener('touchend', _onTouchEnd, false);
            this.domElement.addEventListener('touchmove', _onTouchMove, false);

            this.domElement.addEventListener('contextmenu', contextmenu);

        };

        var _onMouseMove = bind(this, this.onMouseMove);
        var _onMouseDown = bind(this, this.onMouseDown);
        var _onMouseUp = bind(this, this.onMouseUp);

        var _onTouchStart = bind(this, this.onTouchStart);
        var _onTouchEnd = bind(this, this.onTouchEnd);
        var _onTouchMove = bind(this, this.onTouchMove);



        this.addEventListener();
        function bind(scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        }

    };
}
function contextmenu(event) {
    event.preventDefault();
}

export { Joystick };