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
      component: Home
    },
    {
      path: '/foodPage',
      // name: 'foodPage',
      component: foodPage
    }
  ]
})
