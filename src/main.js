import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './plugins/element.js';

// 全局样式表
import '@/assets/css/global.css';
// 字体图标
import '@/assets/fonts/iconfont.css';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
