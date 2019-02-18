// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import App from './App'
import CusBread from '@/components/CusBread.vue'
import HttpServer from '@/http.js'
import router from './router'
import moment from 'moment'

Vue.use(HttpServer)

Vue.use(ElementUI)
Vue.config.productionTip = false

// 全局过滤器 - 处理日期格式
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.component(CusBread.name, CusBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
