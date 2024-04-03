<!-- // 场景编辑UI -->
<template>
  <div class="absolute left-0 top-0 z-999 w-full h-full flex">

    <!-- 中部 -->
    <div class="flex mt-0 w-11/12 md:w-5/6 h-full mx-auto bg-gray-100">
      <!-- 右 -->
      <div class="pt-10 w-full h-full">
        <!-- table 选择列表 -->
        <div class="mt-2 flex text-lg mb-4">
          <div
            v-for="(item, i) in tableList"
            :key="i"
            class="w-20 md:w-40 h-auto relative"
          >
            <div
              class="w-full h-10 self-center flex cursor-pointer"
              :class="currentTable == item.content ? ' bg-gray-300' : ' bg-gray-100'"
              @click="currentTable = item.content"
            >
              <div class="self-center mx-auto">{{ item.content }}</div>
            </div>
          </div>
        </div>

        <!-- 分类table -->
        <div v-if="currentTable == '单品'" class=" mb-4 flex bg-546770">
          <div
            v-for="(item, i) in modelTable"
            :key="i"
            :index="item.name"
            class="mr-2 text-sm w-auto h-8 self-center cursor-pointer flex"
            :class="
              selectModelTable == item.name ? 'bg-445760 text-white ' : ' text-gray-400 '
            "
            @click="selectModelTable = item.name"
          >
            <div class="self-center mx-auto px-1">
              {{ item.name }}
            </div>
          </div>
          <!-- <div class="text-white cursor-pointer pt-1" @click="ClickHandler('刷新')">
            刷新
          </div> -->
        </div>

        <!-- 单品 -->
        <div
          v-if="currentTable == '单品'"
          class="gap-6 w-full flex flex-wrap h-auto max-h-5/6 overflow-y-auto overscroll-auto"
        >
          <!-- 新建按钮 -->
          <div class="w-40 h-40 border-2 relative">
            <div
              class="w-40 h-40 mx-auto cursor-pointer"
              @click="CreateNew(currentTable)"
            >
              <!-- <img class=" w-full h-full    object-fill hover:opacity-70 " src="publicUrl + item.icon" /> -->
            </div>
            <div class="absolute left-0 top-0 w-full h-full flex pointer-events-none">
              <div class="self-center mx-auto">
                {{ customPanel.createNewSingle }}
              </div>
            </div>
          </div>

          <!-- 选择列表 -->
          <div
            v-for="(item, i) in modelsList"
            :key="i"
            :index="item.name"
            v-show="item.modelType == selectModelTable || selectModelTable == 'all'"
            class="w-40 h-auto relative"
          >
            <div
              class="w-40 h-28 bg-blue-200 rounded-lg self-center mx-auto cursor-pointer"
              @click="SelectModel(item)"
            >
              <img
                class="w-full h-full rounded-lg object-fill hover:opacity-70"
                :src="uploadUrl + item.icon"
              />
            </div>

            <div class="mt-2 px-2 flex text-sm justify-between truncate">
              <div>{{ item.name }}</div>
            </div>
            <div class="mt-2 px-2 hidden md:flex text-sm justify-between">
              <text>{{ item.folderBase }}</text>
            </div>
            <div class="mt-2 px-2 flex text-xs justify-between">
              <div>{{ item.modelType }}</div>
            </div>
            <div class="hidden mt-2 px-2 flex text-xs justify-between">
              <div>{{ base.good }} 158</div>
              <div>{{ base.visite }} 177</div>
            </div>
            <div class="mt-2 px-2 hidden md:flex text-xs justify-between">
              <div class="cursor-pointer" @click="Editor(item)">
                {{ base.editor }}
              </div>
              <div class="cursor-pointer" @click="Delete(item)">
                {{ base.delete }}
              </div>
            </div>
          </div>
        </div>

        <!-- 组合 -->
        <div
          v-if="currentTable == '组合'"
          class="gap-6 w-full flex flex-wrap h-auto max-h-5/6 overflow-y-auto overscroll-auto"
        >
          <!-- 新建按钮 -->
          <div class="w-40 h-40 border-2 relative">
            <div
              class="w-40 h-40 mx-auto cursor-pointer"
              @click="CreateNew(currentTable)"
            >
              <!-- <img class=" w-full h-full    object-fill hover:opacity-70 " src="publicUrl + item.icon" /> -->
            </div>
            <div class="absolute left-0 top-0 w-full h-full flex pointer-events-none">
              <div class="self-center mx-auto">
                {{ customPanel.createNewGroup }}
              </div>
            </div>
          </div>

          <!-- 选择列表 -->
          <div v-for="(item, i) in groupList" :key="i" class="w-40 h-auto relative">
            <div
              class="w-40 h-28 bg-blue-200 rounded-lg self-center mx-auto cursor-pointer"
              @click="EditorGroup(item)"
            >
              <img
                class="w-full h-full rounded-lg object-fill hover:opacity-70"
                :src="$uploadGroupUrl + item.icon"
              />
            </div>

            <div class="mt-2 px-2 flex text-sm justify-between truncate">
              <div>{{ item.name }}</div>
            </div>
            <div class="mt-2 px-2 hidden md:flex text-sm justify-between">
              <text>{{ item.folderBase }}</text>
            </div>
            <div class="mt-2 px-2 flex text-xs justify-between">
              <div>{{ item.modelType }}</div>
            </div>
            <div class="hidden mt-2 px-2 flex text-xs justify-between">
              <div>{{ base.good }} 158</div>
              <div>{{ base.visite }} 177</div>
            </div>
            <div class="mt-2 px-2 hidden md:flex text-xs justify-between">
              <div class="cursor-pointer" @click="EditorGroup(item)">
                {{ base.editor }}
              </div>
              <div class="cursor-pointer" @click="Delete(item)">
                {{ base.delete }}
              </div>
            </div>
          </div>
        </div>

        <!-- 场景 -->
        <div
          v-if="currentTable == '场景'"
          class="gap-6 w-full flex flex-wrap h-auto max-h-5/6 overflow-y-auto overscroll-auto"
        >
          <!-- 新建按钮 -->
          <div class="w-40 h-40 border-2 relative">
            <div
              class="w-40 h-40 self-center mx-auto cursor-pointer"
              @click="CreateNew(currentTable)"
            >
              <!-- <img class=" w-full h-full    object-fill hover:opacity-70 " src="publicUrl + item.icon" /> -->
            </div>
            <div class="absolute left-0 top-0 w-full h-full flex pointer-events-none">
              <div class="self-center mx-auto">
                {{ customPanel.createNewScene }}
              </div>
            </div>
          </div>
          <!-- 选择列表 -->
          <div v-for="(item, i) in sceneList" :key="i" class="w-40 h-auto">
            <div
              class="w-40 h-28 bg-blue-200 rounded-lg self-center mx-auto cursor-pointer"
              @click="SelectScene(item)"
            >
              <img
                class="w-full h-full rounded-lg object-fill hover:opacity-70"
                :src="uploadSceneUrl + item.icon"
              />
            </div>

            <div class="mt-2 px-2 flex text-sm justify-between cursor-pointer truncate">
              <div>{{ item.name }}</div>
            </div>

            <div class="mt-2 px-2 flex text-sm justify-between">
              <text>{{ item.folderBase }}</text>
            </div>
            <div class="hidden mt-2 px-2 flex text-xs justify-between">
              <div>{{ base.good }} 158</div>
              <div>{{ base.visite }} 177</div>
            </div>
            <div class="mt-2 px-2 flex text-xs justify-between">
              <div class="cursor-pointer" @click="EditorScene(item)">
                {{ base.editor }}
              </div>
              <div class="cursor-pointer" @click="Delete(item)">
                {{ base.delete }}
              </div>
            </div>
          </div>
        </div>

        <!-- HDR -->
        <div
          v-if="currentTable == 'HDR'"
          class="gap-6 w-full flex flex-wrap h-auto max-h-5/6 overflow-y-auto overscroll-auto"
        >
          <!-- 新建按钮 -->
          <div class="w-40 h-40 relative border-2">
            <div
              class="w-40 h-40 self-center mx-auto cursor-pointer"
              @click="CreateNew(currentTable)"
            >
              <!-- <img class=" w-full h-full    object-fill hover:opacity-70 " src="publicUrl + item.icon" /> -->
            </div>
            <div class="absolute left-0 top-0 w-full h-full flex pointer-events-none">
              <div class="self-center mx-auto">
                {{ customPanel.createNewHDR }}
              </div>
            </div>
          </div>

          <div v-for="(item, i) in jpgList" :key="i" class="w-40 h-auto relative">
            <div class="w-40 h-20 self-center mx-auto cursor-pointer">
              <img
                class="w-full h-full object-fill hover:opacity-70"
                :src="this.$uploadHDRUrl + item"
              />
            </div>

            <div class="mt-2 w-28 truncate px-2 flex text-sm justify-between">
              <text>{{ item }}</text>
            </div>
            <div class="hidden mt-2 px-2 flex text-xs justify-between">
              <div>{{ base.good }} 158</div>
              <div>{{ base.visite }} 177</div>
            </div>
            <div class="mt-2 px-2 flex text-xs justify-between">
              <div class="cursor-pointer">{{ base.editor }}</div>
              <div class="cursor-pointer">{{ base.delete }}</div>
            </div>
          </div>
        </div>

        <!-- 通用图片 -->
        <div
          v-if="currentTable == '通用图片'"
          class="gap-6 w-full flex flex-wrap h-auto max-h-5/6 overflow-y-auto overscroll-auto"
        >
          <!-- 新建按钮 -->
          <div class="w-32 h-32 relative border-2">
            <div
              class="w-full h-full self-center mx-auto cursor-pointer"
              @click="CreateNew('UVAnim')"
            >
              <!-- <img class=" w-full h-full    object-fill hover:opacity-70 " src="publicUrl + item.icon" /> -->
            </div>
            <div class="absolute left-0 top-0 w-full h-full flex pointer-events-none">
              <div class="self-center mx-auto">
                {{ customPanel.createNewUVanim }}
              </div>
            </div>
          </div>
          <!-- 选择列表 -->
          <div
            v-for="(item, i) in uvAnimList"
            :key="i"
            class="self-center w-32 h-auto relative"
          >
            <div class="w-32 h-32 self-center mx-auto overflow-hidden cursor-pointer">
              <img
                class="w-full h-full object-fill hover:opacity-70 transform"
                :src="this.$uploadUVAnimUrl + item"
              />
            </div>
            <div class="mt-2 w-28 truncate px-2 flex text-sm justify-between">
              <text>{{ item }}</text>
            </div>
            <div class="hidden mt-2 px-2 flex text-xs justify-between">
              <div>{{ base.good }} 158</div>
              <div>{{ base.visite }} 177</div>
            </div>
            <div class="mt-2 px-2 flex text-xs justify-between">
              <div class="cursor-pointer">{{ base.editor }}</div>
              <div class="cursor-pointer">{{ base.delete }}</div>
            </div>
          </div>
        </div>

        <!-- 通用音效 -->
        <div
          v-if="currentTable == '通用音效'"
          class="gap-6 w-full flex flex-wrap h-auto max-h-5/6 overflow-y-auto overscroll-auto"
        >
          <!-- 新建按钮 -->
          <div class="w-32 h-32 relative border-2">
            <div
              class="w-full h-full self-center mx-auto cursor-pointer"
              @click="CreateNew('audio')"
            >
              <!-- <img class=" w-full h-full    object-fill hover:opacity-70 " src="publicUrl + item.icon" /> -->
            </div>
            <div class="absolute left-0 top-0 w-full h-full flex pointer-events-none">
              <div class="self-center mx-auto">
                {{ customPanel.createNewUVanim }}
              </div>
            </div>
          </div>
          <!-- 选择列表 -->
          <div
            v-for="(item, i) in audioList"
            :key="i"
            class="self-center w-60 h-auto bg-blue-200 rounded-lg p-2 relative"
          >
            <div
              class="w-full h-14 self-center mx-auto overflow-hidden cursor-pointer"
              @click="SelectItem('audio', item)"
            >
              <div class="rounded-xl bg-gray-100 border w-full">
                <audio
                  class="w-full"
                  controls
                  :src="this.$uploadAudioUrl + item.folderBase + '/' + item.name"
                ></audio>
              </div>
            </div>
            <div class="flex flex-wrap mt-1 w-full gap-3">
              <div
                v-for="(tagItem, ii) in item.tags"
                :key="ii"
                class="border rounded-3xl border-white w-auto h-auto"
              >
                <div class="flex h-full text-gray-600">
                  <div class="self-center mx-auto px-4">{{ tagItem }}</div>
                </div>
              </div>
            </div>
            <div class="mt-2 w-full truncate px-2 flex text-sm justify-between">
              <text>{{ item.folderBase + "/" + item.name }}</text>
            </div>
            <div class="hidden mt-2 px-2 flex text-xs justify-between">
              <div>{{ base.good }} 158</div>
              <div>{{ base.visite }} 177</div>
            </div>
            <div class="mt-2 px-2 flex text-xs justify-between">
              <div class="cursor-pointer" @click="ClickHandler('编辑音频', item)">
                {{ base.editor }}
              </div>
              <div class="cursor-pointer">{{ base.delete }}</div>
            </div>
          </div>
        </div>

        <!-- 技能 -->
        <div v-if="currentTable == '技能'" class="gap-6 w-full mx-auto h-full">
          <skillSettingPanel></skillSettingPanel>
        </div>
      </div>

    </div>


    <!-- 立即进入 -->
    <div
      v-if="infloating"
      class="absolute left-0 top-0 w-full h-full flex bg-black bg-opacity-60"
      @click="infloating = false"
    >
      <div
        class="w-11/12 h-11/12 md:w-1/2 md:h-1/2 self-center mx-auto bg-white rounded-xl"
      >
        <div class="p-4 w-full flex">
          <div class="w-1/2 h-1/2">
            <img
              class="w-full h-full object-fill hover:opacity-70"
              :src="uploadSceneUrl + currentSceneData.icon"
            />
  
            <div class="absolute left-0 top-0 z-999 w-full h-full flex pointer-events-none">
              <canvas id="cv" width="600" height="600"></canvas>
            </div>

          </div>
          <div class="relative flex-grow flex-col justify-between">
            <div>{{ currentSceneData.name }}</div>
            <div class="absolute bottom-4 w-full">
              <div
                class="cursor-pointer inline-block px-4 py-2 bg-blue-200 text-gray-600 rounded-lg shadow-lg"
                @click="EnterScene()"
              >
                立即进入
              </div>
            </div>
          </div>
        </div>
        <div class="p-10 text-left">
          <div class="text-xl">描述：</div>
          <div class="mt-10">{{ currentSceneData.describe }}</div>
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
        class="h-auto self-center mx-auto bg-white rounded-xl flex flex-col justify-between p-5"
        v-if="dialogTitle == '创建单品' || dialogTitle == '创建场景' || dialogTitle == '创建组合'"
      >
      <div class=" text-yellow-600 flex " >
        操作步骤请查看演示视频： 
        <div  class="  underline underline-offset-4 text-blue-300 ">
          <a target="_blank" href="https://www.bilibili.com/video/BV1Qk4y1g7bz"  > https://www.bilibili.com/video/BV1Qk4y1g7bz </a>
        </div>
      </div>
        <!-- 输入名称 -->
        <div class="flex mt-2 h-10">
          <div class="w-auto h-6 mt-1 mr-2">{{ createForm.title }}{{ base.name }}</div>
          <input
            class="outline-none bg-transparent border placeholder-gray-400 p-1"
            type="text"
            v-model="createForm.modelName"
            placeholder=""
          />
        </div>

        <div class="mt-4 text-left">{{ base.selectTemple }}</div>
        <!-- 模板选择 单品 -->
        <div class="mt-4 grid grid-cols-5 gap-4">
          <div
            v-for="(item, i) in createTemplate"
            :key="i"
            class="self-center w-auto h-auto relative"
          >
            <div
              class="w-12 h-12 self-center mx-auto cursor-pointer relative"
              @click="selectTempleHandle(item)"
            >
              <img class="w-full h-full object-fill hover:opacity-70" />

              <div
                v-if="createForm.template == item.name"
                class="absolute -top-1 -right-2"
              >
                <img
                  class="w-2 h-2 xl:w-6 xl:h-6 object-fill"
                  :src="publicUrl + 'images/spUI/select.png'"
                />
              </div>
            </div>
            <div class="mt-2 px-2 flex text-sm justify-between cursor-pointer">
              <div class="mx-auto">{{ item.name }}</div>
            </div>

            <div class="hidden mt-2 px-2 flex text-sm justify-between cursor-pointer">
              <div>{{ item.content }}</div>
            </div>
          </div>
        </div>

        <div class="mt-2 text-left w-auto h-full">描述:{{ createForm.content }}</div>
        <div class="w-full h-12 text-xl flex mt-4">
          <div
            class="self-center mx-auto inline-block p-3 bg-gray-300 rounded-lg shadow-lg"
            :class="
              createForm.modelName != ''
                ? '  cursor-pointer pointer-events-auto  '
                : ' pointer-events-none '
            "
            @click="CreateNewOK()"
          >
            {{ base.ok }}
          </div>
        </div>
      </div>

      <div
        class="self-center mx-auto bg-white rounded-xl flex flex-col justify-between p-5"
        v-if="dialogTitle == '上传HDR'"
      >
        <el-upload
          class="bg-transparent w-48 mt-2"
          action=""
          multiple
          :before-upload="handleBeforeUpload"
          :accept="accept"
          :show-file-list="false"
        >
          <div class="bg-gray-100 rounded-lg p-2 w-auto cursor-pointer">
            {{ customPanel.hdrTip }}
          </div>
        </el-upload>

        <div v-if="hdrUrl != ''">
          <img class="w-96 h-48" :src="this.$uploadUVAnimUrl + hdrUrl" alt="" />
        </div>
        <div class="h-full"></div>
        <div class="w-full h-12 text-xl flex">
          <div
            class="self-center mx-auto inline-block p-3 bg-gray-300 rounded-lg shadow-lg"
            :class="
              createForm.modelName != ''
                ? '  cursor-pointer pointer-events-auto  '
                : ' pointer-events-none '
            "
            @click="CreateNewOK()"
          >
            {{ base.ok }}
          </div>
        </div>
      </div>

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
            {{ customPanel.uvAnimTip }}
          </div>
        </el-upload>

        <div v-if="uvAnimUrl != ''">
          <img class="w-96 h-48" :src="this.$uploadUVAnimUrl + uvAnimUrl" alt="" />
        </div>
        <div class="h-full"></div>
        <div class="w-full h-12 text-xl flex">
          <div
            class="self-center mx-auto inline-block p-3 bg-gray-300 rounded-lg shadow-lg cursor-pointer pointer-events-auto"
            @click="uploadOk('UVAnim')"
          >
            {{ base.ok }}
          </div>
        </div>
      </div>

      <div
        class="self-center mx-auto bg-white rounded-xl flex flex-col justify-between p-5"
        v-if="dialogTitle == '上传音频' || dialogTitle == '编辑音频'"
      >
        <el-upload
          class="bg-transparent w-48 mt-2"
          action=""
          :before-upload="handleBeforeUpload_audio"
          accept=".mp3,.ogg"
          :show-file-list="false"
        >
          <div class="bg-gray-100 rounded-lg p-2 w-auto cursor-pointer">
            {{ customPanel.audioTip }}
          </div>
        </el-upload>

        <div class="flex flex-wrap w-5/6 gap-3">
          <div
            v-for="(tagItem, ii) in this.createForm.audio.tags"
            :key="ii"
            class="border rounded-3xl border-gray-300 w-auto h-8"
          >
            <div class="flex h-full text-gray-600">
              <div class="self-center mx-auto px-4">{{ tagItem }}</div>
              <div
                @click="ClickHandler('删除标签', ii)"
                class="self-center p-1 px-2 flex text-gray-300 text-xs cursor-pointer"
              >
                X
              </div>
            </div>
          </div>
        </div>

        <div class="flex mt-2 rounded-2xl">
          <el-input
            @keydown.enter.native="onblurInputTag"
            ref="inAddTag"
            @blur="onblurInputTag"
            v-model="addTagStr"
            style="width: 240px; margin-right: 8px"
            placeholder="按回车键Enter创建标签"
          ></el-input>
        </div>
        <audio
          v-if="this.createForm.audio.name"
          controls
          :src="
            this.$uploadAudioUrl +
            this.createForm.audio.folderBase +
            '/' +
            this.createForm.audio.name
          "
        ></audio>

        <div class="h-full"></div>
        <div class="w-full h-12 text-xl flex">
          <div
            class="self-center mx-auto inline-block p-3 bg-gray-300 rounded-lg shadow-lg cursor-pointer pointer-events-auto"
            @click="uploadOk('audio')"
          >
            {{ base.ok }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PlayerAnimData from "../../data/playerAnimSetting.js";

import skillSettingPanel from "./panels/skillSettingPanel.vue";

import { Interface } from "../../js/Interface_editor.js";
import SceneData from "../../data/sceneData.js";

import ModelListData from "../../data/modelData.js";
import languageData from "../../data/zh_cn.js";

import {
  UploadFile,
  UploadHDRFile,
  UploadUVAnimFile,
  GetAllModel,
  GetAllScene,
  GetAllGroup,
  GetAllHDR,
  GetAllUVAnim,
  UploadSceneFile,
  UploadGroupFile,
  GetAllAudio,
  UploadAudioFile,
} from "../../js/uploadThreejs.js";



export default {
  name: "selfPanel",
  components: {
    skillSettingPanel,
  },
  data() {
    return {
      title: "",
      hover: false,
      infloating: false,
      inAddTag: false,
      addTagStr: "",
      dialogTitle: "",
      dialogVisible: false,

      createForm: {},
      playerImg: "",
      avatarName: "小孩",
      playerName: "hhh",

      projectionList: [],

      // 上传模板
      tableList: [],
      currentTable: "场景",
      createNewScene: "",
      createNewSingle: "",
      createNewHDR: "",
      createNewUVanim: "",
      customPanel: {},

      base: {},
      templateList: [],
      // 对应模板选择
      createTemplate: [],

      modelsList: [],
      groupList: [],
      sceneList: [],
      hdrList: [],
      jpgList: [],
      uvAnimList: [],
      audioList: [],

      selectSceneName: "scene1",
      currentSceneData: null,
      publicUrl: "",
      uploadUrl: "",
      uploadSceneUrl: "",
      // 是否有目标，目标为npc、其他玩家
      hasTarget: false,
      accept: ".hdr,.HDR,.jpg,jpeg",
      accept2: ".png,.jpg",
      hdrUrl: "",
      uvAnimUrl: "",

      fileList: [],
      selectModelTable: "all",
      modelTable: [],
    };
  },
  created() {
    this.avatarData = PlayerAnimData;
    this.tableList = this.UIData.customPanel.tableList;
    this.templateList = this.UIData.customPanel.templateList;
    this.currentTable = this.UIData.customPanel.currentTable;
    this.title = this.UIData.customPanel.title;
    this.customPanel = this.UIData.customPanel;
    this.base = this.UIData.base;

    this.modelTable = this.UIData.customPanel.allModelType;

    // this.modelsList = ModelListData.modelsList;
  },
  mounted() {
    this.uploadUrl = this.$uploadUrl;
    this.uploadSceneUrl = this.$uploadSceneUrl;
    this.publicUrl = this.$publicUrl + this.avatarData.localPath;

    new Interface(this, true);
    // this.sceneList = SceneData.sceneList;

    this.RequestGetAllModel();
    this.RequestGetAllScene();
    this.RequestGetAllHDR();
    this.RequestGetAllUVAnim();
 
  },
  methods: {
    onblurInputTag() {
      console.log(this.addTagStr);
      if (this.addTagStr != "") {
        let has = false;
        for (let i = 0; i < this.createForm.audio.tags.length && !has; i++) {
          const element = this.createForm.audio.tags[i];
          if (element == this.addTagStr) {
            has = true;
          }
        }
        if (!has) {
          this.createForm.audio.tags.push(this.addTagStr);
        }
      }
      this.inAddTag = false;
      this.addTagStr = "";
    },
    ClickHandler(e, item) {
      if (e == "删除标签") {
        let i = item;
        this.createForm.audio.tags.splice(i, 1);
      }
      if (e == "新增标签") {
        this.addTagStr = "";
        this.inAddTag = true;
        this.$nextTick(() => {
          this.$refs.inAddTag.focus();
        });
      }

      if (e == "编辑音频") {
        this.dialogTitle = "编辑音频";

        this.createForm.audio = item;
        this.folderBase = item.folderBase;
        this.dialogVisible = true;
      }
    },
    selectTempleHandle(item) {
      this.createForm.template = item.name;
      this.createForm.content = item.content;
    },
    uploadOk(e) {
      if (e == "UVAnim") {
        this.dialogVisible = false;
        this.RequestGetAllUVAnim();
      }
      if (e == "audio") {
        this.dialogVisible = false;

        let fromData = new FormData();
        let s = JSON.stringify(this.createForm.audio);
        fromData.append("fileToUpload", this.$stringtoBlob(s, "data.txt"));
        fromData.append("folderBase", this.folderBase);
        UploadAudioFile(fromData).then((res) => {
          console.log(" 上传文件 ", res);
          if (res.data == "SUCCESS") {
          }
        });
        if (this.dialogTitle == "上传音频") {
          this.audioList.push(this.createForm.audio);
        }
      }
    },

    handleBeforeUpload_audio(file) {
      this.fileList.push(file);
      console.log(file);
      if (this.loading) {
        return;
      }
      this.UploadFiles_audio(this.fileList[0]);
    },
    async UploadFiles_audio(file) {
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

      //上传到本地 或 0SS
      UploadAudioFile(fromData).then((res) => {
        console.log(" 上传音频完成 ", res);
        if (res.data == "SUCCESS") {
          this.createForm.audio.name = file.name;
          this.fileList.shift();
          this.loading = false;

          fromData = new FormData();
          let s = JSON.stringify(this.createForm.audio);
          fromData.append("fileToUpload", this.$stringtoBlob(s, "data.txt"));
          fromData.append("folderBase", this.folderBase);
          UploadAudioFile(fromData).then((res) => {
            console.log(" 上传音频数据文件 ", res);
            if (res.data == "SUCCESS") {
            }
          });
        }
      });
    },

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

      // const res = await this.$axios.post(
      //   '/upload',
      //   fromData
      // );

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

    handleBeforeUpload(file) {
      // if (this.fileSize) {
      //   const isLt = file.size / 1024 / 1024 < this.fileSize;
      //   if (!isLt) {
      //     this.SetErrorTip(`上传文件大小不能超过 ${this.fileSize} MB!`);
      //     return false;
      //   }
      // }
      this.fileList.push(file);

      console.log(file);

      if (this.loading) {
        return;
      }
      this.UploadFiles(this.fileList[0]);
    },

    async UploadFiles(file) {
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

      // const res = await this.$axios.post(
      //   '/upload',
      //   fromData
      // );

      // console.log("res", res);
      // this.fileList.shift();
      // this.loading = false;
      // if (this.fileList.length > 0) {
      //   this.UploadFiles(this.fileList[0]);
      // }
      // return;

      let fileName = file.name.toLowerCase();
      if (fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1) {
        this.modelName = file.name;
      }

      //上传到本地 或 0SS
      UploadHDRFile(fromData).then((res) => {
        console.log(" 上传文件 ", res);
        if (res.data == "SUCCESS") {
          this.fileList.shift();
          this.loading = false;
          if (this.fileList.length > 0) {
            this.UploadFiles(this.fileList[0]);
          } else {
            this.hdrUrl = this.folderBase + "/" + this.modelName;
          }
          // this.modelData.modelPath = this.folderBase + "/" + this.modelName;
          // this.updateModelTxtData();
        }
        // if (res.status == 200) {
        // }
        // //先记录旧照片
        // console.log("上传文件后的返回值", url);
      });
    },

    async RequestGetAllUVAnim() {
      this.uvAnimList.splice(0, this.uvAnimList.length);
      GetAllUVAnim().then((res) => {
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const element = txtDataList[i];
            this.uvAnimList.push(element);
          }
        }
      });
    },

    async RequestGetAllHDR() {
      GetAllHDR().then((res) => {
        // console.log("获取所有 hdr ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const element = txtDataList[i];
            if (element.includes("hdr")) {
              this.hdrList.push(element);
            } else {
              this.jpgList.push(element);
            }
          }
        }
      });
    },
    async RequestGetAllScene() {
      GetAllScene().then((res) => {
        console.log("获取所有 场景 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const scene = txtDataList[i];
            // let scene = JSON.parse(element);
            scene.icon = scene.folderBase + "/" + "thumb.jpg";
            this.sceneList.push(scene);
          }
        }
        console.log("获取所有 场景 2 ", this.sceneList);
      });

      GetAllGroup().then((res) => {
        console.log("获取所有 组合 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const scene = txtDataList[i];
            // let scene = JSON.parse(element);
            scene.icon = scene.folderBase + "/" + "thumb.jpg";
            this.groupList.push(scene);
          }
        }
      });

      GetAllAudio().then((res) => {
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const scene = txtDataList[i];
            // let scene = JSON.parse(element);
            this.audioList.push(scene);
          }
        }
        console.log("获取所有 音频 ", this.audioList);
      });
    },
    // 获取所有单品
    async RequestGetAllModel() {
      // const res = await this.$axios.get(
      //   "/getAllModel"
      // );
      // console.log("获取所有模型 ", res);

      // if (res.data.txtDataList) {
      //   let txtDataList = res.data.txtDataList;
      //   for (let i = 0; i < txtDataList.length; i++) {
      //     const element = txtDataList[i];
      //     this.modelsList.push(JSON.parse(element));
      //   }
      // }
      // return;

      GetAllModel().then((res) => {
        console.log("获取所有单品模型 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          let modelsList = [];
          for (let i = 0; i < txtDataList.length; i++) {
            let element = txtDataList[i];
            try {
              modelsList.push(JSON.parse(element));
            } catch (error) {
              element = element.substring(1);
              modelsList.push(JSON.parse(element));
            }
          }
          for (let i = 0; i < modelsList.length; i++) {
            const element = modelsList[i];
            
            element.icon = element.folderBase + "/" + "thumb.png";
            this.modelsList.push(element);
          }
        }
      });
    },
    SelectItem(type, item) {
      if (type == "audio") {
        this.dialogTitle = "编辑音频";
        this.dialogVisible = true;
      }
    },
    CreateNew(e) {
      this.createForm.title = e;
      this.createForm.modelName = "";
      console.log("点击新建 ", e);

      this.dialogVisible = true;
      if (e == "HDR") {
        this.dialogTitle = "上传" + e;
        this.folderBase = new Date().getTime();
        return;
      }
      if (e == "UVAnim") {
        this.dialogTitle = "上传图片";

        this.createForm.title = "";
        this.folderBase = new Date().getTime();
        return;
      }

      if (e == "audio") {
        this.dialogTitle = "上传音频";
        this.createForm.title = "";
        this.folderBase = new Date().getTime();
        this.createForm.audio = {
          modelType: "audio",
          folderBase: this.folderBase,
          tags: [],
        };
        return;
      }

      for (let i = 0; i < this.templateList.length; i++) {
        const item = this.templateList[i];
        if (item.title == e) {
          this.dialogTitle = "创建" + e;

          this.createTemplate = item.template;
          this.createForm.template = this.createTemplate[0].name;
          this.createForm.content = this.createTemplate[0].content;
        }
      }
    },
    CreateNewOK() {
      this.dialogVisible = false;

      // console.log(" 开始创建 ",this.createForm.title);
      // return;

      // 创建单品
      if (this.createForm.title == "单品") {
        let folderBase = new Date().getTime();
        let icon = folderBase + "/" + "thumb.png";
        let modelData = {
          name: this.createForm.modelName,
          icon: icon,
          modelType: this.createForm.template,
          folderBase: folderBase,
        };

        this.modelsList.push(modelData);
        //保存到后台
        let s = JSON.stringify(modelData);
        let fromData = new FormData();
        //服务器中的本地地址
        fromData.append("fileToUpload", this.$stringtoBlob(s, "data.txt"));
        fromData.append("folderBase", folderBase);
        this.$uploadFile(fromData).then((res) => {
          //先记录旧照片
          if (res.data == "SUCCESS") {
            console.log(" 上传模型数据文件成功 ");
          }
        });

        this.Editor(this.modelsList[this.modelsList.length - 1]);

        return;
      }

      // 创建场景
      if (this.createForm.title == "组合") {
        let folderBase = new Date().getTime();
        // let icon = folderBase + "/" + folderBase + "_thumb.jpg";
        let sceneData = {
          name: this.createForm.modelName,
          // icon: icon,
          modelType: this.createForm.template,
          folderBase: folderBase,
        };

        //保存到后台
        let s = JSON.stringify(sceneData);
        let fromData = new FormData();
        //服务器中的本地地址
        fromData.append("fileToUpload", this.$stringtoBlob(s, "data.txt"));
        fromData.append("folderBase", folderBase);
        UploadGroupFile(fromData).then((res) => {
          //先记录旧照片
          if (res.data == "SUCCESS") {
            console.log(" 上传 组合数据文件成功 ");
          }
        });

        this.groupList.push(sceneData);
        this.EditorGroup(this.groupList[this.groupList.length - 1]);
        return;
      }
      // 创建场景
      if (this.createForm.title == "场景") {
        let folderBase = new Date().getTime();
        // let icon = folderBase + "/" + folderBase + "_thumb.jpg";
        let sceneData = {
          name: this.createForm.modelName,
          // icon: icon,
          modelType: this.createForm.template,
          folderBase: folderBase,
        };

        //保存到后台
        let s = JSON.stringify(sceneData);
        let fromData = new FormData();
        //服务器中的本地地址
        fromData.append("fileToUpload", this.$stringtoBlob(s, "data.txt"));
        fromData.append("folderBase", folderBase);
        UploadSceneFile(fromData).then((res) => {
          //先记录旧照片
          if (res.data == "SUCCESS") {
            console.log(" 上传 场景数据文件成功 ");
          }
        });

        this.sceneList.push(sceneData);
        this.EditorScene(this.sceneList[this.sceneList.length - 1]);
        return;
      }

      return;
      //
      _Global.reloadTimes = 1;
      this.$router.push({
        path: "/editorScene",
      });
    },

    // 编辑
    Editor(item) {
      console.log(" 编辑 ", item);

      if (item.modelType == "Static Model") {
        item.modelType = "静态模型";
      }
      if (item.modelType == "Animation Model") {
        item.modelType = "动画模型";
      }
      if (item.modelType == "UV Animition Model") {
        item.modelType = "uv模型";
      }

      localStorage.setItem("modelType", item.modelType);
      localStorage.setItem("modelData", JSON.stringify(item));

      let path = "/editorSingle";
      if (item.modelType.includes("模型") || item.modelType.includes("Model")) {
        path = "/editorSingle";
      }
      _Global.reloadTimes = 1;
      // this.$router.push({
      //   path: path,
      // });

      // 新窗口 新标签
      let href = this.$router.resolve({
        name: path.replace("/", ""),
        query: {
          folderBase: item.folderBase,
        },
      });
      window.open(href.href, "_blank");
    },
    EditorScene(item) {
      console.log(" 编辑 ", item);

      // return;
      localStorage.setItem("modelType", item.modelType);
      localStorage.setItem("modelData", JSON.stringify(item));
      let path = "/editorScene";
      _Global.reloadTimes = 1;
      // this.$router.push({
      //   path: path,
      // });

      // 新窗口 新标签
      let href = this.$router.resolve({
        name: "editorScene",
        query: {
          folderBase: item.folderBase,
        },
      });
      window.open(href.href, "_blank");
    },
    EditorGroup(item) {
      console.log(" 编辑组合 ", item);

      // return;
      localStorage.setItem("modelType", item.modelType);
      localStorage.setItem("modelData", JSON.stringify(item));
      _Global.reloadTimes = 1;
      // this.$router.push({
      //   path: path,
      // });

      // 新窗口 新标签
      let href = this.$router.resolve({
        name: "editorGroup",
        query: {
          folderBase: item.folderBase,
        },
      });
      window.open(href.href, "_blank");
    },

    // 删除
    Delete(item) {},

    SelectScene(item) {
      localStorage.setItem("modelType", item.modelType);
      localStorage.setItem("modelData", JSON.stringify(item));
      this.folderBase = item.folderBase;
      this.selectSceneName = item.name;

      for (let i = 0; i < this.sceneList.length; i++) {
        const element = this.sceneList[i];
        if (element.name == item.name) {
          this.currentSceneData = element;
        }
      }
      this.infloating = true;
      return;
    },
    SelectModel(item) {
      this.Editor(item);
    },
    EnterScene() {
      // console.log("访问场景 ",localStorage.getItem("modelData"));
      // return;
      // 新窗口 新标签
      let href = this.$router.resolve({
        name: "editorVisit",
        query: {
          folderBase: this.folderBase,
        },
      });
      window.open(href.href, "_blank");
    },
    ChangeScene(sceneName) {},
  },
};
</script>

<style scoped>
.max-h-5\/6 {
  max-height: 83.3%;
}

.basis-10 {
  flex-basis: 10px;
  /* 40px */
}

.-z-10 {
  z-index: -10;
}

.z-999 {
  z-index: 999;
}

.bg-color {
  background: #28cad9;
}
</style>
