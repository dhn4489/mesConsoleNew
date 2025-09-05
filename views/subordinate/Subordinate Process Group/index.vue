<template>
  <div>
    <!-- 页面大标题 -->
    <div class="header">
      <h1>下级组创建</h1>
      <el-button type="primary" @click="openCreateDialog">创建</el-button>
    </div>

    <!-- 分组展示数据 -->
    <div v-if="subordinateGroups.length">
      <div v-for="(group, index) in subordinateGroups" :key="group.process_group_id" class="group-container">
        <h3>{{ group.process_group_name }}</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>项目组ID：</strong> {{ group.process_group_id }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>项目组名称：</strong> {{ group.process_group_name }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>项目组描述：</strong> {{ group.process_group_description }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>父项目组ID：</strong> {{ group.up_process_group_id }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>状态：</strong>
              <span v-if="group.status === 1">激活</span>
              <span v-else-if="group.status === 2">禁用</span>
              <span v-else-if="group.status === 3">待审核</span>
              <span v-else-if="group.status === 4">已完成</span>
              <span v-else>未知</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>任务：</strong> {{ group.tasks ? group.tasks : '无任务' }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>设备：</strong> {{ group.equipments ? group.equipments : '无设备' }}
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
        <el-form-item label="项目组名称" prop="process_group_name" :rules="[{ required: true, message: '请输入项目组名称', trigger: 'blur' }]">
          <el-input v-model="newGroup.process_group_name" placeholder="请输入项目组名称"></el-input>
        </el-form-item>

        <!-- 项目组描述 -->
        <el-form-item label="项目组描述" prop="process_group_description" :rules="[{ required: true, message: '请输入项目组描述', trigger: 'blur' }]">
          <el-input v-model="newGroup.process_group_description" placeholder="请输入项目组描述"></el-input>
        </el-form-item>

        <!-- 状态选择 -->
        <el-form-item label="状态" prop="status" :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]">
          <el-select v-model="newGroup.status" placeholder="请选择状态">
            <el-option :label="'激活'" :value="1"></el-option>
            <el-option :label="'禁用'" :value="2"></el-option>
            <el-option :label="'待审核'" :value="3"></el-option>
            <el-option :label="'已完成'" :value="4"></el-option>
          </el-select>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSubordinateGroup, subordinateGroupCreate } from '@/api/SubordinateGroup'; // 引入api

export default {
  data() {
    return {
      // 存储从后台获取的下属项目组数据
      subordinateGroups: [],
      // 弹窗显示状态
      createDialogVisible: false,
      // 新创建项目组的数据模型
      newGroup: {
        process_group_name: '',
        process_group_description: '',
        status: 1,
        up_process_group_id: 1 // 默认父项目组ID
      }
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
        if (response.code === 0) {
          this.subordinateGroups = response.data;
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
        process_group_name: '',
        process_group_description: '',
        status: 1,
        up_process_group_id: 1
      };
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
