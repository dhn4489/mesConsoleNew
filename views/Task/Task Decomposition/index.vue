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
          <!-- For In Progress, add View Data Button -->
          <el-button v-if="task.task_status === 1" @click="viewData(task.task_id)" type="primary" size="small">查看数据</el-button>
          <!-- For Completed, add View Summary Button -->
          <el-button v-if="task.task_status === 2" @click="viewSummary(task.task_id)" type="warning" size="small">查看总结</el-button>
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

    <!-- Summary Modal -->
    <el-dialog :visible.sync="showSummaryModal" :title="'Task Summary'">
      <pre>{{ summaryData }}</pre>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('summary')">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskData, getSummaryByTaskId, gettaskDecomposition } from "@/api/task";

export default {
  data() {
    return {
      tableData: [],
      showDataModal: false,
      showSummaryModal: false,
      taskData: null,
      summaryData: null,
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
          this.showDataModal = true;  // Show the modal with task data
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    },

    closeModal(modalType) {
      if (modalType === 'data') this.showDataModal = false;
      else if (modalType === 'summary') this.showSummaryModal = false;
    },

    async viewSummary(taskId) {
      try {
        const response = await getSummaryByTaskId(taskId);
        if (response.code === 0) {
          this.summaryData = response.data;
          this.showSummaryModal = true; // Show the modal with summary data
        }
      } catch (error) {
        console.error("Error viewing summary:", error);
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
