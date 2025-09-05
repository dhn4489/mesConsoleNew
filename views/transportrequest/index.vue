<template>
  <div>
    <!-- 页面大标题 -->
    <div class="header">
      <h1>物流表</h1>
      <el-button type="primary" @click="openCreateDialog">创建运输请求</el-button>
    </div>

    <!-- 运输请求信息展示 -->
    <div v-if="transportRequestList.length">
      <div v-for="(request, index) in transportRequestList" :key="request.id" class="oai-container">
        <h3>运输请求ID：{{ request.id }}</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>来源类型：</strong> {{ getTypeName(request.fromType) }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>目标类型：</strong> {{ getTypeName(request.toType) }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>状态：</strong> {{ getStatusName(request.status) }}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 弹窗：创建运输请求 -->
    <el-dialog
      title="创建运输请求"
      :visible.sync="createTransportDialogVisible"
      width="50%"
      @close="resetCreateTransportForm">
      <el-form :model="newTransportRequest" ref="createTransportForm" label-width="120px">
        <!-- 来源ID -->
        <el-form-item label="来源ID" prop="fromId" :rules="[{ required: true, message: '请输入来源ID', trigger: 'blur' }]">
          <el-input v-model="newTransportRequest.fromId" placeholder="请输入来源ID" type="number"></el-input>
        </el-form-item>

        <!-- 目标ID -->
        <el-form-item label="目标ID" prop="toId" :rules="[{ required: true, message: '请输入目标ID', trigger: 'blur' }]">
          <el-input v-model="newTransportRequest.toId" placeholder="请输入目标ID" type="number"></el-input>
        </el-form-item>

        <!-- 来源类型 -->
        <el-form-item label="来源类型" prop="fromType" :rules="[{ required: true, message: '请选择来源类型', trigger: 'blur' }]">
          <el-select v-model="newTransportRequest.fromType" placeholder="请选择来源类型">
            <el-option label="仓库" value="1"></el-option>
            <el-option label="工艺组" value="2"></el-option>
            <el-option label="经销商" value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- 目标类型 -->
        <el-form-item label="目标类型" prop="toType" :rules="[{ required: true, message: '请选择目标类型', trigger: 'blur' }]">
          <el-select v-model="newTransportRequest.toType" placeholder="请选择目标类型">
            <el-option label="仓库" value="1"></el-option>
            <el-option label="工艺组" value="2"></el-option>
            <el-option label="经销商" value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- 来源位置 -->
        <el-form-item label="来源位置" prop="fromLocation">
          <el-input v-model="newTransportRequest.fromLocation" placeholder="请输入来源位置"></el-input>
        </el-form-item>

        <!-- 目标位置 -->
        <el-form-item label="目标位置" prop="toLocation">
          <el-input v-model="newTransportRequest.toLocation" placeholder="请输入目标位置"></el-input>
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="描述" prop="description">
          <el-input v-model="newTransportRequest.description" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createTransportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateTransportForm">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTransportRequest, createTransportRequest } from '@/api/transport'; // 引入api

export default {
  data() {
    return {
      // 存储获取的运输请求数据
      transportRequestList: [],
      // 弹窗显示状态
      createTransportDialogVisible: false,
      // 创建运输请求的数据模型
      newTransportRequest: {
        fromId: '',
        toId: '',
        fromType: '',
        toType: '',
        fromLocation: '',
        toLocation: '',
        description: ''
      }
    };
  },
  methods: {
    // 获取运输请求数据
    async fetchTransportRequests() {
      try {
        const response = await getTransportRequest();
        if (response.code === 0) {
          this.transportRequestList = response.data;
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 打开创建运输请求弹窗
    openCreateDialog() {
      this.createTransportDialogVisible = true;
    },

    // 提交创建运输请求表单
    async submitCreateTransportForm() {
      try {
        const response = await createTransportRequest(this.newTransportRequest);
        if (response.code === 0) {
          this.$message.success('运输请求创建成功');
          this.createTransportDialogVisible = false;
          this.fetchTransportRequests(); // 刷新运输请求列表
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 重置创建运输请求表单
    resetCreateTransportForm() {
      this.newTransportRequest = {
        fromId: '',
        toId: '',
        fromType: '',
        toType: '',
        fromLocation: '',
        toLocation: '',
        description: ''
      };
    },

    // 获取类型名称
    getTypeName(type) {
      const typeMap = {
        1: '仓库',
        2: '工艺组',
        3: '经销商'
      };
      return typeMap[type] || '未知类型';
    },

    // 获取状态名称
    getStatusName(status) {
      const statusMap = {
        1: '待处理',
        2: '处理中',
        3: '已完成'
      };
      return statusMap[status] || '未知状态';
    },

    // 根据index改变每行的背景色
    getItemStyle(index) {
      return {
        backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff'
      };
    }
  },
  mounted() {
    this.fetchTransportRequests(); // 页面加载时获取运输请求数据
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
.oai-container {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.action-container {
  margin-top: 10px;
}
</style>
