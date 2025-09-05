<template>
  <div>
    <h1>Project Overview</h1>
    <div class="project-container">
      <!-- Iterate over tasks and display each one -->
      <div v-for="task in tableData" :key="task.task_id" class="task-card">
        <h3>{{ task.task_name }}</h3>
        <div class="task-details">
          <div class="task-field">
            <strong>Task ID:</strong> <span>{{ task.task_id }}</span>
          </div>
          <div class="task-field">
            <strong>Priority:</strong> <span>{{ task.task_priority }}</span>
          </div>
          <div class="task-field">
            <strong>Status:</strong> <span>{{ translateStatus(task.task_status) }}</span>
          </div>
          <div class="task-field">
            <strong>Start Date:</strong> <span>{{ formatDate(task.task_start_date) }}</span>
          </div>
          <div class="task-field">
            <strong>End Date:</strong> <span>{{ formatDate(task.task_end_date) }}</span>
          </div>
          <div class="task-field">
            <strong>Budget:</strong> <span>{{ task.budget }}</span>
          </div>
          <div class="task-field">
            <strong>Description:</strong> <span>{{ task.task_description || "No description" }}</span>
          </div>
          <div class="task-field">
            <strong>Assignee ID:</strong> <span>{{ task.assignee_id || "N/A" }}</span>
          </div>
          <div class="task-field">
            <strong>Process Group ID:</strong> <span>{{ task.process_group_id || "N/A" }}</span>
          </div>
          <div class="task-field">
            <strong>Dependencies:</strong> <span>{{ task.taskDependency ? task.taskDependency.join(', ') : "None" }}</span>
          </div>
        </div>

        <!-- Action buttons with flex layout -->
        <div class="task-actions">
          <el-button @click="viewData(task.task_id)" type="primary" size="small">查看数据</el-button>
          <el-button @click="submitData(task)" type="success" size="small">提交数据</el-button>
          <el-button @click="submitSummary(task.task_id)" type="info" size="small">提交总结</el-button>
          <el-button @click="viewSummary(task.task_id)" type="warning" size="small">查看总结</el-button>
          <el-button @click="updateStatus(task)" type="danger" size="small">修改状态</el-button>
        </div>
      </div>
    </div>

    <p v-if="!tableData.length">Loading project data...</p>

    <!-- Data Modal -->
    <el-dialog :visible.sync="showDataModal" :title="'Task Data'">
      <pre>{{ taskData }}</pre>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('data')">关闭</el-button>
      </span>
    </el-dialog>

    <!-- Submit Data Modal -->
    <el-dialog :visible.sync="showSubmitModal" :title="'Submit Data'">
      <el-form @submit.prevent="submitCollectedData">
        <el-form-item label="Inspection Type">
          <el-input v-model="collectedData.inspectionType" required />
        </el-form-item>
        <el-form-item label="Inspection Date">
          <el-input v-model="collectedData.inspectionDate" type="number" required />
        </el-form-item>
        <el-form-item label="Defect Type">
          <el-input v-model="collectedData.defectType" required />
        </el-form-item>
        <el-form-item label="Notes">
          <el-input v-model="collectedData.notes" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('submit')">取消</el-button>
        <el-button type="primary" @click="submitCollectedData">提交</el-button>
      </span>
    </el-dialog>

    <!-- Summary Modal -->
    <el-dialog :visible.sync="showSummaryModal" :title="'Task Summary'">
      <pre>{{ summaryData }}</pre>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('summary')">关闭</el-button>
      </span>
    </el-dialog>

    <!-- Update Status Modal -->
    <el-dialog :visible.sync="showStatusModal" :title="'Update Task Status'">
      <el-form @submit.prevent="updateTaskStatus">
        <el-form-item label="Status">
          <el-select v-model="statusForm.task_status" required>
            <el-option label="Not Started" :value="0"></el-option>
            <el-option label="In Progress" :value="1"></el-option>
            <el-option label="Completed" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="End Date">
          <el-date-picker v-model="statusForm.task_end_date" type="date" required />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('status')">取消</el-button>
        <el-button type="primary" @click="updateTaskStatus">更新状态</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskData, insertTaskData, generateSummary, getSummaryByTaskId, UpdateTask,gettaskDecomposition } from "@/api/task";

export default {
  data() {
    return {
      tableData: [],
      showDataModal: false,
      showSubmitModal: false,
      showSummaryModal: false,
      showStatusModal: false,
      taskData: null,
      summaryData: null,
      collectedData: {
        taskId: null,
        taskName: '',
        inspectionType: '',
        inspectionDate: null,
        defectType: '',
        createdAt: new Date().toISOString().split('T')[0],
        notes: ''
      },
      statusForm: {
task_id: null,
        task_name: '',                 // 新增 task_name
        task_description: '',         // 新增 task_description
        task_priority: 0,             // 新增 task_priority
        task_status: 0,
        task_start_date: '',          // 新增 task_start_date
        task_end_date: '',
        assignee_id: null,            // 新增 assignee_id
        process_group_id: null,       // 新增 process_group_id
        taskDependency: null,         // 新增 taskDependency
        budget: 0,                    // 新增 budget
        file_id: 0,                   // 新增 file_id
        projectGroup: 0               // 新增 projectGroup
      }
    };
  },
  created() {
    this.fetchProjectData();
  },
  methods: {
    async fetchProjectData() {
      try {
        const response = await gettaskDecomposition();
        if (response.code === 0) {
          this.tableData = response.data;
        } else {
          console.error("Failed to fetch project data:", response.message);
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    },

    async viewData(taskId) {
      try {
        const response = await getTaskData(taskId);
        if (response.code === 0) {
          this.taskData = response.data;
          this.showDataModal = true;
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    },

    closeModal(modalType) {
      if (modalType === 'data') this.showDataModal = false;
      else if (modalType === 'submit') this.showSubmitModal = false;
      else if (modalType === 'summary') this.showSummaryModal = false;
      else if (modalType === 'status') this.showStatusModal = false;
    },

    submitData(task) {
      this.collectedData.taskId = task.task_id;
      this.collectedData.taskName = task.task_name;
      this.showSubmitModal = true;
    },

    async submitCollectedData() {
    try {
        const response = await insertTaskData(this.collectedData);
        if (response.code === 0) {
        this.$message.success("数据提交成功！");
        this.closeModal('submit');  // 关闭提交数据弹窗
        this.fetchProjectData();    // 刷新任务数据
        } else {
        this.$message.error(`数据提交失败：${response.message}`);
        }
    } catch (error) {
        console.error("Error submitting data:", error);
    }
    },


    async submitSummary(taskId) {
      try {
        const response = await generateSummary(taskId);
        if (response.code === 0) {
          this.summaryData = response.data;
          this.showSummaryModal = true;
        }
      } catch (error) {
        console.error("Error submitting summary:", error);
      }
    },

    async viewSummary(taskId) {
      try {
        const response = await getSummaryByTaskId(taskId);
        if (response.code === 0) {
          this.summaryData = response.data;
          this.showSummaryModal = true;
        }
      } catch (error) {
        console.error("Error viewing summary:", error);
      }
    },

    async updateStatus(task) {
 this.statusForm = {
    task_id: task.task_id,                    // 更新 task_id
    task_name: task.task_name || '',          // 更新 task_name，默认为空字符串
    task_description: task.task_description || '', // 如果为空，使用空字符串
    task_priority: task.task_priority || 0,    // 如果为空，使用默认优先级 0
    task_status: task.task_status,            // 更新 task_status
    task_start_date: task.task_start_date || '', // 如果为空，使用空字符串
    task_end_date: task.task_end_date || '',  // 更新 task_end_date，默认为空字符串
    assignee_id: task.assignee_id || null,    // 更新 assignee_id
    process_group_id: task.process_group_id || null, // 更新 process_group_id
    taskDependency: task.taskDependency || null,   // 如果为空，使用 null
    budget: task.budget || 0,                 // 如果为空，使用默认预算 0
    file_id: task.file_id || 0,               // 如果为空，使用默认值 0
    projectGroup: task.projectGroup || 0      // 如果为空，使用默认值 0
  };

  this.showStatusModal = true; // 显示模态框
    },

    async updateTaskStatus() {
  try {
    console.log('this.statusForm:', this.statusForm);
    const response = await UpdateTask(this.statusForm);
    
    if (response.code === 0) {
      this.$message.success("任务状态更新成功！");
      this.closeModal('status');  // 关闭修改状态弹窗
      this.fetchProjectData();    // 刷新任务数据
    } else {
      this.$message.error(`任务状态更新失败：${response.message}`);
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
},


    translateStatus(statusCode) {
      const statuses = {
        0: 'Not Started',
        1: 'In Progress',
        2: 'Completed'
      };
      return statuses[statusCode] || 'Unknown';
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.project-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.task-card {
  border: 1px solid #ddd;
  padding: 15px;
  width: 250px;
  border-radius: 5px;
}

.task-details {
  margin-bottom: 10px;
}

.task-field {
  margin-bottom: 8px;
}

.task-actions {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap onto the next line */
  gap: 10px;
  margin-top: 15px;
  justify-content: flex-start; /* Ensure buttons align to the left */
  padding-right: 10px; /* Ensure padding within the task card */
}
</style>
