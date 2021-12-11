<template>
  <div class="ranking-container">
    <div class="chart-ranking" ref="rankingRef"></div>
  </div>
</template>

<script>
export default {
  name: 'Ranking',
  data() {
    return {
      rankingInstance: null, // 图表实例
      chartData: null // 图表数据
    };
  },
  methods: {
    // 初始化
    initChart() {
      this.rankingInstance = this.$echarts.init(this.$refs.rankingRef);

      const initOption = {
        color: ['#83a2ed', '#91dbb0', '#ffde94', '#fb9191', '#7ad2ed', '#d790be', '#ffa782'],
        title: {
          top: '3%',
          left: '2%',
          text: '本周销售排行',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top: '3%'
        },
        toolbox: {
          top: '2%',
          feature: {
            saveAsImage: { type: 'png' }
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
            type: 'category'
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      };

      this.rankingInstance.setOption(initOption);
      this.getChartData();
    },
    // 获取数据
    async getChartData() {
      const { data: ret } = await this.$http.get('./static/data/ranking.json').catch(() => {
        this.$message.error('Ranking 数据获取失败');
        return false;
      });

      this.chartData = ret;
      this.updataChart();
    },
    // 更新数据
    updataChart() {
      // 处理数据
      const shopArr = this.chartData.common.name;
      const seriesArr = this.chartData.data.map(item => {
        return {
          name: item.name,
          type: 'bar',
          data: item.data
        };
      });

      // 更新数据
      const dataOption = {
        xAxis: [
          {
            data: shopArr
          }
        ],
        series: seriesArr
      };

      this.rankingInstance.setOption(dataOption);
    },
    // 屏幕适配
    screenAdapter() {
      this.rankingInstance.resize();
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
.ranking-container {
  width: 100%;
  height: 100%;

  .chart-ranking {
    width: 100%;
    height: 100%;
  }
}
</style>
