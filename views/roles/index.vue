<template>
  <div class="roles-page">
    <!-- 页面大标题和创建角色按钮 -->
    <div class="header">
      <h1>角色管理</h1>
      <el-button type="primary" size="medium" @click="createRole">角色创建</el-button>
    </div>

    <!-- 遍历所有角色 -->
    <el-card class="roles-card" v-for="role in roles" :key="role.id" shadow="hover">
      <!-- 角色大标题和编辑删除按钮 -->
      <div class="role-header">
        <h2>{{ role.name }}</h2>
        <div>
          <el-button type="warning" size="small" @click="editRole(role)">更改</el-button>
          <el-button type="danger" size="small" @click="deleteRole(role)">删除</el-button>
        </div>
      </div>

      <!-- 角色描述 -->
      <div class="role-description">
        <strong>描述：</strong> <span>{{ role.description }}</span>
      </div>

      <!-- 角色权限 -->
      <div class="permissions">
        <el-divider>权限</el-divider>
        <!-- 遍历权限 -->
        <div v-for="(permission, permIndex) in role.permissions" :key="permIndex" class="permission-item">
          <strong>{{ permission.name }}:</strong> {{ permission.description }}
        </div>
      </div>
    </el-card>

    <!-- 添加角色的弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm">
      <el-form :model="roleForm" ref="roleForm" label-width="120px">
        <el-form-item label="角色名称" prop="name" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="description" :rules="[{ required: true, message: '请输入角色描述', trigger: 'blur' }]">
          <el-input v-model="roleForm.description" placeholder="请输入角色描述"></el-input>
        </el-form-item>

        <el-form-item label="选择权限" prop="permissions" :rules="[{ required: true, message: '请选择权限', trigger: 'blur' }]">
          <el-select
            v-model="roleForm.permissions"
            multiple
            filterable
            placeholder="请选择权限"
            :options="permissions"
            value-key="id">
            <el-option
              v-for="permission in permissions"
              :key="permission.id"
              :label="permission.name"
              :value="permission.id">
              <template slot="label">
                <span>{{ permission.name }} - {{ permission.description }}</span>
              </template>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </el-dialog>
     <!-- 编辑角色的弹窗 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditForm">
      <el-form :model="editRoleForm" ref="editRoleForm" label-width="120px">
        <el-form-item label="角色名称" prop="name" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
          <el-input v-model="editRoleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="description" :rules="[{ required: true, message: '请输入角色描述', trigger: 'blur' }]">
          <el-input v-model="editRoleForm.description" placeholder="请输入角色描述"></el-input>
        </el-form-item>

        <el-form-item label="选择权限" prop="permissions" :rules="[{ required: true, message: '请选择权限', trigger: 'blur' }]">
          <el-select
            v-model="editRoleForm.permissions"
            multiple
            filterable
            placeholder="请选择权限"
            :options="permissions"
            value-key="id">
            <el-option
              v-for="permission in permissions"
              :key="permission.id"
              :label="permission.name"
              :value="permission.id">
              <template slot="label">
                <span>{{ permission.name }} - {{ permission.description }}</span>
              </template>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">确认</el-button>
      </span>
    </el-dialog>

    <!-- 删除角色确认弹窗 -->
    <el-dialog
      title="删除角色"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <p>您确定要删除此角色吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDeleteRole">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  </div>
</template>

<script>
import { getPermission, getRole, addRole, updateRole } from "@/api/roles";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    return {
      dialogVisible: false, // 控制弹窗的显示与隐藏
        editDialogVisible: false, // 控制编辑角色弹窗
      deleteDialogVisible: false, // 控制删除角色弹窗
      roles: [], // 存储角色数据
      permissions: [], // 存储权限选项
      roleForm: {
        name: "", // 角色名称
        description: "", // 角色描述
        permissions: [], // 选择的权限
      },
          editRoleForm: {
        id: null, // 编辑的角色ID
        name: "",
        description: "",
        permissions: [],
      },
        roleIdToDelete: null, // 记录待删除角色ID
    };
  },
  created() {
    this.fetchRoleData(); // 获取角色数据
    this.fetchPermissions(); // 获取权限数据
  },
  methods: {
    // 从后端获取角色数据
    async fetchRoleData() {
      try {
        const response = await getRole();
        if (response.code === 0) {
          this.roles = response.data; // 存储角色数据
        } else {
          console.error("Failed to fetch roles data:", response.message);
        }
      } catch (error) {
        console.error("API request failed:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token expired, redirecting to login...");
          removeToken();
          this.$router.push({ path: "/login" });
        }
      }
    },

    // 从后端获取权限数据
    async fetchPermissions() {
      try {
        const response = await getPermission();
        if (response.code === 0) {
          this.permissions = response.data; // 存储权限数据
        } else {
          console.error("Failed to fetch permissions:", response.message);
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    },

    // 编辑角色
    editRole(role) {
        console.log('role in edoreole',role)
       this.editRoleForm.id = role.id;
      this.editRoleForm.name = role.name;
      this.editRoleForm.description = role.description;
      this.editRoleForm.permissions = role.permissions.map(perm => perm.id); // 填充权限
      this.editDialogVisible = true;
    },

    // 删除角色
    deleteRole(roleId) {
      this.roleIdToDelete = roleId;
      this.deleteDialogVisible = true;
    },

    // 创建新角色
    createRole() {
      this.dialogVisible = true; // 打开角色创建弹窗
    },

    // 提交表单
    async submitForm() {
      this.$refs.roleForm.validate(async (valid) => {
        if (valid) {
          const roleData = {
            name: this.roleForm.name,
            description: this.roleForm.description,
            permissions: this.roleForm.permissions, // 权限ID数组
          };
          try {
            const response = await addRole(roleData);
            if (response.code === 0) {
              this.$message.success("角色创建成功！");
              this.dialogVisible = false; // 关闭弹窗
              this.fetchRoleData(); // 刷新角色列表
            } else {
              this.$message.error("角色创建失败：" + response.message);
            }
          } catch (error) {
            console.error("Error adding role:", error);
          }
        }
      });
    },
// 提交编辑的角色
    async submitEditForm() {
      this.$refs.editRoleForm.validate(async (valid) => {
        if (valid) {
          const updatedRoleData = {
            id: this.editRoleForm.id,
            name: this.editRoleForm.name,
            description: this.editRoleForm.description,
            permissions: this.editRoleForm.permissions,
          };
          try {
            const response = await updateRole(updatedRoleData);
            if (response.code === 0) {
              this.$message.success("角色更新成功！");
              this.editDialogVisible = false;
              this.fetchRoleData();
            } else {
              this.$message.error("角色更新失败：" + response.message);
            }
          } catch (error) {
            console.error("Error updating role:", error);
          }
        }
      });
    },
        // 打开删除确认弹窗
    openDeleteDialog(roleId) {
      this.roleIdToDelete = roleId;
      this.deleteDialogVisible = true;
    },

    // 确认删除角色
    async confirmDeleteRole() {
      try {
        const response = await deleteRole(this.roleIdToDelete);
        if (response.code === 0) {
          this.$message.success("角色删除成功！");
          this.deleteDialogVisible = false;
          this.fetchRoleData(); // 刷新角色列表
        } else {
          this.$message.error("角色删除失败：" + response.message);
        }
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    },
    // 重置表单数据
    resetForm() {
      this.roleForm.name = "";
      this.roleForm.description = "";
      this.roleForm.permissions = [];
    },
     // 重置编辑角色表单
    resetEditForm() {
      this.editRoleForm.name = "";
      this.editRoleForm.description = "";
      this.editRoleForm.permissions = [];
    },
  },
};
</script>

<style scoped>
.roles-page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px;
}

.roles-card {
  margin-bottom: 20px;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-description {
  margin-top: 10px;
}

.permissions {
  margin-top: 20px;
}

.permission-item {
  margin-left: 20px;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.permission-item:nth-child(odd) {
  background-color: #f5f5f5;
}

.permission-item:nth-child(even) {
  background-color: #e0e0e0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
