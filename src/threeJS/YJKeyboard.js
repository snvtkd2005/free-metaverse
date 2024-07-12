



class YJKeyboard {
  constructor(keyCallback, keyUpCallback) {

    let inShiftLeft = false;
    let inControlLeft = false;
    let isKeyPressed = false;
    this.onKeyDown = function (e) {
      if(isKeyPressed){
        return;
      }
      isKeyPressed = true;
      let keycode = e.code;
      console.log(keycode);
      switch (e.code) {
        case 'KeyT':
          if (inShiftLeft) { 
            keycode = ("ShiftLeft+T");  
          }
          break;
        case 'KeyC':
          if (inShiftLeft) {
            keycode = ("ShiftLeft+C"); 
          }
          break;

        case 'KeyD':
          if (inControlLeft) {
            e.preventDefault();
            keycode = ("ControlLeft+D");
          } 
        case 'KeyZ':
          if (inShiftLeft) {
            keycode = ("ShiftLeft+Z");
          }  
          break;

        case 'Tab':
          e.preventDefault(); 
          break;
        case 'ShiftLeft':
          inShiftLeft = true;
          break;

        case 'ControlLeft':
          inControlLeft = true;
          _Global.YJ3D.YJController.SetCanMoving(false);
          break;

      }
      keyCallback(e);
      _Global.applyEvent("keycodeDown",keycode);

    };

    this.onKeyUp = function (e) {
      isKeyPressed = false;
      _Global.applyEvent("keycodeUp",e.code);
      switch (e.code) {
        case 'ShiftLeft':
          inShiftLeft = false;
          break;
        case 'ControlLeft':
          inControlLeft = false;
          _Global.YJ3D.YJController.SetCanMoving(true);
          break;
      }
      if (keyUpCallback) {
        keyUpCallback(e);
      }
    };

    var addEventListenered = false;

    this.dispose = function () {

      if (!addEventListenered) { return; }
      addEventListenered = false;

      console.log("移除操作响应");
      window.removeEventListener('keydown', _onKeyDown);
      window.removeEventListener('keyup', _onKeyUp);

    };
    this.addEventListener = function () {
      if (addEventListenered) { return; }
      addEventListenered = true;


      window.addEventListener('keydown', _onKeyDown);
      window.addEventListener('keyup', _onKeyUp);
    };

    const _onKeyDown = this.onKeyDown.bind(this);
    const _onKeyUp = this.onKeyUp.bind(this);

    this.addEventListener();
  }
}

export { YJKeyboard };