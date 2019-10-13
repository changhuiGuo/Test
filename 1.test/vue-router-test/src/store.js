import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    list: [],
    msg: 'hello'
  },
  mutations:{
    add(state,payload){
      state.list.push({msg:state.list.length});
    },
    sub(state,payload){
      state.list.splice(payload,1);
    }
  },
  actions:{
    add(context,payload){
      context.commit('add',payload);
    },
    sub(context,payload){
      context.commit('sub',payload);
    },
  }
})