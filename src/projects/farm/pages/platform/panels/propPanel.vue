 
<template>
  <div
    class="text-left w-6 h-6 mb-1 bg-white flex text-black leading-6 cursor-pointer"
    @click="ClickEvent('新建')"
  >
    <div class="mx-auto">+</div>
  </div>
  <div
    class="relative w-full text-white overflow-hidden overflow-y-auto overscroll-auto h-5/6"
  >
    <el-table :data="propList" style="width: 100%">
      <!-- <el-table-column type="selection" width="40" /> -->
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="id" label="ID" width="130" />
      <el-table-column prop="name" label="道具名" width="140" />
      <el-table-column label="图标" width="80">
        <template #default="scope">
          <img
            class="w-full h-full object-fill hover:opacity-70"
            :src="$uploadUVAnimUrl + scope.row.icon"
          />
        </template>
      </el-table-column>
      <el-table-column label="道具类型" width="100">
        <template #default="scope">
          <div>
            {{ scope.row && getItemsPropType(scope.row.propType) }}
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column label="显示方式" width="100">
        <template #default="scope">
          <div>
            {{ scope.row && getItemsDisplayLabel(scope.row.displayType) }}
          </div>
        </template>
      </el-table-column> -->

      <el-table-column prop="value" label="效果值" width="100" />

      <el-table-column label="描述" width="200">
        <template #default="scope">
          <div>
            {{ scope.row && scope.row.describe }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button
            size="small"
            @click="ClickEvent('编辑', scope.row, scope.$index)"
            >编辑</el-button
          >
          <!-- <el-button size="small" type="danger" @click="ClickEvent('删除', scope.row,scope.$index)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 道具添加弹窗 -->
    <propItemEditorPanel ref="editorPanel"></propItemEditorPanel>
  </div>
</template>

<script>
import propItemEditorPanel from "./propItemEditorPanel.vue";
import { UploadPlayerFile } from "../../../js/uploadThreejs.js";
import GameItems from "../../../data/platform/GameItems.js";

export default {
  name: "propPanel",
  components: {
    propItemEditorPanel,
  },
  data() {
    return {
      propList: [],
      editorIndex: -1,
      folderBase: "",
    };
  },
  created() {},
  mounted() {
    this.initValue();
  },
  methods: {
    getItemsPropType(propType) {
      this.propType = propType;
      for (let i = 0; i < GameItems.propType.length; i++) {
        const element = GameItems.propType[i];
        if (element.value == propType) {
          return element.label;
        }
      }
      return "";
    },

    getItemsDisplayLabel(value) {
      for (let i = 0; i < GameItems.displayType.length; i++) {
        const element = GameItems.displayType[i];
        if (element.value == value) {
          return element.label;
        }
      }
      return "";
    },

    getItemsLabel(value) {
      if (this.propType == "attackProperty") {
        for (let i = 0; i < GameItems.attackProperty.length; i++) {
          const element = GameItems.attackProperty[i];
          if (element.value == value) {
            return element.label;
          }
        }
      }
      if (this.propType == "basicProperty") {
        for (let i = 0; i < GameItems.basicProperty.length; i++) {
          const element = GameItems.basicProperty[i];
          if (element.value == value) {
            return element.label;
          }
        }
      }
    },
    initValue() {
      if (_Global.propList) {
        this.propList = _Global.propList;
      }
      for (let i = this.propList.length - 1; i >= 0; i--) {
        const element = this.propList[i];
        if (element == null) {
          this.propList.splice(i, 1);
        }
      }
    },

    ClickEvent(e, item, i) {
      console.log(e, item, i);
      if (e == "新建") {
        this.editorIndex = -1;
        this.$refs.editorPanel.dialogTitle = "新建道具";
        this.$refs.editorPanel.initValue(
          JSON.parse(JSON.stringify(GameItems.constSettingData))
        );
      }
      if (e == "编辑") {
        this.editorIndex = i;
        this.$refs.editorPanel.dialogTitle = "编辑道具";
        this.$refs.editorPanel.initValue(JSON.parse(JSON.stringify(item)));
      }
      if (e == "删除") {
        // 技能名为空时，运行删除
        this.propList.splice(i, 1);
        this.saveSkill();
      }
    },

    saveProp(settingData) {
      if (this.editorIndex == -1) {
        this.propList.push(settingData);
      } else {
        this.propList[this.editorIndex] = settingData;
      }
      let s = JSON.stringify(this.propList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", this.$stringtoBlob(s, "prop_data.txt"));
      fromData.append("folderBase", this.folderBase);
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 道具数据 文件成功 ");
        }
      });
    },
  },
};
</script>