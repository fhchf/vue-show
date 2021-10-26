<template>
  <div class="users-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a href="javascript:;" @click="reload">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userInfo" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="create_time" label="日期" min-width="150px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="100px"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="160px"></el-table-column>
        <el-table-column prop="mobile" label="手机" min-width="100px"></el-table-column>
        <el-table-column prop="role_name" label="角色" min-width="100px"></el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态" width="80px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
              active-color="#dcdfe6"
              active-text="*"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              icon="el-icon-delete"
              size="mini"
              @click="openMessageBox(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
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

      <!-- 添加用户区域 -- 对话框 -->
      <el-dialog
        title="添加用户"
        width="30%"
        :visible.sync="addDialogVisible"
        :close-on-click-modal="false"
        @close="addDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form
          label-width="70px"
          status-icon
          ref="addFormRef"
          :model="addForm"
          :rules="addFormRules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="addDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addUser" :loading="loading"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 编辑用户区域 -- 对话框 -->
      <el-dialog
        title="编辑用户"
        width="30%"
        :visible.sync="editEialogVisible"
        :close-on-click-modal="false"
        @close="editDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form
          label-width="70px"
          status-icon
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="editEialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色区域 -- 对话框 -->
      <el-dialog
        title="分配角色"
        width="30%"
        :visible.sync="setRoleDialogVisible"
        :close-on-click-modal="false"
        @close="setRoleDialogClosed"
      >
        <div>
          <p>
            当前的用户：<span class="userinfo-layout">{{ allotRole_userInfo.username }}</span>
          </p>
          <p>
            当前的角色：<span class="userinfo-layout">{{ allotRole_userInfo.role_name }}</span>
          </p>
          <p>
            分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="savaRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getUsersListAPI,
  reviseUsersStaterAPI,
  addUserInfoAPI,
  getSingleUserInfoAPI,
  reviseUserInfoAPI,
  removeSingleUserAPI,
  allotRoleByIdAPI
} from '@/api/usersAPI.js';

import { getRolesListAPI } from '@/api/rightsAPI.js';

export default {
  name: 'Users',
  data() {
    return {
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      // 用户数据列表
      userInfo: [],
      // 总记录数
      total: 0,
      // 控制 添加用户对话框 的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户时的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[\w-]{3,10}$/, message: '用户名长度在 3 到 10 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^[\w]{6,16}$/, message: '密码长度在 6 到 16 个字符之间', trigger: 'blur' }
        ],
        email: [
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: '邮箱格式错误',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: '手机号码格式错误',
            trigger: 'blur'
          }
        ]
      },
      // 添加用户时的加载状态
      loading: false,
      // 控制修改用户对话框的显示与隐藏
      editEialogVisible: false,
      // 查询到的用户信息
      editForm: {},
      // 编辑用户时的表单验证规则
      editFormRules: {
        email: [
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: '邮箱格式错误',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: '手机号码格式错误',
            trigger: 'blur'
          }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      allotRole_userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 所选角色 id
      selectedRoleId: ''
    };
  },
  methods: {
    // 解决跳转到首页后，左侧菜单还处于激活状态
    reload() {
      window.sessionStorage.removeItem('activePath');
      this.$router.push('/welcome');
      window.location.reload();
    },
    // 获取用户列表
    async getUserList() {
      const { data: res } = await getUsersListAPI(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！');

      this.userInfo = res.data.users;
      this.total = res.data.total;
    },
    // 监听 条/页数据变化(每页显示条数) 的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听 页码值变化 的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听 Switch 开关状态的变化
    async userStateChanged(userinfo) {
      const { data: res } = await reviseUsersStaterAPI(userinfo);

      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error('设置状态失败！');
      }

      this.$message.success('设置状态成功！');
    },
    // 监听 添加用户对话框 的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 预验证并添加用户信息
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return false;
        } else {
          this.loading = true;
          const { data: res } = await addUserInfoAPI(this.addForm);
          if (res.meta.status !== 201) return this.$message.error('用户添加失败！');
        }

        this.loading = false;
        this.addDialogVisible = false;
        this.$message.success('添加成功！');
        this.getUserList();
      });
    },
    // 展示用户编辑对话框并根据 id 获取用户信息
    async showEditDialog(id) {
      this.editEialogVisible = true;
      const { data: res } = await getSingleUserInfoAPI(id);
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！');

      this.editForm = res.data;
    },
    // 监听 编辑用户对话框 的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 预验证并修改用户信息
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false;

        const { data: res } = await reviseUserInfoAPI(this.editForm);
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败！');

        this.editEialogVisible = false;
        this.getUserList();
        this.$message.success('更新成功！');
      });
    },
    // 删除用户时的确认消息
    openMessageBox(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await removeSingleUserAPI(id);
          if (res.meta.status !== 200) return this.$message.error('删除失败！');

          this.getUserList();
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
    // 获取角色列表
    async setRole(userInfo) {
      this.allotRole_userInfo = userInfo;
      const { data: res } = await getRolesListAPI();
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！');
      this.rolesList = res.data;

      this.setRoleDialogVisible = true;
    },
    // 预验证并分配角色
    async savaRoleInfo() {
      if (!this.selectedRoleId) return this.$message.error('请选择需要分配的角色！');

      const { data: res } = await allotRoleByIdAPI(this.allotRole_userInfo.id, this.selectedRoleId);
      if (res.meta.status !== 200) return this.$message.error('设置失败！');

      this.setRoleDialogVisible = false;
      this.getUserList();
      this.$message.success('设置成功！');
    },
    // 监听 分配角色对话框 的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = '';
      this.allotRole_userInfo = {};
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="less" scope>
// 分配角色用户信息布局
.userinfo-layout {
  padding: 5px;
  color: #9b9a9a;
}
</style>
