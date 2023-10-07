/**
 * Created by Administrator on 2019/8/25.
 */

//import Vue from '../vue/vue';
//import App from '../vue/YJ/App.vue';
//
document.write("<script  src='vue/vue.js'></script>");
//Vue.config.productionTip = true;
//
var vm = new Vue({
    el: '#app',
    data: {
        name : "模型名",
        content : "模型详细介绍"
    },
    methods:{ //按钮添加事件
        ChangeModel :function(e){
            this.name = e;
            console.log(this.name);
        }
    }
});

console.log(" 哈哈哈哈哈 ===========" + vm.name );

//new Vue({
//    render: h => h(App)
//}).$mount('#app');


function callmodeilItem(e){
    console.log(" in call by selectmodel " + e);
    change(e);
}

function change(e){
    //vm.name  = e;
    //vm.ChangeModel(e) ;
    //console.log(vm);
    change22(e);
}