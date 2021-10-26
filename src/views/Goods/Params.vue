<template>
  <div class="params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告提示区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数哦！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>请选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="cateCascaderChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div style="margin: 0 48px">
                  <!-- 循环渲染 tag 标签 -->
                  <el-tag
                    closable
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    @close="handleClose(i, scope.row)"
                    >{{ item }}</el-tag
                  >
                  <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="showMessageBox(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div style="margin: 0 48px">
                  <!-- 循环渲染 tag 标签 -->
                  <el-tag
                    closable
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    @close="handleClose(i, scope.row)"
                    >{{ item }}</el-tag
                  >
                  <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="showMessageBox(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数区域 -- 对话框 -->
      <el-dialog
        width="30%"
        :title="'添加' + dialogTitle"
        :visible.sync="addDialogVisible"
        :close-on-click-modal="false"
        @close="addDivalogClose"
      >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item :label="dialogTitle" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="addDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addCateAttr">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑参数区域 -- 对话框 -->
      <el-dialog
        width="30%"
        :title="'编辑' + dialogTitle"
        :visible.sync="editDialogVisible"
        :close-on-click-modal="false"
        @close="editDivalogClose"
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item :label="dialogTitle" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="editDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="editCateAttr">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getCateListAPI,
  getCateAttrListAPI,
  postCateAttrAPI,
  getCateAttrByIdAPI,
  putCateAttrAPI,
  deleteCateAttrAPI
} from '@/api/goodsAPI.js';

export default {
  name: 'Params',
  data() {
    return {
      // 选中的商品分类 id
      selectedCateKeys: [],
      // 商品分类列表
      cateList: [],
      // 指定级联选择器的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中选项卡的 name
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 添加参数与属性的对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数与属性的表单数据
      addForm: {
        attr_name: ''
      },
      // 添加参数与属性的表单验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 1, max: 20, message: '名称长度在 1 到 20 个字符之间', trigger: 'blur' }
        ]
      },
      // 编辑参数与属性的对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑参数与属性的表单数据
      editForm: {},
      // 编辑参数与属性的表单验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 1, max: 20, message: '名称长度在 1 到 20 个字符之间', trigger: 'blur' }
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
      const { data: res } = await getCateListAPI({ type: '' });
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！');

      this.cateList = res.data;
    },
    // 监听级联选择的变化
    cateCascaderChange() {
      this.getParamsData();
    },
    // 监听选项卡的变化
    handleTabClick() {
      this.getParamsData();
    },
    // 获取分类参数的数据列表
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return false;
      }

      const { data: res } = await getCateAttrListAPI({ id: this.cateId, sel: this.activeName });
      if (res.meta.status !== 200) return this.$message.error('获取分类参数失败！');

      // 对每项数据进行遍历并将里面的 attr_vals 转换为数组，如果为空返回空数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        // 解决展开行中添加数据时所有的文本输入框都处于联动效果
        // 为每一项数据单独设立两个属性来控制文本框只属于当前项
        // 文本输入框的显示与隐藏
        item.inputVisible = false;
        // 文本输入框中所绑定的值
        item.inputValue = '';
      });

      switch (this.activeName) {
        case 'many':
          this.manyTableData = res.data;
          break;
        case 'only':
          this.onlyTableData = res.data;
          break;
        default:
          return false;
      }
    },
    // 监听添加参数与属性对话框的关闭
    addDivalogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 预验证并添加分类参数
    addCateAttr() {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) return false;

        const { data: res } = await postCateAttrAPI({
          id: this.cateId,
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 201) return this.$message.error('添加失败！');

        this.addDialogVisible = false;
        this.getParamsData();
        this.$message.success('添加成功！');
      });
    },
    // 监听编辑参数与属性对话框的关闭
    editDivalogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 显示编辑分类对话框并执行后续逻辑
    async showEditDialog(attr_id) {
      const { data: res } = await getCateAttrByIdAPI({
        id: this.cateId,
        attrId: attr_id,
        attr_sel: this.activeName
      });
      if (res.meta.status !== 200) return this.$message.error('查询数据失败！');
      this.editForm = res.data;

      this.editDialogVisible = true;
    },
    // 预验证并添加分类参数
    editCateAttr() {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) return false;

        const { data: res } = await putCateAttrAPI({
          id: this.cateId,
          attrId: this.editForm.attr_id,
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 200) return this.$message.error('修改失败！');

        this.editDialogVisible = false;
        this.getParamsData();
        this.$message.success('修改成功！');
      });
    },
    // 删除分类参数
    showMessageBox(attr_id) {
      this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteCateAttrAPI(this.cateId, attr_id);
          if (res.meta.status !== 200) return this.$message.error('删除失败！');

          this.getParamsData();
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
    },
    // 监听文本框的 keyup 与 blur 事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return false;
      }

      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;

      this.saveCateAttrVals(row);
    },
    // 展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      // $nextTick 方法的作用：当页面上元素被重新渲染之后，才会指定回调函数中的代码
      // 在 inputVisible 改为 true 时，此时 DOM 元素并没有生成，这个时候获取文本框将会导致失败。所以需要等元素被重新渲染完后在通过 ref 来获取元素
      // 类似于异步获取 DOM 的方法
      this.$nextTick(_ => {
        // 自动获取焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除分类参数子参数（tag 标签）
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);

      this.saveCateAttrVals(row);
    },
    // 修改分类参数子参数（tag 标签）
    async saveCateAttrVals(row) {
      const { data: res } = await putCateAttrAPI({
        id: this.cateId,
        attrId: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      });
      if (res.meta.status !== 200) return this.$message.error('更新失败！');
    }
  },
  // 计算属性
  computed: {
    // tab 中是否禁用 btn
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    // 当前选中的三级分类 id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }

      return null;
    },
    // 参数对话框的动态标题
    dialogTitle() {
      if (this.activeName === 'many') {
        return '动态参数';
      } else {
        return '静态属性';
      }
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="less" scope>
// 选择商品分类区域样式
.cat-opt {
  margin: 15px 0;

  span {
    font-size: 14px;
    color: #606266;
  }
}

// 展开行中输入的文本框样式
.el-table .input-new-tag {
  width: 120px;
}
</style>
