<template>
  <div style="display: flex">
    <!-- 这个是生成海报或者是截图 -->
    <div class="box-img">
      <h1>来截图 生成海报</h1>
      <div id="capture" style="background: #f5da55">
        <h4 style="color: #000">Hello world!</h4>
      </div>
      <button @click="screenshotHandler">截图</button>
    </div>
  </div>
</template>
<script setup lang="ts">
// 这个是截图工具
import html2canvas from "html2canvas";
import { ref } from "vue";
function screenshotHandler() {
  html2canvas(document.body).then(function (canvas) {
    let a = document.createElement("a");
    // 将 canvas  方法返回一个包含图片展示的 data URI 。可以使用 type
    // 参数其类型，默认为 PNG 格式。图片的分辨率为96dpi。
    a.href = canvas.toDataURL("image/png", 1.0);
    //将 a 标签插入到页面中
    document.body.appendChild(a);
    //download 下载图片
    a.download = canvas.toDataURL("image/png", 1.0);
    // 模拟a标签的点击事件
    var e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    a.dispatchEvent(e);
    // 这是向 body 追加自己截的图
    // document.body.appendChild(canvas);
  });
}
</script>
<style>
.box-img {
  width: 400px;
  height: 200px;
  background-color: rgb(26, 228, 202);
}
.warp-box {
  width: 400px;
  height: 200px;
  background-color: pink;
}
</style>

