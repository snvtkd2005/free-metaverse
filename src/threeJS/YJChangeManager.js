
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


// 单个模型辉光效果

class YJChangeManager {
  constructor(_YJSceneManager) {
  
    const revelyaParams = { 
      scene: 'scene1',
      skybox: 'afternoon',
      AmbientLightIntensity:1.0,
      DirectionalLightIntensity:1.0,
    };

    
    function Init() {

      const gui = new GUI(); 
      // gui.title = "test";
      // gui.class.addClass(' absolute top-20');
      // gui.domElement.classList.add(' absolute top-20 ');
      gui.domElement.style.cssText = " position:absolute;right:0px;top:90px;"; 

      gui.add(revelyaParams, 'scene', ['scene1', 'scene2']).onChange(function (value) {
        switch (value) {
          case 'scene1': 
            break; 
          case 'scene2': 
            break; 
        } 
        _YJSceneManager.SetScene(value);
      });
      gui.add(revelyaParams, 'skybox', ['afternoon', 'night']).onChange(function (value) {
        switch (value) {
          case 'afternoon': 
            break; 
          case 'night': 
            break; 
        } 
        
        _YJSceneManager.SetSkybox(value);
      });

      gui.add(revelyaParams, 'AmbientLightIntensity', 0.0, 2.0).onChange(function (value) {
        _YJSceneManager.SetAmbientIntensity(value);
      });
      gui.add(revelyaParams, 'DirectionalLightIntensity', 0.0, 2.0).onChange(function (value) {
        _YJSceneManager.SetDirectionalIntensity(value);
      });
      
    }
    Init();
 
  }
}


export { YJChangeManager };