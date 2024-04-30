
<template>
  <div class="absolute right-2 top-0 mt-2 pointer-events-auto">
    <div class="h-10 flex gap-x-1 mt-2 text-gray-200">
      <div v-for="(item, i) in vmdList" :key="i" class="w-full max-w-md">
        <div
          class="p-2 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
          :class="vmdname == item.name ? ' bg-opacity-80 ' : 'bg-opacity-40 '"
          @click="ChangeState('切换动作', item.name)"
        >
          <div class="self-center">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <div class="hidden h-10 gap-x-1 mt-2 text-gray-200">
      <div v-for="(item, i) in hairList" :key="i" class="w-auto max-w-md">
        <div
          class="p-2 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
          @click="ChangeState('切换服装', { part: item.part, name: item.name })"
          :class="hairName == item.name ? ' bg-opacity-80 ' : 'bg-opacity-40 '"
        >
          <div class="self-center">{{ item.name }}{{ item.part }}</div>
        </div>
      </div>
    </div>

    <!-- <div
      class="p-2 mt-1 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
      @click="ChangeState('终止')"
    >
      <div class="self-center">终止</div>
    </div> -->

    <div class=" hidden flex-col mt-1 ">
      <div class="flex gap-x-1">
        <div
          class="p-2 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
          @click="ChangeState('记录基础骨骼数据')"
        >
          <div class="self-center">记录基础骨骼数据</div>
        </div>

        <div
          class="p-2  flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
          @click="ChangeState('读取基础骨骼数据')"
        >
          <div class="self-center">读取基础骨骼数据</div>
        </div>

        <div
          class="p-2 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
          @click="ChangeState('获取骨骼')"
        >
          <div class="self-center">获取骨骼</div>
        </div>
      </div>

      <div class="flex  mt-1 gap-x-1">
        <div
          class="p-2 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
          @click="ChangeState('切换角度', 'add')"
        >
          <div class="self-center">+1 动作帧 {{ keyframe }}</div>
        </div>

        <div
          class="p-2 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
          @click="ChangeState('切换角度', 'radius')"
        >
          <div class="self-center">-1 动作帧 {{ keyframe }}</div>
        </div>
      </div>
    </div>

    <!-- <div
        class="p-2 mt-1 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
        @click="ChangeState('对齐到mixamo骨骼')"
      >
        <div class="self-center">对齐到mixamo骨骼</div>
      </div>
      <div
        class="p-2 mt-1 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
        @click="ChangeState('刻晴改对齐到mixamo')"
      >
        <div class="self-center">刻晴改对齐到mixamo</div>
      </div> -->

    <!-- <div
        class="p-2 mt-1 flex h-10 text-center cursor-pointer bg-black bg-opacity-40"
        @click="ChangeState('保存偏移')"
      >
        <div class="self-center">保存偏移</div>
      </div> -->

    <!-- <div class="flex flex-col gap-x-1 mt-2 text-gray-200">
      <div v-for="(item, i) in axis" :key="i" class="w-full max-w-md">
        <div class="p-2 flex h-10 text-center">
          <div class="self-center">{{ item.axis }}</div>
          <div class="self-center">{{ item.value }}</div>
          <div class="flex gap-x-1">
            <div
              class="w-6 h-6 self-center cursor-pointer bg-black bg-opacity-40"
              @click="ChangeState('切换角度', item, 'add')"
            >
              {{ item.add }}
            </div>
            <div
              class="w-6 h-6 self-center cursor-pointer bg-black bg-opacity-40"
              @click="ChangeState('切换角度', item, 'radius')"
            >
              {{ item.radius }}
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="flex flex-col gap-x-1 mt-2 text-gray-200 overflow-auto h-96">
      <div v-for="(item, i) in bonesOffset" :key="i" class="w-full max-w-md">
        <div class="px-2 flex h-5 text-center">
          <div
            class="self-center cursor-pointer bg-black bg-opacity-40"
            @click="ChangeState('选择骨骼', item)"
          >
            {{ item.mmd }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MMDpanel",
  components: {},
  data() {
    return {
      vmdname: "idle",
      hairList: [
        // {
        //   part: "hair",
        //   name: "八重神子",
        //   url: "./public/models/mmd/miku/八重神子头发.pmx",
        //   offset: [0, -2, -0.3],
        // },
        // {
        //   part: "hair",
        //   name: "刻晴",
        //   url: "./public/models/mmd/miku/刻晴头发2.pmx",
        //   offset: [],
        // },
        {
          part: "body",
          name: "刻晴",
          offset: [],
        },
        {
          part: "body",
          name: "八重神子",
          offset: [],
        },
      ],
      hairName: "刻晴",
      vmdList: [
        {
          name: "idle",
          url: "./public/models/mmd/vmds/idle.vmd",
          loop: true,
        },
        // {
        //   name: "idle2",
        //   url: "./public/models/mmd/vmds/idle2.vmd",
        //   loop: true,
        // },
        // {
        //   name: "idle3",
        //   url: "./public/models/mmd/vmds/idle3.vmd",
        //   loop: true,
        // },
        // {
        //   name: "idle4",
        //   url: "./public/models/mmd/vmds/idle4.vmd",
        //   loop: true,
        // },

        {
          name: "Running",
        },
        {
          name: "TPose",
          url: "./public/models/mmd/vmds/T-Pose.fbx", //快速
          loop: true,
        },
        // {
        //   name: "run",
        //   url: "./public/models/mmd/vmds/15_RunwayModel.vmd",
        //   loop: true,
        // },
        {
          name: "dance",
          url: "./public/models/mmd/vmds/wavefile_v2.vmd",
          loop: false,
        },
      ],
      axis: [
        { axis: "x", add: "+", radius: "-", value: 0 },
        { axis: "y", add: "+", radius: "-", value: 0 },
        { axis: "z", add: "+", radius: "-", value: 0 },
        { axis: "sx", add: "+", radius: "-", value: 1 },
        { axis: "sy", add: "+", radius: "-", value: 1 },
        { axis: "sz", add: "+", radius: "-", value: 1 },
      ],
      bonesOffset: [],
      selectBone: "",
      keyframe: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    ChangeState(e, msg, f) {
      if (e == "切换动作") {
        this.vmdname = msg;
      }
      if (e == "切换服装") {
        this.hairName = msg.name;
      }
      if (e == "获取骨骼") {
        this.bonesOffset = _Global.MMDManager.ChangeState(e);
      }
      if (e == "选择骨骼") {
        this.selectBone = msg.mmd;
        // this.axis[0].value = msg.rota.x;
        // this.axis[1].value = msg.rota.y;
        // this.axis[2].value = msg.rota.z;
        _Global.MMDManager.ChangeState(e, this.selectBone);
        return;
      }
      if (e == "切换角度") {
        if (msg == "add") {
          this.keyframe++;
        }
        if (msg == "radius") {
          this.keyframe--;
        }
        _Global.MMDManager.ChangeState(e, this.keyframe);
        return;
      }
      _Global.MMDManager.ChangeState(e, msg);
    },
  },
};
</script>

<style scoped></style>
