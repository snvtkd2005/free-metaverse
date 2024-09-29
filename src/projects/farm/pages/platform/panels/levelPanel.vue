 
<template>
  <div class=" w-full h-full">
    <div
      class="text-left w-6 h-6 mb-1 bg-white flex text-black leading-6 cursor-pointer"
      @click="EditorEvent('新建')"
    >
      <div class="mx-auto">+</div>
    </div>
    <div
      class="relative w-full text-white overflow-hidden overflow-y-auto overscroll-auto  "
    >
      <el-table :data="levelList" style="width: 100%" height='700'>
        <!-- <el-table-column type="selection" width="40" /> -->
        <!-- <el-table-column type="index" label="序号" width="60" /> -->
        <el-table-column prop="level" label="等级" width="100" />
        <el-table-column prop="exp" label="升级所需经验值" width="200" />
        <el-table-column prop="maxHealth" label="基础生命值" width="100" />
        <el-table-column prop="intelligence" label="智力" width="80" />
        <el-table-column prop="endurance" label="耐力" width="80" />
        <el-table-column prop="agile" label="敏捷" width="80" />
        <el-table-column prop="strength" label="力量" width="80" />
        <el-table-column prop="spirit" label="精神" width="80" />

        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              size="small"
              @click="EditorEvent('编辑', scope.row, scope.$index)"
              >编辑</el-button
            >
            <!-- <el-button size="small" type="danger" @click="EditorEvent('删除', scope.row,scope.$index)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 技能添加弹窗 -->
      <levelItemEditorPanel ref="levelItemEditorPanel"></levelItemEditorPanel>
    </div>
  </div>
</template>

<script>
import levelItemEditorPanel from "./levelItemEditorPanel.vue";

import { UploadPlayerFile } from "../../../js/uploadThreejs.js";

export default {
  name: "levelPanel",
  components: {
    levelItemEditorPanel,
  },
  data() {
    return {
      levelList: [],
      editorIndex: -1,
    };
  },
  created() {},
  mounted() {
    if (_Global.levelList) {
      this.levelList = _Global.levelList;
    } else {
      setTimeout(() => {
        this.levelList = _Global.levelList || [];
      }, 2000);
    }
  },
  methods: {
    EditorEvent(e, item, i) {
      console.log(e, item, i);
      if (e == "新建") {
        this.editorIndex = -1;
        this.$refs.levelItemEditorPanel.dialogTitle = "新建";

        this.$refs.levelItemEditorPanel.initValue({
          level: this.levelList[this.levelList.length - 1].level + 1,
          exp: this.levelList[this.levelList.length - 1].exp + 30,
          maxHealth: this.levelList[this.levelList.length - 1].maxHealth + 30,
          intelligence: this.levelList[this.levelList.length - 1].intelligence,
          endurance: this.levelList[this.levelList.length - 1].endurance,
          agile: this.levelList[this.levelList.length - 1].agile,
          strength: this.levelList[this.levelList.length - 1].strength,
          spirit: this.levelList[this.levelList.length - 1].spirit,
        });
        // this.$refs.levelItemEditorPanel.createNew();
      }
      if (e == "编辑") {
        this.editorIndex = i;
        this.$refs.levelItemEditorPanel.dialogTitle = "编辑";
        this.$refs.levelItemEditorPanel.initValue(
          JSON.parse(JSON.stringify(item))
        );
      }
      if (e == "删除") {
        // 技能名为空时，运行删除
        this.levelList.splice(i, 1);
        this.save();
      }
    },

    save(settingData) {
      if (this.editorIndex == -1) {
        this.levelList.push(settingData);
      } else {
        this.levelList[this.editorIndex] = settingData;
      }
      let s = JSON.stringify(this.levelList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", this.$stringtoBlob(s, "level_data.txt"));
      fromData.append("folderBase", "");
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 等级和经验 数据 文件成功 ");
        }
      });
    },
  },
};
</script>