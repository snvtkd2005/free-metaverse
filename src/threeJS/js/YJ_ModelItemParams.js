/*
* 模型数据类
*
*
* */
//*


//function ModelItemParams(name,mesh,opacity,position,positionX,positionY,positionZ,display,transparent)  {
ModelItemParams =  function(name,mesh,opacity,position,positionX,positionY,positionZ,display,transparent)  {

    this.name = name;       //名字
    this.mesh = mesh;        //模型
    this.opacity = opacity;         //透明值
    this.position = position;     //坐标vector3
    this.positionX = positionX;     //坐标X
    this.positionY = positionY;     //坐标Y
    this.positionZ = positionZ;     //坐标Z
    this.display = display;       //是否显示
    this.transparent = transparent;   //是否透明

    //function SetVisible(b){
    //
    //}
    this.SetVisible = function(b) {
        display = b;
        mesh.visible = display;
        console.log(" 在ModelItemParams中设置 显示或隐藏 "   );
    };
};

Object.defineProperties( ModelItemParams.prototype, {

    _Visible: {
        get: function () {
            return this.display;
        }
    },
    Visible: {
        get: function () {
            //console.warn( 'in get  Visible ' );
            return this.display;
        },
        set: function ( value ) {
            //console.warn( ' in set  Visible ' );
            this.display = value;
            this.mesh.visible = this.display;
            //console.log(" 在ModelItemParams中设置 显示或隐藏 "   );
        }
    },
    _Transparent: {
        get: function () {
            return this.transparent;
        }
    },
    Transparent: {
        get: function () {
            //console.warn( 'in get  Transparent ' );
            return this.transparent;
        },
        set: function ( value ) {
            if(value){
                this.opacity = 0.2;

            }else{
                this.opacity = 1;
            }
            this.transparent = value;
            //材质球数量大于1，表示是多维材质
            if( this.mesh.material.length >1){
                for(var i=0;i<this.mesh.material.length;i++){
                    this.mesh.material[i].opacity = this.opacity;
                    this.mesh.material[i].transparent = this.transparent;
                }
            }else{
                this.mesh.material.opacity = this.opacity;
                this.mesh.material.transparent = this.transparent;
            }
            //console.warn( ' in set  Transparent ' );
        }
    },

    ToDefaultPosition : {
        get: function () {
            //console.warn( 'in get  Transparent ' );
            return this.positionX;
        },
        set: function ( value ) {
            this.mesh.position.set(this.positionX,this.positionY,this.positionZ);
        }
    }

});
