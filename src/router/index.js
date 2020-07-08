import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import foodPage from '@/components/foodPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      // mode: 'history',
      path: '/',
      // name: 'Home',
      component: Home,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      // mode: 'history',
      path: '/foodPage',
      // name: 'foodPage',
      component: foodPage,
      meta: {
        keepAlive: false // 需要被缓存
      }
    }
  ]
})
