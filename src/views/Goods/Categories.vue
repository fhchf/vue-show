<template>
  <div class="categories-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button @click="showAddCategoriesDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 商品分类列表区域 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        border
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-circle-check" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-circle-close" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="editGoodsCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button size="mini" icon="el-icon-delete" @click="deleteGoodsCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 列表分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类区域 -- 对话框 -->
      <el-dialog
        title="添加分类"
        width="35%"
        :visible.sync="addDialogVisible"
        :close-on-click-modal="false"
        @close="addCateDialogClosed"
      >
        <el-form
          label-width="100px"
          ref="addCateFormRef"
          :model="addCateForm"
          :rules="addCateFormRules"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader
              clearable
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="addDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改分类区域 -- 对话框 -->
      <el-dialog
        title="编辑分类"
        width="30%"
        :visible.sync="editDialogVisible"
        :close-on-click-modal="false"
        @close="editCateDialogClosed"
      >
        <el-form
          label-width="100px"
          ref="editCateFormRef"
          :model="editCateForm"
          :rules="editCateFormRules"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="editDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getCateListAPI,
  postGoodsCateAPI,
  deleteGoodsCateAPI,
  getGoodsCateByIdAPI,
  putGoodsCateAPI
} from '@/api/goodsAPI.js';

export default {
  name: 'Categories',
  data() {
    return {
      // 商品分类数据列表请求参数
      querInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      // 为 table 指定列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类的表单数据验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 8, message: '分类名称长度在 1 到 8 个字符之间', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的父级分类 id 数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑分类的表单数据
      editCateForm: {},
      // 编辑分类的表单数据验证规则对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 8, message: '分类名称长度在 1 到 8 个字符之间', trigger: 'blur' }
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
    },
    // 获取分类数据
    async getCateList() {
      const { data: res } = await getCateListAPI(this.querInfo);
      if (res.meta.status !== 200) return this.$message.error('商品分类数据获取失败！');

      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    // 监听每页显示多少条数据的变化
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听页码值的变化
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    // 显示添加分类对话框并执行后续逻辑
    async showAddCategoriesDialog() {
      const { data: res } = await getCateListAPI({ type: 2 });
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败！');

      this.parentCateList = res.data;
      this.addDialogVisible = true;
    },
    // 监听添加分类对话框的关闭
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 监听级联选择器的变化
    parentCateChange() {
      // 如果 selectedKeys 数组 length 大于 0，证明选中的是父级分类
      // 反之，没有选择任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类 id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        // 分类等级
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        // 父级分类 id
        this.addCateForm.cat_pid = 0;
        // 分类等级
        this.addCateForm.cat_level = 0;
      }
    },
    // 预验证并添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async vali => {
        if (!vali) return false;

        const { data: res } = await postGoodsCateAPI(this.addCateForm);
        if (res.meta.status !== 201) return this.$message.error('添加失败！');

        this.addDialogVisible = false;
        this.getCateList();
        this.$message.success('添加成功！');
      });
    },
    // 修改分类
    async editGoodsCate(id) {
      const { data: res } = await getGoodsCateByIdAPI(id);
      if (res.meta.status !== 200) return this.$message.error('查询分类数据失败！');

      this.editCateForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改分类对话框的关闭
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields();
    },
    // 预验证并修改分类
    editCate() {
      this.$refs.editCateFormRef.validate(async vali => {
        if (!vali) return false;

        const { data: res } = await putGoodsCateAPI(this.editCateForm);
        if (res.meta.status !== 200) return this.$message.error('更新失败！');

        this.editDialogVisible = false;
        this.getCateList();
        this.$message.success('更新成功！');
      });
    },
    // 删除分类
    deleteGoodsCate(id) {
      this.$confirm('此操作将永久删除该类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteGoodsCateAPI(id);
          if (res.meta.status !== 200) return this.$message.error('删除失败！');

          this.getCateList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="less" scope>
// 按钮样式
.zk-table .el-button--mini {
  padding: 7px 8px;
}
</style>
