<template>
  <div class="rights-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 权限列表区域 -->
      <el-table :data="rightsList" id="table-content">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsListAPI } from '@/api/rightsAPI.js';

export default {
  name: 'Rights',
  data() {
    return {
      // 权限列表
      rightsList: []
    };
  },
  methods: {
    // 解决跳转到首页后，左侧菜单还处于激活状态
    reload() {
      window.sessionStorage.removeItem('activePath');
      this.$router.push('/welcome');
      window.location.reload();
    },
    // 获取权限列表（列表形式）
    async getRightsList() {
      const { data: res } = await getRightsListAPI('list');
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！');

      this.rightsList = res.data;
    }
  },
  created() {
    this.getRightsList();
  }
};
</script>

<style lang="less" scope>
// 修改 table 默认边距
#table-content .el-table__cell {
  padding: 0;
}

#table-content .has-gutter th {
  padding: 12px 0;
}
</style>
