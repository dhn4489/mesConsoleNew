<template>
  <div class="finance-approval">
    <el-card>
      <div slot="header">
        <span>资金审批</span>
      </div>

      <!-- 资金审批列表 -->
      <el-table
        v-if="filteredFundApprovalList.length > 0"
        :data="filteredFundApprovalList"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="id"
          label="申请ID"
          width="120"
        />
        <el-table-column
          prop="applicant"
          label="申请人"
          width="180"
        />
        <el-table-column
          prop="amount"
          label="金额"
          width="120"
        />
        <el-table-column
          prop="purpose"
          label="用途"
        />
        <el-table-column
          prop="creationDate"
          label="创建时间"
          width="180"
        />
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="primary"
              size="small"
              @click="approveFund(scope.row)"
            >
              批准
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="danger"
              size="small"
              @click="rejectFund(scope.row)"
            >
              驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 当没有待审批数据时显示的提示 -->
      <div v-else>
        <el-alert
          title="没有待审批的资金申请"
          type="info"
          show-icon
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getFundApprovalStatusList, updateFundApproval } from '@/api/finance';
import { MessageBox, Message } from 'element-ui';

export default {
  data() {
    return {
      fundApprovalList: [], // 所有资金审批列表
      filteredFundApprovalList: [] // 过滤后的待审批资金列表
    };
  },
  created() {
    this.fetchFundApprovalList();
  },
  methods: {
    // 获取资金审批状态列表，并过滤出待审批的资金申请
    async fetchFundApprovalList() {
      try {
        const response = await getFundApprovalStatusList();
        if (response.code === 0) {
          this.fundApprovalList = response.data;
          // 过滤出状态为待审批（status === 0）的资金申请
          this.filteredFundApprovalList = this.fundApprovalList.filter(fund => fund.status === 0);
        } else {
          Message.error(response.message || '获取资金审批列表失败');
        }
      } catch (error) {
        console.error('获取资金审批列表失败', error);
        Message.error('获取资金审批列表失败');
      }
    },

    // 批准资金申请
    async approveFund(fund) {
      try {
        const { id } = fund;
        const approvalDate = new Date().toISOString(); // 当前时间作为批准时间
        const response = await updateFundApproval({ id, status: 2, approvalDate });
        if (response.code === 0) {
          Message.success('资金申请已批准');
          this.fetchFundApprovalList(); // 重新加载列表
        } else {
          Message.error(response.message || '批准失败');
        }
      } catch (error) {
        console.error('批准资金申请失败', error);
        Message.error('批准资金申请失败');
      }
    },

    // 驳回资金申请
    async rejectFund(fund) {
      MessageBox.confirm('您确定要驳回该资金申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          const { id } = fund;
          const approvalDate = new Date().toISOString(); // 当前时间作为批准时间
          const response = await updateFundApproval({ id, status: 3, approvalDate });
          if (response.code === 0) {
            Message.success('资金申请已驳回');
            this.fetchFundApprovalList(); // 重新加载列表
          } else {
            Message.error(response.message || '驳回失败');
          }
        } catch (error) {
          console.error('驳回资金申请失败', error);
          Message.error('驳回资金申请失败');
        }
      }).catch(() => {
        // 用户取消操作
      });
    },
  },
};
</script>

<style scoped>
.finance-approval {
  padding: 20px;
}
</style>
