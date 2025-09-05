<template>
  <div>
    <!-- 页面大标题 -->
    <div class="header">
      <h1>资金审批列表</h1>
      <el-button type="primary" @click="openCreateDialog">创建资金审批</el-button>
    </div>

    <!-- 资金审批展示数据 -->
    <div v-if="fundApprovals.length">
      <div v-for="(approval, index) in fundApprovals" :key="approval.id" class="approval-container">
        <h3>审批编号：{{ approval.id }}</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>申请人：</strong> {{ approval.applicant }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>金额：</strong> {{ approval.amount }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>申请用途：</strong> {{ approval.purpose ? approval.purpose : '无' }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>状态：</strong>
              <span v-if="approval.status === 0">待审核</span>
              <span v-if="approval.status === 1">已批准</span>
              <span v-if="approval.status === 2">已拒绝</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>创建日期：</strong> {{ approval.creationDate }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item" :style="getItemStyle(index)">
              <strong>审批日期：</strong> {{ approval.approvalDate ? approval.approvalDate : '未审批' }}
            </div>
          </el-col>
        </el-row>

        <!-- 修改按钮固定位置 -->
        <div class="action-container">
          <el-button @click="openUpdateDialog(approval)" type="primary">修改</el-button>
        </div>
      </div>
    </div>

    <!-- 弹窗：创建资金审批 -->
    <el-dialog
      title="创建资金审批"
      :visible.sync="createDialogVisible"
      width="50%"
      @close="resetCreateForm">
      <el-form :model="newApproval" ref="createForm" label-width="120px">
        <!-- 金额 -->
        <el-form-item label="金额" prop="amount" :rules="[{ required: true, message: '请输入金额', trigger: 'blur' }]">
          <el-input v-model="newApproval.amount" placeholder="请输入金额" type="number"></el-input>
        </el-form-item>

        <!-- 申请用途 -->
        <el-form-item label="申请用途" prop="purpose" :rules="[{ required: true, message: '请输入申请用途', trigger: 'blur' }]">
          <el-input v-model="newApproval.purpose" placeholder="请输入申请用途"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateForm">提交</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗：更新资金审批 -->
    <el-dialog
      title="更新资金审批"
      :visible.sync="updateDialogVisible"
      width="50%"
      @close="resetUpdateForm">
      <el-form :model="updateApproval" ref="updateForm" label-width="120px">
        <!-- 金额 -->
        <el-form-item label="金额" prop="amount" :rules="[{ required: true, message: '请输入金额', trigger: 'blur' }]">
          <el-input v-model="updateApproval.amount" placeholder="请输入金额" type="number"></el-input>
        </el-form-item>

        <!-- 申请用途 -->
        <el-form-item label="申请用途" prop="purpose" :rules="[{ required: true, message: '请输入申请用途', trigger: 'blur' }]">
          <el-input v-model="updateApproval.purpose" placeholder="请输入申请用途"></el-input>
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
import { getFundApprovalStatusList, createFundApproval, updateFundApproval } from '@/api/fund'; // 引入api

export default {
  data() {
    return {
      // 存储从后台获取的资金审批数据
      fundApprovals: [],
      // 弹窗显示状态
      createDialogVisible: false,
      updateDialogVisible: false,
      // 新创建资金审批的数据模型
      newApproval: {
        amount: '',
        purpose: ''
      },
      // 更新资金审批的数据模型
      updateApproval: {
        id: '',
        amount: '',
        purpose: ''
      }
    };
  },
  methods: {
    // 打开创建资金审批弹窗
    openCreateDialog() {
      this.createDialogVisible = true;
    },

    // 打开更新资金审批弹窗
    openUpdateDialog(approval) {
      this.updateApproval.id = approval.id;
      this.updateApproval.amount = approval.amount;
      this.updateApproval.purpose = approval.purpose;
      this.updateDialogVisible = true;
    },

    // 获取资金审批列表
    async fetchFundApprovals() {
      try {
        const response = await getFundApprovalStatusList();
        if (response.code === 0) {
          this.fundApprovals = response.data;
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 提交创建资金审批表单
    async submitCreateForm() {
      try {
        const response = await createFundApproval(this.newApproval);
        if (response.code === 0) {
          this.$message.success('资金审批创建成功');
          this.createDialogVisible = false;
          this.fetchFundApprovals(); // 更新审批列表
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 提交更新资金审批表单
    async submitUpdateForm() {
      try {
        const response = await updateFundApproval(this.updateApproval);
        if (response.code === 0) {
          this.$message.success('资金审批更新成功');
          this.updateDialogVisible = false;
          this.fetchFundApprovals(); // 更新审批列表
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 重置创建表单
    resetCreateForm() {
      this.newApproval = {
        amount: '',
        purpose: ''
      };
    },

    // 重置更新表单
    resetUpdateForm() {
      this.updateApproval = {
        id: '',
        amount: '',
        purpose: ''
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
    this.fetchFundApprovals(); // 页面加载时获取资金审批数据
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

.approval-container {
  margin-bottom: 30px;
  position: relative; /* 设置相对定位以便按钮可以绝对定位 */
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

.action-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
