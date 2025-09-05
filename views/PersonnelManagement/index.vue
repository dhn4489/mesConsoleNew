<template>
  <div>
    <h1 class="page-title">
      成员管理
      <el-button type="primary" size="medium" class="add-member-button" @click="openAddMemberDialog">添加成员</el-button>
    </h1>
    
    <!-- 遍历成员数据 -->
    <div class="members-container">
      <div v-for="member in members" :key="member.member_ID" class="member-card">
        <h3>{{ member.name }}</h3>
        <div class="member-details">
          <div class="member-field">
            <strong>角色名称:</strong> <span>{{ member.roleName }}</span>
          </div>
          <div class="member-field">
            <strong>描述:</strong> <span>{{ member.desc || "无描述" }}</span>
          </div>
        </div>

        <!-- 修改和删除按钮 -->
        <div class="member-actions">
          <el-button type="warning" size="small" @click="openEditMemberDialog(member)">修改</el-button>
          <el-button type="danger" size="small" @click="confirmDeleteMember(member.member_ID)">删除</el-button>
        </div>
      </div>
    </div>
    
    <p v-if="!members.length">加载成员数据...</p>
       <!-- 添加成员的弹窗 -->
    <el-dialog
      title="添加成员"
      :visible.sync="addMemberDialogVisible"
      width="50%"
      @close="resetAddMemberForm">
      <el-form :model="memberForm" ref="memberForm" label-width="120px">
        <!-- 选择员工 -->
        <el-form-item label="选择员工" prop="employeeId" :rules="[{ required: true, message: '请选择员工', trigger: 'blur' }]">
          <el-select v-model="memberForm.employeeId" filterable placeholder="请选择员工" :options="users" value-key="employee_id">
            <el-option
              v-for="employee in users"
              :key="employee.employee_id"
              :label="employee.name"
              :value="employee.employee_id">
              <template #default>
        <span>{{ employee.name }}</span>
        <!-- 这里插入按钮 -->
        <el-button
          type="text"
          size="small"
          @click="openEmployeeDetails(employee)"
          style="position: absolute; right: 10px; z-index: 99; top: 50%; transform: translateY(-50%);">
          详细
        </el-button>
              </template>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 选择角色 -->
        <el-form-item label="选择角色" prop="character" :rules="[{ required: true, message: '请选择角色', trigger: 'blur' }]">
          <el-select v-model="memberForm.character" filterable placeholder="请选择角色" :options="roles" value-key="id">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id">
              <template #default>
                <span>{{ role.name }}</span>
                <!-- 详细按钮 -->
                <el-button
                  type="text"
                  size="small"
                  @click="openRoleDetails(role)"
                  style="position: absolute; right: 10px; z-index: 99; top: 50%; transform: translateY(-50%);"
                >
                  详细
                </el-button>
              </template>
            </el-option>
          </el-select>
        </el-form-item>


        <!-- 描述 -->
        <el-form-item label="描述" prop="desc">
          <el-input v-model="memberForm.desc" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addMemberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddMemberForm">提交</el-button>
      </span>
    </el-dialog>
    <!-- 编辑成员的弹窗 -->
    <el-dialog
      title="编辑成员"
      :visible.sync="editMemberDialogVisible"
      width="50%"
      @close="resetEditMemberForm">
      <el-form :model="editMemberForm" ref="editMemberForm" label-width="120px">
        <!-- 选择角色 -->
        <el-form-item label="选择角色" prop="character" :rules="[{ required: true, message: '请选择角色', trigger: 'blur' }]">
          <el-select v-model="editMemberForm.character" filterable placeholder="请选择角色" :options="roles" value-key="id">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id">
              <template #default>
                <span>{{ role.name }}</span>
                <!-- 详细按钮 -->
                <el-button
                  type="text"
                  size="small"
                  @click="openRoleDetails(role)"
                  style="position: absolute; right: 10px; z-index: 99; top: 50%; transform: translateY(-50%);"
                >
                  详细
                </el-button>
              </template>
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="editMemberForm.desc" placeholder="输入描述"></el-input>
             </el-form-item>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editMemberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditMemberForm">提交</el-button>
      </span>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog
      title="删除确认"
      :visible.sync="deleteConfirmVisible"
      width="30%">
      <p>确定要删除该成员吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteMember">确认删除</el-button>
      </span>
    </el-dialog>

      <!-- 员工详细信息弹窗 -->
    <el-dialog
      title="员工详细信息"
      :visible.sync="employeeDetailsDialogVisible"
      width="50%">
      <div>
        <p><strong>姓名:</strong> {{ selectedEmployee.name }}</p>
        <p><strong>技能级别:</strong> {{ selectedEmployee.skill_level }}</p>
        <p><strong>工作状态:</strong> {{ selectedEmployee.work_status }}</p>
        <p><strong>工作时长:</strong> {{ selectedEmployee.work_hours }} 小时</p>
        <p><strong>绩效评分:</strong> {{ selectedEmployee.performance_score }}</p>
        <p><strong>主管ID:</strong> {{ selectedEmployee.supervisor_id }}</p>
        <p><strong>基本薪资:</strong> {{ selectedEmployee.base_salary }} 元</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="employeeDetailsDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

      <!-- 角色详细信息弹窗 -->
      <el-dialog
        title="角色详细信息"
        :visible.sync="roleDetailsDialogVisible"
        width="50%">
        <div v-if="selectedRole">
          <p><strong>角色名称:</strong> {{ selectedRole.name }}</p>
          <p><strong>描述:</strong> {{ selectedRole.description }}</p>
          <p><strong>权限:</strong></p>
          <ul>
            <li v-for="permission in selectedRole.permissions" :key="permission.id">
              <strong>{{ permission.name }}:</strong> {{ permission.description }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>加载角色信息...</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleDetailsDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>

  </div>
</template>

<script>
import { addMember, getPersonnelManagement,getAllUser,updateMember,deleteMember } from "@/api/member";
import { getRole} from "@/api/roles";
export default {
  data() {
    return {
      members: [], // 存储成员信息
       users: [], // 用于存储获取到的用户数据
        roles: [], // 存储角色信息
        addMemberDialogVisible: false, // 控制弹窗显示
          editMemberDialogVisible: false, // 控制编辑成员弹窗显示
      deleteConfirmVisible: false, // 控制删除确认弹窗显示
      memberForm: { // 存储添加成员的表单数据
        employeeId: null, // 选择的员工ID
        desc: "", // 描述
        character: null, // 选择的角色ID
      },
      editMemberForm: { // 存储编辑成员的表单数据
        character: null,
        memberId: null, // 当前编辑的成员ID
        desc:"",     
        id:null,
      },
      employeeDetailsDialogVisible: false, // 控制员工详细信息弹窗显示
      selectedEmployee: {}, // 存储选中的员工信息
      memberToDelete: null, // 存储待删除的成员ID
       // 其他数据项
    selectedRole: null, // 存储选中的角色信息
    roleDetailsDialogVisible: false, // 控制角色详细信息弹窗显示
    };
  },
  created() {
    this.fetchMembers(); // 获取成员数据
    this.fetchUsers(); // 获取用户数据
     this.fetchRoles(); // 获取角色数据
  },
  methods: {
    // 获取成员数据
    async fetchMembers() {
      try {
        const response = await  getPersonnelManagement(); // 发送API请求
        if (response.code === 0) {
          this.members = response.data; // 存储成员数据
        } else {
          console.error("获取成员数据失败：" + response.message);
        }
      } catch (error) {
        console.error("请求失败:", error);
      }
    },

    // 获取用户数据
    async fetchUsers() {
      try {
        const response = await getAllUser(); // 调用 getAllUser API 获取用户数据
        if (response.code === 0) {
          this.users = response.data; // 将用户数据存储在 users 数组中
        } else {
          console.error("获取用户数据失败：" + response.message);
        }
      } catch (error) {
        console.error("获取用户数据失败:", error);
      }
    },
     // 获取角色数据
    async fetchRoles() {
      try {
        const response = await getRole(); // 发送API请求获取角色数据
        if (response.code === 0) {
          this.roles = response.data; // 存储角色数据
        } else {
          console.error("获取角色数据失败：" + response.message);
        }
      } catch (error) {
        console.error("请求失败:", error);
      }
    },
           // 打开员工详细信息弹窗
    openEmployeeDetails(employee) {
       console.log('Employee Details:', employee);
      this.selectedEmployee = employee;
      this.employeeDetailsDialogVisible = true;
    },
     // 根据角色ID获取角色名称
    getRoleNameById(roleId) {
      const role = this.roles.find(role => role.id === roleId);
      return role ? role.name : "未知角色";
    },
    // 添加成员
    // 打开添加成员弹窗
    openAddMemberDialog() {
      this.addMemberDialogVisible = true; // 打开弹窗
    },
     // 提交添加成员表单
    async submitAddMemberForm() {
      this.$refs.memberForm.validate(async (valid) => {
        if (valid) {
          console.log('memberData in submitAddMemberForm',this.memberForm)
          const memberData = {
            employeeId: this.memberForm.employeeId, // 员工ID
            desc: this.memberForm.desc, // 描述
            character: this.memberForm.character, // 角色ID
          };

          try {
            const response = await addMember(memberData); // 调用API添加成员
            console.log('response********',response)
            if (response.code === 0) {
              this.$message.success("成员添加成功！");
              this.addMemberDialogVisible = false; // 关闭弹窗
              this.fetchMembers(); // 刷新成员列表
            } else {
              this.$message.error("成员添加失败：" + response.message);
            }
          } catch (error) {
            console.error("添加成员失败:", error);
            this.$message.error("添加失败，请稍后再试");
          }
        }
      });
    },
     // 重置添加成员表单
    resetAddMemberForm() {
      this.memberForm.employeeId = null;
      this.memberForm.desc = "";
      this.memberForm.character = null;
    },
     // 打开编辑成员弹窗
    openEditMemberDialog(member) {
      //console.log('member******',member)
      this.editMemberForm.memberId = member.member_ID; 
       this.editMemberForm.desc = member.desc || ''; 
      // 设置角色ID
  const role = this.roles.find(role => role.name === member.roleName); // 查找与 member 中 roleName 匹配的角色
  if (role) {
    this.editMemberForm.id = role.id; // 设置角色ID
  }
this.editMemberForm.character=member.roleName||'';
  this.editMemberDialogVisible = true; // 显示编辑弹窗
    },
     // 打开角色详细信息弹窗
  openRoleDetails(role) {
    this.selectedRole = role;  // 设置选中的角色信息
    this.roleDetailsDialogVisible = true;  // 显示角色详细信息弹窗
  },
 // 提交编辑成员表单
    async submitEditMemberForm() {
      const { memberId, character, desc,id } = this.editMemberForm;

  // 找到对应的成员信息
  const member = this.members.find(m => m.member_ID === memberId);
  //console.log('member', member);

  if (member) {
    // 通过角色名称来查找角色ID
console.log('rolename',character)
    const role = this.roles.find(role => role.name === character); 
    const roleId = role ? role.id : id; // 获取角色的 id

    const memberData = {
      member_id: memberId,  // 从编辑表单中获取成员ID
      type: member.type,  // 固定值
      ForeignID: member.foreignID,  // ForeignID 与 member_id 相同
      EmployeeID: member.employeeID,  // 获取成员的 EmployeeID
      desc: desc || member.desc || "",  // 使用编辑后的描述，如果没有则使用原有描述或空字符串
      character: roleId || member.character,  // 使用编辑后的角色ID，如果没有则使用原角色
    };

      try {
        console.log('memberData',memberData)
        const response = await updateMember(memberData);
        if (response.code === 0) {
          this.$message.success("成员修改成功！");
          this.editMemberDialogVisible = false;
          this.fetchMembers();
        } else {
          this.$message.error("成员修改失败：" + response.message);
        }
      } catch (error) {
        console.error("修改成员失败:", error);
        this.$message.error("修改失败，请稍后再试");
      }
    }
    }  ,
    // 打开删除确认弹窗
    confirmDeleteMember(memberId) {
      this.memberToDelete = memberId;
      this.deleteConfirmVisible = true;
    },

    // 删除成员
    async deleteMember() {
      try {
        const response = await deleteMember(this.memberToDelete); // 使用实际的projectGroupId替代
        if (response.code === 0) {
          this.$message.success("成员删除成功！");
          this.fetchMembers();
        } else {
          this.$message.error("删除成员失败：" + response.message);
        }
      } catch (error) {
        console.error("删除成员失败:", error);
        this.$message.error("删除失败，请稍后再试");
      }
      this.deleteConfirmVisible = false;
    },

    // 重置添加成员表单
    resetAddMemberForm() {
      this.memberForm.employeeId = null;
      this.memberForm.desc = "";
      this.memberForm.character = null;
    },

    // 重置编辑成员表单
    resetEditMemberForm() {
      this.editMemberForm.character = null;
      this.editMemberForm.memberId = null;
    },
  },
};
</script>

<style scoped>
.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.add-member-button {
  margin-left: 20px;
}

.members-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.member-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.member-details {
  margin-top: 10px;
}

.member-field {
  margin-bottom: 10px;
}

.member-actions {
  margin-top: 20px;
}

.member-actions el-button {
  margin-right: 10px;
}
.el-button {
  z-index: 10; /* 保证按钮在前面 */
}

</style>
