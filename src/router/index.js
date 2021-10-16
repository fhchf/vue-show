import Vue from 'vue'
import VueRouter from 'vue-router'
// import pathArr from '@/data/pathArr.json' // 需要判断的 hsch 地址

// 登录页
import Login from '@/views/Login/Login.vue'
// 首页
import Home from '@/views/Home/Home.vue'

Vue.use(VueRouter)

// 路由规则
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
// router.beforeEach((to, from, next) => {
//   if (pathArr.indexOf(to.path) !== -1) {
//     const token = window.sessionStorage.getItem('token')
//     token ? next() : next('/login')
//   } else {
//     next()
//   }
// })
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()

  const token = window.sessionStorage.getItem('token')
  token ? next() : next('/login')
})

export default router
