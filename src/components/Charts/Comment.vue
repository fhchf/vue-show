<template>
  <div class="comment-container">
    <div class="chart-comment" ref="commentRef"></div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  data() {
    return {
      commentInstance: null, // 图表实例
      chartData: null // 图表数据
    };
  },
  methods: {
    // 初始化
    initChart() {
      this.commentInstance = this.$echarts.init(this.$refs.commentRef);

      // 对图表初始的相关配置
      const initOption = {
        color: ['#83a2ed', '#7ad2ed', '#91dbb0', '#ffde94', '#d790be'],
        title: {
          top: '3%',
          left: '2%',
          text: '区域访问量',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        legend: {
          top: '3%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          top: '2%',
          feature: {
            saveAsImage: { type: 'png' },
            magicType: {
              type: ['line', 'bar']
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      };

      this.commentInstance.setOption(initOption);
      this.getChartData();
    },
    // 获取数据
    async getChartData() {
      const { data: ret } = await this.$http.get('./static/data/comment.json').catch(() => {
        this.$message.error('Comment 数据获取失败');
        return false;
      });

      this.chartData = ret;
      this.updataChart();
    },
    // 更新数据
    updataChart() {
      // 处理数据
      const shopArr = this.chartData.data.map(item => item.shop);
      const timeArr = this.chartData.common.time;
      const seriesArr = this.chartData.data.map((item, index) => {
        return {
          name: timeArr[index],
          type: 'line',
          smooth: true,
          emphasis: {
            focus: 'series'
          },
          data: item.data
        };
      });

      // 更新图表数据
      const dataOption = {
        legend: {
          data: timeArr,
          selected: {
            2018: false,
            2019: false
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: shopArr
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: seriesArr
      };
      this.commentInstance.setOption(dataOption);
    },
    // 屏幕适配
    screenAdapter() {
      this.commentInstance.resize();
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
.comment-container {
  width: 100%;
  height: 100%;

  .chart-comment {
    width: 100%;
    height: 100%;
  }
}
</style>
