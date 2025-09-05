<template>
  <div>
    <!-- 页面大标题 -->
    <div class="header">
      <h1>物流表</h1>
    </div>

    <!-- 运输请求信息展示 -->
    <div v-if="transportRequestList.length">
      <div v-for="(request, index) in transportRequestList" :key="request.oai_id" class="oai-container">
        <h3>运输请求ID：{{ request.oai_transportid }}</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>来源类型：</strong> {{ getTypeName(request.oai_type) }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>目标类型：</strong> {{ getTypeName(request.oai_lotype) }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>状态：</strong> {{ request.oai_status }}
            </div>
          </el-col>
        </el-row>
        <!-- 更改状态按钮 -->
        <el-button @click="openStatusDialog(request.oai_id, request.oai_status)" type="primary" size="small">
          更改状态
        </el-button>
      </div>
    </div>

    <!-- 弹窗：更改状态 -->
    <el-dialog
      title="更改运输请求状态"
      :visible.sync="statusDialogVisible"
      width="40%"
      @close="resetStatusForm">
      <el-form :model="statusForm" ref="statusForm" label-width="120px">
        <!-- 状态选择 -->
        <el-form-item label="状态" prop="oai_status" :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]">
          <el-select v-model="statusForm.oai_status" placeholder="请选择状态">
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="未完成" value="未完成"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitStatusUpdate">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOAI, updateOAI } from '@/api/OAI'; // 引入api

export default {
  data() {
    return {
      // 存储获取的运输请求数据
      transportRequestList: [],
      // 弹窗显示状态
      statusDialogVisible: false,
      // 当前需要更新的运输请求ID
      currentOAIId: null,
      // 存储状态选择的数据模型
      statusForm: {
        oai_status: ''
      }
    };
  },
  methods: {
    // 获取运输请求数据
    async fetchTransportRequests() {
      try {
        const response = await getOAI();
        if (response.code === 0) {
          this.transportRequestList = response.data;
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 打开更改状态的弹窗
    openStatusDialog(oai_id, currentStatus) {
      this.currentOAIId = oai_id;
      this.statusForm.oai_status = currentStatus; // 填充当前状态
      this.statusDialogVisible = true;
    },

    // 提交更改状态
    async submitStatusUpdate() {
      try {
        const response = await updateOAI({
          oai_id: this.currentOAIId,
          oai_status: this.statusForm.oai_status,
        });
        if (response.code === 0) {
          this.$message.success('运输请求状态更新成功');
          this.statusDialogVisible = false;
          this.fetchTransportRequests(); // 刷新运输请求列表
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 重置状态表单
    resetStatusForm() {
      this.statusForm.oai_status = ''; // 清空表单
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
