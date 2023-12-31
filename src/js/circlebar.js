

class circlebar {
    constructor(canvas) {
        let context;
        let centerX;
        let centerY;
        let rad;
        let speed;
        let color = "blue";
        function init() {
            context = canvas.getContext('2d'),  //获取画图环境，指明为2d
                centerX = canvas.width / 2,   //Canvas中心点x轴坐标
                centerY = canvas.height / 2,  //Canvas中心点y轴坐标
                rad = Math.PI * 2 / 100, //将360度分成100份，那么每一份就是rad度
                speed = 0.1; //加载的快慢就靠它了 
        }
        this.SetColor = function(c){
            color = c;
        }
        //绘制5像素宽的运动外圈
        function blueCircle(n) {
            context.save();
            context.strokeStyle = "#fff"; //设置描边样式
            context.lineWidth = 8; //设置线宽
            context.beginPath(); //路径开始
            context.arc(centerX, centerY, 100, -Math.PI / 2, -Math.PI / 2 + n * rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
            context.stroke(); //绘制
            context.closePath(); //路径结束
            context.restore();
        }

        //绘制白色外圈
        function whiteCircle() {
            context.save();
            context.beginPath();
            context.lineWidth = 5; //设置线宽
            context.strokeStyle = color;
            context.arc(centerX, centerY, 100, 0, Math.PI * 2, false);
            context.stroke();
            context.closePath();
            context.restore();
        }

        //百分比文字绘制
        function text(n) {
            context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
            context.strokeStyle = "#fff"; //设置描边样式
            context.font = "40px Arial"; //设置字体大小和字体
            //绘制字体，并且指定位置
            context.strokeText(n.toFixed(0) + "%", centerX - 25, centerY + 10);
            context.stroke(); //执行绘制
            context.restore();
        }
        init();
        let updateId = null;
        update();
        function update() {
            updateId = requestAnimationFrame(update);
            context.clearRect(0, 0, canvas.width, canvas.height);
            whiteCircle();
            // text(speed);
            blueCircle(speed);
            // if (speed > 100) speed = 0;
            // speed += 0.1;
            // console.error(" 更新加载loading 圆");
        }
        this.UpdateCircle = function(_speed){
            speed = _speed;
        }
        
        this.Stop = function(){
            cancelAnimationFrame(updateId);
        }
    }
}
function contextmenu(event) {
    event.preventDefault();
}

export { circlebar };