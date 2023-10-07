
// 遥感
<template>
  <!-- 摇杆 -->
  <!-- <div class="absolute z-50 w-40 h-40 left-0  bottom-0 pointer-events-none" -->

    <div id="joystick_right_parent" class=" absolute w-12 h-12 right-20 bottom-14  pointer-events-none"
    >
    <!-- :class="display ? ' opacity-100 ' : ' opacity-0 '" -->

    <div class=" w-12 h-12 flex rounded-full pointer-events-none">
      <canvas class="
            self-center
            mx-auto
            rounded-full
            pointer-events-none
            stop-long-hover
          " ref="joystick" id="joystick_right" width="100" height="100"></canvas>
    </div>
  </div>


</template>

<script>

// 摇杆
import { Joystick } from "/@/js/Joystick.js";

var left_x;
var left_y;
export default {
  name: "joystickRight",
  components: {},
  data() {
    return {
      display: true,
      Joystick: null,
      //延迟取消摇杆的计时器
      laterHiddenJoystick: null,

    };
  },
  created() {
  },
  mounted() {
    this.CreateJoytick();
  },
  methods: {

    CreateJoytick() {

      left_x = document.getElementById("joystick_right_parent").offsetLeft;
      left_y = document.getElementById("joystick_right_parent").offsetTop;

      left_x += document.getElementById("joystick_right").offsetLeft;
      left_y += document.getElementById("joystick_right").offsetTop;

      // console.log(" 左摇杆坐标 ", left_x, left_y);

      this.Joystick = new Joystick(
        document.getElementById("joystick_right"),
        left_x,
        left_y,
        "right",
        document.getElementById("joystick_right"),
        this.$parent.GetPublicUrl() + "img/rightjostick.png",
        this.$parent.GetPublicUrl() + "img/rightjoystickArea.png"
      );

      // this.Joystick.Reload(left_x, left_y,false);
      // this.ResizeJoystick(true);
      return;
      this.UpdateJoystick();
    },

    SetforcedLandscape(forcedLandscape){
      this.Joystick.SetforcedLandscape(forcedLandscape); 
    },
    ResizeJoystick(){
      left_x = document.getElementById("joystick_right_parent").offsetLeft;
      left_y = document.getElementById("joystick_right_parent").offsetTop;

      left_x += document.getElementById("joystick_right").offsetLeft;
      left_y += document.getElementById("joystick_right").offsetTop;

      this.Joystick.Reload(left_x, left_y); 
    },


    UpdateJoystick() {
      requestAnimationFrame(this.UpdateJoystick);

      // this.$parent.JoystickAxisRight(
      //     this.Joystick.axisX,
      //     this.Joystick.axisY
      //   ); 
        // console.log(this.Joystick.axisX, this.Joystick.axisY);

      if (this.Joystick.axisX != 0 || this.Joystick.axisY != 0) {

        //显示隐藏摇杆
        this.display = true;

        if (this.laterHiddenJoystick != null) {
          clearTimeout(this.laterHiddenJoystick);
        }
        var that = this;
        this.laterHiddenJoystick = setTimeout(() => {
          that.display = false;
        }, 2000);
      }
    },

  },
};
</script>

  <style scoped>
  </style>
