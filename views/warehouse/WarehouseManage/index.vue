<template>
  <div class="warehouse-manage">
    <!-- 新建仓库 Modal -->
    <el-dialog
      title="新建仓库"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="仓库名称" prop="storehouse_name">
          <el-input v-model="form.storehouse_name" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="仓库地址" prop="storehouse_address">
          <el-input v-model="form.storehouse_address" placeholder="请输入仓库地址" />
        </el-form-item>
        <el-form-item label="仓库容量" prop="storehouse_capacity">
          <el-input-number
            v-model="form.storehouse_capacity"
            :min="1"
            label="仓库容量"
            placeholder="请输入仓库容量"
          />
        </el-form-item>
        <el-form-item label="仓库类型" prop="storehouse_type">
          <el-input v-model="form.storehouse_type" placeholder="请输入仓库类型" />
        </el-form-item>
        <el-form-item label="仓库描述" prop="storehouse_desc">
          <el-input
            type="textarea"
            v-model="form.storehouse_desc"
            placeholder="请输入仓库描述"
          />
        </el-form-item>
        <el-form-item label="仓库状态" prop="storehouse_status">
          <el-radio-group v-model="form.storehouse_status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">维护</el-radio>
            <el-radio :label="3">弃用</el-radio>
            <el-radio :label="4">问题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="仓库组" prop="storehouse_groupid">
          <el-select v-model="form.storehouse_groupid" placeholder="请选择仓库组">
            <el-option
              v-for="group in logisticsteams"
              :key="group.logisticsteam_id"
              :label="group.logisticsteam_name"
              :value="group.logisticsteam_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 仓库列表 -->
    <el-table :data="storehouses" border>
      <el-table-column prop="storehouse_id" label="ID" width="80" />
      <el-table-column prop="storehouse_name" label="仓库名称" />
      <el-table-column prop="storehouse_address" label="仓库地址" />
      <el-table-column prop="storehouse_capacity" label="仓库容量" />
      <el-table-column prop="storehouse_type" label="仓库类型" />
      <el-table-column prop="storehouse_status" label="仓库状态">
        <template #default="scope">
          <span>{{ mapStatus(scope.row.storehouse_status) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="storehouse_groupid" label="仓库组">
        <template #default="scope">
          <!-- 显示仓库组名称而非ID -->
          <span>{{ getLogisticsteamName(scope.row.storehouse_groupid) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="storehouse_desc" label="仓库描述" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            size="mini"
            @click="editStoreHouse(scope.row)"
            type="warning"
            >编辑</el-button
          >
          <el-button
            size="mini"
            @click="deleteStoreHouse(scope.row.storehouse_id)"
            type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="showDialog">新建仓库</el-button>
  </div>
</template>

<script>
import { insertStoreHouse, updateStoreHouse, getAllStorehouses, deleteStoreHouse, getAllLogisticsteam } from '@/api/warehouse';

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        storehouse_id: null,
        storehouse_name: '',
        storehouse_address: '',
        storehouse_capacity: 0,
        storehouse_type: '',
        storehouse_desc: '',
        storehouse_status: 1,
        storehouse_groupid: null, // 初始为空，等待用户选择
      },
      storehouses: [],
      logisticsteams: [], // 仓库组列表
      rules: {
        storehouse_name: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
        storehouse_address: [{ required: true, message: '仓库地址不能为空', trigger: 'blur' }],
        storehouse_capacity: [{ required: true, message: '仓库容量不能为空', trigger: 'blur' }],
        storehouse_type: [{ required: true, message: '仓库类型不能为空', trigger: 'blur' }],
        storehouse_desc: [{ required: true, message: '仓库描述不能为空', trigger: 'blur' }],
        storehouse_groupid: [{ required: true, message: '请选择仓库组', trigger: 'change' }],
      }
    };
  },
  methods: {
    // 映射仓库状态
    mapStatus(status) {
      const statusMap = {
        1: '正常',
        2: '维护',
        3: '弃用',
        4: '问题'
      };
      return statusMap[status] || '未知';
    },

    // 获取仓库组名称
    getLogisticsteamName(groupId) {
      const group = this.logisticsteams.find(item => item.logisticsteam_id === groupId);
      return group ? group.logisticsteam_name : '未知组';
    },

    // 获取仓库列表
    async fetchStorehouses() {
      try {
        const res = await getAllStorehouses();
        if (res.code === 0) {
          this.storehouses = res.data;
        }
      } catch (error) {
        console.error('获取仓库列表失败', error);
      }
    },

    // 获取仓库组列表
    async fetchLogisticsteams() {
      try {
        const res = await getAllLogisticsteam();
        if (res.code === 0) {
          // 只选择类型为4的仓库组（即仓库组）
          this.logisticsteams = res.data.filter(group => group.logisticsteam_type === 4);
        }
      } catch (error) {
        console.error('获取仓库组列表失败', error);
      }
    },

    // 显示新建仓库的对话框
    showDialog() {
      this.form = {
        storehouse_id: null,
        storehouse_name: '',
        storehouse_address: '',
        storehouse_capacity: 0,
        storehouse_type: '',
        storehouse_desc: '',
        storehouse_status: 1,
        storehouse_groupid: null
      };
      this.dialogVisible = true;
    },

    // 提交表单
    async submitForm() {
      try {
        await this.$refs.formRef.validate();
        const data = { ...this.form };
        if (this.form.storehouse_id) {
          // 编辑仓库
          await updateStoreHouse(data);
        } else {
          // 新建仓库
          await insertStoreHouse(data);
        }
        this.dialogVisible = false;
        this.fetchStorehouses();
      } catch (error) {
        console.error('表单提交失败', error);
      }
    },

    // 编辑仓库
    editStoreHouse(row) {
      this.form = { ...row };
      this.dialogVisible = true;
    },

    // 删除仓库
    async deleteStoreHouse(storehouseId) {
      try {
        const res = await deleteStoreHouse(storehouseId);
        if (res.code === 0) {
          this.fetchStorehouses();
        }
      } catch (error) {
        console.error('删除仓库失败', error);
      }
    },

    // 重置表单
    resetForm() {
      this.$refs.formRef.resetFields();
    }
  },

  mounted() {
    this.fetchStorehouses();
    this.fetchLogisticsteams(); // 获取仓库组列表
  }
};
</script>

<style scoped>
.warehouse-manage {
  padding: 20px;
}
.dialog-footer {
  text-align: right;
}
</style>
