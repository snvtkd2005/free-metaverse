



class YJKeyboard {
  constructor(keyCallback,keyUpCallback) {

    let inShiftLeft = false;
    this.onKeyDown = function (event) {
      // console.log(event.code);
      switch (event.code) {
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

        case 'KeyZ':
          if (inShiftLeft) {
            keyCallback("ShiftLeft+Z");
          }
          return;
          break;

        case 'ShiftLeft':
          inShiftLeft = true;
          break;

      }
      keyCallback(event.code);

    };

    this.onKeyUp = function (event) {

      switch (event.code) {
        case 'ShiftLeft':
          inShiftLeft = false;
          break;
      }
      if(keyUpCallback){
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