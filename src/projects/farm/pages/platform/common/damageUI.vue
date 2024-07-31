
<template>
  <!-- 屏幕伤害显示 -->
  <div v-if="true" class="absolute left-0 top-0 flex pointer-events-none">
    <div
      v-for="(item, i) in damageList"
      :key="i"
      :index="item.id"
      class="text-xl flex"
      :style="
        ' position:absolute; left:' +
        (item.pos.x - 64) +
        'px;top:' +
        (item.pos.y - 28) +
        'px;' +
        'opacity:' +
        item.opacity +
        ';' +
        'transform:scale(' +
        item.scale +
        ');'
      "
    >
      <div
        class="w-32 h-14 flex"
        :class="
         item.addredius == 'redius' ? (item.isSelf ? ' text-red-400': ' text-yellow-400 ') : ' text-green-400 '
        "
      >
        <div class="self-center mx-auto text-4xl">
          {{ item.addredius == "redius" ? "-" : "+" }} {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "damageUI",
  components: {},
  data() {
    return {
      display: false,
      damageList: [
        // {
        //   owner: '', //目标id
        //   type: '普通', //普通、暴击
        //   value: 100,
        //   pos: { x: 464, y: 245 },
        //   opacity:1,
        //   time:0,
        // },
      ],
      speed: 0.03,
    };
  },
  created() {},
  mounted() {
    this.animate();
    setTimeout(() => {
      _Global.addEventListener("伤害跳字", (msg) => {
        this.AddDamage(msg);
      });
    }, 5000);
  },
  methods: {
    UpdatePos2d() {
      // console.log(" in UpdatePos2d ");
      for (let i = this.damageList.length - 1; i >= 0; i--) {
        const e = this.damageList[i];
        let _pos = _Global.YJ3D._YJSceneManager.WorldPosToScreenPos(
          e.pos3d.clone()
        );
        e.pos = _pos;
      }
    },
    AddDamage(msg) {
      let { owner,isSelf, type, value, pos3d, pos, addredius } = msg;
      for (let i = this.damageList.length - 1; i >= 0; i--) {
        const e = this.damageList[i];
        if (e.owner == owner && e.type == type) {
          this.damageList.splice(i, 1);
        }
      }
      // console.log(" add ", pos3d);

      this.damageList.push({
        owner: owner,
        type: type,
        scale: 2,
        value: value,
        pos3d: pos3d,
        pos: pos,
        isSelf: isSelf,
        addredius: addredius,
        opacity: 1,
        time: 0,
      });
    },
    animate() {
      requestAnimationFrame(this.animate);
      for (let i = this.damageList.length - 1; i >= 0; i--) {
        const item = this.damageList[i];
        item.time += this.speed;
        item.pos.y -= 0.51;
        item.scale -= 0.1;
        if (item.scale <= 1) {
          item.scale = 1;
        }
        if (item.time >= 0.51) {
          item.opacity -= this.speed;
        }
        if (item.time >= 1) {
          this.damageList.splice(i, 1);
        }
      }
    },
  },
};
</script>
 
<style scoped></style>