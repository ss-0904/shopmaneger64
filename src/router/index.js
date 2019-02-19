import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import { Message } from 'element-ui';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      }, {
        name: 'rights',
        path: '/rights',
        component: Rights
      }, {
        name: 'roles',
        path: '/roles',
        component: Roles
      }]
    }, {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if(to.name === 'login'){
    next()
  }else{
    const token = localStorage.getItem('token')
    if(!token){
      // this.$message.warning("请先登录!")
      Message.warning("请先登录")
      router.push({
        name:'login'
      })
      return
    }
    next()
  }
})

export default router
