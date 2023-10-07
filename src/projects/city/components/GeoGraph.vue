<template>
  <div
    class="
      geoGraph
      scale-50
      transform
      translate-x-12 translate-y-24
      md:translate-x-0 md:translate-y-0 md:scale-100
      overflow-hidden
    "
  >
    <img class="mt-10" :src="path + 'img/graph.png'" alt="" srcset="" />
    <div class="point_pos">
      <div
        class="point"
        :style="{ left: item.left, top: item.top }"
        @click="clickPoint(item.id)"
        v-for="item in clickPos"
        :key="item.id"
      >
        <img :src="path + item.url" alt="" />
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      clickPos: [
        {
          id: "pos1",
          left: "100px",
          top: "-90px",
          url: "img/Icon/①.png",
        },
        {
          id: "pos2",
          left: "97px",
          top: "-143px",
          url: "img/Icon/②.png",
        },
        {
          id: "pos3",
          left: "170px",
          top: "-108px",
          url: "img/Icon/③.png",
        },
        {
          id: "pos4",
          left: "163px",
          top: "-35px",
          url: "img/Icon/④.png",
        },
        {
          id: "pos5",
          left: "228px",
          top: "-95px",
          url: "img/Icon/⑤.png",
        },
        {
          id: "pos6",
          left: "213px",
          top: "-35px",
          url: "img/Icon/⑥.png",
        },
        {
          id: "pos7",
          left: "45px",
          top: "-85px",
          url: "img/Icon/⑦.png",
        },
        {
          id: "pos8",
          left: "55px",
          top: "-40px",
          url: "img/Icon/⑧.png",
        },
        {
          id: "pos9",
          left: "40px",
          top: "-142px",
          url: "img/Icon/⑨.png",
        },
        {
          id: "pos10",
          left: "30px",
          top: "-193px",
          url: "img/Icon/⑩.png",
        },
        {
          id: "pos11",
          left: "68px",
          top: "-188px",
          url: "img/Icon/⑪.png",
        },
        {
          id: "pos12",
          left: "195px",
          top: "-193px",
          url: "img/Icon/⑫.png",
        },
        {
          id: "pos15",
          left: "250px",
          top: "-173px",
          url: "img/Icon/⑬.png",
        },
        {
          id: "pos18",
          left: "135px",
          top: "-240px",
          url: "img/Icon/⑱.png",
        },
        {
          id: "pos19",
          left: "160px",
          top: "-285px",
          url: "img/Icon/⑲.png",
        },
        {
          id: "pos21",
          left: "70px",
          top: "-255px",
          url: "img/Icon/㉑.png",
        },
      ],
      path: "",
    };
  },

  mounted() {
    this.path = this.$parent.$publicUrl;
  },
  methods: {
    clickPoint(postion) {
      this.$parent.ChangePlayerPos(postion);
      //   console.log(postion);
    },
  },
};
</script>
  
  <style>
.geoGraph {
  width: 320px;
  height: 450px;
  /* width: 220px;
      height: 350px; */
  position: absolute;
  bottom: 0px;
  left: 10px;
}
.geoGraph img {
  width: 100%;
  height: 100%;
}
.point_pos {
  position: relative;
  top: -100px;
  left: 0;
}
.point {
  position: absolute;
  cursor: pointer;
}
.point img {
  height: 30px;
  width: 30px;
}
.point img:hover {
  transform: scale(1.5);
  transition: 0.5s;
}
</style>