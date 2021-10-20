import Vue from 'vue';
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
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui';

// ---------- 组件 ----------
// 按钮
Vue.use(Button);

// 表单相关
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

// 主体布局
Vue.use(Container);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);

// 侧边栏相关
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);

// 面包屑
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);

// 卡片面板
Vue.use(Card);

// 栅格布局
Vue.use(Row);
Vue.use(Col);

// 表格
Vue.use(Table);
Vue.use(TableColumn);

// 开关
Vue.use(Switch);

// 文字提示
Vue.use(Tooltip);

// 分页
Vue.use(Pagination);

// 对话框
Vue.use(Dialog);

// 标签
Vue.use(Tag);

// 树形控件
Vue.use(Tree);

// 选择器
Vue.use(Select);
Vue.use(Option);

// ---------- 通过原型进行挂载 ----------
// 消息提示
Vue.prototype.$message = Message;

// 弹框
Vue.prototype.$confirm = MessageBox.confirm;
