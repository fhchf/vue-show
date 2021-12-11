<template>
  <div class="reports-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="$reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <Sources></Sources>
    </el-card>
    <el-card style="margin-top: 20px">
      <router-link
        to="/dataMonitoringSystem"
        style="margin-left: 5px;text-decoration: none;color: #d790be;"
        >数据监控系统 - Let's go</router-link
      >
    </el-card>
  </div>
</template>

<script>
import Sources from '@/components/Charts/Sources.vue';

export default {
  name: 'Reports',
  components: {
    Sources
  }
};
</script>

<style lang="less" scope></style>
