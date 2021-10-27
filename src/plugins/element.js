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
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Descriptions,
  DescriptionsItem,
  Image,
  Empty,
  Timeline,
  TimelineItem,
  Loading
} from 'element-ui';

// ---------- 组件 ----------
// 按钮
Vue.use(Button);

// 表单相关
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);

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

// 选择器相关
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);

// 展示警告
Vue.use(Alert);

// 标签页相关
Vue.use(Tabs);
Vue.use(TabPane);

// 步骤条与时间线
Vue.use(Steps);
Vue.use(Step);
Vue.use(Timeline);
Vue.use(TimelineItem);

// 上传文件
Vue.use(Upload);

// 描述列表
Vue.use(Descriptions);
Vue.use(DescriptionsItem);

// 图片
Vue.use(Image);

// 点位提示
Vue.use(Empty);

Vue.use(Loading.directive);

// ---------- 通过原型进行挂载 ----------
// 消息提示
Vue.prototype.$message = Message;

// 弹框
Vue.prototype.$confirm = MessageBox.confirm;

// 加载
Vue.prototype.$loading = Loading.service;
