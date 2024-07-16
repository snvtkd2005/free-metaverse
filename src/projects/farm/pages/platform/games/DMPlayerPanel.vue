<template>
  <div class="w-full h-full absolute left-2 top-0 pointer-events-none">
    <!-- 弹幕玩家血量、等级、技能状态 -->
    <div class="absolute top-32 left-0  h-full w-auto transform origin-left">
      <div class="w-full h-full pt-2">
        <div
          v-for="(item, i) in dmPlayer"
          :key="item"
          :index="i"
          class="w-full mb-6"
        >
          <div class="px-2 text-white">
            <div class="flex relative">
              <div class="w-12 h-12 mt-3 relative">
                <img
                  class="w-full h-full rounded-full"
                  :src="item.uface"
                  alt=""
                />

                <img
                  class=" absolute -left-2 -bottom-3 w-8 h-8"
                  :src="levelBGUrl"
                  alt=""
                />
                <div
                  class="absolute -left-1 text-sm -bottom-1 w-5 h-5 rounded-full text-yellow-500 leading-5 p-px"
                >
                  {{ item.level }}
                </div>
              </div>
              <div class="w-11/12 px-1 text-xl text-yellow-300 ">
                <div class="flex">
                  <div class="ml-1 text-left leading-5">{{ item.uname }}</div>
                  <div class=" ml-1 text-left leading-5">
                    {{
                      item.state == "run"
                        ? "[" + item.posId + "]"
                        : "[替补" + item.posId + "]"
                    }}
                  </div>
                </div>
                <div class=" mt-1 mb-1 w-full h-auto relative">
                  <!-- 生命条 -->
                  <div class="w-full border relative h-4">
                    <div
                      class="bg-green-500 h-full"
                      :style="
                        'width: ' + (item.health / item.maxHealth) * 100 + '%'
                      "
                    ></div>
                    <!-- 生命条文字 -->
                    <div class="absolute left-0 top-0 w-full flex h-full">
                      <div class="self-center mx-auto text-xs truncate">
                        {{ item.health }}/{{ item.maxHealth }}
                      </div>
                    </div>
                  </div>
                  <!-- 经验条 -->
                  <div class=" hidden w-full border relative h-2">
                    <div
                      class="bg-blue-800 h-full"
                      :style="
                        'width: ' + (item.currentExp / item.needExp) * 100 + '%'
                      "
                    ></div>
                    <!-- 经验条文字 -->
                    <div class="absolute left-0 top-0 w-full flex h-full">
                      <div class="self-center mx-auto text-xs truncate">
                        exp {{ item.currentExp }}/{{ item.needExp }}
                      </div>
                    </div>
                  </div>
                  <!-- 技能 -->
                  <div class="mt-px w-full relative h-5 flex">
                    <div
                      v-for="(skill, i) in item.skill"
                      :key="i"
                      class="flex mr-1"
                    >
                      <div class="w-7 h-7 bg-gray-500 relative">
                        <div
                          v-if="item.level < skill.unLockLevel"
                          class="absolute left-0 top-0 bg-black opacity-50 w-full h-full"
                        ></div>
                        <div
                          v-if="item.level >= skill.unLockLevel"
                          class="absolute left-0 bottom-0 bg-black opacity-90 w-full h-full"
                          :style="
                            'height: ' + (1 - skill.cCD / skill.CD) * 100 + '%'
                          "
                        ></div>
                        <div
                          v-if="
                            item.level >= skill.unLockLevel && skill.perCD > 0
                          "
                          class="absolute left-0 top-0 w-full h-full leading-8 text-xl"
                        >
                          {{ skill.perCD }}
                        </div>
                        <img
                          class="w-full h-full"
                          :src="this.$uploadUVAnimUrl + skill.icon"
                          alt=""
                        />
                        <div
                          v-if="item.level >= skill.unLockLevel"
                          class=" hidden absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-yellow-700 text-xs leading-4 p-px"
                        >
                          {{ skill.level }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex">
                    <div v-if="item.armor > 0" class="  ">
                      护甲+{{ item.armor }}
                    </div>
                    <div v-if="item.energy > 0" class="  ">
                      能量+{{ item.energy }}
                    </div>
                  </div>

                  <div
                    v-if="item.debuffList && item.debuffList.length"
                    class="flex"
                  >
                    <div
                      v-for="(debuff, i) in item.debuffList"
                      :key="i"
                      class="flex mr-1"
                    >
                      <div
                        class="w-5 h-5 bg-gray-500"
                        @mouseenter="
                          HoverDebuff(item);
                          debuffHover = true;
                          debuffDescribe = debuff.describe;
                        "
                        @mouseleave="debuffHover = false"
                      >
                        <img class="w-full h-full" :src="this.$uploadUVAnimUrl + debuff.icon" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
 
<script > 

export default {
  props: [],
  components: {},
  data() {
    return { 
      
      levelBGUrl: "./public/images/cursorList/levelBG.png",
      dmPlayer: [
        // {
        //   level: 1,
        //   health: 300,
        //   maxHealth: 300,
        //   currentExp: 0,
        //   needExp: 200,
        //   skill: [
        //     {
        //       name: "",
        //       icon: "", //技能图标
        //       level: 1, //技能等级
        //       CD: 4, //冷却时间
        //     },
        //   ],
        // },
      ],  
    };
  },
  created() {},
  mounted() { 
  },

  methods: {
    setDMPlayer(_dmplayer) {
      this.dmPlayer = _dmplayer;
    },
    forceUpdate(){
      this.$forceUpdate();
    },
    changeDMPlayerSkillCD(npcId, skillIndex, cCD,CD) {
      for (let i = 0; i < this.dmPlayer.length; i++) {
        const element = this.dmPlayer[i];
        if (element.npcId == npcId) {
          let skill = element.skill[skillIndex];
          if(CD){
            skill.CD = CD;
          }
          // console.log(" in DMrogue ",npcId, skillIndex, cCD,skill.CD);
          skill.cCD = cCD;
          skill.perCD = ( skill.CD - skill.cCD).toFixed(0);
          // skill.perCD = ( skill.CD - skill.cCD).toFixed(skill.CD > 10 ? 0 : 1);

        }
      }
    },  
  },
};
</script>

<style scoped>

</style>