<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h1>Project Overview</h1>
      <el-button type="primary" @click="openDialog()">添加任务</el-button>
    </div>
    
    <div class="project-container">
      <!-- 遍历每个任务并显示其信息 -->
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
        <!-- 添加修改和删除按钮 -->
        <div class="task-actions">
          <el-button @click="openDialog(task)" type="warning" size="small">更改</el-button>
          <el-button @click="deleteTask(task.task_id)" type="danger" size="small">删除</el-button>
        </div>
      </div>
    </div>
    
    <p v-if="!tableData.length">Loading project data...</p>

    <!-- 弹窗 -->
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="newTask" label-width="120px">
        <el-form-item label="Task Name">
          <el-input v-model="newTask.taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="newTask.taskDescription" type="textarea" placeholder="请输入任务描述"></el-input>
        </el-form-item>
        <el-form-item label="Priority">
          <el-input-number v-model="newTask.taskPriority" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="newTask.taskStatus" placeholder="请选择任务状态">
            <el-option label="Not Started" :value="0"></el-option>
            <el-option label="In Progress" :value="1"></el-option>
            <el-option label="Completed" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Start Date">
          <el-date-picker v-model="newTask.taskStartDate" type="datetime" placeholder="请选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="End Date">
          <el-date-picker v-model="newTask.taskEndDate" type="datetime" placeholder="请选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="Budget">
          <el-input v-model="newTask.budget" placeholder="请输入预算"></el-input>
        </el-form-item>
        <el-form-item label="Assignee ID">
          <el-input v-model="newTask.assigneeId" placeholder="请输入负责人ID"></el-input>
        </el-form-item>
        <el-form-item label="Process Group ID">
          <el-input v-model="newTask.processGroupId" placeholder="请输入工艺组ID"></el-input>
        </el-form-item>
        <el-form-item label="Task Dependency">
          <el-input v-model="newTask.taskDependencyString" placeholder="请输入依赖任务ID（用逗号分隔）" @change="parseDependencies"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTask">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { gettaskDecomposition, Createtask,UpdateTask } from "@/api/task";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    return {
      tableData: [], // 存储任务数据
      dialogVisible: false, // 控制弹窗显示
      newTask: { // 表单数据
        taskName: "",
        taskDescription: "",
        taskPriority: 1,
        taskStatus: 0,
        taskStartDate: "",
        taskEndDate: "",
        budget: 0,
        assigneeId: "", // 负责人ID
        processGroupId: "", // 工艺组ID
        taskDependency: [], // 依赖任务
        taskDependencyString:"",
      },
    };
  },
  created() {
    this.fetchProjectData(); // 加载时获取数据
  },
  methods: {
    // 从后端获取数据
    async fetchProjectData() {
      try {
        const response = await gettaskDecomposition();
        console.log('get response',response)
        if (response.code === 0) {
          const rawData = response.data;
          this.tableData = rawData;
        } else {
          console.error("Failed to fetch project data:", response.message);
        }
      } catch (error) {
        console.error("API request failed:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token expired, redirecting to login...");
          removeToken();
          this.$router.push({ path: "/login" });
        }
      }
    },

    // 翻译任务状态
    translateStatus(status) {
      const statusMap = {
        0: "Not Started",
        1: "In Progress",
        2: "Completed",
      };
      return statusMap[status] || "Unknown";
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleString(); // 根据需要格式化日期
    },
 // 解析依赖任务字符串
  parseDependencies() {
    console.log('this.taskDependencyString',this.taskDependencyString)
    if (this.taskDependencyString) {
      
      this.newTask.taskDependency = this.taskDependencyString.split(',').map(id => id.trim()).filter(id => id); // 转换为数组并去除空值
    } else {
      this.newTask.taskDependency = [];
    }
    console.log(' this.newTask.taskDependency', this.newTask.taskDependency)
  },
  //转换格式
    // 打开弹窗
    openDialog(task = null) {
            if (task) {
             // console.log('edit task')
        // 如果是编辑，填充表单数据
        this.dialogTitle = "更改任务";
         // 手动初始化 newTask 的所有字段
    this.newTask = {
      taskId: task.task_id || null, // 确保 taskId 有值
      taskName: task.task_name || "", // 默认空字符串
      taskDescription: task.task_description || "", // 默认空字符串
      taskPriority: task.task_priority || 1, // 默认值 1
      taskStatus: task.task_status || 0, // 默认值 0
      taskStartDate: task.task_start_date || "", // 默认空字符串
      taskEndDate: task.task_end_date || "", // 默认空字符串
      budget: task.budget || 0, // 默认值 0
      assigneeId: task.assignee_id || 0, // 默认空字符串
      processGroupId: task.process_group_id || 0, // 默认空字符串
      taskDependency: task.task_dependency || [], // 默认空数组
      projectGroup: task.projectGroup || 0, // 默认值 0
      taskDependencyString: (Array.isArray(task.task_dependency) ? task.task_dependency : []).join(', ') // 依赖任务字符串
    };
      } else {
         this.dialogTitle = "添加任务";
        // 如果是添加任务，重置表单
        this.newTask = {
          taskName: "",
          taskDescription: "",
          taskPriority: 1,
          taskStatus: 0,
          taskStartDate: "",
          taskEndDate: "",
          budget: 0,
          assigneeId: 0,
          processGroupId: 0,
          taskDependency: [],
          taskId: null, // 新任务没有ID
        };
      }
      this.dialogVisible = true;
    },

    // 提交表单
    async submitTask() {
      try {
        // 调用后端接口创建任务
       
        //const response = await Createtask(this.newTask);
         let response;
         let updatatask = {};
        if (this.newTask.taskId) {
          // 如果有 taskId，则调用更新任务接口
         
         updatatask={
            task_name: this.newTask.taskName || "", // 如果 taskName 为空，则设为 null
            task_description:this.newTask.taskDescription || null, // 如果 taskDescription 为空，则设为 null
            task_priority:this.newTask.taskPriority || 0, // 默认值 0
            task_status: this.newTask.taskStatus || 0, // 默认值 0
            task_start_date: this.newTask.taskStartDate ||"", // 如果 taskStartDate 为空，则设为 null
            task_end_date:this.newTask.taskEndDate || "", // 如果 taskEndDate 为空，则设为 null
            assignee_id: this.newTask.assigneeId || 0, // 默认值 0
            process_group_id: this.newTask.processGroupId || 0, // 默认值 0
            budget: this.newTask.budget || 1.0, // 默认值 1.0
            file_id: this.newTask.file_id || 0, // 默认值 0
            projectGroup: this.newTask.projectGroup || 0, // 默认值 0
            task_id: this.newTask.taskId || 0, // 默认值 0
            taskDependency: this.newTask.taskDependency||[]
  }
  //console.log('taskDependency',updatatask.taskDependency)
  // console.log('updatatask:',updatatask)
          response = await UpdateTask(updatatask);
        } else {
          // 否则调用创建任务接口
          response = await Createtask(this.newTask);
        }
        if (response.code === 0) {
          this.$message.success("任务创建成功！");
          this.dialogVisible = false;
          this.fetchProjectData(); // 刷新任务数据
        } else {
          this.$message.error(`任务创建失败：${response.message}`);
        }
      } catch (error) {
        console.error("Task creation failed:", error);
        this.$message.error("任务创建失败，请检查网络或稍后重试。");
      }
    },
  },
};
</script>

<style scoped>
.project-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.task-card {
  width: 100%;
  max-width: 600px;
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.task-field:nth-child(odd) {
  background-color: #f5f5f5;
}

.task-field:nth-child(even) {
  background-color: #e0e0e0;
}
.task-card h3 {
  margin-top: 0;
  color: #333;
}

.task-details {
  display: flex;
  flex-direction: column;
}

.task-field {
  margin: 10px 0;
  font-size: 14px;
  color: #555;
}

.task-field strong {
  font-weight: bold;
}
</style>
