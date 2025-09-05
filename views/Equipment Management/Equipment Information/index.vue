<template>
  <div>
    <!-- Project Title and Add Equipment Button -->
    <div class="header">
      <h1>设备管理</h1>
      <el-button @click="showAddModal" type="primary" size="small" class="add-button">添加设备</el-button>
    </div>

    <!-- Equipment List -->
    <div class="equipment-container">
      <div v-for="equipment in tableData" :key="equipment.equipment_id" class="equipment-card">
        <h3>{{ equipment.equipment_name || '未提供设备名称' }}</h3>
        <div class="equipment-details">
          <div class="equipment-field">
            <strong>设备 ID:</strong> <span>{{ equipment.equipment_id || 'N/A'  }}</span>
          </div>
          <div class="equipment-field">
            <strong>设备分类:</strong> <span>{{ equipment.equipment_category || 'N/A' }}</span>
          </div>
          <div class="equipment-field">
            <strong>设备型号:</strong> <span>{{ equipment.equipment_model || 'N/A' }}</span>
          </div>
          <div class="equipment-field">
            <strong>设备状态:</strong> <span>{{ translateStatus(equipment.equipment_status) }}</span>
          </div>
          <div class="equipment-field">
            <strong>工艺组 ID:</strong> <span>{{ equipment.equipment_craftteamid || 'N/A'  }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="equipment-actions">
          <el-button @click="showEditModal(equipment)" type="primary" size="small">更改</el-button>
          <el-button @click="showDeleteModal(equipment.equipment_id)" type="danger" size="small">删除</el-button>
        </div>
      </div>
    </div>

    <p v-if="!tableData.length">Loading equipment data...</p>

    <!-- Add Equipment Modal -->
    <el-dialog :visible.sync="showAddModalFlag" title="添加设备">
      <el-form :model="newEquipment">
        <el-form-item label="设备名称">
          <el-input v-model="newEquipment.equipment_name"></el-input>
        </el-form-item>
        <el-form-item label="设备分类">
          <el-input v-model="newEquipment.equipment_category"></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="newEquipment.equipment_model"></el-input>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="newEquipment.equipment_status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('add')">取消</el-button>
        <el-button @click="submitAddEquipment" type="primary">提交</el-button>
      </span>
    </el-dialog>

    <!-- Edit Equipment Modal -->
    <el-dialog :visible.sync="showEditModalFlag" title="编辑设备">
      <el-form :model="editEquipment">
        <el-form-item label="设备名称">
          <el-input v-model="editEquipment.equipment_name"></el-input>
        </el-form-item>
        <el-form-item label="设备分类">
          <el-input v-model="editEquipment.equipment_category"></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="editEquipment.equipment_model"></el-input>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="editEquipment.equipment_status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择负责人">
          <el-select v-model="editEquipment.equipment_userid">
            <el-option v-for="member in personnel" :key="member.employeeID" :label="member.name" :value="member.employeeID"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('edit')">取消</el-button>
        <el-button @click="submitEditEquipment" type="primary">提交</el-button>
      </span>
    </el-dialog>

    <!-- Delete Confirmation Modal -->
    <el-dialog :visible.sync="showDeleteModalFlag" title="删除设备">
      <p>确定要删除该设备吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal('delete')">取消</el-button>
        <el-button @click="submitDeleteEquipment(editEquipment)" type="danger">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEquipmentByProcessGroupId, insertEquipment, updateEquipment, deleteEquipment } from "@/api/equipment";
import { getPersonnelManagement } from "@/api/member"; // Fetch personnel info

export default {
  data() {
    return {
      tableData: [], // Equipment data
      showAddModalFlag: false,
      showEditModalFlag: false,
      showDeleteModalFlag: false,
      newEquipment: {
        equipment_name: "",
        equipment_category: "",
        equipment_model: "",
        equipment_status: 1, // Default to "启用"
        equipment_craftteamid: 1 // Default value
      },
       editEquipment: { // 初始化为一个空对象
      equipment_id: '',
      equipment_name: '',
      equipment_category: '',
      equipment_model: '',
      equipment_status: 1, // 默认启用
      equipment_userid: '', // 默认用户 ID
    },
      personnel: [], // Personnel for selection
      equipmentToDelete: null, // Equipment ID to delete
    };
  },
  created() {
    this.fetchEquipmentData();
    this.fetchPersonnelData();
  },
  methods: {
    async fetchEquipmentData() {
      try {
        const response = await getEquipmentByProcessGroupId();
       
        if (response.code === 0) {
          this.tableData = response.data;
          console.log('response', response.data[0].equipment_name)
        } 
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    },

    async fetchPersonnelData() {
      try {
        const response = await getPersonnelManagement();
        if (response.code === 0) {
          this.personnel = response.data;
        }
      } catch (error) {
        console.error("Error fetching personnel data:", error);
      }
    },

    // Show modal to add equipment
    showAddModal() {
      this.showAddModalFlag = true;
    },

    // Show modal to edit equipment
    showEditModal(equipment) {
      console.log('equipment',equipment)
     this.editEquipment = {
    equipment_id: equipment.equipment_id || '',
    equipment_name: equipment.equipment_name || '',
    equipment_category: equipment.equipment_category || '',
    equipment_model: equipment.equipment_model || '',
    equipment_status: equipment.equipment_status || 1, // 默认启用
    equipment_userid: equipment.equipment_userid || '', // 默认空负责人
  };
  this.showEditModalFlag = true;
    },

    // Show modal to delete equipment
    showDeleteModal(equipmentId) {
      this.equipmentToDelete = equipmentId;
      this.showDeleteModalFlag = true;
    },

    // Close modal
    closeModal(modalType) {
      if (modalType === "add") this.showAddModalFlag = false;
      if (modalType === "edit") this.showEditModalFlag = false;
      if (modalType === "delete") this.showDeleteModalFlag = false;
    },

    // Submit the new equipment data
    async submitAddEquipment() {
      try {
        const response = await insertEquipment(this.newEquipment);
        if (response.code === 0) {
          this.fetchEquipmentData(); // Refresh the equipment list
          this.closeModal("add");
        }
      } catch (error) {
        console.error("Error submitting new equipment:", error);
      }
    },

    // Submit the edited equipment data
    async submitEditEquipment() {
      try {console.log('this.editEquipment',this.editEquipment)
        const response = await updateEquipment(this.editEquipment);
        if (response.code === 0) {
          this.fetchEquipmentData(); // Refresh the equipment list
          this.closeModal("edit");
        }
      } catch (error) {
        console.error("Error submitting edited equipment:", error);
      }
    },

    // Delete the equipment
    async submitDeleteEquipment(editEquipment) {
      try {
        const response = await deleteEquipment(this.equipmentToDelete,editEquipment.equipment_id);
        if (response.code === 0) {
          this.fetchEquipmentData(); // Refresh the equipment list
          this.closeModal("delete");
        }
      } catch (error) {
        console.error("Error deleting equipment:", error);
      }
    },

    // Translate equipment status codes to readable strings
    translateStatus(statusCode) {
      const statuses = {
        0: "禁用",
        1: "启用"
      };
      return statuses[statusCode] || "未知";
    }
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

.add-button {
  margin-right: 10px;
}

.equipment-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.equipment-card {
  border: 1px solid #ddd;
  padding: 15px;
  width: 250px;
  border-radius: 5px;
}

.equipment-details {
  margin-bottom: 10px;
}

.equipment-field {
  margin-bottom: 8px;
}

.equipment-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.dialog-footer {
  text-align: right;
}
</style>
