import * as THREE from "three";



class YJSceneModelCtrl {
  constructor(parent) {

    var meshNameData = [];// [];
    var meshTransData = [];

    var menuctrl = null;

    //撤销
    var stepList = [];
    //获取模型的初始化数据
    var paramList = [];
    //初始化场景中的模型数据
    this.InitSceneModelData = (pointsParent) => {

      if (stepList.length > 0) {
        stepList.splice(0, stepList.length);//清空数组，只保留第一个
      }

      for (var i = 0; i < pointsParent.children.length; i++) {
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
      stepList.push(CoyeParamLsit(paramList));

      // console.log(" 添加模型到数据中 的总数为 " + pointsParent.children.length);
      // console.log(" 添加模型到数据中 的总数为 stepList " + stepList.length);
      // console.log(" 添加模型到数据中 的总数为 paramList " + paramList.length);
    }
    this.pushStep = function(){
      stepList.push(CoyeParamLsit(paramList));
    }
    this.popStep = function(){
      stepList.pop();
    }
    
    //更新模型坐标数据
    this.updateObjPos = function(object,dragEndPos){
      
      for(var i = 0;i < paramList.length;i++){
        var params = paramList[i];
        if(object.name == params.mesh.name){

            params.positionX = dragEndPos.x;
            params.positionY = dragEndPos.y;
            params.positionZ = dragEndPos.z;
        }
      }
    }
    //获取模型的真实位置
    function GetObjectPos(object) {
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
    function GetObjectPos2(object) {
      var result = null;
      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          result = item.position;
        }
      });
      return result;
    }

    //排除隐藏的物体，计算所有模型的包裹盒，合成大包裹盒，返回大包裹盒的边界两个坐标
    this.GetBoundsBox = function () {

      var minX, maxX, minY, maxY, minZ, maxZ;
      minX = maxX = minY = maxY = minZ = maxZ = 0;

      var num = 0;
      for (var i = 0; i < paramList.length; i++) {

        var params = paramList[i];
        if (!params.display) {
          continue;
        }
        var geometry = params.mesh.geometry;
        geometry.computeBoundingBox();

        //包裹盒的中心
        var minPos= geometry.boundingBox.min ;
        var maxPos= geometry.boundingBox.max ;

        if (num == 0) {
          minX = maxX = minPos.x;
          minY = maxY = minPos.y;
          minZ = maxZ = minPos.z;
        }


        if (minPos.x <= minX) {
          minX = minPos.x;
        }
        if (maxPos.x >= maxX) {
          maxX = maxPos.x;
        }

        if (minPos.y <= minY) {
          minY = minPos.y;
        }
        if (maxPos.y >= maxY) {
          maxY = maxPos.y;
        }

        if (minPos.z <= minZ) {
          minZ = minPos.z;
        }
        if (maxPos.z >= maxZ) {
          maxZ = maxPos.z;
        }
        num++;
      } 

      var allmin = new THREE.Vector3(minX, minY, minZ);
      var allmax = new THREE.Vector3(maxX, maxY, maxZ);
      return { min: allmin, max: allmax };
    }

    //计算所有模型的坐标，计算出的中心坐标
    this.GetBoundsCenterPos = function () {

      var minX, maxX, minY, maxY, minZ, maxZ;
      minX = maxX = minY = maxY = minZ = maxZ = 0;

      var num = 0;
      for (var i = 0; i < paramList.length; i++) {

        var params = paramList[i];
        if (!params.display) {
          continue;
        }
        var geometry = params.mesh.geometry;
        geometry.computeBoundingBox();

        //包裹盒的中心 
        var minPos = GetModelWorldPosition(params.mesh);
        var maxPos = minPos;



        if (num == 0) {
          minX = maxX = minPos.x;
          minY = maxY = minPos.y;
          minZ = maxZ = minPos.z;
        }


        if (minPos.x <= minX) {
          minX = minPos.x;
        }
        if (maxPos.x >= maxX) {
          maxX = maxPos.x;
        }

        if (minPos.y <= minY) {
          minY = minPos.y;
        }
        if (maxPos.y >= maxY) {
          maxY = maxPos.y;
        }

        if (minPos.z <= minZ) {
          minZ = minPos.z;
        }
        if (maxPos.z >= maxZ) {
          maxZ = maxPos.z;
        }
        num++;
      }

      var centroid2 = new THREE.Vector3();

      centroid2.x = (maxX + minX) / 2;
      centroid2.y = (maxY + minY) / 2;
      centroid2.z = (maxZ + minZ) / 2;
      return centroid2;
    }


    //通过模型的包裹盒计算模型的世界坐标
    function GetModelWorldPosition(object) {
      var centroid = new THREE.Vector3();

      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {

          //获取模型的世界坐标
          var geometry = object.geometry;
          geometry.computeBoundingBox();
          centroid.addVectors(geometry.boundingBox.min, geometry.boundingBox.max);
          centroid.multiplyScalar(0.5);
          centroid.applyMatrix4(item.matrixWorld);
          // console.log(" ===== 双击模型 的位置    " + posToString(centroid) + "  ");
        }
      });
      return centroid;
    }
    //设置模型的真实位置
    function SetObjectPos(object, x, y, z) {

      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.position.set(x, y, z);
        }
      });
    }
    function SetObjectPos2(object, pos) {
      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.position.set(pos);
        }
      });
    }
    function SetObjectPos3(object, x, y, z) {
      object.position.set(x, y, z);
    }
    //获取模型的mesh
    function GetObjectMesh(object) {
      var result = null; //要使用返回值，必须用个中间变量 result
      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          //console.log(" 添加模型 mesh " + object.name +"  " + item.name  );
          result = item;
        }
      });

      return result;
    }

    var ModelItemParams = function (name, mesh, opacity, position, positionX, positionY, positionZ, display, transparent) {

      this.name = name;       //名字
      this.mesh = mesh;        //模型
      this.opacity = opacity;         //透明值
      this.position = position;     //坐标vector3
      this.positionX = positionX;     //坐标X
      this.positionY = positionY;     //坐标Y
      this.positionZ = positionZ;     //坐标Z
      this.display = display;       //是否显示
      this.transparent = transparent;   //是否透明
      this.canTrans = true;
      //function SetVisible(b){
      //
      //}
      this.SetVisible = function (b) {
        display = b;
        mesh.visible = display;
        console.log(" 在ModelItemParams中设置 显示或隐藏 ");
      };
    };

    Object.defineProperties(ModelItemParams.prototype, {

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
        set: function (value) {
          //console.warn( ' in set  Visible ' );
          this.display = value;
          this.mesh.visible = this.display;
          // this.mesh.material.visible = this.display;
          // this.mesh.collider.visible = this.display;
          // console.log(" 在ModelItemParams中设置 显示或隐藏 "   );
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
        set: function (value) {
          if (!this.canTrans) { return; }
          if (value) {
            this.opacity = 0.2;

          } else {
            this.opacity = 1;
          }
          this.transparent = value;
          //材质球数量大于1，表示是多维材质
          if (this.mesh.material.length > 1) {
            for (var i = 0; i < this.mesh.material.length; i++) {
              this.mesh.material[i].opacity = this.opacity;
              this.mesh.material[i].transparent = this.transparent;
            }
          } else {
            this.mesh.material.opacity = this.opacity;
            this.mesh.material.transparent = this.transparent;
          }
          //console.warn( ' in set  Transparent ' );
        }
      },

      ToDefaultPosition: {
        get: function () {
          //console.warn( 'in get  Transparent ' );
          return this.positionX;
        },
        set: function (value) {
          this.mesh.position.set(this.positionX, this.positionY, this.positionZ);
        }
      }

    });

    function GetObjectParam(object) {
      //name,mesh,opacity,position,positionX,positionY,positionZ,display,transparent

      var params = new ModelItemParams("", null, 1, new THREE.Vector3(0, 0, 0), 0, 0, 0, true, false);

      params.name = object.name;
      params.mesh = GetObjectMesh(object);
      params.position = GetObjectPos2(object);  //这个值永远会显示当前位置

      params.opacity = params.mesh.material.opacity;
      params.canTrans = params.mesh.material.opacity == 1; //有透明度的模型，不可再设置透明度
      params.positionX = params.position.x;  //这里永远是初始化位置
      params.positionY = params.position.y;
      params.positionZ = params.position.z;
      paramList.push(params);

      //console.log(params.mesh.name + " 坐标为 " +params.position.x +" " +params.position.y +" " +params.position.z );

    }

    //全部还原
    this.ResetAll = function () {
      // console.log(" 全部还原 ");
      // console.log(" stepList.length " + stepList.length);
      // console.log(" paramList.length " + paramList.length); 

      //还原为初始记录的
      for (var i = 0; i < stepList[0].length; i++) {

        var params = stepList[0][i];

        params.ToDefaultPosition = 0;
        params.Visible = params._Visible;
        parent.SetNoOrCanHit(params.mesh, params.Visible);
        params.Transparent = params._Transparent;

        console.log(" 全部还原 ing   ");
      }
      //paramList = stepList[0];
      paramList = CoyeParamLsit(stepList[0]);

      stepList.splice(1, stepList.length);//清空数组，只保留第一个

      //把模型状态保存下，传到父页面
      PostModelState();
    }

    var selectObj = null;

    this.setSelectObj = function (obj) {
      selectObj = obj;
    }
    //隐藏功能  隐藏选择 隐藏其他 全部取消隐藏
    this.HideFn = function (e) {


      stepList.push(CoyeParamLsit(paramList));
      //PringSetpList();

      switch (e) {
        case 1: //  隐藏选择
          console.log(" 隐藏选择   ");
          if (selectObj == null) return;
          console.log(" 隐藏选择 111  " + selectObj.name);
          for (var i = 0; i < paramList.length; i++) {
            var params = paramList[i];
            if (selectObj.name == params.mesh.name) {
              params.Visible = false;
              parent.SetNoOrCanHit(params.mesh,false);
              continue;
            }
          }
          break;
        case 2: //  隐藏其他 
          if (selectObj == null) return;

          for (var i = 0; i < paramList.length; i++) {

            var params = paramList[i];
            if (selectObj.name != params.mesh.name) {
              params.Visible = false; 
              parent.SetNoOrCanHit(params.mesh,false);
            }
          }
          break;
        case 3: // 全部取消隐藏

          for (var i = 0; i < paramList.length; i++) {

            var params = paramList[i];
            if(params.Visible==false){
              params.Visible = true; 
              parent.SetNoOrCanHit(params.mesh,true);
            }
          }
          break;
        default:
      }

      //把模型状态保存下，传到父页面
       PostModelState();
    }

    var canPost = false;
    //把模型状态保存下，传到父页面
    function PostModelState() {
      if (!canPost) { return; }
      var content = "";
      for (var i = 0; i < paramList.length; i++) {
        var params = paramList[i];
        // list.push({title:params.mesh.name,visible:params.Visible});
        // content += params.mesh.name + "1" + params.Visible + "0";
        content += params.mesh.name + "|" + params.Visible + "#";
      }
      //向父界面传出消息
      parent.UpdateMenu( content);

    }
    this.GetModelState = function () {
      var content = "";
      for (var i = 0; i < paramList.length; i++) {
        var params = paramList[i]; 
        content += params.mesh.name + "|" + params.Visible + "#";
      }
      return content; 
    }

    function HideByModelNameFnBefore() {
      stepList.push(CoyeParamLsit(paramList));
    }
    //隐藏指定名字的模型。 由菜单上的开关，控制显示隐藏模型
    this.HideByModelNameFn = function (e, visible) {
      //console.log( " in HideByModelNameFn "  + e);
      //return; 
      for (var i = 0; i < paramList.length; i++) {
        var params = paramList[i];
        if (e == (params.mesh.name) ) {
          params.Visible = visible;
          parent.SetNoOrCanHit(params.mesh,visible);
          return;
        }
        //console.log( " in HideByModelNameFn "  +i + paramList[i].mesh.name);
      }

    }

    //透明功能  透明选择 透明其他 全部取消透明
    this.TransparentFn = function (e) {
      //stepList.push(paramList);
      stepList.push(CoyeParamLsit(paramList));

      switch (e) {
        case 1: //  透明选择 
          if (selectObj == null) return;
          for (var i = 0; i < paramList.length; i++) {
            var params = paramList[i];
            if (selectObj.name == params.mesh.name) {
              params.Transparent = !params._Transparent;
            }
          }
          break;
        case 2: //  透明其他
          if (selectObj == null) return;
          for (var i = 0; i < paramList.length; i++) {
            var params = paramList[i];
            if (selectObj.name != params.mesh.name) {
              params.Transparent = true;
            }
          }
          break;
        case 3: // 全部取消透明 
          for (var i = 0; i < paramList.length; i++) {
            var params = paramList[i];
            params.Transparent = false;
          }
          break;
        default:
      }
    }


    this.Prev = function () {
      if (stepList.length === "unfind" || stepList.length < 2) {
        this.ResetAll();
        return;
      }
      //控制树形菜单
      if (menuctrl == null) {
        // menuctrl = document.getElementById("MenuCtrl").contentWindow;
      }
      //还原为最后记录的
      for (var i = 0; i < stepList[stepList.length - 1].length; i++) {

        var params = stepList[stepList.length - 1][i];

        params.ToDefaultPosition = 0;
        params.Visible = params._Visible;
        parent.SetNoOrCanHit(params.mesh, params.Visible);
        params.Transparent = params._Transparent;

        //控制树形菜单
        if (menuctrl != null) {
          if (params._Visible) {
            menuctrl.AddToCustomArray(params.name);
          }
        }
        //console.log(" 全部撤销 ing   "  );
      }
      //paramList =  stepList[stepList.length-2];
      paramList = CoyeParamLsit(stepList[stepList.length - 2]);

      //stepList.splice(stepList.length-1,1);//删除数组最后一个元素
      stepList.pop();//删除数组最后一个元素
      console.log(" 还剩返回长度为  " + stepList.length);

      //控制树形菜单
      if (menuctrl != null) {
        menuctrl.setCheckedNodesCustomArray();
      }

      //把模型状态保存下，传到父页面
      PostModelState();
    }

    //打印查看数组
    function PringSetpList() {

      for (var j = 0; j < stepList.length; j++) {
        var paramList = stepList[j];
        //还原为最后记录的
        for (var i = 0; i < paramList.length; i++) {

          var params = paramList[i];

          params.ToDefaultPosition = 0; 
          params.Visible = params._Visible;
          parent.SetNoOrCanHit(params.mesh, params.Visible);
          params.Transparent = params._Transparent;

          console.log(j + " 打印 PringSetpList   " + params.mesh.name + "    " + params._Visible + "  " + params._Transparent);
        }


      }

    }
    //收藏功能
    //数组为引用类型。直接复制修改，原来的数组也会修改。所以要创建新的数组并复制，再添加
    function CoyeParamLsit(paramList) {
      var res = [];
      for (var i = 0; i < paramList.length; i++) {
        var oldParams = paramList[i];
        //name,mesh,opacity,position,positionX,positionY,positionZ,display,transparent
        var params = new ModelItemParams("", null, 1, new THREE.Vector3(0, 0, 0), 0, 0, 0, true, false);
        params.name = oldParams.name;
        params.mesh = oldParams.mesh;
        params.position = oldParams.position;  //这个值永远会显示当前位置

        params.positionX = oldParams.positionX;  //这里永远是初始化位置
        params.positionY = oldParams.positionY;
        params.positionZ = oldParams.positionZ;
        params.opacity = oldParams.opacity;
        params.canTrans = oldParams.canTrans;
        params.display = oldParams.display;
        params.transparent = oldParams.transparent;

        res.push(params);
      }
      return res;
    }

    ///通过模型名称选择模型
    function SelectModelByName(objName) {
      var selectObj = null;
      //查找模型
      for (var i = 0; i < paramList.length; i++) {
        var params = paramList[i];
        if (params.mesh.name == objName) {
          selectObj = params.mesh;
        }
        //console.log( " in HideByModelNameFn "  +i + paramList[i].mesh.name);
      }
      //高亮模型
      if (selectObj == null) { return; }
      SelectObjFromMesh(selectObj);

      //视角居中到模型
      DoubleClickModel(selectObj);

    }

    this.dispose = function () {


    };

  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJSceneModelCtrl };