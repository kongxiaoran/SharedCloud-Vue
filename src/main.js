// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Main from './Main.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import VueContextMenu from '@xunlei/vue-context-menu'   //右击菜单组件

Vue.use(ElementUI) //使用elementUI
Vue.use(Antd)
Vue.use(VueContextMenu)

Vue.config.productionTip = false

var axios = require('axios')    //引用axios，并设置基础URL为后台服务api地址
axios.defaults.baseURL = 'http://47.102.218.124:7002/api/'
// axios.defaults.baseURL = 'http://localhost:7002/api/' 
// axios.defaults.withCredentials=true;          //携带cookie信息
axios.defaults.headers.post['ACCESS_TOKEN'] = sessionStorage.getItem("ACCESS_TOKEN")
Vue.prototype.$axios = axios    // 将API方法绑定到全局

/* eslint-disable no-new */
new Vue({
  el: '#main',
  router,
  components: { Main },
  template: '<Main/>'
})
