<template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        ><a href="javascript:;" @click.prevent="reload()">首页</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="bdpadding">
              <p v-if="scope.row.children.length === 0" style="text-align: center;margin: 0">
                这里是空的诶，去别处看看吧。
              </p>
              <el-row
                v-else
                v-for="(item1, i1) in scope.row.children"
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                :key="item1.id"
              >
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightsById(scope.row, item1.id)">{{
                    item1.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, i2) in item1.children"
                    :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                    :key="item2.id"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRightsById(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染三级权限 -->
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        closable
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="removeRightsById(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button icon="el-icon-delete" size="mini" @click="openMessageBox(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色区域 -- 对话框 -->
      <el-dialog
        title="添加角色"
        width="30%"
        :visible.sync="addDialogVisible"
        :close-on-click-modal="false"
        @close="addDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form
          label-width="80px"
          status-icon
          ref="addFormRef"
          :model="addForm"
          :rules="addFormRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input type="textarea" v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="addDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色区域 -- 对话框 -->
      <el-dialog
        title="编辑角色"
        width="30%"
        :visible.sync="editEialogVisible"
        :close-on-click-modal="false"
        @close="editDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form
          label-width="80px"
          status-icon
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input type="textarea" v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="editEialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限区域 -- 对话框 -->
      <el-dialog
        title="分配权限"
        width="40%"
        :visible.sync="setDialogVisible"
        :close-on-click-modal="false"
        @close="defkeys = []"
      >
        <!-- 树形控件 -->
        <el-tree
          show-checkbox
          default-expand-all
          :data="rightslist"
          :props="treeProps"
          :default-checked-keys="defkeys"
          node-key="id"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="setDialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getRightsListAPI,
  getRolesListAPI,
  addRolesInfoAPI,
  getRolesInfoAPI,
  editRolesInfoAPI,
  removeSingleRolesAPI,
  removeRightsByIdAPI,
  allotRoleRightsAPI
} from '@/api/rightsAPI.js';

export default {
  name: 'Roles',
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 控制 添加角色 对话框的显示与隐藏
      addDialogVisible: false,
      // 添加角色对话框的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色对话框的表单验证规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称长度在 3 到 10 个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { min: 2, max: 25, message: '角色描述长度在 2 到 25 个字符之间', trigger: 'blur' }
        ]
      },
      // 控制 编辑角色 对话框的显示与隐藏
      editEialogVisible: false,
      // 查询到的角色信息
      editForm: {},
      // 编辑角色对话框的表单验证规则
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称长度在 3 到 10 个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { min: 2, max: 25, message: '角色描述长度在 2 到 25 个字符之间', trigger: 'blur' }
        ]
      },
      // 控制 分配权限 对话框的显示与隐藏
      setDialogVisible: false,
      // 权限列表数据
      rightslist: [],
      // 树形控件配置信息
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点 id 值数组
      defkeys: [],
      // 当前即将分配权限的角色 id
      roleId: ''
    };
  },
  methods: {
    // 解决跳转到首页后，左侧菜单还处于激活状态
    reload() {
      window.sessionStorage.removeItem('activePath');
      this.$router.push('/welcome');
      window.location.reload();
    },
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await getRolesListAPI();
      if (res.meta.status !== 200) return this.$message.error('角色列表获取失败！');

      this.roleList = res.data;
    },
    // 监听 添加角色 对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 预验证并添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false;

        const { data: res } = await addRolesInfoAPI(this.addForm);
        if (res.meta.status !== 201) return this.$message.error('添加失败！');

        this.addDialogVisible = false;
        this.getRolesList();
        this.$message.success('添加成功！');
      });
    },
    // 监听 编辑角色 对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 显示 编辑角色 对话框并根据 id 获取数据
    async showEditDialog(id) {
      const { data: res } = await getRolesInfoAPI(id);
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！');

      this.editForm = res.data;
      this.editEialogVisible = true;
    },
    // 预验证并修改角色
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false;

        const { data: res } = await editRolesInfoAPI(this.editForm);
        if (res.meta.status !== 200) return this.$message.error('修改失败！');

        this.editEialogVisible = false;
        this.getRolesList();
        this.$message.success('修改成功！');
      });
    },
    // 删除对应 id 角色
    openMessageBox(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await removeSingleRolesAPI(id);
          if (res.meta.status !== 200) return this.$message.error('删除失败！');

          this.getRolesList();
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
    // 根据 id 去除相应的标签与权限
    removeRightsById(role, rightId) {
      this.$confirm('此操作将永久删除该角色的权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await removeRightsByIdAPI(role.id, rightId);
          if (res.meta.status !== 200) return this.$message.error('删除权限失败！');

          // 删除成功后将响应回来的新数据重新赋值给 scope.row
          // 解决删除后需要重新展开行才能看到最新数据
          role.children = res.data;
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 显示设置权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await getRightsListAPI('tree');
      if (res.meta.status !== 200) return this.$message.error('权限列表获取失败！');
      this.rightslist = res.data;

      // 获取所有三级权限 id
      this.getleafkeys(role, this.defkeys);

      this.setDialogVisible = true;
    },
    // 通过递归，获取角色下所有三级权限 id
    getleafkeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则为三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => {
        this.getleafkeys(item, arr);
      });
    },
    // 修改角色权限（角色授权）
    async allotRights() {
      // 目前选中的节点与半选中的节点的 key 值
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];

      const idStr = keys.join(',');

      const { data: res } = await allotRoleRightsAPI(this.roleId, idStr);
      if (res.meta.status !== 200) return this.$message.error('更新失败！');

      this.setDialogVisible = false;
      this.getRolesList();
      this.$message.success('更新成功！');
    }
  },
  created() {
    this.getRolesList();
  }
};
</script>

<style lang="less" scope>
// 展开列 -- 容器内边距
.bdpadding {
  padding: 20px 48px;
  box-sizing: border-box;
}
// 展开列 -- tab 标签样式
.el-tag {
  margin: 8px !important;
}

// 展开列 -- 权限边框样式
.bdtop {
  border-top: 1px solid #eee;
  box-sizing: border-box;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

// 展开列 -- 垂直居中
.vcenter {
  display: flex;
  align-items: center;
}
</style>
