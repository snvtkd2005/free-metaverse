
import _YJTip from '../components/YJ-Tip.vue';    
// 定义插件对象
const YJTip = {};
// vue的install方法，用于定义vue插件
YJTip.install = function (Vue, options) {
  const YJTipInstance = Vue.extend(_YJTip);
  let currentMsg;
  const initInstance = () => {
    // 实例化vue实例
    currentMsg = new YJTipInstance();
    let msgBoxEl = currentMsg.$mount().$el;
    document.body.appendChild(msgBoxEl);
  };
  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$YJTip = {
    showMsgBox (options) {
      if (!currentMsg) {
        initInstance();
      }
      if (typeof options === 'string') {
        currentMsg.content = options;
      } else if (typeof options === 'object') {
        Object.assign(currentMsg, options);
      }
      return currentMsg.showMsgBox()
        .then(val => {
          currentMsg = null;
          return Promise.resolve(val);
        })
        .catch(err => {
          currentMsg = null;
          return Promise.reject(err);
        });
    }
  };
};
export default YJTip;