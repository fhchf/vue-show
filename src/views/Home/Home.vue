<template>
  <el-container class="home-container">
    <!-- Header 区域 -->
    <el-header>
      <div>
        <a href="javascript:;" @click="reload"
          ><img src="../../assets/img/header_logo.png" title="Hello world."
        /></a>
        <span>與簌小卖部后台管理系统</span>
      </div>
      <div>
        <!-- <el-button type="info" size="mini" @click="logout">退出登录</el-button> -->
        <el-menu mode="horizontal" text-color="#444" active-text-color="#fec28e">
          <el-submenu index="1">
            <template slot="title">我的工作台</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-submenu>
          <el-menu-item index="2" @click="logout">退出登录</el-menu-item>
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
          <div class="toggle-button" @click="toggleMenu"></div>
          <!-- 一级菜单 -->
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
      activePath: ''
    };
  },
  methods: {
    // 解决跳转到首页后，左侧菜单还处于激活状态
    reload() {
      window.sessionStorage.removeItem('activePath');
      this.$router.push('/welcome');
      window.location.reload();
    },
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
    },
    // 保存菜单栏激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
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
.el-aside .el-submenu__title:hover,
.el-aside .el-menu-item:hover {
  color: #fec28e;
  background-color: transparent;
  transition: all 0.3s;
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
  background-color: #eee;
  color: #303133;
  cursor: pointer;
}
</style>
