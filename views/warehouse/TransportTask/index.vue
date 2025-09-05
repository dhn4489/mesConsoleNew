<template>
  <div class="transport-task">
    <el-table :data="transportTasks" border style="width: 100%">
      <el-table-column prop="id" label="任务ID" width="80" />
      <el-table-column prop="fromLocation" label="出发地" />
      <el-table-column prop="fromType" label="出发地类型">
        <template #default="scope">
          <span>{{ getTypeText(scope.row.fromType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="toLocation" label="目的地" />
      <el-table-column prop="toType" label="目的地类型">
        <template #default="scope">
          <span>{{ getTypeText(scope.row.toType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createrId" label="创建人ID" />
      <el-table-column prop="description" label="物品描述" />
      <el-table-column prop="managerId" label="运输负责组">
        <template #default="scope">
          <span>{{ getManagerName(scope.row.managerId) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <span>{{ getStatusText(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="editTransport(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="deleteTransport(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改任务的对话框 -->
    <el-dialog
      title="修改运输任务"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditForm"
    >
      <el-form :model="editForm" ref="editFormRef">
        <el-form-item label="出发地" prop="fromLocation">
          <el-input v-model="editForm.fromLocation" />
        </el-form-item>
        <el-form-item label="出发地类型" prop="fromType">
          <el-select v-model="editForm.fromType" placeholder="请选择出发地类型">
            <el-option label="仓库" :value="1" />
            <el-option label="工艺组" :value="2" />
            <el-option label="供应商" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="目的地" prop="toLocation">
          <el-input v-model="editForm.toLocation" />
        </el-form-item>
        <el-form-item label="目的地类型" prop="toType">
          <el-select v-model="editForm.toType" placeholder="请选择目的地类型">
            <el-option label="仓库" :value="1" />
            <el-option label="工艺组" :value="2" />
            <el-option label="经销商" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人ID" prop="createrId">
          <el-input v-model="editForm.createrId" />
        </el-form-item>
        <el-form-item label="物品描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="运输负责组" prop="managerId">
          <el-select v-model="editForm.managerId" placeholder="请选择运输负责组">
            <el-option
              v-for="team in logisticTeams"
              :key="team.logisticsteam_id"
              :label="team.logisticsteam_name"
              :value="team.logisticsteam_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option label="请求" :value="1" />
            <el-option label="未开始" :value="2" />
            <el-option label="待发出" :value="3" />
            <el-option label="待接收" :value="4" />
            <el-option label="已完成" :value="5" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllTransportTasks, updateTransportRequest, deleteTransportTask, getAllLogisticsteam } from '@/api/warehouse';

export default {
  data() {
    return {
      transportTasks: [], // 存储所有运输任务
      logisticTeams: [], // 存储运输组列表
      editDialogVisible: false, // 控制修改对话框的显示
      editForm: {
        id: null,
        fromLocation: '',
        fromType: 1, // 默认选择仓库
        toLocation: '',
        toType: 1, // 默认选择仓库
        createrId: '',
        description: '',
        managerId: '', // 运输组ID
        status: 1, // 默认状态为请求
      },
    };
  },
  methods: {
    // 获取运输任务列表
    async fetchTransportTasks() {
      try {
        const res = await getAllTransportTasks(1); // 假设 logisticsteamId 为 1
        if (res.code === 0) {
          this.transportTasks = res.data;
        } else {
          this.$message.error('获取运输任务失败');
        }
      } catch (error) {
        console.error('获取运输任务列表失败', error);
        this.$message.error('获取运输任务列表失败');
      }
    },

    // 获取所有运输组
    async fetchLogisticTeams() {
      try {
        const res = await getAllLogisticsteam(); // 调用正确的接口
        if (res.code === 0) {
          // 过滤出运输组类型为 3 的组（即运输组）
          this.logisticTeams = res.data.filter(team => team.logisticsteam_type === 3);
        } else {
          this.$message.error('获取运输组失败');
        }
      } catch (error) {
        console.error('获取运输组列表失败', error);
        this.$message.error('获取运输组列表失败');
      }
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        1: '请求',
        2: '未开始',
        3: '待发出',
        4: '待接收',
        5: '已完成',
      };
      return statusMap[status] || '未知';
    },

    // 获取类型文本
    getTypeText(type) {
      const typeMap = {
        1: '仓库',
        2: '工艺组',
        3: '供应商/经销商',
      };
      return typeMap[type] || '未知';
    },

    // 获取运输负责组名称
    getManagerName(managerId) {
      const team = this.logisticTeams.find(team => team.logisticsteam_id === managerId);
      return team ? team.logisticsteam_name : '未知';
    },

    // 格式化日期时间
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    },

    // 编辑运输任务
    editTransport(task) {
      this.editForm = { ...task };
      this.editDialogVisible = true;
    },

    // 提交编辑表单
    async submitEditForm() {
      try {
        const res = await updateTransportRequest(1, this.editForm); // 假设 logisticsteamId 为 1
        if (res.code === 0) {
          this.$message.success('任务修改成功');
          this.editDialogVisible = false;
          this.fetchTransportTasks(); // 重新加载任务
        } else {
          this.$message.error('修改任务失败');
        }
      } catch (error) {
        console.error('修改任务失败', error);
        this.$message.error('修改任务失败');
      }
    },

    // 删除运输任务
    async deleteTransport(taskId) {
      try {
        const res = await deleteTransportTask(1, taskId); // 假设 logisticsteamId 为 1
        if (res.code === 0) {
          this.$message.success('任务删除成功');
          this.fetchTransportTasks(); // 重新加载任务
        } else {
          this.$message.error('删除任务失败');
        }
      } catch (error) {
        console.error('删除任务失败', error);
        this.$message.error('删除任务失败');
      }
    },

    // 重置编辑表单
    resetEditForm() {
      this.$refs.editFormRef.resetFields();
    },
  },

  mounted() {
    this.fetchTransportTasks(); // 加载运输任务列表
    this.fetchLogisticTeams(); // 加载运输组列表
  },
};
</script>

<style scoped>
.transport-task {
  padding: 20px;
}
.dialog-footer {
  text-align: right;
}
</style>
