import Vue from './node_modules/vue/dist/vue.js'
// import home from './src/home.vue'
import b from './src/b.js'

new Vue({
  el:'#app',
  template:`<div>
    <h3>{{msgB}}</h3>
  </div>`,
  data:{
    msgB:b
  },
  components:{
    // home
  }
})