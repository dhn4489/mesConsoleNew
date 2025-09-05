<template>
  <div class="warehouse-group-manage">
    <el-row>
      <el-col :span="24">
        <el-card>
          <!-- 操作按钮 -->
          <div class="header">
            <el-button type="primary" @click="showAddDialog">添加物流组</el-button>
          </div>

          <!-- 物流组表格 -->
          <el-table :data="logisticsteamList" border stripe>
            <el-table-column label="物流组名称" prop="logisticsteam_name" width="180"></el-table-column>
            <el-table-column label="物流组类型" prop="logisticsteam_type" width="150">
              <template slot-scope="scope">
                <span>{{ getLogisticsteamTypeLabel(scope.row.logisticsteam_type) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="logisticsteam_desc" width="250"></el-table-column>
            <el-table-column label="操作" width="180">
              <template v-slot="scope">
                <el-button size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteLogisticsteam(scope.row.logisticsteam_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加物流组对话框 -->
    <el-dialog title="添加物流组" :visible.sync="addDialogVisible" @close="resetAddForm">
      <el-form :model="addForm" ref="addForm" label-width="120px">
        <el-form-item label="物流组名称" prop="logisticsteam_name" :rules="[{ required: true, message: '请输入物流组名称', trigger: 'blur' }]">
          <el-input v-model="addForm.logisticsteam_name"></el-input>
        </el-form-item>
        <el-form-item label="物流组类型" prop="logisticsteam_type" :rules="[{ required: true, message: '请选择物流组类型', trigger: 'change' }]">
          <el-select v-model="addForm.logisticsteam_type" placeholder="请选择物流组类型">
            <el-option label="采购组" :value="2"></el-option>
            <el-option label="运输组" :value="3"></el-option>
            <el-option label="仓库组" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="logisticsteam_desc">
          <el-input type="textarea" v-model="addForm.logisticsteam_desc" autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLogisticsteam">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑物流组对话框 -->
    <el-dialog title="编辑物流组" :visible.sync="editDialogVisible" @close="resetEditForm">
      <el-form :model="editForm" ref="editForm" label-width="120px">
        <el-form-item label="物流组名称" prop="logisticsteam_name" :rules="[{ required: true, message: '请输入物流组名称', trigger: 'blur' }]">
          <el-input v-model="editForm.logisticsteam_name"></el-input>
        </el-form-item>
        <el-form-item label="物流组类型" prop="logisticsteam_type" :rules="[{ required: true, message: '请选择物流组类型', trigger: 'change' }]">
          <el-select v-model="editForm.logisticsteam_type" placeholder="请选择物流组类型" disabled>
            <el-option label="核心组" :value="1"></el-option>
            <el-option label="采购组" :value="2"></el-option>
            <el-option label="运输组" :value="3"></el-option>
            <el-option label="仓库组" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="logisticsteam_desc">
          <el-input type="textarea" v-model="editForm.logisticsteam_desc" autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateLogisticsteam">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllLogisticsteam, insertLogisticsteam, updateLogisticsteam, deleteLogisticsteam } from '@/api/warehouse';

export default {
  data() {
    return {
      logisticsteamList: [], // 物流组列表
      addDialogVisible: false, // 添加对话框显示状态
      editDialogVisible: false, // 编辑对话框显示状态
      addForm: { // 添加表单数据
        logisticsteam_name: '',
        logisticsteam_type: 2, // 默认选择采购组
        logisticsteam_desc: ''
      },
      editForm: { // 编辑表单数据
        logisticsteam_id: null,
        logisticsteam_name: '',
        logisticsteam_type: 1,  // 默认值为核心组
        logisticsteam_desc: ''
      }
    };
  },
  methods: {
    // 获取所有物流组
    fetchLogisticsteamList() {
      getAllLogisticsteam().then(response => {
        if (response.code === 0) {
          this.logisticsteamList = response.data;
        } else {
          this.$message.error('获取物流组列表失败');
        }
      });
    },

    // 显示添加对话框
    showAddDialog() {
      this.addDialogVisible = true;
    },

    // 提交添加物流组
    addLogisticsteam() {
      insertLogisticsteam(this.addForm).then(response => {
        if (response.code === 0) {
          this.$message.success('添加成功');
          this.fetchLogisticsteamList(); // 刷新物流组列表
          this.addDialogVisible = false;
        } else {
          this.$message.error('添加失败');
        }
      });
    },

    // 显示编辑对话框
    showEditDialog(logisticsteam) {
      this.editForm = { ...logisticsteam };
      this.editDialogVisible = true;
    },

    // 提交编辑物流组
    updateLogisticsteam() {
      updateLogisticsteam(this.editForm).then(response => {
        if (response.code === 0) {
          this.$message.success('更新成功');
          this.fetchLogisticsteamList(); // 刷新物流组列表
          this.editDialogVisible = false;
        } else {
          this.$message.error('更新失败');
        }
      });
    },

    // 删除物流组
    deleteLogisticsteam(id) {
      this.$confirm('确定要删除这个物流组吗？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLogisticsteam(id).then(response => {
          if (response.code === 0) {
            this.$message.success('删除成功');
            this.fetchLogisticsteamList(); // 刷新物流组列表
          } else {
            this.$message.error('删除失败');
          }
        });
      }).catch(() => {});
    },

    // 获取物流组类型的文字描述
    getLogisticsteamTypeLabel(type) {
      const types = {
        1: '核心组',
        2: '采购组',
        3: '运输组',
        4: '仓库组'
      };
      return types[type] || '未知类型';
    },

    // 重置添加表单
    resetAddForm() {
      this.addForm = {
        logisticsteam_name: '',
        logisticsteam_type: 2, // 默认值为采购组
        logisticsteam_desc: ''
      };
    },

    // 重置编辑表单
    resetEditForm() {
      this.editForm = {
        logisticsteam_id: null,
        logisticsteam_name: '',
        logisticsteam_type: 1, // 默认值为核心组
        logisticsteam_desc: ''
      };
    }
  },

  created() {
    this.fetchLogisticsteamList(); // 页面加载时获取物流组列表
  }
};
</script>

<style scoped>
.warehouse-group-manage {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
