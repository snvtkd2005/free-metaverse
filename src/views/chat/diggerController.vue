

// 挖掘机 控制界面

<template>
  <div class="w-full h-full relative flex pointer-events-none">
    <!-- body左右旋转 -->
    <div
      class="
        absolute
        bottom-10
        right-5
        w-auto
        h-16
        mx-auto
        flex
        justify-between
        gap-2
      "
    >
      <div
        class="
          w-16
          h-full
          relative
          z-10
          flex
          self-center
          pointer-events-auto
          cursor-pointer
        "
        @mousedown="ChangeMMDAnim('body', true, -0.01)"
        @mouseup="ChangeMMDAnim('body', false)"
        @touchstart="ChangeMMDAnim('body', true, -0.01)"
        @touchend="ChangeMMDAnim('body', false)"
      >
        <div
          class="
            w-full
            h-full
            absolute
            left-0
            top-0
            -z-10
            rounded-full
            bg-gray-400
            opacity-100
          "
        ></div>
        <p class="self-center mx-auto text-white">左</p>
      </div>

      <div class="self-center text-white">旋转</div>

      <div
        class="
          w-16
          h-full
          relative
          z-10
          flex
          self-center
          pointer-events-auto
          cursor-pointer
        "
        @mousedown="ChangeMMDAnim('body', true, 0.01)"
        @mouseup="ChangeMMDAnim('body', false)"
        @touchstart="ChangeMMDAnim('body', true, 0.01)"
        @touchend="ChangeMMDAnim('body', false)"
      >
        <div
          class="
            w-full
            h-full
            absolute
            left-0
            top-0
            -z-10
            rounded-full
            bg-gray-400
            opacity-100
          "
        ></div>
        <p class="self-center mx-auto text-white">右</p>
      </div>
    </div>

    <!-- 大臂前后旋转 -->
    <div
      class="
        absolute
        bottom-32
        right-5
        w-auto
        h-16
        mx-auto
        flex
        justify-between
        gap-2
      "
    >
      <div
        class="
          w-16
          h-full
          relative
          z-10
          flex
          self-center
          pointer-events-auto
          cursor-pointer
        "
        @mousedown="ChangeMMDAnim('bigArm', true, 0.01)"
        @mouseup="ChangeMMDAnim('bigArm', false)"
        @touchstart="ChangeMMDAnim('bigArm', true, 0.01)"
        @touchend="ChangeMMDAnim('bigArm', false)"
      >
        <div
          class="
            w-full
            h-full
            absolute
            left-0
            top-0
            -z-10
            rounded-full
            bg-gray-400
            opacity-100
          "
        ></div>
        <p class="self-center mx-auto text-white">前</p>
      </div>

      <div class="self-center text-white">大臂</div>

      <div
        class="
          w-16
          h-full
          relative
          z-10
          flex
          self-center
          pointer-events-auto
          cursor-pointer
        "
        @mousedown="ChangeMMDAnim('bigArm', true, -0.01)"
        @mouseup="ChangeMMDAnim('bigArm', false)"
        @touchstart="ChangeMMDAnim('bigArm', true, -0.01)"
        @touchend="ChangeMMDAnim('bigArm', false)"
      >
        <div
          class="
            w-full
            h-full
            absolute
            left-0
            top-0
            -z-10
            rounded-full
            bg-gray-400
            opacity-100
          "
        ></div>
        <p class="self-center mx-auto text-white">后</p>
      </div>
    </div>

    <!-- 前臂前后旋转 -->
    <div
      class="
        absolute
        bottom-52
        right-5
        w-auto
        h-16
        mx-auto
        flex
        justify-between
        gap-2
      "
    >
      <div
        class="
          w-16
          h-full
          relative
          z-10
          flex
          self-center
          pointer-events-auto
          cursor-pointer
        "
        @mousedown="ChangeMMDAnim('frontArm', true, 0.01)"
        @mouseup="ChangeMMDAnim('frontArm', false)"
        @touchstart="ChangeMMDAnim('frontArm', true, 0.01)"
        @touchend="ChangeMMDAnim('frontArm', false)"
      >
        <div
          class="
            w-full
            h-full
            absolute
            left-0
            top-0
            -z-10
            rounded-full
            bg-gray-400
            opacity-100
          "
        ></div>
        <p class="self-center mx-auto text-white">前</p>
      </div>

      <div class="self-center text-white">前臂</div>

      <div
        class="
          w-16
          h-full
          relative
          z-10
          flex
          self-center
          pointer-events-auto
          cursor-pointer
        "
        @mousedown="ChangeMMDAnim('frontArm', true, -0.01)"
        @mouseup="ChangeMMDAnim('frontArm', false)"
        @touchstart="ChangeMMDAnim('frontArm', true, -0.01)"
        @touchend="ChangeMMDAnim('frontArm', false)"
      >
        <div
          class="
            w-full
            h-full
            absolute
            left-0
            top-0
            -z-10
            rounded-full
            bg-gray-400
            opacity-100
          "
        ></div>
        <p class="self-center mx-auto text-white">后</p>
      </div>
    </div>

    <!-- 铲斗前后旋转 -->
    <div
      class="
        absolute
        bottom-72
        right-5
        w-auto
        h-16
        mx-auto
        flex
        justify-between
        gap-2
      "
    >
      <div
        class="
          w-16
          h-full
          relative
          z-10
          flex
          self-center
          pointer-events-auto
          cursor-pointer
        "
        @mousedown="ChangeMMDAnim('bucket', true, -0.01)"
        @mouseup="ChangeMMDAnim('bucket', false)"
        @touchstart="ChangeMMDAnim('bucket', true, -0.01)"
        @touchend="ChangeMMDAnim('bucket', false)"
      >
        <div
          class="
            w-full
            h-full
            absolute
            left-0
            top-0
            -z-10
            rounded-full
            bg-gray-400
            opacity-100
          "
        ></div>
        <p class="self-center mx-auto text-white">前</p>
      </div>

      <div class="self-center text-white">铲斗</div>

      <div
        class="
          w-16
          h-full
          relative
          z-10
          flex
          self-center
          pointer-events-auto
          cursor-pointer
        "
        @mousedown="ChangeMMDAnim('bucket', true, 0.01)"
        @mouseup="ChangeMMDAnim('bucket', false)"
        @touchstart="ChangeMMDAnim('bucket', true, 0.01)"
        @touchend="ChangeMMDAnim('bucket', false)"
      >
        <div
          class="
            w-full
            h-full
            absolute
            left-0
            top-0
            -z-10
            rounded-full
            bg-gray-400
            opacity-100
          "
        ></div>
        <p class="self-center mx-auto text-white">后</p>
      </div>
    </div>
  </div>
  <div
    class="
      absolute
      bottom-10
      right-60
      w-20
      h-20
      z-30
      text-white
      rounded-full
      bg-gray-400
      flex
    "
    @click="Out()"
  >
    <div class="self-center mx-auto">离开载具</div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      digger: null,
      body: false,
      bodyRota: 0.1,

      bigArm: false,
      bigArmRota: 0.1,

      frontArm: false,
      frontArmRota: 0.1,

      bucket: false,
      bucketRota: 0.1,
    };
  },

  mounted() {
    this.update();
  },
  methods: {
    Out(){
      this.$parent.OutDigger();
    },
    SetDigger(digger) {
      this.digger = digger;
    },
    ChangeMMDAnim(nodeName, isOpen, rota) {
      if (nodeName == "body") {
        this.body = isOpen;
        this.bodyRota = rota;
      }
      if (nodeName == "bigArm") {
        this.bigArm = isOpen;
        this.bigArmRota = rota;
      }
      if (nodeName == "frontArm") {
        this.frontArm = isOpen;
        this.frontArmRota = rota;
      }
      if (nodeName == "bucket") {
        this.bucket = isOpen;
        this.bucketRota = rota;
      }
    },
    UpdateNode(nodeName, rota) {
      this.digger.SendState(nodeName, rota);
    },

    update() {
      requestAnimationFrame(this.update);
      if (this.body) {
        this.UpdateNode("body", this.bodyRota);
      }
      if (this.bigArm) {
        this.UpdateNode("bigArm", this.bigArmRota);
      }
      if (this.frontArm) {
        this.UpdateNode("frontArm", this.frontArmRota);
      }
      if (this.bucket) {
        this.UpdateNode("bucket", this.bucketRota);
      }
    },
  },
};
</script>

<style>
</style>
