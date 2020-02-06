import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    incomeData: [],
    scrollTop: 0
  },
  mutations: {
    setIncomeData(state,payload){
      state.incomeData = payload.map(item=>{ 
        item['总计'] = 0;
        for(var key in item){
          if(key!='月份'&&key!='单位'){
            key!='总计' ? item['总计'] += item[key] : ''
          }
        }
        return item
      })
    },
    getScrollTop(state,payload){
      state.scrollTop = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
