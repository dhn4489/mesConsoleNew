<template>
  <div>
    <!-- 页面大标题 -->
    <div class="header">
      <h1>下级组创建</h1>
      <el-button type="primary" @click="openCreateDialog">创建</el-button>
    </div>

    <!-- 分组展示数据 -->
    <div v-if="subordinateGroups.length">
      <div v-for="(group, index) in subordinateGroups" :key="group.project_group_id" class="group-container">
        <h3>{{ group.project_group_name }}</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>项目组描述：</strong> {{ group.project_group_description }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>父项目组ID：</strong> {{ group.up_project_group_id }}
            </div>
          </el-col>
            <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>状态：</strong>
              <!-- 动态渲染状态 -->
              <span v-if="group.status === 1">激活</span>
              <span v-else-if="group.status === 2">禁用</span>
              <span v-else-if="group.status === 3">待审核</span>
              <span v-else-if="group.status === 4">已完成</span>
              <span v-else>未知</span>
            </div>
          </el-col>
        </el-row>
        
      </div>
    </div>

    <!-- 弹窗：创建项目组 -->
    <el-dialog
      title="创建下属项目组"
      :visible.sync="createDialogVisible"
      width="50%"
      @close="resetCreateForm">
      <el-form :model="newGroup" ref="createForm" label-width="120px">
        <!-- 项目组名称 -->
        <el-form-item label="项目组名称" prop="project_group_name" :rules="[{ required: true, message: '请输入项目组名称', trigger: 'blur' }]">
          <el-input v-model="newGroup.project_group_name" placeholder="请输入项目组名称"></el-input>
        </el-form-item>

        <!-- 项目组描述 -->
        <el-form-item label="项目组描述" prop="project_group_description" :rules="[{ required: true, message: '请输入项目组描述', trigger: 'blur' }]">
          <el-input v-model="newGroup.project_group_description" placeholder="请输入项目组描述"></el-input>
        </el-form-item>

        <!-- 项目ID -->
        <el-form-item label="项目ID" prop="project_id" :rules="[{ required: false, message: '请选择项目ID', trigger: 'blur' }]">
            <el-select v-model="newGroup.project_id" placeholder="请选择项目ID">
                <el-option
                v-for="project in projects"
                :key="project.project_id"
                :label="project.project_name"
                :value="project.project_id">
                <template v-slot:default="{ option }">
                    <span>{{ project.project_name }}</span>
                    <el-button @click="showProjectDetails(project)" size="mini" style="margin-left: 10px;">详细</el-button>
                </template>
                </el-option>
            </el-select>
            </el-form-item>
        
      </el-form>
       <span slot="footer" class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </span>
    </el-dialog>
        <!-- 弹窗：项目详细信息 -->
    <el-dialog
      title="项目详细信息"
      :visible.sync="projectDetailsDialogVisible"
      width="50%">
      <div>
        <p><strong>项目名称:</strong> {{ selectedProject.project_name }}</p>
        <p><strong>项目描述:</strong> {{ selectedProject.project_description }}</p>
        <p><strong>项目状态:</strong> {{ selectedProject.project_status }}</p>
        <p><strong>项目预算:</strong> ￥{{ selectedProject.budget }}</p>
        <p><strong>项目起始日期:</strong> {{ selectedProject.begin_date || '无' }}</p>
        <p><strong>项目结束日期:</strong> {{ selectedProject.end_date || '无' }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="projectDetailsDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSubordinateGroup, subordinateGroupCreate, getProject } from '@/api/SubordinateGroup'; // 引入api

export default {
  data() {
    return {
      // 存储从后台获取的下属项目组数据
      subordinateGroups: [],
      // 弹窗显示状态
      createDialogVisible: false,
       projectDetailsDialogVisible: false, // 用于显示项目详细信息弹窗
      selectedProject: {}, // 存储选中的项目详细信息
      // 新创建项目组的数据模型
      newGroup: {
        project_group_name: '',
        project_group_description: '',
        project_id: null,
        up_project_group_id: 1,
        status: 1,
        project_group_id: null
      },
      // 存储项目ID选项
      projects: [],
    };
  },
  methods: {
    // 打开创建弹窗
    openCreateDialog() {
      this.createDialogVisible = true;
    },

    // 获取下属项目组信息
    async fetchSubordinateGroups() {
      try {
        const response = await getSubordinateGroup();
        console.log('下级组', response)
        if (response.code === 0) {
          this.subordinateGroups = response.data;
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 获取项目ID选项
    async fetchProjects() {
      try {
        const response = await getProject();  // 需要实现的API
         
        if (response.code === 0) {
          this.projects = response.data; 
        console.log('projects:',this.projects)
        } else {
            
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    
    // 提交新项目组创建
    async submitForm() {
      try {
        const response = await subordinateGroupCreate(this.newGroup);
        if (response.code === 0) {
          this.$message.success('项目组创建成功');
          this.createDialogVisible = false;
          this.fetchSubordinateGroups(); // 更新项目组数据
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 重置创建表单
    resetCreateForm() {
      this.newGroup = {
        project_group_name: '',
        project_group_description: '',
        project_id: null,
        up_project_group_id: 1,
        status: 1,
        project_group_id: null
      };
    },
    // 显示项目详细信息
    showProjectDetails(project) {
      this.selectedProject = project;
      this.projectDetailsDialogVisible = true;
    },
    // 根据index改变每行的背景色
    getItemStyle(index) {
      return {
        backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff'
      };
    }
  },
  mounted() {
    this.fetchSubordinateGroups(); // 页面加载时获取下属项目组数据
    this.fetchProjects(); // 获取项目ID选项
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.group-container {
  margin-bottom: 30px;
}

.item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.dialog-footer {
  text-align: right;
  background-color: #f0f0f0; /* 临时背景色调试 */
  padding: 10px;
}
</style>
