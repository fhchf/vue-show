<template>
  <div class="edit-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="$reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="edit-layout">
      <!-- 标题区域 -->
      <el-alert title="修改商品信息" type="warning" :closable="false" center> </el-alert>

      <!-- tab 区域 -->
      <el-form
        label-position="top"
        label-width="100px"
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
      >
        <el-tabs
          type="card"
          v-model="activeName"
          :before-leave="beforeTabLeave"
          @tab-click="tabclicked"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-descriptions border>
              <el-descriptions-item label="商品名称">
                <el-form-item prop="goods_name">
                  <el-input size="mini" v-model="editForm.goods_name"> </el-input>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="商品价格 (元)">
                <el-form-item prop="goods_price">
                  <el-input size="mini" v-model="editForm.goods_price"></el-input>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="商品重量">
                <el-form-item prop="goods_weight">
                  <el-input size="mini" v-model="editForm.goods_weight"></el-input>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="商品数量">
                <el-form-item prop="goods_number">
                  <el-input size="mini" v-model="editForm.goods_number"></el-input>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="商品分类">
                <el-form-item prop="cat_id">
                  <el-cascader
                    size="mini"
                    v-model="editForm.cat_id"
                    :options="catelist"
                    :props="cateProps"
                    @change="handleCascaderChange"
                  ></el-cascader>
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <!-- 动态参数 -->
          <el-tab-pane label="动态参数" name="1">
            <el-form-item
              v-for="item in this.manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  size="mini"
                  border
                  v-for="(subitem, i) in item.attr_vals"
                  :key="i"
                  :label="subitem"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 静态属性 -->
          <el-tab-pane label="静态属性" name="2">
            <el-descriptions border>
              <el-descriptions-item
                v-for="item in onlyTableData"
                :key="item.attr_id"
                :label="item.attr_name"
              >
                <el-input
                  size="mini"
                  maxlength="20"
                  show-word-limit
                  v-model="item.attr_vals"
                ></el-input>
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- 旧的图片预览 -->
            <el-card>
              <div class="img-layout">
                <div v-for="(item, i) in imgInfo" :key="i">
                  <el-image fit="cover" :src="item.url" :preview-src-list="srcList">
                    <div slot="placeholder" class="image-slot">加载中<span>...</span></div>
                  </el-image>
                </div>
              </div>
            </el-card>
            <!-- 删除图片 -->
            <el-card style="margin-top:15px">
              <el-tag
                type="warning"
                v-for="(item, i) in imgInfo"
                :key="i"
                closable
                @close="handleTagClose(i)"
              >
                删除第{{ i + 1 }}张图片</el-tag
              >
            </el-card>
            <!-- 上传新的图片 -->
            <el-card style="margin-top:15px">
              <el-upload
                drag
                multiple
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeImgUpload"
                :action="uploadURL"
                :headers="headersObj"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或点击上传</div>
                <div class="el-upload__tip" slot="tip">只能上传 jpg/png 文件，且不超过 2M</div>
              </el-upload>
            </el-card>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="editForm.goods_introduce"></quill-editor>
          </el-tab-pane>
          <!-- 修改商品 -->
          <el-tab-pane label="修改商品" name="5">
            <el-button @click="editGoods" disabled>修改商品</el-button>
            <el-empty description="暂无数据"></el-empty>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getGoodsByIdAPI,
  getCateListAPI,
  getCateAttrListAPI,
  putGoodsAPI
} from '@/api/goodsAPI.js';
import _ from 'lodash';

export default {
  name: 'Edit',
  data() {
    return {
      // 表单对象
      editForm: {},
      // 表单验证规则
      editFormRules: {
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
        cat_id: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
      },
      // 选中选项卡的 name
      activeName: '0',
      // 商品分类列表
      catelist: [],
      // 指定级联选择器的配置对象
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
      // 大图预览
      srcList: [],
      // 上传图片时的 URL 路径
      // uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      uploadURL: 'https://lianghj.top:8888/api/private/v1/upload',
      // 为上传图片设置请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片存放即时数组
      imgInfo: []
    };
  },
  methods: {
    // 在标签页即将切换时进行判断
    beforeTabLeave(activeName, oldActiveName) {
      if (
        oldActiveName === '0' &&
        (this.editForm.cat_id === '' || this.editForm.cat_id.length === 0)
      ) {
        this.$message.error('请先选择商品分类！');
        return false;
      }
    },
    // 监听 tab 被选中的事件
    async tabclicked() {
      if (this.activeName === '1') {
        const { data: res } = await getCateAttrListAPI({ id: this.editForm.cat_id, sel: 'many' });
        if (res.meta.status !== 200) this.$message.error('查询动态参数失败！');

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        });

        this.manyTableData = res.data;
      } else if (this.activeName === '2') {
        const { data: res } = await getCateAttrListAPI({ id: this.editForm.cat_id, sel: 'only' });
        if (res.meta.status !== 200) this.$message.error('查询静态属性失败！');

        this.onlyTableData = res.data;
      }
    },
    // 查询商品信息
    async getGoodsInfo() {
      const goodsId = window.sessionStorage.getItem('goods_id');
      const { data: res } = await getGoodsByIdAPI(goodsId);
      if (res.meta.status !== 200) this.$message.error('商品信息获取失败！');

      // 处理商品图片
      res.data.pics.forEach(item => {
        const imgInfo = {
          pic: item.pics_big,
          url: item.pics_big_url
        };
        this.srcList.push(item.pics_big_url);
        this.imgInfo.push(imgInfo);
      });

      this.editForm = res.data;
    },
    // 查询商品分类
    async getGoodsCateList() {
      const { data: res } = await getCateListAPI({ type: '' });
      if (res.meta.status !== 200) return this.$message.error('商品分类获取失败！');

      this.catelist = res.data;
    },
    // 处理商品分类级联选择器的变化
    handleCascaderChange() {
      if (this.editForm.cat_id.length === 3) {
        this.editForm.goods_cat = this.editForm.cat_id.join(',');
        return (this.editForm.cat_id = this.editForm.cat_id[2]);
      }
      return (this.editForm.cat_id = []);
    },
    // 在即将上传图片时的钩子
    beforeImgUpload(file) {
      const isTypeCorrect = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      const imgLimit5 = this.imgInfo.length < 5;

      if (!isTypeCorrect) {
        this.$message.warning('只能上传jpg/png格式的图片哦');
      }
      if (!isLt2M) {
        this.$message.warning('文件大小不能超过2M哦');
      }
      if (!imgLimit5) {
        this.$message.warning('最多只能上传5张哦');
      }
      return isTypeCorrect && isLt2M && imgLimit5;
    },
    // 移除已上传的图片的钩子
    handleRemove(file) {
      if (!file.type === '') {
        const filePath = file.response.data.tmp_path;
        const i = this.imgInfo.findIndex(item => item.pic === filePath);
        this.imgInfo.splice(i, 1);
        this.srcList.splice(i, 1);
      }
    },
    // 上传成功时的钩子
    handleSuccess(response) {
      const imgInfo = {
        pic: response.data.tmp_path,
        url: response.data.url
      };
      this.imgInfo.push(imgInfo);
      this.srcList.push(imgInfo.url);
    },
    // 监听移除新旧图片的 tag
    handleTagClose(i) {
      this.imgInfo.splice(i, 1);
      this.srcList.splice(i, 1);
    },
    // 预验证并修改商品信息
    editGoods() {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) return this.$message.error('请填写必要的表单项！');

        const form = _.cloneDeep(this.editForm);
        // 处理图片
        form.pics = [];
        this.imgInfo.forEach(item => {
          const temporaryImgInfo = {
            pic: item.pic
          };
          form.pics.push(temporaryImgInfo);
        });

        // 处理动态参数与静态属性
        // 当用户并没有修改参数时，使用原本的数据发送给服务器。反之，循环新的数据。
        form.attrs = [];
        if (this.manyTableData.length === 0 || this.onlyTableData.length === 0) {
          this.editForm.attrs.forEach(item => {
            const temporaryAttrs = {
              attr_id: item.attr_id,
              attr_value: item.attr_value
            };
            form.attrs.push(temporaryAttrs);
          });
        } else {
          this.manyTableData.forEach(item => {
            const temporaryAttrs = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            };
            form.attrs.push(temporaryAttrs);
          });
        }

        // 发起请求
        const { data: res } = await putGoodsAPI(form);
        if (res.meta.status !== 200) return this.$message.error('修改失败！');

        this.$message.success('修改成功！');
        this.$router.replace('/goods');
      });
    }
  },
  created() {
    this.getGoodsInfo();
    this.getGoodsCateList();
  }
};
</script>

<style lang="less" scope>
// 限制整个布局
.edit-layout {
  min-width: 900px;
}

// 边距
.edit-layout .el-tabs {
  margin-top: 15px;
}

// tab 样式
.edit-layout .el-tag {
  margin-right: 10px;
}

// 级联样式
.edit-layout .el-cascader--mini {
  width: 300px;
}

// 描述列表样式
.edit-layout .el-descriptions__title {
  font-weight: normal;
}

// 复选框样式
.edit-layout .el-checkbox {
  margin-right: 0;
}
.edit-layout .el-checkbox.is-bordered.is-checked {
  border-color: #91bfef;
}
.edit-layout .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #91bfef;
}
.edit-layout .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #91bfef;
  border-color: #91bfef;
}

// 处理图片样式
.img-layout {
  display: flex;
  height: 150px;
}
.img-layout > div {
  margin-right: 15px;
  height: 150px;
  background-clip: #fff;
  box-shadow: 0 0 4px 1px #eee;
  box-sizing: border-box;
}
.img-layout > div:last-child {
  margin-right: 0;
}
.el-image {
  height: 100%;
}
.image-slot {
  padding: 0 40px;
  color: #eee;
  text-align: center;
  line-height: 150px;
}

// 富文本编辑器样式
.edit-layout .ql-editor {
  min-height: 500px;
}
.edit-layout .ql-toolbar.ql-snow > span:last-child {
  display: none;
}
</style>
