
<template>
  <!-- 游戏或角色状态提示 -->
  <div
    v-if="true"
    class="absolute w-full  flex left-0 top-20 pointer-events-none"
  >
    <div class="w-auto mx-auto origin-bottom">
      <div
        v-for="(item, i) in textList"
        :key="i"
        :index="item.id"
        class="text-xl flex-col-reverse"
        :style="'opacity:' + item.opacity + ';'"
      >
        <div class="w-auto h-6 flex text-red-500">
          <div class="self-center mx-auto text-2xl">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="fireState.inDead"
    class="absolute w-full h-full flex left-0 top-0 pointer-events-none"
  >
    <div v-if="lifeCount > 0 " class=" self-center mx-auto text-white text-6xl">
      <div>投币倒计时</div>
      <div class="text-9xl">
        {{ lifeCount }}
      </div> 
    </div>
    <div v-if="lifeCount == 0 " class=" self-center mx-auto text-white text-xl md:text-6xl">
      <div class=" pointer-events-auto cursor-pointer p-3  md:p-10 rounded-md bg-black bg-opacity-60"
      @click="resoul()"
      >重新开始</div>

    </div>

  </div>
</template>

<script>
// 战斗状态页面

export default {
  name: "fireStateUI",
  components: {},
  data() {
    return {
      display: false,

      fireState: {
        inDead: false,
      },
      textList: [
        // {
        //   type: '提示', //
        //   value: "太远了",
        //   pos: { x: 464, y: 50 },
        //   opacity: 1,
        //   time: 0,
        // },
      ],
      speed: 0.03,
      last: 0,
      deltaTime: 0,
      relifeTime:20,
      lifeCount: 20,
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      _Global.addEventListener("主角死亡", () => {
        this.SetState("inDead",true);
        this.lifeCount = this.relifeTime;
      });
      _Global.addEventListener("主角重生", () => {
        this.SetState("inDead",false); 
      });
      _Global.addEventListener("投币成功", () => {
        this.relife();
      });
      _Global.addEventListener("提示", (type,value) => {
        this.Add(type,value);
      });
    }, 5000);
    this.animate();

  },
  methods: {
    relife(){
      _Global.applyEvent("主角重生");
    },
    resoul(){
      this.SetState("inDead",false); 
      _Global.applyEvent("释放灵魂");
    },
    
    Add(type, value) {
      this.textList.push({
        type: type,
        value: value,
        pos: { x: 464, y: 50 },
        opacity: 1,
        time: 0,
      });
      // console.log(" ", this.textList[this.textList.length - 1]);
    },
    SetState(e, v) {
      this.last = performance.now();
      this.deltaTime = 0;
      this.fireState[e] = v;
    },
    animate() {
      requestAnimationFrame(this.animate);
      for (let i = this.textList.length - 1; i >= 0; i--) {
        const item = this.textList[i];
        item.time += this.speed;
        if (item.time >= 2.7) {
          item.opacity -= this.speed;
        }
        if (item.time >= 3) {
          this.textList.splice(i, 1);
        }
      }
      if (this.fireState.inDead && this.lifeCount > 0) {
        const now = performance.now();
        let delta = (now - this.last) / 1000;
        this.deltaTime += delta * 1;
        if (this.deltaTime >= this.relifeTime) {
          this.deltaTime = 0;
        }
        this.lifeCount = parseInt(this.relifeTime - this.deltaTime);
        this.last = now;
      }
    },
  },
};
</script>
 
<style scoped></style>