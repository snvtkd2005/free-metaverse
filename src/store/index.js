


import {createStore} from 'vuex';

//创建一个新的store实例
const store =  createStore({
    state() {
        return {
            user: {
                name: '',
                //角色 0管理员 1普通用户
                role: 0,
            }
        }
    }, 
    //唯一一个可以修改state值的方法（同步执行）
    mutations: {
        updateUser(state, user) {
            state.user = user;
        }
    },
 
});

export default store;




























// import Vue from 'vue'
// import Vuex from 'vuex';
// Vue.use(Vuex);


// //全局state对象，用于保存所有组件的公共数据
// const state={
//     user:{
//         name:'',
//     }
// };

// //监听state对象的值的最新状态（计算属性）
// const getters={
//     getUser(state){
//         return state.user;
//     }
// };

// //唯一一个可以修改state值的方法（同步执行）
// const mutations={
//     updateUser(state,user){
//         state.user = user;
//     }
// };

// //异步执行mutations方法
// const actions={
//     asyncUpdateUser(context,user){
//         context.commit("updateUser",user);
//     }

// };

// export default new Vuex.Store({
//     // state,
//     // getters,
//     // mutations,
//     // actions

//     //全局state对象，用于保存所有组件的公共数据
//     state: {
//         user: {
//             name: '',
//         }
//     },

//     //监听state对象的值的最新状态（计算属性）
//     getters: {
//         getUser(state) {
//             return state.user;
//         }
//     },

//     //唯一一个可以修改state值的方法（同步执行）
//     mutations: {
//         updateUser(state, user) {
//             state.user = user;
//         }
//     },

//     //异步执行mutations方法
//     actions: {
//         asyncUpdateUser(context, user) {
//             context.commit("updateUser", user);
//         }

//     },
// })