import Vue from './node_modules/vue/dist/vue.js'
import home from './src/home.vue'
import b from './src/b.js'

import "./src/test.less"

new Vue({
  el:'#app',
  template:`<div>
    <home></home>
  </div>`,
  data:{
    msgB:b
  },
  components:{
    home
  }
})