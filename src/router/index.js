import Vue from 'vue';
import VueRouter from 'vue-router';
// import pathArr from '@/data/pathArr.json' // 需要判断的 hsch 地址 /** 已废弃 */

// 登录模块
import Login from '@/views/Login/Login.vue';

// 首页模块
import Home from '@/views/Home/Home.vue';
import Welcome from '@/views/Home/Welcome.vue';

// 用户管理模块
import Users from '@/views/User/Users.vue';

// 权限管理模块
import Rights from '@/views/Rights/Rights.vue';
import Roles from '@/views/Rights/Roles.vue';

// 商品管理模块
import Goods from '@/views/Goods/Goods.vue';
import Params from '@/views/Goods/Params.vue';
import Categories from '@/views/Goods/Categories.vue';

// Error 404
import Error404 from '@/views/Error/404.vue';

Vue.use(VueRouter);

// 路由规则
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: () => import('@/views/Goods/Add.vue') },
      { path: '/goods/edit', component: () => import('@/views/Goods/Edit.vue') },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/orders', component: () => import('@/views/Orders/Orders.vue') }
    ]
  },
  { path: '*', component: Error404 }
];

const router = new VueRouter({
  routes
});

// 全局前置守卫  /** 已废弃 */
// router.beforeEach((to, from, next) => {
//   if (pathArr.indexOf(to.path) !== -1) {
//     const token = window.sessionStorage.getItem('token')
//     token ? next() : next('/login')
//   } else {
//     next()
//   }
// })

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();

  const token = window.sessionStorage.getItem('token');
  token ? next() : next('/login');
});

export default router;
