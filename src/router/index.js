import Vue from 'vue';
import VueRouter from 'vue-router';
// import pathArr from '@/data/pathArr.json' // 需要判断的 hsch 地址 /** 已废弃 */

// 登录
import Login from '@/views/Login/Login.vue';

// 首页
import Home from '@/views/Home/Home.vue';
import Welcome from '@/views/Home/Welcome.vue';

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
      {
        path: '/welcome',
        component: Welcome
      },
      // 用户管理模块
      {
        path: '/users',
        component: () => import('@/views/User/Users.vue')
      },
      // 权限管理模块
      {
        path: '/rights',
        component: () => import('@/views/Rights/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('@/views/Rights/Roles.vue')
      },
      // 商品管理模块
      {
        path: '/goods',
        component: () => import('@/views/Goods/Goods.vue')
      },
      {
        path: '/goods/add',
        component: () => import('@/views/Goods/Add.vue')
      },
      {
        path: '/goods/edit',
        component: () => import('@/views/Goods/Edit.vue')
      },
      {
        path: '/params',
        component: () => import('@/views/Goods/Params.vue')
      },
      {
        path: '/categories',
        component: () => import('@/views/Goods/Categories.vue')
      },
      // 订单管理模块
      {
        path: '/orders',
        component: () => import('@/views/Orders/Orders.vue')
      },
      // 数据统计模块
      {
        path: '/reports',
        component: () => import('@/views/Reports/Reports.vue')
      }
    ]
  },
  // Error 404
  { path: '*', component: () => import('@/views/Error/404.vue') }
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
