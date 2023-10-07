<template>
  <div class="drawer-wrapper" v-if="visible">
    <div :class="animate ? 'drawer-content active' : 'drawer-content'">
      <slot></slot>
      <div class="close" @click="close()">
        <img src="/images/message/fold-icon.png" alt="">
        <!-- <img src="/newsMeta/images/message/fold.png" alt=""> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      animate: false,
    };
  },
  methods: {
    open() {
      this.showDetails = false;
      this.visible = true;
      setTimeout(() => {
        this.animate = true;
      },100);
    },
    close() {
      this.animate = false;
      setTimeout(() => {
        this.visible = false;
      }, 300);
    },
  },
};
</script>


<style scoped>
.drawer-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  margin: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.2);
}

.drawer-content {
  position: relative;
  height: 100%;
  background: #fff;
  float: right;
  right: -500px;
  transition: right 0.5s;
  -webkit-transition: right 0.5s;
  width: 500px;
  position: relative;
}

.drawer-content.active {
  right: 0px;
}

.close {
  position: absolute;
  bottom: 20px;
  width: 80px;
  height: 80px;
  background: #cb1f26;
  border-radius: 100%;
  color: #f2cb91;
  font-size: 16px;
  text-align: center;
  line-height: 80px;
  left: -40px;
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

@media all and (orientation : landscape) { 
  .drawer-content {
    right: -90%;
    width: 40%;
  }
  .drawer-content.active {
    right: 0px;
  }
  .close {
    width: 5rem;
    height: 5rem;
    left: -2.5rem;
  }
}
@media screen and (max-width: 992px) {
  .close{
    width: 3rem;
    height: 3rem;
    left: -1.5rem;
  }
  .close img {
    max-height: 62%;
  }
  .message-content .fixed-bottom{
    height: 92px;
  }
  .message-content .message-box{
    height: calc(100% - 152px);
  }
  .drawer-content{
    width: 40%;
  }
}
</style>