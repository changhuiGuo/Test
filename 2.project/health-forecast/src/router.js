import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home/lineChart'
    },
    {
      path: '/home/setting',
      name: '大数据',
      component: ()=>import('./components/Setting.vue')
    },
    {
      path: '/home/lineChart',
      name: '折线图',
      component: ()=>import('./components/LineChart.vue')
    },
    {
      path: '/home/kChart',
      name: 'K线图',
      component: ()=>import('./components/KChart.vue')
    },
    {
      path: '/home/userInfo',
      name: '用户信息',
      component: ()=>import('./components/UserInfo.vue')
    }
  ]
})
