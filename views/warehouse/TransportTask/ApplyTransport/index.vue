<template>
    <div class="transport-task-page">
      <h2>运输任务管理</h2>
  
      <!-- 创建运输任务 -->
      <el-card class="create-task-card" shadow="hover">
        <h3>创建运输任务</h3>
        <el-form :model="newTaskForm" ref="taskForm" label-width="100px">
          <el-form-item label="出发地">
            <el-input v-model="newTaskForm.fromLocation" placeholder="请输入出发地"></el-input>
          </el-form-item>
          <el-form-item label="目的地">
            <el-input v-model="newTaskForm.toLocation" placeholder="请输入目的地"></el-input>
          </el-form-item>
          <el-form-item label="任务描述">
            <el-input v-model="newTaskForm.description" placeholder="请输入任务描述"></el-input>
          </el-form-item>
          <el-form-item label="出发地类型">
            <el-select v-model="newTaskForm.fromType" placeholder="请选择出发地类型">
              <el-option label="仓库" :value="1"></el-option>
              <el-option label="工艺组" :value="2"></el-option>
              <el-option label="供应商" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目的地类型">
            <el-select v-model="newTaskForm.toType" placeholder="请选择目的地类型">
              <el-option label="仓库" :value="1"></el-option>
              <el-option label="工艺组" :value="2"></el-option>
              <el-option label="经销商" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createTask">创建任务</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <!-- 查看运输任务列表 -->
      <el-table :data="tasks" style="margin-top: 30px;" border stripe>
        <el-table-column prop="id" label="任务ID" width="80"></el-table-column>
        <el-table-column prop="fromLocation" label="出发地"></el-table-column>
        <el-table-column prop="toLocation" label="目的地"></el-table-column>
        <el-table-column
          :formatter="statusFormatter"
          prop="status"
          label="状态"
        ></el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button
              size="mini"
              @click="viewTaskDetails(scope.row)"
              type="primary"
              icon="el-icon-view"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  import { createTransportTask, getAllTransportTasks } from '@/api/warehouse';
  import store from '@/store'
const foreignid = store.getters.foreignid
  export default {
    data() {
      return {
        newTaskForm: {
          fromLocation: '',
          toLocation: '',
          description: '',
          fromType: 1,
          toType: 1,
        },
        tasks: [], // 存储所有运输任务
      };
    },
    created() {
      this.fetchAllTasks(); // 页面创建时获取所有任务
    },
    methods: {
      // 获取所有运输任务
      async fetchAllTasks() {
        const logisticsteamId = foreignid; // 可以根据实际情况传递
        const response = await getAllTransportTasks(logisticsteamId);
        if (response.code === 0) {
          this.tasks = response.data;
        } else {
          this.$message.error('获取任务失败');
        }
      },
  
      // 创建运输任务
      async createTask() {
        const logisticsteamId = 1; // 可以根据实际情况传递
        const data = this.newTaskForm;
        const response = await createTransportTask(logisticsteamId, data);
        if (response.code === 0) {
          this.$message.success('运输任务创建成功');
          this.fetchAllTasks(); // 刷新任务列表
          this.$refs.taskForm.resetFields(); // 重置表单
        } else {
          this.$message.error('运输任务创建失败');
        }
      },
  
      // 状态格式化
      statusFormatter(row, column, cellValue) {
        const statusMap = {
          1: '请求',
          2: '未开始',
          3: '待发出',
          4: '待接收',
          5: '已完成',
        };
        return statusMap[cellValue] || '未知状态';
      },
  
      // 查看任务详情
      viewTaskDetails(task) {
        // 在这里实现查看任务详情的逻辑
        this.$message.info(`查看任务ID：${task.id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .transport-task-page {
    padding: 20px;
  }
  .create-task-card {
    margin-bottom: 30px;
  }
  </style>
  