<template>
  <div class="add-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center :closable="false"> </el-alert>

      <!-- 步骤条区域 -->
      <el-steps align-center :space="200" :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab 区域 -->
      <el-form
        class="add-layout"
        label-width="80px"
        ref="addFormRef"
        label-position="top"
        status-icon
        :rules="addFormRules"
        :model="addForm"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格 (元)" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleCateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeImgUpload"
              list-type="picture"
            >
              <el-button size="small">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传 jpg/png 文件，且不超过 2M
              </div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button style="margin-top: 15px" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 图片预览 -- 对话框 -->
      <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
        <img :src="this.previewPath" width="100%" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCateListAPI, getCateAttrListAPI, postGoodsAPI } from '@/api/goodsAPI.js';
import _ from 'lodash';

export default {
  name: 'Add',
  data() {
    return {
      // 步骤条与 tabs 的切换索引
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 用户所选择的分类 id 数组
        goods_cat: [],
        // 上传的图片 (对象)
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        // 商品的参数 包含动态参数和静态属性
        attrs: []
      },
      // 添加商品的表单验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 35, message: '名称长度在 2 到 35 个字符之间', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          {
            pattern: /^[\d]{1,6}$/,
            message: '商品价格输入的格式不正确哦',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          {
            pattern: /^[\u4e00-\u9fa5\w]{1,10}$/,
            message: '商品重量输入的格式不正确哦',
            trigger: 'blur'
          }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          {
            pattern: /^[\u4e00-\u9fa5\d]{1,5}$/,
            message: '商品数量输入的格式不正确哦',
            trigger: 'blur'
          }
        ],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
      },
      // 商品分类列表
      catelist: [],
      // 级联选择器的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 上传图片的 URL 地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片的 headers 请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览路径
      previewPath: '',
      // 预览对话框可见
      previewDialogVisible: false
    };
  },
  methods: {
    // 解决跳转到首页后，左侧菜单还处于激活状态
    reload() {
      window.sessionStorage.removeItem('activePath');
      this.$router.push('/welcome');
      window.location.reload();
    },
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await getCateListAPI({ type: '' });
      if (res.meta.status !== 200) return this.$message.error('分类数据获取失败！');

      this.catelist = res.data;
    },
    // 监听级联选择器的变化
    handleCateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 切换标签之前的钩子，若返回 false 则阻止切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！');
        return false;
      }
    },
    // 监听 tab 被选中的事件
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await getCateAttrListAPI({ id: this.cateId, sel: 'many' });
        if (res.meta.status !== 200) return this.$message.error('分类参数获取失败！');

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        });

        this.manyTableData = res.data;
      } else if (this.activeIndex === '2') {
        const { data: res } = await getCateAttrListAPI({ id: this.cateId, sel: 'only' });
        if (res.meta.status !== 200) return this.$message.error('分类属性获取失败！');

        this.onlyTableData = res.data;
      }
    },
    // 判断文件上传时的格式
    beforeImgUpload(file) {
      const isTypeCorrect = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      const imgLimit5 = this.addForm.pics.length < 5;

      if (!isTypeCorrect) {
        this.$message.warning('只能上传jpg/png文件哦');
      }
      if (!isLt2M) {
        this.$message.warning('图片大小不能超过2M哦');
      }
      if (!imgLimit5) {
        this.$message.warning('最多只能上传5张哦');
      }
      return isTypeCorrect && isLt2M && imgLimit5;
    },
    // 上传成功时的钩子
    handleSuccess(response) {
      const picInfo = {
        pic: response.data.tmp_path
      };
      this.addForm.pics.push(picInfo);
    },
    // 查看列表中已上传文件时的钩子
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },
    // 移除文件时的钩子
    handleRemove(file) {
      if (!file.raw.type === '') {
        const filePath = file.response.data.tmp_path;
        const i = this.addForm.pics.findIndex(item => item.pic === filePath);
        this.addForm.pics.splice(i, 1);
      }
    },
    // 预验证并添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) {
          this.$message.error('请先填写必要的表单项！');
          return false;
        }

        // 对整个表单的数据对象进行深拷贝
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(',');

        // 处理动态参数和静态属性
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          };
          this.addForm.attrs.push(newInfo);
        });
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;

        const { data: res } = await postGoodsAPI(form);
        if (res.meta.status !== 201) return this.$message.error('添加失败！');

        this.$message.success('添加成功！');
        this.$router.replace('/goods');
      });
    }
  },
  // 计算属性
  computed: {
    // 分类 ID
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="less" scope>
// form 表单的边距
.add-layout .el-form-item__content {
  padding-right: 40px;
}

// 复选框的边距
.add-layout .el-checkbox {
  margin: 0 10px 0 0 !important;
}

// 复选框的颜色
.add-layout .el-checkbox.is-bordered.is-checked {
  border-color: #91bfef;
}
.add-layout .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #91bfef;
}
.add-layout .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #91bfef;
  border-color: #91bfef;
}

// 图片上传时边距
.add-layout .el-upload-list {
  padding-right: 40px;
}

// 富文本编辑器样式
.add-layout .quill-editor {
  padding-right: 40px;
}
.add-layout .ql-editor {
  min-height: 500px;
}
.add-layout .ql-toolbar.ql-snow > span:last-child {
  display: none;
}
</style>
