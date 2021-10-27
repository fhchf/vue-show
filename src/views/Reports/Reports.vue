<template>
  <div class="reports-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { userSourceStatisticsAPI } from '@/api/reports.js';
import * as echarts from 'echarts';
import _ from 'lodash';

export default {
  name: 'Reports',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  methods: {
    // 解决跳转到首页后，左侧菜单还处于激活状态
    reload() {
      window.sessionStorage.removeItem('activePath');
      this.$router.push('/welcome');
      window.location.reload();
    }
  },
  async mounted() {
    const { data: res } = await userSourceStatisticsAPI();
    if (res.meta.status !== 200) return this.$message.error('获取图表数据失败！');
    const result = _.merge(res.data, this.options);

    // 在第一次渲染完dom元素后，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    // 使用指定的配置项和数据显示图表。
    myChart.setOption(result);
  }
};
</script>

<style lang="less" scope></style>
