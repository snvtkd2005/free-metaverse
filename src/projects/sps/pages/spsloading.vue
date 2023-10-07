<template>
  <div v-if="diplayerLoading" class="absolute left-0 top-0 w-full h-full bg-white">
    <div class="content flex items-center">
      <div class="iconBox">
        <img :src="publicUrl + 'images/dialog/loading.png'" alt="" />
      </div>
      <div class="progressBox flex items-center">
        <div class="round left_bc"></div>
        <div class="g_container">
          <div class="g_progress" :style="`--progress: ${loadingProcessValue}`"></div>
        </div>
        <div class="round right_bc"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loadingpanel",

  data() {
    return {
      progress: "90%",
      canEnter: false,
      diplayerLoading: true,

      loadingCircleBar: null,
      loadingProcessValue: 0,

      // 是否正在加载摆放的模型 或 切换角色皮肤
      loading: false,
      // 提示文字内容
      tipContent: "loading...",

      tipLater: null,
      publicUrl:"./public/sps/"
    };
  },

  mounted() {
    if (!this.diplayerLoading) {
      return;
    }
    // this.loadingCircleBar = new circlebar(this.$refs.circlebar);
    // this.loadingCircleBar.SetColor("#2091AA");
  },
  methods: {
    LoadingState(state) {
      if (!this.diplayerLoading) {
        return;
      }

      if (state == "success") {
        this.loading = false;
      }
      if (state == "begin") {
        this.tipContent = "loading...";
        this.loading = true;
      }
    },

    LoadState(state) {
      if (!this.diplayerLoading) {
        return;
      }
      if (state == "success") {
        this.canEnter = true;
        this.diplayerLoading = false;
      }
      if (state == "begin") {
        this.diplayerLoading = true;
      }
    },
    LoadingProcess(process) {
      if (!this.diplayerLoading) {
        return;
      }
      this.loadingProcessValue = process + "%";
      if (process == 100) {
        // this.diplayerLoading = false;
        setTimeout(() => {
          this.OpenThreejs();
        }, 1500);
      }
      // console.log( this.loadingProcessValue);
      // this.loadingCircleBar.UpdateCircle(process);
    },
    OpenThreejs() {
      this.$parent.OpenThreejs();
      setTimeout(() => {
        this.diplayerLoading = false;
      }, 500);
    },
  },
};
</script>

<style scoped>
.dialog {
  width: 480px;
  height: 480px;
  position: absolute;
  top: 20%;
  left: 15%;
}

@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

.content {
  flex-direction: column;
  position: absolute;
  top: 35%;
  left: 40%;
}

.iconBox {
  width: 320px;
  height: 100px;
  margin-bottom: 20px;
}

.iconBox img {
  width: 100%;
  height: 100%;
}

.round {
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

.left_bc {
  background-color: rgb(0, 21, 107);
}

.right_bc {
  background-color: rgb(135, 216, 206);
}

.g_container {
  width: 380px;
  height: 10px;
  border-radius: 15px;
  background: #eee;
  margin: 0 10px 0 10px;
}

.g_progress {
  width: 100%;
  height: inherit;
  border-radius: 15px 0 0 15px;
  background: linear-gradient(90deg,
      rgb(0, 33, 138),
      rgb(135, 216, 206) var(--progress),
      transparent 0);


}

@media screen and (max-width: 767px) {
  .content {
    position: absolute;
    left: 15%;
    top: 30%;
  }
}
</style>
