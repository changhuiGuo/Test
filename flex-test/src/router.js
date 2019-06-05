import Vue from 'vue'
import VueRouter from 'vue-router'
import dice from './components/dice.vue'
import layout from './components/layout.vue'

Vue.use(VueRouter);
var router = new VueRouter({
  routes: [
    {path:'/',redirect:'/dice'},
    {path:'/dice',component:dice},
    {path:'/layout',component:layout}
  ]
})

export default router