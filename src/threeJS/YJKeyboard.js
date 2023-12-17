



class YJKeyboard {
  constructor(keyCallback, keyUpCallback) {

    let inShiftLeft = false;
    let inControlLeft = false;
    this.onKeyDown = function (e) {
      // console.log(event.code);
      switch (e.code) {
        case 'KeyT':
          if (inShiftLeft) {
            keyCallback("ShiftLeft+T");
            return;
          }
          break;
        case 'KeyC':
          if (inShiftLeft) {
            keyCallback("ShiftLeft+C");
            return;
          }
          break;

        case 'KeyD':
          if (inControlLeft) {
            e.preventDefault();
            keyCallback("ControlLeft+D");
          }
          return;
        case 'KeyZ':
          if (inShiftLeft) {
            keyCallback("ShiftLeft+Z");
          }
          return;

          break;

        case 'Tab':
          e.preventDefault();
          keyCallback(e.code);
          return;
          break;
        case 'ShiftLeft':
          inShiftLeft = true;
          break;

        case 'ControlLeft':
          inControlLeft = true;
          break;

      }
      keyCallback(e.code);

    };

    this.onKeyUp = function (event) {

      switch (event.code) {
        case 'ShiftLeft':
          inShiftLeft = false;
          break;
        case 'ControlLeft':
          inControlLeft = false;
          break;
      }
      if (keyUpCallback) {
        keyUpCallback(event.code);
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