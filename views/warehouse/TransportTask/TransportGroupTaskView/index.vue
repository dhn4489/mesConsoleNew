<template>
  <div class="transport-task-management">
    <!-- 页面标题 -->
    <el-row>
      <el-col :span="24">
        <el-card>
          <h3>运输任务管理</h3>
          <!-- 任务列表 -->
          <el-table :data="tasks" border stripe>
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
                <el-button
                  v-if="canModifyTask(scope.row)"
                  size="mini"
                  @click="editTask(scope.row)"
                  type="warning"
                  icon="el-icon-edit"
                  >修改</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 任务详情对话框 -->
    <el-dialog :visible.sync="taskDialogVisible" title="任务详情">
      <el-form :model="currentTask" label-width="100px">
        <el-form-item label="任务ID">
          <el-input v-model="currentTask.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="出发地">
          <el-input v-model="currentTask.fromLocation" disabled></el-input>
        </el-form-item>
        <el-form-item label="目的地">
          <el-input v-model="currentTask.toLocation" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentTask.status" disabled>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentTask.description" type="textarea" rows="4" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="currentTask.createTime" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改任务状态对话框 -->
    <el-dialog :visible.sync="editDialogVisible" title="修改任务状态">
      <el-form :model="editTaskForm" label-width="100px">
        <el-form-item label="任务ID">
          <el-input v-model="editTaskForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editTaskForm.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editTaskForm.description" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEditedTask">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTransportByManagerId, updateTransportRequest } from '@/api/warehouse';
import store from '@/store'
const foreignid = store.getters.foreignid
export default {
  data() {
    return {
      tasks: [], // 运输任务列表
      taskDialogVisible: false, // 控制任务详情对话框的显示与隐藏
      editDialogVisible: false, // 控制修改任务对话框的显示与隐藏
      currentTask: {}, // 当前查看的任务
      editTaskForm: {}, // 当前编辑的任务表单
      statusOptions: [
        
        { value: 3, label: '待发出' },
        { value: 4, label: '待接收' },
        
      ], // 状态选项
    };
  },
  created() {
    this.fetchTransportTasks(); // 获取运输任务列表
  },
  methods: {
    // 获取运输任务列表
    async fetchTransportTasks() {
      //const logisticsteamId = 1; // 传入运输组ID（根据实际情况更改）
      const managerId = 1; // 传入当前用户ID（根据实际情况更改）弃用
      console.log("注意注意，下面将输出console.log(foreignid);！！！！！！！！！！！！！！！！！！！！！！");
      console.log(foreignid);
      const response = await getTransportByManagerId(foreignid, managerId);
      if (response.code === 0) {
        this.tasks = response.data;
      } else {
        this.$message.error('获取运输任务失败');
      }
    },

    // 格式化任务状态
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
      this.currentTask = { ...task };
      this.taskDialogVisible = true;
    },

    // 修改任务状态
    editTask(task) {
      this.editTaskForm = { ...task };
      this.editDialogVisible = true;
    },

    // 保存修改后的任务
    async saveEditedTask() {
      //const logisticsteamId = 1; // 传入运输组ID
      const data = { ...this.editTaskForm };
      const response = await updateTransportRequest(foreignid, data);
      if (response.code === 0) {
        this.$message.success('任务更新成功');
        this.editDialogVisible = false;
        this.fetchTransportTasks(); // 重新获取任务列表
      } else {
        this.$message.error('任务更新失败');
      }
    },

    // 判断当前用户是否有权限修改任务
    canModifyTask(task) {
      return task.status === 2 || task.status === 3; // 可修改的任务状态
    }
  },
};
</script>

<style scoped>
.transport-task-management {
  padding: 20px;
}
</style>
