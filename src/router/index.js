import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'


const Login = () => import( '@/components/login.vue')
const Home = () => import( '@/components/home.vue')
const Users = () => import( '@/components/users.vue')
const Rights = () => import( '@/components/rights.vue')
const Roles = () => import( '@/components/roles.vue')
const Goodsadd = () => import( '@/components/goodsadd.vue')
const Goodslist = () => import( '@/components/goodslist.vue')
const Cateparams = () => import( '@/components/cateparams.vue')
const Goodscate = () => import( '@/components/goodscate.vue')
const Order = () => import( '@/components/order.vue')
const Reports = () => import( '@/components/reports.vue')

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
      }, {
        name: 'goods',
        path: '/goods',
        component: Goodslist
      }, {
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodsadd
      }, {
        name: 'params',
        path: '/params',
        component: Cateparams
      }, {
        name: 'categories',
        path: '/categories',
        component: Goodscate
      }, {
        name: 'orders',
        path: '/orders',
        component: Order
      }, {
        name: 'reports',
        path: '/reports',
        component: Reports
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
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      // this.$message.warning("请先登录!")
      Message.warning("请先登录")
      router.push({
        name: 'login'
      })
      return
    }
    next()
  }
})

export default router
