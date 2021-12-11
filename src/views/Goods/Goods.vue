<template>
  <div class="goods-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="$reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
            @keyup.enter.native="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table border stripe :data="goodsList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="600px"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          min-width="100px"
        ></el-table-column>
        <el-table-column prop="goods_number" label="商品数量"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" min-width="150px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row.goods_id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 列表分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsListAPI, deleteGoodsAPI } from '@/api/goodsAPI.js';

export default {
  name: 'Goods',
  data() {
    return {
      // 获取商品列表时的查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表数据
      goodsList: [],
      // 总共商品条数
      total: 0
    };
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await getGoodsListAPI(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error('商品列表获取失败！');

      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听 条/页数据变化(每页显示条数) 的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听 页码值变化 的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 修改商品
    editGoods(id) {
      window.sessionStorage.setItem('goods_id', id);
      this.$router.push('goods/edit');
    },
    // 删除商品
    deleteGoods(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteGoodsAPI(id);
          if (res.meta.status !== 200) return this.$message.error('删除失败！');

          this.getGoodsList();
          this.$message.success('删除成功!');
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    goAddPage() {
      this.$router.push('/goods/add');
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style lang="less" scope></style>
