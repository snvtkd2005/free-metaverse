 
<template>
  <div class="w-full h-full">
    <div
      class="text-left w-6 h-6 mb-1 bg-white flex text-black leading-6 cursor-pointer"
      @click="EditorEvent('新建')"
    >
      <div class="mx-auto">+</div>
    </div>
    <div
      class="relative w-full text-white overflow-hidden overflow-y-auto overscroll-auto "
    >
      <el-table :data="taskList" style="width: 100%" height='700'>
        <!-- <el-table-column type="selection" width="40" /> -->
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="ID" width="130" />
        <el-table-column prop="taskTitle" label="任务名" width="150" />
        <el-table-column label="装备或道具奖励" width="240">
          <template #default="scope">
            <div
              v-if="
                scope.row &&
                scope.row.rewardItems &&
                scope.row.rewardItems.length > 1
              "
            >
              <div v-for="(item, i) in scope.row.rewardItems" :key="i">
                <div v-if="item.skill" class="w-full h-full relative flex">
                  <div
                    class="relative"
                    @mouseenter="LookSkill('道具或装备', item)"
                    @mouseleave="outHover('道具或装备')"
                  >
                    <img
                      v-if="item.skill.icon"
                      class="w-9 h-9 rounded-md"
                      :src="
                        item.skill.icon.includes('http') ||
                        item.skill.icon.includes('./public')
                          ? item.skill.icon
                          : this.$uploadUVAnimUrl + item.skill.icon
                      "
                      alt=""
                    />
                    <div
                      v-if="item.type == 'prop'"
                      class="absolute -right-1 -bottom-0 w-4 h-4 text-white rounded-full leading-4"
                    >
                      {{ item.count }}
                    </div>
                  </div>

                  <div
                    class="h-9 w-24 text-sm border text-left flex rounded-md p-1 leading-3 overflow-hidden"
                  >
                    <div class="self-center">
                      {{ item.skill.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="targetDescribe"
          label="任务目标描述"
          width="180"
        />
        <el-table-column prop="rewardGold" label="金币奖励" width="100" />
        <el-table-column prop="rewardExp" label="经验值奖励" width="100" />

        <el-table-column label="描述" width="200">
          <template #default="scope">
            <div>
              {{ scope.row && scope.row.describe }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button
              size="small"
              @click="EditorEvent('编辑', scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              size="small"
              @mouseenter="LookSkill('任务', scope.row)"
              @mouseleave="outHover('任务')"
              >预览</el-button
            >
            <!-- <el-button size="small" type="danger" @click="EditorEvent('删除', scope.row,scope.$index)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 任务添加弹窗 -->
      <taskItemEditorPanel ref="taskItemEditorPanel"></taskItemEditorPanel>
    </div>
    <div class="text-left">
      <div>玩家昵称占位符 ${name}</div>
    </div>
  </div>
</template>

<script>
import taskItemEditorPanel from "./taskItemEditorPanel.vue";

import { UploadPlayerFile } from "../../../js/uploadThreejs.js";

export default {
  name: "skillPanel",
  components: {
    taskItemEditorPanel,
  },
  data() {
    return {
      taskList: [],
      editorIndex: -1,
      hoverTask: false,
    };
  },
  created() {},
  mounted() {
    if (_Global.taskList) {
      this.taskList = _Global.taskList;
    } else {
      setTimeout(() => {
        this.taskList = _Global.taskList || [];
      }, 2000);
    }
  },
  methods: {
    LookSkill(e, item) {
      if (e == "道具或装备") {
        if (item.type == "equip") {
          _Global.LoadEquipById(item.id, (equip) => {
            item.skill = equip;
            _Global.applyEvent("预览打开", e, item.skill);

          });
          return;
        }
        _Global.applyEvent("预览打开", e, item.skill);
        return;
      }
      _Global.applyEvent("预览打开", e, item);
    },
    outHover(e) {
      _Global.applyEvent("预览关闭", e);
    },
    EditorEvent(e, item, i) {
      console.log(e, item, i);
      if (e == "新建") {
        this.editorIndex = -1;
        this.$refs.taskItemEditorPanel.dialogTitle = "新建任务";
        this.$refs.taskItemEditorPanel.createNew();
      }
      if (e == "编辑") {
        this.editorIndex = i;
        this.$refs.taskItemEditorPanel.dialogTitle = "新建任务";
        this.$refs.taskItemEditorPanel.initValue(
          JSON.parse(JSON.stringify(item))
        );
      }

      if (e == "预览") {
        this.editorIndex = i;
        this.$refs.taskItemEditorPanel.dialogTitle = "新建任务";
        this.$refs.taskItemEditorPanel.initValue(
          JSON.parse(JSON.stringify(item))
        );
      }
      if (e == "删除") {
        // 技能名为空时，运行删除
        this.taskList.splice(i, 1);
        this.save();
      }
    },

    save(settingData) {
      if (this.editorIndex == -1) {
        this.taskList.push(settingData);
      } else {
        this.taskList[this.editorIndex] = settingData;
      }
      let s = JSON.stringify(this.taskList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", this.$stringtoBlob(s, "task_data.txt"));
      fromData.append("folderBase", "");
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 角色 技能数据 文件成功 ");
        }
      });
    },
  },
};
</script>