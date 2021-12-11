<template>
  <div class="welcome-container">
    <!-- 小方块区域 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in blockData" :key="item.id">
        <el-card>
          <div :class="['spannel', 'scolor' + index]">
            <em>{{ item.statistics }}</em
            ><span>{{ item.unit }}</span>
            <b>{{ item.name }}</b>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 折线与饼图区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <div style="height: 400px"><Comment></Comment></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div style="height: 400px"><Turnover></Turnover></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 柱状图区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <div style="height: 400px"><Ranking></Ranking></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Comment from '@/components/Charts/Comment.vue';
import Turnover from '@/components/Charts/Turnover.vue';
import Ranking from '@/components/Charts/Ranking.vue';

export default {
  name: 'Welcome',
  components: {
    Comment,
    Turnover,
    Ranking
  },
  data() {
    return {
      blockData: null // 小方块数据
    };
  },
  methods: {
    // 获取数据
    async getBlockData() {
      const { data: ret } = await this.$http.get('./static/data/statistics.json').catch(() => {
        this.$message.error('Statistics 数据获取失败');
        return false;
      });

      this.handleData(ret);
    },
    // 处理数据
    handleData(ret) {
      Object.keys(ret).map(key => {
        let current = String(ret[key].statistics);
        current = current.slice(0, -3) + ',' + current.slice(-3);
        ret[key].statistics = current;
      });

      this.blockData = ret;
    }
  },
  created() {
    this.getBlockData();
  }
};
</script>

<style lang="less" scope>
.welcome-container .el-card__body {
  padding: 0;
}

// 小方块区域样式
.spannel {
  position: relative;
  height: 100px;
  overflow: hidden;
  text-align: center;

  em {
    display: inline-block;
    margin: 10px 0 0 20px;
    font-family: 'Arial';
    font-size: 40px;
    line-height: 50px;
    opacity: 0.8;
  }

  span {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
  }

  b {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    font-size: 14px;
    line-height: 24px;
    color: #7c7c7c;
    font-weight: normal;
    background-color: #f9f9f9;
  }
}

.scolor0 em,
.scolor0 span {
  color: #83a2ed;
}

.scolor1 em,
.scolor1 span {
  color: #7ad2ed;
}

.scolor2 em,
.scolor2 span {
  color: #d790be;
}
.scolor3 em,
.scolor3 span {
  color: #91dbb0;
}
</style>
