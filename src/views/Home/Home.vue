<template>
  <el-container class="home-container">
    <!-- 返回顶部 -->
    <el-backtop :bottom="60">
      <div
        style="{
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 40px;
        color: #d790be;
        font-size: 16px;
      }"
      >
        UP
      </div>
    </el-backtop>

    <!-- Header 区域 -->
    <el-header>
      <div>
        <a href="javascript:;" @click="$reload"
          ><img src="../../assets/img/header_logo.png" title="Hello world."
        /></a>
        <span>與簌小卖部后台管理系统</span>
      </div>
      <div>
        <el-menu
          mode="horizontal"
          text-color="#444"
          active-text-color="#fec28e"
          show-timeout="0"
          hide-timeout="0"
          router
        >
          <el-submenu index="1">
            <template slot="title">我的工作台</template>
            <el-menu-item index="userCenter"><i class="el-icon-user"></i>个人中心</el-menu-item>
            <el-menu-item index="myNews"
              ><i class="el-icon-chat-line-square"></i>我的消息</el-menu-item
            >
            <el-menu-item index="toDoList"><i class="el-icon-date"></i>待办事项</el-menu-item>
          </el-submenu>
          <el-menu-item @click="logout">退出登录</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <!-- Aside 区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          router
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <!-- 是否折叠菜单 -->
          <div class="toggle-button" @click="toggleMenu">
            {{ openInfo }}
          </div>
          <!-- 一级菜单 -->
          <el-menu-item index="/welcome" @click="saveNavState('/welcome')">
            <i class="el-icon-s-shop"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu v-for="item in menusList.data" :index="item.id + ''" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subitem in item.children"
              :index="'/' + subitem.path"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
              ><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- Main 区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenusListAPI } from '@/api/rightsAPI.js';

export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单列表数据
      menusList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠菜单
      isCollapse: false,
      // 侧栏激活状态
      activePath: '',
      // 是否打开展开信息
      isOpen: true
    };
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear('token');
      this.$router.replace('login');
    },
    // 获取左侧菜单
    async getMenusList() {
      const { data: res } = await getMenusListAPI();
      if (res.meta.status !== 200) return this.$message.error('获取菜单列表失败！');

      this.menusList = res;
    },
    // 是否折叠收起菜单
    toggleMenu() {
      this.isCollapse = !this.isCollapse;
      this.isOpen = !this.isOpen;
      this.asideResize();
    },
    // 保存菜单栏激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    },
    // 触发浏览器窗口的 resize 事件
    // 解决 Echarts 的宽度不能随着父元素自动适应
    asideResize() {
      setTimeout(() => {
        const myEvent = new Event('resize');
        window.dispatchEvent(myEvent);
      }, 500);
    }
  },
  computed: {
    // 计算展开信息
    openInfo() {
      if (this.isOpen) {
        return '展开/收起';
      }
      return '';
    }
  },
  created() {
    this.getMenusList();
    this.activePath = window.sessionStorage.getItem('activePath');
  }
};
</script>

<style lang="less" scope>
/**
 * 当前组件全局样式
 */
.home-container {
  margin: 0 5%;
  height: 100%;

  .el-backtop:hover {
    background-color: #fff;
  }
}

/**
 * Header 区域
 */
.home-container .el-header {
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dbdbdb;

  div:first-child {
    display: flex;
    align-items: center;

    img {
      padding: 3px;
      width: 40px;
      height: 40px;
      border: 1px solid #dbdbdb;
      box-sizing: border-box;
    }

    span {
      padding-left: 10px;
      color: #444;
      font-weight: 400;
    }
  }
}
// 水平菜单激活样式
.el-header .el-menu-item.is-active,
.el-header .el-submenu__title {
  color: #444 !important;
}

/**
 * 侧边栏区域
 */
.el-aside {
  overflow: hidden !important;
  border-right: 1px solid #dbdbdb;
  transition: width 0.5s;
}

// Menus 样式
.el-aside .el-menu {
  border-right: none;
}

.el-aside .el-submenu__title,
.el-aside .el-menu-item {
  background-color: transparent;
  transition: all 0.8s;
}

// Menus 鼠标经过的样式
.home-container {
  .el-aside .el-submenu__title:hover,
  .el-aside .el-menu-item:hover,
  .el-menu-item:focus,
  .el-menu-item:hover {
    color: #fec28e;
    background-color: transparent;
    transition: all 0.3s;
  }

  // welcome 一级菜单单独的样式
  .el-icon-s-shop {
    margin-right: 0 !important;
    margin-left: -4px !important;
    padding-right: 6px;
  }
}

// Menus 激活状态中的样式
.el-aside .el-menu-item.is-active {
  color: #fec28e;
  background-color: transparent;
}

.iconfont {
  padding-right: 10px;
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  font-size: 12px;
  color: #d1d1d1;
  background-color: #f9f9f9;
  cursor: pointer;
}
</style>
