



class YJKeyboard {
  constructor(keyCallback, keyUpCallback) {
    let scope = this;
    let inShiftLeft = false;
    let inControlLeft = false;
    let isKeyPressed = false;
    this.onKeyDown = function (e) {
      // console.log(e.code);

      switch (e.code) {
        case 'Tab':
          e.preventDefault();
          break;
        case 'ArrowUp':
          e.preventDefault();
          break;
        case 'ArrowDown':
          e.preventDefault();
          break;
      }

      if (isKeyPressed && !inShiftLeft && !inControlLeft) {
        return;
      }
      isKeyPressed = true;
      let keycode = e.code;

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
        case 'ShiftLeft':
          inShiftLeft = true;
          break;

        case 'ControlLeft':
          e.preventDefault(); // 阻止浏览器的默认保存行为  

          inControlLeft = true;
          _Global.YJ3D.YJController.SetCanMoving(false);
          break;

      }
      keyCallback(e);
      _Global.applyEvent("keycodeDown", keycode);

    };

    this.onKeyUp = function (e) {
      isKeyPressed = false;
      _Global.applyEvent("keycodeUp", e.code);
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

      _Global._YJKeyboard = scope;

      window.addEventListener('keydown', _onKeyDown);
      window.addEventListener('keyup', _onKeyUp);
    };

    const _onKeyDown = this.onKeyDown.bind(this);
    const _onKeyUp = this.onKeyUp.bind(this);

    this.addEventListener();
  }
}

export { YJKeyboard };