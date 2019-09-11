import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'
import App from '@/App'
import download from '@/components/download'
import register from '@/components/register'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base:'/sharedcloud/',
  routes: [
    {
      path: '/login',
      name: '登陆',
      component: login
    },
    {
      path:'/register',
      name:'注册页面',
      component:register
    },
    {
      path: '/index',
      name: '首页',
      component: App
    },
    {
      path: '/s/*',
      name: '下载页面',
      component: download
    },
    {
      path: '*',
      name: '首页',
      component: App
    },
  ]
})
