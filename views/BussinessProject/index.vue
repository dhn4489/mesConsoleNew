<template>
  <div>
    <!-- 页面大标题 -->
    <div class="header">
      <h1>项目列表</h1>
      <el-button type="primary" @click="openCreateDialog">创建项目</el-button>
    </div>

    <!-- 项目展示数据 -->
    <div v-if="projects.length">
      <div v-for="(project, index) in projects" :key="project.project_id" class="project-container">
        <h3>项目编号：{{ project.project_id }}</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>项目名称：</strong> {{ project.project_name }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>预算：</strong> {{ project.budget }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>状态：</strong> {{ project.project_status }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>创建日期：</strong> {{ project.begin_date ? project.begin_date : '未开始' }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>结束日期：</strong> {{ project.end_date ? project.end_date : '未结束' }}
            </div>
          </el-col>
        </el-row>

        <!-- 修改按钮 -->
        <div class="action-container">
          <el-button @click="openUpdateDialog(project)" type="primary">修改</el-button>
        </div>
      </div>
    </div>

    <!-- 弹窗：创建项目 -->
    <el-dialog
      title="创建项目"
      :visible.sync="createDialogVisible"
      width="50%"
      @close="resetCreateForm">
      <el-form :model="newProject" ref="createForm" label-width="120px">
        <!-- 项目名称 -->
        <el-form-item label="项目名称" prop="project_name" :rules="[{ required: true, message: '请输入项目名称', trigger: 'blur' }]">
          <el-input v-model="newProject.project_name" placeholder="请输入项目名称"></el-input>
        </el-form-item>

        <!-- 项目描述 -->
        <el-form-item label="项目描述" prop="project_description" :rules="[{ required: true, message: '请输入项目描述', trigger: 'blur' }]">
          <el-input v-model="newProject.project_description" placeholder="请输入项目描述"></el-input>
        </el-form-item>

        <!-- 项目经理 -->
        <el-form-item label="项目经理" prop="project_manager" :rules="[{ required: true, message: '请输入项目经理', trigger: 'blur' }]">
          <el-input v-model="newProject.project_manager" placeholder="请输入项目经理ID" type="number"></el-input>
        </el-form-item>

        <!-- 项目来源ID -->
        <el-form-item label="项目来源ID" prop="project_from_id" :rules="[{ required: true, message: '请输入项目来源ID', trigger: 'blur' }]">
          <el-input v-model="newProject.project_from_id" placeholder="请输入项目来源ID" type="number"></el-input>
        </el-form-item>

        <!-- 项目目标ID -->
        <el-form-item label="项目目标ID" prop="project_to_id" :rules="[{ required: true, message: '请输入项目目标ID', trigger: 'blur' }]">
          <el-input v-model="newProject.project_to_id" placeholder="请输入项目目标ID" type="number"></el-input>
        </el-form-item>

        <!-- 主要项目组ID -->
        <el-form-item label="主要项目组ID" prop="main_project_group_id" :rules="[{ required: true, message: '请输入主要项目组ID', trigger: 'blur' }]">
          <el-input v-model="newProject.main_project_group_id" placeholder="请输入主要项目组ID" type="number"></el-input>
        </el-form-item>

        <!-- 预算 -->
        <el-form-item label="预算" prop="budget" :rules="[{ required: true, message: '请输入预算', trigger: 'blur' }]">
          <el-input v-model="newProject.budget" placeholder="请输入预算" type="number"></el-input>
        </el-form-item>

        <!-- 项目文件 -->
        <el-form-item label="项目文件" prop="project_file">
          <el-input v-model="newProject.project_file" placeholder="请输入项目文件"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateForm">提交</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗：更新项目 -->
    <el-dialog
      title="更新项目"
      :visible.sync="updateDialogVisible"
      width="50%"
      @close="resetUpdateForm">
      <el-form :model="updateProject" ref="updateForm" label-width="120px">
        <!-- 项目名称 -->
        <el-form-item label="项目名称" prop="project_name" :rules="[{ required: true, message: '请输入项目名称', trigger: 'blur' }]">
          <el-input v-model="updateProject.project_name" placeholder="请输入项目名称"></el-input>
        </el-form-item>

        <!-- 项目描述 -->
        <el-form-item label="项目描述" prop="project_description" :rules="[{ required: true, message: '请输入项目描述', trigger: 'blur' }]">
          <el-input v-model="updateProject.project_description" placeholder="请输入项目描述"></el-input>
        </el-form-item>

        <!-- 项目经理 -->
        <el-form-item label="项目经理" prop="project_manager" :rules="[{ required: true, message: '请输入项目经理', trigger: 'blur' }]">
          <el-input v-model="updateProject.project_manager" placeholder="请输入项目经理ID" type="number"></el-input>
        </el-form-item>

        <!-- 项目来源ID -->
        <el-form-item label="项目来源ID" prop="project_from_id" :rules="[{ required: true, message: '请输入项目来源ID', trigger: 'blur' }]">
          <el-input v-model="updateProject.project_from_id" placeholder="请输入项目来源ID" type="number"></el-input>
        </el-form-item>

        <!-- 项目目标ID -->
        <el-form-item label="项目目标ID" prop="project_to_id" :rules="[{ required: true, message: '请输入项目目标ID', trigger: 'blur' }]">
          <el-input v-model="updateProject.project_to_id" placeholder="请输入项目目标ID" type="number"></el-input>
        </el-form-item>

        <!-- 主要项目组ID -->
        <el-form-item label="主要项目组ID" prop="main_project_group_id" :rules="[{ required: true, message: '请输入主要项目组ID', trigger: 'blur' }]">
          <el-input v-model="updateProject.main_project_group_id" placeholder="请输入主要项目组ID" type="number"></el-input>
        </el-form-item>

        <!-- 预算 -->
        <el-form-item label="预算" prop="budget" :rules="[{ required: true, message: '请输入预算', trigger: 'blur' }]">
          <el-input v-model="updateProject.budget" placeholder="请输入预算" type="number"></el-input>
        </el-form-item>

        <!-- 项目文件 -->
        <el-form-item label="项目文件" prop="project_file">
          <el-input v-model="updateProject.project_file" placeholder="请输入项目文件"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpdateForm">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllProject, addProject, updateProject } from '@/api/BussinessProject'; // 引入接口

export default {
  data() {
    return {
      // 存储从后台获取的项目数据
      projects: [],
      // 弹窗显示状态
      createDialogVisible: false,
      updateDialogVisible: false,
      // 新建项目的数据模型
      newProject: {
        project_name: '',
        project_description: '',
        project_manager: '',
        project_from_id: '',
        project_to_id: '',
        main_project_group_id: '',
        budget: '',
        project_file: ''
      },
      // 更新项目的数据模型
      updateProject: {
        project_id: '',
        project_name: '',
        project_description: '',
        project_manager: '',
        project_from_id: '',
        project_to_id: '',
        main_project_group_id: '',
        budget: '',
        project_file: ''
      }
    };
  },

  methods: {
    // 获取项目列表
    async fetchProjects() {
      try {
        const response = await getAllProject();
        if (response.code === 0) {
          this.projects = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 打开创建项目弹窗
    openCreateDialog() {
      this.createDialogVisible = true;
      this.resetCreateForm();
    },

    // 打开更新项目弹窗
    openUpdateDialog(project) {
      this.updateDialogVisible = true;
      this.updateProject = { ...project };
    },

    // 提交新建项目表单
    async submitCreateForm() {
      try {
        const response = await addProject(this.newProject);
        if (response.code === 0) {
          this.$message.success('项目创建成功');
          this.fetchProjects(); // 重新加载项目列表
          this.createDialogVisible = false;
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 提交更新项目表单
    async submitUpdateForm() {
      try {
        const response = await updateProject(this.updateProject);
        if (response.code === 0) {
          this.$message.success('项目更新成功');
          this.fetchProjects(); // 重新加载项目列表
          this.updateDialogVisible = false;
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 重置创建表单
    resetCreateForm() {
      this.newProject = {
        project_name: '',
        project_description: '',
        project_manager: '',
        project_from_id: '',
        project_to_id: '',
        main_project_group_id: '',
        budget: '',
        project_file: ''
      };
    },

    // 重置更新表单
    resetUpdateForm() {
      this.updateProject = {
        project_id: '',
        project_name: '',
        project_description: '',
        project_manager: '',
        project_from_id: '',
        project_to_id: '',
        main_project_group_id: '',
        budget: '',
        project_file: ''
      };
    },

    // 获取项目条目的样式
    getItemStyle(index) {
      return index % 2 === 0 ? 'background-color: #f9f9f9;' : '';
    }
  },

  mounted() {
    this.fetchProjects(); // 页面加载时获取项目列表
  }
};
</script>

<style scoped>
/* 样式与之前一样 */
</style>
