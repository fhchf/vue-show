<template>
  <div class="orders-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="$reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getOrdersList"
            @keyup.enter.native="getOrdersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table border stripe :data="orderList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" min-width="180px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.pay_status === 1">已付款</el-tag>
            <el-tag size="small" type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" min-width="120px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <el-tooltip
            class="item"
            effect="light"
            content="修改地址"
            placement="top"
            :enterable="false"
          >
            <el-button size="mini" icon="el-icon-edit" @click="editAddress"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            content="物流状态"
            placement="top"
            :enterable="false"
          >
            <el-button
              size="mini"
              icon="el-icon-location-outline"
              @click="LogisticsStatus"
            ></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <!-- 列表分页区域 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址区域 -- 对话框 -->
      <el-dialog
        width="40%"
        title="修改地址"
        :visible.sync="addressDialogVisible"
        :close-on-click-modal="false"
        @close="addressDialogClosed"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          resetFields
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address">
            <el-cascader
              style="width:100%"
              v-model="addressForm.address"
              :options="citydata"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailed_ddress">
            <el-input v-model="addressForm.detailed_ddress"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="addressDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addressDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 物流状态区域 -- 对话框 -->
      <el-dialog
        width="50%"
        title="物流状态"
        :visible.sync="LogisticsStatusDialogVisible"
        :close-on-click-modal="false"
      >
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrdersListAPI, getProgressInfoAPI } from '@/api/ordersAPI.js';
import citydata from './citydata.js';

export default {
  name: 'Orders',
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单数据列表
      orderList: [],
      total: 0,
      // 修改地址对话框可见
      addressDialogVisible: false,
      // 地址表单数据
      addressForm: {
        address: [],
        detailed_ddress: ''
      },
      // 地址表单验证规则
      addressFormRules: {
        address: [{ required: true, message: '请输入省市区/县', trigger: 'blur' }],
        detailed_ddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 省市区数据
      citydata: citydata,
      // 物流状态对话框可见
      LogisticsStatusDialogVisible: false,
      // 物流进度信息
      progressInfo: []
    };
  },
  methods: {
    // 获取订单数据列表
    async getOrdersList() {
      const { data: res } = await getOrdersListAPI(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error('订单数据列表获取失败！');

      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 每页显示条数发生改变时
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },
    // 页码发生改变时
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },
    // 显示修改地址
    editAddress() {
      this.addressDialogVisible = true;
    },
    // Dialog 关闭的回调
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 显示物流状态
    async LogisticsStatus() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading'
      });

      const { data: res } = await getProgressInfoAPI('1106975712662');
      if (res.meta.status !== 200) return this.$message.error('查询物流信息失败！');

      this.progressInfo = res.data;

      this.$nextTick(() => {
        loading.close();
        this.LogisticsStatusDialogVisible = true;
      });
    }
  },
  created() {
    this.getOrdersList();
  }
};
</script>

<style lang="less" scope></style>
