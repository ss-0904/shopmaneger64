
import axios from 'axios'
import { Message } from 'element-ui';
const HttpServer = {}
HttpServer.install = function (Vue) {
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    
    // this.$http.get(url) -> 请求拦截处理 -> 发请求
    
    // 请求拦截器 -> 氢气发起之前自动触发
    axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么

        // 所有请求发起之后,进行筛查,请求标识是不是login
        // 如果是login,不要头部 -> 请求继续
        // 当请求标识不是login,就设置头部,再发起请求
        if (config.url !== "login") {
            const AUTH_TOKEN = localStorage.getItem("token");
            // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
            config.headers["Authorization"]=AUTH_TOKEN;
        }
        return config;
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      });

      // 响应拦截器
      axios.interceptors.response.use(function (response) {
        const {meta:{msg,status}}=response.data
        // 统一处理status非200和201的情况 -> 提示框
        if(status!==200 && status !==201){
          Message.warning(msg)
        }
        // 对响应数据做点什么
        return response;
      }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      });

    Vue.prototype.$http = axios
}

export default HttpServer
