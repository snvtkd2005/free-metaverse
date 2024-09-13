



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import { YJMapManager } from "/@/threeJS/YJMapManager.js";
import { RequestMetaWorld } from "./uploadThreejs.js";

class SceneManagerMetaworld {
  constructor(scene, renderer, camera, _this, modelParent, indexVue, callback) {
    let scope = this;
    let _YJMapManager = null;

    this.Init = function () {
      InitFn();
    }
    function InitFn() {
      _YJGlobal._SceneManagerMetaworld = scope;

      if (callback) {
        callback();
      }
      _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(scope);

      _YJMapManager = new YJMapManager(_this, modelParent, _this.YJController.GetPlayer(), scope);
      _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJMapManager);
      console.log("初始化九宫格 ========");
    }

    let mapToScene = [
      // { id: "10000-10000-9998", folderBase: "1691113201129" },
      // { id: "10000-10000-10000", folderBase: "1691284139097" },
    ];
    function GetFolderBaseByMapid(id, callback) {

      for (let i = 0; i < mapToScene.length; i++) {
        const element = mapToScene[i];
        if (element.id == id) {
          if (callback) {
            callback(element);
          }
          return;
        }
      }
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("mapId", id);
      fromData.append("folderBase", "");
      let msg = {
        type: "查找",
      }
      //保存到后台
      let s = JSON.stringify(msg);
      fromData.append("msg", s);
      RequestMetaWorld(fromData).then((res) => {
        // console.log(res);
        //先记录旧照片
        if (res.data.data.length > 0) {

          let mapData = res.data.data[0];
          mapToScene.push(mapData);
          if (callback) {
            callback(mapData);
          }
        } else {
          if (callback) {
            callback(null);
          }
        }
      });
    }


    this.CallGetFolderBaseByMapid = (id, callback) => {
      GetFolderBaseByMapid(id, callback);
    }

    let addMapList = [];
    let inLoadingMap = false;
    this.LoadMapCompleted = () => {
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AllNpcTransformNav();

      addMapList.splice(0, 1);
      if (addMapList.length > 0) {
        GetFolderBaseByMapid(addMapList[0], LoadSceneModelListByFolderBase);
        return;
      }
      inLoadingMap = false;
      _Global._SceneManager.LoadMapCompleted();

      //九宫格地图加载完成 
      indexVue.LoadMapCompleted();
    }
    this.AddAmmoPlane = function (id) {
      addMapList.push(id);
      if (inLoadingMap) {
        return;
      }
      inLoadingMap = true;
      GetFolderBaseByMapid(id, LoadSceneModelListByFolderBase);
    }

    // 获取folderBase场景中的模型
    function LoadSceneModelListByFolderBase(mapData) {
      if (mapData == null) {
        scope.LoadMapCompleted();
        return;
      }

      let path = _this.$uploadSceneUrl + mapData.folderBase + "/" + "scene.txt" + "?time=" + new Date().getTime()
      _Global.YJ3D._YJSceneManager.LoadAssset(path, (data) => {
        let modelList = [];
        console.log(" 获取地图中模型数据 ", mapData, data);
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          modelList.push(element);
        }
        // _Global.YJ3D._YJSceneManager.CreateSceneByMapid(mapData.id, modelList);
        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AddLoadMetaWorldSceneModel(mapData.id, modelList);
      });
    }

    // _YJLoadUserModelManager.AddLoadMetaWorldSceneModel(id, data);
    // _YJLoadUserModelManager.RemoveMetaWorldSceneModel(id);

    // 获取folderBase场景中的场景配置，从中提取起始坐标和旋转
    this.CallLoadSceneDataByFolderBase = (folderBase, callback) => {
      let path = _this.$uploadSceneUrl + folderBase + "/" + "setting.txt" + "?time=" + new Date().getTime()
      _Global.YJ3D._YJSceneManager.LoadAssset(path, (data) => {
        console.log("获取场景配置", data);
        if (callback) {
          callback(data.setting.playerPos, data.setting.playerRotaV3);
        }
      });
    }

    this.RemoveAmmoPlane = function (id) {
      _Global.GetYJPathfindingCtrl().RemoveNavMeshByMapId(id);
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().RemoveMetaWorldSceneModel(id);

      // _Global.YJ3D._YJSceneManager.RmoveSceneByMapid(id);
    }

    this.ChangeScene = function (e) {
      return;
    }
    this._update = function () {
      TWEEN.update();
    }


    InitFn();
  }
}

export { SceneManagerMetaworld };