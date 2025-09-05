<template>
  <div class="employee-management">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>雇员管理</span>
            <el-button style="float: right;" type="primary" @click="handleAdd">新增雇员</el-button>
          </div>

          <el-table :data="employeeList" style="width: 100%" stripe>
            <el-table-column label="雇员ID" prop="employee_id" width="120"></el-table-column>
            <el-table-column label="姓名" prop="name" width="150"></el-table-column>
            <el-table-column label="技能等级" prop="skill_level" width="150"></el-table-column>
            <el-table-column label="工作状态" prop="work_status" width="150">
              <template slot-scope="scope">
                <el-tag :type="scope.row.work_status === '1' ? 'success' : 'danger'">
                  {{ scope.row.work_status === '1' ? '在职' : '离职' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="工时" prop="work_hours" width="100"></el-table-column>
            <el-table-column label="绩效评分" prop="performance_score" width="100"></el-table-column>
            <el-table-column label="基本工资" prop="base_salary" width="150"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row)" size="small" type="primary">编辑</el-button>
                <el-button @click="handleDelete(scope.row)" size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增/编辑弹框 -->
    <el-dialog :visible.sync="dialogVisible" title="新增/编辑雇员">
      <el-form :model="formData" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="技能等级" prop="skill_level">
          <el-input v-model="formData.skill_level" placeholder="请输入技能等级"></el-input>
        </el-form-item>
        <el-form-item label="工作状态" prop="work_status">
          <el-radio-group v-model="formData.work_status">
            <el-radio label="1">在职</el-radio>
            <el-radio label="0">离职</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工时" prop="work_hours">
          <el-input v-model="formData.work_hours" placeholder="请输入工时"></el-input>
        </el-form-item>
        <el-form-item label="绩效评分" prop="performance_score">
          <el-input v-model="formData.performance_score" placeholder="请输入绩效评分"></el-input>
        </el-form-item>
        <el-form-item label="基本工资" prop="base_salary">
          <el-input v-model="formData.base_salary" placeholder="请输入基本工资"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bank_account_number">
          <el-input v-model="formData.bank_account_number" placeholder="请输入银行账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUsers, registerEmployee, updateUserInfo, deleteUserById } from '@/api/employee'

export default {
  data() {
    return {
      employeeList: [], // 存储雇员列表
      dialogVisible: false, // 控制弹框显示与隐藏
      formData: {
        employee_id: null, // 雇员ID，新增时为空
        name: '',
        skill_level: '',
        work_status: '1', // 默认在职
        work_hours: 0,
        performance_score: 0,
        supervisor_id: '',
        base_salary: 0,
        bank_account_number: '',
        password: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入雇员姓名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchEmployeeList()
  },
  methods: {
    // 获取雇员列表
    async fetchEmployeeList() {
      try {
        const response = await getAllUsers()
        if (response.code === 0) {
          this.employeeList = response.data
        }
      } catch (error) {
        console.error('获取雇员列表失败:', error)
      }
    },

    // 新增雇员
    handleAdd() {
      this.dialogVisible = true
      this.formData = {
        employee_id: null,
        name: '',
        skill_level: '',
        work_status: '1',
        work_hours: 0,
        performance_score: 0,
        supervisor_id: '',
        base_salary: 0,
        bank_account_number: '',
        password: ''
      }
    },

    // 编辑雇员
    handleEdit(row) {
      this.dialogVisible = true
      this.formData = { ...row } // 填充弹框表单
    },

    // 删除雇员
    async handleDelete(row) {
      try {
        await deleteUserById(row.employee_id)
        this.$message.success('删除成功')
        this.fetchEmployeeList() // 刷新列表
      } catch (error) {
        this.$message.error('删除失败')
      }
    },

    // 提交表单
    async handleSubmit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          try {
            if (this.formData.employee_id) {
              // 更新雇员信息
              await updateUserInfo(this.formData)
              this.$message.success('雇员信息更新成功')
            } else {
              // 注册新增雇员
              await registerEmployee(this.formData)
              this.$message.success('新增雇员成功')
            }
            this.dialogVisible = false
            this.fetchEmployeeList() // 刷新列表
          } catch (error) {
            this.$message.error('操作失败')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.employee-management {
  padding: 20px;
}
</style>
