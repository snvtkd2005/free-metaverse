

// import { createApp } from 'vue';
// import PopupConstructor from '../components/YJ-Dialog.vue';    
 
// let PopConstructor = Vue.extend(Dialog); // 返回一个“扩展实例构造器” 
let Confirm = (o,PoptDom) => {

  // let PoptDom = new PopConstructor({
  //   el: document.createElement('div') //将Pop组件挂载到新创建的div上 
  // })
  // document.body.appendChild(PoptDom.$el); //把Pop组件的dom添加到body里 

  // console.log(" 进入弹框 ");
  // console.log(PoptDom);

  // 标题
  PoptDom.visible = o.visible;
  PoptDom.title = o.title || '信息';
  // 内容
  PoptDom.content = o.content;

  PoptDom._cancel = o._cancel;
  PoptDom._ok = o._ok;
  // 弹框两个事件 确定 取消
  PoptDom.ok = o.ok || null;
  PoptDom.cancel = o.cancel || null;

  // PoptDom.a_ok = o.ok || null;
  // PoptDom.a_cancel = o.cancel || null;
}
export default Confirm; 


// let createMount  = (o) => {

//   const mountNode = document.createElement('div');
//   document.body.appendChild(mountNode);

//   const app = createApp(PopupConstructor, {
//       ...opts, modelValue: true,
//       remove() {
//           app.unmount(mountNode)
//           document.body.removeChild(mountNode)
//       }
//   })
//   return app.mount(mountNode)

// }

// function YJDialog(options = {}) {
//   options.id = options.id || 'yjDialog_' + generateId()
//   $inst = createMount(options)
  
//   return $inst
// }

// YJDialog.install = app => {
//   app.component('yjDialog', PopupConstructor)
//   // app.config.globalProperties.$v3popup = V3Popup
//   app.provide('yjDialog', YJDialog)
// }



// let PopConstructor = Vue.extend(Dialog); // 返回一个“扩展实例构造器” 
// let Confirm = (o) => {

//   let PoptDom = new PopConstructor({
//     el: document.createElement('div') //将Pop组件挂载到新创建的div上 
//   })
//   document.body.appendChild(PoptDom.$el); //把Pop组件的dom添加到body里 

//   // 标题
//   PoptDom.title = o.title || '信息';
//   // 内容
//   PoptDom.content = o.content;
//   // 弹框两个事件 确定 取消
//   PoptDom.a_determine = o.determine || null;
//   PoptDom.a_cancle = o.cancle || null;

// }
// export default Confirm; 