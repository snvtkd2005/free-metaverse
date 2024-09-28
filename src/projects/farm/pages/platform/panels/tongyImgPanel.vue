 
<template>
  <div class="w-full h-full">
    <!-- 分类table -->
    <div class="mb-4 flex bg-546770">

      <div
        class="mx-2 text-sm w-auto h-8 self-center cursor-pointer flex"
        :class="
          selecttypeTable == 'all'
            ? 'bg-445760 text-white '
            : ' text-gray-400 '
        "
        @click="selecttypeTable = 'all'"
      >
        <div class="self-center mx-auto px-1">
          all
        </div>
      </div>

      <div
        v-for="(item, i) in typeTable"
        :key="i"
        :index="item.name"
        class="mr-2 text-sm w-auto h-8 self-center cursor-pointer flex"
        :class="
          selecttypeTable == item.name
            ? 'bg-445760 text-white '
            : ' text-gray-400 '
        "
        @click="selecttypeTable = item.name"
      >
        <div class="self-center mx-auto px-1">
          {{ item.name }}
        </div>
      </div>
      <!-- <div class="text-white cursor-pointer pt-1" @click="ClickHandler('刷新')">
            刷新
          </div> -->
    </div>
    <div
      class="gap-6 w-full flex flex-wrap overflow-hidden overflow-y-auto overscroll-auto max-h-5/6 h-auto"
    >
      <!-- 新建按钮 -->
      <div class="w-32 h-32 relative border-2">
        <div
          class="w-full h-full self-center mx-auto cursor-pointer"
          @click="EditorEvent('新建')"
        ></div>
        <div
          class="absolute left-0 top-0 w-full h-full flex pointer-events-none"
        >
          <div class="self-center mx-auto">上传</div>
        </div>
      </div>
      <!-- 选择列表 -->
      <div
        v-for="(item, i) in imgList"
        :key="i"
        class=" self-center w-24 h-24 relative"
        v-show="selecttypeTable == 'all' || item.tags.includes(selecttypeTable)"
      >
        <div
          class="w-16 h-16 self-center  mx-auto overflow-hidden cursor-pointer"
          @click="EditorEvent('编辑', item)"
        >
          <img
            class="w-full h-full object-fill hover:opacity-70 transform"
            :src="this.$uploadUVAnimUrl + item.url"
          />
        </div>
        <div class="mt-2 w-28 truncate px-2 flex text-sm justify-between">
          <text>{{ item.url }}</text>
        </div>
      </div>

    </div>
    
    <el-dialog
        :title="dialogTitle"
        class="text-white create-card"
        center
        v-model="dialogVisible"
        :modal-append-to-body="false"
        width="55%"
      >
        <div
          class="self-center mx-auto bg-white rounded-xl flex flex-col justify-between p-5"
          v-if="dialogTitle == '上传图片'"
        >
          <el-upload
            class="bg-transparent w-48 mt-2"
            action=""
            :before-upload="handleBeforeUploadUVAnim"
            :accept="accept2"
            :show-file-list="false"
          >
            <div class="bg-gray-100 rounded-lg p-2 w-auto cursor-pointer">
              上传图片
            </div>
          </el-upload>

          <div v-if="uvAnimUrl != ''">
            <img
              class="w-48 h-48"
              :src="this.$uploadUVAnimUrl + uvAnimUrl"
              alt=""
            />
          </div>
          
          <div class="h-full">
            <div class="flex flex-wrap mt-3 w-full gap-3">
              <div
                v-for="(tagItem, ii) in typeTable"
                :key="ii"
                class="w-auto h-auto"
                @click="EditorEvent('标签', tagItem)"
              >
                <div
                  class="flex h-full border rounded-3xl cursor-pointer"
                  :class="
                    tagItem.select
                      ? ' border-blue-500 text-white bg-blue-500 '
                      : ' border-gray-500 text-gray-600 '
                  "
                >
                  <div class="self-center mx-auto px-4">{{ tagItem.name }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full h-12 text-xl flex">
            <div
              class="self-center mx-auto inline-block p-3 bg-gray-300 rounded-lg shadow-lg cursor-pointer pointer-events-auto"
              @click="uploadOk('UVAnim')"
            >
              确定
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="编辑标签"
        class="text-white create-card"
        center
        v-model="tagVisible"
        :modal-append-to-body="false"
        width="55%"
      >
        <div
          class="self-center mx-auto bg-white rounded-xl flex flex-col justify-between p-5"
        >
          <div v-if="uvAnimUrl != ''">
            <img
              class="w-48 h-48"
              :src="this.$uploadUVAnimUrl + uvAnimUrl"
              alt=""
            />
          </div>
          <div class="h-full">
            <div class="flex flex-wrap mt-3 w-full gap-3">
              <div
                v-for="(tagItem, ii) in typeTable"
                :key="ii"
                class="w-auto h-auto"
                @click="EditorEvent('标签', tagItem)"
              >
                <div
                  class="flex h-full border rounded-3xl cursor-pointer"
                  :class="
                    tagItem.select
                      ? ' border-blue-500 text-white bg-blue-500 '
                      : ' border-gray-500 text-gray-600 '
                  "
                >
                  <div class="self-center mx-auto px-4">{{ tagItem.name }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full h-12 text-xl flex">
            <div
              class="self-center mx-auto inline-block p-3 bg-gray-300 rounded-lg shadow-lg cursor-pointer pointer-events-auto"
              @click="EditorEvent('标签ok')"
            >
              确定
            </div>
          </div>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { UploadPlayerFile } from "../../../js/uploadThreejs.js";

import { UploadUVAnimFile, GetAllUVAnim } from "../../../js/uploadThreejs.js";

export default {
  name: "tongyImgPanel",
  components: {},
  data() {
    return {
      imgList: [],
      dialogTitle: "",
      uvAnimUrl: "",
      dialogVisible: false,
      typeTable: [
        { name: "序列图", select: false },
        { name: "图标", select: false },
        { name: "特效", select: false },
        { name: "热点", select: false },
      ],
      imgTagsList: [],
      selecttypeTable: "all",
      tagVisible: false,
      editorIndex: -1,
      fileList: [],
      folderBase: "",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.imgTagsList = _Global.imgTagsList || [];
      this.RequestGetAllUVAnim();
    }, 2000);
  },
  methods: {
    handleBeforeUploadUVAnim(file) {
      this.fileList.push(file);
      console.log(file);
      if (this.loading) {
        return;
      }
      this.UploadFilesUVAnim(this.fileList[0]);
    },

    async UploadFilesUVAnim(file) {
      if (this.loading) {
        return;
      }
      this.loading = true;

      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append("fileToUpload", file);
      // 单个文件上传，可多选。上传后放在根目录
      //模型或场景文件夹的根目录在创建时由服务器返回
      fromData.append("folderBase", this.folderBase);

      // console.log("res", res);
      // this.fileList.shift();
      // this.loading = false;
      // if (this.fileList.length > 0) {
      //   this.UploadFiles(this.fileList[0]);
      // }
      // return;

      this.modelName = file.name;

      //上传到本地 或 0SS
      UploadUVAnimFile(fromData).then((res) => {
        console.log(" 上传文件 ", res);
        if (res.data == "SUCCESS") {
          this.fileList.shift();
          this.loading = false;
          this.uvAnimUrl = this.folderBase + "/" + this.modelName;
        }
      });
    },
    uploadOk(e) {
      if (e == "UVAnim") {
        this.dialogVisible = false;
        this.uvAnimUrl = "";
        this.RequestGetAllUVAnim();
      }
    },

    async RequestGetAllUVAnim() {
      this.imgList.splice(0, this.imgList.length);
      GetAllUVAnim().then((res) => {
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const element = txtDataList[i];
            this.imgList.push({ tags: [], url: element });
          }
        }
        console.log(this.imgTagsList, this.imgList);
        for (let i = 0; i < this.imgList.length; i++) {
          const element = this.imgList[i];
          let folderBase = this.imgList[i].url.split("/")[0];
          this.setTags(folderBase, element);
        }
      });
    },

    EditorEvent(e, item, i) {
      console.log(e, item, i);
      if (e == "新建") {
        this.editorIndex = -1;
        this.dialogTitle = "上传图片";
        this.dialogVisible = true;
        this.uvAnimUrl = "";
        for (let j = 0; j < this.typeTable.length; j++) {
          this.typeTable[j].select = false;
        }
        this.folderBase = new Date().getTime();
      }
      if (e == "删除") {
        // 技能名为空时，运行删除
        this.imgList.splice(i, 1);
        this.save();
      }

      if (e == "编辑") {
        this.tagVisible = true;
        this.uvAnimUrl = item.url;
        let folderBase = this.uvAnimUrl.split("/")[0];
        this.folderBase = folderBase;
        this.getTags(folderBase);
      }
      if (e == "标签") {
        item.select = !item.select;
        this.saveTags(this.folderBase, item.name, item.select);
      }
      if (e == "标签ok") {
        this.tagVisible = false;
        this.uvAnimUrl = "";
        this.save();
      }
    },
    saveTags(folderBase, tag, select) {
      for (let i = 0; i < this.imgTagsList.length; i++) {
        const element = this.imgTagsList[i];
        if (element.folderBase == folderBase) {
          let tags = element.tags;
          for (let k = tags.length - 1; k >= 0; k--) {
            if (tag == tags[k]) {
              tags.splice(k, 1);
              return;
            }
          }
          tags.push(tag);
          return;
        }
      }
      if (select) {
        this.imgTagsList.push({
          folderBase: folderBase,
          tags: [tag],
        });
      }
    },

    setTags(folderBase, imgListItem) {
      for (let i = 0; i < this.imgTagsList.length; i++) {
        const element = this.imgTagsList[i];
        if (element.folderBase == folderBase) {
          imgListItem.tags = element.tags;
          return;
        }
      }
    },
    getTags(folderBase) {
      for (let j = 0; j < this.typeTable.length; j++) {
        this.typeTable[j].select = false;
      }
      for (let i = 0; i < this.imgTagsList.length; i++) {
        const element = this.imgTagsList[i];
        if (element.folderBase == folderBase) {
          let tags = element.tags;
          for (let j = 0; j < this.typeTable.length; j++) {
            for (let k = 0; k < tags.length; k++) {
              if (this.typeTable[j].name == tags[k]) {
                this.typeTable[j].select = true;
              }
            }
          }
          return;
        }
      }
    },
    save() {
      let s = JSON.stringify(this.imgTagsList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append(
        "fileToUpload",
        this.$stringtoBlob(s, "img_tags_data.txt")
      );
      fromData.append("folderBase", "");
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 图片标签  文件成功 ");
        }
      });
    },
  },
};
</script>