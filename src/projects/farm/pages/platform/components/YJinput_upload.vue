
// 开关按钮
<template>
  <!-- 顶部 -->
  <div class=" w-full h-full rounded-sm  flex" >
    <el-upload class="bg-transparent w-full h-full " action="" :before-upload="handleBeforeUpload" :accept="accept"
      :show-file-list="false">
      <div class="p-2 w-full cursor-pointer bg-gray-500
            hover:bg-546770">上传</div>
    </el-upload>

  </div>
</template>

<script>

export default {
  props: ["index", "scene", "fileName","folderBase", "accept", "callback"],
  components: {

  },
  data() {
    return {
    };
  },
  created() {

  },
  mounted() {

  },
  methods: {
    async handleBeforeUpload(file) {

      
      console.log(file);
      let fromData = new FormData();
      fromData.append("fileToUpload", file);
      fromData.append("folderBase", this.folderBase);
      fromData.append("fileName", this.fileName);
      if(this.fileName){

      }else{
        this.fileName = file.name;
      } 
      console.log(this.fileName,this.folderBase);
      // let sp = file.name.split('.');
      // let fileName = sp[0] + new Date().getTime()+ '.' + sp[1];
      // fromData.append("fileName", fileName );
      //上传到本地 或 0SS
      if (this.scene == "scene") {
        this.$UploadSceneFile(fromData).then((res) => {
          console.log(" 上传文件 ", res);
          if (res.data == "SUCCESS") {
            this.callback(this.index,this.fileName); 
          } 
        });
        return;
      }
      
      this.$UploadFile(fromData).then((res) => {
          console.log(" 上传文件 ", res);
          if (res.data == "SUCCESS") {
            this.callback( this.index,fileName); 
          } 
        });
    },

  },
};
</script>

<style scoped></style>
