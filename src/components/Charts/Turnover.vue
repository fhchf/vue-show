<template>
  <div class="turnover-container">
    <div class="chart-turnover" ref="turnoverRef"></div>
  </div>
</template>

<script>
export default {
  name: 'Turnover',
  data() {
    return {
      turnoverInstance: null, // 图表实例
      chartData: null // 图表数据
    };
  },
  methods: {
    // 初始化
    initChart() {
      this.turnoverInstance = this.$echarts.init(this.$refs.turnoverRef);

      // 对图表初始的相关配置
      const initOption = {
        color: ['#83a2ed', '#7ad2ed', '#91dbb0', '#ffde94', '#d790be'],
        title: {
          left: 'center',
          top: '25%',
          text: '各年份成交额（￥）',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          top: '23.5%',
          feature: {
            saveAsImage: { type: 'png' }
          }
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            top: '35%',
            radius: ['40%', '55%'],
            avoidLabelOverlap: false,
            labelLine: {
              show: true
            }
          }
        ]
      };

      this.turnoverInstance.setOption(initOption);
      this.getChartData();
    },
    // 获取数据
    async getChartData() {
      const { data: ret } = await this.$http.get('./static/data/turnover.json').catch(() => {
        this.$message.error('Turnover 数据获取失败');
        return false;
      });

      this.chartData = ret;
      this.updataData();
    },
    // 更新数据
    updataData() {
      // 处理数据
      const turnoverArr = this.chartData.children;

      const dataOption = {
        series: [
          {
            name: this.chartData.name,
            data: turnoverArr
          }
        ]
      };

      this.turnoverInstance.setOption(dataOption);
    },
    // 屏幕适配
    screenAdapter() {
      this.turnoverInstance.resize();
    }
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.screenAdapter);
  },
  destroyed() {
    // 解绑事件
    window.removeEventListener('resize', this.screenAdapter);
  }
};
</script>

<style lang="less" scope>
.turnover-container {
  width: 100%;
  height: 100%;

  .chart-turnover {
    width: 100%;
    height: 100%;
  }
}
</style>
