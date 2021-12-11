<template>
  <div class="sources-container">
    <div class="chart-sources" ref="sourcesRef"></div>
  </div>
</template>

<script>
import { userSourceStatisticsAPI } from '@/api/reports.js';
import _ from 'lodash';

export default {
  name: 'Sources',
  data() {
    return {
      sourcesInstance: null, // 图表实例
      initData: null // 初始数据
    };
  },
  methods: {
    // 初始化
    initChart() {
      this.sourcesInstance = this.$echarts.init(this.$refs.sourcesRef);

      const initOption = {
        color: ['#d790be', '#ffde94', '#7ad2ed', '#91dbb0', '#83a2ed'],
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#7e7e7e'
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
      };

      this.initData = initOption;
      this.getChartData();
    },
    // 获取数据
    async getChartData() {
      const { data: ret } = await userSourceStatisticsAPI();
      if (ret.meta.status !== 200) return this.$message.error('获取图表数据失败！');

      this.updataChart(ret.data);
    },
    // 更新数据
    updataChart(data) {
      const dataOption = _.merge(data, this.initData);
      this.sourcesInstance.setOption(dataOption);
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>

<style lang="less" scope>
.sources-container {
  width: 100%;
  height: 100%;

  .chart-sources {
    width: 750px;
    height: 400px;
  }
}
</style>
