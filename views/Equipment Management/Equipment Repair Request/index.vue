<template>
  <div>
    <!-- 页面头部: 设备维修信息 + 创建任务按钮 -->
    <div class="header">
      <h1>设备维修信息</h1>
      <el-button @click="showCreateModal" type="primary" size="small" class="add-button">创建任务</el-button>
    </div>

    <!-- 维修任务列表 -->
    <div class="maintenance-container">
      <div v-for="task in maintenanceTasks" :key="task.id" class="maintenance-card">
        <div class="maintenance-details">
          <div><strong>任务 ID:</strong> {{ task.id }}</div>
          <div><strong>设备名称:</strong> {{ task.equipment_name }}</div>
          <div><strong>状态:</strong> {{ translateStatus(task.status) }}</div>
          <div><strong>描述:</strong> {{ task.description || '无' }}</div>
          <div><strong>维修工人:</strong> {{ task.worker_name }}</div>
          <div><strong>开始时间:</strong> {{ task.start_time }}</div>
          <div><strong>结束时间:</strong> {{ task.end_time || '未完成' }}</div>
        </div>

        <!-- 操作按钮 -->
        <div class="maintenance-actions">
          <el-button @click="showEditModal(task)" type="primary" size="small">更改</el-button>
          <el-button @click="showDeleteModal(task.id)" type="danger" size="small">删除</el-button>
        </div>
      </div>
    </div>

    <p v-if="!maintenanceTasks.length">加载维修任务数据中...</p>

    <!-- 创建维修任务弹窗 -->
    <el-dialog :visible.sync="showCreateModalFlag" title="创建维修任务">
      <el-form :model="newMaintenanceTask">
        <el-form-item label="设备">
          <el-select v-model="newMaintenanceTask.equipment_id">
            <el-option v-for="equipment in equipmentList" :key="equipment.equipment_id" :label="equipment.equipment_name" :value="equipment.equipment_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="newMaintenanceTask.status">
            <el-option label="未开始" value="1"></el-option>
            <el-option label="进行中" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newMaintenanceTask.description"></el-input>
        </el-form-item>
        <el-form-item label="维修工人">
          <el-input v-model="newMaintenanceTask.worker_name" placeholder="请输入维修工人姓名"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="newMaintenanceTask.start_time" type="date" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('create')">取消</el-button>
        <el-button @click="submitCreateMaintenance" type="primary">提交</el-button>
      </span>
    </el-dialog>

    <!-- 编辑维修任务弹窗 -->
    <el-dialog :visible.sync="showEditModalFlag" title="编辑维修任务">
      <el-form :model="editMaintenanceTask">
        <el-form-item label="设备">
          <el-select v-model="editMaintenanceTask.equipment_id">
            <el-option v-for="equipment in equipmentList" :key="equipment.equipment_id" :label="equipment.equipment_name" :value="equipment.equipment_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editMaintenanceTask.status">
            <el-option label="未开始" value=1></el-option>
            <el-option label="进行中" value=2></el-option>
            <el-option label="已完成" value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editMaintenanceTask.description"></el-input>
        </el-form-item>
        <el-form-item label="维修工人">
          <el-input v-model="editMaintenanceTask.worker_name" placeholder="请输入维修工人姓名"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="editMaintenanceTask.start_time" type="date" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="editMaintenanceTask.end_time" type="date" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('edit')">取消</el-button>
        <el-button @click="submitEditMaintenance" type="primary">提交</el-button>
      </span>
    </el-dialog>


    <!-- 删除确认弹窗 -->
    <el-dialog :visible.sync="showDeleteModalFlag" title="删除维修任务">
      <p>确定要删除该维修任务吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('delete')">取消</el-button>
        <el-button @click="submitDeleteMaintenance" type="danger">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEquipmentByProcessGroupId, getMaintenanceByProcessGroupId, addMaintenance, updateMaintenance, deleteMaintenance } from "@/api/equipment";
import { getPersonnelManagement } from "@/api/member";

export default {
  data() {
    return {
      maintenanceTasks: [], // 维修任务列表
      equipmentList: [], // 设备列表
      showCreateModalFlag: false, // 显示创建维修任务弹窗
      showEditModalFlag: false, // 显示编辑维修任务弹窗
      showDeleteModalFlag: false, // 显示删除确认弹窗
      newMaintenanceTask: {
        equipment_id: null,
        status: 1, // 默认状态为“未开始”
        description: "",
        worker_name: "", // 直接输入工人姓名
        start_time: null,
      },
     editMaintenanceTask: { // 编辑任务数据
      id: null,
      equipment_id: null,
      status: null,
      description: "",
      worker_id: null,
      processGroup_id: null,
      start_time: null,
      end_time: null,
    },
      taskToDelete: null, // 需要删除的任务 ID
    };
  },
  created() {
    this.fetchMaintenanceData();
    this.fetchEquipmentData();
    this.fetchPersonnelData();
  },
  methods: {
    // 获取维修任务数据
    async fetchMaintenanceData() {
      try {
        const response = await getMaintenanceByProcessGroupId();
        if (response.code === 0) {
          this.maintenanceTasks = response.data;
        }
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
      }
    },

    // 获取设备数据
    async fetchEquipmentData() {
      try {
        const response = await getEquipmentByProcessGroupId();
        if (response.code === 0) {
          this.equipmentList = response.data;
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    },

    // 显示创建任务弹窗
    showCreateModal() {
      this.showCreateModalFlag = true;
    },

    showEditModal(task) {
      // 复制任务信息并确保字段正确，特别是 worker_id 和 processGroup_id
      this.editMaintenanceTask = {
        id: task.id, // 保持任务 ID 不变
        equipment_id: task.equipment_id, // 设备 ID
        status: task.status, // 任务状态
        description: task.description || "", // 任务描述
        worker_id: task.worker_id || null, // 维修工人 ID
    //    worker_name: task.worker_name || "", // 维修工人姓名 (为了编辑时输入工人姓名)
        processGroup_id: task.processGroup_id || null, // 过程组 ID
        start_time: task.start_time || "", // 开始时间
        end_time: task.end_time || "", // 结束时间
      };

      // 显示编辑弹窗
      this.showEditModalFlag = true;
    },


    // 显示删除确认弹窗
    showDeleteModal(taskId) {
      this.taskToDelete = taskId;
      this.showDeleteModalFlag = true;
    },

    // 关闭弹窗
    closeModal(modalType) {
      if (modalType === "create") this.showCreateModalFlag = false;
      if (modalType === "edit") this.showEditModalFlag = false;
      if (modalType === "delete") this.showDeleteModalFlag = false;
    },

    // 提交创建任务
    async submitCreateMaintenance() {
      try {
        const response = await addMaintenance(this.newMaintenanceTask);
        if (response.code === 0) {
          this.fetchMaintenanceData();
          this.closeModal("create");
        } else {
          console.error("Error creating maintenance task:", response.message);
        }
      } catch (error) {
        console.error("Error creating maintenance task:", error);
      }
    },

    // 提交编辑任务
    async submitEditMaintenance() {
      try {
        console.log('this.editMaintenanceTask',this.editMaintenanceTask)
        const response = await updateMaintenance(this.editMaintenanceTask);
        if (response.code === 0) {
          this.fetchMaintenanceData();
          this.closeModal("edit");
        } else {
          console.error("Error editing maintenance task:", response.message);
        }
      } catch (error) {
        console.error("Error editing maintenance task:", error);
      }
    },

    // 提交删除任务
    async submitDeleteMaintenance() {
      try {
        const response = await deleteMaintenance(this.taskToDelete);
        if (response.code === 0) {
          this.fetchMaintenanceData();
          this.closeModal("delete");
        } else {
          console.error("Error deleting maintenance task:", response.message);
        }
      } catch (error) {
        console.error("Error deleting maintenance task:", error);
      }
    },

    // 状态翻译
    translateStatus(status) {
      switch (status) {
        case 1: return "未开始";
        case 2: return "进行中";
        case 3: return "已完成";
        default: return "未知";
      }
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-button {
  margin-left: 20px;
}

.maintenance-container {
  margin-top: 20px;
}

.maintenance-card {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}

.maintenance-details {
  flex: 1;
}

.maintenance-actions {
  display: flex;
  flex-direction: column;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
