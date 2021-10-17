import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Aside,
  Header,
  Main,
  Menu,
  Submenu,
  MenuItem
} from 'element-ui'

Vue.use(Button)

// 表单相关
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 主体布局
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)

// 侧边栏相关
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.prototype.$message = Message
