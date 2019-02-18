import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },{
        name: 'rights',
        path: '/rights',
        component: Rights
      },{
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
