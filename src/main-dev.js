import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './plugins/element.js';

// 全局样式表
import '@/assets/css/global.css';
// 字体图标
import '@/assets/fonts/iconfont.css';
// 表格-树状结构组件
import TreeTable from 'vue-table-with-tree-grid';
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

// Axios
import axios from 'axios';

// ECharts 图表
import * as echarts from 'echarts';

Vue.prototype.$http = axios;

Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

Vue.component('tree-table', TreeTable);
Vue.use(VueQuillEditor);

// 全局过滤器 --- 格式化时间
Vue.filter('dateFormat', originVal => {
  const dt = new Date(originVal * 1000);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

// 解决跳转到首页后，左侧其余菜单还处于激活状态
Vue.prototype.$reload = () => {
  window.sessionStorage.setItem('activePath', '/welcome');
  router.push('/welcome');
  window.location.reload();
};

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
