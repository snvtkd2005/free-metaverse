
// 遥感
<template>
  <!-- 摇杆 -->
  <!-- <div class="absolute z-50 w-40 h-40 left-0  bottom-0 pointer-events-none" -->
  <div id="joystick_right_parent" class=" absolute z-50 w-40 h-40 right-0 bottom-0  pointer-events-none"
    :class="display ? ' opacity-100 ' : ' opacity-0 '">
    <div class=" w-40 h-40 flex rounded-full">
      <canvas class="
            self-center
            mx-auto
            rounded-full
            pointer-events-auto
            stop-long-hover
          " ref="joystick" id="joystick_right" width="120" height="120"></canvas>
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



      // left_x = document.getElementById("joystick_left").offsetLeft;
      // left_y = document.getElementById("joystick_left").offsetTop;

      left_x = document.getElementById("joystick_right_parent").offsetLeft;
      left_y = document.getElementById("joystick_right_parent").offsetTop;

      left_x += document.getElementById("joystick_right").offsetLeft;
      left_y += document.getElementById("joystick_right").offsetTop;

      console.log(" 又摇杆坐标 ", left_x, left_y);
      this.Joystick = new Joystick(
        document.getElementById("joystick_right"),
        left_x,
        left_y,
        "right",
        document.getElementById("joystick_right"),
        this.$publicUrl + "images/joystick2/joystickin.png",
        this.$publicUrl + "images/joystick2/RadialJoy_Area.png"
      );

      this.Joystick.Reload(left_x, left_y);
      this.UpdateJoystick();
    },

    UpdateJoystick() {
      requestAnimationFrame(this.UpdateJoystick);
      
      this.$parent.$refs.ThreejsHumanChat.JoystickAxisRight(
          this.Joystick.axisX,
          this.Joystick.axisY
        );
      if (this.Joystick.axisX != 0 || this.Joystick.axisY != 0) {
        // console.log(this.Joystick.axisX, this.Joystick.axisY);

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
