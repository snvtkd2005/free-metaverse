 
<template>
  <div class=" w-full h-full">
    <div
      class="text-left w-6 h-6 mb-1 bg-white flex text-black leading-6 cursor-pointer"
      @click="EditorEvent('新建')"
    >
      <div class="mx-auto">+</div>
    </div>
    <div
      class="relative w-full text-white overflow-hidden overflow-y-auto overscroll-auto "
    >
      <el-table :data="skillList" style="width: 100%;" 
     height='700'>
        <!-- <el-table-column type="selection" width="40" /> -->
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="skillName" label="技能名" width="100" />
        <el-table-column label="技能图标" width="80">
          <template #default="scope">
            <img
              class="w-full h-full object-fill hover:opacity-70"
              :src="$uploadUVAnimUrl + scope.row.icon"
                    @mouseenter="LookSkill('道具或装备', scope.row)"
                    @mouseleave="outHover('道具或装备')"
            />
          </template>
        </el-table-column>
        <el-table-column label="触发类型" width="100">
          <template #default="scope">
            <div>
              {{ scope.row && scope.row.trigger && scope.row.trigger.type }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="触发值/CD" width="100">
          <template #default="scope">
            <div>
              {{ scope.row && scope.row.trigger && scope.row.trigger.value }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="目标类型" width="100">
          <template #default="scope">
            <div>
              {{ scope.row && scope.row.target && scope.row.target.type }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="目标数量" width="80">
          <template #default="scope">
            <div>
              {{ scope.row && scope.row.target && scope.row.target.value }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="vaildDis"
          class="truncate"
          label="攻击范围"
          width="80"
        />
        <el-table-column prop="castTime" label="吟唱时间" width="80" />
        <el-table-column prop="animNameReady" label="吟唱动作" width="100" />
        <el-table-column prop="animName" label="施放动作" width="100" />
        <!-- <el-table-column label="效果类型" width="100">
          <template #default="scope">
            <div>
              {{ scope.row && scope.row.effect && scope.row.effect.type }}
            </div>
          </template>
        </el-table-column> -->

        <el-table-column label="描述" width="200">
          <template #default="scope">
            <div>
              {{ scope.row && scope.row.describe }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              @click="EditorEvent('编辑', scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              size="small"
              @click="EditorEvent('复制到新建', scope.row, scope.$index)"
              >复制到新建</el-button
            >
            <!-- <el-button size="small" type="danger" @click="EditorEvent('删除', scope.row,scope.$index)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 技能添加弹窗 -->
      <skillItemEditorPanel ref="skillItemEditorPanel"></skillItemEditorPanel>
    </div>
  </div>
</template>

<script>
import skillItemEditorPanel from "./skillItemEditorPanel.vue";
import skillItem from "../../../data/platform/skillItem.js";

import { UploadPlayerFile } from "../../../js/uploadThreejs.js";

export default {
  name: "skillPanel",
  components: {
    skillItemEditorPanel,
  },
  data() {
    return {
      skillList: [],
      editorIndex: -1,
    };
  },
  created() {},
  mounted() {
    if (_Global.skillList) {
      this.skillList = _Global.skillList;
    } else {
      setTimeout(() => {
        this.skillList = _Global.skillList || [];
      }, 2000);
    }
  },
  methods: {
    LookSkill(e, item) { 
      _Global.applyEvent("预览打开", e, item);
    },
    outHover(e) {
      _Global.applyEvent("预览关闭", e);
    },
    EditorEvent(e, item, i) {
      console.log(e, item, i);
      if (e == "新建") {
        this.editorIndex = -1;
        this.$refs.skillItemEditorPanel.dialogTitle = "新建技能";
        this.$refs.skillItemEditorPanel.initValue(
          JSON.parse(JSON.stringify(skillItem.skill))
        );
      }
      if (e == "编辑") {
        this.editorIndex = i;
        this.$refs.skillItemEditorPanel.dialogTitle = "编辑技能";
        this.$refs.skillItemEditorPanel.initValue(
          JSON.parse(JSON.stringify(item))
        );
      }
      if (e == "删除") {
        // 技能名为空时，运行删除
        this.skillList.splice(i, 1);
        this.save();
      }

      if (e == "复制到新建") {
        this.editorIndex = -1;
        this.$refs.skillItemEditorPanel.dialogTitle = "新建技能";
        this.$refs.skillItemEditorPanel.initValue(
          JSON.parse(JSON.stringify(item))
        );
      }
    },

    saveSkill(settingData) {
      if (this.editorIndex == -1) {
        this.skillList.push(settingData);
      } else {
        this.skillList[this.editorIndex] = settingData;
      }
      this.save();
    },
    save() {
      let s = JSON.stringify(this.skillList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", this.$stringtoBlob(s, "skill_data.txt"));
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