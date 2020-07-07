import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import foodPage from '@/components/foodPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'Home',
      component: Home,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/foodPage',
      // name: 'foodPage',
      component: foodPage,
      meta: {
        keepAlive: true // 需要被缓存
      }
    }
  ]
})
